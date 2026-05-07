"use client"

import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"
import { fadeUp, defaultViewport } from "@/lib/animations"

export default function Disclaimer() {
  return (
    <section id="disclaimer" className="px-4 sm:px-6 md:px-8 lg:px-16 py-10 sm:py-14 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="flex items-start gap-4"
        >
          <AlertCircle size={18} className="text-slate-300 shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-300 font-medium mb-3">
              Important Disclaimer
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              The Seven Pounds provides financial guidance, restructuring assistance, and advisory services.
              All plans and schemes are subject to individual eligibility, financial assessment, and applicable
              terms and conditions. We do not guarantee loan approvals, EMI waivers, or specific financial outcomes.
              Our role is to provide structured guidance and support — final decisions remain with the individual
              and relevant financial institutions.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
