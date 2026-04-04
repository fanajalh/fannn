"use client"

import { useState, useEffect } from "react"
import { Clock, CheckCircle2, Package, Sparkles } from "lucide-react"
import { MobileHeader } from "@/components/MobileHeader"

interface OrderItem {
  id: string
  order_number: string
  status: string
  created_at: string
  title: string
  service: string
}

export default function UserActivityPage() {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.orders) {
          // Transform orders into an "activity" timeline
          const timeline: any[] = []
          
          data.orders.forEach((order: OrderItem) => {
            // Push "Order Created"
            timeline.push({
              id: `${order.id}-created`,
              type: 'created',
              title: `Membuat pesanan baru: ${order.title || order.service.replace('-', ' ').toUpperCase()}`,
              date: order.created_at,
              order_number: order.order_number
            })

            // If order completed, push "Order Completed" (simulated date)
            if (order.status === 'completed') {
              const completedDate = new Date(order.created_at)
              completedDate.setDate(completedDate.getDate() + 2) // Simulate completed 2 days later
              timeline.push({
                id: `${order.id}-completed`,
                type: 'completed',
                title: `Pesanan Selesai: ${order.title || order.service.replace('-', ' ').toUpperCase()}`,
                date: completedDate.toISOString(),
                order_number: order.order_number
              })
            }
          })

          // Sort descending newest first
          timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          setActivities(timeline)
        }
      })
      .catch()
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-[#f4f6f9] min-h-screen pb-24 font-sans select-none w-full">
      <div className="sticky top-0 z-50 bg-[#f4f6f9]/80 backdrop-blur-xl border-b border-slate-200/50 flex justify-center">
        <div className="w-full max-w-2xl">
          <MobileHeader title="Riwayat Aktivitas" />
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto px-5 mt-8">
        {loading ? (
          <div className="flex flex-col flex-1 items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mb-4" />
          </div>
        ) : activities.length > 0 ? (
          <div className="relative pl-6 border-l-2 border-slate-200 space-y-8 pb-10">
            {activities.map((item, idx) => {
              const isCompleted = item.type === 'completed'
              return (
                <div key={item.id} className="relative animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}>
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[35px] w-6 h-6 rounded-full border-4 border-[#f4f6f9] flex items-center justify-center ${isCompleted ? 'bg-emerald-500' : 'bg-orange-500'}`}>
                    {isCompleted ? <CheckCircle2 size={10} className="text-white" /> : <Package size={10} className="text-white" />}
                  </div>

                  <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm ml-2">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                        {isCompleted ? 'Update Sistem' : 'Aktivitas User'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Clock size={10} /> 
                        {new Date(item.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="font-extrabold text-[#111] text-[13px] leading-tight mb-1" dangerouslySetInnerHTML={{ __html: item.title }}></p>
                    <p className="text-[11px] font-medium text-slate-500">Berkaitan dengan Order ID: <span className="font-bold text-slate-700">{item.order_number}</span></p>
                  </div>
                </div>
              )
            })}
            
            {/* Base Account Creation Node */}
            <div className="relative">
              <div className="absolute -left-[35px] w-6 h-6 rounded-full border-4 border-[#f4f6f9] bg-blue-500 flex items-center justify-center">
                <Sparkles size={10} className="text-white" />
              </div>
              <div className="ml-2 pt-1">
                <p className="font-extrabold text-slate-500 text-[13px]">Akun Dibuat</p>
                <p className="text-[11px] font-medium text-slate-400">Pendaftaran berhasil diselesaikan.</p>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <Clock size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-[15px] text-slate-600 font-bold mb-1">Belum ada aktivitas</p>
            <p className="text-[12px] text-slate-400 font-medium">Aktivitas akun Anda akan muncul di sini.</p>
          </div>
        )}
      </div>
    </div>
  )
}
