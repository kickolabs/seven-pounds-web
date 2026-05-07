"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { SPRING } from "@/lib/animations"
import { useOpenModal } from "@/components/shared/HomeClient"

export default function Hero() {
  const openModal = useOpenModal()
  const scrollToContact = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  return (
    <section
      id="hero"
      className="relative bg-white overflow-hidden"
    >
      {/* Background image — all screen sizes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.05, ease: SPRING }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/images/hero-character.png"
          alt="The Seven Pounds financial advisor"
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover object-left-bottom"
        />
      </motion.div>

      {/* Mobile gradient: white at top → transparent at bottom so character shows */}
      <div className="lg:hidden absolute inset-0 z-10 pointer-events-none
        bg-gradient-to-b
        from-white from-[30%]
        via-white/75 via-[55%]
        to-transparent to-[85%]"
      />

      {/* Desktop gradient: transparent left → white right */}
      <div className="hidden lg:block absolute inset-0 z-10 pointer-events-none
        bg-gradient-to-r
        from-white/0 from-[30%]
        via-white/70 via-[50%]
        to-white to-[62%]"
      />

      {/* Desktop: background accent */}
      <div className="hidden lg:block absolute top-0 right-0 w-[40%] h-[40%] bg-[radial-gradient(ellipse_at_top_right,_rgba(148,163,184,0.06),_transparent_60%)] pointer-events-none z-10" />

      {/* Content — overlaid on image on all screen sizes */}
      <div className="relative z-20 min-h-screen flex items-start lg:items-center">
        <div className="lg:ml-auto w-full lg:w-[52%] xl:w-[48%] px-6 sm:px-10 lg:px-12 xl:px-16 pt-20 sm:pt-24 lg:pt-24 pb-8 lg:pb-12">

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: SPRING }}
            className="type-display font-medium tracking-tight mb-6 text-slate-900"
          >
            Too many EMIs.{" "}
            <span className="text-brand">One clear plan.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: SPRING }}
            className="type-body text-slate-500 mb-8 max-w-md"
          >
            The Seven Pounds restructures your EMIs, cuts the chaos, and puts you back in control — ethically and confidently.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42, ease: SPRING }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <button
              onClick={openModal}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-brand text-white text-sm font-semibold tracking-wide hover:bg-brand-600 transition-all duration-300 shadow-glow-rose hover:shadow-glow-rose-lg group"
            >
              Get Help Now
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
            <button
              onClick={scrollToContact}
              className="hidden sm:inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm text-slate-700 text-sm font-medium tracking-wide hover:border-slate-400 hover:bg-white transition-all duration-300"
            >
              Talk to an Advisor
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: SPRING }}
            className="mt-8 flex flex-row items-center gap-4 flex-wrap"
          >
            {["100% ethical", "Strictly confidential", "Zero hidden charges"].map((badge) => (
              <div key={badge} className="flex items-center gap-1.5 text-xs text-slate-500">
                <div className="w-1 h-1 rounded-full bg-brand" />
                {badge}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 z-20"
      >
        <div className="w-px h-10 bg-gradient-to-b from-slate-400 to-transparent" />
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">Scroll</span>
      </motion.div>
    </section>
  )
}
