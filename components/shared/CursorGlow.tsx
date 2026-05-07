"use client"

import { useEffect, useRef } from "react"

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Skip on touch/mobile devices — no cursor to track
    if (window.matchMedia("(hover: none)").matches) return

    let rafId: number
    let x = -9999
    let y = -9999

    const onMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        if (!ref.current) return
        ref.current.style.background =
          `radial-gradient(700px circle at ${x}px ${y}px, rgba(255,45,85,0.07), transparent 40%)`
      })
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
    />
  )
}
