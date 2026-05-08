"use client"

import { motion } from "framer-motion"
import { fadeUp, staggerFast, listItem, defaultViewport } from "@/lib/animations"
import ContactForm from "@/components/shared/ContactForm"

export default function ContactSection() {
  return (
    <section id="contact" className="section-pad bg-slate-50 bg-dot-grid-muted">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* Left */}
          <div>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="type-eyebrow text-grey mb-4"
            >
              Let&apos;s talk
            </motion.p>
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="type-heading font-medium tracking-tight mb-6"
            >
              Drop us a{" "}
              <span className="text-brand">message.</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="type-body-lg text-grey mb-10"
            >
              Tell us your situation. We reply within 24 hours — no strings attached.
            </motion.p>

            {/* Trust signals — staggered list */}
            <motion.div
              variants={staggerFast}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="space-y-4"
            >
              {[
                "Free first consultation",
                "Fully confidential",
                "Response in 24 hours",
              ].map((item, i) => (
                <motion.div
                  key={item}
                  variants={listItem}
                  className="flex items-center gap-3 text-sm text-grey"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 400, damping: 20, delay: i * 0.07 }}
                    className="w-1.5 h-1.5 rounded-full bg-brand shrink-0"
                  />
                  {item}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right — form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl sm:rounded-4xl border border-slate-100 shadow-sm"
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
