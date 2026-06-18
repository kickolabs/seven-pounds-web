"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Briefcase, Store, Home, GraduationCap, Plus } from "lucide-react"
import { WHO_WE_SERVE } from "@/lib/constants"
import { fadeUp, defaultViewport } from "@/lib/animations"

const iconMap = { Briefcase, Store, Home, GraduationCap } as const
type IconName = keyof typeof iconMap

export default function WhoWeServe() {
  const [open, setOpen] = useState<number | null>(0)

  const toggle = (i: number) => setOpen(open === i ? null : i)

  return (
    <section id="who-we-serve" className="bg-white bg-dot-grid section-pad">
      <div className="max-w-7xl mx-auto">
      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="type-eyebrow text-grey mb-4"
      >
        Who we help
      </motion.p>

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 sm:mb-14 gap-6">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="type-heading font-medium tracking-tight max-w-2xl"
        >
          If you&apos;re struggling,{" "}
          <span className="text-brand">we&apos;re for you.</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="type-body-lg text-grey max-w-sm"
        >
          We help salaried professionals, business owners, families, and individuals through debt relief, EMI restructuring, and fintech management services tailored to their financial goals.
        </motion.p>
      </div>

      {/* Accordion cards */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
      >
        {WHO_WE_SERVE.map((item, i) => {
          const Icon = iconMap[item.icon as IconName] ?? Briefcase
          const isOpen = open === i

          return (
            <div
              key={i}
              className={`rounded-2xl border transition-colors duration-300 overflow-hidden ${
                isOpen ? "border-rose-200 bg-rose-50/40" : "border-slate-100 bg-white hover:border-slate-200"
              }`}
            >
              {/* Header row */}
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-start gap-4 p-5 sm:p-6 text-left focus-visible:outline-none"
                aria-expanded={isOpen}
                aria-controls={`who-panel-${i}`}
              >
                {/* Icon */}
                <div className={`shrink-0 mt-0.5 w-9 h-9 flex items-center justify-center rounded-xl transition-colors duration-300 ${
                  isOpen ? "bg-brand text-white" : "bg-rose-50 text-brand"
                }`}>
                  <Icon size={17} />
                </div>

                {/* Title */}
                <span className={`flex-1 type-item-heading font-semibold transition-colors duration-300 pt-1 ${
                  isOpen ? "text-brand" : "text-black"
                }`}>
                  {item.title}
                </span>

                {/* Plus button */}
                <div className={`shrink-0 mt-0.5 w-7 h-7 flex items-center justify-center rounded-full border transition-all duration-300 ${
                  isOpen
                    ? "border-brand bg-brand text-white rotate-45"
                    : "border-slate-200 text-grey"
                }`}>
                  <Plus size={14} strokeWidth={2.5} />
                </div>
              </button>

              {/* Description */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`who-panel-${i}`}
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 sm:px-6 pb-5 sm:pb-6 pl-[3.75rem] text-grey text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </motion.div>
    </div>
    </section>
  )
}
