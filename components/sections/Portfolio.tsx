"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Search, Instagram, Filter } from "lucide-react"

export default function Portfolio() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")
  const [selectedTitle, setSelectedTitle] = useState("")
  const [activeCategory, setActiveCategory] = useState("Semua")

  const portfolioItems = [
    { title: "Poster Edukasi Kesehatan", category: "Edukasi", image: "/TBC Fiks.png", description: "Infografis kampanye kesehatan TBC." },
    { title: "Poster Promosi Cafe", category: "Promosi", image: "/promosi.png", description: "Desain estetik untuk menu baru cafe." },
    { title: "Poster Ucapan", category: "Poster", image: "/flyer.png", description: "Flyer ucapan hari besar nasional." },
    { title: "Social Media Template", category: "Social Media", image: "/ucapan.png", description: "Template Instagram branding." },
    { title: "Banner Event Seminar", category: "Print", image: "/Poster Seminar.png", description: "Poster seminar teknologi & bisnis." },
    { title: "Poster Edukasi", category: "Edukasi", image: "/infografis.jpg", description: "Visualisasi data edukatif." },
  ]

  const categories = ["Semua", ...new Set(portfolioItems.map((item) => item.category))]

  const filteredItems = activeCategory === "Semua" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory)

  const openModal = (imageSrc: string, title: string) => {
    setSelectedImage(imageSrc)
    setSelectedTitle(title)
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden' // Mencegah scroll saat modal buka
  }

  const closeModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = 'auto'
  }

  return (
    <section id="portfolio" className="relative py-24 bg-white overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-bold mb-4 border border-orange-100">
            <Filter className="w-4 h-4" />
            <span>Karya Terbaik</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Portfolio <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">JokiPoster</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Eksplorasi hasil karya desain kami. Dari edukasi hingga promosi bisnis, kami hadirkan visual yang menjual.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                activeCategory === cat 
                ? "bg-gray-900 text-white shadow-lg shadow-gray-200" 
                : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              onClick={() => openModal(item.image, item.title)}
              className="group relative bg-white rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
            >
              {/* Image Container - Aspect Poster (3:4) */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Glassmorphism Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 bg-white/20 p-4 rounded-full mb-4 border border-white/30">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white font-bold text-lg mb-1">{item.title}</p>
                  <p className="text-orange-200 text-sm">{item.category}</p>
                </div>

                {/* Category Tag (Static) */}
                <div className="absolute top-5 left-5 z-20">
                  <span className="bg-white/90 backdrop-blur-md text-gray-900 px-4 py-1.5 rounded-full text-xs font-black shadow-sm uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 bg-white">
                <h3 className="text-lg font-extrabold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Instagram */}
        <div className="mt-20 p-10 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] text-center relative overflow-hidden shadow-2xl">
          {/* Accent light */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-20" />
          
          <div className="relative z-10">
            <Instagram className="w-12 h-12 text-orange-500 mx-auto mb-6 animate-bounce" style={{ animationDuration: '3s' }} />
            <h3 className="text-2xl md:text-3xl font-black text-white mb-4">
              Ingin Lihat Update Terbaru?
            </h3>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Ikuti perjalanan kreatif kami dan dapatkan inspirasi desain poster setiap harinya di Instagram resmi kami.
            </p>
            <a
              href="https://www.instagram.com/fan_ajalah"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 hover:bg-orange-500 hover:text-white font-black py-4 px-10 rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Follow @fan_ajalah
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[150] flex items-center justify-center bg-gray-950/95 backdrop-blur-md p-4 transition-all duration-500"
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-3xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute -top-14 right-0 md:-right-14 text-white hover:text-orange-500 transition-colors p-2"
            >
              <X className="w-10 h-10" />
            </button>

            <div className="bg-white rounded-[2.5rem] p-3 md:p-5 shadow-2xl">
              <div className="relative aspect-[3/4] w-full max-h-[75vh]">
                <Image
                  src={selectedImage}
                  alt={selectedTitle}
                  fill
                  className="object-contain rounded-[2rem]"
                />
              </div>
              <div className="py-6 px-4 text-center">
                <h3 className="text-2xl font-black text-gray-900">{selectedTitle}</h3>
                <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}