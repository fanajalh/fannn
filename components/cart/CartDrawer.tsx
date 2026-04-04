"use client"

import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react"
import { useCart } from "./CartContext"
import { useRouter } from "next/navigation"

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart()
  const router = useRouter()

  const formatPrice = (price: number) => new Intl.NumberFormat("id-ID").format(price)

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed bottom-0 inset-x-0 max-w-[480px] mx-auto z-[101] animate-in slide-in-from-bottom duration-300">
        <div className="bg-white rounded-t-[2rem] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] max-h-[80vh] flex flex-col">
          
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-slate-200 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-orange-50 rounded-xl">
                <ShoppingBag size={18} className="text-orange-600" />
              </div>
              <div>
                <h3 className="text-[15px] font-extrabold text-slate-800">Keranjang</h3>
                <p className="text-[11px] text-slate-400 font-medium">{totalItems} item</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Items */}
          <div className="overflow-y-auto flex-1 px-6 py-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag size={40} className="mx-auto text-slate-200 mb-3" />
                <p className="text-sm font-bold text-slate-400">Keranjang masih kosong</p>
                <p className="text-xs text-slate-300 mt-1">Tambah layanan dari halaman paket</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 border border-slate-100"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-slate-800 truncate">{item.serviceName}</p>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">{item.packageName}</p>
                      <p className="text-[13px] font-extrabold text-orange-600 mt-1">
                        Rp {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-90 transition-all"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                      <span className="text-[13px] font-bold text-slate-700 w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-90 transition-all"
                      >
                        <Plus size={12} strokeWidth={3} />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-500">Total</span>
                <span className="text-lg font-black text-slate-800">Rp {formatPrice(totalPrice)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    clearCart()
                    setIsOpen(false)
                  }}
                  className="py-3 rounded-xl text-[13px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all"
                >
                  Hapus Semua
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    if (items.length > 0) {
                      const item = items[0]
                      router.push(`/order?service=${item.serviceId}&package=${item.packageId}&skip=true`)
                    } else {
                      router.push("/order")
                    }
                  }}
                  className="py-3 rounded-xl text-[13px] font-bold text-white bg-orange-600 hover:bg-orange-700 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-orange-600/20"
                >
                  Checkout <ArrowRight size={14} strokeWidth={3} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
