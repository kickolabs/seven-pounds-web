import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getRazorpay } from "@/lib/razorpay"
import { createServiceClient } from "@/lib/supabase/server"
import { CONSULTATION_FEE_PAISE } from "@/lib/constants"
import { env } from "@/lib/env"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": env.siteUrl,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  message: z.string().optional(),
  plan_selected: z.string().optional(),
})

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    // 1. Create Razorpay order (critical — must succeed)
    const razorpay = getRazorpay()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let order: any
    try {
      order = await razorpay.orders.create({
        amount: CONSULTATION_FEE_PAISE,
        currency: "INR",
        receipt: `consult_${Date.now()}`,
      })
    } catch (rzpErr) {
      console.error("Razorpay order creation failed:", rzpErr)
      return NextResponse.json(
        { error: "Payment gateway error. Please try again." },
        { status: 502, headers: CORS_HEADERS }
      )
    }

    // 2. Save to Supabase (non-critical — log failure but don't block payment)
    try {
      const supabase = await createServiceClient()
      const { error } = await supabase.from("consultations").insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message ?? null,
        plan_selected: data.plan_selected ?? null,
        amount_paise: CONSULTATION_FEE_PAISE,
        payment_status: "pending",
        razorpay_order_id: order.id,
      })
      if (error) console.error("Supabase insert failed (non-fatal):", error.message)
    } catch (dbErr) {
      console.error("Supabase unavailable (non-fatal):", dbErr)
    }

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
    console.error("Create order error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: CORS_HEADERS })
  }
}
