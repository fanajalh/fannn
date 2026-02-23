"use client"
import { ShieldCheck, Info } from "lucide-react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface ChatWindowProps {
    title: string;
    isPrivate?: boolean;
    channelId?: string;
    sessionId?: string;
    currentUserId?: string;
}

// Di dalam ChatWindow.tsx
export default function ChatWindow({ title, channelId, sessionId, currentUserId, isPrivate = false }: ChatWindowProps) {
    return (
        <div className="flex-1 flex flex-col h-full bg-[#FAFAFA] relative">
            <header>...</header>

            {/* List Pesan dengan Realtime */}
            <MessageList
                channelId={channelId}
                sessionId={sessionId}
                currentUserId={currentUserId ?? ""}
            />

            {/* Input Box */}
            <MessageInput channelId={channelId} sessionId={sessionId} />
        </div>
    )
}