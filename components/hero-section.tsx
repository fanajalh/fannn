import { Lightbulb, Sparkles, MessageCircle, Heart } from "lucide-react"
// 1. Import fungsi koneksi server Supabase
import { getSupabaseServerClient } from "@/lib/supabase/server"

// 2. Jadikan fungsi komponen menjadi 'async' untuk fetching data di server
export default async function HeroSection() {
  
  return (
    <section id="beranda" className="relative overflow-hidden py-16 md:py-24 lg:py-32">
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#FFE1C6] rounded-full opacity-60 blur-xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#FFA84C] rounded-full opacity-40 blur-2xl" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#FF8F2C] rounded-full opacity-30 blur-xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
              <Sparkles className="w-4 h-4 text-[#FF7A00]" />
              <span className="text-sm font-medium text-[#6B7280]">Suara Anda Berharga</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D2D2D] leading-tight mb-6 text-balance">
              Kotak Saran{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] to-[#FF8F2C]">Desain</span>
            </h1>

            <p className="text-lg md:text-xl text-[#6B7280] mb-8 max-w-xl mx-auto lg:mx-0 text-pretty">
              Bantu kami menjadi lebih baik melalui masukan Anda. Setiap saran adalah langkah menuju perbaikan.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#kirim-saran"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF7A00] to-[#FF8F2C] text-white font-semibold rounded-2xl shadow-lg shadow-[#FF7A00]/30 hover:shadow-xl hover:shadow-[#FF7A00]/40 hover:scale-105 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                Kirim Saran
              </a>
              <a
                href="#daftar-saran"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#FF7A00] font-semibold rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border border-[#FFE1C6]"
              >
                Lihat Saran
              </a>
            </div>
          </div>

          {/* Illustration */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              {/* Main Card */}
              <div className="w-72 h-80 md:w-80 md:h-96 bg-gradient-to-br from-[#FF7A00] to-[#FFA84C] rounded-3xl shadow-2xl shadow-[#FF7A00]/30 p-6 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Lightbulb className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-3 w-full">
                  <div className="h-4 bg-white/30 rounded-full w-full" />
                  <div className="h-4 bg-white/20 rounded-full w-3/4" />
                  <div className="h-4 bg-white/20 rounded-full w-1/2" />
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-bounce">
                <Heart className="w-8 h-8 text-[#FF7A00]" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-[#FFE1C6] rounded-xl shadow-md flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-[#FF7A00]" />
              </div>
              <div className="absolute top-1/2 -right-8 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#FFA84C]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}