"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { 
  Palette, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  CheckCircle2 
} from "lucide-react"

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // State success tetap dipertahankan buat jaga-jaga, 
  // tapi biasanya user akan langsung di-redirect sebelum pesan ini terbaca lama
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  })

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (isLogin) {
        // ==========================================
        // PROSES LOGIN
        // ==========================================
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })
        
        if (signInError) throw signInError
        
        // Jika login berhasil, langsung arahkan ke Global Chat
        router.push("/chat/global")
        
      } else {
        // ==========================================
        // PROSES REGISTER (Auto-Login)
        // ==========================================
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              username: formData.username, // Data ini ditangkap oleh Trigger Database
            },
          },
        })
        
        if (signUpError) throw signUpError
        
        // Karena "Confirm Email" dimatikan di Supabase Dashboard,
        // user akan langsung mendapatkan session aktif di sini.
        // Kita bisa langsung arahkan (redirect) ke chat!
        router.push("/chat/global")
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat autentikasi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 selection:bg-orange-100 selection:text-orange-900">
      
      {/* Background Decor (Glow Orbs) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-50 rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFF5EC] rounded-full blur-[100px] opacity-80 pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white p-8 md:p-10 shadow-2xl shadow-orange-900/5">
          
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl shadow-lg shadow-orange-500/20 mb-6 transform -rotate-6">
              <Palette className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {isLogin ? "Selamat Datang" : "Buat Akun Baru"}
            </h1>
            <p className="text-sm font-medium text-gray-400 mt-2">
              {isLogin 
                ? "Masuk untuk mulai berdiskusi di JokiPoster." 
                : "Bergabung dengan komunitas desain kami hari ini."}
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <p className="text-xs font-bold leading-relaxed">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3 text-emerald-600 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" />
              <p className="text-xs font-bold leading-relaxed">{success}</p>
            </div>
          )}

          {/* Form Utama */}
          <form onSubmit={handleAuth} className="space-y-4">
            
            {/* Input Username (Hanya muncul saat Register) */}
            {!isLogin && (
              <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: ArfanDesign"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-medium outline-none"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>
            )}

            {/* Input Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  required 
                  placeholder="email@contoh.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-medium outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  required 
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-medium outline-none"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {/* Tombol Submit */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-6 flex items-center justify-center gap-2 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-orange-500/25 active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>{isLogin ? "Masuk Sekarang" : "Daftar Akun"}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Toggle Button: Pindah antara Login dan Register */}
          <div className="mt-8 text-center">
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError(null)
              }}
              className="text-sm font-bold text-gray-400 hover:text-orange-500 transition-colors"
            >
              {isLogin 
                ? "Belum punya akun? Daftar gratis" 
                : "Sudah punya akun? Masuk di sini"}
            </button>
          </div>
        </div>

        {/* Footer Credit */}
        <p className="mt-8 text-center text-xs font-bold text-gray-300 uppercase tracking-[0.3em]">
          JokiPoster &bull; Creative Studio
        </p>
      </div>
    </div>
  )
}