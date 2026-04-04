"use client"

import { TrendingUp, DollarSign, ShoppingBag, Users, Activity, BarChart2 } from "lucide-react"
import { formatCurrency, type Analytics } from "./types"

interface Props {
  analytics: Analytics
}

export function TabAnalytics({ analytics }: Props) {
  
  // Helper: Format angka jadi ringkas untuk HP (contoh: 1.500.000 jadi 1.5Jt)
  const compactCurrency = (val: number) => {
    if (val >= 1000000) return (val / 1000000).toFixed(1).replace('.0', '') + 'Jt'
    if (val >= 1000) return (val / 1000).toFixed(1).replace('.0', '') + 'Rb'
    return val.toString()
  }

  // Mengambil angka saja dari format rupiah untuk styling khusus
  const revenueNumber = formatCurrency(analytics.totalRevenue).replace(/Rp|\s/g, '')

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 select-none px-1">
      
      {/* ================= BENTO STATS GRID ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        
        {/* 1. REVENUE CARD (Hero Highlight - Full Width di Mobile) */}
        <div className="col-span-2 bg-slate-900 rounded-[2rem] p-5 md:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-slate-800 relative overflow-hidden flex flex-col justify-between group">
          {/* Efek Cahaya */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-11 h-11 bg-emerald-500/20 rounded-[1.2rem] flex items-center justify-center border border-emerald-500/30 text-emerald-400">
              <DollarSign size={24} strokeWidth={2.5} />
            </div>
            <span className="bg-white/10 backdrop-blur-sm text-white/80 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border border-white/10">
              Total Omzet
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Pendapatan Bersih</p>
            <p className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-baseline gap-1">
              <span className="text-lg text-slate-400 font-bold">Rp</span>
              {revenueNumber}
            </p>
          </div>
        </div>

        {/* 2. TOTAL ORDERS CARD */}
        <div className="col-span-1 bg-white rounded-[2rem] p-4 md:p-5 shadow-sm border border-slate-100 flex flex-col justify-between active:scale-[0.98] transition-transform">
          <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-3 border border-blue-100">
            <ShoppingBag size={20} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">Semua Order</p>
            <p className="text-2xl font-black text-slate-800 leading-none">{analytics.totalOrders}</p>
          </div>
        </div>

        {/* 3. COMPLETED CARD */}
        <div className="col-span-1 bg-white rounded-[2rem] p-4 md:p-5 shadow-sm border border-slate-100 flex flex-col justify-between active:scale-[0.98] transition-transform">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-3 border border-emerald-100">
            <TrendingUp size={20} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">Selesai</p>
            <p className="text-2xl font-black text-slate-800 leading-none">{analytics.completedOrders}</p>
          </div>
        </div>

        {/* 4. PENDING CARD (Alert Style - Full Width di Mobile) */}
        <div className="col-span-2 md:col-span-4 bg-amber-50 rounded-[1.5rem] p-4 border border-amber-200 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3.5">
             <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-[1.2rem] flex items-center justify-center shadow-md shadow-amber-500/20">
                <Users size={20} strokeWidth={2.5} />
             </div>
             <div>
               <p className="text-[11px] font-black text-amber-700 uppercase tracking-widest mb-0.5">Perlu Diproses</p>
               <div className="flex items-baseline gap-1">
                 <p className="text-xl font-black text-amber-950 leading-none">{analytics.pendingOrders}</p>
                 <span className="text-xs font-bold text-amber-700">Orderan</span>
               </div>
             </div>
          </div>
          {/* Visual Indicator */}
          {analytics.pendingOrders > 0 && (
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)] mr-2" />
          )}
        </div>

      </div>

      {/* ================= CHART REVENUE (Mobile Horizontal Scroll) ================= */}
      {analytics.monthlyRevenue && analytics.monthlyRevenue.length > 0 && (
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 to-orange-500" />
          
          <div className="flex items-center justify-between mb-6 mt-1">
            <h2 className="text-[15px] font-black text-slate-800 flex items-center gap-2">
              <BarChart2 size={18} className="text-orange-500" strokeWidth={2.5} /> Grafik Pendapatan
            </h2>
            <span className="bg-slate-50 text-slate-500 px-2 py-1 rounded-md text-[9px] font-extrabold uppercase border border-slate-100 tracking-wider">
              Tahun Ini
            </span>
          </div>

          {/* Area Grafik dengan Scroll Horizontal agar bar tidak gepeng di HP */}
          <div className="w-full overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-end gap-3 min-w-max h-[180px] px-1 border-b-2 border-slate-50">
              {analytics.monthlyRevenue.map((m, i) => {
                const max = Math.max(...analytics.monthlyRevenue.map((x) => x.revenue), 1)
                const height = (m.revenue / max) * 100

                return (
                  <div key={i} className="flex flex-col items-center gap-2 w-12 group cursor-default">
                    {/* Tooltip Angka Ringkas */}
                    <span className="text-[10px] font-extrabold text-slate-400 group-hover:text-orange-500 transition-colors">
                      {compactCurrency(m.revenue)}
                    </span>
                    
                    {/* Batang Grafik (Pill Style) */}
                    <div className="w-10 bg-slate-50 rounded-t-xl relative flex items-end justify-center h-full group-hover:bg-orange-50 transition-colors">
                      <div 
                        className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-xl shadow-sm transition-all duration-700 ease-out group-hover:from-orange-500 group-hover:to-yellow-400" 
                        style={{ height: `${Math.max(height, 5)}%` }} 
                      />
                    </div>
                    
                    {/* Label Bulan */}
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 group-hover:text-slate-800">
                      {m.month.substring(0, 3)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}