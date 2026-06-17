import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import crypto from "crypto"
import { createServiceClient } from "@/lib/supabase/server"
import { checkRateLimit } from "@/lib/ratelimit"
import { sendBookingNotification } from "@/lib/email"
import { notifyLeadViaWhatsApp } from "@/lib/lead-notifications"
import { env } from "@/lib/env"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": env.siteUrl,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

const schema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
})

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous"
  const { allowed } = await checkRateLimit(`verify-payment:${ip}`)
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: CORS_HEADERS }
    )
  }

  try {
    const body = await req.json()
    const data = schema.parse(body)

    const expectedSignature = crypto
      .createHmac("sha256", env.razorpayKeySecret)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex")

    if (expectedSignature !== data.razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400, headers: CORS_HEADERS })
    }

    const supabase = await createServiceClient()

    const { data: existing } = await supabase
      .from("consultations")
      .select("id, name, email, phone, plan_selected, message, payment_status")
      .eq("razorpay_payment_id", data.razorpay_payment_id)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ success: true, bookingId: existing.id }, { headers: CORS_HEADERS })
    }

    const { data: updated, error } = await supabase
      .from("consultations")
      .update({
        payment_status: "paid",
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
      })
      .eq("razorpay_order_id", data.razorpay_order_id)
      .select("id, name, email, phone, plan_selected, message")
      .single()

    if (error) throw error

    console.info("[Consultation] Supabase payment update successful", { id: updated.id })

    sendBookingNotification({
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      plan: updated.plan_selected,
      bookingId: updated.id,
    }).catch((e) =>
      console.error("[Consultation] Email send failed:", e instanceof Error ? e.message : "Unknown error")
    )

    const whatsappStatus = await notifyLeadViaWhatsApp(supabase, "consultations", updated.id, {
      name: updated.name,
      phone: updated.phone,
      email: updated.email,
      service: updated.plan_selected ?? "Consultation Booking",
      message: updated.message ?? "Consultation payment completed.",
      source: "Website Consultation Form",
    })

    console.info("[Consultation] WhatsApp notification finished", {
      id: updated.id,
      status: whatsappStatus,
    })

    return NextResponse.json({ success: true, bookingId: updated.id }, { headers: CORS_HEADERS })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400, headers: CORS_HEADERS })
    }
    console.error("Verify payment error:", err instanceof Error ? err.message : "Unknown error")
    return NextResponse.json({ error: "Payment verification failed. Please try again." }, { status: 500, headers: CORS_HEADERS })
  }
}
