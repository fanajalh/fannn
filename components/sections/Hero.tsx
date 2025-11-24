import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star, Users, Award } from "lucide-react"

export default function Hero() {
  return (
    <section className="pt-20 pb-16 bg-gradient-to-br from-orange-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold animate-bounce">
                <Star className="w-4 h-4 fill-current " />
                <span>Jasa Desain Poster Terpercaya</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight animate-slide-up">
                Desain Poster
                <span className="gradient-text block animate-pulse">Profesional</span>
                untuk Bisnis Anda
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed animate-fade-in">
                Dapatkan desain poster berkualitas tinggi dengan harga terjangkau. Cocok untuk event, promosi, dan
                kebutuhan bisnis lainnya.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3 animate-zoom-in">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center animate-pulse">
                  <Users className="w-6 h-6 text-orange-500 animate-bounce" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">50+</div>
                  <div className="text-gray-600">Klien Puas</div>
                </div>
              </div>

              <div className="flex items-center gap-3 animate-zoom-in">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center animate-pulse">
                  <Award className="w-6 h-6 text-orange-500 animate-spin-slow" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">100+</div>
                  <div className="text-gray-600">Poster Dibuat</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/order" className="btn btn-primary hover:animate-bounce">
                <span>Mulai Order</span>
                <ArrowRight className="w-5 h-5 animate-slide-right" />
              </Link>

              <Link href="#portfolio" className="btn btn-secondary hover:animate-pulse">
                Lihat Portfolio
              </Link>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative z-10 animate-fade-in">
              <Image
                src="/feed arfan (20).png"
                alt="Contoh Desain Poster"
                width={500}
                height={600}
                className="rounded-2xl shadow-2xl animate-zoom-in"
              />
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full opacity-20 animate-ping"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-r from-orange-300 to-orange-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
