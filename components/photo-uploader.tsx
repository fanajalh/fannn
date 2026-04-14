"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Camera, 
  Upload, 
  X, 
  FlipHorizontal, 
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Timer,
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
  const [isDragging, setIsDragging] = useState(false)

  // Timer states
  const [timerDuration, setTimerDuration] = useState(3) // 3 detik default
  const [countdown, setCountdown] = useState<number | null>(null)
  const [flashEffect, setFlashEffect] = useState(false)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)

  const remainingSlots = boxCount - uploadedPhotos
  const progressValue = (uploadedPhotos / boxCount) * 100

  useEffect(() => () => {
    stopCamera()
    if (countdownRef.current) clearInterval(countdownRef.current)
  }, [])

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
    setCountdown(null)
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
  }

  const doCapture = useCallback(() => {
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

    // Flash effect
    setFlashEffect(true)
    setTimeout(() => setFlashEffect(false), 400)

    const src = canvas.toDataURL("image/png")
    onPhotoAdd({
      id: `camera_${Date.now()}`,
      src,
      boxIndex: uploadedPhotos,
    })

    stopCamera()
  }, [mirror, onPhotoAdd, uploadedPhotos])

  const startCountdown = useCallback(() => {
    if (countdown !== null) return // already counting

    if (timerDuration === 0) {
      // Instant capture
      doCapture()
      return
    }

    setCountdown(timerDuration)
    let remaining = timerDuration

    countdownRef.current = setInterval(() => {
      remaining -= 1
      if (remaining <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current)
        countdownRef.current = null
        setCountdown(null)
        doCapture()
      } else {
        setCountdown(remaining)
      }
    }, 1000)
  }, [timerDuration, countdown, doCapture])

  const cancelCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
    setCountdown(null)
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (remainingSlots > 0 && !showCamera) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0])
    }
  }

  if (showCamera) {
    return (
      <Card className="p-0 bg-white border-none shadow-2xl rounded-[2rem] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Viewfinder */}
        <div className="relative w-full aspect-[4/3] bg-orange-950 overflow-hidden">
          <video 
            ref={videoRef} 
            className={`w-full h-full object-cover ${mirror ? "-scale-x-100" : ""}`} 
            playsInline 
            muted 
          />
          
          {/* Viewfinder Overlays */}
          <div className="absolute inset-0 border-[20px] border-orange-900/20 pointer-events-none" />
          
          {/* Live Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-orange-900/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-widest">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Live View
          </div>

          {/* Timer Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[10px] font-bold">
            <Timer className="w-3 h-3" />
            {timerDuration}s
          </div>

          {/* Flash Effect */}
          {flashEffect && (
            <div className="absolute inset-0 bg-white animate-out fade-out duration-400 pointer-events-none z-50" />
          )}

          {/* Countdown Overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-40">
              <div className="relative">
                {/* Pulse ring */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-36 h-36 border-4 border-white/30 rounded-full animate-ping" />
                </div>
                {/* Ring progress */}
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="60" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="6" />
                  <circle 
                    cx="70" cy="70" r="60" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 60}`}
                    strokeDashoffset={`${2 * Math.PI * 60 * (1 - countdown / timerDuration)}`}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                {/* Number */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-7xl font-black text-white drop-shadow-2xl animate-in zoom-in-50 duration-300" key={countdown}>
                    {countdown}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="p-5 space-y-3 bg-orange-50/50">
          {cameraError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl p-3 text-red-600 text-xs">
              <AlertCircle className="w-4 h-4" />
              {cameraError}
            </div>
          )}

          {/* Timer Selection */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              <Timer className="w-3 h-3 inline mr-1" />Timer
            </span>
            {[0, 3, 5, 10].map((t) => (
              <button
                key={t}
                onClick={() => { setTimerDuration(t); cancelCountdown() }}
                disabled={countdown !== null}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timerDuration === t
                    ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                    : "bg-white text-slate-500 border border-slate-200 hover:bg-orange-50 hover:text-orange-600"
                } disabled:opacity-50`}
              >
                {t === 0 ? "Off" : `${t}s`}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {countdown !== null ? (
              <Button 
                onClick={cancelCountdown} 
                className="w-full bg-red-500 hover:bg-red-600 text-white py-6 rounded-2xl text-lg font-bold shadow-lg shadow-red-200"
              >
                <X className="w-5 h-5 mr-2" />
                Batalkan ({countdown})
              </Button>
            ) : (
              <Button 
                onClick={startCountdown} 
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-6 rounded-2xl text-lg font-bold shadow-lg shadow-orange-200 active:scale-95 transition-transform"
              >
                <Camera className="w-5 h-5 mr-2" />
                {timerDuration === 0 ? "Ambil Foto" : `Foto (${timerDuration}s)`}
              </Button>
            )}
            
            <div className="flex gap-3">
              <Button
                onClick={() => setMirror((m) => !m)}
                variant="outline"
                disabled={countdown !== null}
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
    <Card 
      className={`p-6 backdrop-blur-sm shadow-xl rounded-[2rem] space-y-6 transition-all duration-300 border-2 ${
        isDragging 
          ? "bg-orange-50/90 border-orange-400 shadow-orange-300/50 scale-[1.01]" 
          : "bg-white/80 border-transparent shadow-orange-100/50"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Slot Status Section */}
      <div className="space-y-3 pointer-events-none">
        <div className="flex justify-between items-end px-1">
          <span className="text-xs font-bold text-orange-400/80 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            Sisa Slot
          </span>
          <span className="text-sm font-black text-orange-900">
            {uploadedPhotos} <span className="text-orange-300">/</span> {boxCount}
          </span>
        </div>
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

        <label className="w-full block group relative">
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => e.target.files && uploadFile(e.target.files[0])}
            disabled={remainingSlots <= 0}
          />
          <div className={`absolute inset-0 z-0 bg-orange-100 rounded-2xl scale-95 transition-transform duration-300 ${isDragging ? "scale-105 opacity-100" : "opacity-0"}`} />
          <Button
            asChild
            disabled={remainingSlots <= 0}
            className={`w-full relative z-10 rounded-2xl py-7 text-base font-bold transition-all active:scale-95 disabled:opacity-30 ${
              isDragging 
                ? "bg-orange-500 text-white shadow-lg shadow-orange-300 pointer-events-none" 
                : "bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-200"
            }`}
          >
            <span className="cursor-pointer">
              <Upload className="w-5 h-5 mr-2" />
              {isDragging ? "Lepaskan Foto di Sini..." : "Unggah File atau Tarik (Drag)"}
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