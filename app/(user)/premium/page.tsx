"use client"
import { useState, useEffect } from "react"
import { MobileHeader } from "@/components/MobileHeader"
import { Sparkles, AlertCircle, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

type Category = { id: string; name: string; icon: string; activeColor: string }
type Product = { id: string; category: string; name: string; type: string; stock: number; price: number; popular?: boolean }

export default function PremiumCatalog() {
  const [activeCategory, setActiveCategory] = useState("capcut")
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const abortController = new AbortController()

    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/premium', { signal: abortController.signal })
        
        if (!res.ok) throw new Error("Gagal mengambil data")
        
        const json = await res.json()
        if (json.success && json.data) {
          setCategories(json.data.categories || [])
          setProducts(json.data.products || [])
          if (json.data.categories?.length > 0) {
            setActiveCategory(json.data.categories[0].id)
          }
        } else {
          throw new Error(json.message || "Data tidak valid")
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("Failed to fetch premium data:", err)
          setError(err.message || "Terjadi kesalahan saat memuat data.")
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()

    // Cleanup function untuk mencegah memory leak
    return () => abortController.abort()
  }, [])

  const filteredProducts = products.filter(p => p.category === activeCategory)

  // KOMPONEN HEADER (Agar tidak berulang)
  const StickyHeader = () => (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 flex justify-center shadow-sm">
      <div className="w-full max-w-2xl"><MobileHeader title="Aplikasi Premium" /></div>
    </div>
  )

  // STATE LOADING (Skeleton UI)
  if (loading) {
    return (
      <div className="bg-[#FAFAFA] min-h-screen pb-24 font-sans select-none overflow-x-hidden">
        <StickyHeader />
        <div className="w-full max-w-2xl mx-auto px-5 mt-6 space-y-6 animate-pulse">
          <div className="bg-slate-200 rounded-3xl h-36 w-full"></div>
          <div className="flex gap-3 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-28 bg-slate-200 rounded-2xl flex-shrink-0"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-3xl w-full"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // STATE ERROR
  if (error) {
    return (
      <div className="bg-[#FAFAFA] min-h-screen flex flex-col items-center justify-center p-5">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Oops! Ada masalah</h2>
        <p className="text-slate-500 text-center mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-3 bg-slate-900 text-white rounded-full font-bold"
        >
          Coba Lagi
        </button>
      </div>
    )
  }

  // STATE UTAMA
  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24 font-sans select-none overflow-x-hidden">
      <StickyHeader />

      <div className="w-full max-w-2xl mx-auto px-5 mt-6">
        {/* Banner Promo */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 mb-8 relative overflow-hidden shadow-xl transform transition-transform hover:scale-[1.01]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full mb-3 backdrop-blur-sm border border-white/10">
              <Sparkles size={12} className="text-orange-400" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Pengiriman Instan</span>
            </div>
            <h2 className="text-2xl font-black text-white leading-tight mb-2">
              Upgrade Digitalmu <br/>Sekarang.
            </h2>
          </div>
        </div>

        {/* Tab Kategori */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide snap-x">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`snap-start flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all duration-300 ease-in-out ${
                activeCategory === cat.id 
                  ? `${cat.activeColor} text-white shadow-lg scale-105` 
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
              }`}>
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        {/* Daftar Produk */}
        <div className="space-y-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div 
                key={product.id} 
                onClick={() => router.push(`/premium/${product.id}`)}
                className={`relative bg-white rounded-3xl p-5 border cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  product.popular ? "border-orange-400 shadow-md" : "border-slate-100"
                }`}
              >
                {/* Badge Populer */}
                {product.popular && (
                  <div className="absolute -top-3 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1 z-10">
                    <Sparkles size={10} /> POPULER
                  </div>
                )}

                <div className="flex justify-between items-center relative z-0">
                  <div>
                    <h3 className="font-black text-lg text-slate-800 group-hover:text-orange-600 transition-colors">{product.name}</h3>
                    <p className="text-sm text-slate-400 mb-2 font-medium">
                      {product.type} <span className="mx-1">•</span> 
                      <span className={product.stock < 10 ? "text-red-400" : "text-slate-400"}>Sisa: {product.stock}</span>
                    </p>
                    <p className="text-xl font-black text-orange-600">
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <button className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-lg flex items-center justify-center transition-all duration-300">
                     <ChevronRight strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
              <p className="text-slate-400 font-medium">Belum ada produk untuk kategori ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}