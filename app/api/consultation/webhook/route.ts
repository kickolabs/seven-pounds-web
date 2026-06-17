import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { createServiceClient } from "@/lib/supabase/server"
import { sendBookingNotification } from "@/lib/email"
import { notifyLeadViaWhatsApp } from "@/lib/lead-notifications"
import { env } from "@/lib/env"

export async function POST(req: NextRequest) {
  // Verify webhook signature if secret is configured
  if (env.razorpayWebhookSecret) {
    const rawBody = await req.text()
    const signature = req.headers.get("x-razorpay-signature") ?? ""
    const expected = crypto
      .createHmac("sha256", env.razorpayWebhookSecret)
      .update(rawBody)
      .digest("hex")

    if (expected !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    try {
      await handleEvent(JSON.parse(rawBody))
    } catch {
      return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
    }
  } else {
    // No secret configured — process but log a warning
    console.warn("RAZORPAY_WEBHOOK_SECRET not set — webhook signature not verified")
    try {
      const body = await req.json()
      await handleEvent(body)
    } catch {
      return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}

async function handleEvent(event: {
  event: string
  payload?: {
    payment?: { entity?: Record<string, unknown> }
    order?: { entity?: Record<string, unknown> }
  }
}) {
  const supabase = await createServiceClient()

  if (event.event === "payment.captured") {
    const payment = event.payload?.payment?.entity ?? {}
    const orderId = payment["order_id"] as string | undefined
    const paymentId = payment["id"] as string | undefined

    if (!orderId || !paymentId) return

    const { data: existing } = await supabase
      .from("consultations")
      .select("id, payment_status")
      .eq("razorpay_order_id", orderId)
      .maybeSingle()

    if (!existing || existing.payment_status === "paid") return

    const { data: updated } = await supabase
      .from("consultations")
      .update({ payment_status: "paid", razorpay_payment_id: paymentId })
      .eq("razorpay_order_id", orderId)
      .select("id, name, email, phone, plan_selected, message")
      .single()

    if (updated) {
      console.info("[Consultation Webhook] Supabase payment update successful", { id: updated.id })

      sendBookingNotification({
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        plan: updated.plan_selected,
        bookingId: updated.id,
      }).catch((e) => console.error("[Consultation Webhook] Email failed:", e instanceof Error ? e.message : "Unknown error"))

      const whatsappStatus = await notifyLeadViaWhatsApp(supabase, "consultations", updated.id, {
        name: updated.name,
        phone: updated.phone,
        email: updated.email,
        service: updated.plan_selected ?? "Consultation Booking",
        message: updated.message ?? "Consultation payment completed.",
        source: "Website Consultation Form",
      })

      console.info("[Consultation Webhook] WhatsApp notification finished", {
        id: updated.id,
        status: whatsappStatus,
      })
    }
  }

  if (event.event === "payment.failed") {
    const payment = event.payload?.payment?.entity ?? {}
    const orderId = payment["order_id"] as string | undefined
    if (!orderId) return

    await supabase
      .from("consultations")
      .update({ payment_status: "failed" })
      .eq("razorpay_order_id", orderId)
      .neq("payment_status", "paid")
  }
}
