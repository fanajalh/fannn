"use client"

import { useState } from "react"
import ChatWindow from "@/components/chat/ChatWindow"
import ConsentBanner from "@/components/chat/ConsentBanner"
import { acceptChatRequest } from "@/lib/actions/chat"

export default function PrivateChatPage({ params }: { params: { chatId: string } }) {
  // Idealnya ini dicek dulu ke database apakah statusnya sudah 'accepted' atau 'pending'
  const [isAccepted, setIsAccepted] = useState(false)

  const handleAccept = async () => {
    const res = await acceptChatRequest(params.chatId)
    if (res.success) setIsAccepted(true)
    else alert("Gagal menyetujui chat: " + res.error)
  }

  return (
    <div className="relative h-full flex flex-col">
      {!isAccepted && (
        <ConsentBanner 
          onAccept={handleAccept} 
          onDecline={() => window.history.back()} 
        />
      )}
      
      {/* Kirim sessionId agar MessageInput tahu ini chat private */}
      <ChatWindow title="Private Discussion" isPrivate={true} sessionId={params.chatId} />
    </div>
  )
}