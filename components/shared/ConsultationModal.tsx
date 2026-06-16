"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, CheckCircle, CreditCard, WifiOff, RefreshCw } from "lucide-react"
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
import { formatCurrency, cn } from "@/lib/utils"
import {
  consultationFormSchema,
  sanitizePhoneInput,
  type ConsultationFormData,
} from "@/lib/validation"

const fieldErrorClass = "border-brand focus-visible:ring-brand"

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

const schema = consultationFormSchema

type FormData = ConsultationFormData

type Step = "form" | "processing" | "gateway-error" | "success"

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
  } = useForm<FormData>({
    resolver: zodResolver(schema),
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
      if (!loaded || !window.Razorpay) {
        setStep("gateway-error")
        return
      }

      const orderRes = await fetch("/api/consultation/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!orderRes.ok) {
        const body = await orderRes.json().catch(() => ({}))
        const msg = body?.error
          ? typeof body.error === "string" ? body.error : JSON.stringify(body.error)
          : `Order creation failed (${orderRes.status})`
        throw new Error(msg)
      }
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
      const msg = err instanceof Error ? err.message : "Please try again."
      console.error("Consultation error:", msg)
      toast({ title: "Something went wrong", description: msg, variant: "destructive" })
      setStep("form")
      startCooldown()
    }
  }

  const phoneRegister = register("phone")

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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2" noValidate>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="consultation-name">Full Name *</Label>
                  <Input
                    id="consultation-name"
                    placeholder="Your name"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "consultation-name-error" : undefined}
                    className={cn(errors.name && fieldErrorClass)}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p id="consultation-name-error" role="alert" className="text-xs text-brand">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="consultation-phone">Phone *</Label>
                  <Input
                    id="consultation-phone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="98765 43210"
                    autoComplete="tel"
                    maxLength={10}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "consultation-phone-error" : undefined}
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
                    <p id="consultation-phone-error" role="alert" className="text-xs text-brand">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="consultation-email">Email *</Label>
                <Input
                  id="consultation-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "consultation-email-error" : undefined}
                  className={cn(errors.email && fieldErrorClass)}
                  {...register("email")}
                />
                {errors.email && (
                  <p id="consultation-email-error" role="alert" className="text-xs text-brand">
                    {errors.email.message}
                  </p>
                )}
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
                <Label htmlFor="consultation-message">Brief Message (Optional)</Label>
                <Textarea
                  id="consultation-message"
                  placeholder="Briefly describe your situation…"
                  className={cn("resize-none min-h-[80px]", errors.message && fieldErrorClass)}
                  autoComplete="off"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "consultation-message-error" : undefined}
                  {...register("message")}
                />
                {errors.message && (
                  <p id="consultation-message-error" role="alert" className="text-xs text-brand">
                    {errors.message.message}
                  </p>
                )}
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
            <p className="text-grey font-medium">Opening payment gateway…</p>
          </div>
        )}

        {step === "gateway-error" && (
          <div aria-live="assertive" className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <DialogTitle className="sr-only">Payment gateway unavailable</DialogTitle>
            <WifiOff size={40} className="text-grey" />
            <div>
              <p className="font-semibold text-black mb-1">Payment gateway unavailable</p>
              <p className="text-sm text-grey">This may be a network issue. Please retry.</p>
            </div>
            <button
              onClick={async () => {
                setStep("processing")
                const loaded = await loadRazorpayScript()
                if (!loaded || !window.Razorpay) {
                  setStep("gateway-error")
                } else {
                  setStep("form")
                }
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand text-white text-sm font-semibold hover:bg-brand-600 transition-colors"
            >
              <RefreshCw size={14} />
              Retry
            </button>
            <button onClick={() => setStep("form")} className="text-sm text-grey hover:text-grey transition-colors">
              Go back
            </button>
          </div>
        )}

        {step === "success" && (
          <div aria-live="polite" className="flex flex-col items-center justify-center gap-4 py-10 text-center">
            <CheckCircle size={52} className="text-brand" />
            <DialogTitle className="type-card-heading font-semibold text-black">Consultation Booked!</DialogTitle>
            <p className="text-grey text-sm max-w-xs leading-relaxed">
              Your payment was successful. Our advisor will contact you within 24 hours.
            </p>
            {bookingId && (
              <p className="text-xs text-grey font-mono">
                Booking ID: <span className="text-grey">{bookingId.slice(0, 8).toUpperCase()}</span>
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
