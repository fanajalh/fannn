"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

export function MobileHeader({ title }: { title: string }) {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 w-full bg-white/75 backdrop-blur-2xl border-b border-slate-100/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] select-none">
      <div className="flex items-center justify-between h-[68px] px-4 mx-auto relative">
        
        {/* 1. Tombol Back (Kiri) */}
        <button 
          onClick={() => router.back()} 
          className="relative z-10 w-11 h-11 flex items-center justify-center bg-slate-50/80 border border-slate-200/50 rounded-full active:scale-90 transition-all duration-200 outline-none group hover:bg-slate-100"
          aria-label="Kembali"
        >
          {/* Ikon digeser sedikit ke kiri (pr-0.5) agar terlihat lebih simetris di dalam lingkaran */}
          <ChevronLeft size={24} strokeWidth={2.5} className="text-slate-700 pr-0.5 group-hover:text-orange-600 transition-colors" />
        </button>

        {/* 2. Judul (Tengah Absolut) */}
        {/* Menggunakan absolute inset-x-0 agar posisinya benar-benar di tengah layar, tidak terdorong oleh tombol back */}
        <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-[17px] font-extrabold text-slate-800 tracking-tight leading-none drop-shadow-sm">
            {title}
          </h1>
        </div>

        {/* 3. Spacer (Kanan) */}
        {/* Area kosong di kanan untuk menyeimbangkan layout jika nanti kamu mau tambah tombol lain (misal: titik tiga / share) */}
        <div className="w-11 h-11 relative z-10"></div>
        
      </div>
    </header>
  )
}