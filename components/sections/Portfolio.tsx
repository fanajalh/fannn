"use client" // WAJIB: Mengaktifkan Client Component untuk menggunakan useState dan interaksi

import { useState } from "react" // Import hook useState
import Image from "next/image"
import { ExternalLink, X } from "lucide-react" // Menambahkan X untuk tombol tutup modal

export default function Portfolio() {
  // 1. State untuk mengontrol modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")
  const [selectedTitle, setSelectedTitle] = useState("")

  // Data Portofolio (Gunakan path gambar asli di folder /public)
  const portfolioItems = [
    {
      title: "Poster Edukasi Kesehatan",
      category: "Edukasi",
      // Ganti placeholder dengan path gambar asli Anda!
      image: "/TBC Fiks.png", 
      description: "Poster kampanye kesehatan dengan infografis menarik",
    },
    {
      title: "Poster Promosi Cafe",
      category: "Promosi",
      image: "/promosi.png", 
      description: "Poster promosi menu cafe dengan desain modern",
    },
    {
      title: "Poster Ucapan",
      category: "Poster",
      image: "/flyer.png", 
      description: "Logo minimalis untuk brand fashion lokal",
    },
    {
      title: "Social Media Template",
      category: "Social Media",
      image: "/ucapan.png", 
      description: "Template Instagram untuk ucapan",
    },
    {
      title: "Banner Event Seminar",
      category: "Print",
      image: "/Poster Seminar.png", 
      description: "Banner besar untuk seminar bisnis dan teknologi",
    },
    {
      title: "Poster Edukasi",
      category: "Edukasi",
      image: "/infografis.jpg", 
      description: "Poster kampanye dengan infografis menarik",
    },
  ]
  
  // Fungsi untuk membuka modal
  const openModal = (imageSrc: string, title: string) => {
    setSelectedImage(imageSrc)
    setSelectedTitle(title)
    setIsModalOpen(true)
  }

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedImage("")
    setSelectedTitle("")
  }

  return (
    <>
      <section id="portfolio" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Portfolio <span className="gradient-text">Kami</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lihat hasil karya terbaik kami yang telah membantu berbagai klien mencapai tujuan mereka
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-400 mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Portfolio Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item, index) => (
              <div
                key={index}
                // Tambahkan onClick handler untuk membuka modal
                onClick={() => openModal(item.image, item.title)}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  <Image
                    // NOTE: Hapus query string jika menggunakan gambar asli
                    src={item.image}
                    alt={item.title}
                    width={300}
                    height={400}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    {/* Mengganti ExternalLink dengan indikator zoom */}
                    <span className="text-white text-lg font-semibold border-2 border-white px-4 py-2 rounded-full">
                      Lihat Detail
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">Ingin melihat lebih banyak karya kami?</p>
            <a
              href="https://www.instagram.com/fan_ajalah?igsh=MXUyNGw4cWhjc25wdw=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-orange-600 text-white hover:bg-orange-700 font-bold py-3 px-8 rounded-full shadow-md transition duration-300"
            >
              Lihat di Instagram
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* KOMPONEN MODAL/POP-UP */}
      {/* ========================================================== */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4 transition-opacity duration-300"
          onClick={closeModal} // Tutup modal jika mengklik area gelap di luar
        >
          <div 
            className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full p-4 md:p-6 animate-zoom-in"
            onClick={(e) => e.stopPropagation()} // Cegah penutupan saat mengklik di dalam modal
          >
            {/* Tombol Tutup */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              aria-label="Tutup Modal"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Konten Gambar */}
            <div className="relative w-full h-auto">
                <Image
                    src={selectedImage}
                    alt={selectedTitle}
                    width={800} // Atur lebar yang lebih besar untuk modal
                    height={800} // Atur tinggi yang lebih besar
                    className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                    // Menggunakan style fill jika aspect ratio tidak terprediksi, 
                    // tetapi width/height lebih baik jika aspect ratio bisa diprediksi.
                />
            </div>
            
            {/* Keterangan */}
            <h3 className="text-2xl font-bold text-gray-800 mt-4 text-center">
                {selectedTitle}
            </h3>
          </div>
        </div>
      )}
    </>
  )
}