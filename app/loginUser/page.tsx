"use client"

import { useState } from "react"
import Link from "next/link"
import { Palette, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

type AuthStep = "form" | "otp"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<AuthStep>("form")
  const [otpValue, setOtpValue] = useState("")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  })

  // ─── LOGIN: Send OTP ───────────────────────────────────
  const sendLoginOtp = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Isi email dan password")
      return
    }
    setSendingOtp(true)
    try {
      const res = await fetch("/api/auth/send-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
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
        toast.error(data.message || "Gagal mengirim kode")
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

  // ─── REGISTER: Create Account + Send OTP ───────────────
  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.username) {
      toast.error("Isi semua data terlebih dahulu")
      return
    }
    if (formData.password.length < 6) {
      toast.error("Password minimal 6 karakter")
      return
    }
    setSendingOtp(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.username,
        }),
      })
      const data = await res.json()
      if (res.status === 429) {
        toast.error(data.message || "Terlalu banyak permintaan")
        return
      }
      if (res.status === 503) {
        toast.error(data.message || "Kode OTP gagal dikirim")
        return
      }
      if (!res.ok) {
        toast.error(data.message || "Gagal membuat akun")
        return
      }
      toast.success("Akun berhasil dibuat!", { description: "Periksa email untuk kode verifikasi." })
      setStep("otp")
      setOtpValue("")
    } catch {
      toast.error("Jaringan bermasalah")
    } finally {
      setSendingOtp(false)
    }
  }

  // ─── Resend OTP (for register) ─────────────────────────
  const resendRegisterOtp = async () => {
    setSendingOtp(true)
    try {
      const res = await fetch("/api/auth/send-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      })
      const data = await res.json()
      if (res.status === 429) {
        toast.error(data.message || "Terlalu banyak permintaan")
        return
      }
      if (!res.ok) {
        toast.error(data.message || "Gagal mengirim ulang kode")
        return
      }
      toast.success("Kode baru telah dikirim!")
      setOtpValue("")
    } catch {
      toast.error("Jaringan bermasalah")
    } finally {
      setSendingOtp(false)
    }
  }

  // ─── VERIFY OTP & Sign In ──────────────────────────────
  const verifyOtpAndLogin = async () => {
    setLoading(true)
    try {
      const { signIn } = await import("next-auth/react")
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        otp: otpValue.trim(),
        redirect: false,
      })

      if (res?.error) throw new Error(res.error)

      toast.success(isLogin ? "Welcome Back!" : "Akun Berhasil Dibuat!", {
        description: isLogin ? "Sedang mengalihkan…" : "Selamat bergabung!",
      })
      setTimeout(() => {
        window.location.href = "/"
      }, 800)
    } catch (err: any) {
      toast.error("Verifikasi Gagal", { description: err.message || "Kode OTP salah atau kedaluwarsa." })
    } finally {
      setLoading(false)
    }
  }

  // ─── Form Submit Handler ───────────────────────────────
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()

    // Step 1: Send OTP
    if (step === "form") {
      if (isLogin) {
        await sendLoginOtp()
      } else {
        await handleRegister()
      }
      return
    }

    // Step 2: Verify OTP
    if (step === "otp") {
      await verifyOtpAndLogin()
    }
  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
    setFormData({ email: "", password: "", username: "" })
    setShowPassword(false)
    setStep("form")
    setOtpValue("")
  }

  // ─── Dynamic text helpers ──────────────────────────────
  const headingText =
    step === "otp"
      ? "Kode Verifikasi"
      : isLogin
        ? "Welcome Back!"
        : "Buat Akun"

  const subtitleText =
    step === "otp"
      ? "Masukkan 6 digit kode yang dikirim ke email Anda."
      : isLogin
        ? "Masuk ke akun Anda untuk melanjutkan."
        : "Bergabung dengan kami sekarang."

  const buttonText =
    step === "otp"
      ? isLogin
        ? "Masuk"
        : "Verifikasi & Masuk"
      : isLogin
        ? "Kirim kode ke email"
        : "Daftar & Kirim Kode OTP"

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center items-center p-4">
      <div className="relative w-full max-w-[420px] bg-white rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl border border-slate-100 min-h-[700px]">
        <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-[70px] opacity-20 animate-pulse" />
        <div className="absolute bottom-[10%] left-[-20%] w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-20" />

        <div className="w-full px-8 pt-16 pb-10 z-10 flex flex-col h-full flex-grow justify-between">
          <div className="flex flex-col justify-center">
            <div className="text-center mb-10">
              <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-orange-500/30 mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                {step === "otp" ? (
                  <CheckCircle2 className="w-10 h-10 text-white" />
                ) : (
                  <Palette className="w-10 h-10 text-white" />
                )}
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight transition-all">
                {headingText}
              </h1>
              <p className="text-slate-500 mt-2 font-medium">
                {subtitleText}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {/* ─── OTP INPUT STEP ─── */}
              {step === "otp" && (
                <div className="space-y-4 py-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("form")
                      setOtpValue("")
                    }}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <ArrowLeft size={18} /> Kembali
                  </button>

                  {/* Email info pill */}
                  <div className="flex justify-center">
                    <div className="bg-orange-50 border border-orange-100 px-4 py-2 rounded-2xl flex items-center gap-2">
                      <Mail size={14} className="text-orange-500" />
                      <span className="text-xs font-bold text-orange-600">{formData.email}</span>
                    </div>
                  </div>

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
                    Tidak masuk? Periksa spam atau{" "}
                    <button
                      type="button"
                      className="text-orange-600 font-bold hover:text-orange-700 transition-colors"
                      disabled={sendingOtp}
                      onClick={() => {
                        if (isLogin) {
                          void sendLoginOtp()
                        } else {
                          void resendRegisterOtp()
                        }
                      }}
                    >
                      {sendingOtp ? "Mengirim…" : "kirim ulang"}
                    </button>
                  </p>
                </div>
              )}

              {/* ─── FORM INPUTS STEP ─── */}
              {step === "form" && (
                <>
                  {/* Username (register only) */}
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      !isLogin ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="space-y-1.5 pb-1">
                      <label
                        htmlFor="username"
                        className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1"
                      >
                        Username
                      </label>
                      <div className="relative group">
                        <User
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors"
                          size={20}
                        />
                        <input
                          id="username"
                          type="text"
                          required={!isLogin}
                          placeholder="ArfanDesign"
                          disabled={loading || sendingOtp}
                          className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-base font-semibold placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 transition-all disabled:opacity-50"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1"
                    >
                      Email
                    </label>
                    <div className="relative group">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors"
                        size={20}
                      />
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="email@contoh.com"
                        disabled={loading || sendingOtp}
                        className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-base font-semibold placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 transition-all disabled:opacity-50"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center ml-1">
                      <label
                        htmlFor="password"
                        className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                      >
                        Password
                      </label>
                      {isLogin && (
                        <Link
                          href="/forgot-password"
                          className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors"
                        >
                          Lupa?
                        </Link>
                      )}
                    </div>
                    <div className="relative group">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors"
                        size={20}
                      />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        disabled={loading || sendingOtp}
                        className="w-full pl-12 pr-14 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-base font-semibold placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 transition-all disabled:opacity-50"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading || sendingOtp}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all focus:outline-none disabled:opacity-50 select-none"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {!isLogin && (
                      <p className="text-[10px] text-slate-400 font-medium ml-1 mt-1">
                        Minimal 6 karakter
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* ─── SUBMIT BUTTON ─── */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading || sendingOtp || (step === "otp" && otpValue.length !== 6)}
                  className="w-full relative flex items-center justify-center py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed select-none group"
                >
                  {loading || sendingOtp ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <span>{buttonText}</span>
                      <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* ─── TOGGLE AUTH MODE ─── */}
            {step === "form" && (
              <>
                <div className="mt-8 text-center relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-sm text-slate-400">Atau</span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    {isLogin ? (
                      <p>
                        Belum punya akun?{" "}
                        <span className="text-orange-500 font-bold ml-1">Daftar gratis</span>
                      </p>
                    ) : (
                      <p>
                        Sudah punya akun?{" "}
                        <span className="text-orange-500 font-bold ml-1">Masuk di sini</span>
                      </p>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors select-none group"
            >
              <ArrowRight size={16} className="mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
