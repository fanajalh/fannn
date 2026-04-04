"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { AlertCircle } from "lucide-react"
import { services, packages, formatPrice, calculateTotal, inputStyle, type OrderData } from "./types"

interface StepReviewProps {
  orderData: OrderData
  setOrderData: React.Dispatch<React.SetStateAction<OrderData>>
}

export function StepReview({ orderData, setOrderData }: StepReviewProps) {
  const { data: session } = useSession()

  // Auto-fill and lock name and email if user is logged in
  useEffect(() => {
    if (session?.user) {
      if (
        (session.user.email && orderData.contact.email !== session.user.email) ||
        (session.user.name && orderData.contact.name !== session.user.name && !orderData.contact.name)
      ) {
        setOrderData((prev) => ({
          ...prev,
          contact: {
            ...prev.contact,
            email: session.user?.email || prev.contact.email,
            name: session.user?.name || prev.contact.name,
          },
        }))
      }
    }
  }, [session, orderData.contact.email, orderData.contact.name, setOrderData])

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-2xl font-black text-gray-900 mb-8">4. Finalisasi Pesanan</h2>

      <div className="grid md:grid-cols-2 gap-10 mb-8">
        {/* Contact Form */}
        <div className="space-y-6">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
            Informasi Pemesan
          </h3>
          <div>
            <input
              type="text"
              placeholder="Nama Lengkap *"
              value={orderData.contact.name}
              readOnly={!!session?.user?.name}
              disabled={!!session?.user?.name}
              onChange={(e) =>
                setOrderData({ ...orderData, contact: { ...orderData.contact, name: e.target.value } })
              }
              className={`${inputStyle} ${session?.user?.name ? "bg-gray-100 cursor-not-allowed opacity-80" : ""}`}
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Alamat Email *"
              value={orderData.contact.email}
              readOnly={!!session?.user?.email}
              disabled={!!session?.user?.email}
              onChange={(e) =>
                setOrderData({ ...orderData, contact: { ...orderData.contact, email: e.target.value } })
              }
              className={`${inputStyle} ${session?.user?.email ? "bg-gray-100 cursor-not-allowed opacity-80" : ""}`}
            />
          </div>
          <div>
            <input
              type="tel"
              placeholder="Nomor WhatsApp (Aktif) *"
              value={orderData.contact.phone}
              onChange={(e) =>
                setOrderData({ ...orderData, contact: { ...orderData.contact, phone: e.target.value } })
              }
              className={inputStyle}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Nama Brand / Perusahaan (Opsional)"
              value={orderData.contact.company}
              onChange={(e) =>
                setOrderData({ ...orderData, contact: { ...orderData.contact, company: e.target.value } })
              }
              className={inputStyle}
            />
          </div>
        </div>

        {/* Summary & Warning */}
        <div className="space-y-6">
          <div className="bg-gray-900 text-white rounded-[2rem] p-8 shadow-xl">
            <h3 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-6">Ringkasan Order</h3>
            <div className="space-y-3 font-medium text-sm text-gray-300">
              <div className="flex justify-between items-center">
                <span className="uppercase text-xs tracking-wider">Layanan</span>
                <span className="text-white font-bold">
                  {services.find((s) => s.id === orderData.service)?.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="uppercase text-xs tracking-wider">Paket</span>
                <span className="text-white font-bold">
                  {packages.find((p) => p.id === orderData.package)?.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="uppercase text-xs tracking-wider">Deadline</span>
                <span className="text-white font-bold">
                  {new Date(orderData.details.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="border-t border-white/20 mt-6 pt-6 flex justify-between items-end">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Total Harga</span>
              <span className="text-3xl font-black text-white">{formatPrice(calculateTotal(orderData))}</span>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-[1.5rem] p-5 flex gap-4">
            <div className="mt-1">
              <AlertCircle size={20} className="text-orange-500" />
            </div>
            <p className="text-xs font-medium text-orange-800 leading-relaxed">
              Pastikan kontak WA aktif. Setelah order dikirim, Anda akan diarahkan ke WhatsApp untuk konfirmasi dan
              metode pembayaran (DP 50%).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
