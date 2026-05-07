import { Resend } from "resend"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@thesevenpounds.in"
const FROM_EMAIL = process.env.FROM_EMAIL ?? "noreply@thesevenpounds.in"

function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendContactNotification(data: {
  name: string
  email: string
  phone?: string | null
  message: string
}) {
  const resend = getResend()
  if (!resend) return

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New contact message from ${data.name}`,
    html: `
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, "<br>")}</p>
    `,
  })
}

export async function sendBookingNotification(data: {
  name: string
  email: string
  phone: string
  plan?: string | null
  bookingId: string
}) {
  const resend = getResend()
  if (!resend) return

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New consultation booked — ${data.name}`,
    html: `
      <p><strong>Booking ID:</strong> ${data.bookingId}</p>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      ${data.plan ? `<p><strong>Plan:</strong> ${data.plan}</p>` : ""}
    `,
  })
}
