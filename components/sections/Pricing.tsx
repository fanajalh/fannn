"use client"

import Link from "next/link"
import { CheckCircle2, X, Star, ArrowRight, Sparkles, Zap, Crown, HelpCircle } from "lucide-react"

export default function Pricing() {
  const plans = [
    {
      name: "Basic",
      description: "Cocok untuk kebutuhan personal atau tugas.",
      monthlyPrice: 15000,
      icon: Zap,
      features: [
        "1 Pilihan Desain Poster",
        "2x Revisi Gratis",
        "Format File (JPG / PNG)",
        "Resolusi Standar",
        "Pengerjaan 2-3 Hari",
        "Support via Chat",
      ],
      notIncluded: [
        "Source File (PSD/AI)", 
        "Desain Super Kompleks", 
        "Pengerjaan Kilat (1 Hari)", 
        "Konsultasi Konsep"
      ],
      popular: false,
      buttonText: "Pilih Basic",
      buttonStyle: "bg-orange-50 text-orange-600 hover:bg-orange-100",
    },
    {
      name: "Professional",
      description: "Paling pas untuk promosi event & branding.",
      monthlyPrice: 20000,
      icon: Sparkles,
      features: [
        "1 Desain Poster Premium",
        "5x Revisi Gratis",
        "Semua Format (JPG, PNG, PDF)",
        "Resolusi Tinggi (High-Res)",
        "Source File Included",
        "Pengerjaan 2-3 Hari",
        "Konsultasi Arah Desain",
        "Support Prioritas",
      ],
      notIncluded: ["Pengerjaan Kilat (Same Day)"],
      popular: true,
      buttonText: "Pilih Professional",
      buttonStyle: "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/25",
    },
    {
      name: "Enterprise",
      description: "Solusi lengkap untuk skala komersial.",
      monthlyPrice: 25000,
      icon: Crown,
      features: [
        "1 Desain Poster Eksklusif",
        "Revisi Sepuasnya (Unlimited)",
        "Semua Format + Link Template",
        "Resolusi Ultra HD 4K",
        "Bisa Pengerjaan Kilat",
        "Dedicated Designer",
        "24/7 Priority Support",
        "Lisensi Komersial Bebas",
      ],
      notIncluded: [],
      popular: false,
      buttonText: "Hubungi Kami",
      buttonStyle: "bg-gray-900 text-white hover:bg-gray-800",
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
    <section id="pricing" className="relative py-24 lg:py-32 bg-white overflow-hidden selection:bg-orange-100 selection:text-orange-900">
      
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#FFF5EC] rounded-full blur-[100px] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="text-center mb-16 md:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-full">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
              Investasi Visual
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight">
            Pilih Paket <span className="text-orange-500">Harga</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto">
            Harga transparan tanpa biaya tersembunyi. Tingkatkan kualitas visual bisnis Anda dengan budget yang masuk akal.
          </p>
        </div>

        {/* ================= PRICING CARDS ================= */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col bg-white rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 p-8 md:p-10 ${
                plan.popular 
                  ? "border-2 border-orange-500 shadow-2xl shadow-orange-900/10 lg:scale-105 z-20" 
                  : "border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200 z-10"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-orange-600 to-orange-400 text-white px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                    <Star size={14} className="fill-current" />
                    Best Seller
                  </div>
                </div>
              )}

              {/* Card Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">{plan.name}</h3>
                  <p className="text-sm font-medium text-gray-500 mt-2 line-clamp-2 pr-4">{plan.description}</p>
                </div>
                <div className={`p-3 rounded-2xl flex-shrink-0 ${plan.popular ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-400'}`}>
                  <plan.icon size={24} />
                </div>
              </div>

              {/* Price */}
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                  {formatPrice(plan.monthlyPrice).replace("Rp", "")}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-400">IDR</span>
                  <span className="text-xs font-medium text-gray-500">/ project</span>
                </div>
              </div>

              <div className="h-px w-full bg-gray-100 mb-8" />

              {/* Features List */}
              <div className="flex-1 space-y-6 mb-10">
                <div className="space-y-3.5">
                  <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-4">Yang Anda Dapatkan:</p>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.notIncluded.length > 0 && (
                  <div className="space-y-3.5 pt-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Tidak Termasuk:</p>
                    {plan.notIncluded.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 opacity-60">
                        <X size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-gray-500">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <Link
                href="/order"
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all duration-300 ${plan.buttonStyle}`}
              >
                {plan.buttonText}
                <ArrowRight size={18} />
              </Link>
            </div>
          ))}
        </div>

        {/* ================= FAQ SECTION ================= */}
        <div className="mt-32 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-gray-50 rounded-2xl mb-4">
              <HelpCircle className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-3xl font-black text-gray-900">Pertanyaan Populer</h3>
            <p className="text-gray-500 mt-2 font-medium">Masih ragu? Temukan jawabannya di sini.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "Apakah ada biaya tersembunyi?",
                a: "Sama sekali tidak. Harga yang tertera pada paket sudah final dan transparan. Tidak ada biaya kejutan di akhir."
              },
              {
                q: "Bagaimana sistem pembayarannya?",
                a: "Untuk keamanan bersama, pembayaran dilakukan 50% di awal (DP) dan sisa 50% dilunasi setelah desain selesai 100%."
              },
              {
                q: "Berapa lama proses pengerjaan?",
                a: "Rata-rata 2-3 hari kerja. Namun, jika Anda memilih paket Enterprise atau menambah fitur Rush Order, bisa selesai kurang dari 24 jam."
              },
              {
                q: "Bagaimana jika saya tidak suka hasilnya?",
                a: "Tenang saja! Setiap paket sudah mencakup jatah revisi (bahkan unlimited untuk Enterprise) agar hasil akhirnya benar-benar sesuai keinginan Anda."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}