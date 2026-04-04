"use client"

import { useSession, signOut } from "next-auth/react"
import { MobileHeader } from "@/components/MobileHeader"
import {
  User, Mail, Shield, LogOut, ChevronRight,
  Palette, MessageCircle, Clock, Star, Settings, Bell
} from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { data: session } = useSession()

  const menuItems = [
    { icon: Palette, label: "Pesanan Saya", desc: "Lihat riwayat pesanan", href: "/profile/orders", color: "orange" },
    { icon: MessageCircle, label: "Obrolan", desc: "WhatsApp Admin", href: "https://wa.me/62857281502223", color: "emerald", external: true },
    { icon: Clock, label: "Riwayat Aktivitas", desc: "Log aktivitas akun", href: "/profile/activity", color: "blue" },
    { icon: Settings, label: "Pengaturan", desc: "Akun & preferensi", href: "/profile/settings", color: "slate" },
  ]

  return (
    <div className="bg-[#f4f6f9] min-h-screen pb-24 font-sans select-none w-full">
      <div className="sticky top-0 z-50 bg-[#f4f6f9]/80 backdrop-blur-xl border-b border-slate-200/50 flex justify-center">
        <div className="w-full max-w-2xl">
          <MobileHeader title="Profil Saya" />
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto">
      {/* Profile Card */}
      <div className="px-5 pt-8 pb-4">
        <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
          {/* Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 to-orange-500" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-full border-[3px] border-orange-200 overflow-hidden bg-white shadow-sm shrink-0">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || 'User')}&background=fff&color=ff6b00&bold=true&size=128`}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-black text-slate-800 truncate">{session?.user?.name || "Pengguna"}</h2>
              <p className="text-[12px] text-slate-400 font-medium truncate flex items-center gap-1.5">
                <Mail size={12} />
                {session?.user?.email || "email@example.com"}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1">
                  <Shield size={10} /> Verified
                </div>
                <div className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border border-amber-100 flex items-center gap-1">
                  <Star size={10} className="fill-current" /> 5.0
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="px-5 mt-2">
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden divide-y divide-slate-50">
          {menuItems.map((item, idx) => {
            const Icon = item.icon
            const colors: Record<string, string> = {
              orange: "bg-orange-50 text-orange-500",
              emerald: "bg-emerald-50 text-emerald-500",
              blue: "bg-blue-50 text-blue-500",
              purple: "bg-purple-50 text-purple-500",
              slate: "bg-slate-100 text-slate-500",
            }
            return (
              <Link
                key={idx}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                className="flex items-center justify-between p-4 hover:bg-slate-50 active:scale-[0.98] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[item.color]} shrink-0`}>
                    <Icon size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-800">{item.label}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-orange-500 transition-colors" />
              </Link>
            )
          })}
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-5 mt-6">
        <button
          onClick={() => signOut({ callbackUrl: "/loginUser" })}
          className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-[13px] rounded-[1.5rem] border border-red-100 active:scale-95 transition-all outline-none"
        >
          <LogOut size={16} strokeWidth={2.5} />
          Keluar dari Akun
        </button>
      </div>

      {/* App Version */}
      <p className="text-center text-[10px] text-slate-300 font-bold mt-6">Fanajah Design Studio v1.0</p>
      </div>
    </div>
  )
}
