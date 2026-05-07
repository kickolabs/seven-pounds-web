"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, CheckCircle, CreditCard } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ALL_PLANS, CONSULTATION_FEE_PAISE } from "@/lib/constants"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void }
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  theme: { color: string }
  prefill: { name: string; email: string; contact: string }
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void
  modal: { ondismiss: () => void }
}

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  message: z.string().optional(),
  plan_selected: z.string().optional(),
})

type FormData = z.infer<typeof schema>

type Step = "form" | "processing" | "success"

interface ConsultationModalProps {
  open: boolean
  onClose: () => void
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.querySelector('script[src*="razorpay"]')) { resolve(true); return }
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function ConsultationModal({ open, onClose }: ConsultationModalProps) {
  const [step, setStep] = useState<Step>("form")
  const [bookingId, setBookingId] = useState<string>("")
  const [cooldown, setCooldown] = useState(0)
  const cooldownTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
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

  const handleClose = () => {
    if (step !== "processing") {
      onClose()
      setTimeout(() => { setStep("form"); reset() }, 300)
    }
  }

  const onSubmit = async (data: FormData) => {
    setStep("processing")

    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) throw new Error("Razorpay failed to load")

      if (!window.Razorpay) {
        toast({ title: "Payment gateway unavailable", description: "Please try again.", variant: "destructive" })
        setStep("form")
        startCooldown()
        return
      }

      const orderRes = await fetch("/api/consultation/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!orderRes.ok) throw new Error("Order creation failed")
      const { orderId, amount, currency, keyId } = await orderRes.json()

      const options: RazorpayOptions = {
        key: keyId,
        amount,
        currency,
        name: "The Seven Pounds",
        description: data.plan_selected
          ? `Consultation — ${data.plan_selected}`
          : "Financial Consultation",
        order_id: orderId,
        theme: { color: "#FF2D55" },
        prefill: { name: data.name, email: data.email, contact: data.phone },
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/consultation/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })
            if (!verifyRes.ok) throw new Error("Verification failed")
            const { bookingId: bid } = await verifyRes.json()
            setBookingId(bid)
            setStep("success")
          } catch {
            toast({ title: "Payment verification failed", description: "Please contact us.", variant: "destructive" })
            setStep("form")
            startCooldown()
          }
        },
        modal: {
          ondismiss: () => setStep("form"),
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error(err)
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" })
      setStep("form")
      startCooldown()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="w-[calc(100vw-2rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-2xl"
      >
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="type-card-heading font-semibold text-foreground">Book Your Consultation</DialogTitle>
              <DialogDescription>
                Fill in your details and proceed to payment ({formatCurrency(CONSULTATION_FEE_PAISE)}).
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <Label>Full Name *</Label>
                  <Input placeholder="Your name" autoComplete="name" {...register("name")} />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Phone *</Label>
                  <Input type="tel" placeholder="98765 43210" autoComplete="tel" {...register("phone")} />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Email *</Label>
                <Input type="email" placeholder="you@example.com" autoComplete="email" {...register("email")} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Interested Plan (Optional)</Label>
                <Select onValueChange={(val) => setValue("plan_selected", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan…" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_PLANS.map((plan) => (
                      <SelectItem key={plan.title} value={plan.title}>
                        {plan.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Brief Message (Optional)</Label>
                <Textarea
                  placeholder="Briefly describe your situation…"
                  className="resize-none min-h-[80px]"
                  autoComplete="off"
                  {...register("message")}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || cooldown > 0}
                className="w-full py-3.5 rounded-full bg-brand text-white text-sm font-semibold tracking-wide hover:bg-brand-600 transition-colors duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <CreditCard size={16} />
                {cooldown > 0
                  ? `Try again in ${cooldown}s…`
                  : `Proceed to Payment — ${formatCurrency(CONSULTATION_FEE_PAISE)}`}
              </button>
            </form>
          </>
        )}

        {step === "processing" && (
          <div aria-live="polite" className="flex flex-col items-center justify-center gap-4 py-12">
            <DialogTitle className="sr-only">Processing payment</DialogTitle>
            <Loader2 size={40} className="animate-spin text-brand" />
            <p className="text-slate-600 font-medium">Opening payment gateway…</p>
          </div>
        )}

        {step === "success" && (
          <div aria-live="polite" className="flex flex-col items-center justify-center gap-4 py-10 text-center">
            <CheckCircle size={52} className="text-brand" />
            <DialogTitle className="type-card-heading font-semibold text-slate-900">Consultation Booked!</DialogTitle>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
              Your payment was successful. Our advisor will contact you within 24 hours.
            </p>
            {bookingId && (
              <p className="text-xs text-slate-400 font-mono">
                Booking ID: <span className="text-slate-600">{bookingId.slice(0, 8).toUpperCase()}</span>
              </p>
            )}
            <button
              onClick={handleClose}
              className="mt-4 px-8 py-3 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-brand transition-colors duration-300"
            >
              Done
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
