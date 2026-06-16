import { z } from "zod"

export const INDIAN_MOBILE_REGEX = /^[6-9][0-9]{9}$/

export function sanitizePhoneInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10)
}

export function getIndianMobileError(value: string): string | null {
  const trimmed = value.trim()

  if (!trimmed) return "Mobile number is required."
  if (/[a-zA-Z]/.test(trimmed)) return "Only numeric values are allowed."
  if (/[^0-9]/.test(trimmed)) return "Only numeric values are allowed."
  if (trimmed.length !== 10) return "Mobile number must contain exactly 10 digits."
  if (!/^[6-9]/.test(trimmed)) return "Mobile number must start with 6, 7, 8, or 9."

  return null
}

export const indianMobileSchema = z.string().superRefine((val, ctx) => {
  const error = getIndianMobileError(val)
  if (error) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: error })
  }
})

export const nameSchema = z
  .string()
  .min(1, "Please enter a valid name.")
  .max(50, "Please enter a valid name.")
  .refine((val) => val.trim().length >= 3, "Please enter a valid name.")
  .refine((val) => /^[a-zA-Z\s]+$/.test(val.trim()), "Please enter a valid name.")

export const emailSchema = z
  .string()
  .min(1, "Please enter a valid email address.")
  .email("Please enter a valid email address.")

export const messageSchema = z
  .string()
  .min(1, "Please enter at least 10 characters.")
  .refine((val) => val.trim().length >= 10, "Please enter at least 10 characters.")

export const optionalMessageSchema = z
  .string()
  .optional()
  .refine(
    (val) => !val || val.trim().length === 0 || val.trim().length >= 10,
    "Please enter at least 10 characters."
  )

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: indianMobileSchema,
  message: messageSchema,
})

export const consultationFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: indianMobileSchema,
  message: optionalMessageSchema,
  plan_selected: z.string().optional(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
export type ConsultationFormData = z.infer<typeof consultationFormSchema>
