"use client"

import { Server, Database, Shield, CheckCircle, AlertCircle, HardDrive, Zap } from "lucide-react"
import Swal from "sweetalert2"

interface Props {
  connectionStatus: "connected" | "mock" | "error"
}

export function TabSettings({ connectionStatus }: Props) {
  const systemInfo = [
    { label: "Platform", value: "Next.js 14 App Router", icon: Server, color: "blue" },
    { label: "Database", value: "Neon PostgreSQL", icon: Database, color: "emerald" },
    { label: "Auth Provider", value: "NextAuth.js v4", icon: Shield, color: "indigo" },
    { label: "Connection", value: connectionStatus === "connected" ? "Terhubung (Live)" : connectionStatus === "mock" ? "Mode Demo" : "Terputus", icon: connectionStatus === "error" ? AlertCircle : CheckCircle, color: connectionStatus === "connected" ? "emerald" : connectionStatus === "mock" ? "amber" : "red" },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Bento System Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systemInfo.map((info, idx) => {
          const Icon = info.icon
          return (
            <div key={idx} className="bg-white p-5 rounded-[1.8rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:border-slate-200 transition-colors">
              <div className={`w-12 h-12 bg-${info.color}-50 text-${info.color}-500 rounded-2xl flex items-center justify-center shrink-0`}>
                <Icon size={22} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{info.label}</p>
                <p className="text-[14px] font-extrabold text-slate-800">{info.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Critical Actions */}
      <div className="bg-slate-900 p-6 md:p-8 rounded-[2rem] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.2)] relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 blur-3xl rounded-full pointer-events-none" />
        
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-white shrink-0 backdrop-blur-md">
            <HardDrive size={22} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h3 className="text-[17px] font-black mb-1">Database Initialization</h3>
            <p className="text-[12px] font-medium text-slate-400 mb-5 leading-relaxed max-w-md">
              Jalankan setup ini HANYA JIKA Anda baru pertama kali menghubungkan database atau ingin membuat ulang tabel yang hilang (Migration).
            </p>
            
            <button
              onClick={async () => {
                const result = await Swal.fire({ title: 'Jalankan Setup DB?', text: "Peringatan: Menjalankan setup database bisa menimpa struktur tabel yang ada. Lanjutkan?", icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Ya, Jalankan!' })
                if(!result.isConfirmed) return;
                try {
                  const res = await fetch("/api/setup-db")
                  const data = await res.json()
                  Swal.fire({ icon: data.success ? 'success' : 'error', title: data.success ? 'Berhasil' : 'Gagal', text: data.success ? data.message : data.error })
                } catch { Swal.fire({ icon: 'error', text: 'Failed to setup database' }) }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-extrabold rounded-[1.2rem] text-[13px] hover:bg-red-600 active:scale-95 transition-all shadow-[0_8px_20px_rgba(239,68,68,0.3)] outline-none"
            >
              <Zap size={16} strokeWidth={2.5} /> Jalankan Setup DB
            </button>
          </div>
        </div>
      </div>
      
    </div>
  )
}