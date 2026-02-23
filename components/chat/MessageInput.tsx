"use client"

import { useState, useEffect } from "react"
import { Send, LogIn } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function MessageInput({ channelId }: { channelId: string }) {
  const [content, setContent] = useState("")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // 1. Cek status login langsung dari memori browser (Client)
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
    }
    
    checkUser()

    // 2. Pasang Listener: Kalau user tiba-tiba login/logout, UI otomatis berubah
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleSend = async () => {
    if (!content.trim() || !user) return
    const { error } = await supabase.from("messages").insert({
      content, 
      channel_id: channelId, 
      sender_id: user.id
    })
    
    if (!error) {
      setContent("")
    } else {
      console.error("Gagal kirim pesan:", error.message)
    }
  }

  // Tampilan saat sedang mengecek status (Loading)
  if (loading) {
    return (
      <div className="p-6 bg-white border-t flex justify-center">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">
          Memeriksa Akun...
        </span>
      </div>
    )
  }

  // Tampilan kalau BELUM login (Tamu)
  if (!user) {
    return (
      <div className="p-6 bg-white border-t flex justify-center">
        <button 
          onClick={() => router.push("/login")} 
          className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-lg shadow-gray-200"
        >
          <LogIn size={18} /> Login untuk Chat
        </button>
      </div>
    )
  }

  // Tampilan kalau SUDAH login
  return (
    <div className="p-6 bg-white border-t">
      <div className="max-w-4xl mx-auto flex gap-3 bg-gray-50 p-2 rounded-2xl border border-transparent focus-within:bg-white focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 transition-all">
        <input 
          type="text" 
          value={content} 
          placeholder="Tulis pesan..." 
          className="flex-1 bg-transparent p-2 outline-none text-sm font-medium"
          onChange={(e) => setContent(e.target.value)} 
          onKeyDown={(e) => e.key === "Enter" && handleSend()} 
        />
        <button 
          onClick={handleSend} 
          disabled={!content.trim()}
          className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center transition-all hover:bg-orange-600 disabled:opacity-50 disabled:grayscale active:scale-95 shadow-lg shadow-orange-500/20"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}