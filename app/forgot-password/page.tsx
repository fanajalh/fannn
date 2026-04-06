"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, Mail, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      const data = await res.json()
      if (res.status === 429) {
        toast.error(data.message || "Terlalu banyak permintaan")
        return
      }
      if (!res.ok) {
        toast.error(data.message || "Gagal")
        return
      }
      toast.success(data.message || "Selesai")
    } catch {
      toast.error("Jaringan bermasalah")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <Link
          href="/loginUser"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 mb-6"
        >
          <ArrowLeft size={18} /> Kembali
        </Link>
        <h1 className="text-2xl font-black text-slate-900">Lupa password</h1>
        <p className="text-sm text-slate-500 mt-2">
          Masukkan email. Jika terdaftar, kode reset akan dikirim.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 outline-none"
                placeholder="email@contoh.com"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={22} /> : "Kirim kode reset"}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-6">
          Sudah punya kode?{" "}
          <Link href="/reset-password" className="text-orange-600 font-bold">
            Atur ulang password
          </Link>
        </p>
      </div>
    </div>
  )
}
