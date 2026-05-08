"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Loader2, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { fadeUp, staggerContainer, defaultViewport } from "@/lib/animations"

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type FormData = z.infer<typeof schema>

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const cooldownTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

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

  const onSubmit = async (data: FormData) => {
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
          Thank you for reaching out. Our team will get back to you within 24 hours.
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

  return (
    <motion.form
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="contact-name">Full Name *</Label>
          <Input id="contact-name" placeholder="Your name" autoComplete="name" {...register("name")} />
          {errors.name && <p className="text-xs text-brand">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact-phone">Phone Number</Label>
          <Input id="contact-phone" type="tel" placeholder="+91 98765 43210" autoComplete="tel" {...register("phone")} />
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="space-y-1.5">
        <Label htmlFor="contact-email">Email Address *</Label>
        <Input id="contact-email" type="email" placeholder="you@example.com" autoComplete="email" {...register("email")} />
        {errors.email && <p className="text-xs text-brand">{errors.email.message}</p>}
      </motion.div>

      <motion.div variants={fadeUp} className="space-y-1.5">
        <Label htmlFor="contact-message">Message *</Label>
        <Textarea
          id="contact-message"
          placeholder="Describe your financial situation briefly..."
          className="min-h-[120px] resize-none"
          autoComplete="off"
          {...register("message")}
        />
        {errors.message && <p className="text-xs text-brand">{errors.message.message}</p>}
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
