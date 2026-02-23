"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export default function MessageList({ channelId, currentUserId }: { channelId: string, currentUserId: string }) {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true;

    // 1. Fetch Sejarah Pesan Lama
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select(`*, profiles(username)`)
        .eq("channel_id", channelId)
        .order("created_at", { ascending: true })
      
      if (data && isMounted) {
        setMessages(data)
        setLoading(false)
      }
    }
    
    fetchMessages()

    // 2. Engine Realtime Super Cepat
    const channel = supabase.channel(`chat-${channelId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages', 
        filter: `channel_id=eq.${channelId}` 
      }, 
      async (payload) => {
        // --- LOGIKA INSTAN ---
        // Cek apakah ini pesan kita sendiri
        const isMe = payload.new.sender_id === currentUserId;

        // TAMPILKAN PESAN SEKARANG JUGA (Jangan nunggu database!)
        const instantMessage = {
          ...payload.new,
          profiles: { username: isMe ? "Anda" : "Memuat..." } // Kasih nama sementara
        };

        setMessages((prev) => [...prev, instantMessage]);

        // Kalau pesan dari orang lain, cari nama aslinya di background secara diam-diam
        if (!isMe) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", payload.new.sender_id)
            .single();

          if (profile) {
            // Update pesannya dengan nama asli tanpa mengganggu layar
            setMessages((prev) => 
              prev.map((msg) => 
                msg.id === payload.new.id 
                  ? { ...msg, profiles: { username: profile.username } } 
                  : msg
              )
            );
          }
        }
      })
      .subscribe()

    return () => { 
      isMounted = false;
      supabase.removeChannel(channel) 
    }
  }, [channelId, currentUserId])

  // Auto-scroll ke bawah setiap ada pesan baru dengan smooth
  useEffect(() => { 
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-2 text-orange-500">
          <Loader2 className="animate-spin w-8 h-8" />
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Sinkronisasi Chat...</span>
        </div>
      </div>
    )
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAFAFA] custom-scrollbar">
      {messages.length === 0 && (
        <div className="h-full flex items-center justify-center text-gray-400 font-bold text-sm">
          Belum ada obrolan. Jadilah yang pertama menyapa! 👋
        </div>
      )}

      {messages.map((msg) => {
        const isMe = msg.sender_id === currentUserId;
        
        return (
          <div key={msg.id} className={`flex flex-col w-full ${isMe ? "items-end animate-in slide-in-from-right-2" : "items-start animate-in slide-in-from-left-2"} duration-300`}>
            
            <div className="flex items-center gap-2 mb-1 px-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {isMe ? "Anda" : msg.profiles?.username || "Anonim"}
              </span>
              <span className="text-[9px] font-bold text-gray-300">
                {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className={`p-4 rounded-[1.5rem] text-sm font-medium leading-relaxed max-w-[85%] md:max-w-[65%] shadow-sm ${
              isMe 
              ? "bg-orange-500 text-white rounded-tr-none shadow-orange-500/20" 
              : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
            }`}>
              {msg.content}
            </div>
            
          </div>
        )
      })}
    </div>
  )
}