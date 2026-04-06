"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Palette, Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [step, setStep] = useState<"cred" | "otp">("cred")
  const [otpValue, setOtpValue] = useState("")

  const sendOtp = async () => {
    if (!formData.email?.trim() || !formData.password) {
      toast.error("Isi email dan password")
      return
    }
    setSendingOtp(true)
    try {
      const res = await fetch("/api/auth/send-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      })
      const data = await res.json()
      if (res.status === 429) {
        toast.error(data.message || "Terlalu banyak permintaan")
        return
      }
      if (res.status === 503) {
        toast.error(data.message || "Email tidak dapat dikirim")
        return
      }
      if (!res.ok) {
        toast.error(data.message || "Gagal")
        return
      }
      toast.success(data.message || "Periksa email Anda")
      setStep("otp")
      setOtpValue("")
    } catch {
      toast.error("Jaringan bermasalah")
    } finally {
      setSendingOtp(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === "cred") {
      await sendOtp()
      return
    }

    setLoading(true)
    try {
      const { signIn } = await import("next-auth/react")
      const res = await signIn("credentials", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        otp: otpValue.trim(),
        redirect: false,
      })

      if (res?.error) throw new Error(res.error)

      toast.success("Welcome back!", { description: "Redirecting…" })
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 800)
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error("Login Failed", {
        description: error.message || "Invalid credentials.",
      })
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-2000" />

      <div className="w-full max-w-md px-8 pt-10 pb-16 z-10 flex flex-col h-full justify-between">
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center mb-12">
            <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-3xl flex items-center justify-center shadow-xl shadow-orange-500/30 mb-6 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
              <Palette className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {step === "otp" ? "Kode verifikasi" : "Welcome Back"}
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              {step === "otp"
                ? "Masukkan 6 digit dari email Anda."
                : "Log in to manage your spaces."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === "otp" && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    setStep("cred")
                    setOtpValue("")
                  }}
                  className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800"
                >
                  <ArrowLeft size={18} /> Kembali
                </button>
                <div className="flex justify-center py-2">
                  <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
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
                <p className="text-center text-xs text-slate-400">
                  <button type="button" className="text-orange-600 font-bold" onClick={() => void sendOtp()}>
                    Kirim ulang kode
                  </button>
                </p>
              </div>
            )}

            {step === "cred" && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading || sendingOtp}
                    autoComplete="email"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 text-base font-semibold placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all disabled:opacity-50"
                    placeholder="admin@domain.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={loading || sendingOtp}
                      autoComplete="current-password"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 text-base font-semibold placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all pr-14 disabled:opacity-50"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading || sendingOtp}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-orange-500 transition-colors focus:outline-none disabled:opacity-50 select-none"
                    >
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </>
            )}

            <div className="pt-6">
              <button
                type="submit"
                disabled={
                  loading ||
                  sendingOtp ||
                  (step === "otp" && otpValue.length !== 6)
                }
                className="w-full relative flex items-center justify-center py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed select-none"
              >
                {loading || sendingOtp ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    {sendingOtp ? "Mengirim…" : "Signing In..."}
                  </>
                ) : step === "cred" ? (
                  "Kirim kode ke email"
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors select-none"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
