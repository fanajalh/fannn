"use client"

import { MessageSquare, Users, BookOpen, Sparkles, Zap, ShieldCheck, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ChatHomePage() {
  const categories = [
    {
      id: "global",
      title: "Global Chat",
      desc: "Ruang diskusi umum untuk sapa-menyapa seluruh member JokiPoster.",
      icon: MessageSquare,
      color: "text-blue-500",
      bg: "bg-blue-50",
      count: "120+ Member"
    },
    {
      id: "perkenalan",
      title: "Ruang Kenalan",
      desc: "Cari partner desain atau sekadar kenalan dengan sesama pengguna.",
      icon: Users,
      color: "text-orange-500",
      bg: "bg-orange-50",
      count: "Active Now"
    },
    {
      id: "pengalaman",
      title: "Bagi Pengalaman",
      desc: "Tempat sharing tips desain, pengalaman order, dan inspirasi kreatif.",
      icon: BookOpen,
      color: "text-purple-500",
      bg: "bg-purple-50",
      count: "45 Cerita"
    }
  ]

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#FAFAFA] p-6 md:p-12 selection:bg-orange-100">
      
      {/* --- HERO SECTION --- */}
      <div className="max-w-4xl mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-orange-100 rounded-full mb-6 shadow-sm">
          <Sparkles size={14} className="text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Community Hub</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
          Selamat Datang di <br />
          <span className="text-orange-500">Ruang Diskusi.</span>
        </h1>
        <p className="text-lg text-gray-500 font-medium max-w-xl leading-relaxed">
          Pilih channel di bawah untuk mulai mengobrol secara realtime atau cari partner kolaborasi desain Anda.
        </p>
      </div>

      {/* --- BENTO GRID CHANNELS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {categories.map((item, idx) => (
          <Link key={item.id} href={`/chat/${item.id}`} className="group">
            <div className="h-full bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-500 hover:-translate-y-2 flex flex-col">
              <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <item.icon size={28} />
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-black text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-auto pt-6 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.count}</span>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* --- QUICK STATS / INFO --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-[60px] opacity-20" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-emerald-400" size={24} />
              <h4 className="font-bold uppercase tracking-widest text-xs">Private Networking</h4>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-medium mb-6">
              Ingin obrolan lebih mendalam? Klik profil pengguna di dalam chat untuk mengirim permintaan <b>Chat Private</b> yang aman dan terenkripsi.
            </p>
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gray-700 flex items-center justify-center text-[10px] font-bold">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-gray-900 bg-orange-500 flex items-center justify-center text-[10px] font-bold">+12</div>
            </div>
          </div>
        </div>

        <div className="bg-orange-500 rounded-[2.5rem] p-8 text-white shadow-xl shadow-orange-500/20 flex flex-col justify-center items-center text-center">
            <Zap size={40} className="mb-4 text-orange-200 animate-pulse" />
            <h4 className="text-2xl font-black mb-2">Realtime Engine</h4>
            <p className="text-orange-100 text-sm font-medium leading-relaxed">
                Pesan terkirim secara instan tanpa perlu refresh halaman. Cobalah menyapa sekarang!
            </p>
        </div>
      </div>

    </div>
  )
}