// components/sections/Lynk.tsx
"use client"

import { ArrowRight, Tablet, ExternalLink, ScanLine } from "lucide-react" 
import Link from "next/link"
import Image from "next/image"

export default function Lynk() {
  const lynkUrl = "https://lynk.id/fan_ajalah"; 

  return (
    <section className="relative py-24 md:py-32 bg-white overflow-hidden">
      {/* Dekorasi Latar Belakang - Konsisten dengan Hero */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-orange-50 rounded-full blur-[120px] -z-10 opacity-60" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-orange-100 rounded-full blur-[100px] -z-10 opacity-40" />

      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        
        {/* --- Header Section --- */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-100 mb-6 transition-transform hover:scale-105">
            <ExternalLink className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-bold text-orange-600 uppercase tracking-widest">Digital Store</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Semua Produk Kami, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400">
              Sekali Klik!
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Akses instan ke template eksklusif, ebook panduan, dan layanan desain premium melalui satu halaman Lynk.id yang praktis.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Bagian Kiri: Tombol Utama (Direct Access) */}
          <div className="group relative flex flex-col items-center justify-center p-10 bg-gradient-to-br from-white to-orange-50/30 rounded-[2.5rem] shadow-xl shadow-orange-900/5 border border-orange-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ExternalLink className="w-32 h-32" />
            </div>
            
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Akses Toko Digital</h3>
            <p className="text-gray-500 text-center mb-10 max-w-xs">Beli aset desain favoritmu langsung melalui platform Lynk.id.</p>
            
            <Link
              href={lynkUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn relative inline-flex items-center justify-center gap-3 bg-gray-900 text-white font-bold py-5 px-10 rounded-2xl text-lg shadow-2xl transition-all duration-300 hover:bg-orange-600 hover:scale-105 w-full"
            >
              Kunjungi Lynk.id Kami
              <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
            </Link>

            <p className="text-xs font-medium text-gray-400 mt-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Direct access to @fan_ajalah
            </p>
          </div>

          {/* Bagian Kanan: QR Code (Mobile Experience) */}
          <div className="group relative flex flex-col md:flex-row items-center gap-8 p-10 bg-white rounded-[2.5rem] shadow-xl shadow-orange-900/5 border border-orange-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
            
            {/* Container QR Code dengan Efek Pindai */}
            <div className="relative flex-shrink-0 group-hover:rotate-3 transition-transform duration-500">
              <div className="w-40 h-40 relative bg-white rounded-[2rem] p-4 flex items-center justify-center shadow-2xl shadow-orange-500/10 border border-orange-50">
                <Image
                  src="/qr.png" 
                  alt="QR Code JokiPoster"
                  width={160}
                  height={160}
                  className="rounded-xl"
                />
                {/* Garis Animasi Pindai */}
                <div className="absolute top-0 left-0 w-full h-1 bg-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.8)] animate-[scan_3s_infinite] pointer-events-none" />
              </div>
              <div className="absolute -top-3 -right-3 bg-orange-600 text-white p-2 rounded-full shadow-lg">
                <ScanLine className="w-5 h-5" />
              </div>
            </div>
            
            <div className="text-center md:text-left space-y-4">
              <h3 className="text-2xl font-extrabold text-gray-900">Scan & Go!</h3>
              <p className="text-gray-500 leading-relaxed">
                Pindai kode QR untuk akses instan via smartphone. Praktis, cepat, dan tanpa ribet mengetik.
              </p>
              <div className="inline-block px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                <code className="text-sm font-bold text-orange-600">{lynkUrl.replace('https://', '')}</code>
              </div>
            </div>
          </div>
        </div>

        {/* --- BAGIAN TAMBAHAN: MOCKUP INTERAKTIF --- */}
        <div className="mt-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-100/20 to-transparent -z-10" />
          
          <div className="max-w-4xl mx-auto">
            {/* Header Mockup Browser */}
            <div className="bg-gray-900 rounded-t-[1.5rem] p-4 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1 bg-white/10 rounded-lg py-1 px-4 flex items-center justify-between">
                <span className="text-[10px] text-white/50 font-mono tracking-wider">https://lynk.id/fan_ajalah</span>
                <Tablet className="w-3 h-3 text-white/30" />
              </div>
            </div>

            {/* Konten Mockup */}
            <div className="bg-white rounded-b-[1.5rem] shadow-2xl border-x border-b border-gray-200 p-8 md:p-16 text-center">
              <div className="max-w-2xl mx-auto space-y-8">
                <h4 className="text-3xl md:text-4xl font-black text-gray-900">
                  Visual Berkualitas, <br className="md:hidden" />
                  Branding Jadi Berkelas.
                </h4>
                <p className="text-lg text-gray-500">
                  Dapatkan koleksi ratusan template poster, ebook strategi desain, dan aset eksklusif lainnya yang didesain khusus untuk meningkatkan konversi bisnismu.
                </p>
                <Link
                  href={lynkUrl}
                  target="_blank"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-orange-400 text-white font-bold py-4 px-10 rounded-full shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all"
                >
                  Lihat Koleksi Lengkap
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tambahkan Animasi Custom Scan di Tailwind Config atau Global CSS Anda */}
      <style jsx>{`
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>
    </section>
  )
}