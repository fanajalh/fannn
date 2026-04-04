"use client"

import { X, Edit, MessageCircle, Clock, Package, User, Mail, Phone, Building, FileText, Save } from "lucide-react"
import { formatCurrency, statusColor, statusLabel, type Order, type Suggestion } from "./types"

// ==================== ORDER DETAIL MODAL ====================
interface OrderDetailProps {
  order: Order
  onClose: () => void
  onEdit: (order: Order) => void
  onSendWhatsApp: (phone: string, orderNumber: string) => void
}

export function OrderDetailModal({ order, onClose, onEdit, onSendWhatsApp }: OrderDetailProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white p-5 border-b border-gray-100 flex justify-between items-center rounded-t-2xl">
          <div>
            <h3 className="font-black text-gray-900">{order.order_number}</h3>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${statusColor(order.status)}`}>
              {statusLabel(order.status)}
            </span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400"><X size={20} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1"><User size={10} className="inline" /> Nama</p>
              <p className="text-sm font-bold text-gray-800">{order.name}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1"><Mail size={10} className="inline" /> Email</p>
              <p className="text-sm font-bold text-gray-800">{order.email}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1"><Phone size={10} className="inline" /> Telepon</p>
              <p className="text-sm font-bold text-gray-800">{order.phone}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1"><Package size={10} className="inline" /> Layanan</p>
              <p className="text-sm font-bold text-gray-800">{order.service} · {order.package}</p>
            </div>
          </div>
          {order.title && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Judul Desain</p>
              <p className="text-sm text-gray-800">{order.title}</p>
            </div>
          )}
          {order.description && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Deskripsi</p>
              <p className="text-sm text-gray-600">{order.description}</p>
            </div>
          )}
          <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
            <p className="text-lg font-black text-gray-900">{formatCurrency(order.total_price)}</p>
            <div className="flex gap-2">
              <button onClick={() => onSendWhatsApp(order.phone, order.order_number)} className="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-sm font-bold border border-green-200 hover:bg-green-100">
                <MessageCircle size={14} /> WhatsApp
              </button>
              <button onClick={() => { onClose(); onEdit(order) }} className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800">
                <Edit size={14} /> Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== EDIT ORDER MODAL ====================
interface EditOrderProps {
  order: Order
  setOrder: (order: Order | null) => void
  onClose: () => void
  onSave: (orderId: string, updates: Partial<Order>) => void
}

export function EditOrderModal({ order, setOrder, onClose, onSave }: EditOrderProps) {
  const statusOptions = ["pending", "in_progress", "completed", "cancelled"]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-black text-gray-900">Edit {order.order_number}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400"><X size={20} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Status</label>
            <select
              value={order.status}
              onChange={(e) => setOrder({ ...order, status: e.target.value as Order["status"] })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-orange-500"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{statusLabel(s)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Harga</label>
            <input
              type="number" value={order.total_price}
              onChange={(e) => setOrder({ ...order, total_price: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-orange-500"
            />
          </div>
          <div className="flex gap-2 justify-end pt-3">
            <button onClick={onClose} className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold">Batal</button>
            <button onClick={() => onSave(String(order.id), { status: order.status, total_price: order.total_price })}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 active:scale-95">
              <Save size={14} /> Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== SUGGESTION MODAL ====================
interface SuggestionModalProps {
  suggestion: Suggestion
  response: string
  setResponse: (r: string) => void
  onClose: () => void
  onSubmit: () => void
}

export function SuggestionModal({ suggestion, response, setResponse, onClose, onSubmit }: SuggestionModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-black text-gray-900">Detail Saran</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400"><X size={20} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Dari</p>
            <p className="text-sm font-bold text-gray-800">{suggestion.nama || "Anonim"}</p>
            <p className="text-xs text-gray-400">{suggestion.user_email}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Kategori</p>
            <p className="text-sm text-gray-800">{suggestion.category}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Isi Saran</p>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">{suggestion.saran}</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Respon Admin</label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={3}
              placeholder="Tulis respon..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 resize-none"
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button onClick={onClose} className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold">Batal</button>
            <button onClick={onSubmit} className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 active:scale-95">
              Simpan & Review
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
