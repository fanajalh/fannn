"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Camera, 
  Upload, 
  X, 
  FlipHorizontal, 
  CheckCircle2,
  AlertCircle,
  Sparkles
} from "lucide-react"

interface PhotoUploaderProps {
  onPhotoAdd: (photo: { id: string; src: string; boxIndex: number }) => void
  boxCount: number
  uploadedPhotos: number
}

export default function PhotoUploader({ onPhotoAdd, boxCount, uploadedPhotos }: PhotoUploaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [mirror, setMirror] = useState(false)
  const [cameraError, setCameraError] = useState("")

  const remainingSlots = boxCount - uploadedPhotos
  const progressValue = (uploadedPhotos / boxCount) * 100

  useEffect(() => () => stopCamera(), [])

  const startCamera = async () => {
    if (remainingSlots <= 0) return
    setCameraError("")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      })
      streamRef.current = stream
      setShowCamera(true)

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch((err) => {
            console.error("Video play failed:", err)
            setCameraError("Gagal memutar video. Silakan coba lagi.")
          })
        }
      }, 100)
    } catch (err) {
      console.error("Camera error:", err)
      setCameraError("Akses kamera ditolak. Periksa izin browser Anda.")
    }
  }

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setShowCamera(false)
    setCameraError("")
  }

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")!

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    ctx.save()
    if (mirror) {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0)
    ctx.restore()

    const src = canvas.toDataURL("image/png")
    onPhotoAdd({
      id: `camera_${Date.now()}`,
      src,
      boxIndex: uploadedPhotos,
    })

    stopCamera()
  }

  const uploadFile = (file: File) => {
    if (!(file instanceof Blob)) return
    if (remainingSlots <= 0) return

    const reader = new FileReader()
    reader.onload = () => {
      onPhotoAdd({
        id: `upload_${Date.now()}`,
        src: reader.result as string,
        boxIndex: uploadedPhotos,
      })
    }
    reader.readAsDataURL(file)
  }

  if (showCamera) {
    return (
      <Card className="p-0 bg-white border-none shadow-2xl rounded-[2rem] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Viewfinder Style Camera - Ubah background hitam jadi dark orange */}
        <div className="relative w-full aspect-[4/3] bg-orange-950 overflow-hidden">
          <video 
            ref={videoRef} 
            className={`w-full h-full object-cover ${mirror ? "-scale-x-100" : ""}`} 
            playsInline 
            muted 
          />
          
          {/* Viewfinder Overlays */}
          <div className="absolute inset-0 border-[20px] border-orange-900/20 pointer-events-none" />
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-orange-900/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-widest">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Live View
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="p-6 space-y-4 bg-orange-50/50">
          {cameraError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl p-3 text-red-600 text-xs">
              <AlertCircle className="w-4 h-4" />
              {cameraError}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button 
              onClick={capture} 
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-6 rounded-2xl text-lg font-bold shadow-lg shadow-orange-200"
            >
              <Camera className="w-5 h-5 mr-2" />
              Ambil Foto
            </Button>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setMirror((m) => !m)}
                variant="outline"
                className={`flex-1 rounded-xl border-orange-200 py-6 transition-colors ${mirror ? "bg-orange-100 border-orange-300 text-orange-700" : "bg-white text-orange-600 hover:bg-orange-50"}`}
              >
                <FlipHorizontal className="w-4 h-4 mr-2" />
                Mirror
              </Button>
              <Button 
                onClick={stopCamera} 
                variant="ghost" 
                className="flex-1 rounded-xl text-orange-400 hover:text-orange-700 hover:bg-orange-100/50 py-6"
              >
                <X className="w-4 h-4 mr-2" />
                Tutup
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-none shadow-xl shadow-orange-100/50 rounded-[2rem] space-y-6">
      {/* Slot Status Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-end px-1">
          {/* Ubah warna teks slate jadi orange-ish */}
          <span className="text-xs font-bold text-orange-400/80 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            Sisa Slot
          </span>
          <span className="text-sm font-black text-orange-900">
            {uploadedPhotos} <span className="text-orange-300">/</span> {boxCount}
          </span>
        </div>
        {/* Ubah background progress bar */}
        <div className="h-2 w-full bg-orange-50/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-400 to-pink-500 transition-all duration-500 ease-out"
            style={{ width: `${progressValue}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Button
          onClick={startCamera}
          className="w-full bg-white hover:bg-orange-50 border-2 border-orange-200/80 text-orange-600 rounded-2xl py-7 text-base font-bold shadow-sm transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
          disabled={remainingSlots <= 0}
        >
          <Camera className="w-5 h-5 mr-2" />
          Gunakan Kamera
        </Button>

        <label className="w-full block group">
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => e.target.files && uploadFile(e.target.files[0])}
            disabled={remainingSlots <= 0}
          />
          {/* Ubah tombol hitam jadi oranye tua */}
          <Button
            asChild
            disabled={remainingSlots <= 0}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-2xl py-7 text-base font-bold shadow-lg shadow-orange-200 transition-all active:scale-95 disabled:opacity-30"
          >
            <span className="cursor-pointer">
              <Upload className="w-5 h-5 mr-2" />
              Unggah File
            </span>
          </Button>
        </label>
      </div>

      {remainingSlots === 0 && (
        <div className="flex items-center gap-3 bg-orange-100/50 border border-orange-200 rounded-2xl p-4 text-orange-800 animate-in slide-in-from-top-2 duration-500">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-full p-1 text-white">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-tight">Siap Export!</span>
            <span className="text-[10px] opacity-80">Semua slot sudah terisi penuh.</span>
          </div>
        </div>
      )}
    </Card>
  )
}