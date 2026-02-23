"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hash, Users, BookOpen, Lock, MessageSquare, Plus } from "lucide-react";

const PUBLIC_CHANNELS = [
  { id: "global", label: "Global Chat", icon: Hash },
  { id: "perkenalan", label: "Berkenalan", icon: Users },
  { id: "pengalaman", label: "Berbagi Pengalaman", icon: BookOpen },
];

export default function ChatSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-80 border-r border-gray-100 bg-white flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-xl font-black text-gray-900 tracking-tight">Diskusi <span className="text-orange-500">Realtime</span></h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">JokiPoster Community</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-8">
        {/* Public Channels */}
        <div>
          <h3 className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Channel Publik</h3>
          <div className="space-y-1">
            {PUBLIC_CHANNELS.map((ch) => (
              <Link 
                key={ch.id} 
                href={`/chat/${ch.id}`}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all group ${
                  pathname.includes(ch.id) ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-gray-500 hover:bg-orange-50"
                }`}
              >
                <ch.icon size={18} className={pathname.includes(ch.id) ? "text-white" : "text-orange-500"} />
                <span className="text-sm font-bold">{ch.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Private DMs */}
        <div>
          <div className="flex items-center justify-between px-2 mb-3">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Obrolan Private</h3>
            <Plus size={14} className="text-gray-400 cursor-pointer hover:text-orange-500" />
          </div>
          <div className="space-y-2">
            {/* Dummy List Chat Private */}
            <Link href="/chat/private/arfan-valen" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-200 to-orange-100 flex items-center justify-center font-bold text-orange-600 text-xs">V</div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">Valen</p>
                <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Online
                </p>
              </div>
              <Lock size={12} className="text-gray-300" />
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  );
}