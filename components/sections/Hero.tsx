"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { SPRING } from "@/lib/animations"
import { useOpenModal } from "@/components/shared/HomeClient"

const SLIDES = Array.from({ length: 7 }, (_, i) => `/images/hero/${i + 1}.jpeg`)
const INTERVAL = 3500

function Slideshow({ sizes, className }: { sizes: string; className?: string }) {
  return null
}

export default function Hero() {
  const openModal = useOpenModal()
  const scrollToContact = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), INTERVAL)
    return () => clearInterval(timer)
  }, [])

  const slides = (sizes: string) => (
    <AnimatePresence>
      <motion.div
        key={current}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        <Image
          src={SLIDES[current]}
          alt="The Seven Pounds financial advisor"
          fill
          priority={current === 0}
          sizes={sizes}
          quality={85}
          className="object-cover object-center"
        />
      </motion.div>
    </AnimatePresence>
  )

  return (
    <section
      id="hero"
      className="relative bg-white overflow-hidden"
    >
      {/* Desktop slideshow — absolute, left half */}
      <div className="hidden lg:block absolute inset-y-0 left-0 w-[58%] z-0">
        {slides("58vw")}
      </div>

      {/* Desktop accent */}
      <div className="hidden lg:block absolute top-0 right-0 w-[40%] h-[40%] bg-[radial-gradient(ellipse_at_top_right,_rgba(148,163,184,0.06),_transparent_60%)] pointer-events-none z-10" />

      {/* Text content */}
      <div className="relative z-20 lg:min-h-screen lg:flex lg:items-center lg:justify-end">
        <div className="w-full lg:w-[46%] xl:w-[43%] px-6 sm:px-10 lg:px-12 xl:px-16 pt-20 sm:pt-24 lg:pt-0 pb-8 lg:pb-0 lg:flex lg:flex-col lg:justify-center lg:min-h-screen">

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: SPRING }}
            className="type-display font-medium tracking-tight mb-6"
          >
            Too many EMIs.{" "}
            <span className="text-brand">One clear plan.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: SPRING }}
            className="type-body mb-8 max-w-md"
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
              className="hidden sm:inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm text-grey text-sm font-medium tracking-wide hover:border-slate-400 hover:bg-white transition-all duration-300"
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
              <div key={badge} className="flex items-center gap-1.5 text-xs text-grey">
                <div className="w-1 h-1 rounded-full bg-brand" />
                {badge}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Mobile slideshow — below text, full width */}
      <div className="lg:hidden relative w-full aspect-[4/3]">
        {slides("100vw")}
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 z-20"
      >
        <div className="w-px h-10 bg-gradient-to-b from-slate-400 to-transparent" />
        <span className="text-[10px] uppercase tracking-widest text-grey font-medium">Scroll</span>
      </motion.div>
    </section>
  )
}
