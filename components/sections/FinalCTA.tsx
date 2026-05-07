"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { fadeUp, ctaContainer, defaultViewport } from "@/lib/animations"

interface FinalCTAProps {
  onBookConsultation: () => void
}

export default function FinalCTA({ onBookConsultation }: FinalCTAProps) {
  return (
    <section id="cta" className="section-pad bg-white bg-dot-grid">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={ctaContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="relative p-8 sm:p-12 md:p-16 rounded-4xl sm:rounded-5xl bg-slate-900 text-white overflow-hidden text-center"
        >
          {/* Radial gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,45,85,0.2),_transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(255,45,85,0.06),_transparent_50%)] pointer-events-none" />

          <div className="relative z-10">
            <motion.p variants={fadeUp} className="type-eyebrow text-slate-500 mb-6">
              Ready to start?
            </motion.p>
            <motion.h2 variants={fadeUp} className="type-heading font-medium mb-6">
              Your financial reset
              <br />
              <span className="text-brand">starts here.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="type-body-lg text-slate-400 max-w-xl mx-auto mb-10">
              Stop guessing. Book a consultation with The Seven Pounds and start building real financial stability — today.
            </motion.p>

            <motion.button
              variants={fadeUp}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              onClick={onBookConsultation}
              className="inline-flex items-center gap-2.5 w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white text-slate-900 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-brand hover:text-white transition-colors duration-400 shadow-lg hover:shadow-glow-rose group"
            >
              Book a Free Consultation
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
