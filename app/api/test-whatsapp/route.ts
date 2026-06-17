import { NextRequest, NextResponse } from "next/server"
import { getWhatsAppConfig, logWhatsAppConfig, sendTestWhatsAppNotification } from "@/lib/whatsapp"

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.WHATSAPP_TEST_SECRET?.trim()
  if (!secret) {
    return process.env.NODE_ENV !== "production"
  }

  const provided =
    req.nextUrl.searchParams.get("secret") ??
    req.headers.get("x-whatsapp-test-secret") ??
    ""

  return provided === secret
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Unauthorized. Set WHATSAPP_TEST_SECRET and pass ?secret=... in production.",
      },
      { status: 401 }
    )
  }

  logWhatsAppConfig("test-endpoint")
  const config = getWhatsAppConfig()

  const result = await sendTestWhatsAppNotification()

  if (result.status === "sent") {
    return NextResponse.json({
      success: true,
      adminRecipient: config.adminNumber,
      httpStatus: result.httpStatus,
      response: result.responseBody,
    })
  }

  return NextResponse.json(
    {
      success: false,
      error: result.error ?? "WhatsApp notification failed",
      configured: config.isConfigured,
      adminRecipient: config.adminNumber,
      httpStatus: result.httpStatus,
      response: result.responseBody,
    },
    { status: result.httpStatus && result.httpStatus < 500 ? result.httpStatus : 502 }
  )
}
