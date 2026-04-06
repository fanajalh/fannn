"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MobileHeader } from "@/components/MobileHeader"
import { Loader2, AlertCircle, ShieldCheck, Zap } from "lucide-react"

type Product = { id: string; name: string; type: string; price: number; stock: number; category: string; popular: boolean }

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [waNumber, setWaNumber] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        const res = await fetch("/api/premium")
        const json = await res.json()
        if (json.success && json.data) {
          const found = json.data.products.find((p: Product) => p.id === params.slug)
          if (found) setProduct(found)
          else setError("Produk tidak ditemukan")
        } else {
          setError("Gagal memuat data")
        }
      } catch { setError("Terjadi kesalahan") }
      finally { setLoading(false) }
    }
    fetchProduct()
  }, [params.slug])

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!waNumber || !product) return
    setSubmitting(true)
    
    try {
      const res = await fetch("/api/premium/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: params.slug, wa: waNumber })
      })
      const data = await res.json()
      
      if (res.ok && data.orderToken) {
        // Redirect pakai token, BUKAN id database
        router.push(`/checkout/${data.orderToken}`)
      } else {
        alert(data.message || "Gagal membuat pesanan")
      }
    } catch {
      alert("Gagal membuat pesanan. Coba lagi.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-[#FAFAFA] min-h-screen">
        <MobileHeader title="Detail Produk" />
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="bg-[#FAFAFA] min-h-screen flex flex-col items-center justify-center p-5">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Produk Tidak Ditemukan</h2>
        <p className="text-slate-500 text-center mb-6">{error}</p>
        <button onClick={() => router.push("/premium")} className="px-6 py-3 bg-slate-900 text-white rounded-full font-bold">
          Kembali ke Katalog
        </button>
      </div>
    )
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 flex justify-center shadow-sm">
        <div className="w-full max-w-2xl"><MobileHeader title="Checkout Cepat" /></div>
      </div>

      <div className="max-w-xl mx-auto p-5 mt-5">
        {/* Product Summary Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
          <h2 className="text-xl font-black text-slate-800 mb-1">{product.name}</h2>
          <p className="text-slate-500 text-sm mb-4">{product.type} • Sisa stok: <span className={product.stock < 5 ? "text-red-500 font-bold" : "text-slate-500"}>{product.stock}</span></p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-black text-orange-600">Rp {product.price.toLocaleString("id-ID")}</p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-white rounded-2xl p-3 border border-slate-100 flex items-center gap-2.5">
            <Zap size={16} className="text-orange-500 flex-shrink-0" />
            <span className="text-[11px] font-bold text-slate-600">Pengiriman Instan</span>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-3 border border-slate-100 flex items-center gap-2.5">
            <ShieldCheck size={16} className="text-emerald-500 flex-shrink-0" />
            <span className="text-[11px] font-bold text-slate-600">Garansi Akun</span>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleCheckout} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nomor WhatsApp</label>
            <input 
              type="tel" 
              required
              placeholder="08123456789"
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-4 text-slate-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-lg font-semibold tracking-wide"
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
            />
            <p className="text-[11px] text-slate-400 mt-1.5">Akun akan dikirim ke nomor ini setelah pembayaran.</p>
          </div>
          <button 
            type="submit" 
            disabled={submitting || product.stock === 0}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-500/30 transition-all flex justify-center items-center gap-2 disabled:opacity-50 text-lg"
          >
            {submitting ? <><Loader2 className="animate-spin" size={20} /> Memproses...</> : product.stock === 0 ? "Stok Habis" : "Lanjut Pembayaran →"}
          </button>
        </form>
      </div>
    </div>
  )
}