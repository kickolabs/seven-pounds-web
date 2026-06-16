import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createServiceClient } from "@/lib/supabase/server"
import { checkRateLimit } from "@/lib/ratelimit"
import { sendContactNotification } from "@/lib/email"
import { env } from "@/lib/env"
import { contactFormSchema } from "@/lib/validation"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": env.siteUrl,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

const schema = contactFormSchema

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous"
  const { allowed } = await checkRateLimit(`contact:${ip}`)
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
    const { error } = await supabase.from("contacts").insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
    })

    if (error) throw error

    // Fire-and-forget email
    sendContactNotification({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
    }).catch((e) => console.error("Email send failed:", e instanceof Error ? e.message : "Unknown error"))

    return NextResponse.json({ success: true }, { headers: CORS_HEADERS })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400, headers: CORS_HEADERS })
    }
    console.error("Contact form error:", err instanceof Error ? err.message : "Unknown error")
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: CORS_HEADERS })
  }
}
