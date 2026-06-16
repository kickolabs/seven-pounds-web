import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getRazorpay } from "@/lib/razorpay"
import { createServiceClient } from "@/lib/supabase/server"
import { CONSULTATION_FEE_PAISE } from "@/lib/constants"
import { checkRateLimit } from "@/lib/ratelimit"
import { env } from "@/lib/env"
import { consultationFormSchema } from "@/lib/validation"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": env.siteUrl,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

const schema = consultationFormSchema

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous"
  const { allowed } = await checkRateLimit(`create-order:${ip}`)
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: CORS_HEADERS }
    )
  }

  try {
    const body = await req.json()
    const data = schema.parse(body)

    const supabase = await createServiceClient()

    // 1. Pre-insert DB row so every Razorpay order has a corresponding record
    const { data: inserted, error: insertError } = await supabase
      .from("consultations")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message ?? null,
        plan_selected: data.plan_selected ?? null,
        amount_paise: CONSULTATION_FEE_PAISE,
        payment_status: "pending",
      })
      .select("id")
      .single()

    if (insertError) {
      console.error("DB pre-insert failed:", insertError.message)
      return NextResponse.json(
        { error: "Could not initiate booking. Please try again." },
        { status: 500, headers: CORS_HEADERS }
      )
    }

    // 2. Create Razorpay order
    const razorpay = getRazorpay()
    let order: { id: string; amount: number; currency: string }
    try {
      order = await razorpay.orders.create({
        amount: CONSULTATION_FEE_PAISE,
        currency: "INR",
        receipt: `consult_${inserted.id}`,
      }) as { id: string; amount: number; currency: string }
    } catch {
      // Mark row as failed so we have a record of the attempt
      await supabase
        .from("consultations")
        .update({ payment_status: "failed" })
        .eq("id", inserted.id)
      return NextResponse.json(
        { error: "Payment gateway error. Please try again." },
        { status: 502, headers: CORS_HEADERS }
      )
    }

    // 3. Attach Razorpay order ID to the DB row
    await supabase
      .from("consultations")
      .update({ razorpay_order_id: order.id })
      .eq("id", inserted.id)

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: env.razorpayKeyId,
    }, { headers: CORS_HEADERS })

  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400, headers: CORS_HEADERS })
    }
    console.error("Create order error:", err instanceof Error ? err.message : "Unknown error")
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: CORS_HEADERS })
  }
}
