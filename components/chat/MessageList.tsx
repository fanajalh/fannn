"use client"

import { useEffect, useRef } from "react"
import useSWR from "swr"
import { Loader2 } from "lucide-react"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function MessageList({ channelId, currentUserId }: { channelId: string, currentUserId: string }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // Polling every 2 seconds
  const { data: messages, error, isLoading } = useSWR(`/api/messages?channelId=${channelId}`, fetcher, {
    refreshInterval: 2000,
    revalidateOnFocus: true
  })

  // Auto-scroll ke bawah setiap ada pesan baru dengan smooth
  useEffect(() => { 
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages])

  if (isLoading || !messages) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-2 text-orange-500">
          <Loader2 className="animate-spin w-8 h-8" />
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Sinkronisasi Chat...</span>
        </div>
      </div>
    )
  }

  if (error) {
     return <div className="text-red-500 font-bold p-4">Error memuat pesan.</div>
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAFAFA] custom-scrollbar">
      {messages.length === 0 && (
        <div className="h-full flex items-center justify-center text-gray-400 font-bold text-sm">
          Belum ada obrolan. Jadilah yang pertama menyapa! 👋
        </div>
      )}

      {messages.map((msg: any) => {
        const isMe = msg.sender_id === currentUserId;
        
        return (
          <div key={msg.id} className={`flex flex-col w-full ${isMe ? "items-end animate-in slide-in-from-right-2" : "items-start animate-in slide-in-from-left-2"} duration-300`}>
            
            <div className="flex items-center gap-2 mb-1 px-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {isMe ? "Anda" : msg.profiles?.username || "Anonim"}
              </span>
              <span className="text-[9px] font-bold text-gray-300">
                {msg.created_at ? new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ""}
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