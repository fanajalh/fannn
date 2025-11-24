"use client"

import { useState } from "react"
import Link from "next/link"
import { FileImage, Palette, Printer, Smartphone, ArrowRight, Check } from "lucide-react"

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
        description: "Desain poster untuk konser, seminar, workshop, dan berbagai acara",
        features: ["Desain menarik", "Informasi lengkap", "Format print-ready", "3 revisi gratis"],
        price: "Mulai 15K",
        popular: false,
      },
      {
        title: "Poster Promosi",
        description: "Poster untuk promosi produk, jasa, dan penawaran khusus bisnis Anda",
        features: ["Desain persuasif", "Call-to-action jelas", "Brand consistency", "Multiple format"],
        price: "Mulai 15K",
        popular: true,
      },
      {
        title: "Poster Edukasi",
        description: "Poster informatif untuk kampanye, sosialisasi, dan edukasi masyarakat",
        features: ["Infografis menarik", "Mudah dipahami", "Data akurat", "Visual engaging"],
        price: "Mulai 20K",
        popular: false,
      },
    ],
    
    social: [
      {
        title: "Instagram Post",
        description: "Desain feed Instagram yang konsisten dan menarik",
        features: ["Template set", "Brand consistent", "Engagement focused", "Story format"],
        price: "Mulai 25K/post",
        popular: true,
      },
      {
        title: "Social Media story",
        description: "template semua story platform media sosial",
        features: ["Multi-platform", "Easy to edit", "Brand guidelines"],
        price: "Mulai 10K",
        popular: false,
      },
      {
        title: "Cover & Banner",
        description: "Cover Facebook, banner YouTube, dan header media sosial lainnya",
        features: ["Platform optimized", "High resolution", "Brand aligned", "Quick delivery"],
        price: "Mulai 20K",
        popular: false,
      },
    ],
    print: [
      {
        title: "Flyer & Leaflet",
        description: "Desain flyer dan leaflet untuk promosi dan informasi",
        features: ["Eye-catching design", "Print optimization", "Cost effective", "Fast turnaround"],
        price: "Mulai 15K",
        popular: false,
      },
      {
        title: "Banner & Spanduk",
        description: "Banner besar untuk event, promosi, dan advertising outdoor",
        features: ["Large format", "Weather resistant", "High visibility", "Custom size"],
        price: "Mulai 20K",
        popular: true,
      },
    ],
  }

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Layanan <span className="gradient-text">Kami</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Berbagai layanan desain poster dan grafis untuk memenuhi kebutuhan bisnis dan personal Anda
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <category.icon size={20} />
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services[activeCategory as keyof typeof services].map((service, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border ${
                service.popular ? "border-orange-200" : "border-gray-200"
              } overflow-hidden`}
            >
              {service.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  Popular
                </div>
              )}

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Yang Anda Dapatkan:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check size={16} className="text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold gradient-text">{service.price}</div>
                  <Link
                    href="/order"
                    className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold transition-colors duration-300 group"
                  >
                    <span>Order</span>
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
