import HeroSection from "@/components/hero-section"
import SuggestionForm from "@/components/suggestion-form"
import SuggestionList from "@/components/suggestion-list"
import { MobileHeader } from "@/components/MobileHeader"

export default function SaranPage() {
  return (
    <main className="min-h-screen bg-[#FFF6EF] pb-24 font-sans select-none overflow-x-hidden w-full">
      <div className="sticky top-0 z-50 bg-[#FFF6EF]/80 backdrop-blur-xl border-b border-orange-100/50 flex justify-center">
        <div className="w-full max-w-6xl">
          <MobileHeader title="Kotak Saran" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto w-full">
        <HeroSection />
        <SuggestionForm />
        <SuggestionList />
      </div>
    </main>
  )
}