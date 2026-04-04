"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  Camera, 
  CheckCircle2, 
  Layout, 
  ArrowRight,
  Monitor
} from "lucide-react"
import Link from "next/link"

const DEFAULT_FRAMES = [
  {
    id: "good-vibes",
    name: "Good Vibes",
    image: "/images/orange-colorful-playful-retro-90-s-good-vibes-photobooth-collage-photostrip-1-removebg-preview.png",
    description: "Retro 90s style",
    slots: 4
  },
  {
    id: "minimal-modern",
    name: "Classic Strip",
    image: "/images/u.png",
    description: "Clean & elegant layout",
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
    <div className="bg-[#f4f6f9] min-h-screen pb-28 font-sans select-none relative overflow-x-hidden">
      
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-orange-50 to-transparent pointer-events-none" />
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-orange-200/40 rounded-full blur-[60px] pointer-events-none" />

      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 flex-shrink-0 text-slate-500 hover:bg-slate-200 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-1.5 rounded-lg shadow-sm shadow-orange-200/50">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-extrabold text-slate-800 text-[15px]">PhotoStudio</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-5 md:p-10 flex flex-col gap-8 relative z-10">
        
        {/* PAGE TITLE */}
        <div className="text-center mt-2 mb-2">
          <div className="inline-flex items-center justify-center p-3 bg-white border border-orange-100 rounded-[1.2rem] shadow-sm mb-3">
            <Layout className="w-6 h-6 text-orange-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-[1.2]">
             Pilih <span className="text-orange-500">Bingkai</span>
          </h2>
          <p className="text-[12px] text-slate-400 font-medium mt-1">Pilih desain frame untuk photobooth Anda</p>
        </div>

        {/* FRAME GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEFAULT_FRAMES.map((frame) => (
            <div
              key={frame.id}
              className={`relative bg-white p-5 rounded-[2.5rem] transition-all duration-300 border-2 cursor-pointer ${
                  selectedFrame === frame.id
                    ? "border-orange-500 shadow-2xl shadow-orange-500/10 -translate-y-2"
                    : "border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1"
                }`}
              onClick={() => setSelectedFrame(frame.id)}
            >
              <div className="flex xl:flex-col gap-5 items-center xl:items-start text-center xl:text-left">
                <div className="w-24 h-32 xl:w-full xl:h-48 xl:aspect-[3/4] shrink-0 bg-slate-50 rounded-[1.8rem] flex items-center justify-center border border-slate-100 overflow-hidden relative">
                   <img src={frame.image} alt={frame.name} className="max-w-full max-h-[90%] xl:p-4 object-contain transition-transform duration-700 hover:scale-110" />
                   {selectedFrame === frame.id && (
                     <div className="absolute inset-0 bg-orange-500/10 flex items-center justify-center backdrop-blur-[1px]">
                        <div className="bg-white text-orange-500 rounded-full p-2 shadow-xl animate-in zoom-in-50">
                           <CheckCircle2 size={32} />
                        </div>
                     </div>
                   )}
                </div>
                <div className="flex flex-col justify-center xl:w-full items-start xl:items-center">
                   <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest w-max mb-3">
                     {frame.slots} Photos
                   </span>
                   <h3 className="font-extrabold text-slate-800 text-xl leading-tight mb-2 text-left xl:text-center">{frame.name}</h3>
                   <p className="text-xs font-medium text-slate-500 text-left xl:text-center">{frame.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="mt-8 max-w-xl mx-auto w-full flex flex-col sm:flex-row gap-4">
          <Link href="/" className="w-full sm:w-1/3">
             <Button variant="ghost" className="w-full py-7 border-2 border-slate-200 rounded-[1.5rem] text-[15px] font-bold text-slate-500 hover:text-slate-800 hover:bg-white hover:border-slate-300 transition-all">
               Batalkan
             </Button>
          </Link>
          <Button
              onClick={handleStartStudio}
              disabled={!selectedFrame}
              className="w-full sm:w-2/3 py-7 bg-orange-500 hover:bg-orange-600 text-white rounded-[1.5rem] text-[15px] font-black shadow-xl shadow-orange-500/25 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
          >
              Lanjut ke Studio <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-4 pt-4 pb-6">
            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                <Layout className="w-3 h-3 text-orange-400" /> Auto Crop
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                <Monitor className="w-3 h-3 text-blue-400" /> Export HQ
            </div>
        </div>

      </main>
    </div>
  )
}