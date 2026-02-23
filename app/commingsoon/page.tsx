"use client"

import Link from "next/link"
import { ArrowLeft, Flashlight, Sparkles } from "lucide-react"

export default function ComingSoonShinePage() {
  return (
    // --- CONTAINER UTAMA (TEMA GELAP PEKAT) ---
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-orange-500/20 selection:text-orange-100">
      
      {/* --- AMBIENT BACKGROUND LIGHT --- */}
      {/* Cahaya oranye samar di tengah untuk memberi kedalaman */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-900/20 rounded-full blur-[120px] pointer-events-none" />


      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 flex flex-col items-center text-center">
        
        {/* Ikon Pendukung (Senter kecil di atas) */}
        <div className="mb-8 animate-pulse text-orange-700/50 flex items-center gap-2">
            <Sparkles size={20} className="blur-[1px]" />
            <Flashlight size={24} className="-rotate-45 blur-[1px]" />
        </div>

        {/* --- THE SHINING TEXT --- */}
        {/* Triknya ada di class tailwind yang panjang ini:
            1. text-transparent bg-clip-text: Membuat teks jadi tembus pandang, isinya mengikuti background.
            2. bg-[linear-gradient(...)]: Membuat background gradasi (Gelap -> Terang -> Gelap).
            3. bg-[length:250%...]: Membuat background lebih lebar dari teksnya.
            4. hover:bg-[position:100%_0]: Saat di-hover, background digeser dari kiri ke kanan.
            5. transition-all duration-[1500ms]: Membuat pergeseran background jadi halus (1.5 detik).
        */}
        <h1 
          className="
            text-7xl md:text-9xl lg:text-[12rem] font-black tracking-tighter uppercase leading-none
            text-transparent bg-clip-text 
            bg-[linear-gradient(110deg,#333333,45%,#ffffff,55%,#333333)] 
            bg-[length:250%_100%] 
            hover:bg-[position:100%_0] 
            transition-[background-position] duration-[1500ms] ease-in-out
            cursor-default
            mb-6
          "
        >
          COMING <br /> SOON
        </h1>

        <p className="text-gray-500 text-lg md:text-xl max-w-xl font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          Sesuatu yang besar sedang menanti di balik kegelapan. Arahkan kursor Anda untuk melihat kilaunya.
        </p>
        
        {/* Back Button (Gaya Minimalis Gelap) */}
        <Link href="/" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Kembali</span>
        </Link>

      </div>
    </div>
  )
}