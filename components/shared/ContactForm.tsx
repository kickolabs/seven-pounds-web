"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Loader2, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { fadeUp, staggerContainer, defaultViewport } from "@/lib/animations"
import {
  contactFormSchema,
  sanitizePhoneInput,
  type ContactFormData,
} from "@/lib/validation"
import { FORM_SUCCESS_MESSAGE } from "@/lib/constants"
import { cn } from "@/lib/utils"

const fieldErrorClass = "border-brand focus-visible:ring-brand"

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const cooldownTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "all",
    reValidateMode: "onChange",
    shouldFocusError: true,
  })

  const startCooldown = () => {
    if (cooldownTimer.current) clearInterval(cooldownTimer.current)
    setCooldown(10)
    cooldownTimer.current = setInterval(() => {
      setCooldown(c => {
        if (c <= 1) { clearInterval(cooldownTimer.current!); cooldownTimer.current = null; return 0 }
        return c - 1
      })
    }, 1000)
  }

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to send")
      setSubmitted(true)
      reset()
    } catch (err) {
      console.error("Contact form error:", err)
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      })
      startCooldown()
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-12 text-center"
      >
        <CheckCircle size={48} className="text-brand" />
        <h3 className="type-card-heading font-semibold text-black">Message Received!</h3>
        <p className="text-grey text-sm max-w-xs">
          {FORM_SUCCESS_MESSAGE}
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-sm text-brand underline-offset-2 hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    )
  }

  const phoneRegister = register("phone")

  return (
    <motion.form
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="contact-name">Full Name *</Label>
          <Input
            id="contact-name"
            placeholder="Your name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={cn(errors.name && fieldErrorClass)}
            {...register("name")}
          />
          {errors.name && (
            <p id="contact-name-error" role="alert" className="text-xs text-brand">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact-phone">Phone Number</Label>
          <Input
            id="contact-phone"
            type="tel"
            inputMode="numeric"
            placeholder="+91 98765 43210"
            autoComplete="tel"
            maxLength={10}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "contact-phone-error" : undefined}
            className={cn(errors.phone && fieldErrorClass)}
            name={phoneRegister.name}
            ref={phoneRegister.ref}
            onBlur={phoneRegister.onBlur}
            onChange={(e) => {
              setValue("phone", sanitizePhoneInput(e.target.value), {
                shouldValidate: true,
                shouldDirty: true,
              })
            }}
          />
          {errors.phone && (
            <p id="contact-phone-error" role="alert" className="text-xs text-brand">
              {errors.phone.message}
            </p>
          )}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="space-y-1.5">
        <Label htmlFor="contact-email">Email Address *</Label>
        <Input
          id="contact-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          className={cn(errors.email && fieldErrorClass)}
          {...register("email")}
        />
        {errors.email && (
          <p id="contact-email-error" role="alert" className="text-xs text-brand">
            {errors.email.message}
          </p>
        )}
      </motion.div>

      <motion.div variants={fadeUp} className="space-y-1.5">
        <Label htmlFor="contact-message">Message *</Label>
        <Textarea
          id="contact-message"
          placeholder="Describe your financial situation briefly..."
          className={cn("min-h-[120px] resize-none", errors.message && fieldErrorClass)}
          autoComplete="off"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          {...register("message")}
        />
        {errors.message && (
          <p id="contact-message-error" role="alert" className="text-xs text-brand">
            {errors.message.message}
          </p>
        )}
      </motion.div>

      <motion.div variants={fadeUp}>
        <button
          type="submit"
          disabled={isSubmitting || cooldown > 0}
          className="w-full py-3.5 rounded-full bg-slate-900 text-white text-sm font-semibold tracking-wide hover:bg-brand transition-colors duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {cooldown > 0 ? `Try again in ${cooldown}s…` : isSubmitting ? "Sending…" : "Send Message"}
        </button>
      </motion.div>
    </motion.form>
  )
}
