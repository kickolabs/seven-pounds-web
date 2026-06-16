import Navbar from "@/components/sections/Navbar"
import Hero from "@/components/sections/Hero"
import OurApproach from "@/components/sections/OurApproach"
import CoreServices from "@/components/sections/CoreServices"
import NewLaunchSchemes from "@/components/sections/NewLaunchSchemes"
import WhoWeServe from "@/components/sections/WhoWeServe"
import WhyChooseUs from "@/components/sections/WhyChooseUs"
import FAQ from "@/components/sections/FAQ"
import ContactSection from "@/components/sections/ContactSection"
import FinalCTA from "@/components/sections/FinalCTA"
import Disclaimer from "@/components/sections/Disclaimer"
import Footer from "@/components/sections/Footer"
import HomeClient from "@/components/shared/HomeClient"
import ErrorBoundary from "@/components/shared/ErrorBoundary"

export default function HomePage() {
  return (
    <HomeClient>
      <div className="min-h-screen bg-white text-black selection:bg-rose-500/25 overflow-x-hidden">
        <Navbar />
        <Hero />
        <OurApproach />
        <ErrorBoundary>
          <CoreServices />
        </ErrorBoundary>
        <ErrorBoundary>
          <NewLaunchSchemes />
        </ErrorBoundary>
        <WhoWeServe />
        <WhyChooseUs />
        <FAQ />
        <ContactSection />
        <FinalCTA />
        <Disclaimer />
        <Footer />
      </div>
    </HomeClient>
  )
}
