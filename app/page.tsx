"use client"

import { useState } from "react"
import Navbar from "@/components/sections/Navbar"
import Hero from "@/components/sections/Hero"
import OurApproach from "@/components/sections/OurApproach"
import CoreServices from "@/components/sections/CoreServices"
import NewLaunchSchemes from "@/components/sections/NewLaunchSchemes"
import WhoWeServe from "@/components/sections/WhoWeServe"
import WhyChooseUs from "@/components/sections/WhyChooseUs"
import ContactSection from "@/components/sections/ContactSection"
import Disclaimer from "@/components/sections/Disclaimer"
import FinalCTA from "@/components/sections/FinalCTA"
import Footer from "@/components/sections/Footer"
import ConsultationModal from "@/components/shared/ConsultationModal"
import ErrorBoundary from "@/components/shared/ErrorBoundary"

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false)

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  const scrollToContact = () => {
    const el = document.getElementById("contact")
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen text-slate-900 selection:bg-rose-500/25 overflow-x-hidden" style={{ background: "linear-gradient(to bottom, #ffe4ea 0%, #fff5f7 12%, #fdf8f9 30%, #fdf8f9 100%)" }}>
      <Navbar onBookConsultation={openModal} />

      <Hero onBookConsultation={openModal} onLearnMore={scrollToContact} />
      <OurApproach />
      <ErrorBoundary>
        <CoreServices />
      </ErrorBoundary>
      <ErrorBoundary>
        <NewLaunchSchemes onGetStarted={openModal} />
      </ErrorBoundary>
      <WhoWeServe />
      <WhyChooseUs />
      <ContactSection />
      <FinalCTA onBookConsultation={openModal} />
      <Disclaimer />
      <Footer />

<ConsultationModal open={modalOpen} onClose={closeModal} />
    </div>
  )
}
