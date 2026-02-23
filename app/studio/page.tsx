"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  ArrowLeft, 
  Download, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Image as ImageIcon, 
  Sparkles, 
  Layers, 
  Sticker as StickerIcon,
  Loader2,
  Camera
} from "lucide-react"
import PhotoUploader from "@/components/photo-uploader"
import CanvasComposer from "@/components/canvas-composer"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

// --- Interfaces (Penting agar tidak error) ---
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

  const handlePhotoAdjustment = (photoId: string, adjustment: PhotoAdjustment) => {
    setPhotoAdjustments((prev) => ({ ...prev, [photoId]: adjustment }))
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 p-0 font-sans text-slate-900">
      {/* Header Baru - Lebih Clean */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur-md px-6 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/frames">
            <Button variant="ghost" size="sm" className="gap-2 text-orange-600 hover:bg-orange-100/50">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Ganti Frame</span>
            </Button>
          </Link>
          <Separator orientation="vertical" className="h-6 bg-orange-200" />
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-1.5 rounded-lg shadow-md shadow-orange-200">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">Photo<span className="text-orange-500">Studio</span></h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-white/50 border-orange-200 text-orange-700 px-3 py-1 font-medium hidden md:block">
            {transparentBoxes.length} Slot Terdeteksi
          </Badge>
          <Button 
            onClick={downloadComposite} 
            disabled={photos.length === 0} 
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg shadow-orange-200 transition-all active:scale-95"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Kiri: Kontrol & Assets */}
        <aside className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <Card className="p-6 bg-white/80 border-none shadow-xl shadow-orange-100/50 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-4 h-4 text-orange-500" />
              <h3 className="font-bold text-sm tracking-wide text-slate-700">UPLOAD FOTO</h3>
            </div>
            <PhotoUploader 
              onPhotoAdd={addPhoto} 
              boxCount={transparentBoxes.length} 
              uploadedPhotos={photos.length} 
            />
          </Card>

          <Card className="bg-white/80 border-none shadow-xl shadow-orange-100/50 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-orange-50 bg-orange-50/30 flex items-center gap-2">
              <Layers className="w-4 h-4 text-pink-500" />
              <h3 className="font-bold text-sm text-slate-700">MANAJEMEN LAYER</h3>
            </div>
            <ScrollArea className="h-[350px]">
              {photos.length > 0 ? (
                <div className="p-4 space-y-3">
                  {photos.map((photo, idx) => (
                    <div key={photo.id} className="group flex items-center gap-4 p-3 rounded-xl bg-white border border-transparent hover:border-orange-200 hover:shadow-md transition-all">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-100 border shrink-0">
                        <img src={photo.src} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-orange-400 uppercase">Slot {idx + 1}</p>
                        <p className="text-sm font-semibold text-slate-700 truncate">Foto {idx + 1}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-orange-500" onClick={() => movePhoto(idx, idx - 1)} disabled={idx === 0}>
                                <MoveUp className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Pindah ke Atas</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-red-500" 
                          onClick={() => removePhoto(photo.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[250px] text-slate-400 p-8 text-center">
                  <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm italic">Belum ada foto yang diupload.</p>
                </div>
              )}
            </ScrollArea>
          </Card>
        </aside>

        {/* Area Utama: Canvas Editor */}
        <section className="lg:col-span-8 order-1 lg:order-2">
          {isProcessing ? (
            <Card className="h-[600px] flex flex-col items-center justify-center bg-white/50 border-none rounded-[2.5rem]">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
              <p className="text-orange-600 font-medium">Menganalisa area frame...</p>
            </Card>
          ) : (
            <div className="relative group">
              {/* Efek Glow di Belakang Canvas */}
              <div className="absolute -inset-4 bg-orange-400/10 rounded-[3rem] blur-2xl transition-all group-hover:bg-orange-400/20" />
              
              <Card className="relative p-4 md:p-8 bg-white/90 border-none shadow-2xl rounded-[2.5rem] backdrop-blur-sm overflow-hidden">
                <div className="bg-slate-50/50 rounded-[2rem] p-4 flex items-center justify-center min-h-[650px] shadow-inner border border-white">
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
                
                {/* Petunjuk Penggunaan */}
                <div className="mt-6 flex flex-wrap justify-center gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-orange-400" /> Geser untuk atur posisi</span>
                  <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-pink-400" /> Cubit untuk zoom foto</span>
                </div>
              </Card>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}