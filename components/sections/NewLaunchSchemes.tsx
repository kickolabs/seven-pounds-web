"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LayoutGrid, Layers } from "lucide-react"
import { PLANS_GROUP_A, PLANS_GROUP_B } from "@/lib/constants"
import { fadeUp, defaultViewport } from "@/lib/animations"
import PlanCard from "@/components/shared/PlanCard"

const TABS = [
  {
    id: "core",
    label: "Core Plans",
    Icon: LayoutGrid,
    plans: PLANS_GROUP_A,
    size: "sm" as const,
    grid: "grid-cols-1 lg:grid-cols-4",
  },
  {
    id: "flex",
    label: "Flexible Plans",
    Icon: Layers,
    plans: PLANS_GROUP_B,
    size: "lg" as const,
    grid: "grid-cols-1 lg:grid-cols-3",
  },
] as const

type TabId = (typeof TABS)[number]["id"]

export default function NewLaunchSchemes() {
  const [active, setActive] = useState<TabId>("core")
  const [direction, setDirection] = useState(1)

  const currentTab = TABS.find((t) => t.id === active)!

  const switchTab = (id: TabId) => {
    const fromIdx = TABS.findIndex((t) => t.id === active)
    const toIdx = TABS.findIndex((t) => t.id === id)
    setDirection(toIdx > fromIdx ? 1 : -1)
    setActive(id)
  }

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -40 }),
  }

  return (
    <section id="plans" className="section-pad bg-white bg-dot-grid">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="type-eyebrow text-slate-400 mb-4"
          >
            New launch schemes
          </motion.p>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="type-heading font-medium tracking-tight mb-4"
          >
            Pick your plan.{" "}
            <span className="text-brand">Start your reset.</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="type-body-lg text-slate-400 max-w-2xl mx-auto"
          >
            One of these fits your situation. Let&apos;s get you started.
          </motion.p>
        </div>

        {/* Tab navigation */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="flex justify-center mb-10 sm:mb-14"
        >
          <div
            role="tablist"
            className="inline-flex items-center gap-1 p-1 rounded-full bg-slate-100 border border-slate-200/60"
          >
            {TABS.map(({ id, label, Icon }) => {
              const isActive = id === active
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => switchTab(id)}
                  className={[
                    "relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                    isActive
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700",
                  ].join(" ")}
                >
                  <Icon size={15} strokeWidth={isActive ? 2 : 1.75} />
                  <span>{label}</span>
                  {isActive && (
                    <motion.span
                      aria-hidden="true"
                      layoutId="tab-active-pill"
                      className="absolute inset-0 rounded-full bg-white shadow-sm -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Card grid — animated on tab switch */}
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={active}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className={`grid gap-5 sm:gap-6 ${currentTab.grid}`}
          >
            {currentTab.plans.map((plan, i) => (
              <PlanCard
                key={i}
                plan={plan}
                size={currentTab.size}
              />
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}
