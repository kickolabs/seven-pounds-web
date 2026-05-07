"use client"

import { motion } from "framer-motion"
import { LayoutGrid, TrendingUp, Shield, UserCheck } from "lucide-react"
import { iconPop, SPRING } from "@/lib/animations"

const iconMap = {
  LayoutGrid,
  TrendingUp,
  Shield,
  UserCheck,
} as const

type IconName = keyof typeof iconMap

interface ServiceCardProps {
  title: string
  desc: string
  icon: string
  index?: number
}

export default function ServiceCard({ title, desc, icon, index = 0 }: ServiceCardProps) {
  const Icon = iconMap[icon as IconName] ?? LayoutGrid

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: SPRING }}
      whileHover={{ y: -6, boxShadow: "0 8px 40px rgba(255,45,85,0.15)" }}
      whileTap={{ scale: 0.98 }}
      className="group relative p-8 rounded-4xl border border-slate-100 bg-white cursor-default overflow-hidden flex flex-col"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-rose-500 to-rose-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-4xl" />

      <div className="relative z-10 flex flex-col flex-grow">
        {/* Icon */}
        <motion.div
          variants={iconPop}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ scale: 1.15, rotate: 8 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="mb-6 w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 group-hover:bg-white/20 transition-colors duration-500"
        >
          <Icon size={20} className="text-brand group-hover:text-white transition-colors duration-500" />
        </motion.div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-white transition-colors duration-500 mb-3 leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 group-hover:text-white/80 transition-colors duration-500 leading-relaxed flex-grow">
          {desc}
        </p>
      </div>
    </motion.div>
  )
}
