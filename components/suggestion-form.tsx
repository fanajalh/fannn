"use client";

import { useState } from "react";
import { Transition } from "@headlessui/react"; // Membutuhkan instalasi @headlessui/react
import { Send, User, Mail, Tag, FileText, CheckCircle, X, Sparkles, Loader2 } from "lucide-react";

// Definisi kategori dan ikon emoji
const categories = [
  { value: "Desain UI/UX", icon: "🎨" },
  { value: "Fitur Baru", icon: "✨" },
  { value: "Perbaikan Bug", icon: "🐛" },
  { value: "Performa", icon: "⚡" },
  { value: "Dokumentasi", icon: "📚" },
  { value: "Lainnya", icon: "💡" },
];

export default function SuggestionForm() {
  // LOGIC: Menggunakan useState terpisah seperti di kode awal
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [error, setError] = useState<string | null>(null); // State tambahan untuk menampilkan error
  
  // DESIGN: State untuk efek Focus pada input
  const [focusedField, setFocusedField] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // LOGIC: Validasi Category wajib diisi (menggunakan alert, seperti di kode awal)
    if (!category.trim()) {
      alert("Category wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // LOGIC: Mengirim state yang terpisah
        body: JSON.stringify({ name, email, category, message }),
      });

      const result = await res.json();

      if (!res.ok) {
        // LOGIC: Menggunakan alert untuk error
        alert(result.error || "Gagal mengirim saran.");
        return;
      }

      // LOGIC: Jika sukses, tampilkan pop-up
      setShowSuccessPopup(true);

      // Reset form
      setName("");
      setEmail("");
      setCategory("");
      setMessage("");

      // LOGIC: Sembunyikan pop-up setelah 3 detik
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);

    } catch (error) {
      // LOGIC: Menangani error dan menampilkan alert
      alert("Terjadi kesalahan saat mengirim saran. Silakan coba lagi.");
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section id="kirim-saran" className="py-16 md:py-24 relative overflow-hidden bg-white">
        {/* Dekorasi Background Oranye (Blur/Glow) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF6EF]/50 to-white pointer-events-none" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF7A00]/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFA84C]/5 rounded-full blur-3xl opacity-60" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#FFE1C6] mb-4">
              <Sparkles className="w-4 h-4 text-[#FF7A00]" />
              <span className="text-sm font-medium text-[#6B7280]">Form Saran</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-4">
              Sampaikan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] to-[#FF8F2C]">
                Saran Anda
              </span>
            </h2>
            <p className="text-[#6B7280] max-w-xl mx-auto">
              Isi form di bawah ini untuk memberikan masukan. Saran Anda sangat berarti bagi kami.
            </p>
          </div>

          {/* FORM CONTAINER */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-[#FF7A00]/10 p-6 md:p-10 border border-[#FFE1C6]/50 relative">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FFF6EF] to-transparent rounded-tr-3xl pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-6 relative">
              
              {/* Note: Error display using state is ignored here to stick to the original logic's use of 'alert' */}

              {/* Nama Input */}
              <div className="space-y-2">
                <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-[#2D2D2D]">
                  <div
                    className={`p-1.5 rounded-lg transition-colors duration-200 ${focusedField === "name" ? "bg-[#FF7A00]" : "bg-[#FFE1C6]"}`}
                  >
                    <User className={`w-3.5 h-3.5 ${focusedField === "name" ? "text-white" : "text-[#FF7A00]"}`} />
                  </div>
                  Nama <span className="text-[#9CA3AF] font-normal">(Opsional)</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Masukkan nama Anda atau kosongkan untuk anonim"
                  className="w-full px-5 py-4 bg-[#FFF6EF] border-2 border-[#FFE1C6] rounded-2xl focus:outline-none focus:ring-0 focus:border-[#FF7A00] focus:bg-white transition-all duration-300 placeholder:text-[#9CA3AF] text-[#2D2D2D]"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-[#2D2D2D]">
                  <div
                    className={`p-1.5 rounded-lg transition-colors duration-200 ${focusedField === "email" ? "bg-[#FF7A00]" : "bg-[#FFE1C6]"}`}
                  >
                    <Mail className={`w-3.5 h-3.5 ${focusedField === "email" ? "text-white" : "text-[#FF7A00]"}`} />
                  </div>
                  Email <span className="text-[#9CA3AF] font-normal">(Opsional)</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="email@contoh.com"
                  className="w-full px-5 py-4 bg-[#FFF6EF] border-2 border-[#FFE1C6] rounded-2xl focus:outline-none focus:ring-0 focus:border-[#FF7A00] focus:bg-white transition-all duration-300 placeholder:text-[#9CA3AF] text-[#2D2D2D]"
                />
              </div>

              {/* Kategori Select */}
              <div className="space-y-2">
                <label htmlFor="category" className="flex items-center gap-2 text-sm font-semibold text-[#2D2D2D]">
                  <div
                    className={`p-1.5 rounded-lg transition-colors duration-200 ${focusedField === "category" ? "bg-[#FF7A00]" : "bg-[#FFE1C6]"}`}
                  >
                    <Tag className={`w-3.5 h-3.5 ${focusedField === "category" ? "text-white" : "text-[#FF7A00]"}`} />
                  </div>
                  Kategori Saran <span className="text-[#FF7A00]">*</span>
                </label>
                <div className="relative">
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    onFocus={() => setFocusedField("category")}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`w-full px-5 py-4 bg-[#FFF6EF] border-2 border-[#FFE1C6] rounded-2xl focus:outline-none focus:ring-0 focus:border-[#FF7A00] focus:bg-white transition-all duration-300 appearance-none cursor-pointer pr-12 ${
                      !category ? "text-[#9CA3AF]" : "text-[#2D2D2D]"
                    }`}
                  >
                    <option value="" disabled className="text-[#9CA3AF]">
                      Pilih kategori saran
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.value}
                      </option>
                    ))}
                  </select>
                  {/* Custom Arrow Down */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                    <svg className="w-5 h-5 text-[#FF7A00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Saran Textarea */}
              <div className="space-y-2">
                <label htmlFor="message" className="flex items-center gap-2 text-sm font-semibold text-[#2D2D2D]">
                  <div
                    className={`p-1.5 rounded-lg transition-colors duration-200 ${focusedField === "message" ? "bg-[#FF7A00]" : "bg-[#FFE1C6]"}`}
                  >
                    <FileText className={`w-3.5 h-3.5 ${focusedField === "message" ? "text-white" : "text-[#FF7A00]"}`} />
                  </div>
                  Isi Saran <span className="text-[#FF7A00]">*</span>
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  required
                  rows={5}
                  placeholder="Tuliskan saran, kritik, atau masukan Anda di sini dengan detail..."
                  className="w-full px-5 py-4 bg-[#FFF6EF] border-2 border-[#FFE1C6] rounded-2xl focus:outline-none focus:ring-0 focus:border-[#FF7A00] focus:bg-white transition-all duration-300 placeholder:text-[#9CA3AF] text-[#2D2D2D] resize-none"
                />
                <p className="text-xs text-[#9CA3AF] flex items-center gap-1">
                  <span className="text-[#FF7A00]">*</span> Field wajib diisi
                </p>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF7A00] to-[#FF8F2C] text-white font-bold text-lg rounded-2xl shadow-lg shadow-[#FF7A00]/30 hover:shadow-xl hover:shadow-[#FF7A00]/40 hover:from-[#FF8F2C] hover:to-[#FFA84C] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 text-white" />
                    Mengirim Saran...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Kirim Masukan Anda
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* SUCCESS POPUP MODAL (Menggunakan Headless UI Transition seperti di kode awal) */}
      <Transition
        show={showSuccessPopup}
        enter="transition-opacity ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowSuccessPopup(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center animate-in zoom-in-95 fade-in duration-300">
            {/* Close button */}
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            {/* Success icon with pulsing animation */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Ping effect */}
                <div className="absolute inset-0 bg-[#FF7A00]/20 rounded-full animate-ping" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-[#FF7A00] to-[#FFA84C] rounded-full flex items-center justify-center shadow-lg shadow-[#FF7A00]/30">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-[#2D2D2D] mb-2">Terima Kasih!</h3>
            <p className="text-[#6B7280] mb-6">Saran Anda telah berhasil terkirim.</p>
            
            {/* Progress bar (animasi mundur) - Tetap menggunakan logika 3 detik */}
            <div className="w-full h-1 bg-[#FFE1C6] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#FF7A00] to-[#FFA84C] rounded-full animate-[shrink_3s_linear_forwards]" />
            </div>
            <p className="text-xs text-gray-400 mt-2">Pop-up akan hilang dalam 3 detik</p>
          </div>
        </div>
      </Transition>

      {/* Style untuk Keyframe Animasi CSS */}
      <style jsx>{`
        /* Keyframe untuk animasi progress bar mundur */
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        /* Keyframe untuk dekorasi background */
        @keyframes pulse-slow {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes pulse-slow-reverse {
            0%, 100% { opacity: 0.6; transform: scale(1.05); }
            50% { opacity: 0.8; transform: scale(1); }
        }
        .animate-pulse-slow {
            animation: pulse-slow 8s infinite ease-in-out;
        }
        .animate-pulse-slow-reverse {
            animation: pulse-slow-reverse 9s infinite ease-in-out;
        }
      `}</style>
    </>
  );
}