// app/saran/page.tsx (KODE AWAL)

import HeroSection from "@/components/hero-section"
import SuggestionForm from "@/components/suggestion-form"
import SuggestionList from "@/components/suggestion-list"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export default function Home() { // NAMA FUNGSI: Home
  return (
    <main className="min-h-screen bg-[#FFF6EF]">
      <Navbar />  
      <HeroSection />
      <SuggestionForm />
      <SuggestionList />
      <Footer />      
    </main>
  )
}