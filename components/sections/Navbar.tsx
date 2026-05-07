"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useMotionTemplate } from "framer-motion"
import { NAV_LINKS, NAVBAR_HEIGHT } from "@/lib/constants"
import { useLenis } from "@/components/shared/LenisProvider"
import { SPRING } from "@/lib/animations"
import { useOpenModal } from "@/components/shared/HomeClient"

// About, Services | ← brand slides in here → | Plans, Contact
const LEFT_LINKS  = NAV_LINKS.slice(0, 2)
const RIGHT_LINKS = NAV_LINKS.slice(2)

export default function Navbar() {
  const openModal = useOpenModal()
  const [mobileOpen, setMobileOpen] = useState(false)
  const lenis = useLenis()

  // Motion value driven by scroll — no boolean snap, pure interpolation
  const scrollYMV = useMotionValue(0)

  // Left brand: visible at top, fades + shrinks out during scroll
  const brandLeftOpacity = useTransform(scrollYMV, [120, 320], [1, 0])
  const brandLeftScale   = useTransform(scrollYMV, [120, 320], [1, 0.75])

  // Pill brand slot: grows and fades in as left brand disappears
  const brandPillMaxWidth   = useTransform(scrollYMV, [180, 380], [0, 176])
  const brandPillOpacity    = useTransform(scrollYMV, [200, 400], [0, 1])
  // Cancel the left gap-8 (32px) when slot is collapsed so Services/Plans stay 1 gap apart
  const brandPillMarginLeft = useTransform(scrollYMV, [180, 380], ["-32px", "0px"])

  // Pill background: transparent at top, fills in as user scrolls
  const pillBgOpacity   = useTransform(scrollYMV, [0, 140], [0, 0.92])
  const pillBlur        = useTransform(scrollYMV, [0, 140], [4, 8])
  const pillShadowAlpha = useTransform(scrollYMV, [0, 140], [0, 0.14])
  const pillBackground  = useMotionTemplate`rgba(15, 23, 42, ${pillBgOpacity})`
  const pillBackdrop    = useMotionTemplate`blur(${pillBlur}px)`
  const pillShadow      = useMotionTemplate`0 0 10px rgba(0,0,0,${pillShadowAlpha})`
  // Nav link text: dark at top (readable on white hero), white when pill fills in
  const navLinkR = useTransform(scrollYMV, [0, 140], [15, 255])
  const navLinkG = useTransform(scrollYMV, [0, 140], [23, 255])
  const navLinkB = useTransform(scrollYMV, [0, 140], [42, 255])
  const navTextColor = useMotionTemplate`rgb(${navLinkR}, ${navLinkG}, ${navLinkB})`

  useEffect(() => {
    const onScroll = () => scrollYMV.set(window.scrollY)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [scrollYMV])

  const scrollTo = (href: string) => {
    setMobileOpen(false)
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
    <header
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-16 py-4
        pointer-events-auto md:pointer-events-none
        bg-white/20 backdrop-blur-[12px] border-b border-white/10
        md:bg-transparent md:backdrop-blur-none md:border-none"
    >
      <div className="max-w-7xl mx-auto flex items-center pointer-events-auto relative">

        {/* LEFT: brand fades out as user scrolls */}
        <div className="flex-1 flex justify-start">
          {/* Desktop: scroll-driven fade */}
          <motion.button
            style={{ opacity: brandLeftOpacity, scale: brandLeftScale, originX: 0 }}
            className="hidden md:block text-xl font-semibold tracking-tight text-slate-900 select-none whitespace-nowrap"
            onClick={() => scrollTo("#hero")}
          >
            The Seven Pounds
          </motion.button>

          {/* Mobile: always visible */}
          <button
            className="md:hidden text-lg font-semibold tracking-tight text-slate-900 select-none"
            onClick={() => scrollTo("#hero")}
          >
            The Seven Pounds
          </button>
        </div>

        {/* CENTER: dark pill */}
        <div className="flex-shrink-0 hidden md:block">
          <motion.div
            className="flex items-center gap-8 px-8 py-3 rounded-full"
            style={{
              background: pillBackground,
              boxShadow: pillShadow,
              backdropFilter: pillBackdrop,
              color: navTextColor,
            }}
          >
            {LEFT_LINKS.map((link) => (
              <motion.button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="group relative opacity-80 hover:opacity-100 transition-opacity text-sm font-light whitespace-nowrap"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 h-px bg-current w-0 group-hover:w-full transition-all duration-200" />
              </motion.button>
            ))}

            {/* Brand slot — grows into view between Services and Plans */}
            <motion.div
              className="overflow-hidden flex items-center justify-center"
              style={{ maxWidth: brandPillMaxWidth, opacity: brandPillOpacity, marginLeft: brandPillMarginLeft }}
            >
              <button
                onClick={() => scrollTo("#hero")}
                className="text-white text-sm font-semibold whitespace-nowrap tracking-tight
                  border-l border-r border-white/20 px-5 py-0.5 select-none"
              >
                The Seven Pounds
              </button>
            </motion.div>

            {RIGHT_LINKS.map((link) => (
              <motion.button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="group relative opacity-80 hover:opacity-100 transition-opacity text-sm font-light whitespace-nowrap"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 h-px bg-current w-0 group-hover:w-full transition-all duration-200" />
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* RIGHT: CTA + mobile hamburger */}
        <div className="flex-1 flex justify-end items-center gap-4">
          <div className="hidden md:flex">
            <button
              onClick={openModal}
              className="px-6 py-3 rounded-full text-white text-sm font-medium
                transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
              style={{
                background: "rgba(255, 45, 85, 0.9)",
                boxShadow: "0 0 8px rgba(0,0,0,0.1)",
                backdropFilter: "blur(8px)",
              }}
            >
              Book Consultation
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="md:hidden w-[46px] h-[46px] flex items-center justify-center rounded-full"
            style={{
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.35)",
              boxShadow: "0 4px 30px rgba(0,0,0,0.08)",
            }}
          >
            <div className="flex flex-col gap-[5px] items-center justify-center">
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                className="block w-[22px] h-[2px] bg-slate-800 rounded-full origin-center"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className="block w-[22px] h-[2px] bg-slate-800 rounded-full"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                className="block w-[22px] h-[2px] bg-slate-800 rounded-full origin-center"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: SPRING }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 pt-4 pb-6"
          >
            <div className="space-y-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="block w-full text-left text-base font-medium text-slate-600
                    hover:text-slate-900 transition-colors py-3.5 border-b border-slate-100 last:border-0"
                >
                  {link.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setMobileOpen(false); openModal() }}
              className="w-full mt-5 px-6 py-3.5 rounded-full bg-brand text-white text-sm font-semibold tracking-wide"
            >
              Book Consultation
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
