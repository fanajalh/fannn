"use client"
import { CheckCircle2, Copy } from "lucide-react"
import { MobileHeader } from "@/components/MobileHeader"

export default function SuccessPage({ params }: { params: { orderId: string } }) {
  return (
    <div className="bg-slate-900 min-h-screen flex flex-col">
      <MobileHeader title="Pesanan Selesai" />
      <div className="max-w-md mx-auto p-6 w-full flex-1 flex flex-col justify-center items-center text-center">
        <CheckCircle2 size={80} className="text-emerald-400 mb-6 animate-bounce" />
        <h1 className="text-3xl font-black text-white mb-2">Pembayaran Berhasil!</h1>
        <p className="text-slate-400 mb-8">Ini detail akun premium kamu. Silakan login sekarang.</p>

        <div className="bg-slate-800 border border-slate-700 w-full p-6 rounded-3xl text-left shadow-2xl">
          <div className="mb-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Akun</label>
            <div className="flex justify-between items-center bg-slate-900 px-4 py-3 rounded-xl mt-1 text-emerald-400 font-mono">
              user@premium.com
              <Copy size={16} className="text-slate-500 cursor-pointer" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
            <div className="flex justify-between items-center bg-slate-900 px-4 py-3 rounded-xl mt-1 text-emerald-400 font-mono">
              Premium123!
              <Copy size={16} className="text-slate-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}