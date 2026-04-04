"use client"

import { Upload } from "lucide-react"

interface StepUploadProps {
  onSkip: () => void
}

export function StepUpload({ onSkip }: StepUploadProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-2xl font-black text-gray-900 mb-2">3. Upload File Pendukung</h2>
      <p className="text-sm font-medium text-gray-500 mb-8">
        Punya logo, foto produk, atau sketsa referensi? Anda bisa mengirimkannya langsung nanti via WhatsApp agar
        kualitas file tidak pecah.
      </p>

      <div className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-[2rem] p-10 text-center mb-8 flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-4">
          <Upload size={32} className="text-orange-500" />
        </div>
        <h3 className="font-bold text-gray-900 mb-2">Sistem Upload Disimpan untuk Chat</h3>
        <p className="text-xs font-medium text-gray-500 max-w-sm mx-auto mb-6">
          Untuk menjaga kualitas (High-Res), silakan kirim file pendukung seperti logo & foto produk melalui WhatsApp
          setelah proses order selesai.
        </p>
        <button
          onClick={onSkip}
          className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all"
        >
          Lewati & Lanjut ke Review
        </button>
      </div>
    </div>
  )
}
