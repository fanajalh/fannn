"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { User, Lock, Save, Loader2, Info } from "lucide-react"
import Swal from "sweetalert2"
import { MobileHeader } from "@/components/MobileHeader"

export default function UserSettingsPage() {
  const { data: session, update } = useSession()
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name)
    }
  }, [session])

  const handleSave = async () => {
    if (!name.trim()) {
      Swal.fire({ icon: 'warning', title: 'Oops', text: 'Nama tidak boleh kosong!' })
      return
    }

    setLoading(true)
    try {
      const payload: any = { name }
      if (password) payload.password = password

      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      
      const data = await res.json()
      if (data.success) {
        // Update session client-side
        await update({ name })
        Swal.fire({ icon: 'success', title: 'Berhasil', text: data.message })
        setPassword("") // Clear password field
      } else {
        Swal.fire({ icon: 'error', title: 'Gagal', text: data.message })
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Terjadi kesalahan jaringan.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#f4f6f9] min-h-screen pb-24 font-sans select-none w-full">
      <div className="sticky top-0 z-50 bg-[#f4f6f9]/80 backdrop-blur-xl border-b border-slate-200/50 flex justify-center">
        <div className="w-full max-w-2xl">
          <MobileHeader title="Pengaturan Akun" />
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto px-5 mt-8">
        <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
          
          <div className="mb-6 flex items-start gap-3 bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[12px] font-medium text-blue-700">Perubahan nama akan langsung terlihat. Jika Anda merubah kata sandi, harap gunakan sandi baru pada proses login berikutnya.</p>
          </div>

          <div className="space-y-5">
            {/* Nama */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Nama Lengkap</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-bold text-slate-800 outline-none"
                />
              </div>
            </div>

            {/* Email (Disabled) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Email <span className="text-slate-300 font-normal">(Tidak bisa diubah)</span></label>
              <input
                type="email"
                value={session?.user?.email || ""}
                disabled
                className="w-full px-4 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-sm font-bold text-slate-400 outline-none cursor-not-allowed"
              />
            </div>

            {/* Kata Sandi Baru */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Kata Sandi Baru <span className="text-slate-300 font-normal">(Opsional)</span></label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kosongkan jika tidak ubah"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-bold text-slate-800 outline-none placeholder:font-normal placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-500/25 active:scale-95 mt-6 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}
