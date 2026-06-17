export type LeadNotificationData = {
  name: string
  phone: string
  email: string
  service: string
  message: string
  source: string
}

export type NotificationStatus = "sent" | "failed" | "pending"

export type WhatsAppSendResult = {
  status: NotificationStatus
  error?: string
  httpStatus?: number
  responseBody?: unknown
  adminRecipient: string
}

const WHATSAPP_API_VERSION = "v21.0"
const DEFAULT_ADMIN_NUMBER = "918925856552"

/** Admin number that receives ALL lead notifications — never the customer's phone. */
export function getWhatsAppAdminNumber(): string {
  const raw =
    process.env.WHATSAPP_ADMIN_NUMBER ??
    process.env.WHATSAPP_RECIPIENT_NUMBER ??
    process.env.WHATSAPP_RECIPIENT_PHONE ??
    DEFAULT_ADMIN_NUMBER

  return raw.replace(/\D/g, "")
}

export function getWhatsAppConfig() {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN?.trim()
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim()
  const businessNumber = process.env.WHATSAPP_BUSINESS_NUMBER?.trim()
  const adminNumber = getWhatsAppAdminNumber()

  return {
    accessToken,
    phoneNumberId,
    businessNumber,
    adminNumber,
    isConfigured: Boolean(accessToken && phoneNumberId),
  }
}

export function logWhatsAppConfig(context: string) {
  const config = getWhatsAppConfig()
  console.info(`[WhatsApp:${context}] Config check`, {
    configured: config.isConfigured,
    phoneNumberId: config.phoneNumberId ? `${config.phoneNumberId.slice(0, 4)}...` : "missing",
    businessNumber: config.businessNumber ?? "not set",
    adminRecipient: config.adminNumber,
    accessToken: config.accessToken ? "present" : "missing",
  })
}

export function formatLeadMessage(data: LeadNotificationData): string {
  const submittedAt = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date())

  return `NEW WEBSITE LEAD

Name:
${data.name}

Mobile:
${data.phone}

Email:
${data.email}

Service:
${data.service}

Message:
${data.message}

Submitted At:
${submittedAt}

Source:
${data.source}`
}

export async function sendWhatsAppTextToAdmin(body: string): Promise<WhatsAppSendResult> {
  const config = getWhatsAppConfig()
  const adminRecipient = getWhatsAppAdminNumber()

  if (!config.isConfigured) {
    const error =
      "WhatsApp API not configured. Set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID."
    console.error("[WhatsApp] Notification failed:", error)
    return { status: "failed", error, adminRecipient }
  }

  const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${config.phoneNumberId}/messages`
  const payload = {
    messaging_product: "whatsapp",
    to: adminRecipient,
    type: "text",
    text: { preview_url: false, body },
  }

  console.info("[WhatsApp] Sending lead notification to admin:", adminRecipient)

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const responseText = await response.text()
    let responseBody: unknown = responseText
    try {
      responseBody = JSON.parse(responseText)
    } catch {
      // keep raw text
    }

    if (!response.ok) {
      console.error("[WhatsApp] API Error:", response.status, responseBody)
      return {
        status: "failed",
        error: `HTTP ${response.status}: ${responseText}`,
        httpStatus: response.status,
        responseBody,
        adminRecipient,
      }
    }

    console.info("[WhatsApp] Notification sent to admin:", adminRecipient, {
      httpStatus: response.status,
      responseBody,
    })

    return {
      status: "sent",
      httpStatus: response.status,
      responseBody,
      adminRecipient,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[WhatsApp] Notification failed:", message)
    return { status: "failed", error: message, adminRecipient }
  }
}

export async function sendLeadWhatsAppNotification(
  data: LeadNotificationData
): Promise<WhatsAppSendResult> {
  const adminRecipient = getWhatsAppAdminNumber()

  console.info("[WhatsApp] Lead notification — recipient (admin):", adminRecipient)
  console.info("[WhatsApp] Lead notification — customer mobile:", data.phone)

  return sendWhatsAppTextToAdmin(formatLeadMessage(data))
}

export async function sendTestWhatsAppNotification(): Promise<WhatsAppSendResult> {
  return sendWhatsAppTextToAdmin(
    "TEST MESSAGE\nThe Seven Pounds WhatsApp integration is working."
  )
}
