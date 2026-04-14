"use client"

import { useState, useRef, useEffect, useCallback, Suspense } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  ArrowRight,
  Trash2,
  MoveUp,
  MoveDown,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Loader2,
  Camera,
  Settings2,
  X,
  Mail,
  Download,
  Film,
  QrCode,
  CheckCircle2,
  Share2,
  Plus,
  Eye,
  Wand2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import PhotoUploader from "@/components/photo-uploader"
import CanvasComposer from "@/components/canvas-composer"
import PhotoEditor from "@/components/photo-editor"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import QRCode from "qrcode"
import { loadImage, encodeGifWithDelays } from "@/lib/gif-encoder"

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
  filter?: string
}

const FALLBACK_FRAMES: Record<string, string> = {}

// ============================================================
// STEP INDICATOR COMPONENT
// ============================================================
function StepIndicator({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  const steps = [
    { num: 1, label: "Ambil Foto", icon: Camera },
    { num: 2, label: "Edit", icon: Wand2 },
    { num: 3, label: "Hasil", icon: Download },
  ]

  return (
    <div className="flex items-center justify-center gap-1 px-4 py-3">
      {steps.map((step, idx) => {
        const Icon = step.icon
        const isActive = currentStep === step.num
        const isDone = currentStep > step.num

        return (
          <div key={step.num} className="flex items-center gap-1">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 ${
                  isActive
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-110"
                    : isDone
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>
              <span
                className={`text-[10px] font-extrabold uppercase tracking-wider hidden sm:block transition-colors duration-300 ${
                  isActive
                    ? "text-orange-600"
                    : isDone
                    ? "text-emerald-600"
                    : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`w-8 sm:w-12 h-0.5 rounded-full mx-1 transition-colors duration-500 ${
                  isDone ? "bg-emerald-400" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ============================================================
// MAIN STUDIO CONTENT
// ============================================================
function StudioPageContent() {
  const searchParams = useSearchParams()
  const frameId = searchParams.get("frameId") || "good-vibes"
  const [frameMap, setFrameMap] = useState<Record<string, string>>(FALLBACK_FRAMES)

  useEffect(() => {
    let cancelled = false
    fetch("/api/frames")
      .then((r) => r.json())
      .then((json) => {
        if (cancelled || !json.success || !Array.isArray(json.data)) return
        const next = { ...FALLBACK_FRAMES }
        for (const row of json.data) {
          if (row.slug && row.image_url) next[row.slug] = row.image_url
        }
        setFrameMap(next)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const frameImage = frameMap[frameId] || frameMap["good-vibes"]

  // --- Core States ---
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [stickers, setStickers] = useState<Sticker[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [transparentBoxes, setTransparentBoxes] = useState<TransparentBox[]>([])
  const [isProcessing, setIsProcessing] = useState(true)
  const [photoAdjustments, setPhotoAdjustments] = useState<Record<string, PhotoAdjustment>>({})
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null)

  // --- Email ---
  const [emailInput, setEmailInput] = useState("")
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailSuccess, setEmailSuccess] = useState(false)

  // --- QR Code ---
  const [showQrModal, setShowQrModal] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [qrShareUrl, setQrShareUrl] = useState<string | null>(null)
  const [isGeneratingQr, setIsGeneratingQr] = useState(false)

  // --- GIF ---
  const [showGifModal, setShowGifModal] = useState(false)
  const [gifDataUrl, setGifDataUrl] = useState<string | null>(null)
  const [isGeneratingGif, setIsGeneratingGif] = useState(false)
  const [gifProgress, setGifProgress] = useState(0)

  const getGifLoadingText = (p: number) => {
    if (p < 20) return "Memproses gambar dasar..."
    if (p < 60) return "Menambahkan efek animasi..."
    if (p < 90) return "Menyatukan frame (encoding)..."
    return "Menyelesaikan file final..."
  }

  // --- Step transition animation ---
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goToStep = (step: 1 | 2 | 3) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentStep(step)
      setIsTransitioning(false)
    }, 200)
  }

  // --- Deteksi Area Transparan ---
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

  const clearAllPhotos = () => {
    if (confirm("Hapus semua foto?")) {
      setPhotos([])
      setPhotoAdjustments({})
    }
  }

  const movePhoto = (fromIndex: number, toIndex: number) => {
    const newPhotos = [...photos]
    const [movedPhoto] = newPhotos.splice(fromIndex, 1)
    newPhotos.splice(toIndex, 0, movedPhoto)
    setPhotos(newPhotos.map((p, i) => ({ ...p, boxIndex: i })))
  }

  const handleAdjustmentSave = (adjustment: PhotoAdjustment) => {
    if (editingPhotoId) {
      setPhotoAdjustments(prev => ({
        ...prev,
        [editingPhotoId]: adjustment
      }))
      setEditingPhotoId(null)
    }
  }

  // Action: Download
  const downloadComposite = () => {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.href = canvasRef.current.toDataURL("image/png", 1.0)
    link.download = `fanajah-photobooth-${Date.now()}.png`
    link.click()
  }

  // Action: Send Email
  const handleSendEmail = async () => {
    if (!emailInput) {
      alert("Masukkan alamat emailmu dulu ya!")
      return
    }
    const canvas = canvasRef.current
    if (!canvas) return

    const base64Image = canvas.toDataURL("image/png", 1.0)

    setIsSendingEmail(true)
    try {
      const response = await fetch('/api/send-photobooth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, image: base64Image })
      })

      if (response.ok) {
        setEmailSuccess(true)
        setTimeout(() => setEmailSuccess(false), 4000)
        setEmailInput("")
      } else {
        alert("Gagal mengirim email. Coba lagi nanti.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Terjadi kesalahan jaringan.")
    } finally {
      setIsSendingEmail(false)
    }
  }

  // ========== QR CODE ==========
  const handleGenerateQr = async () => {
    if (!canvasRef.current) return
    setIsGeneratingQr(true)
    setShowQrModal(true)
    setQrDataUrl(null)
    setQrShareUrl(null)

    try {
      const base64Image = canvasRef.current.toDataURL("image/png", 0.8)

      const res = await fetch("/api/photobooth-share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      })
      const json = await res.json()

      if (!json.success) throw new Error(json.message)

      const qrPng = await QRCode.toDataURL(json.shareUrl, {
        width: 400,
        margin: 2,
        color: { dark: "#1e293b", light: "#ffffff" },
        errorCorrectionLevel: "M",
      })
      setQrDataUrl(qrPng)
      setQrShareUrl(json.shareUrl)
    } catch (err) {
      console.error("QR Generation error:", err)
      alert("Gagal membuat QR Code. Coba lagi.")
      setShowQrModal(false)
    } finally {
      setIsGeneratingQr(false)
    }
  }

  const downloadQr = () => {
    if (!qrDataUrl) return
    const link = document.createElement("a")
    link.href = qrDataUrl
    link.download = `fanajah-qr-${Date.now()}.png`
    link.click()
  }

  // ========== GIF GENERATOR (Live Photo — NO TEMPLATE) ==========
  const handleGenerateGif = useCallback(async () => {
    if (photos.length === 0) return
    setIsGeneratingGif(true)
    setShowGifModal(true)
    setGifDataUrl(null)
    setGifProgress(0)

    try {
      // Load all photo images
      const photoImgs: HTMLImageElement[] = []
      for (const photo of photos) {
        const img = await loadImage(photo.src)
        photoImgs.push(img)
      }

      // Standard GIF canvas size (portrait oriented)
      const W = 600
      const H = 800

      const gifCanvas = document.createElement("canvas")
      gifCanvas.width = W
      gifCanvas.height = H
      const gifCtx = gifCanvas.getContext("2d")!

      // Helper: Draw a photo cover-fit into the full canvas
      const drawPhotoCoverFit = (
        ctx: CanvasRenderingContext2D,
        img: HTMLImageElement,
        bounceScale: number = 1
      ) => {
        ctx.save()
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, W, H)

        const coverScale = Math.max(W / img.width, H / img.height) * bounceScale
        const fw = img.width * coverScale
        const fh = img.height * coverScale
        const dx = (W - fw) / 2
        const dy = (H - fh) / 2
        ctx.drawImage(img, dx, dy, fw, fh)
        ctx.restore()
      }

      // Bounce easing
      const bounceEase = (t: number): number => {
        if (t < 0.4) return 1.15 - 0.15 * (t / 0.4)
        if (t < 0.7) return 1.0 - 0.03 * ((t - 0.4) / 0.3)
        return 0.97 + 0.03 * ((t - 0.7) / 0.3)
      }

      const allFrames: { data: ImageData; delay: number }[] = []

      // Frame 0: White intro
      gifCtx.fillStyle = "#ffffff"
      gifCtx.fillRect(0, 0, W, H)
      allFrames.push({ data: gifCtx.getImageData(0, 0, W, H), delay: 300 })
      setGifProgress(5)

      // Each photo: bounce animation
      const bounceSteps = 5
      for (let i = 0; i < photoImgs.length; i++) {
        for (let step = 0; step < bounceSteps; step++) {
          const t = step / (bounceSteps - 1)
          const scale = bounceEase(t)
          drawPhotoCoverFit(gifCtx, photoImgs[i], scale)
          allFrames.push({
            data: gifCtx.getImageData(0, 0, W, H),
            delay: step === bounceSteps - 1 ? 500 : 60,
          })
        }
        setGifProgress(5 + Math.round(((i + 1) / photoImgs.length) * 65))
      }

      // Hold last photo
      drawPhotoCoverFit(gifCtx, photoImgs[photoImgs.length - 1], 1)
      allFrames.push({ data: gifCtx.getImageData(0, 0, W, H), delay: 1500 })
      setGifProgress(75)

      // Encode GIF
      const gifBlob = await encodeGifWithDelays(allFrames, W, H, (p) => setGifProgress(75 + Math.round(p * 25)))
      const gifUrl = URL.createObjectURL(gifBlob)
      setGifDataUrl(gifUrl)
      setGifProgress(100)
    } catch (err) {
      console.error("GIF generation error:", err)
      alert("Gagal membuat GIF. Coba lagi.")
      setShowGifModal(false)
    } finally {
      setIsGeneratingGif(false)
    }
  }, [photos])

  const downloadGif = () => {
    if (!gifDataUrl) return
    const link = document.createElement("a")
    link.href = gifDataUrl
    link.download = `fanajah-livephoto-${Date.now()}.gif`
    link.click()
  }

  const photoToEdit = photos.find(p => p.id === editingPhotoId)

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="bg-[#f4f6f9] min-h-screen font-sans select-none w-full relative overflow-x-hidden">

      {/* HEADER */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-5 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {currentStep === 1 ? (
            <Link href="/frames" className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 flex-shrink-0 text-slate-500 hover:bg-slate-200 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={() => goToStep((currentStep - 1) as 1 | 2)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 flex-shrink-0 text-slate-500 hover:bg-orange-100 hover:text-orange-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-1.5 rounded-lg shadow-sm shadow-orange-200/50">
              <Camera className="w-3.5 h-3.5 text-white" />
            </div>
            <h1 className="font-extrabold text-slate-800 text-[14px]">Fanajah Studio</h1>
          </div>
        </div>

        {/* Step-specific header button */}
        {currentStep === 1 && (
          <button
            onClick={() => goToStep(2)}
            disabled={photos.length === 0}
            className="bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 active:scale-95 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:shadow-none"
          >
            Lanjut <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
        {currentStep === 2 && (
          <button
            onClick={() => goToStep(3)}
            disabled={photos.length === 0}
            className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 active:scale-95 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:shadow-none"
          >
            Selesai <CheckCircle2 className="w-3.5 h-3.5" />
          </button>
        )}
        {currentStep === 3 && (
          <button
            onClick={() => goToStep(2)}
            className="bg-slate-700 hover:bg-slate-800 text-white shadow-md active:scale-95 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all"
          >
            <Wand2 className="w-3.5 h-3.5" /> Edit Lagi
          </button>
        )}
      </header>

      {/* STEP INDICATOR */}
      <StepIndicator currentStep={currentStep} />

      {/* CONTENT AREA with transition */}
      <div
        className={`transition-all duration-300 ease-out origin-top ${
          isTransitioning ? "opacity-0 scale-[0.98] -translate-y-2" : "opacity-100 scale-100 translate-y-0 animate-in slide-in-from-right-4 fade-in duration-500"
        }`}
      >
        {/* ==================== STEP 1: TAKE ==================== */}
        {currentStep === 1 && (
          <main className="max-w-2xl mx-auto p-4 md:p-8 pb-32 space-y-6">

            {/* Title */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-slate-800">📸 Ambil Foto</h2>
              <p className="text-sm text-slate-500">Gunakan kamera atau upload foto dari galeri</p>
            </div>

            {isProcessing ? (
              <div className="bg-white rounded-[2rem] p-12 shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                <div className="text-center">
                  <h3 className="font-extrabold text-slate-700">Menyiapkan Studio</h3>
                  <p className="text-xs font-medium text-slate-400 mt-1">Sedang memproses frame...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Progress */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-orange-400" /> Progress Foto
                    </span>
                    <span className="text-sm font-black text-slate-700">
                      {photos.length} <span className="text-slate-300">/</span> {transparentBoxes.length || "?"}
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-400 to-pink-500 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${transparentBoxes.length ? (photos.length / transparentBoxes.length) * 100 : 0}%` }}
                    />
                  </div>
                  {photos.length >= transparentBoxes.length && transparentBoxes.length > 0 && (
                    <div className="flex items-center gap-2 mt-3 text-emerald-600 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Semua slot terisi! Klik &quot;Lanjut&quot; untuk edit.</span>
                    </div>
                  )}
                </div>

                {/* Uploader */}
                <PhotoUploader
                  onPhotoAdd={addPhoto}
                  boxCount={transparentBoxes.length}
                  uploadedPhotos={photos.length}
                />

                {/* Photo Grid Preview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-orange-500" /> Foto yang Diambil
                    </h3>
                    {photos.length > 0 && (
                      <button onClick={clearAllPhotos} className="text-[10px] items-center gap-1 font-bold text-red-500 hover:bg-red-50 px-2 py-1 rounded-md transition-colors flex">
                        <Trash2 className="w-3 h-3" /> Hapus Semua
                      </button>
                    )}
                  </div>
                  
                  {photos.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {photos.map((photo, idx) => (
                        <div
                          key={photo.id}
                          className="relative group bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all w-20 h-20 sm:w-24 sm:h-24 shrink-0"
                        >
                          <img
                            src={photo.src}
                            alt={`Foto ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {/* Overlay badge */}
                          <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                            Slot {idx + 1}
                          </div>
                          {/* Delete button */}
                          <button
                            onClick={() => removePhoto(photo.id)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500/90 backdrop-blur-md text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 active:scale-90 transition-all hover:bg-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl flex flex-col items-center justify-center py-10 px-4 text-center">
                      <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
                      <p className="text-xs font-bold text-slate-400">Belum ada foto</p>
                      <p className="text-[10px] text-slate-400 mt-1">Gunakan kamera atau upload untuk mulai.</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Bottom CTA */}
            {photos.length > 0 && (
              <button
                onClick={() => goToStep(2)}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Lanjut ke Edit <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </main>
        )}

        {/* ==================== STEP 2: EDIT ==================== */}
        {currentStep === 2 && (
          <main className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start pb-32">

            {/* CANVAS AREA */}
            <section className="relative z-10 w-full lg:col-span-8 order-1">
              {isProcessing ? (
                <div className="w-full aspect-[3/4] flex flex-col items-center justify-center bg-white border border-slate-100 rounded-[2rem] shadow-sm">
                  <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-3" />
                  <p className="text-xs font-bold text-slate-400">Menganalisa Frame...</p>
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
                    <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-orange-400" /> Layer Stiker</span>
                    <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-pink-400" /> Filter Canggih</span>
                  </div>
                </div>
              )}
            </section>

            {/* TOOLS COLUMN */}
            <div className="flex flex-col gap-5 lg:col-span-4 order-2">
              {/* LAYER MANAGEMENT */}
              <section className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-4 h-4 text-pink-500" />
                  <h3 className="font-extrabold text-[13px] text-slate-800">LAYERS FOTO</h3>
                </div>

                <ScrollArea className="h-[250px] md:h-[350px] bg-slate-50 rounded-[1.2rem] p-2 border border-slate-100">
                  {photos.length > 0 ? (
                    <div className="space-y-2">
                      {photos.map((photo, idx) => (
                        <div key={photo.id} className="flex items-center gap-2.5 p-2 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-orange-200 transition-colors">
                          <img src={photo.src} alt="Uploaded" className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black uppercase text-orange-500">Slot {idx + 1}</p>
                            <p className="text-xs font-bold text-slate-700 truncate">Foto {idx + 1}</p>
                          </div>

                          {/* ACTION BUTTONS */}
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => setEditingPhotoId(photo.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-50 text-orange-500 hover:bg-orange-100 hover:text-orange-600 active:scale-90 transition-colors"
                              title="Edit & Filter"
                            >
                              <Settings2 size={14} strokeWidth={2.5} />
                            </button>
                            <button
                              onClick={() => movePhoto(idx, idx - 1)}
                              disabled={idx === 0}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-orange-50 hover:text-orange-500 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
                              title="Pindah ke Atas"
                            >
                              <MoveUp size={14} strokeWidth={2.5} />
                            </button>
                            <button
                              onClick={() => movePhoto(idx, idx + 1)}
                              disabled={idx === photos.length - 1}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-orange-50 hover:text-orange-500 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
                              title="Pindah ke Bawah"
                            >
                              <MoveDown size={14} strokeWidth={2.5} />
                            </button>
                            <button
                              onClick={() => removePhoto(photo.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 active:scale-90 transition-colors"
                              title="Hapus"
                            >
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

              {/* ADD MORE PHOTOS */}
              <section className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <Plus className="w-4 h-4 text-orange-500" />
                  <h3 className="font-extrabold text-[13px] text-slate-800">TAMBAH FOTO</h3>
                </div>
                <PhotoUploader
                  onPhotoAdd={addPhoto}
                  boxCount={transparentBoxes.length}
                  uploadedPhotos={photos.length}
                />
              </section>

              {/* FINISH BUTTON (Mobile) */}
              <button
                onClick={() => goToStep(3)}
                disabled={photos.length === 0}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:shadow-none lg:hidden"
              >
                <CheckCircle2 className="w-4 h-4" /> Selesai — Lihat Hasil
              </button>
            </div>
          </main>
        )}

        {/* ==================== STEP 3: RESULT ==================== */}
        {currentStep === 3 && (
          <main className="max-w-4xl mx-auto p-4 md:p-8 pb-32 space-y-6">

            {/* Title */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-slate-800">🎉 Foto Kamu Sudah Jadi!</h2>
              <p className="text-sm text-slate-500">Simpan, bagikan, atau buat GIF dari foto-foto kamu</p>
            </div>

            {/* Canvas Preview (read-only) */}
            <div className="bg-white p-4 md:p-6 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100">
              <div className="bg-slate-50 rounded-[1.5rem] p-3 flex items-center justify-center w-full min-h-[300px] md:min-h-[500px] border border-orange-50 overflow-hidden">
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
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={downloadComposite}
                className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 active:scale-95 transition-all group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <Download className="text-white" size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider group-hover:text-orange-600 transition-colors">Download</span>
              </button>

              <button
                onClick={handleGenerateGif}
                disabled={photos.length === 0}
                className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-purple-200 active:scale-95 transition-all group disabled:opacity-40"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                  <Film className="text-white" size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider group-hover:text-purple-600 transition-colors">Live Photo</span>
              </button>

              <button
                onClick={handleGenerateQr}
                className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 active:scale-95 transition-all group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <QrCode className="text-white" size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">Scan QR</span>
              </button>

              <button
                onClick={() => goToStep(2)}
                className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-300 active:scale-95 transition-all group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-500/20 group-hover:scale-110 transition-transform">
                  <Wand2 className="text-white" size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider group-hover:text-slate-800 transition-colors">Edit Lagi</span>
              </button>
            </div>

            {/* Email Section */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500" />
                <h3 className="font-extrabold text-[13px] text-slate-800 uppercase tracking-wider">Kirim ke Email</h3>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="email"
                    placeholder="Masukkan alamat email..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 pl-10 pr-4 py-3 rounded-xl outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/10 transition-all text-sm placeholder:text-slate-400"
                  />
                </div>
                <button
                  onClick={handleSendEmail}
                  disabled={isSendingEmail}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-5 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center min-w-[90px]"
                >
                  {isSendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : "Kirim"}
                </button>
              </div>

              {emailSuccess && (
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium bg-emerald-50 p-3 rounded-lg border border-emerald-200 animate-in fade-in slide-in-from-bottom-2">
                  <CheckCircle2 size={16} />
                  <span>Foto berhasil dikirim ke emailmu!</span>
                </div>
              )}
            </div>
          </main>
        )}
      </div>

      {/* ================= MODAL EDITOR FOTO ================= */}
      {editingPhotoId && photoToEdit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-[400px] animate-in zoom-in-95 duration-300 relative">
            <button
              onClick={() => setEditingPhotoId(null)}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/20 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
            <PhotoEditor
              photoId={photoToEdit.id}
              photoSrc={photoToEdit.src}
              onAdjustment={handleAdjustmentSave}
            />
          </div>
        </div>
      )}

      {/* ================= MODAL QR CODE ================= */}
      {showQrModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-[2rem] w-full max-w-sm text-center shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <X size={16} strokeWidth={3} />
            </button>

            <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30">
              <QrCode size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1">Scan QR Code</h3>
            <p className="text-slate-500 text-xs mb-6">Scan dengan HP untuk download foto langsung</p>

            {isGeneratingQr ? (
              <div className="py-12 flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-xs font-bold text-slate-400">Membuat QR Code...</p>
              </div>
            ) : qrDataUrl ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 inline-block shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrDataUrl} alt="QR Code" className="w-56 h-56 mx-auto" />
                </div>
                {qrShareUrl && (
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Link Share</p>
                    <p className="text-xs text-slate-600 font-mono break-all">{qrShareUrl}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={downloadQr}
                    className="flex-1 py-3 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Download size={16} /> Simpan QR
                  </button>
                  <button
                    onClick={() => { if (qrShareUrl) navigator.clipboard.writeText(qrShareUrl).then(() => alert("Link disalin!")) }}
                    className="flex-1 py-3 bg-emerald-500 text-white font-bold text-sm rounded-xl hover:bg-emerald-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Share2 size={16} /> Salin Link
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-2">Link berlaku 24 jam</p>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ================= MODAL GIF ================= */}
      {showGifModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-[2rem] w-full max-w-sm text-center shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowGifModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <X size={16} strokeWidth={3} />
            </button>

            <div className="w-14 h-14 bg-gradient-to-tr from-purple-500 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-purple-500/30">
              <Film size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1">Live Photo GIF</h3>
            <p className="text-slate-500 text-xs mb-6">Foto-foto kamu jadi animasi live photo!</p>

            {isGeneratingGif ? (
              <div className="py-8 flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                <div className="w-full max-w-[200px]">
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{getGifLoadingText(gifProgress)}</span>
                    <span className="text-[10px] font-black text-purple-600">{gifProgress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${gifProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : gifDataUrl ? (
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={gifDataUrl} alt="GIF Preview" className="w-full rounded-xl" />
                </div>
                <button
                  onClick={downloadGif}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Download size={18} /> Download GIF
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}

    </div>
  )
}

export default function StudioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-orange-500" /></div>}>
      <StudioPageContent />
    </Suspense>
  )
}