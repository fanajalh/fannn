"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, X, Star, ArrowRight } from "lucide-react"

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      name: "Basic",
      description: "Cocok untuk kebutuhan personal",
      monthlyPrice: 15000,
      icon: "🎨",
      features: [
        "1 desain poster",
        "2 revisi gratis",
        "Format JPG/PNG/PDF",
        "Resolusi standar",
        "Pengerjaan 2-3 hari",
        "Support via chat",
      ],
      notIncluded: ["Link template ", "Desain kompleks", "Rush order", "Konsultasi mendalam"],
      popular: false,
      buttonText: "Pilih Basic",
    },
    {
      name: "Professional",
      description: "Pilihan terbaik",
      monthlyPrice: 20000,
      icon: "🚀",
      features: [
        "1 desain poster premium",
        "5 revisi gratis",
        "Semua format (JPG, PNG, PDF)",
        "Resolusi tinggi",
        "Source file included",
        "Pengerjaan 2-3 hari",
        "Konsultasi design",
        "Support prioritas",
      ],
      notIncluded: ["Rush order (same day)"],
      popular: true,
      buttonText: "Pilih Professional",
    },
    {
      name: "Enterprise",
      description: "Solusi lengkap",
      monthlyPrice: 25000,
      icon: "👑",
      features: [
        "1 desain poster premium+",
        "Revisi unlimited",
        "Semua format",
        "Resolusi ultra tinggi",
        "link template",
        "Rush order available",
        "Dedicated designer",
        "24/7 priority support",
      ],
      notIncluded: [],
      popular: false,
      buttonText: "Hubungi Kami",
    },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Paket <span className="gradient-text">Harga</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pilih paket yang sesuai dengan kebutuhan dan budget Anda
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                plan.popular ? "border-2 border-orange-500 scale-105" : "border border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Star size={16} className="fill-current" />
                    Paling Populer
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="text-4xl mb-4">{plan.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="text-4xl font-bold gradient-text mb-2">{formatPrice(plan.monthlyPrice)}</div>
                  <div className="text-gray-500">per poster</div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-gray-800">Yang Anda Dapatkan:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.notIncluded.length > 0 && (
                    <>
                      <h4 className="font-semibold text-gray-800 mt-6">Tidak Termasuk:</h4>
                      <ul className="space-y-3">
                        {plan.notIncluded.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <X size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-500">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                {/* Button */}
                <Link
                  href="/order"
                  className={`w-full justify-center ${plan.popular ? "btn btn-primary" : "btn btn-secondary"}`}
                >
                  <span>{plan.buttonText}</span>
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Pertanyaan yang Sering Diajukan</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="font-semibold text-gray-800 mb-2">Apakah ada biaya tersembunyi?</h4>
              <p className="text-gray-600 text-sm">
                Tidak ada biaya tersembunyi. Harga yang tertera sudah final dan transparan.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="font-semibold text-gray-800 mb-2">Bagaimana sistem pembayaran?</h4>
              <p className="text-gray-600 text-sm">
                Pembayaran 50% di awal, 50% setelah desain selesai. Tersedia berbagai metode pembayaran.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="font-semibold text-gray-800 mb-2">Berapa lama pengerjaan?</h4>
              <p className="text-gray-600 text-sm">
                Tergantung paket yang dipilih. Basic 2-3 hari, Professional 2-3 hari, Enterprise fleksibel.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="font-semibold text-gray-800 mb-2">Apakah bisa request revisi?</h4>
              <p className="text-gray-600 text-sm">
                Ya, setiap paket sudah termasuk revisi sesuai ketentuan. Revisi tambahan dikenakan biaya.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
