"use client"

import { useState, useEffect, use } from "react"
import { Download, Camera, Loader2, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [imageData, setImageData] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    ;(async () => {
      try {
        const res = await fetch(`/api/photobooth-share/${token}`)
        const json = await res.json()
        if (json.success) {
          setImageData(json.image)
        } else {
          setError(json.message || "Foto tidak ditemukan")
        }
      } catch {
        setError("Terjadi kesalahan jaringan")
      } finally {
        setLoading(false)
      }
    })()
  }, [token])

  const downloadPhoto = () => {
    if (!imageData) return
    const link = document.createElement("a")
    link.href = imageData
    link.download = `fanajah-photobooth-${Date.now()}.png`
    link.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-orange-400 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(249,115,22,0.3)] animate-pulse">
          <Camera size={32} className="text-white" />
        </div>
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-bold">Memuat foto...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-slate-800 rounded-3xl flex items-center justify-center mb-6 border border-slate-700">
          {error.includes("expired") ? (
            <Clock size={32} className="text-amber-500" />
          ) : (
            <AlertCircle size={32} className="text-red-500" />
          )}
        </div>
        <h1 className="text-2xl font-black text-white mb-2">Oops!</h1>
        <p className="text-slate-400 text-sm mb-8 max-w-xs">{error}</p>
        <Link
          href="/frames"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-orange-500/20"
        >
          <Camera size={18} /> Buat Foto Baru
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-gradient-to-tr from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(249,115,22,0.3)]">
          <Camera size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-black text-white mb-1">Fanajah Photobooth</h1>
        <p className="text-slate-400 text-sm">Hasil foto kamu sudah siap! 📸</p>
      </div>

      {/* Photo */}
      <div className="w-full max-w-md bg-slate-900 rounded-[2rem] p-4 border border-slate-800 shadow-2xl mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageData!}
          alt="Fanajah Photobooth"
          className="w-full rounded-[1.5rem] shadow-lg"
        />
      </div>

      {/* Download Button */}
      <button
        onClick={downloadPhoto}
        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black text-base rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95"
      >
        <Download size={22} /> Download Foto
      </button>

      {/* Footer */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <Link
          href="/frames"
          className="text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors"
        >
          Buat Foto Kamu Sendiri →
        </Link>
        <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest mt-2">
          Fanajah Studio
        </p>
      </div>
    </div>
  )
}
