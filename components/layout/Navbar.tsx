"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Palette, ArrowRight } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/#services", label: "Layanan" },
    { href: "/#portfolio", label: "Portfolio" },
    { href: "/#pricing", label: "Harga" },
    { href: "/saran", label: "Saran" },
    { href: "/#contact", label: "Kontak" },
    { href: "/photobooth", label: "PhotoBooth"},
    { href: "/sarangame", label: "SaranGame"},
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        scrolled 
          ? "bg-white/80 backdrop-blur-lg shadow-sm border-b border-orange-100 py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:rotate-6 transition-transform">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900">
              Joki<span className="text-orange-600">Poster</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-bold text-gray-600 hover:text-orange-600 transition-colors duration-300 group"
                >
                  {link.label}
                  {/* Underline Animation */}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>
            
            <Link 
              href="/order" 
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-sm font-bold rounded-full shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all active:scale-95"
            >
              Order Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-xl transition-colors ${
              scrolled ? "bg-orange-50 text-orange-600" : "bg-white/20 text-gray-800 backdrop-blur-md"
            }`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div 
          className={`absolute left-0 w-full px-6 transition-all duration-300 md:hidden ${
            isOpen 
              ? "top-[100%] opacity-100 pointer-events-auto" 
              : "top-[90%] opacity-0 pointer-events-none"
          }`}
        >
          <div className="mt-4 bg-white rounded-3xl shadow-2xl border border-orange-50 p-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-lg font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-2xl transition-all"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-gray-100" />
            <Link
              href="/order"
              className="block w-full py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-center font-bold rounded-2xl shadow-lg shadow-orange-500/20"
              onClick={() => setIsOpen(false)}
            >
              Order Sekarang
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}