import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createServiceClient } from "@/lib/supabase/server"
import { checkRateLimit } from "@/lib/ratelimit"
import { sendContactNotification } from "@/lib/email"
import { notifyLeadViaWhatsApp } from "@/lib/lead-notifications"
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
    const { data: inserted, error } = await supabase
      .from("contacts")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      })
      .select("id")
      .single()

    if (error) {
      console.error("[Contact] Supabase insert failed:", error.message, error)
      throw error
    }

    console.info("[Contact] Supabase insert successful", { id: inserted.id })

    sendContactNotification({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
    }).catch((e) =>
      console.error("[Contact] Email send failed:", e instanceof Error ? e.message : "Unknown error")
    )

    const whatsappStatus = await notifyLeadViaWhatsApp(supabase, "contacts", inserted.id, {
      name: data.name,
      phone: data.phone,
      email: data.email,
      service: "Contact Form",
      message: data.message,
      source: "Website Contact Form",
    })

    console.info("[Contact] WhatsApp notification finished", {
      id: inserted.id,
      status: whatsappStatus,
    })

    return NextResponse.json({ success: true }, { headers: CORS_HEADERS })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400, headers: CORS_HEADERS })
    }
    console.error(
      "[Contact] Form error:",
      err instanceof Error
        ? err.message
        : typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "Unknown error"
    )
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: CORS_HEADERS })
  }
}
