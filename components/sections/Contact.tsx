"use client"

import type React from "react"
import { useState } from "react"
import { MapPin, Phone, Mail, Clock, MessageCircle, Loader, CheckCircle } from "lucide-react" // Menambahkan Loader dan CheckCircle

// Tipe data untuk form
interface FormData {
    name: string;
    email: string;
    phone: string;
    message: string;
}

export default function Contact() {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    
    // State baru untuk modal sukses
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitError(null)

        try {
            // Logika untuk validasi sisi klien sederhana
            if (!formData.name || !formData.email || !formData.phone || !formData.message) {
                setSubmitError("Harap isi semua kolom wajib.")
                setIsSubmitting(false)
                return;
            }

            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                // Tampilkan modal sukses, bukan alert
                setShowSuccessModal(true) 
                
                // Reset form data
                setFormData({ name: "", email: "", phone: "", message: "" }) 
            } else {
                // Tangani kesalahan dari server
                const errorData = await response.json();
                setSubmitError(errorData.message || "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.")
            }
        } catch (error) {
            console.error("Submission error:", error)
            setSubmitError("Koneksi bermasalah. Gagal menghubungi server.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    // Komponen Modal Sukses Kustom
    const SuccessModal = () => {
        if (!showSuccessModal) return null

        return (
            <div 
                className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setShowSuccessModal(false)} // Tutup modal jika klik di luar
            >
                <div 
                    className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl transform transition-transform duration-500 ease-out scale-100 animate-in fade-in zoom-in-95"
                    onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal menutup modal
                >
                    <div className="flex flex-col items-center">
                        <div className="bg-green-100 rounded-full p-4 mb-6">
                            {/* Ikon centang hijau besar */}
                            <CheckCircle size={64} className="text-green-500 animate-bounce" /> 
                        </div>
                        
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Pesan Terkirim!</h2>
                        <p className="text-gray-600 text-center mb-6 text-base">
                            Terima kasih telah menghubungi kami. Kami akan merespon email Anda secepatnya.
                        </p>

                        <button 
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full flex items-center justify-center px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg transition duration-200 ease-in-out transform hover:scale-[1.01] group"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <section id="contact" className="py-20 bg-gray-50 relative">
            
            {/* Render Modal Sukses */}
            <SuccessModal /> 

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        Hubungi <span className="gradient-text">Kami</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Siap membantu mewujudkan desain poster impian Anda. Konsultasi gratis!
                    </p>
                    <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-400 mx-auto mt-6 rounded-full"></div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Informasi Kontak</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">WhatsApp</h4>
                                        <p className="text-gray-600">+62 857-2815-0223</p>
                                        <a
                                            href="https://wa.me/6285728150223"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-orange-500 hover:text-orange-600 font-medium text-sm"
                                        >
                                            Chat Sekarang
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Email</h4>
                                        <p className="text-gray-600">muhammadfachriarfan7@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Jam Operasional</h4>
                                        <p className="text-gray-600">Senin - Sabtu: 13:00 - 21:00</p>
                                        <p className="text-gray-600">Minggu: 10:00 - 18:00</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Lokasi</h4>
                                        <p className="text-gray-600">Purwokerto, Indonesia</p>
                                        <p className="text-gray-600 text-sm">(Layanan Online)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick WhatsApp */}
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <MessageCircle className="w-6 h-6 text-green-600" />
                                <h4 className="font-semibold text-green-800">Chat WhatsApp</h4>
                            </div>
                            <p className="text-green-700 mb-4">
                                Butuh respon cepat? Langsung chat WhatsApp kami untuk konsultasi gratis!
                            </p>
                            <a
                                href="https://wa.me/6285728150223?text=Halo,%20saya%20tertarik%20dengan%20layanan%20desain%20poster%20Anda"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors duration-300"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span>Chat WhatsApp</span>
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Kirim Pesan</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {submitError && (
                                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm" role="alert">
                                    <strong>Error:</strong> {submitError}
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
                                        placeholder="Masukkan nama lengkap"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
                                        placeholder="nama@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor WhatsApp *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
                                    placeholder="08xxxxxxxxxx"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Pesan *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
                                    placeholder="Ceritakan kebutuhan Anda..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 ${
                                    isSubmitting
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-orange-500 hover:bg-orange-600 shadow-md hover:shadow-lg"
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader size={20} className="animate-spin" />
                                        <span>Mengirim...</span>
                                    </>
                                ) : (
                                    <span>Kirim Pesan</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}