import Link from "next/link";
// Import Lucide Icons
import { Palette, Phone, Mail } from "lucide-react";
// Import React Icons (SiInstagram, SiTiktok)
import { SiInstagram, SiTiktok } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-400 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">JokiPoster</span>
            </Link>
            <p className="text-gray-400">
              Jasa desain poster profesional untuk kebutuhan bisnis dan personal Anda.
            </p>
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/fan_ajalah?igsh=MXUyNGw4cWhjc25wdw=="
                className="text-gray-400 hover:text-orange-500 transition-colors duration-300"
                aria-label="Instagram"
              >
                <SiInstagram size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@fan_ajalahh?_t=ZS-90aG7JIzUnZ&_r=1"
                className="text-gray-400 hover:text-orange-500 transition-colors duration-300"
                aria-label="TikTok"
              >
                <SiTiktok size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Layanan</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#services" className="hover:text-orange-500 transition-colors duration-300">
                  Poster Event
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-orange-500 transition-colors duration-300">
                  Poster Promosi
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-orange-500 transition-colors duration-300">
                  Logo Design
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-orange-500 transition-colors duration-300">
                  Social Media
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Perusahaan</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-orange-500 transition-colors duration-300">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="#portfolio" className="hover:text-orange-500 transition-colors duration-300">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-orange-500 transition-colors duration-300">
                  Harga
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-orange-500 transition-colors duration-300">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Kontak</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>+62 857-2815-0223</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>muhammadfachriarfan7@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 JokiPoster. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}