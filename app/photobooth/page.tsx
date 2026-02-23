"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Camera, Sparkles, Image as ImageIcon, Heart, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 overflow-hidden selection:bg-orange-100 selection:text-orange-900">
      
      {/* ================= BACKGROUND DECORATIONS ================= */}
      {/* Orbs Oranye */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-orange-100/50 rounded-full blur-[120px] opacity-80 pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-[#FFF5EC] rounded-full blur-[100px] pointer-events-none z-0"></div>
      
      {/* Dekoratif Lembaran Foto Melayang */}
      <div className="absolute top-20 left-[10%] w-32 h-40 bg-white shadow-xl rounded-xl border border-gray-100 -rotate-12 hidden md:flex items-center justify-center opacity-40 animate-[bounce_6s_infinite]">
         <ImageIcon className="text-orange-200" size={40} />
      </div>
      <div className="absolute bottom-20 right-[10%] w-36 h-44 bg-white shadow-2xl rounded-xl border border-gray-100 rotate-12 hidden md:flex items-center justify-center opacity-60 animate-[bounce_5s_infinite_1s]">
         <Heart className="text-orange-200" size={48} />
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-2xl w-full relative z-10">
        <div className="bg-white/70 backdrop-blur-xl rounded-[3rem] border border-white p-8 md:p-16 text-center shadow-2xl shadow-orange-900/5 transition-all duration-500 hover:shadow-orange-900/10">
          
          {/* Icon Header */}
          <div className="relative inline-block mb-10">
            <div className="w-24 h-24 bg-gradient-to-tr from-orange-500 to-orange-400 rounded-3xl flex items-center justify-center shadow-xl shadow-orange-500/30 transform -rotate-6 group hover:rotate-0 transition-transform duration-500">
              <Camera className="text-white w-12 h-12" />
            </div>
            <div className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center animate-pulse">
              <Sparkles className="text-orange-500 w-5 h-5" />
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-4 mb-12">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.1]">
              Capture The <br />
              <span className="text-orange-500">Moment.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
              Abadikan momen seru Anda dengan berbagai pilihan frame dekoratif yang estetik dan unik.
            </p>
          </div>

          {/* Action Button */}
          <div className="flex flex-col gap-4">
            <Link href="/frames" className="block group">
              <Button className="w-full bg-gray-900 hover:bg-orange-500 text-white py-8 rounded-[1.5rem] text-xl font-bold transition-all duration-300 shadow-xl shadow-gray-900/10 hover:shadow-orange-500/30 hover:-translate-y-1 flex items-center justify-center gap-3">
                Mulai Photobooth
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
              100% Free & High Resolution
            </p>
          </div>

          {/* Trusted Badges */}
          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap justify-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Custom Frames</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Auto Layout</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Instan Download</span>
             </div>
          </div>

        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
            <p className="text-sm font-medium text-gray-400">
                Powered by <span className="font-bold text-orange-500">JokiPoster Creative</span>
            </p>
        </div>
      </div>

    </div>
  )
}