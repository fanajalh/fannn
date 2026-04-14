"use client"

import { useEffect, useRef, useState } from "react"
import { Hands, Results } from "@mediapipe/hands"
import { Camera } from "@mediapipe/camera_utils"

interface HandGestureProps {
  onCapture: (imageSrc: string) => void;
}

export default function HandGestureFrame({ onCapture }: HandGestureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const [status, setStatus] = useState("Mencari tangan...")
  const [progress, setProgress] = useState(0) // Untuk loading bar saat menahan gaya
  
  const holdStartTime = useRef<number | null>(null)
  const isCooldown = useRef<boolean>(false) // Mencegah kamera jepret berkali-kali

  useEffect(() => {
    const videoElement = videoRef.current
    const canvasElement = canvasRef.current

    if (!videoElement || !canvasElement) return

    const canvasCtx = canvasElement.getContext("2d")

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    })

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    })

    hands.onResults((results: Results) => {
      canvasCtx!.clearRect(0, 0, canvasElement.width, canvasElement.height)
      // Gambar video asli ke canvas (dibalik agar seperti cermin)
      canvasCtx!.save()
      canvasCtx!.scale(-1, 1)
      canvasCtx!.translate(-canvasElement.width, 0)
      canvasCtx!.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height)
      canvasCtx!.restore()

      if (isCooldown.current) {
        setStatus("Foto Tersimpan! 📸")
        return
      }

      if (results.multiHandLandmarks && results.multiHandLandmarks.length === 2) {
        setStatus("Tahan Posisi... 🎯")
        
        // Memulai timer jika baru mendeteksi
        if (!holdStartTime.current) {
            holdStartTime.current = Date.now()
        }

        const elapsed = Date.now() - holdStartTime.current
        const progressPercent = Math.min((elapsed / 2000) * 100, 100) // 2000ms = 2 detik
        setProgress(progressPercent)

        // JIKA SUDAH DITAHAN SELAMA 2 DETIK -> JEPRET!
        if (progressPercent >= 100) {
            isCooldown.current = true
            setProgress(0)
            holdStartTime.current = null
            
            // Ambil gambar dari canvas
            const imageDataUrl = canvasElement.toDataURL("image/jpeg", 0.9)
            onCapture(imageDataUrl) // Kirim foto ke komponen utama

            // Cooldown 3 detik sebelum bisa jepret lagi
            setTimeout(() => {
                isCooldown.current = false
            }, 3000)
        }

        // Gambar UI Frame merah (dibalik karena kanvas mirror)
        const hand1 = results.multiHandLandmarks[0]
        const hand2 = results.multiHandLandmarks[1]

        const x1 = (1 - hand1[8].x) * canvasElement.width // 1 - x karena cermin
        const y1 = hand1[8].y * canvasElement.height
        const x2 = (1 - hand2[8].x) * canvasElement.width
        const y2 = hand2[8].y * canvasElement.height

        const minX = Math.min(x1, x2)
        const minY = Math.min(y1, y2)
        const width = Math.abs(x1 - x2)
        const height = Math.abs(y1 - y2)

        canvasCtx!.beginPath()
        canvasCtx!.rect(minX, minY, width, height)
        canvasCtx!.lineWidth = 4
        canvasCtx!.strokeStyle = "rgba(255, 69, 0, 0.8)"
        canvasCtx!.stroke()

      } else {
        // Reset timer jika tangan hilang
        setStatus("Bentuk gaya L dengan 2 tangan")
        setProgress(0)
        holdStartTime.current = null
      }
    })

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({ image: videoElement })
      },
      width: 640,
      height: 480,
    })

    camera.start()

    return () => {
      camera.stop()
      hands.close()
    }
  }, [onCapture])

  return (
    <div className="relative flex flex-col items-center justify-center w-full rounded-2xl overflow-hidden bg-black">
      <video ref={videoRef} className="hidden" playsInline></video>
      
      <div className="relative w-full">
        {/* Canvas responsif */}
        <canvas 
          ref={canvasRef} 
          width="640" 
          height="480" 
          className="w-full h-auto rounded-xl border border-slate-700" 
        />
        
        {/* HUD UI Overlay */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm border border-orange-500/30 p-2 rounded-lg font-mono text-orange-400 text-[10px] tracking-wider z-10">
          <p className="animate-pulse">{status}</p>
        </div>

        {/* Loading Bar saat proses Hold Progress */}
        {progress > 0 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 bg-black/50 border border-slate-600 rounded-full h-3 overflow-hidden backdrop-blur-md">
                <div 
                    className="h-full bg-orange-500 transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        )}
      </div>
    </div>
  )
}