"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server" // Pastikan kamu punya helper ini
import { revalidatePath } from "next/cache"

// 1. Fungsi Kirim Pesan (Public & Private)
export async function sendMessage(formData: {
    content: string;
    channelId?: string;
    sessionId?: string;
}) {
    const supabase = getSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: "Silakan login terlebih dahulu" }

    const { error } = await supabase.from("messages").insert({
        sender_id: user.id,
        content: formData.content,
        channel_id: formData.channelId || null,
        session_id: formData.sessionId || null,
    })

    if (error) return { error: error.message }

    // Revalidate agar data di layar langsung segar
    revalidatePath("/chat")
    return { success: true }
}

// 2. Fungsi Terima Permintaan Chat Private
export async function acceptChatRequest(sessionId: string) {
    const supabase = getSupabaseServerClient()

    const { error } = await supabase
        .from("chat_sessions")
        .update({ status: "accepted" })
        .eq("id", sessionId)

    if (error) return { error: error.message }

    revalidatePath(`/chat/private/${sessionId}`)
    return { success: true }
}