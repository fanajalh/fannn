import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star, CheckCircle2, Layout, PenTool, TrendingUp } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 bg-white overflow-hidden selection:bg-orange-100 selection:text-orange-900">
      
      {/* Background Decor: Clean Abstract Shapes */}
      <div className="absolute top-0 right-0 -translate-y-20 translate-x-20 w-[600px] h-[600px] bg-orange-50/80 rounded-full blur-[100px] opacity-80 pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 translate-y-20 -translate-x-20 w-[500px] h-[500px] bg-[#FFF5EC] rounded-full blur-[80px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          
          {/* ================= LEFT CONTENT (Copywriting) ================= */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            
            {/* Sleek Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-orange-50 border border-orange-100/50 rounded-full shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
                Top Rated Design Studio
              </span>
            </div>

            {/* Editorial Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
              Visual Bisnis <br className="hidden sm:block" />
              <span className="text-orange-500">
                Level Selanjutnya.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              Kami mengubah ide brilian Anda menjadi desain poster profesional. Tarik lebih banyak audiens, tingkatkan promosi, dan bangun identitas <span className="font-semibold text-gray-800">brand</span> yang kuat.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
              <Link 
                href="/order" 
                className="group flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all duration-300 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-1"
              >
                Mulai Project Anda
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </Link>

              <Link 
                href="#portfolio" 
                className="group flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border-2 border-orange-100 font-bold rounded-2xl hover:border-orange-500 hover:text-orange-600 transition-all duration-300 shadow-sm"
              >
                <Layout className="w-5 h-5 text-orange-400 group-hover:text-orange-500 transition-colors" />
                Lihat Portfolio
              </Link>
            </div>

            {/* Social Proof / Avatars */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-6 border-t border-gray-100">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="Client" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600 z-10 shadow-sm">
                  100+
                </div>
              </div>
              <div className="text-sm text-left">
                <div className="flex items-center gap-1 justify-center sm:justify-start text-orange-400 mb-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="font-medium text-gray-600">Dipercaya Klien Bisnis</p>
              </div>
            </div>

          </div>

          {/* ================= RIGHT CONTENT (Visual Presentation) ================= */}
          <div className="flex-1 w-full relative max-w-lg lg:max-w-none mx-auto mt-10 lg:mt-0">
            
            {/* The Main "Canvas" Box */}
            <div className="relative z-10 bg-white p-4 rounded-[2.5rem] shadow-2xl shadow-orange-900/5 border border-orange-50">
              <div className="relative overflow-hidden rounded-[2rem] bg-orange-50 aspect-[4/5] w-full border border-orange-100/50">
                <Image
                  src="/feed arfan (20).png" // Pastikan gambar ini transparan atau cerah
                  alt="Desain Poster Premium"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>

            {/* Floating Card 1: Tool/Software (Top Right) */}
            <div className="absolute -right-6 top-20 z-20 bg-white p-4 rounded-2xl shadow-xl shadow-orange-900/5 border border-orange-50 hidden md:flex items-center gap-3 animate-[bounce_5s_infinite]">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <PenTool className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-orange-500 uppercase tracking-wider">Kualitas</p>
                <p className="text-sm font-black text-gray-800">Super HD 4K</p>
              </div>
            </div>

            {/* Floating Card 2: Satisfaction Guarantee (Bottom Left) */}
            <div className="absolute -left-10 bottom-16 z-20 bg-white p-4 rounded-2xl shadow-xl shadow-orange-900/5 border border-orange-50 hidden md:flex items-center gap-3 transform -rotate-2 hover:rotate-0 transition-transform">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-black text-gray-800">Revisi Terjamin</p>
                <p className="text-xs font-medium text-gray-500">100% Kepuasan Klien</p>
              </div>
            </div>

            {/* Floating Card 3: Mini Stat (Top Left) */}
            <div className="absolute -left-4 top-0 z-0 bg-white py-2 px-4 rounded-full shadow-lg shadow-orange-900/5 border border-orange-100 hidden lg:flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-gray-700">Omzet Naik</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}