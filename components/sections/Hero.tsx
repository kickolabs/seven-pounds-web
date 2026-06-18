  "use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { SPRING } from "@/lib/animations"
import { useOpenModal } from "@/components/shared/HomeClient"

export default function Hero() {
  const openModal = useOpenModal()

  const scrollToContact = () => {
    document
      .getElementById("contact")
      ?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-white"
    >

      {/* DESKTOP VIEW */}
      <div className="hidden min-h-screen lg:grid lg:grid-cols-2">

        {/* DESKTOP VIDEO */}
        <div className="relative overflow-hidden">

          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source
              src="/images/7p-desktop.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        {/* DESKTOP CONTENT */}
        <div className="relative z-10 flex items-center">
          <div className="w-full px-6 py-20 sm:px-10 lg:px-16">

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: SPRING }}
              className="type-eyebrow text-grey mb-4"
            >
              Trusted Fintech Management Services
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: SPRING,
              }}
              className="type-display mb-6 max-w-xl font-medium tracking-tight"
            >
              Too many EMIs.{" "}
              <span className="text-brand">
                One clear plan.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.3,
                ease: SPRING,
              }}
              className="type-body mb-8 max-w-lg text-slate-600"
            >
              The Seven Pounds restructures your EMIs,
              cuts the chaos, and puts you back in
              control — ethically and confidently.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.45,
                ease: SPRING,
              }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <button
                onClick={openModal}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 text-sm font-semibold text-white shadow-glow-rose transition-all duration-300 hover:bg-brand-600 hover:shadow-glow-rose-lg"
              >
                Get Help Now

                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={scrollToContact}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-medium text-slate-700 transition-all duration-300 hover:border-slate-400"
              >
                Talk to an Advisor
              </button>
            </motion.div>

            {/* TRUST BADGES */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.7,
              }}
              className="mt-10 flex flex-wrap gap-5"
            >
              {[
                "100% ethical",
                "Strictly confidential",
                "Zero hidden charges",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-xs text-slate-500"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-brand" />
                  {item}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="block lg:hidden">

        {/* MOBILE VIDEO FRAME */}
        <div className="bg-white px-4 pt-24">

          <div
            className="relative mx-auto overflow-hidden rounded-3xl shadow-xl"
            style={{
              width: "100%",
              maxWidth: "200mm",
              aspectRatio: "200 / 150",
            }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            >
              <source
                src="/images/7p-mobile.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>

        {/* MOBILE CONTENT */}
        <div className="bg-white px-6 pb-12 pt-10">

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: SPRING }}
            className="type-eyebrow text-grey mb-4"
          >
            Trusted Fintech Management Services
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: SPRING,
            }}
            className="mb-5 text-3xl sm:text-4xl font-semibold leading-tight tracking-tight text-slate-900"
          >
            Debt Relief &amp;{" "}
            <span className="text-brand">
              Fintech Management Services
            </span>{" "}
            for Financial Stability
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: SPRING,
            }}
            className="mb-8 text-base leading-7 text-slate-600"
          >
            The Seven Pounds provides professional debt management, EMI optimization,
            financial restructuring, and fintech management services designed to help
            individuals and businesses regain financial control and long-term stability.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.25,
              ease: SPRING,
            }}
            className="flex flex-col gap-4"
          >
            <button
              onClick={openModal}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-600"
            >
              Get Help Now

              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>

            <button
              onClick={scrollToContact}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-medium text-slate-700 transition-all duration-300 hover:border-slate-400"
            >
              Talk to an Advisor
            </button>
          </motion.div>

          {/* TRUST BADGES */}
          <div className="mt-10 flex flex-wrap gap-5">
            {[
              "100% ethical",
              "Strictly confidential",
              "Zero hidden charges",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-xs text-slate-500"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-brand" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 1.2,
          duration: 0.6,
        }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <div className="h-10 w-px bg-gradient-to-b from-slate-400 to-transparent" />

        <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
          Scroll
        </span>
      </motion.div>
    </section>
  )
}
