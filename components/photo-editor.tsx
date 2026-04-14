"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Move,
  Maximize,
  RotateCcw,
  Check,
  Settings2,
  Wand2
} from "lucide-react"

export interface PhotoAdjustment {
  offsetX: number
  offsetY: number
  scale: number
  filter: string
}

interface PhotoEditorProps {
  photoId: string
  photoSrc: string
  onAdjustment: (adjustment: PhotoAdjustment) => void
}

// Daftar Preset Filter
const FILTERS = [
  { id: "normal", label: "Normal", value: "none", color: "from-slate-200 to-slate-300" },
  { id: "bw", label: "B & W", value: "grayscale(100%)", color: "from-slate-600 to-slate-900" },
  { id: "sepia", label: "Sepia", value: "sepia(100%)", color: "from-amber-600 to-amber-800" },
  { id: "vintage", label: "Vintage", value: "sepia(40%) contrast(150%) saturate(80%)", color: "from-orange-800 to-red-900" },
  { id: "bright", label: "Cerahan", value: "brightness(120%) contrast(110%) saturate(120%)", color: "from-yellow-300 to-orange-400" },
  { id: "cool", label: "Cool", value: "hue-rotate(180deg) saturate(120%)", color: "from-blue-400 to-indigo-600" },
]

export default function PhotoEditor({ photoId, photoSrc, onAdjustment }: PhotoEditorProps) {
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [scale, setScale] = useState(1)
  const [activeFilter, setActiveFilter] = useState("none")

  const handleApply = () => {
    onAdjustment({ offsetX, offsetY, scale, filter: activeFilter })
  }

  const handleReset = () => {
    setOffsetX(0)
    setOffsetY(0)
    setScale(1)
    setActiveFilter("none")
  }

  return (
    <Card className="p-0 bg-white/90 backdrop-blur-xl border-none shadow-[0_15px_50px_-12px_rgba(0,0,0,0.15)] rounded-[2.5rem] overflow-hidden select-none">
      {/* Header Editor */}
      <div className="p-5 md:p-6 border-b border-slate-100 bg-white/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-2.5 rounded-2xl text-white shadow-sm">
            <Settings2 className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-800 leading-tight">Sesuaikan Foto</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Filter, Geser & Perbesar</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          className="w-10 h-10 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-full active:scale-90 transition-all"
        >
          <RotateCcw className="w-5 h-5" strokeWidth={2.5} />
        </Button>
      </div>

      <div className="p-6 md:p-8 space-y-8">

        {/* PREVIEW AREA */}
        <div className="relative group mx-auto max-w-[280px] md:max-w-[320px]">
          <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-rose-400 rounded-[3rem] blur-xl opacity-15 pointer-events-none" />
          <div className="relative aspect-square bg-slate-100 rounded-[2rem] overflow-hidden flex items-center justify-center border-[6px] border-white shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <img
              src={photoSrc}
              alt="Editing preview"
              className="w-full h-full object-cover"
              style={{
                transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
                filter: activeFilter,
                transition: "transform 0.1s ease-out, filter 0.3s ease",
                willChange: "transform, filter"
              }}
            />
            {/* Overlay Grid */}
            <div className="absolute inset-0 border border-white/20 pointer-events-none flex flex-col justify-between mix-blend-overlay">
              <div className="w-full h-1/3 border-b border-white/40 border-dashed" />
              <div className="w-full h-1/3 border-b border-white/40 border-dashed" />
            </div>
            <div className="absolute inset-0 border border-white/20 pointer-events-none flex justify-between mix-blend-overlay">
              <div className="w-1/3 h-full border-r border-white/40 border-dashed" />
              <div className="w-1/3 h-full border-r border-white/40 border-dashed" />
            </div>
          </div>
        </div>

        {/* ================= INI BAGIAN FILTERNYA YANG HILANG ================= */}
        <div className="space-y-3">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 px-1">
            <Wand2 className="w-3.5 h-3.5 text-purple-500" strokeWidth={2.5} /> Efek Filter
          </label>
          <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.value)}
                className="flex flex-col items-center gap-1.5 group shrink-0 outline-none"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${f.color} shadow-sm border-2 transition-all duration-300 ${activeFilter === f.value ? 'border-orange-500 scale-110 shadow-orange-500/30' : 'border-white group-hover:scale-105'}`} />
                <span className={`text-[10px] font-extrabold transition-colors ${activeFilter === f.value ? 'text-orange-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                  {f.label}
                </span>
              </button>
            ))}
          </div>
        </div>
        {/* =================================================================== */}

        {/* KONTROL SLIDER EDITOR */}
        <div className="space-y-5 bg-slate-50 p-5 md:p-6 rounded-[2rem] border border-slate-100">
          <div className="space-y-3">
            <div className="flex justify-between items-end px-1">
              <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-orange-500" strokeWidth={2.5} /> Geser Horizontal
              </label>
            </div>
            <input type="range" min={-150} max={150} value={offsetX} onChange={(e) => setOffsetX(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-600" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end px-1">
              <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-rose-500 rotate-90" strokeWidth={2.5} /> Geser Vertikal
              </label>
            </div>
            <input type="range" min={-150} max={150} value={offsetY} onChange={(e) => setOffsetY(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500 hover:accent-rose-600" />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-end px-1">
              <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Maximize className="w-3.5 h-3.5 text-blue-500" strokeWidth={2.5} /> Perbesar (Zoom)
              </label>
            </div>
            <input type="range" min={0.5} max={3} step={0.05} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-600" />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="pt-2">
          <button
            onClick={handleApply}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white py-4 rounded-[1.2rem] text-[14px] font-extrabold shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all active:scale-95 outline-none"
          >
            <Check className="w-5 h-5" strokeWidth={3} />
            Konfirmasi
          </button>
        </div>

      </div>
    </Card>
  )
}