// pages/HomePage.tsx

import Hero from "@/components/sections/Hero"
import Services from "@/components/sections/Services"
import Lynk from "@/components/sections/Lynk" 
import Pricing from "@/components/sections/Pricing"
import Portfolio from "@/components/sections/Portfolio"
import Contact from "@/components/sections/Contact"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <Portfolio />
      <Pricing />
      <Lynk/> 
      <Contact />
      <Footer />
    </main>
  )
}