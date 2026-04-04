"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ShoppingBag, Clock, Package, ChevronRight } from "lucide-react"
import Link from "next/link"
import { MobileHeader } from "@/components/MobileHeader"

interface OrderItem {
  id: string
  order_number: string
  service: string
  package: string
  status: string
  total_price: number
  created_at: string
  title: string
}

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders || [])
        }
      })
      .catch()
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-[#f4f6f9] min-h-screen pb-24 font-sans select-none w-full">
      <div className="sticky top-0 z-50 bg-[#f4f6f9]/80 backdrop-blur-xl border-b border-slate-200/50 flex justify-center">
        <div className="w-full max-w-2xl">
           <MobileHeader title="Pesanan Saya" />
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto px-5 mt-6">
        {loading ? (
          <div className="flex flex-col flex-1 items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin mb-4" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Memuat data...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black tracking-widest uppercase text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                    {order.order_number}
                  </span>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                    order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    order.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <h3 className="font-extrabold text-slate-800 text-[15px] mb-1 line-clamp-1">
                  {order.title || order.service.replace('-', ' ').toUpperCase()}
                </h3>
                <p className="text-[12px] font-bold text-slate-400 flex items-center gap-1.5 mb-4">
                  <Package size={12} /> Paket {order.package}
                </p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Total Harga</p>
                    <p className="font-extrabold text-[14px] text-slate-800">
                      Rp {new Intl.NumberFormat('id-ID').format(order.total_price)}
                    </p>
                  </div>
                  <Link href={`https://wa.me/6285728150223?text=${encodeURIComponent('Halo, saya ingin menanyakan progres pesanan ID: ' + order.order_number)}`} target="_blank" className="text-[11px] font-bold text-orange-500 bg-orange-50 px-4 py-2 rounded-xl hover:bg-orange-100 transition-colors">
                    Tanya Progres
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-[15px] text-slate-600 font-bold mb-1">Belum ada pesanan</p>
            <p className="text-[12px] text-slate-400 font-medium mb-6">Mulai buat karya pertamamu sekarang!</p>
            <Link href="/layanan" className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-orange-600 active:scale-95 transition-all shadow-md">
              Jelajahi Layanan <ChevronRight size={16} strokeWidth={3} />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
