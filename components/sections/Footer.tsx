"use client"

import { motion } from "framer-motion"
import { Phone, Mail } from "lucide-react"
import {
  NAV_LINKS,
  NAVBAR_HEIGHT,
  SUPPORT_PHONE_DISPLAY,
  SUPPORT_PHONE_TEL,
  SUPPORT_EMAIL,
  SOCIAL_LINKS,
} from "@/lib/constants"
import { useLenis } from "@/components/shared/LenisProvider"
import { fadeUp, fadeIn, staggerFast, listItem, defaultViewport } from "@/lib/animations"
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from "@/components/shared/social-icons"

const socialIconClass =
  "flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white"

export default function Footer() {
  const lenis = useLenis()

  const scrollTo = (href: string) => {
    const id = href.replace("#", "")
    const el = document.getElementById(id)
    if (!el) return
    if (lenis) {
      lenis.scrollTo(el, { offset: -NAVBAR_HEIGHT, duration: 1.4 })
    } else {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="bg-slate-950 border-t border-slate-800 px-4 sm:px-6 md:px-8 lg:px-16 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12 md:mb-16">

          {/* Brand */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="md:col-span-1"
          >
            <div className="type-card-heading font-semibold tracking-tight text-white mb-4">
              The Seven Pounds
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              EMI relief &amp; financial stability consultancy. The Seven Pounds — structured guidance to sort your EMIs, cut stress, and build lasting stability.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={socialIconClass}
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className={socialIconClass}
              >
                <FacebookIcon size={16} />
              </a>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className={socialIconClass}
              >
                <WhatsAppIcon size={16} />
              </a>
            </div>
          </motion.div>

          {/* Navigation */}
          <div>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="type-eyebrow text-white/60 mb-6"
            >
              Navigation
            </motion.p>
            <motion.ul
              variants={staggerFast}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="space-y-3"
            >
              {NAV_LINKS.map((link) => (
                <motion.li key={link.href} variants={listItem}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Contact */}
          <div>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="type-eyebrow text-white/60 mb-6"
            >
              Contact
            </motion.p>
            <motion.ul
              variants={staggerFast}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="space-y-3 text-sm text-white/60"
            >
              {["Financial Relief Consultancy", "Chennai, India"].map((line) => (
                <motion.li key={line} variants={listItem}>{line}</motion.li>
              ))}
              <motion.li variants={listItem}>
                <a
                  href={SUPPORT_PHONE_TEL}
                  className="inline-flex items-center gap-2 hover:text-white transition-colors duration-300"
                >
                  <Phone size={15} className="shrink-0 text-white/40" aria-hidden="true" />
                  {SUPPORT_PHONE_DISPLAY}
                </a>
              </motion.li>
              <motion.li variants={listItem}>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="inline-flex items-center gap-2 hover:text-white transition-colors duration-300"
                >
                  <Mail size={15} className="shrink-0 text-white/40" aria-hidden="true" />
                  {SUPPORT_EMAIL}
                </a>
              </motion.li>
            </motion.ul>
          </div>
        </div>

        {/* Bottom bar */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} The Seven Pounds. All rights reserved.
          </p>
          <p className="text-xs text-white/60">
            Financial guidance subject to individual eligibility and terms.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
