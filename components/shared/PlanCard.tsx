"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import type { Plan } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useOpenModal } from "@/components/shared/HomeClient"

interface PlanCardProps {
  plan: Plan
  size?: "sm" | "lg"
}

export default function PlanCard({ plan, size = "sm" }: PlanCardProps) {
  const openModal = useOpenModal()
  const isLg = size === "lg"

  return (
    <motion.div
      className={cn(
        "group relative flex flex-col h-full overflow-hidden border border-slate-100 bg-white cursor-default",
        isLg ? "p-10 rounded-5xl" : "p-5 sm:p-8 rounded-4xl"
      )}
      whileHover={{ y: -8, boxShadow: "0 8px 40px rgba(255,45,85,0.18)" }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-rose-500 to-rose-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit]" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className={cn("mb-auto", isLg ? "mb-6" : "mb-4")}>
          <h3 className={cn(
            "font-semibold group-hover:text-white transition-colors duration-500",
            isLg ? "text-2xl mb-2" : "text-lg mb-1"
          )}>
            {plan.title}
          </h3>
          <p className={cn(
            "uppercase tracking-widest font-medium text-slate-400 group-hover:text-white/70 transition-colors duration-500",
            isLg ? "text-xs" : "text-xs"
          )}>
            {plan.subtitle}
          </p>
          {plan.tagline && (
            <p className={cn(
              "text-slate-300 group-hover:text-white/60 transition-colors duration-500 mt-2 italic",
              isLg ? "text-sm" : "text-xs"
            )}>
              {plan.tagline}
            </p>
          )}
        </div>

        {/* Features */}
        <div className={cn("flex-grow", isLg ? "space-y-4 mb-8" : "space-y-2.5 mb-6")}>
          {plan.features.map((feature, j) => (
            <div key={j} className="flex items-start gap-2">
              <Check
                size={isLg ? 16 : 14}
                className="mt-0.5 text-brand group-hover:text-white transition-colors duration-500 shrink-0"
              />
              <span className={cn(
                "text-slate-500 group-hover:text-white/80 transition-colors duration-500 leading-tight",
                isLg ? "text-sm" : "text-xs"
              )}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={openModal}
          className={cn(
            "w-full font-bold tracking-widest uppercase transition-all duration-500 active:scale-95 bg-slate-950 text-white group-hover:bg-white group-hover:text-brand group-hover:shadow-lg",
            isLg ? "py-4 rounded-2xl text-xs" : "py-3.5 rounded-xl text-xs"
          )}
        >
          Get Started
        </button>
      </div>
    </motion.div>
  )
}
