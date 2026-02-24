"use client"
import { useState } from "react"
import { Coffee, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function FormSaran() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' })
  const [formData, setFormData] = useState({
    category: "Fitur Gameplay",
    content: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.content.trim()) return

    setLoading(true)
    setStatus({ type: null, message: '' })

    try {
      const { data: userData } = await supabase.auth.getUser()
      const authorName = userData?.user?.user_metadata?.username || "Player Anonim"

      const { error } = await supabase.from("game_suggestions").insert({
        author: authorName,
        category: formData.category,
        content: formData.content,
      })

      if (error) throw error
      
      setStatus({ type: 'success', message: 'Ide brilianmu berhasil dikirim ke Basecamp!' })
      setFormData({ ...formData, content: "" }) 

      setTimeout(() => setStatus({ type: null, message: '' }), 4000)

    } catch (error: any) {
      setStatus({ type: 'error', message: "Gagal mengirim ide: " + error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div id="tulis-ide" className="h-fit sticky top-8 relative">
      
      {/* =========================================
          SVG DECORATIONS (ANIMATED)
      ========================================= */}
      {/* 1. Pesawat Kertas Melayang (Kanan Atas) */}
      <div className="absolute -top-6 -right-4 w-12 h-12 text-orange-500/30 animate-[float_4s_ease-in-out_infinite] pointer-events-none z-20">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transform rotate-12">
          <path d="M22 2L11 13" />
          <path d="M22 2l-7 20-4-9-9-4 20-7z" className="fill-orange-500/10" />
        </svg>
      </div>

      {/* 2. Petir / Energi (Kiri Bawah) */}
      <div className="absolute -bottom-4 -left-6 w-14 h-14 text-yellow-400/40 animate-[float_5s_ease-in-out_infinite_1s] pointer-events-none z-20">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" className="transform -rotate-12">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </div>


      {/* =========================================
          FORM CONTAINER
      ========================================= */}
      <div className="relative bg-white rounded-[2rem] border border-gray-100 p-8 shadow-2xl shadow-gray-200/50 transition-all overflow-hidden">
        
        {/* Subtle Background Glow dalam Form */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-100/50 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 shadow-inner">
              <Coffee size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Kirim Ide Baru</h3>
              <p className="text-xs font-bold text-gray-400">Langsung masuk ke server developer</p>
            </div>
          </div>

          {status.type === 'success' && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3 text-emerald-600 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" />
              <p className="text-xs font-bold leading-relaxed">{status.message}</p>
            </div>
          )}

          {status.type === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <p className="text-xs font-bold leading-relaxed">{status.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Kategori</label>
              <div className="relative">
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-4 pr-10 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:border-orange-500 focus:bg-white transition-all appearance-none cursor-pointer hover:bg-gray-100 focus:hover:bg-white"
                >
                  <option value="Fitur Gameplay">Fitur Gameplay</option>
                  <option value="Item Kosan">Item Kosan (Furnitur, dll)</option>
                  <option value="Map / Lingkungan">Map / Lingkungan</option>
                  <option value="Lapor Bug">Lapor Bug / Glitch</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Deskripsi Ide / Bug</label>
              <textarea 
                required
                rows={5} 
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Bang, coba tambahin fitur..."
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:border-orange-500 focus:bg-white transition-all resize-none custom-scrollbar hover:bg-gray-100 focus:hover:bg-white"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-500/25 active:scale-95 disabled:opacity-50 disabled:grayscale overflow-hidden relative group"
            >
              {/* Efek kilap (Shine) saat di-hover */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-[shine_1s]" />
              
              {loading ? (
                <>
                  <Loader2 className="animate-spin relative z-10" size={18} />
                  <span className="relative z-10">Memproses...</span>
                </>
              ) : (
                <>
                  <span className="relative z-10">Kirim ke Basecamp</span>
                  <Send size={18} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
        
        @keyframes shine {
          100% { left: 125%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
      `}</style>
    </div>
  )
}