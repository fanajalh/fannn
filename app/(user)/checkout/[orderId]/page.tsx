"use client"
import { useState, useEffect } from "react"
import { MobileHeader } from "@/components/MobileHeader"
import { Loader2, AlertCircle, CheckCircle2, Copy, Check } from "lucide-react"

type OrderDetail = {
  order_token: string
  buyer_wa: string
  total_price: number
  status: string
  created_at: string
  product_name: string
  type: string
  duration: string
}

export default function CheckoutPage({ params }: { params: { orderId: string } }) {
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [simulating, setSimulating] = useState(false)
  const [copied, setCopied] = useState(false)

  const fetchOrder = async () => {
    try {
      setLoading(true)
      // orderId di URL sebenarnya adalah token acak, bukan ID database
      const res = await fetch(`/api/premium/order/${params.orderId}`)
      const json = await res.json()
      if (json.success && json.data) {
        setOrder(json.data)
      } else {
        setError(json.message || "Pesanan tidak ditemukan")
      }
    } catch { setError("Gagal memuat detail pesanan") }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchOrder() }, [params.orderId])

  const handleSimulatePayment = async () => {
    setSimulating(true)
    try {
      const res = await fetch(`/api/premium/order/${params.orderId}`, {
        method: "POST"
      })
      const json = await res.json()
      if (json.success) {
        // Refresh data pesanan untuk melihat status terbaru
        fetchOrder()
      } else {
        alert(json.message || "Gagal simulasi pembayaran")
      }
    } catch { alert("Error jaringan. Coba lagi.") }
    finally { setSimulating(false) }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="bg-[#FAFAFA] min-h-screen">
        <MobileHeader title="Pembayaran" />
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="bg-[#FAFAFA] min-h-screen flex flex-col items-center justify-center p-5">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Pesanan Tidak Ditemukan</h2>
        <p className="text-slate-500 text-center mb-6">{error}</p>
        <button onClick={() => window.location.href = "/premium"} className="px-6 py-3 bg-slate-900 text-white rounded-full font-bold">
          Kembali ke Katalog
        </button>
      </div>
    )
  }

  // Status PAID — Tampilkan sukses 
  if (order.status === "paid" || order.status === "delivered") {
    return (
      <div className="bg-[#FAFAFA] min-h-screen pb-24">
        <MobileHeader title="Pembayaran Berhasil" />
        <div className="max-w-md mx-auto p-5 mt-5 text-center">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 mb-6">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 mb-2">Pembayaran Berhasil! 🎉</h1>
            <p className="text-slate-500 text-sm mb-6">Detail akun telah dikirim ke WhatsApp kamu.</p>
            
            <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Detail Pembelian</p>
              <p className="font-black text-slate-800">{order.product_name}</p>
              <p className="text-sm text-slate-500">{order.type} • {order.duration}</p>
              <p className="text-lg font-black text-orange-600 mt-2">Rp {order.total_price.toLocaleString("id-ID")}</p>
            </div>
          </div>
          <button onClick={() => window.location.href = "/premium"} className="px-6 py-3 bg-slate-900 text-white rounded-full font-bold">
            Kembali ke Katalog
          </button>
        </div>
      </div>
    )
  }

  // Status PENDING — Tampilkan halaman pembayaran
  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 flex justify-center shadow-sm">
        <div className="w-full max-w-2xl"><MobileHeader title="Pembayaran" /></div>
      </div>

      <div className="max-w-md mx-auto p-5 mt-5 text-center">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-4">
          <p className="text-sm text-slate-500 font-medium mb-1">{order.product_name}</p>
          <p className="text-xs text-slate-400 mb-4">{order.type} • {order.duration}</p>
          
          <p className="text-slate-500 font-medium mb-2">Total Pembayaran</p>
          <h1 className="text-4xl font-black text-slate-800 mb-1">Rp {order.total_price.toLocaleString("id-ID")}</h1>
          
          {/* Copy amount button */}
          <button onClick={() => copyToClipboard(order.total_price.toString())} 
            className="text-xs text-orange-500 font-bold mt-2 flex items-center justify-center gap-1 mx-auto hover:text-orange-600">
            {copied ? <><Check size={12} /> Tersalin!</> : <><Copy size={12} /> Salin Nominal</>}
          </button>
        </div>

        {/* QRIS Placeholder */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-4">
          <div className="w-48 h-48 bg-slate-100 mx-auto rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center mb-4">
            <span className="text-slate-400 font-bold">QRIS CODE</span>
          </div>
          <div className="bg-orange-50 text-orange-800 p-4 rounded-xl text-sm font-medium">
            Scan QRIS di atas pakai M-Banking atau GoPay/Dana.
          </div>
        </div>

        {/* WA Info */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 mb-6">
          <p className="text-xs text-slate-400">Akun akan dikirim ke:</p>
          <p className="font-bold text-slate-700">📱 {order.buyer_wa}</p>
        </div>

        {/* Simulasi Pembayaran (Dev Mode) */}
        <button 
          onClick={handleSimulatePayment}
          disabled={simulating}
          className="text-slate-400 text-sm underline hover:text-slate-600 flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
        >
          {simulating ? <><Loader2 size={14} className="animate-spin" /> Memproses...</> : "[Dev Only] Simulasi Uang Masuk"}
        </button>
      </div>
    </div>
  )
}