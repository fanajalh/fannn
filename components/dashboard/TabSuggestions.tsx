"use client"

import { RefreshCw, Eye, MessageSquare, Clock, CheckCircle } from "lucide-react"
import type { Suggestion } from "./types"

interface Props {
  suggestions: Suggestion[]
  onRefresh: () => void
  onViewSuggestion: (s: Suggestion) => void
}

export function TabSuggestions({ suggestions, onRefresh, onViewSuggestion }: Props) {
  const pending = suggestions.filter((s) => s.status === "pending")
  const reviewed = suggestions.filter((s) => s.status === "reviewed")

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-gray-900">Kotak Saran</h2>
          <p className="text-xs text-gray-400 font-medium">{suggestions.length} total · {pending.length} menunggu</p>
        </div>
        <button onClick={onRefresh} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 transition-all">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="space-y-3">
        {suggestions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <MessageSquare size={32} className="mx-auto text-gray-200 mb-3" />
            <p className="font-bold text-gray-400">Belum ada saran masuk</p>
          </div>
        ) : (
          suggestions.map((s) => (
            <div key={s.id} className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                      s.status === "reviewed" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200"
                    }`}>
                      {s.status === "reviewed" ? "Ditinjau" : "Menunggu"}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">{s.category}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800 line-clamp-2">{s.saran}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {s.nama || "Anonim"} · {new Date(s.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <button onClick={() => onViewSuggestion(s)} className="p-2 rounded-xl hover:bg-orange-50 text-gray-400 hover:text-orange-600 transition-colors shrink-0">
                  <Eye size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
