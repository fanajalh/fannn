"use client"

// Import komponen-komponen yang sudah dipisah
import HeroSaran from "@/components/saran-game/HeroSaran"
import FormSaran from "@/components/saran-game/FormSaran"
import ForumList from "@/components/saran-game/ForumList"

export default function GameFeedbackPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-orange-200 selection:text-orange-900 font-sans">
      
      {/* 1. Komponen Hero */}
      <HeroSaran />

      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* 2. Komponen Form (Kiri / Atas) */}
        <div className="lg:col-span-5">
          <FormSaran />
        </div>

        {/* 3. Komponen Daftar Forum (Kanan / Bawah) */}
        <div className="lg:col-span-7">
          <ForumList />
        </div>
        
      </div>
    </div>
  )
}