"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider" // Opsional jika kamu sudah install slider shadcn
import { 
  Move, 
  Maximize, 
  RotateCcw, 
  Check, 
  Settings2,
  Image as ImageIcon 
} from "lucide-react"

interface PhotoAdjustment {
  offsetX: number
  offsetY: number
  scale: number
}

interface PhotoEditorProps {
  photoId: string
  photoSrc: string
  onAdjustment: (adjustment: PhotoAdjustment) => void
}

export default function PhotoEditor({ photoId, photoSrc, onAdjustment }: PhotoEditorProps) {
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [scale, setScale] = useState(1)

  const handleApply = () => {
    onAdjustment({ offsetX, offsetY, scale })
  }

  const handleReset = () => {
    setOffsetX(0)
    setOffsetY(0)
    setScale(1)
  }

  return (
    <Card className="p-0 bg-white/90 backdrop-blur-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
      {/* Header Editor */}
      <div className="p-6 border-b border-orange-50 bg-orange-50/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-xl text-white">
            <Settings2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-slate-800">Sesuaikan Foto</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleReset}
          className="text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-full"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-8 space-y-8">
        {/* Preview Area dengan Frame Dekoratif */}
        <div className="relative group mx-auto max-w-[300px]">
          <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-pink-400 rounded-[2rem] blur opacity-10" />
          <div className="relative aspect-square bg-slate-100 rounded-[1.5rem] overflow-hidden flex items-center justify-center border-4 border-white shadow-inner">
            <img
              src={photoSrc}
              alt="Editing preview"
              className="w-full h-full object-contain"
              style={{
                transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
                transition: "transform 0.2s cubic-bezier(0.2, 0, 0, 1)",
              }}
            />
            {/* Overlay Grid Guide (Opsional untuk membantu alignment) */}
            <div className="absolute inset-0 border-[1px] border-black/5 pointer-events-none grid grid-cols-3 grid-rows-3">
              <div className="border-r border-b border-black/5" />
              <div className="border-r border-b border-black/5" />
              <div className="border-b border-black/5" />
              <div className="border-r border-b border-black/5" />
              <div className="border-r border-b border-black/5" />
              <div className="border-b border-black/5" />
            </div>
          </div>
        </div>

        {/* Kontrol Editor */}
        <div className="space-y-6">
          {/* Horizontal Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Move className="w-3.5 h-3.5 text-orange-400" />
                Geser Horizontal
              </label>
              <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                {offsetX}px
              </span>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              value={offsetX}
              onChange={(e) => setOffsetX(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          {/* Vertical Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Move className="w-3.5 h-3.5 text-pink-400 rotate-90" />
                Geser Vertikal
              </label>
              <span className="text-xs font-mono font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">
                {offsetY}px
              </span>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              value={offsetY}
              onChange={(e) => setOffsetY(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          {/* Scale Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Maximize className="w-3.5 h-3.5 text-orange-400" />
                Perbesar (Scale)
              </label>
              <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                {scale.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min={0.1}
              max={3}
              step={0.05}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={handleApply}
            className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-6 rounded-2xl text-lg font-bold shadow-lg shadow-orange-200 transition-all active:scale-95"
          >
            <Check className="w-5 h-5 mr-2" />
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </Card>
  )
}