import ChatSidebar from "@/components/chat/ChatSidebar";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#FAFAFA] overflow-hidden pt-16">
      {/* Sidebar tetap di kiri */}
      <ChatSidebar />
      {/* Konten Chat di kanan */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {children}
      </main>
    </div>
  );
}