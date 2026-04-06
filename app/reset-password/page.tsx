"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Suspense } from "react"

function ResetForm() {
  const searchParams = useSearchParams()
  const prefEmail = searchParams.get("email") || ""

  const [email, setEmail] = useState(prefEmail)
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6 || newPassword.length < 8) {
      toast.error("OTP 6 digit dan password minimal 8 karakter")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
          newPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || "Gagal")
        return
      }
      toast.success(data.message || "Berhasil")
      setTimeout(() => {
        window.location.href = "/loginUser"
      }, 1200)
    } catch {
      toast.error("Jaringan bermasalah")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
      <Link
        href="/forgot-password"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 mb-6"
      >
        <ArrowLeft size={18} /> Kembali
      </Link>
      <h1 className="text-2xl font-black text-slate-900">Reset password</h1>
      <p className="text-sm text-slate-500 mt-2">Masukkan email, kode dari email, dan password baru.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full mt-1 px-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-orange-500/15 outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase ml-1 block mb-2">Kode 6 digit</label>
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">Password baru</label>
          <input
            type="password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            className="w-full mt-1 px-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-orange-500/15 outline-none"
            placeholder="Minimal 8 karakter"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 className="animate-spin" size={22} /> : "Simpan password baru"}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-white rounded-3xl p-12 flex justify-center">
            <Loader2 className="animate-spin text-orange-500" />
          </div>
        }
      >
        <ResetForm />
      </Suspense>
    </div>
  )
}
