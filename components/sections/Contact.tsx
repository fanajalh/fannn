"use client"

import type React from "react"
import { useState } from "react"
import { MapPin, Phone, Mail, Clock, MessageCircle, Loader2, CheckCircle2, ArrowRight, Send, AlertCircle, Sparkles } from "lucide-react"

// Tipe data untuk form
interface FormData {
    name: string;
    email: string;
    phone: string;
    message: string;
}

export default function Contact() {
    const [formData, setFormData] = useState<FormData>({
        name: "", email: "", phone: "", message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitError(null)

        try {
            if (!formData.name || !formData.email || !formData.phone || !formData.message) {
                setSubmitError("Harap isi semua kolom wajib.")
                setIsSubmitting(false)
                return;
            }

            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                setShowSuccessModal(true) 
                setFormData({ name: "", email: "", phone: "", message: "" }) 
            } else {
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
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    // Modal Sukses Ultra Clean
    const SuccessModal = () => {
        if (!showSuccessModal) return null

        return (
            <div 
                className="fixed inset-0 bg-gray-900/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300"
                onClick={() => setShowSuccessModal(false)}
            >
                <div 
                    className="bg-white rounded-[2rem] p-8 md:p-10 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center mb-6">
                            <CheckCircle2 size={40} className="text-emerald-500" /> 
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Pesan Terkirim!</h2>
                        <p className="text-gray-500 mb-8 font-medium text-sm leading-relaxed">
                            Terima kasih telah menghubungi kami. Tim kami akan segera merespon pesan Anda.
                        </p>
                        <button 
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-all active:scale-95"
                        >
                            Selesai
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <section id="contact" className="relative py-24 lg:py-32 bg-[#FAFAFA] overflow-hidden selection:bg-orange-100 selection:text-orange-900">
            
            <SuccessModal /> 

            {/* Background Decor */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-[600px] h-[600px] bg-orange-50 rounded-full blur-[100px] opacity-80 pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[500px] h-[500px] bg-[#FFF5EC] rounded-full blur-[80px] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
                
                {/* ================= HEADER ================= */}
                <div className="text-center mb-16 md:mb-20 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full shadow-sm">
                        <Sparkles className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                            Mari Berkolaborasi
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight">
                        Hubungi <span className="text-orange-500">Kami</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto">
                        Punya pertanyaan, ide brilian, atau siap memulai project desain Anda? Sapa kami sekarang juga!
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start max-w-6xl mx-auto">
                    
                    {/* ================= LEFT: CONTACT INFO (Col-span-2) ================= */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-widest">Informasi Kontak</h3>
                            <div className="space-y-8">
                                {[
                                    { icon: Phone, title: "WhatsApp", desc: "+62 851-3373-7623", link: "https://wa.me/6285133737623", linkText: "Chat Sekarang" },
                                    { icon: Mail, title: "Email", desc: "arfan.7ovo@gmail.com", link: "mailto:arfan.7ovo@gmail.com", linkText: "Kirim Email" },
                                    { icon: Clock, title: "Jam Operasional", desc: "Senin - Sabtu: 13:00 - 21:00\nMinggu: 10:00 - 18:00" },
                                    { icon: MapPin, title: "Lokasi", desc: "Purwokerto, Jawa Tengah\n(Layanan Online)" },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-5">
                                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                            <item.icon className="w-5 h-5 text-orange-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                                            <p className="text-gray-500 text-sm whitespace-pre-line leading-relaxed">{item.desc}</p>
                                            {item.link && (
                                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 font-bold text-xs mt-2 inline-flex items-center gap-1 group transition-colors">
                                                    {item.linkText} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick WhatsApp Action Card */}
                        <div className="bg-gray-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full blur-[60px] opacity-20" />
                            <div className="relative z-10">
                                <h4 className="font-black text-xl mb-3">Butuh Respon Kilat?</h4>
                                <p className="text-gray-400 text-sm mb-6 leading-relaxed font-medium">Tim JokiPoster siap melayani konsultasi desain Anda langsung via WhatsApp.</p>
                                <a 
                                    href="https://wa.me/6285133737623?text=Halo,%20saya%20tertarik%20dengan%20layanan%20desain%20poster%20Anda" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-green-500/25"
                                >
                                    <MessageCircle size={20} /> Chat WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ================= RIGHT: CONTACT FORM (Col-span-3) ================= */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-10">
                            <div className="mb-8">
                                <h3 className="text-2xl font-black text-gray-900 mb-2">Kirim Pesan Langsung</h3>
                                <p className="text-gray-500 text-sm font-medium">Kami akan membalas pesan Anda ke email yang tertera di bawah.</p>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {submitError && (
                                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium flex items-start gap-3 animate-in fade-in">
                                        <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                                        {submitError}
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nama Lengkap</label>
                                        <input 
                                            type="text" name="name" value={formData.name} onChange={handleChange} required 
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-gray-900 placeholder:text-gray-400 outline-none" 
                                            placeholder="John Doe" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email</label>
                                        <input 
                                            type="email" name="email" value={formData.email} onChange={handleChange} required 
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-gray-900 placeholder:text-gray-400 outline-none" 
                                            placeholder="john@example.com" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nomor WhatsApp</label>
                                    <input 
                                        type="tel" name="phone" value={formData.phone} onChange={handleChange} required 
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-gray-900 placeholder:text-gray-400 outline-none" 
                                        placeholder="08xxxxxxxxxx" 
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Pesan Anda</label>
                                    <textarea 
                                        name="message" value={formData.message} onChange={handleChange} required rows={5} 
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-gray-900 placeholder:text-gray-400 outline-none resize-none" 
                                        placeholder="Ceritakan detail desain yang Anda butuhkan..." 
                                    />
                                </div>

                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting} 
                                        className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white transition-all duration-300 ${
                                            isSubmitting 
                                            ? "bg-gray-400 cursor-not-allowed" 
                                            : "bg-orange-500 hover:bg-orange-600 shadow-xl shadow-orange-500/25 active:scale-[0.98]"
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <><Loader2 size={20} className="animate-spin" /> Mengirim...</>
                                        ) : (
                                            <><Send size={20} /> Kirim Pesan</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}