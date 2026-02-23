import { getSupabaseServerClient } from "@/lib/supabase/server"
import ChatWindow from "@/components/chat/ChatWindow"

export default async function ChannelPage({ params }: { params: { channel: string } }) {
  const supabase = getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <ChatWindow
      title={params.channel}
      channelId={params.channel}
      currentUserId={user?.id || ""} // Kirim string kosong jika tamu
    />
  )
}