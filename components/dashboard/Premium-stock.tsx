"use client"
import { useState, useEffect } from "react"
import { Plus, X, Trash2, RefreshCw, Package, ShoppingCart, Loader2, CheckCircle, Clock, XCircle } from "lucide-react"
import Swal from "sweetalert2"

type StockItem = {
  id: number
  email: string
  password: string
  status: string
  buyer_wa: string | null
  order_token: string | null
  sold_at: string | null
  created_at: string
  product_name: string | null
  type: string | null
  duration: string | null
  app: string | null
}

type PremiumOrder = {
  id: number
  order_token: string
  buyer_wa: string
  total_price: number
  status: string
  created_at: string
  product_name: string | null
  type: string | null
  duration: string | null
  stock_email: string | null
}

export default function PremiumStockAdmin() {
  const [accounts, setAccounts] = useState<StockItem[]>([])
  const [orders, setOrders] = useState<PremiumOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<"stock" | "orders">("stock")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [newApp, setNewApp] = useState("Canva")
  const [newType, setNewType] = useState("Private")
  const [newDuration, setNewDuration] = useState("1 Bulan")
  const [newEmail, setNewEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")

  // Fetch dari database
  const fetchStocks = async () => {
    try {
      const res = await fetch("/api/admin/premium")
      const json = await res.json()
      if (json.success) setAccounts(json.data || [])
    } catch { console.error("Failed to fetch stocks") }
  }

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/premium/orders")
      const json = await res.json()
      if (json.success) setOrders(json.data || [])
    } catch { console.error("Failed to fetch orders") }
  }

  useEffect(() => {
    Promise.all([fetchStocks(), fetchOrders()]).finally(() => setLoading(false))
  }, [])

  // Tambah stok ke database
  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail || !newPassword) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ app: newApp, type: newType, duration: newDuration, email: newEmail, password: newPassword }),
      })
      const json = await res.json()
      if (json.success) {
        Swal.fire({ icon: "success", title: "Berhasil!", text: "Stok berhasil ditambahkan.", timer: 1500, showConfirmButton: false })
        setNewEmail(""); setNewPassword(""); setIsModalOpen(false)
        fetchStocks()
      } else {
        Swal.fire({ icon: "error", text: json.message || "Gagal menyimpan" })
      }
    } catch { Swal.fire({ icon: "error", text: "Error jaringan" }) }
    finally { setSaving(false) }
  }

  // Hapus stok
  const handleDeleteStock = async (stockId: number) => {
    const result = await Swal.fire({ title: "Hapus stok?", text: "Data ini akan hilang permanen.", icon: "warning", showCancelButton: true, confirmButtonText: "Hapus" })
    if (!result.isConfirmed) return
    try {
      const res = await fetch(`/api/admin/premium?id=${stockId}`, { method: "DELETE" })
      const json = await res.json()
      if (json.success) { fetchStocks(); Swal.fire({ icon: "success", title: "Dihapus!", timer: 1200, showConfirmButton: false }) }
    } catch { Swal.fire({ icon: "error", text: "Gagal menghapus" }) }
  }

  // Konfirmasi pembayaran pesanan -> assign stok
  const handleConfirmPayment = async (orderToken: string) => {
    const result = await Swal.fire({ title: "Konfirmasi Pembayaran?", text: "Stok akan otomatis dikirim ke pembeli.", icon: "question", showCancelButton: true, confirmButtonText: "Ya, Konfirmasi!" })
    if (!result.isConfirmed) return
    try {
      const res = await fetch("/api/admin/premium/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderToken, status: "paid" }),
      })
      const json = await res.json()
      if (json.success) {
        Swal.fire({ icon: "success", title: "Pembayaran Dikonfirmasi!", text: "Stok telah di-assign.", timer: 1500, showConfirmButton: false })
        fetchOrders(); fetchStocks()
      } else {
        Swal.fire({ icon: "error", text: json.message || "Gagal konfirmasi" })
      }
    } catch { Swal.fire({ icon: "error", text: "Error jaringan" }) }
  }

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      AVAILABLE: "bg-emerald-100 text-emerald-700 border-emerald-200",
      SOLD: "bg-slate-100 text-slate-400 border-slate-200",
      RESERVED: "bg-amber-100 text-amber-700 border-amber-200",
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
      delivered: "bg-blue-100 text-blue-700 border-blue-200",
      cancelled: "bg-red-100 text-red-600 border-red-200",
    }
    return map[status] || "bg-gray-100 text-gray-500 border-gray-200"
  }

  // Computed stats
  const stockAvailable = accounts.filter(a => a.status === "AVAILABLE").length
  const stockSold = accounts.filter(a => a.status === "SOLD").length
  const ordersPending = orders.filter(o => o.status === "pending").length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Stok</p>
          <p className="text-2xl font-black text-slate-800 mt-1">{accounts.length}</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Available</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{stockAvailable}</p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Terjual</p>
          <p className="text-2xl font-black text-slate-700 mt-1">{stockSold}</p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Pesanan Masuk</p>
          <p className="text-2xl font-black text-amber-700 mt-1">{ordersPending}</p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => setActiveView("stock")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeView === "stock" ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
          }`}>
          <Package size={16} /> Gudang Stok
        </button>
        <button onClick={() => setActiveView("orders")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all relative ${
            activeView === "orders" ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
          }`}>
          <ShoppingCart size={16} /> Pesanan
          {ordersPending > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
              {ordersPending}
            </span>
          )}
        </button>
        <div className="flex-1" />
        <button onClick={() => { fetchStocks(); fetchOrders() }}
          className="p-2.5 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
          title="Refresh Data">
          <RefreshCw size={18} />
        </button>
        {activeView === "stock" && (
          <button onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-orange-500 transition-all shadow-lg hover:shadow-orange-500/30">
            <Plus size={16} /> Tambah
          </button>
        )}
      </div>

      {/* ============== STOCK VIEW ============== */}
      {activeView === "stock" && (
        <div className="bg-white sm:rounded-2xl shadow-sm border-y sm:border border-slate-200 -mx-4 sm:mx-0">
          {/* Mobile Cards */}
          <div className="block md:hidden divide-y divide-slate-100">
            {accounts.map(acc => (
              <div key={acc.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-black text-slate-700 text-base">{acc.app || "Unknown"}</p>
                    <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{acc.type} • {acc.duration}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-md text-[9px] font-black tracking-widest uppercase border ${statusBadge(acc.status)}`}>
                      {acc.status}
                    </span>
                    {acc.status === "AVAILABLE" && (
                      <button onClick={() => handleDeleteStock(acc.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl flex flex-col gap-1.5 font-mono text-sm border border-slate-100">
                  <span className="text-slate-700 font-semibold break-all">{acc.email}</span>
                  <span className="text-slate-400 break-all">{acc.password}</span>
                </div>
                {acc.buyer_wa && (
                  <p className="text-[11px] text-slate-400">Pembeli: {acc.buyer_wa}</p>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 border-b">Aplikasi & Paket</th>
                  <th className="p-4 border-b">Detail Login</th>
                  <th className="p-4 border-b">Status</th>
                  <th className="p-4 border-b">Pembeli</th>
                  <th className="p-4 border-b w-16"></th>
                </tr>
              </thead>
              <tbody>
                {accounts.map(acc => (
                  <tr key={acc.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="font-black text-slate-700 text-base">{acc.app || "Unknown"}</p>
                      <p className="text-xs text-slate-500 font-medium">{acc.type} • {acc.duration}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-sm font-mono">
                        <span className="text-slate-700 font-semibold">{acc.email}</span>
                        <span className="text-slate-400">{acc.password}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${statusBadge(acc.status)}`}>
                        {acc.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">{acc.buyer_wa || "—"}</td>
                    <td className="p-4">
                      {acc.status === "AVAILABLE" && (
                        <button onClick={() => handleDeleteStock(acc.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {accounts.length === 0 && <div className="p-8 text-center text-slate-500 text-sm">Belum ada stok akun. Klik "Tambah" untuk mulai.</div>}
        </div>
      )}

      {/* ============== ORDERS VIEW ============== */}
      {activeView === "orders" && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400 text-sm">Belum ada pesanan masuk.</div>
          ) : (
            orders.map(order => (
              <div key={order.order_token} className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-slate-800 text-base">{order.product_name || "Produk"}</h3>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest uppercase border ${statusBadge(order.status)}`}>
                        {order.status === "pending" ? "Belum Bayar" : order.status === "paid" ? "Lunas" : order.status === "delivered" ? "Terkirim" : order.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{order.type} • {order.duration}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm">
                      <span className="text-slate-600 font-bold">📱 {order.buyer_wa}</span>
                      <span className="text-orange-600 font-black">Rp {order.total_price.toLocaleString("id-ID")}</span>
                    </div>
                    {order.stock_email && (
                      <p className="text-xs text-emerald-600 mt-1.5 font-mono bg-emerald-50 px-2 py-1 rounded-lg inline-block">
                        ✅ Akun: {order.stock_email}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400 mt-2">{new Date(order.created_at).toLocaleString("id-ID")}</p>
                  </div>
                  {order.status === "pending" && (
                    <button onClick={() => handleConfirmPayment(order.order_token)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md hover:shadow-emerald-500/30 flex-shrink-0">
                      <CheckCircle size={14} /> Konfirmasi Bayar
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ============== MODAL TAMBAH STOK ============== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-[2rem] sm:rounded-[2rem] p-6 sm:p-8 w-full max-w-lg shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 py-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800">Tambah Akun</h2>
                <p className="text-xs sm:text-sm text-slate-500">Pastikan kredensial valid.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-slate-100 p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddStock} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Aplikasi</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-800 font-semibold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    value={newApp} onChange={(e) => setNewApp(e.target.value)}>
                    <option value="Canva">Canva Pro</option>
                    <option value="CapCut">CapCut Pro</option>
                    <option value="Netflix">Netflix</option>
                    <option value="Spotify">Spotify</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tipe Akun</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-800 font-semibold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    value={newType} onChange={(e) => setNewType(e.target.value)}>
                    <option value="Private">Private</option>
                    <option value="Sharing">Sharing</option>
                    <option value="Family">Family</option>
                    <option value="Owner">Owner</option>
                    <option value="Member">Member</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Masa Berlaku</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-800 font-semibold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  value={newDuration} onChange={(e) => setNewDuration(e.target.value)}>
                  <option value="7 Hari">7 Hari</option>
                  <option value="1 Bulan">1 Bulan</option>
                  <option value="3 Bulan">3 Bulan</option>
                  <option value="6 Bulan">6 Bulan</option>
                  <option value="1 Tahun">1 Tahun</option>
                  <option value="Lifetime">Lifetime / Selamanya</option>
                </select>
              </div>

              <hr className="border-slate-100 my-2" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email / Username</label>
                  <input required type="text" placeholder="user@email.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 font-mono"
                    value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                  <input required type="text" placeholder="Pass123!@#"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 font-mono"
                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
              </div>

              <button type="submit" disabled={saving}
                className="w-full bg-slate-900 hover:bg-orange-500 text-white font-black py-4 sm:py-3.5 rounded-xl transition-all shadow-lg hover:shadow-orange-500/30 mt-6 sm:mt-4 mb-2 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <><Loader2 size={18} className="animate-spin" /> Menyimpan...</> : "Simpan ke Gudang"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}