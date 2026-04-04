"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Palette, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { signIn } = await import("next-auth/react");
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      toast.success("Welcome back!", {
        description: "Login successful. Redirecting...",
      });
      
      // Delay for toast to show before redirecting
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
      
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error("Login Failed", {
        description: error.message || "Invalid credentials. Please try again.",
      });
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
      {/* App-like Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-2000" />
      
      <div className="w-full max-w-md px-8 pt-10 pb-16 z-10 flex flex-col h-full justify-between">
        <div className="flex-1 flex flex-col justify-center">
          
          {/* Logo & Header */}
          <div className="text-center mb-12">
            <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-3xl flex items-center justify-center shadow-xl shadow-orange-500/30 mb-6 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
              <Palette className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 mt-2 font-medium">Log in to manage your spaces.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email / Username</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 text-base font-semibold placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all disabled:opacity-50"
                placeholder="admin"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 text-base font-semibold placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all pr-14 disabled:opacity-50"
                  placeholder="••••••••"
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

            <div className="flex justify-end pt-2">
              <a href="#" className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">Forgot Password?</a>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full relative flex items-center justify-center py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed select-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-10">
          <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors select-none">
             Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
