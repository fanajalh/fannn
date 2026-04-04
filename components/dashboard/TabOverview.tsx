"use client"

import { TrendingUp, FileText, Clock, CheckCircle, DollarSign, ArrowUpRight, ChevronRight } from "lucide-react"
import { formatCurrency, statusColor, statusLabel, type Order, type Analytics } from "./types"

interface Props {
  stats: { total: number; pending: number; in_progress: number; completed: number; cancelled: number }
  analytics: Analytics | null
  orders: Order[]
  setActiveTab: (tab: string) => void
}

export function TabOverview({ stats, analytics, orders, setActiveTab }: Props) {
  const statCards = [
    { label: "Total Pesanan", value: stats.total, icon: FileText, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" },
    { label: "Menunggu", value: stats.pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" },
    { label: "Dikerjakan", value: stats.in_progress, icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
    { label: "Selesai", value: stats.completed, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Hero Revenue Card */}
      {analytics && (
        <div className="bg-slate-900 rounded-[2rem] p-6 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div className="flex items-center gap-2 mb-3 relative z-10">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/30">
              <DollarSign size={18} strokeWidth={3} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Total Pendapatan</span>
          </div>
          <p className="text-4xl font-black text-white tracking-tight relative z-10">
            {formatCurrency(analytics.totalRevenue)}
          </p>
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className={`p-4 rounded-[1.5rem] border ${s.bg} ${s.border} transition-all active:scale-95`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm ${s.color}`}>
                  <Icon size={20} strokeWidth={2.5} />
                </div>
                <ArrowUpRight size={16} className={`${s.color} opacity-40`} />
              </div>
              <p className="text-2xl font-black text-slate-800 leading-none mb-1">{s.value}</p>
              <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Recent Orders List */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 md:p-6">
        <div className="flex justify-between items-end mb-5">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Pesanan Terbaru</h3>
          <button onClick={() => setActiveTab("orders")} className="text-[11px] font-bold text-orange-500 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1">
            Lihat Semua <ChevronRight size={14} />
          </button>
        </div>
        
        <div className="space-y-3">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/50 transition-colors group cursor-pointer active:scale-[0.98]">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors">
                  <FileText size={18} strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-extrabold text-slate-800 truncate mb-0.5">{order.name}</p>
                  <p className="text-[11px] font-bold text-slate-400 truncate tracking-wide">
                    {order.order_number} &bull; <span className="text-orange-500">{order.service}</span>
                  </p>
                </div>
              </div>
              <span className={`shrink-0 ml-3 text-[9px] font-black uppercase px-2.5 py-1 rounded-md border ${statusColor(order.status)}`}>
                {statusLabel(order.status)}
              </span>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Clock size={24} className="mx-auto text-slate-300 mb-2" />
              <p className="text-[12px] font-bold text-slate-400">Belum ada pesanan masuk</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}