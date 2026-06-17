import type { SupabaseClient } from "@supabase/supabase-js"
import {
  sendLeadWhatsAppNotification,
  logWhatsAppConfig,
  getWhatsAppAdminNumber,
  type LeadNotificationData,
  type NotificationStatus,
} from "@/lib/whatsapp"

type LeadTable = "contacts" | "consultations"

export async function notifyLeadViaWhatsApp(
  supabase: SupabaseClient,
  table: LeadTable,
  id: string,
  lead: LeadNotificationData
): Promise<NotificationStatus> {
  const adminNumber = getWhatsAppAdminNumber()

  logWhatsAppConfig(`${table}:${id}`)
  console.info(`[WhatsApp] Triggering notification for ${table} record`, { id })
  console.info("[WhatsApp] Sending lead notification to admin:", adminNumber)
  console.info("[WhatsApp] Customer phone (message body only):", lead.phone)

  const result = await sendLeadWhatsAppNotification(lead)

  const { error: updateError } = await supabase
    .from(table)
    .update({ notification_status: result.status })
    .eq("id", id)

  if (updateError) {
    console.warn(
      `[WhatsApp] Could not update notification_status on ${table}:`,
      updateError.message
    )
  } else {
    console.info(`[WhatsApp] notification_status updated to "${result.status}" for ${table}`, {
      id,
      adminRecipient: result.adminRecipient,
    })
  }

  if (result.status === "failed") {
    console.error(`[WhatsApp] Notification failed for ${table} ${id}:`, {
      adminRecipient: result.adminRecipient,
      customerPhone: lead.phone,
      error: result.error,
      httpStatus: result.httpStatus,
      responseBody: result.responseBody,
    })
  }

  return result.status
}
