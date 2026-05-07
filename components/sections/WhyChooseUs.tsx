"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BadgeCheck, CircleSlash, Lock, Fingerprint, Target, ChevronLeft, ChevronRight } from "lucide-react"
import { WHY_CHOOSE_US } from "@/lib/constants"
import { fadeUp, staggerContainer, defaultViewport } from "@/lib/animations"

const iconMap = { BadgeCheck, CircleSlash, Lock, Fingerprint, Target } as const
type IconName = keyof typeof iconMap

const SLIDE_INTERVAL = 4000

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -60 }),
}

export default function WhyChooseUs() {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)

  const go = useCallback((idx: number) => {
    setDirection(idx > active ? 1 : -1)
    setActive(idx)
  }, [active])

  const prev = () => go((active - 1 + WHY_CHOOSE_US.length) % WHY_CHOOSE_US.length)
  const next = useCallback(() => go((active + 1) % WHY_CHOOSE_US.length), [active, go])

  useEffect(() => {
    const id = setTimeout(next, SLIDE_INTERVAL)
    return () => clearTimeout(id)
  }, [next])

  const item = WHY_CHOOSE_US[active]
  const Icon = iconMap[item.icon as IconName] ?? BadgeCheck

  return (
    <section id="why-us" className="section-pad bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="type-eyebrow text-slate-500 mb-4"
        >
          Why us
        </motion.p>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 sm:mb-14 gap-6">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="type-heading font-medium tracking-tight text-white max-w-2xl"
          >
            Why{" "}
            <span className="text-brand">The Seven Pounds?</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="type-body-lg text-slate-400 max-w-sm"
          >
            Not just advice — a real partnership built on ethics, expertise, and results.
          </motion.p>
        </div>

        {/* ── Mobile: single-card carousel ── */}
        <div className="sm:hidden">
          <div className="glow-card">
            <div className="bg-slate-950 rounded-[18px] p-6 flex flex-col gap-5">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={active}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                  className="min-h-[120px] flex flex-col gap-4"
                >
                  <div className="w-11 h-11 flex items-center justify-center rounded-2xl bg-rose-500/10 shrink-0">
                    <Icon size={20} className="text-brand" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="type-item-heading font-semibold text-white">{item.title}</h3>
                    <p className="type-body text-slate-400">{item.desc}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 flex-1">
                  {WHY_CHOOSE_US.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => go(i)}
                      aria-label={`Go to item ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === active ? "w-6 bg-brand" : "w-1.5 bg-slate-700 hover:bg-slate-500"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:border-brand hover:text-brand transition-colors duration-200"
                >
                  <ChevronLeft size={17} />
                </button>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:border-brand hover:text-brand transition-colors duration-200"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Desktop: grid ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {WHY_CHOOSE_US.map((card, i) => {
            const CardIcon = iconMap[card.icon as IconName] ?? BadgeCheck
            return (
              <motion.div key={i} variants={fadeUp} className="glow-card">
                <div className="bg-slate-950 rounded-[18px] p-6 sm:p-8 h-full flex flex-col gap-5">
                  <div className="w-11 h-11 flex items-center justify-center rounded-2xl bg-rose-500/10 shrink-0">
                    <CardIcon size={20} className="text-brand" />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <h3 className="type-item-heading font-semibold text-white">{card.title}</h3>
                    <p className="type-body text-slate-400">{card.desc}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
