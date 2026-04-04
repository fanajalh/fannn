"use client"

import { CheckCircle2, MessageCircle } from "lucide-react"

interface SuccessModalProps {
  isOpen: boolean
  orderId: string
  onClose: (confirmWhatsapp: boolean) => void
  totalPrice: string
}

export function SuccessModal({ isOpen, orderId, onClose, totalPrice }: SuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-900/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 md:p-10 transform animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center mb-6">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-2">Pesanan Terkirim!</h2>
          <p className="text-gray-500 mb-6 font-medium text-sm">
            Terima kasih! Order ID: <span className="font-bold text-gray-900">{orderId}</span> berhasil dicatat.
          </p>

          <div className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl mb-8">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-gray-500 uppercase tracking-widest text-xs">Total Tagihan</span>
              <span className="text-xl font-black text-gray-900">{totalPrice}</span>
            </div>
          </div>

          <div className="w-full space-y-3">
            <button
              onClick={() => onClose(true)}
              className="w-full flex items-center justify-center gap-2 py-4 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 transition-all active:scale-[0.98] shadow-lg shadow-green-500/25"
            >
              <MessageCircle size={20} /> Konfirmasi via WhatsApp
            </button>
            <button
              onClick={() => onClose(false)}
              className="w-full py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all"
            >
              Tutup & Tunggu Email
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
