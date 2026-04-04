"use client"

import { Check } from "lucide-react"

interface ProgressBarProps {
  step: number
}

export function ProgressBar({ step }: ProgressBarProps) {
  const labels = ["Layanan", "Detail", "Upload", "Review"]

  return (
    // Padding bottom ditambahkan agar label teks di bawahnya tidak terpotong
    <div className="mb-12 px-2 select-none">
      <div className="flex items-center justify-between relative">
        
        {/* 1. Background Line (Abu-abu lembut) */}
        <div className="absolute left-0 top-5 -translate-y-1/2 w-full h-1.5 bg-slate-100 rounded-full z-0" />
        
        {/* 2. Active Line Progress (Gradient & Glow) */}
        <div
          className="absolute left-0 top-5 -translate-y-1/2 h-1.5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full z-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-[0_0_10px_rgba(249,115,22,0.4)]"
          style={{ width: `${((step - 1) / (labels.length - 1)) * 100}%` }}
        />

        {/* 3. Step Nodes */}
        {labels.map((label, index) => {
          const isCompleted = step > index + 1
          const isActive = step === index + 1
          const isUpcoming = step < index + 1

          return (
            <div key={index} className="relative z-10 flex flex-col items-center group">
              
              {/* Lingkaran Indikator */}
              <div
                className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center font-black text-[15px] transition-all duration-500 relative ${
                  isCompleted
                    ? "bg-orange-500 text-white border-2 border-orange-500 shadow-md"
                    : isActive
                    ? "bg-white text-orange-600 border-[3.5px] border-orange-500 shadow-[0_0_0_4px_rgba(249,115,22,0.15)] scale-110"
                    : "bg-white border-2 border-slate-200 text-slate-400"
                }`}
              >
                {/* Efek Ping/Pulse untuk step yang sedang aktif */}
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-orange-400 opacity-20 animate-ping" />
                )}
                
                {isCompleted ? <Check size={20} strokeWidth={3.5} className="animate-in zoom-in duration-300" /> : index + 1}
              </div>
              
              {/* Label Teks (Diposisikan absolute di bawah agar jarak lingkaran tidak terganggu) */}
              <span
                className={`absolute -bottom-7 whitespace-nowrap text-[9px] md:text-[11px] font-extrabold uppercase tracking-widest transition-colors duration-300 ${
                  isCompleted 
                    ? "text-orange-500" 
                    : isActive 
                    ? "text-slate-800 drop-shadow-sm" 
                    : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}