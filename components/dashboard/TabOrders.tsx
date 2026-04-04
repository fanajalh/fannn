"use client"

import { useState } from "react"
import { Search, Download, Eye, Edit, Copy, Trash2, MessageCircle, CheckSquare, X } from "lucide-react"
import { formatCurrency, statusColor, statusLabel, type Order } from "./types"

interface Props {
  orders: Order[]
  onViewOrder: (order: Order) => void
  onEditOrder: (order: Order) => void
  onDuplicateOrder: (order: Order) => void
  onDeleteOrder: (orderId: string) => void
  onSendWhatsApp: (phone: string, orderNumber: string) => void
  onExportOrders: () => void
  onBulkAction: (action: string, ids: string[]) => void
}

export function TabOrders({ orders, onViewOrder, onEditOrder, onDuplicateOrder, onDeleteOrder, onSendWhatsApp, onExportOrders, onBulkAction }: Props) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const filtered = orders.filter((o) => {
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  }

  const toggleAll = () => {
    setSelectedIds((prev) => prev.length === filtered.length ? [] : filtered.map((o) => String(o.id)))
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Toolbar & Filters */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, email, atau ID Order..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-bold text-slate-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-400"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 md:flex-none px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-bold text-slate-600 outline-none focus:border-orange-500 appearance-none"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <button onClick={onExportOrders} className="flex items-center justify-center w-12 h-12 shrink-0 bg-slate-900 text-white rounded-2xl hover:bg-black active:scale-95 transition-all shadow-md">
            <Download size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Bulk Actions Floating Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white p-4 rounded-[1.5rem] flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom-4 sticky top-24 z-30">
          <div className="flex items-center gap-2">
            <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black">{selectedIds.length}</span>
            <span className="text-sm font-bold">Dipilih</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onBulkAction("completed", selectedIds)} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl text-[11px] font-black hover:bg-emerald-500/30 transition-colors">
              <CheckSquare size={14} /> Selesai
            </button>
            <button onClick={() => onBulkAction("delete", selectedIds)} className="flex items-center gap-1.5 px-3 py-2 bg-red-500/20 text-red-400 rounded-xl text-[11px] font-black hover:bg-red-500/30 transition-colors">
              <Trash2 size={14} /> Hapus
            </button>
          </div>
        </div>
      )}

      {/* Orders List (Card View - Mobile Friendly) */}
      <div className="flex items-center justify-between px-2 mb-2">
        <label className="flex items-center gap-2 cursor-pointer text-[11px] font-black text-slate-500 uppercase tracking-widest">
          <input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
          Pilih Semua
        </label>
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{filtered.length} Pesanan</span>
      </div>

      <div className="space-y-4">
        {filtered.map((order) => (
          <div key={order.id} className={`bg-white rounded-[2rem] p-5 shadow-sm border transition-all ${selectedIds.includes(String(order.id)) ? 'border-orange-500 ring-4 ring-orange-500/10' : 'border-slate-100 hover:border-orange-200'}`}>
            
            {/* Header Card */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-3">
                <input type="checkbox" checked={selectedIds.includes(String(order.id))} onChange={() => toggleSelect(String(order.id))} className="mt-1 w-5 h-5 rounded-md border-slate-300 text-orange-500 focus:ring-orange-500" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 leading-tight mb-0.5">{order.name}</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{order.order_number}</p>
                </div>
              </div>
              <span className={`shrink-0 text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg border ${statusColor(order.status)}`}>
                {statusLabel(order.status)}
              </span>
            </div>

            {/* Content Details */}
            <div className="bg-slate-50 rounded-[1.2rem] p-4 mb-4 grid grid-cols-2 gap-4 border border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Layanan</p>
                <p className="text-[13px] font-bold text-slate-700">{order.service}</p>
                <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{order.package}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Biaya</p>
                <p className="text-[16px] font-black text-orange-600 tracking-tight">{formatCurrency(order.total_price)}</p>
              </div>
            </div>

            {/* Action Buttons (Scrollable horizontally on very small screens) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <button onClick={() => onViewOrder(order)} className="flex-1 min-w-[80px] flex justify-center items-center gap-1.5 py-2.5 bg-slate-900 text-white rounded-xl text-[11px] font-extrabold active:scale-95 transition-transform">
                <Eye size={14} /> Detail
              </button>
              <button onClick={() => onSendWhatsApp(order.phone, order.order_number)} className="flex-1 min-w-[80px] flex justify-center items-center gap-1.5 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-[11px] font-extrabold hover:bg-emerald-100 active:scale-95 transition-transform">
                <MessageCircle size={14} /> Chat
              </button>
              <button onClick={() => onEditOrder(order)} className="w-10 h-10 shrink-0 flex justify-center items-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 active:scale-95 transition-transform">
                <Edit size={16} />
              </button>
              <button onClick={() => onDuplicateOrder(order)} className="w-10 h-10 shrink-0 flex justify-center items-center bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 active:scale-95 transition-transform">
                <Copy size={16} />
              </button>
              <button onClick={() => onDeleteOrder(String(order.id))} className="w-10 h-10 shrink-0 flex justify-center items-center bg-red-50 text-red-600 rounded-xl hover:bg-red-100 active:scale-95 transition-transform">
                <Trash2 size={16} />
              </button>
            </div>

          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
            <Search size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-[15px] font-black text-slate-700 mb-1">Pesanan tidak ditemukan</p>
            <p className="text-[12px] font-bold text-slate-400">Coba ubah kata kunci atau filter status.</p>
          </div>
        )}
      </div>
    </div>
  )
}