"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Check, Star, ArrowRight, ShoppingCart, Loader2, Zap, Sparkles, Crown } from "lucide-react"
import { useCart } from "./CartContext"

interface ServiceInfo {
  id: string
  title: string
  basePrice: number
}

interface Props {
  isOpen: boolean
  onClose: () => void
  service: ServiceInfo | null
}

const packages = [
  {
    id: "basic",
    name: "Basic",
    priceIncrement: 0,
    icon: Zap,
    features: ["1 Konsep Desain", "2x Revisi Minor", "Format JPG/PNG", "2-3 Hari Kerja"],
    cardStyle: "bg-white border-slate-200",
    btnStyle: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  },
  {
    id: "professional",
    name: "Professional",
    priceIncrement: 5000,
    icon: Sparkles,
    popular: true,
    features: ["1 Desain Premium", "5x Revisi Detail", "Semua Format + Source", "1-2 Hari Kerja"],
    cardStyle: "bg-gradient-to-br from-orange-500 to-orange-600 border-orange-400 text-white",
    btnStyle: "bg-white text-orange-600 hover:bg-orange-50 shadow-lg",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceIncrement: 20000,
    icon: Crown,
    features: ["Eksklusif HD 4K", "Unlimited Revisi", "Dedicated Designer", "Prioritas Utama"],
    cardStyle: "bg-slate-900 border-slate-800 text-white",
    btnStyle: "bg-orange-600 text-white hover:bg-orange-700",
  },
]

export function PackagePopup({ isOpen, onClose, service }: Props) {
  const router = useRouter()
  const { addItem, setIsOpen: setCartOpen } = useCart()
  const [addedPkg, setAddedPkg] = useState<string | null>(null)
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null)

  if (!isOpen || !service) return null

  const formatPrice = (price: number) => new Intl.NumberFormat("id-ID").format(price)

  const handleCheckout = (pkgId: string) => {
    setNavigatingTo(pkgId)
    router.push(`/order?service=${service.id}&package=${pkgId}&skip=true`)
  }

  const handleAddToCart = (pkg: typeof packages[0]) => {
    addItem({
      serviceId: service.id,
      serviceName: service.title,
      packageId: pkg.id,
      packageName: pkg.name,
      price: service.basePrice + pkg.priceIncrement,
    })
    setAddedPkg(pkg.id)
    setTimeout(() => {
      setAddedPkg(null)
      onClose()
      setCartOpen(true)
    }, 800)
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" onClick={onClose} />

      {/* Popup */}
      <div className="fixed bottom-0 inset-x-0 max-w-[480px] mx-auto z-[101] animate-in slide-in-from-bottom duration-300">
        <div className="bg-[#f4f6f9] rounded-t-[2rem] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] max-h-[85vh] overflow-y-auto">

          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-[#f4f6f9] rounded-t-[2rem] z-10">
            <div className="w-10 h-1 bg-slate-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-5 py-3 flex items-center justify-between sticky top-5 bg-[#f4f6f9] z-10">
            <div>
              <h3 className="text-[17px] font-black text-slate-800 tracking-tight">{service.title}</h3>
              <p className="text-[11px] text-slate-400 font-medium">Pilih paket yang sesuai kebutuhanmu</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Package Cards */}
          <div className="px-5 pb-8 flex flex-col gap-4">
            {packages.map((pkg) => {
              const Icon = pkg.icon
              const totalPrice = service.basePrice + pkg.priceIncrement

              return (
                <div
                  key={pkg.id}
                  className={`relative rounded-[1.5rem] border p-5 transition-all ${pkg.cardStyle} ${pkg.popular ? "ring-2 ring-orange-500 ring-offset-2 ring-offset-[#f4f6f9]" : ""}`}
                >
                  {/* Popular Badge */}
                  {pkg.popular && (
                    <div className="absolute -top-3 inset-x-0 flex justify-center">
                      <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-yellow-950 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full shadow-md flex items-center gap-1 border border-yellow-300">
                        <Star size={10} className="fill-current" /> Favorit
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      pkg.popular ? "bg-white/10 border border-white/20" : pkg.id === "enterprise" ? "bg-slate-800 text-amber-400" : "bg-slate-50 text-slate-400 border border-slate-100"
                    }`}>
                      <Icon size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[15px]">{pkg.name}</h4>
                      <div className="flex items-baseline gap-0.5">
                        <span className={`text-[11px] font-bold ${pkg.popular ? "text-orange-100" : pkg.id === "enterprise" ? "text-slate-400" : "text-slate-400"}`}>Rp</span>
                        <span className="text-xl font-black">{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {pkg.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check size={13} strokeWidth={3} className={pkg.popular ? "text-orange-200" : pkg.id === "enterprise" ? "text-amber-400" : "text-orange-500"} />
                        <span className={`text-[12px] font-semibold ${pkg.popular ? "text-white/90" : pkg.id === "enterprise" ? "text-slate-300" : "text-slate-600"}`}>{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAddToCart(pkg)}
                      disabled={addedPkg === pkg.id}
                      className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-extrabold transition-all active:scale-95 outline-none border ${
                        addedPkg === pkg.id
                          ? pkg.popular ? "bg-white/30 border-white/50 text-white" : "bg-emerald-50 border-emerald-400 text-emerald-600"
                          : pkg.popular ? "bg-white/10 border-white/30 text-white hover:bg-white/20" : pkg.id === "enterprise" ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {addedPkg === pkg.id ? (
                        <><Check size={13} strokeWidth={3} /> Added!</>
                      ) : (
                        <><ShoppingCart size={13} strokeWidth={2.5} /> Keranjang</>
                      )}
                    </button>
                    <button
                      onClick={() => handleCheckout(pkg.id)}
                      disabled={navigatingTo === pkg.id}
                      className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-extrabold transition-all active:scale-95 outline-none disabled:opacity-70 ${pkg.btnStyle}`}
                    >
                      {navigatingTo === pkg.id ? (
                        <><Loader2 size={13} className="animate-spin" /> Memuat...</>
                      ) : (
                        <>Checkout <ArrowRight size={13} strokeWidth={3} /></>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
