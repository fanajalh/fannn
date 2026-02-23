"use client"
import { Check, X, ShieldAlert } from "lucide-react";

export default function ConsentBanner({ onAccept, onDecline }: { onAccept: () => void, onDecline: () => void }) {
  return (
    <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-gray-100 text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="text-orange-500" size={40} />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Permintaan Chat Private</h3>
        <p className="text-gray-500 text-sm font-medium leading-relaxed mb-10">
          Seseorang ingin mengobrol secara pribadi dengan Anda. Obrolan ini bersifat <span className="text-orange-600 font-bold">End-to-End Encrypted</span>. Setujui untuk mulai bertukar pesan.
        </p>
        <div className="flex gap-3">
          <button onClick={onDecline} className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
            <X size={18} /> Tolak
          </button>
          <button onClick={onAccept} className="flex-[1.5] py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2">
            <Check size={18} /> Terima Chat
          </button>
        </div>
      </div>
    </div>
  );
}