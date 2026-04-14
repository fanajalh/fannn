"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Layout,
  ArrowRight,
  Monitor,
  Loader2,
  Upload,
  X,
  ImagePlus,
  Link2,
  FileImage,
  LogIn,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

type FrameItem = {
  id: string
  name: string
  image: string
  description: string
  slots: number
  uploaderName?: string
}

const DEFAULT_FRAMES: FrameItem[] = []

export default function FrameSelectionPage() {
  const { data: session, status: authStatus } = useSession()
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null)
  const [frames, setFrames] = useState<FrameItem[]>(DEFAULT_FRAMES)
  const [loading, setLoading] = useState(true)

  // Upload modal
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadMode, setUploadMode] = useState<"url" | "file">("file")
  const [uploadForm, setUploadForm] = useState({
    name: "",
    description: "",
    image_url: "",
    slots: 4,
  })
  const [previewFile, setPreviewFile] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null) // base64 data URL
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/frames")
        const json = await res.json()
        if (!cancelled && json.success && Array.isArray(json.data) && json.data.length > 0) {
          setFrames(
            json.data.map((r: { slug: string; name: string; image_url: string; description: string | null; slots: number; uploader_name?: string }) => ({
              id: r.slug,
              name: r.name,
              image: r.image_url,
              description: r.description || "",
              slots: r.slots ?? 4,
              uploaderName: r.uploader_name || null,
            }))
          )
        }
      } catch {
        /* fallback DEFAULT_FRAMES */
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const fetchFrames = async () => {
    try {
      const res = await fetch("/api/frames")
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setFrames(
          json.data.map((r: any) => ({
            id: r.slug,
            name: r.name,
            image: r.image_url,
            description: r.description || "",
            slots: r.slots ?? 4,
            uploaderName: r.uploader_name || null,
          }))
        )
      }
    } catch { /* ignore */ }
  }

  const handleStartStudio = () => {
    if (selectedFrame) {
      window.location.href = `/studio?frameId=${encodeURIComponent(selectedFrame)}`
    }
  }

  const handleUploadClick = () => {
    if (authStatus === "loading") return
    if (!session) {
      // Redirect to login
      window.location.href = `/loginUser?callbackUrl=${encodeURIComponent("/frames")}`
      return
    }
    setShowUpload(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar. Maksimal 2MB.")
      return
    }
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar (PNG, JPG, WebP, dll).")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPreviewFile(result)
      setSelectedFile(result)
    }
    reader.readAsDataURL(file)
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    try {
      const payload: any = {
        name: uploadForm.name,
        description: uploadForm.description,
        slots: uploadForm.slots,
      }

      if (uploadMode === "file" && selectedFile) {
        payload.image_file = selectedFile
      } else if (uploadMode === "url" && uploadForm.image_url) {
        payload.image_url = uploadForm.image_url
      } else {
        toast.error("Pilih gambar terlebih dahulu")
        setUploading(false)
        return
      }

      const res = await fetch("/api/frames/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()

      if (!res.ok) {
        toast.error(json.message || "Gagal mengupload frame")
        return
      }

      toast.success("Frame berhasil diupload! 🎉", {
        description: "Frame kamu langsung tampil di halaman ini.",
      })
      setShowUpload(false)
      resetUploadForm()
      fetchFrames()
    } catch {
      toast.error("Jaringan bermasalah, coba lagi.")
    } finally {
      setUploading(false)
    }
  }

  const resetUploadForm = () => {
    setUploadForm({ name: "", description: "", image_url: "", slots: 4 })
    setPreviewFile(null)
    setSelectedFile(null)
    setUploadMode("file")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="bg-[#f4f6f9] min-h-screen pb-28 font-sans select-none relative overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-orange-50 to-transparent pointer-events-none" />
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-orange-200/40 rounded-full blur-[60px] pointer-events-none" />

      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 flex-shrink-0 text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-1.5 rounded-lg shadow-sm shadow-orange-200/50">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-extrabold text-slate-800 text-[15px]">PhotoStudio</h1>
          </div>
        </div>

        {/* Upload button in header */}
        <button
          onClick={handleUploadClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all active:scale-95"
        >
          {session ? (
            <>
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Frame</span>
              <span className="sm:hidden">Upload</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Login & Upload</span>
              <span className="sm:hidden">Login</span>
            </>
          )}
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-5 md:p-10 flex flex-col gap-8 relative z-10">
        <div className="text-center mt-2 mb-2">
          <div className="inline-flex items-center justify-center p-3 bg-white border border-orange-100 rounded-[1.2rem] shadow-sm mb-3">
            <Layout className="w-6 h-6 text-orange-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-[1.2]">
            Pilih <span className="text-orange-500">Bingkai</span>
          </h2>
          <p className="text-[12px] text-slate-400 font-medium mt-1">
            Pilih desain frame untuk photobooth Anda
          </p>
          {loading && (
            <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" /> Memuat frame…
            </p>
          )}
        </div>

        {/* Upload CTA Banner */}
        <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 border-2 border-dashed border-orange-200 rounded-[2rem] p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-sm border border-orange-100 mb-3">
            <ImagePlus className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-lg mb-1">Punya desain frame sendiri?</h3>
          <p className="text-sm text-slate-500 mb-4">Upload frame kamu dan langsung bisa dipakai di PhotoStudio!</p>
          <button
            onClick={handleUploadClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold text-sm rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            {session ? (
              <>
                <Upload className="w-4 h-4" /> Upload Frame Sekarang
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Login untuk Upload
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {frames.map((frame) => (
            <div
              key={frame.id}
              className={`relative bg-white p-5 rounded-[2.5rem] transition-all duration-300 border-2 cursor-pointer ${
                selectedFrame === frame.id
                  ? "border-orange-500 shadow-2xl shadow-orange-500/10 -translate-y-2"
                  : "border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1"
              }`}
              onClick={() => setSelectedFrame(frame.id)}
            >
              {/* User upload badge */}
              {frame.uploaderName && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-wider border border-blue-100">
                    <Upload className="w-2.5 h-2.5" /> Community
                  </span>
                </div>
              )}
              <div className="flex xl:flex-col gap-5 items-center xl:items-start text-center xl:text-left">
                <div className="w-24 h-32 xl:w-full xl:h-48 xl:aspect-[3/4] shrink-0 bg-slate-50 rounded-[1.8rem] flex items-center justify-center border border-slate-100 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={frame.image}
                    alt={frame.name}
                    className="max-w-full max-h-[90%] xl:p-4 object-contain transition-transform duration-700 hover:scale-110"
                  />
                  {selectedFrame === frame.id && (
                    <div className="absolute inset-0 bg-orange-500/10 flex items-center justify-center backdrop-blur-[1px]">
                      <div className="bg-white text-orange-500 rounded-full p-2 shadow-xl animate-in zoom-in-50">
                        <CheckCircle2 size={32} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center xl:w-full items-start xl:items-center">
                  <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest w-max mb-3">
                    {frame.slots} Photos
                  </span>
                  <h3 className="font-extrabold text-slate-800 text-xl leading-tight mb-2 text-left xl:text-center">
                    {frame.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 text-left xl:text-center">
                    {frame.description}
                  </p>
                  {frame.uploaderName && (
                    <p className="text-[10px] text-blue-500 font-bold mt-2">
                      by {frame.uploaderName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 max-w-xl mx-auto w-full flex flex-col sm:flex-row gap-4">
          <Link href="/" className="w-full sm:w-1/3">
            <Button
              variant="ghost"
              className="w-full py-7 border-2 border-slate-200 rounded-[1.5rem] text-[15px] font-bold text-slate-500 hover:text-slate-800 hover:bg-white hover:border-slate-300 transition-all"
            >
              Batalkan
            </Button>
          </Link>
          <Button
            onClick={handleStartStudio}
            disabled={!selectedFrame}
            className="w-full sm:w-2/3 py-7 bg-orange-500 hover:bg-orange-600 text-white rounded-[1.5rem] text-[15px] font-black shadow-xl shadow-orange-500/25 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
          >
            Lanjut ke Studio <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-4 pt-4 pb-6">
          <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-300 uppercase tracking-widest">
            <Layout className="w-3 h-3 text-orange-400" /> Auto Crop
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-300 uppercase tracking-widest">
            <Monitor className="w-3 h-3 text-blue-400" /> Export HQ
          </div>
        </div>
      </main>

      {/* ============== UPLOAD MODAL ============== */}
      {showUpload && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative animate-in slide-in-from-bottom-10 duration-300">
            {/* Header gradient */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-orange-50 to-transparent pointer-events-none rounded-t-[2rem]" />

            <div className="p-6 relative z-10">
              {/* Close & Handle */}
              <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mb-5" />
              <button
                type="button"
                onClick={() => { setShowUpload(false); resetUploadForm() }}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Upload Frame</h3>
                  <p className="text-xs text-slate-500 font-medium">Frame akan langsung tampil di halaman</p>
                </div>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                {/* Nama Frame */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Frame *</label>
                  <input
                    required
                    value={uploadForm.name}
                    onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                    className="w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 transition-all outline-none"
                    placeholder="Contoh: Cherry Blossom Pink"
                    disabled={uploading}
                  />
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deskripsi</label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    className="w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 transition-all outline-none min-h-[72px] resize-none"
                    placeholder="Deskripsi singkat frame kamu..."
                    disabled={uploading}
                  />
                </div>

                {/* Image Mode Toggle */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Gambar Frame *</label>
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setUploadMode("file")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${
                        uploadMode === "file"
                          ? "bg-orange-50 border-orange-300 text-orange-700"
                          : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <FileImage size={16} /> Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode("url")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${
                        uploadMode === "url"
                          ? "bg-orange-50 border-orange-300 text-orange-700"
                          : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <Link2 size={16} /> Pakai URL
                    </button>
                  </div>

                  {uploadMode === "file" ? (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={uploading}
                      />
                      {previewFile ? (
                        <div className="relative">
                          <div className="w-full h-48 bg-slate-50 rounded-xl border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={previewFile} alt="Preview" className="max-w-full max-h-full object-contain p-4" />
                          </div>
                          <button
                            type="button"
                            onClick={() => { setPreviewFile(null); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = "" }}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-36 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50/50 transition-all"
                        >
                          <ImagePlus size={32} />
                          <span className="text-xs font-bold">Klik untuk pilih gambar</span>
                          <span className="text-[10px] text-slate-400">PNG, JPG, WebP • Maks 2MB</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        value={uploadForm.image_url}
                        onChange={(e) => setUploadForm({ ...uploadForm, image_url: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 transition-all outline-none"
                        placeholder="https://cdn.example.com/frame.png"
                        disabled={uploading}
                      />
                      {uploadForm.image_url && (
                        <div className="mt-2 w-full h-36 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={uploadForm.image_url}
                            alt="Preview URL"
                            className="max-w-full max-h-full object-contain p-4"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Slots */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jumlah Foto (Slots)</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={uploadForm.slots}
                    onChange={(e) => setUploadForm({ ...uploadForm, slots: parseInt(e.target.value, 10) || 4 })}
                    className="w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 transition-all outline-none"
                    disabled={uploading}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-4 bg-slate-900 text-white font-black text-sm rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Mengupload...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" /> Upload Frame
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
