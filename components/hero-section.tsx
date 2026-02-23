import { Lightbulb, Sparkles, MessageCircle, Heart, ArrowRight, User } from "lucide-react"
// Import Supabase jika nanti kamu butuh fetch data jumlah saran di server
import { getSupabaseServerClient } from "@/lib/supabase/server"

export default async function HeroSection() {
  // Contoh jika kamu ingin fetch total saran:
  // const supabase = await getSupabaseServerClient();
  // const { count } = await supabase.from('suggestions').select('*', { count: 'exact', head: true });

  return (
    <section id="beranda" className="relative overflow-hidden py-20 lg:py-32 bg-[#FAFAFA] selection:bg-orange-100 selection:text-orange-900">
      
      {/* --- BACKGROUND DECORATIONS --- */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* --- TEXT CONTENT (LEFT SIDE) --- */}
          <div className="flex-1 text-center lg:text-left animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-orange-100 rounded-full mb-8 shadow-sm">
              <Sparkles size={14} className="text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Suara Anda Berharga</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.05] tracking-tighter mb-6">
              Kotak Saran <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 drop-shadow-sm">
                JokiPoster.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-500 font-medium mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Bantu kami menjadi lebih baik. Setiap kritik, ide fitur, atau saran desain dari Anda adalah fondasi utama kami untuk terus berinovasi.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <a
                href="#kirim-saran"
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl md:rounded-[2rem] transition-all duration-300 shadow-xl shadow-orange-500/25 hover:-translate-y-1 active:scale-95 w-full sm:w-auto"
              >
                <MessageCircle size={20} />
                Tulis Saran Sekarang
              </a>
              <a
                href="#daftar-saran"
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-bold rounded-2xl md:rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-orange-200 w-full sm:w-auto"
              >
                Lihat Diskusi
                <ArrowRight size={18} className="text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
              </a>
            </div>
          </div>

          {/* --- ILLUSTRATION (RIGHT SIDE) --- */}
          <div className="flex-1 flex justify-center lg:justify-end relative animate-in fade-in zoom-in-95 duration-1000 delay-200">
            
            <div className="relative w-full max-w-[400px]">
              
              {/* Main Floating Mockup Card */}
              <div className="relative z-10 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-gray-100 p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                      <User size={18} className="text-orange-500" />
                    </div>
                    <div>
                      <div className="h-3 w-24 bg-gray-200 rounded-full mb-2" />
                      <div className="h-2 w-16 bg-gray-100 rounded-full" />
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-emerald-50 rounded-full">
                    <div className="h-2 w-12 bg-emerald-400 rounded-full" />
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="h-3 w-full bg-gray-100 rounded-full" />
                  <div className="h-3 w-[90%] bg-gray-100 rounded-full" />
                  <div className="h-3 w-[60%] bg-gray-100 rounded-full" />
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                  <Heart size={16} className="text-rose-500 fill-rose-500" />
                  <div className="h-2 w-8 bg-rose-200 rounded-full" />
                </div>
              </div>

              {/* Floating Element 1: Lightbulb */}
              <div className="absolute -top-10 -right-4 w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl shadow-xl flex items-center justify-center animate-[bounce_4s_infinite] z-20 transform rotate-12">
                <Lightbulb className="w-10 h-10 text-white" />
              </div>

              {/* Floating Element 2: Small Sparkle */}
              <div className="absolute top-1/2 -left-8 w-14 h-14 bg-white rounded-full shadow-lg border border-gray-50 flex items-center justify-center animate-[bounce_5s_infinite_1s] z-20">
                <Sparkles className="w-6 h-6 text-amber-500" />
              </div>

              {/* Floating Element 3: Message Bubble */}
              <div className="absolute -bottom-6 right-10 w-16 h-16 bg-gray-900 rounded-[1.5rem] rounded-br-none shadow-2xl flex items-center justify-center animate-[bounce_6s_infinite_2s] z-20">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  )
}