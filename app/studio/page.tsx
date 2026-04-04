"use client"

import { useState, useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  ArrowLeft, 
  Trash2, 
  MoveUp, 
  Image as ImageIcon, 
  Sparkles, 
  Layers, 
  Loader2,
  Camera
} from "lucide-react"
import PhotoUploader from "@/components/photo-uploader"
import CanvasComposer from "@/components/canvas-composer"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

// --- Interfaces ---
interface Photo {
  id: string
  src: string
  boxIndex: number
}

interface Sticker {
  id: string
  src: string
  x: number
  y: number
  size: number
  rotation: number
}

interface TransparentBox {
  x: number
  y: number
  width: number
  height: number
  index: number
}

interface PhotoAdjustment {
  offsetX: number
  offsetY: number
  scale: number
}

const FRAMES: Record<string, string> = {
  "good-vibes": "/images/orange-colorful-playful-retro-90-s-good-vibes-photobooth-collage-photostrip-1-removebg-preview.png",
  "u-frame": "/images/u.png",
}

export default function StudioPage() {
  const searchParams = useSearchParams()
  const frameId = searchParams.get("frameId") || "good-vibes"
  const frameImage = FRAMES[frameId] || FRAMES["good-vibes"]
  
  // --- States ---
  const [stickers, setStickers] = useState<Sticker[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [transparentBoxes, setTransparentBoxes] = useState<TransparentBox[]>([])
  const [isProcessing, setIsProcessing] = useState(true)
  const [photoAdjustments, setPhotoAdjustments] = useState<Record<string, PhotoAdjustment>>({})
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // --- Logika Deteksi Area Transparan ---
  useEffect(() => {
    detectTransparentAreas(frameImage)
  }, [frameImage])

  const detectTransparentAreas = (imageSrc: string) => {
    setIsProcessing(true)
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      const boxes: TransparentBox[] = []
      const visited = new Set<number>()
      let boxIndex = 0

      for (let i = 3; i < data.length; i += 4) {
        const pixelIndex = (i - 3) / 4
        if (data[i] < 128 && !visited.has(pixelIndex)) {
          const { x, y, width, height } = floodFill(data, canvas.width, canvas.height, pixelIndex, visited)
          if (width > 30 && height > 30) {
            boxes.push({ x, y, width, height, index: boxIndex })
            boxIndex++
          }
        }
      }
      setTransparentBoxes(boxes)
      setIsProcessing(false)
    }
    img.src = imageSrc
  }

  const floodFill = (data: Uint8ClampedArray, width: number, height: number, startPixel: number, visited: Set<number>) => {
    const startY = Math.floor(startPixel / width)
    const startX = startPixel % width
    let minX = startX, maxX = startX, minY = startY, maxY = startY
    const stack = [startPixel]

    while (stack.length > 0) {
      const pixel = stack.pop()!
      if (visited.has(pixel)) continue
      visited.add(pixel)
      const y = Math.floor(pixel / width)
      const x = pixel % width
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)

      const neighbors = [pixel - width, pixel + width, pixel - 1, pixel + 1]
      for (const neighbor of neighbors) {
        if (neighbor >= 0 && neighbor < data.length / 4 && !visited.has(neighbor)) {
          if (data[neighbor * 4 + 3] < 128) stack.push(neighbor)
        }
      }
    }
    return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 }
  }

  // --- Handlers ---
  const addPhoto = (photo: Photo) => setPhotos([...photos, photo])

  const removePhoto = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id))
    const newAdjustments = { ...photoAdjustments }
    delete newAdjustments[id]
    setPhotoAdjustments(newAdjustments)
  }

  const movePhoto = (fromIndex: number, toIndex: number) => {
    const newPhotos = [...photos]
    const [movedPhoto] = newPhotos.splice(fromIndex, 1)
    newPhotos.splice(toIndex, 0, movedPhoto)
    setPhotos(newPhotos.map((p, i) => ({ ...p, boxIndex: i })))
  }

  const downloadComposite = async () => {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.href = canvasRef.current.toDataURL("image/png")
    link.download = `photobooth-${Date.now()}.png`
    link.click()
  }

  return (
    <div className="bg-[#f4f6f9] min-h-screen pb-28 font-sans select-none w-full relative overflow-x-hidden">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/frames" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 flex-shrink-0 text-slate-500 hover:bg-slate-200 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-1.5 rounded-lg shadow-sm shadow-orange-200/50">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-extrabold text-slate-800 text-[15px]">PhotoStudio</h1>
          </div>
        </div>

        <button 
          onClick={downloadComposite} 
          disabled={photos.length === 0} 
          className="bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 active:scale-95 text-[11px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl flex-shrink-0 transition-all disabled:opacity-50 disabled:shadow-none"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        
        {/* CANVAS AREA */}
        <section className="relative z-10 w-full lg:col-span-8 order-1">
          {isProcessing ? (
            <div className="w-full aspect-[3/4] flex flex-col items-center justify-center bg-white border border-slate-100 rounded-[2rem] shadow-sm">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-3" />
              <p className="text-xs font-bold text-slate-400">Menganalisa...</p>
            </div>
          ) : (
            <div className="w-full bg-white p-3 md:p-5 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 relative">
              <div className="bg-slate-50 rounded-[1.5rem] p-3 flex items-center justify-center w-full min-h-[400px] md:min-h-[600px] border border-orange-50 overflow-hidden relative">
                <CanvasComposer
                  canvasRef={canvasRef}
                  frameImage={frameImage}
                  photos={photos}
                  transparentBoxes={transparentBoxes}
                  photoAdjustments={photoAdjustments}
                  stickers={stickers}
                  setStickers={setStickers}
                />
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-4 md:gap-6 text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest pb-1">
                 <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-orange-400" /> Geser Foto</span>
                 <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-pink-400" /> Cubit Zoom</span>
              </div>
            </div>
          )}
        </section>

        {/* TOOLS COLUMN */}
        <div className="flex flex-col gap-5 lg:col-span-4 order-2">
          {/* UPLOADER */}
          <section className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
               <ImageIcon className="w-4 h-4 text-orange-500" />
               <h3 className="font-extrabold text-[13px] text-slate-800">UPLOADS ({photos.length}/{transparentBoxes.length})</h3>
            </div>
            <PhotoUploader 
              onPhotoAdd={addPhoto} 
              boxCount={transparentBoxes.length} 
              uploadedPhotos={photos.length} 
            />
          </section>

          {/* LAYER MANAGEMENT */}
          <section className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
               <Layers className="w-4 h-4 text-pink-500" />
               <h3 className="font-extrabold text-[13px] text-slate-800">LAYERS</h3>
            </div>

            <ScrollArea className="h-[250px] md:h-[350px] bg-slate-50 rounded-[1.2rem] p-2 border border-slate-100">
              {photos.length > 0 ? (
                <div className="space-y-2">
                  {photos.map((photo, idx) => (
                    <div key={photo.id} className="flex items-center gap-3 p-2 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-orange-200 transition-colors">
                      <img src={photo.src} alt="Uploaded" className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                      <div className="flex-1">
                        <p className="text-[9px] font-black uppercase text-orange-500">Slot {idx + 1}</p>
                        <p className="text-xs font-bold text-slate-700 truncate">Foto {idx + 1}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0 pr-1">
                        <button onClick={() => movePhoto(idx, idx - 1)} disabled={idx === 0} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-orange-500 active:scale-90 disabled:opacity-30 transition-colors">
                          <MoveUp size={14} strokeWidth={2.5} />
                        </button>
                        <button onClick={() => removePhoto(photo.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-red-500 active:scale-90 transition-colors">
                          <Trash2 size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-40">
                    <ImageIcon size={28} className="mb-2" />
                    <span className="text-xs font-bold">Belum ada foto</span>
                  </div>
              )}
            </ScrollArea>
          </section>
        </div>

      </main>
    </div>
  )
}