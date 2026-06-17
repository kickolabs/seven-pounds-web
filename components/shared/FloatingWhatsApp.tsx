"use client"

import { motion } from "framer-motion"
import { SUPPORT_WHATSAPP_URL } from "@/lib/constants"
import { WhatsAppIcon } from "@/components/shared/social-icons"

export default function FloatingWhatsApp() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 right-6 z-50"
    >
      <a
        href={SUPPORT_WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-glow-rose transition-transform duration-300 hover:scale-110 active:scale-95"
      >
        <span
          className="absolute inset-0 rounded-full bg-brand animate-ping opacity-25 pointer-events-none"
          aria-hidden="true"
        />
        <span
          className="absolute inset-0 rounded-full bg-brand/30 blur-md scale-110 pointer-events-none"
          aria-hidden="true"
        />
        <WhatsAppIcon size={26} className="relative z-10" />
        <span
          className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          role="tooltip"
        >
          Chat with us
        </span>
      </a>
    </motion.div>
  )
}
