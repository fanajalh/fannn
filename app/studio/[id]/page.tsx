"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowLeft, Download, Trash2, MoveUp, MoveDown, Image as ImageIcon, Sparkles, Layers } from "lucide-react"
import PhotoUploader from "@/components/photo-uploader"
import CanvasComposer from "@/components/canvas-composer"
import PhotoEditor from "@/components/photo-editor"
import Link from "next/link"
import { useParams } from "next/navigation"

// --- Interfaces ---
interface Photo {
  id: string
  src: string
  boxIndex: number
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

export default function StudioPage() {
  const params = useParams()
  const templateId = params.id as string

  // --- States ---
  const [frameImage, setFrameImage] = useState<string | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [transparentBoxes, setTransparentBoxes] = useState<TransparentBox[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [photoAdjustments, setPhotoAdjustments] = useState<Record<string, PhotoAdjustment>>({})
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // --- Logic Functions ---
  useEffect(() => {
    if (templateId) {
      const stored = localStorage.getItem(`template_${templateId}`)
      if (stored) {
        try {
          const data = JSON.parse(stored)
          setFrameImage(data.image)
          detectTransparentAreas(data.image)
        } catch (e) {
          console.error("Failed to load template:", e)
        }
      }
    }
  }, [templateId])

  const handleFrameUpload = (imageData: string) => {
    setFrameImage(imageData)
    if (templateId) {
      localStorage.setItem(`template_${templateId}`, JSON.stringify({ image: imageData }))
    }
    detectTransparentAreas(imageData)
  }

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
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Templates</span>
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <div className="bg-orange-500 p-1.5 rounded-lg text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <h1 className="font-bold text-lg">Arfan<span className="text-orange-500">Studio</span></h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-orange-100 px-3 py-1">
              {transparentBoxes.length} Slots Detected
            </Badge>
            <Button onClick={downloadComposite} disabled={photos.length === 0} className="bg-slate-900 hover:bg-slate-800 text-white gap-2">
              <Download className="w-4 h-4" />
              Export PNG
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <Card className="p-5 border-none shadow-sm bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-orange-500" />
              <h3 className="font-semibold">Photo Assets</h3>
            </div>
            <PhotoUploader onPhotoAdd={addPhoto} boxCount={transparentBoxes.length} uploadedPhotos={photos.length} />
          </Card>

          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <div className="p-4 border-b bg-slate-50/50 flex justify-between items-center text-sm font-semibold">
              Manage Layers ({photos.length})
            </div>
            <ScrollArea className="h-[400px]">
              {photos.length > 0 ? (
                <div className="p-3 space-y-2">
                  {photos.map((photo, idx) => (
                    <div key={photo.id} className="group flex items-center gap-3 p-2 rounded-xl border border-transparent hover:border-orange-200 hover:bg-orange-50/30 transition-all">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-100 border shrink-0">
                        <img src={photo.src} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-500 uppercase">Slot {idx + 1}</p>
                        <p className="text-sm font-semibold truncate text-slate-700">Photo {idx + 1}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => movePhoto(idx, idx - 1)} disabled={idx === 0}>
                          <MoveUp className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => removePhoto(photo.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
                  <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
                  <p className="text-sm italic">Belum ada foto.</p>
                </div>
              )}
            </ScrollArea>
          </Card>
        </aside>

        <section className="lg:col-span-8 order-1 lg:order-2">
          {!frameImage ? (
            <Card className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 bg-white border-2 border-dashed rounded-[2rem]">
              <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mb-6">
                <ImageIcon className="w-10 h-10 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Pilih Template Frame</h2>
              <label>
                <input type="file" accept="image/png,image/jpeg" onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (event) => handleFrameUpload(event.target?.result as string)
                    reader.readAsDataURL(file)
                  }
                }} className="hidden" />
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 rounded-full cursor-pointer">
                  Import Frame
                </Button>
              </label>
            </Card>
          ) : (
            <Card className="p-4 bg-white border-none shadow-2xl rounded-[2rem]">
              <div className="bg-slate-50 rounded-[1.5rem] p-4 flex items-center justify-center min-h-[600px]">
                <CanvasComposer
                  canvasRef={canvasRef}
                  frameImage={frameImage}
                  photos={photos}
                  transparentBoxes={transparentBoxes}
                  photoAdjustments={photoAdjustments}
                  onPhotoAdjustment={handlePhotoAdjustment}
                />
              </div>
            </Card>
          )}
        </section>
      </main>

      {editingPhotoId && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <PhotoEditor
              photoId={editingPhotoId}
              photoSrc={photos.find((p) => p.id === editingPhotoId)?.src || ""}
              onAdjustment={(adj) => {
                handlePhotoAdjustment(editingPhotoId, adj)
                setEditingPhotoId(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}