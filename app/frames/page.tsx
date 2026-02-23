"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Camera, 
  CheckCircle2, 
  Sparkles, 
  Layout, 
  ArrowRight,
  Monitor
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const DEFAULT_FRAMES = [
  {
    id: "good-vibes",
    name: "Good Vibes",
    image: "/images/orange-colorful-playful-retro-90-s-good-vibes-photobooth-collage-photostrip-1-removebg-preview.png",
    description: "Retro 90s style with playful ornaments",
    slots: 4
  },
  {
    id: "minimal-modern",
    name: "Classic Strip",
    image: "/images/u.png",
    description: "Clean and elegant layout for any occasion",
    slots: 3
  },
]

export default function FrameSelectionPage() {
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null)

  const handleStartStudio = () => {
    if (selectedFrame) {
      window.location.href = `/studio?frameId=${selectedFrame}`
    }
  }

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] font-sans text-slate-900 overflow-hidden selection:bg-orange-100 selection:text-orange-900">
      
      {/* ================= BACKGROUND DECORATIONS ================= */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#FFF5EC] rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-orange-100 px-6 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline font-bold">Kembali</span>
            </Button>
          </Link>
          <Separator orientation="vertical" className="h-6 bg-orange-100" />
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-black text-lg tracking-tighter">Photo<span className="text-orange-500">Studio</span></h1>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[10px] font-black text-orange-600 uppercase tracking-widest">
            Step 1: Frame Selection
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-12 relative z-10">
        
        {/* ================= PAGE TITLE ================= */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-white border border-orange-100 rounded-2xl shadow-sm mb-2 animate-in fade-in slide-in-from-top-4 duration-500">
            <Layout className="w-6 h-6 text-orange-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.1]">
            Pilih <span className="text-orange-500 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">Bingkai Kreatif</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-lg mx-auto font-medium">
            Bingkai yang tepat membuat setiap momen terasa lebih berkesan. Pilih favoritmu sekarang.
          </p>
        </div>

        {/* ================= FRAME GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
          {DEFAULT_FRAMES.map((frame) => (
            <div
              key={frame.id}
              className="relative group cursor-pointer"
              onClick={() => setSelectedFrame(frame.id)}
            >
              <div className={`relative z-10 bg-white p-5 rounded-[2.5rem] transition-all duration-500 ${
                  selectedFrame === frame.id
                    ? "border-2 border-orange-500 shadow-2xl shadow-orange-900/10 -translate-y-3"
                    : "border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5"
                }`}
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] mb-6 overflow-hidden rounded-[1.8rem] bg-gray-50 flex items-center justify-center border border-gray-50">
                  <img
                    src={frame.image || "/placeholder.svg"}
                    alt={frame.name}
                    className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Selection Overlay */}
                  {selectedFrame === frame.id && (
                    <div className="absolute inset-0 bg-orange-500/5 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="bg-white text-orange-500 p-4 rounded-full shadow-2xl animate-in zoom-in-50 duration-300">
                        <CheckCircle2 size={32} />
                      </div>
                    </div>
                  )}

                  {/* Badge Slots */}
                  <div className="absolute top-4 left-4">
                     <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase text-gray-900 shadow-sm">
                        {frame.slots} Photos
                     </span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="text-center px-2">
                  <h3 className={`font-black text-xl mb-1 tracking-tight transition-colors ${
                    selectedFrame === frame.id ? "text-orange-600" : "text-gray-900"
                  }`}>
                    {frame.name}
                  </h3>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed">
                    {frame.description}
                  </p>
                </div>
              </div>

              {/* Selection Glow Effect */}
              {selectedFrame === frame.id && (
                <div className="absolute -inset-2 bg-orange-400 rounded-[3rem] blur-2xl opacity-10 -z-0 animate-pulse" />
              )}
            </div>
          ))}
        </div>

        {/* ================= ACTION SECTION ================= */}
        <div className="max-w-xl mx-auto text-center space-y-8">
            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/" className="flex-1">
                    <Button
                        variant="outline"
                        className="w-full py-7 border-2 border-gray-100 text-gray-400 hover:text-gray-900 hover:bg-white hover:border-gray-300 rounded-[1.5rem] text-lg font-bold transition-all"
                    >
                        Batalkan
                    </Button>
                </Link>
                <Button
                    onClick={handleStartStudio}
                    disabled={!selectedFrame}
                    className="flex-[1.5] py-7 bg-orange-500 hover:bg-orange-600 text-white rounded-[1.5rem] text-lg font-black shadow-xl shadow-orange-500/25 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
                >
                    Lanjut ke Studio
                    <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
            </div>

            <div className="flex items-center justify-center gap-6 pt-10">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
                    <Sparkles className="w-3 h-3 text-orange-400" />
                    <span>Portrait Mode</span>
                </div>
                <div className="w-1 h-1 bg-gray-200 rounded-full" />
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
                    <Monitor className="w-3 h-3 text-orange-400" />
                    <span>Auto Crop</span>
                </div>
            </div>
        </div>

      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}