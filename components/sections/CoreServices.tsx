"use client"

import { useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CORE_SERVICES } from "@/lib/constants"
import { fadeUp, lineReveal, defaultViewport } from "@/lib/animations"
import { useCarousel } from "@/lib/hooks/useCarousel"

export default function CoreServices() {
  const sectionRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<(HTMLDivElement | null)[]>([])

  const { active, direction, go, prev, next } = useCarousel(CORE_SERVICES.length)

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -60 }),
  }

  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const first = featuresRef.current[0]
      if (first) { first.style.opacity = "1"; first.style.transform = "none" }
      return
    }

    // Lazy-load GSAP so it is excluded from the initial bundle
    let cleanup: (() => void) | undefined

    async function init() {
      const { default: gsap } = await import("gsap")
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: "+=150%",
            scrub: 0.6,
            pin: true,
            anticipatePin: 0,
          },
        })

        featuresRef.current.forEach((feature, i) => {
          if (!feature) return

          tl.fromTo(
            feature,
            { opacity: 0, y: 40, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" },
            i === 0 ? "0" : ">-0.2"
          )

          if (i < CORE_SERVICES.length - 1) {
            tl.to(feature, {
              opacity: 0,
              y: -40,
              scale: 0.95,
              duration: 1,
              ease: "power2.in",
            })
          }
        })
      }, sectionRef)

      cleanup = () => ctx.revert()
    }

    init()

    return () => cleanup?.()
  }, [])

  return (
    <section ref={sectionRef} id="services" className="relative bg-white bg-dot-grid">
      {/* Desktop — GSAP pinned scroll animation */}
      <div ref={triggerRef} className="hidden lg:flex h-[90vh] items-center overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">

          {/* Left — static heading */}
          <div className="space-y-6">
            <p className="type-eyebrow text-slate-400">
              What we do
            </p>
            <h2 className="type-heading font-medium tracking-tight">
              Everything you need.{" "}
              <span className="text-brand">Nothing you don&apos;t.</span>
            </h2>
            <p className="type-body-lg text-slate-400 max-w-sm">
              Expert financial support — structured, ethical, and built around you.
            </p>

            {/* Feature indicators */}
            <div className="hidden lg:flex flex-col gap-3 pt-4">
              {CORE_SERVICES.map((s) => (
                <div key={s.title} className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-sm text-slate-400">{s.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — GSAP animated feature reveal */}
          <div className="relative h-[380px] flex items-center">
            {CORE_SERVICES.map((service, i) => (
              <div
                key={i}
                ref={(el) => { featuresRef.current[i] = el }}
                className="absolute inset-0 flex flex-col justify-center text-left opacity-0 translate-y-10"
              >
                <div className="mb-4 w-10 h-px bg-brand" />
                <h3 className="type-subheading font-medium mb-4">
                  <span className={i % 2 === 0 ? "text-brand" : "text-slate-900"}>
                    {service.title}
                  </span>
                </h3>
                <p className="type-body-lg text-slate-400 max-w-lg">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Radial highlight */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(255,45,85,0.04)_0%,_transparent_70%)] -z-10" />
      </div>

      {/* Mobile — carousel */}
      <div className="lg:hidden section-pad">
        <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={defaultViewport}
          className="type-eyebrow text-slate-400 mb-4">
          What we do
        </motion.p>
        <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={defaultViewport}
          className="type-heading font-medium tracking-tight mb-4">
          Everything you need.{" "}
          <span className="text-brand">Nothing you don&apos;t.</span>
        </motion.h2>
        <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={defaultViewport}
          className="type-body-lg text-slate-400 mb-10">
          Expert financial support — structured, ethical, and built around you.
        </motion.p>

        {/* Carousel */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 px-6 py-8">
          <div aria-live="polite" aria-atomic="true" className="sr-only">
            {CORE_SERVICES[active].title}: {CORE_SERVICES[active].desc}
          </div>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={active}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
              className="min-h-[140px] flex flex-col justify-center"
            >
              <motion.div
                variants={lineReveal}
                className="w-1.5 h-6 bg-brand rounded-full mb-4 opacity-60"
              />
              <h3 className="type-item-heading font-semibold text-slate-900 mb-2">
                {CORE_SERVICES[active].title}
              </h3>
              <p className="type-body text-slate-400">
                {CORE_SERVICES[active].desc}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              {CORE_SERVICES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Go to service ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === active ? "w-6 bg-brand" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={prev}
              aria-label="Previous"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 bg-white hover:border-brand hover:text-brand transition-colors duration-200 text-slate-500"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 bg-white hover:border-brand hover:text-brand transition-colors duration-200 text-slate-500"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
