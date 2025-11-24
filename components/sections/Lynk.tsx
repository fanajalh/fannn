// components/sections/Lynk.tsx
// Hapus QrCode dari lucide-react, tambahkan Image dari next/image
import { ArrowRight, Tablet } from "lucide-react" 
import Link from "next/link"
import Image from "next/image" // Import Image untuk menampilkan gambar QR Code

export default function Lynk() {
  const lynkUrl = "https://lynk.id/fan_ajalah"; 
  // Path ke gambar QR Code yang sudah Anda generate dan simpan di folder public
  const qrCodeImagePath = "/qr-fan-ajalah.png"; 

  return (
    <section className="py-20 md:py-28 bg-orange-50 text-gray-800">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* --- Bagian Utama (CTA & QR Code) --- */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-orange-600 mb-4">
            Semua Produk Kami, Sekali Klik!
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Akses instan ke template, ebook, dan layanan desain premium JokiPoster melalui satu halaman Lynk.id yang praktis.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Bagian Kiri: Tombol Utama (Mobile Focus) */}
          <div className="flex flex-col items-center justify-center space-y-8 text-center md:text-left p-6 bg-white rounded-2xl shadow-xl border-t-4 border-orange-500">
            <h3 className="text-2xl font-bold text-gray-900">Mulai Belanja Produk Digital</h3>
            
            {/* Tombol Utama CTA */}
            <Link
              href={lynkUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-orange-600 text-white hover:bg-orange-700 font-bold py-4 px-12 rounded-full text-xl shadow-lg transition duration-300 transform hover:scale-105 w-full max-w-sm"
            >
              Kunjungi Lynk.id Kami
              <ArrowRight className="w-6 h-6" />
            </Link>

            {/* Teks Bawah Tombol */}
            <p className="text-sm text-gray-500 mt-2">
              Anda akan diarahkan ke halaman resmi Lynk.id (@fan_ajalah).
            </p>
          </div>

          {/* Bagian Kanan: QR Code dan Teks Info */}
          <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-white rounded-2xl shadow-xl border-b-4 border-orange-500">
            
            {/* INI BAGIAN YANG DIUBAH MENJADI GAMBAR QR CODE */}
            <div className="flex-shrink-0 w-36 h-36 relative bg-white rounded-lg flex items-center justify-center shadow-inner border-4 border-white overflow-hidden">
              <Image
                src="qr.png" // Menggunakan path gambar QR Code Anda
                alt="QR Code untuk Lynk.id JokiPoster"
                width={144} // Ukuran sesuai w-36 h-36 (144px)
                height={144} // Ukuran sesuai w-36 h-36 (144px)
                priority // Agar gambar dimuat lebih awal
                className="rounded-md"
              />
            </div>
            
            {/* Teks Info */}
            <div className="text-center md:text-left space-y-3">
              <h3 className="text-2xl font-bold text-gray-900">Pindai untuk Akses Cepat</h3>
              <p className="text-gray-600">
                Langsung pindai Kode QR ini dengan kamera *smartphone* Anda untuk mengakses katalog produk digital kami tanpa mengetik alamat.
              </p>
              <p className="text-sm text-orange-500 font-medium">
                Link: <code>{lynkUrl.replace('https://', '')}</code>
              </p>
            </div>
          </div>
        </div>

        {/* --- BAGIAN TAMBAHAN: VISUALISASI TABLET --- */}
        <div className="mt-20 pt-10 border-t border-gray-200">
            <div className="text-center mb-10">
                <h3 className="text-3xl font-extrabold text-gray-900">
                    Desain JokiPoster, Selalu Responsif
                </h3>
                <p className="text-lg text-gray-600 mt-2">
                    Lihat bagaimana produk desain premium kami dapat membantu Anda.
                </p>
            </div>
            
            <div className="flex justify-center">
                <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl p-6 md:p-10 border-t-8 border-orange-400">
                    
                    <div className="flex items-center justify-between border-b pb-4 mb-6">
                        <div className="flex items-center space-x-3">
                            <Tablet className="w-6 h-6 text-gray-500"/>
                            <span className="text-xl font-semibold text-gray-700">Tampilan Premium</span>
                        </div>
                        <span className="text-sm text-gray-400">lynk.id/fan_ajalah</span>
                    </div>

                    <div className="text-center py-6">
                        <h4 className="text-3xl font-bold text-gray-900 mb-4">
                            Siap Tingkatkan Kualitas Visual Anda?
                        </h4>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Dapatkan akses penuh ke ratusan template desain dan panduan eksklusif. Investasi terbaik untuk *branding* Anda!
                        </p>
                        
                        <Link
                            href={lynkUrl} // MENGGUNAKAN URL BARU
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-3 bg-orange-500 text-white hover:bg-orange-600 font-bold py-3 px-8 rounded-full text-lg shadow-md transition duration-300"
                        >
                            <ArrowRight className="w-5 h-5" />
                            Lihat Semua Koleksi Digital
                        </Link>
                    </div>

                </div>
            </div>
        </div>

      </div>
    </section>
  )
}