"use client"

import { createContext, useContext, useState } from "react"
import dynamic from "next/dynamic"

const ConsultationModal = dynamic(
  () => import("@/components/shared/ConsultationModal"),
  { ssr: false }
)

const ModalContext = createContext<() => void>(() => {})

export function useOpenModal() {
  return useContext(ModalContext)
}

export default function HomeClient({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <ModalContext.Provider value={() => setOpen(true)}>
      {children}
      <ConsultationModal open={open} onClose={() => setOpen(false)} />
    </ModalContext.Provider>
  )
}
