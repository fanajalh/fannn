"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Palette, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  })

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        // LOGIN
        const { signIn } = await import("next-auth/react")
        const res = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })
        
        if (res?.error) throw new Error(res.error)
        
        toast.success("Welcome Back!", { description: "Sedang mengalihkan ke dashboard..." })
        setTimeout(() => { window.location.href = "/" }, 1000)
        
      } else {
        // REGISTER
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
        if (!res.ok) throw new Error(data.message || "Gagal register")
        
        // Auto Login
        const { signIn } = await import("next-auth/react")
        await signIn("credentials", {
          email: formData.email,
          password: formData.password, 
          redirect: false,
        })

        toast.success("Akun Berhasil Dibuat!", { description: "Selamat bergabung di JokiPoster." })
        setTimeout(() => { window.location.href = "/" }, 1000)
      }
    } catch (err: any) {
      toast.error("Autentikasi Gagal", { description: err.message || "Periksa kembali data Anda." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      {/* Mobile App Frame Boundaries for Login */}
      <div className="relative w-full max-w-[480px] min-h-screen bg-white flex flex-col items-center justify-center overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.05)]">
        {/* Background Blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-2000" />
        
        <div className="w-full px-8 pt-12 pb-16 z-10 flex flex-col h-full justify-between">
          <div className="flex-1 flex flex-col justify-center">
           
          <div className="text-center mb-10">
            <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-3xl flex items-center justify-center shadow-xl shadow-orange-500/30 mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <Palette className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {isLogin ? "Welcome Back" : "Buat Akun"}
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              {isLogin ? "Masuk ke akun Anda." : "Bergabung dengan kami sekarang."}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    required 
                    placeholder="ArfanDesign"
                    disabled={loading}
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 text-base font-semibold placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all disabled:opacity-50"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="email" 
                  required 
                  placeholder="email@contoh.com"
                  disabled={loading}
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 text-base font-semibold placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all disabled:opacity-50"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-12 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 text-base font-semibold placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all disabled:opacity-50"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-orange-500 transition-colors focus:outline-none disabled:opacity-50 select-none"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full relative flex items-center justify-center py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed select-none"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? "Sign In" : "Daftar"}</span>
                    {!isLogin && <ArrowRight size={20} className="ml-2" />}
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setFormData({ email: "", password: "", username: "" })
              }}
              className="text-sm font-bold text-slate-400 hover:text-orange-500 transition-colors"
            >
              {isLogin 
                ? "Belum punya akun? Daftar gratis" 
                : "Sudah punya akun? Masuk di sini"}
            </button>
          </div>
        </div>

          <div className="text-center mt-10">
            <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors select-none">
               Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}