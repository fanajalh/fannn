"use client"

import Link from "next/link"
import { Hash, Users, MessageSquare, ShieldCheck, Plus, ArrowRight, Sparkles, MessageCircle } from "lucide-react"

export default function ChatCTA() {
  return (
    <section className="relative py-16 md:py-24 bg-[#FAFAFA] overflow-hidden selection:bg-orange-100 selection:text-orange-900">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1000px] h-[400px] md:h-[600px] bg-orange-100/30 rounded-full blur-[80px] md:blur-[120px] -z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* --- LEFT SIDE: THE CONTENT --- */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full">
              <Sparkles size={14} className="text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">
                Community Hub
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-tighter">
              Bukan Sekadar Chat. <br className="hidden sm:block" />
              <span className="text-orange-500">Ruang Kolaborasi.</span>
            </h2>

            <p className="text-base md:text-lg text-gray-500 font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
              Rasakan pengalaman diskusi realtime ala Discord yang didesain khusus untuk kreator dan klien JokiPoster.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
              <Link href="/commingsoon" className="group w-full sm:w-auto">
                <button className="w-full flex items-center justify-center gap-3 px-8 py-4 md:py-5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl md:rounded-[2rem] transition-all duration-300 shadow-xl shadow-orange-500/25 hover:-translate-y-1 active:scale-95 text-sm md:text-base">
                  Gabung Sekarang
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
              <div className="flex items-center justify-center gap-3 px-4 pt-4 sm:pt-0">
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                   ))}
                </div>
                <span className="text-xs md:text-sm font-bold text-gray-400">120+ Online</span>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: THE DISCORD UI MOCKUP --- */}
          <div className="relative group w-full max-w-[500px] lg:max-w-none mx-auto mt-8 lg:mt-0">
            {/* Main Window */}
            <div className="relative bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-gray-100 flex overflow-hidden h-[350px] md:h-[450px] transform lg:group-hover:rotate-1 transition-transform duration-700">
              
              {/* Discord Sidebar 1 (Mini Icons) - Sembunyi di HP sangat kecil */}
              <div className="hidden sm:flex w-14 md:w-16 bg-gray-50 border-r border-gray-100 flex-col items-center py-4 md:py-6 gap-4">
                 <div className="w-10 h-10 bg-orange-500 rounded-[14px] flex items-center justify-center text-white font-black shadow-lg shadow-orange-500/20">JP</div>
                 <div className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-300 hover:rounded-[14px] hover:bg-orange-100 hover:text-orange-500 transition-all cursor-pointer"><Plus size={20}/></div>
                 <div className="mt-auto w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400"><Users size={18}/></div>
              </div>

              {/* Discord Sidebar 2 (Channel List) - Sembunyi di Mobile */}
              <div className="hidden md:flex w-48 bg-white border-r border-gray-50 flex-col py-6">
                <div className="px-4 mb-8">
                  <div className="h-4 w-24 bg-gray-100 rounded-full mb-2" />
                  <div className="h-3 w-16 bg-gray-50 rounded-full" />
                </div>
                
                <div className="px-2 space-y-1">
                  <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 text-orange-600 rounded-xl font-bold text-xs">
                    <Hash size={14} /> global-chat
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:bg-gray-50 rounded-xl font-bold text-xs transition-colors cursor-pointer group/item">
                    <Hash size={14} className="group-hover/item:text-orange-400" /> perkenalan
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:bg-gray-50 rounded-xl font-bold text-xs transition-colors cursor-pointer group/item">
                    <Hash size={14} className="group-hover/item:text-orange-400" /> bagi-pengalaman
                  </div>
                </div>

                <div className="mt-8 px-4">
                   <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Direct Message</p>
                   <div className="flex items-center gap-2 mb-3">
                      <div className="relative w-6 h-6 rounded-full bg-blue-100">
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 border-2 border-white rounded-full" />
                      </div>
                      <div className="h-2 w-12 bg-gray-100 rounded-full" />
                   </div>
                </div>
              </div>

              {/* Discord Chat Area (Teaser) */}
              <div className="flex-1 flex flex-col bg-[#FAFAFA]">
                 <div className="h-12 md:h-14 border-b border-gray-50 flex items-center px-4 md:px-6 gap-2 bg-white md:bg-transparent">
                    <Hash size={16} className="text-gray-400" />
                    <span className="text-xs font-black text-gray-700 uppercase">global-chat</span>
                 </div>
                 
                 <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-hidden">
                    <div className="flex gap-3">
                       <div className="w-8 h-8 rounded-full bg-orange-100 flex-shrink-0" />
                       <div className="space-y-1.5 w-full">
                          <div className="h-2 w-16 bg-gray-200 rounded-full" />
                          <div className="h-3 w-3/4 max-w-[150px] bg-gray-100 rounded-full" />
                       </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                       <div className="space-y-1.5 flex flex-col items-end w-full">
                          <div className="h-2 w-10 bg-orange-200 rounded-full" />
                          <div className="h-8 w-3/4 max-w-[200px] bg-orange-500 rounded-2xl rounded-tr-none" />
                       </div>
                       <div className="w-8 h-8 rounded-full bg-orange-200 flex-shrink-0" />
                    </div>
                 </div>

                 {/* Fake Input */}
                 <div className="p-3 md:p-4 bg-white md:bg-transparent">
                    <div className="h-10 bg-gray-50 md:bg-white border border-gray-100 rounded-xl flex items-center px-4 justify-between">
                       <div className="h-2 w-20 md:w-24 bg-gray-200 md:bg-gray-100 rounded-full" />
                       <Sparkles size={14} className="text-orange-400" />
                    </div>
                 </div>
              </div>
            </div>

            {/* Floating Badge (Persetujuan Chat) - Menyesuaikan posisi di Mobile */}
            <div className="absolute -bottom-4 right-4 md:-bottom-6 md:-right-6 bg-gray-900 text-white p-4 md:p-5 rounded-2xl md:rounded-[2rem] shadow-2xl border border-gray-800 animate-bounce z-20" style={{ animationDuration: '4s' }}>
               <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <ShieldCheck className="text-emerald-400" size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-emerald-400">Security First</p>
                    <p className="text-[11px] md:text-xs font-bold text-gray-300">End-to-End Private Chat</p>
                  </div>
               </div>
            </div>

            {/* Decor Circles */}
            <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 w-20 h-20 md:w-24 md:h-24 bg-orange-500/10 rounded-full blur-xl md:blur-2xl -z-10" />
          </div>

        </div>
      </div>
    </section>
  )
}