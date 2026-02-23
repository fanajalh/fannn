"use client"

import { useState } from "react"
import Link from "next/link"
import { FileImage, Printer, Smartphone, ArrowRight, CheckCircle2, Sparkles } from "lucide-react"

export default function Services() {
  const [activeCategory, setActiveCategory] = useState("poster")

  const categories = [
    { id: "poster", label: "Poster Design", icon: FileImage },
    { id: "social", label: "Social Media", icon: Smartphone },
    { id: "print", label: "Print Design", icon: Printer },
  ]

  const services = {
    poster: [
      {
        title: "Poster Event",
        description: "Desain poster untuk konser, seminar, workshop, dan berbagai acara.",
        features: ["Desain menarik & relevan", "Informasi tersusun rapi", "Format siap cetak", "3x revisi gratis"],
        price: "15.000",
        popular: false,
      },
      {
        title: "Poster Promosi",
        description: "Poster untuk promosi produk, jasa, dan penawaran khusus bisnis Anda.",
        features: ["Desain persuasif", "Call-to-action jelas", "Konsisten dengan brand", "Multiformat (IG/WA)"],
        price: "15.000",
        popular: true,
      },
      {
        title: "Poster Edukasi",
        description: "Poster informatif untuk kampanye, sosialisasi, dan edukasi masyarakat.",
        features: ["Infografis menarik", "Mudah dipahami audiens", "Data terstruktur akurat", "Visual engaging"],
        price: "20.000",
        popular: false,
      },
    ],
    social: [
      {
        title: "Instagram Post",
        description: "Desain feed Instagram yang konsisten dan memikat audiens.",
        features: ["Template set", "Brand consistent", "Engagement focused", "Resolusi tinggi"],
        price: "25.000",
        popular: true,
      },
      {
        title: "Social Media Story",
        description: "Template semua story platform media sosial (IG, WA, FB).",
        features: ["Multi-platform rasio", "Mudah dibaca", "Brand guidelines", "Visual kekinian"],
        price: "10.000",
        popular: false,
      },
      {
        title: "Cover & Banner",
        description: "Cover Facebook, banner YouTube, dan header sosial media lainnya.",
        features: ["Platform optimized", "High resolution", "Brand aligned", "Pengerjaan cepat"],
        price: "20.000",
        popular: false,
      },
    ],
    print: [
      {
        title: "Flyer & Leaflet",
        description: "Desain flyer dan leaflet untuk sebar brosur promosi/informasi.",
        features: ["Eye-catching design", "Print optimization (CMYK)", "Cost effective", "Fast turnaround"],
        price: "15.000",
        popular: false,
      },
      {
        title: "Banner & Spanduk",
        description: "Banner besar untuk event, promosi, dan advertising outdoor.",
        features: ["Large format scale", "Detail tidak pecah", "High visibility", "Ukuran custom"],
        price: "20.000",
        popular: true,
      },
    ],
  }

  return (
    <section id="services" className="relative py-24 bg-[#FAFAFA] overflow-hidden selection:bg-orange-100 selection:text-orange-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        
        {/* ================= HEADER ================= */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-orange-50 rounded-2xl mb-2">
            <Sparkles className="w-6 h-6 text-orange-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Layanan <span className="text-orange-500">Kreatif</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            Temukan solusi visual yang tepat untuk setiap kebutuhan. Dari digital hingga cetak, kami siap membantu.
          </p>
        </div>

        {/* ================= CATEGORY TABS ================= */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 bg-white p-1.5 rounded-full shadow-sm border border-gray-100 max-w-fit mx-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <category.icon size={18} />
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* ================= SERVICES GRID ================= */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services[activeCategory as keyof typeof services].map((service, index) => (
            <div
              key={index}
              className={`relative bg-white p-8 rounded-[2rem] transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full ${
                service.popular 
                  ? "border-2 border-orange-500 shadow-xl shadow-orange-900/5" 
                  : "border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200"
              }`}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-orange-500 text-white px-4 py-1 text-xs font-black uppercase tracking-widest rounded-full shadow-md">
                  Pilihan Utama
                </div>
              )}

              {/* Title & Description */}
              <div className="mb-6">
                <h3 className="text-xl font-black text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm font-medium text-gray-500 leading-relaxed line-clamp-2">
                  {service.description}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-gray-100 mb-6" />

              {/* Features List */}
              <div className="mb-8 flex-1">
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price & Action */}
              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Mulai Dari</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-gray-900">{service.price}</span>
                  </div>
                </div>
                
                <Link
                  href="/order"
                  className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 group ${
                    service.popular 
                      ? "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/25" 
                      : "bg-gray-50 text-gray-900 hover:bg-gray-900 hover:text-white"
                  }`}
                  title="Order Sekarang"
                >
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}