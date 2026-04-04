"use client"

import Image from "next/image"
import { CheckCircle2 } from "lucide-react"
import { services, packages, formatPrice, type OrderData } from "./types"

interface StepServiceProps {
  orderData: OrderData
  setOrderData: React.Dispatch<React.SetStateAction<OrderData>>
}

export function StepService({ orderData, setOrderData }: StepServiceProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-2xl font-black text-gray-900 mb-8">1. Pilih Layanan & Paket</h2>

      <div className="grid sm:grid-cols-2 gap-5 mb-10">
        {services.map((srv) => (
          <div
            key={srv.id}
            onClick={() => setOrderData((prev) => ({ ...prev, service: srv.id }))}
            className={`p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all duration-300 group ${
              orderData.service === srv.id
                ? "border-orange-500 bg-orange-50/50 shadow-md shadow-orange-500/10"
                : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <div className="relative w-full h-32 mb-4 rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={srv.image || "/placeholder.svg"}
                alt={srv.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{srv.name}</h3>
            <p className="text-gray-500 text-xs font-medium mb-3 line-clamp-2">{srv.description}</p>
            <div className="text-sm font-black text-orange-600">Mulai {formatPrice(srv.price)}</div>
          </div>
        ))}
      </div>

      {orderData.service && (
        <div className="animate-in fade-in slide-in-from-bottom-4 pt-8 border-t border-gray-100">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Pilih Paket Spesifikasi</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setOrderData((prev) => ({ ...prev, package: pkg.id }))}
                className={`p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                  orderData.package === pkg.id
                    ? "border-orange-500 bg-orange-50/50 shadow-md shadow-orange-500/10"
                    : "border-gray-100 bg-white hover:border-gray-300"
                }`}
              >
                <h4 className="font-bold text-gray-900 mb-1">{pkg.name}</h4>
                <div className="text-lg font-black text-orange-500 mb-4 pb-4 border-b border-orange-100/50">
                  {formatPrice(
                    Math.round((services.find((s) => s.id === orderData.service)?.price || 0) + pkg.priceIncrement)
                  )}
                </div>
                <ul className="text-xs text-gray-600 font-medium space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
