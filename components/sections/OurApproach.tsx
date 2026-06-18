"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { APPROACH_POINTS } from "@/lib/constants"
import { fadeUp, defaultViewport } from "@/lib/animations"
import { useCarousel } from "@/lib/hooks/useCarousel"

export default function OurApproach() {
  const { active, direction, go, prev, next } = useCarousel(APPROACH_POINTS.length)

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -60 }),
  }

  const point = APPROACH_POINTS[active]

  return (
    <section id="approach" className="bg-white bg-dot-grid section-pad">
      <div className="max-w-7xl mx-auto">
      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="type-eyebrow text-grey mb-4"
      >
        How we work
      </motion.p>

      <motion.h2
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="type-heading font-medium tracking-tight mb-6 max-w-3xl"
      >
        Simple steps.{" "}
        <span className="text-brand">Real results.</span>
      </motion.h2>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="type-body-lg text-grey max-w-2xl mb-12 sm:mb-16"
      >
        The Seven Pounds is a modern financial consultancy specializing in debt resolution, EMI management, and fintech management services that help clients make informed financial decisions.
      </motion.p>

      {/* Carousel */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 px-6 sm:px-12 md:px-16 py-10 sm:py-14">
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          Step {point.number}: {point.title}
        </div>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={active}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="min-h-[160px] flex flex-col justify-center"
          >
            <span className="type-eyebrow mb-4 block">{point.number}</span>
            <div className="w-8 h-px bg-brand mb-6" />
            <h3 className="type-card-heading font-semibold mb-4">{point.title}</h3>
            <p className="type-body max-w-2xl">{point.desc}</p>
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        <div className="mt-10 flex items-center gap-4">
          {/* Dots */}
          <div className="flex items-center gap-2 flex-1">
            {APPROACH_POINTS.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Go to step ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-6 bg-brand" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={prev}
            aria-label="Previous"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 bg-white hover:border-brand hover:text-brand transition-colors duration-200 text-grey"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 bg-white hover:border-brand hover:text-brand transition-colors duration-200 text-grey"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
    </section>
  )
}
