"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CircleHelp, Plus, Minus } from "lucide-react"
import { FAQ_ITEMS } from "@/lib/constants"
import { fadeUp, staggerContainer, defaultViewport } from "@/lib/animations"

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  const toggle = (i: number) => setOpen(open === i ? null : i)

  return (
    <section id="faq" className="bg-white bg-dot-grid section-pad">
      <div className="max-w-7xl mx-auto">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="type-eyebrow text-grey mb-4"
        >
          FAQ
        </motion.p>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 sm:mb-14 gap-6">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="type-heading font-medium tracking-tight max-w-2xl"
          >
            Frequently Asked{" "}
            <span className="text-brand">Questions</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="type-body-lg text-grey max-w-sm"
          >
            Find answers to common questions about our debt relief, EMI management, and
            financial consulting services.
          </motion.p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
        >
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i

            return (
              <motion.div
                key={i}
                variants={fadeUp}
                className={`rounded-2xl border transition-colors duration-300 overflow-hidden ${
                  isOpen
                    ? "border-rose-200 bg-rose-50/40"
                    : "border-slate-100 bg-white hover:border-slate-200"
                }`}
              >
                <button
                  type="button"
                  id={`faq-trigger-${i}`}
                  onClick={() => toggle(i)}
                  className="w-full flex items-start gap-4 p-5 sm:p-6 text-left focus-visible:outline-none"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                >
                  <div
                    className={`shrink-0 mt-0.5 w-9 h-9 flex items-center justify-center rounded-xl transition-colors duration-300 ${
                      isOpen ? "bg-brand text-white" : "bg-rose-50 text-brand"
                    }`}
                  >
                    <CircleHelp size={17} aria-hidden="true" />
                  </div>

                  <span
                    className={`flex-1 type-item-heading font-semibold transition-colors duration-300 pt-1 ${
                      isOpen ? "text-brand" : "text-black"
                    }`}
                  >
                    {item.question}
                  </span>

                  <div
                    className={`shrink-0 mt-0.5 w-7 h-7 flex items-center justify-center rounded-full border transition-all duration-300 ${
                      isOpen
                        ? "border-brand bg-brand text-white"
                        : "border-slate-200 text-grey"
                    }`}
                    aria-hidden="true"
                  >
                    {isOpen ? (
                      <Minus size={14} strokeWidth={2.5} />
                    ) : (
                      <Plus size={14} strokeWidth={2.5} />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${i}`}
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 sm:px-6 pb-5 sm:pb-6 pl-[3.75rem] text-grey text-sm leading-relaxed">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
