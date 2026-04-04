"use client"

import { useState } from "react"
import { Send, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { mutate } from "swr" // Import mutate untuk merefresh swr secara manual jika perlu

export default function MessageInput({ channelId }: { channelId: string }) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const { data: session, status } = useSession()
  const user = session?.user

  const handleSend = async () => {
    if (!content.trim() || !user) return
    
    setLoading(true)
    
    try {
      const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              content,
              channel_id: channelId
          })
      })

      if (res.ok) {
          setContent("")
          // Opsional: Triger mutate SWR agar UI langsung refresh tanpa tunggu 2 detik
          mutate(`/api/messages?channelId=${channelId}`)
      } else {
          console.error("Gagal kirim pesan")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Tampilan saat sedang mengecek status (Loading)
  if (status === "loading") {
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
          onClick={() => router.push("/loginUser")} 
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
          className="flex-1 bg-transparent p-2 outline-none text-sm font-medium disabled:opacity-50"
          onChange={(e) => setContent(e.target.value)} 
          onKeyDown={(e) => e.key === "Enter" && handleSend()} 
          disabled={loading}
        />
        <button 
          onClick={handleSend} 
          disabled={!content.trim() || loading}
          className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center transition-all hover:bg-orange-600 disabled:opacity-50 disabled:grayscale active:scale-95 shadow-lg shadow-orange-500/20"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}