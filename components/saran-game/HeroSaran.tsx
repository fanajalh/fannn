"use client"
import { Gamepad2, Flame, MessageSquare } from "lucide-react"

export default function HeroSaran() {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden bg-white border-b border-gray-100 selection:bg-orange-100 selection:text-orange-900">
      
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* =========================================
          FLOATING ANIMATED SVGS (DECORATION)
      ========================================= */}
      
      {/* 1. Mangkuk Mie Instan (Kanan Atas) */}
      <div className="absolute top-16 right-[10%] md:right-[20%] w-24 h-24 text-orange-200/60 animate-[float_4s_ease-in-out_infinite] pointer-events-none hidden sm:block">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 10h16" />
          <path d="M4 14a8 8 0 0 0 16 0H4z" />
          <path d="M8 4v3" className="animate-[pulse_2s_infinite]" />
          <path d="M12 3v4" className="animate-[pulse_2s_infinite_0.5s]" />
          <path d="M16 4v3" className="animate-[pulse_2s_infinite_1s]" />
        </svg>
      </div>

      {/* 2. Koin / Uang Kost (Kiri Bawah) */}
      <div className="absolute bottom-16 left-[5%] md:left-[15%] w-20 h-20 text-yellow-400/40 animate-[float_5s_ease-in-out_infinite_1s] pointer-events-none hidden md:block">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v8" />
          <path d="M10 10h4" />
          <path d="M10 14h4" />
        </svg>
      </div>

      {/* 3. Gamepad Retro (Kiri Atas) */}
      <div className="absolute top-24 left-[10%] w-16 h-16 text-orange-300/50 animate-[float_6s_ease-in-out_infinite_2s] transform -rotate-12 pointer-events-none hidden sm:block">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <path d="M6 12h4" />
          <path d="M8 10v4" />
          <circle cx="15" cy="13" r="1" fill="currentColor" />
          <circle cx="18" cy="11" r="1" fill="currentColor" />
        </svg>
      </div>

      {/* 4. Sparkle Besar (Kanan Bawah) */}
      <div className="absolute bottom-24 right-[15%] w-12 h-12 text-amber-300/50 animate-[spin_8s_linear_infinite] pointer-events-none hidden md:block">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
        </svg>
      </div>

      {/* =========================================
          MAIN CONTENT
      ========================================= */}
      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full mb-8 shadow-sm">
          <Gamepad2 size={16} className="text-orange-500 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-orange-600">Roblox Project</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-6 leading-[1.1]">
          Bantu Bangun <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 drop-shadow-sm relative inline-block">
            Kosan Impian Kita!
            {/* Garis Bawah Melengkung (Aksen) */}
            <svg className="absolute w-full h-4 -bottom-1 left-0 text-yellow-400/30 -z-10" viewBox="0 0 200 20" preserveAspectRatio="none">
              <path d="M0 15 Q100 0 200 15" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
          Game Simulasi Anak Kost butuh ide gila dari kalian! Mulai dari fitur masak mie instan, event dikejar anjing tetangga, sampai ide bangunan untuk map Purwokerto nanti. Tulis semuanya di sini!
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="#tulis-ide" className="group flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-[2rem] transition-all shadow-xl shadow-orange-500/25 active:scale-95 w-full sm:w-auto">
            <Flame size={20} className="group-hover:text-yellow-300 transition-colors" /> Tulis Ide Kamu
          </a>
          <a href="#forum-diskusi" className="group flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 hover:bg-black text-white font-black rounded-[2rem] transition-all shadow-xl shadow-gray-900/10 active:scale-95 w-full sm:w-auto">
            <MessageSquare size={20} className="group-hover:-translate-y-0.5 transition-transform" /> Lihat Diskusi
          </a>
        </div>
      </div>

      {/* CSS untuk Animasi Float */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>

    </section>
  )
}