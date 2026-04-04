import ChatWindow from "@/components/chat/ChatWindow"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function ChannelPage({ params }: { params: { channel: string } }) {
  const session = await getServerSession(authOptions)

  return (
    <ChatWindow
      title={params.channel}
      channelId={params.channel}
      currentUserId={(session?.user as any)?.id || ""} // Kirim string kosong jika tamu
    />
  )
}