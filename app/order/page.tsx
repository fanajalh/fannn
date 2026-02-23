"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, Upload, X, MessageCircle, Loader2, CheckCircle2, ChevronRight, FileText, Check, AlertCircle } from "lucide-react" 
import Link from "next/link"
import Image from "next/image"

// --- KOMPONEN MODAL SUKSES ---
interface SuccessModalProps {
    isOpen: boolean;
    orderId: string;
    onClose: (confirmWhatsapp: boolean) => void;
    totalPrice: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, orderId, onClose, totalPrice }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 md:p-10 transform animate-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center mb-6">
                        <CheckCircle2 size={40} className="text-emerald-500" />
                    </div>
                    
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Pesanan Terkirim!</h2>
                    <p className="text-gray-500 mb-6 font-medium text-sm">
                        Terima kasih! Order ID: <span className="font-bold text-gray-900">{orderId}</span> berhasil dicatat.
                    </p>

                    <div className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl mb-8">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-bold text-gray-500 uppercase tracking-widest text-xs">Total Tagihan</span>
                            <span className="text-xl font-black text-gray-900">{totalPrice}</span>
                        </div>
                    </div>
                    
                    <div className="w-full space-y-3">
                        <button
                            onClick={() => onClose(true)}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 transition-all active:scale-[0.98] shadow-lg shadow-green-500/25"
                        >
                            <MessageCircle size={20} /> Konfirmasi via WhatsApp
                        </button>
                        <button
                            onClick={() => onClose(false)}
                            className="w-full py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all"
                        >
                            Tutup & Tunggu Email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function OrderPage() {
    const [step, setStep] = useState(1)
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [lastOrderDetails, setLastOrderDetails] = useState({
        orderNumber: "",
        totalPrice: 0,
    });
    
    const [orderData, setOrderData] = useState({
        service: "",
        package: "",
        details: {
            title: "", description: "", dimensions: "", colors: "", deadline: "", additionalInfo: "",
        },
        files: [] as File[],
        contact: {
            name: "", email: "", phone: "", company: "",
        },
    })

    const services = [
        { id: "poster-event", name: "Poster Event", description: "Konser, seminar, & workshop", price: 15000, image: "/feed arfan (20).png" },
        { id: "poster-edukasi", name: "Poster Edukasi", description: "Kampanye & infografis", price: 20000, image: "/feed arfan (20).png" },
        { id: "social-media", name: "Social Media", description: "Feed & Story IG/FB", price: 25000, image: "/feed arfan (20).png" },
        { id: "print-flyer", name: "Flyer & Leaflet", description: "Brosur promosi cetak", price: 15000, image: "/feed arfan (20).png" },
        { id: "lainnya", name: "Custom Design", description: "Spanduk & kebutuhan lain", price: 10000, image: "/feed arfan (20).png" },
    ]

    const packages = [
        { id: "basic", name: "Basic", priceIncrement: 0, features: ["2 Revisi", "Format JPG/PNG", "2-3 Hari"] },
        { id: "professional", name: "Professional", priceIncrement: 5000, features: ["5 Revisi", "Semua Format & Source", "1-2 Hari"] },
        { id: "enterprise", name: "Enterprise", priceIncrement: 20000, features: ["Unlimited Revisi", "Vector & Rush Order", "Prioritas Utama"] },
    ]

    const removeFile = (index: number) => {
        setOrderData((prev) => ({ ...prev, files: prev.files.filter((_, i) => i !== index) }))
    }

    const calculateTotal = () => {
        const selectedService = services.find((s) => s.id === orderData.service)
        const selectedPackage = packages.find((p) => p.id === orderData.package)
        if (!selectedService || !selectedPackage) return 0
        return Math.round(selectedService.price + selectedPackage.priceIncrement)
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price)
    }

    const nextStep = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (step === 1 && (!orderData.service || !orderData.package)) return
        if (step === 2 && (!orderData.details.title || !orderData.details.description || !orderData.details.deadline)) return
        if (step < 4) setStep(step + 1)
    }

    const prevStep = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (step > 1) setStep(step - 1)
    }
    
    const closeModal = (confirmWhatsApp: boolean) => {
        setIsModalOpen(false); 
        const currentTotal = formatPrice(lastOrderDetails.totalPrice);
        const orderNumber = lastOrderDetails.orderNumber;

        const whatsappMessage = `Halo! Saya baru saja submit pesanan dengan Order ID: ${orderNumber}\n\nDetail pesanan:\n- Layanan: ${orderData.service.replace("-", " ")}\n- Paket: ${orderData.package}\n- Total: ${currentTotal}\n\nMohon konfirmasi dan info lebih lanjut. Terima kasih!`
        const whatsappUrl = `https://wa.me/6285728150223?text=${encodeURIComponent(whatsappMessage)}`
        
        if (confirmWhatsApp) window.open(whatsappUrl, "_blank")

        setOrderData({
            service: "", package: "",
            details: { title: "", description: "", dimensions: "", colors: "", deadline: "", additionalInfo: "" },
            files: [], contact: { name: "", email: "", phone: "", company: "" },
        })
        setStep(1)
        setLastOrderDetails({ orderNumber: "", totalPrice: 0 }); 
    }

    const handleSubmit = async () => {
        if (isSubmitting || isSuccess) return; 

        if (!orderData.contact.name || !orderData.contact.email || !orderData.contact.phone) {
            alert("Harap lengkapi Nama, Email, dan No. WhatsApp.")
            return
        }

        setIsSubmitting(true);
        setIsSuccess(false); 

        try {
            const { files, ...dataToSend } = orderData;
            
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSend),
            })

            const result = await response.json()

            if (result.success) {
                setIsSuccess(true);
                const currentTotal = calculateTotal();
                setLastOrderDetails({ orderNumber: result.order.order_number, totalPrice: currentTotal });
                setIsModalOpen(true);
                setTimeout(() => setIsSuccess(false), 3000);
            } else {
                alert(`Error: ${result.message}`)
            }
        } catch (error) {
            alert("Terjadi kesalahan saat mengirim pesanan. Silakan coba lagi.")
        } finally {
            setIsSubmitting(false);
        }
    }
    
    // Minimalist Input Style
    const inputStyle = "w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-gray-900 placeholder:text-gray-400 outline-none";
    const labelStyle = "block text-xs font-black text-gray-400 uppercase tracking-widest pl-1 mb-2";

    return (
        <div className="relative min-h-screen bg-[#FAFAFA] pt-24 pb-32 selection:bg-orange-100 selection:text-orange-900 overflow-hidden">
            
            {/* ================= BACKGROUND DECORATIONS ================= */}
            <div className="absolute top-0 right-0 -translate-y-20 translate-x-20 w-[600px] h-[600px] bg-orange-100/50 rounded-full blur-[100px] opacity-80 pointer-events-none z-0"></div>
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-[#FFF5EC] rounded-full blur-[80px] opacity-60 pointer-events-none z-0"></div>
            <div className="absolute bottom-0 right-1/4 translate-y-1/4 w-[400px] h-[400px] bg-orange-50/70 rounded-full blur-[90px] pointer-events-none z-0"></div>

            <SuccessModal isOpen={isModalOpen} orderId={lastOrderDetails.orderNumber} totalPrice={formatPrice(lastOrderDetails.totalPrice)} onClose={closeModal} />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-orange-500 transition-colors mb-2">
                            <ArrowLeft size={16} /> Kembali ke Beranda
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Buat Pesanan</h1>
                    </div>
                </div>

                {/* Progress Bar (Sleek Version) */}
                <div className="mb-10">
                    <div className="flex items-center justify-between relative">
                        {/* Connecting Line Background */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
                        {/* Active Line Progress */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-orange-500 rounded-full z-0 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
                        
                        {["Layanan", "Detail", "Upload", "Review"].map((label, index) => (
                            <div key={index} className="relative z-10 flex flex-col items-center gap-2 px-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                                        step > index + 1 ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" : 
                                        step === index + 1 ? "bg-gray-900 text-white shadow-xl shadow-gray-900/20 scale-110" : 
                                        "bg-white border-2 border-gray-200 text-gray-400"
                                    }`}
                                >
                                    {step > index + 1 ? <Check size={18} /> : index + 1}
                                </div>
                                <span className={`hidden sm:block text-xs font-bold uppercase tracking-wider ${step >= index + 1 ? "text-gray-900" : "text-gray-400"}`}>
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] shadow-xl shadow-orange-900/5 border border-white p-6 md:p-10 lg:p-12 mb-20 relative z-20">
                    
                    {/* ================= STEP 1: SERVICE ================= */}
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h2 className="text-2xl font-black text-gray-900 mb-8">1. Pilih Layanan & Paket</h2>
                            
                            <div className="grid sm:grid-cols-2 gap-5 mb-10">
                                {services.map((srv) => (
                                    <div
                                        key={srv.id}
                                        onClick={() => setOrderData((prev) => ({ ...prev, service: srv.id }))}
                                        className={`p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all duration-300 group ${
                                            orderData.service === srv.id
                                                ? "border-orange-500 bg-orange-50/50 shadow-md shadow-orange-500/10"
                                                : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm"
                                        }`}
                                    >
                                        <div className="relative w-full h-32 mb-4 rounded-xl overflow-hidden bg-gray-100">
                                            <Image src={srv.image || "/placeholder.svg"} alt={srv.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-1">{srv.name}</h3>
                                        <p className="text-gray-500 text-xs font-medium mb-3 line-clamp-2">{srv.description}</p>
                                        <div className="text-sm font-black text-orange-600">Mulai {formatPrice(srv.price)}</div>
                                    </div>
                                ))}
                            </div>

                            {orderData.service && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 pt-8 border-t border-gray-100">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Pilih Paket Spesifikasi</h3>
                                    <div className="grid sm:grid-cols-3 gap-4">
                                        {packages.map((pkg) => (
                                            <div
                                                key={pkg.id}
                                                onClick={() => setOrderData((prev) => ({ ...prev, package: pkg.id }))}
                                                className={`p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                                                    orderData.package === pkg.id
                                                        ? "border-orange-500 bg-orange-50/50 shadow-md shadow-orange-500/10"
                                                        : "border-gray-100 bg-white hover:border-gray-300"
                                                }`}
                                            >
                                                <h4 className="font-bold text-gray-900 mb-1">{pkg.name}</h4>
                                                <div className="text-lg font-black text-orange-500 mb-4 pb-4 border-b border-orange-100/50">
                                                    {formatPrice(Math.round((services.find((s) => s.id === orderData.service)?.price || 0) + pkg.priceIncrement))}
                                                </div>
                                                <ul className="text-xs text-gray-600 font-medium space-y-2">
                                                    {pkg.features.map((feature, index) => (
                                                        <li key={index} className="flex items-start gap-2">
                                                            <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ================= STEP 2: DETAILS ================= */}
                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h2 className="text-2xl font-black text-gray-900 mb-8">2. Detail Desain Proyek</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className={labelStyle}>Judul / Tema Utama *</label>
                                    <input type="text" value={orderData.details.title} onChange={(e) => setOrderData({ ...orderData, details: { ...orderData.details, title: e.target.value }})} className={inputStyle} placeholder="Contoh: Poster Promo Diskon Ramadhan" />
                                </div>

                                <div>
                                    <label className={labelStyle}>Deskripsi Lengkap *</label>
                                    <textarea value={orderData.details.description} onChange={(e) => setOrderData({ ...orderData, details: { ...orderData.details, description: e.target.value }})} rows={4} className={`${inputStyle} resize-none`} placeholder="Jelaskan detail isi teks yang mau dimasukkan, gaya desain (minimalis/elegan/ramai), dan info penting lainnya..." />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={labelStyle}>Dimensi Ukuran</label>
                                        <input type="text" value={orderData.details.dimensions} onChange={(e) => setOrderData({ ...orderData, details: { ...orderData.details, dimensions: e.target.value }})} className={inputStyle} placeholder="Contoh: A4 / 1080x1080px" />
                                    </div>
                                    <div>
                                        <label className={labelStyle}>Preferensi Warna</label>
                                        <input type="text" value={orderData.details.colors} onChange={(e) => setOrderData({ ...orderData, details: { ...orderData.details, colors: e.target.value }})} className={inputStyle} placeholder="Contoh: Dominan Hijau Tosca" />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelStyle}>Tenggat Waktu (Deadline) *</label>
                                    <input type="date" value={orderData.details.deadline} onChange={(e) => setOrderData({ ...orderData, details: { ...orderData.details, deadline: e.target.value }})} className={inputStyle} min={new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split("T")[0]} />
                                </div>

                                <div>
                                    <label className={labelStyle}>Catatan Tambahan (Opsional)</label>
                                    <textarea value={orderData.details.additionalInfo} onChange={(e) => setOrderData({ ...orderData, details: { ...orderData.details, additionalInfo: e.target.value }})} rows={3} className={`${inputStyle} resize-none`} placeholder="Link referensi GDrive/Pinterest atau pesan khusus untuk desainer..." />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ================= STEP 3: UPLOADS ================= */}
                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h2 className="text-2xl font-black text-gray-900 mb-2">3. Upload File Pendukung</h2>
                            <p className="text-sm font-medium text-gray-500 mb-8">Punya logo, foto produk, atau sketsa referensi? Anda bisa mengirimkannya langsung nanti via WhatsApp agar kualitas file tidak pecah.</p>

                            <div className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-[2rem] p-10 text-center mb-8 flex flex-col items-center justify-center">
                                <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-4">
                                    <Upload size={32} className="text-orange-500" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">Sistem Upload Disimpan untuk Chat</h3>
                                <p className="text-xs font-medium text-gray-500 max-w-sm mx-auto mb-6">Untuk menjaga kualitas (High-Res), silakan kirim file pendukung seperti logo & foto produk melalui WhatsApp setelah proses order selesai.</p>
                                <button onClick={nextStep} className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all">
                                    Lewati & Lanjut ke Review
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ================= STEP 4: REVIEW & SUBMIT ================= */}
                    {step === 4 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h2 className="text-2xl font-black text-gray-900 mb-8">4. Finalisasi Pesanan</h2>

                            <div className="grid md:grid-cols-2 gap-10 mb-8">
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Informasi Pemesan</h3>
                                    <div>
                                        <input type="text" placeholder="Nama Lengkap *" value={orderData.contact.name} onChange={(e) => setOrderData({ ...orderData, contact: { ...orderData.contact, name: e.target.value }})} className={inputStyle} />
                                    </div>
                                    <div>
                                        <input type="email" placeholder="Alamat Email *" value={orderData.contact.email} onChange={(e) => setOrderData({ ...orderData, contact: { ...orderData.contact, email: e.target.value }})} className={inputStyle} />
                                    </div>
                                    <div>
                                        <input type="tel" placeholder="Nomor WhatsApp (Aktif) *" value={orderData.contact.phone} onChange={(e) => setOrderData({ ...orderData, contact: { ...orderData.contact, phone: e.target.value }})} className={inputStyle} />
                                    </div>
                                    <div>
                                        <input type="text" placeholder="Nama Brand / Perusahaan (Opsional)" value={orderData.contact.company} onChange={(e) => setOrderData({ ...orderData, contact: { ...orderData.contact, company: e.target.value }})} className={inputStyle} />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-gray-900 text-white rounded-[2rem] p-8 shadow-xl">
                                        <h3 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-6">Ringkasan Order</h3>
                                        <div className="space-y-3 font-medium text-sm text-gray-300">
                                            <div className="flex justify-between items-center"><span className="uppercase text-xs tracking-wider">Layanan</span><span className="text-white font-bold">{services.find(s => s.id === orderData.service)?.name}</span></div>
                                            <div className="flex justify-between items-center"><span className="uppercase text-xs tracking-wider">Paket</span><span className="text-white font-bold">{packages.find(p => p.id === orderData.package)?.name}</span></div>
                                            <div className="flex justify-between items-center"><span className="uppercase text-xs tracking-wider">Deadline</span><span className="text-white font-bold">{new Date(orderData.details.deadline).toLocaleDateString()}</span></div>
                                        </div>
                                        <div className="border-t border-white/20 mt-6 pt-6 flex justify-between items-end">
                                            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Total Harga</span>
                                            <span className="text-3xl font-black text-white">{formatPrice(calculateTotal())}</span>
                                        </div>
                                    </div>

                                    <div className="bg-orange-50 border border-orange-100 rounded-[1.5rem] p-5 flex gap-4">
                                        <div className="mt-1"><AlertCircle size={20} className="text-orange-500"/></div>
                                        <p className="text-xs font-medium text-orange-800 leading-relaxed">Pastikan kontak WA aktif. Setelah order dikirim, Anda akan diarahkan ke WhatsApp untuk konfirmasi dan metode pembayaran (DP 50%).</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ================= NAVIGATION BUTTONS ================= */}
                    <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-gray-100">
                        <button onClick={prevStep} disabled={step === 1} className="w-full sm:w-auto px-8 py-4 bg-gray-50 border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition-all disabled:opacity-0 disabled:pointer-events-none">
                            Koreksi Data
                        </button>

                        {step < 4 ? (
                            <button
                                onClick={nextStep}
                                disabled={(step === 1 && (!orderData.service || !orderData.package)) || (step === 2 && (!orderData.details.title || !orderData.details.description || !orderData.details.deadline))}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-gray-900/20"
                            >
                                Lanjut Langkah {step + 1} <ChevronRight size={18} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={!orderData.contact.name || !orderData.contact.email || !orderData.contact.phone || isSubmitting || isModalOpen}
                                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 font-bold rounded-2xl transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isSuccess ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25' : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25 active:scale-[0.98]'
                                }`}
                            >
                                {isSuccess ? (<><Check size={20} /> Terkirim!</>) : 
                                 isSubmitting ? (<><Loader2 size={20} className="animate-spin" /> Sedang Memproses...</>) : 
                                 (<><FileText size={18} /> Selesaikan Order Sekarang</>)}
                            </button>
                        )}
                    </div>
                </div>

                {/* Floating Summary Bar (Mobile / Tablet) - Only visible if step < 4 and service is selected */}
                {step < 4 && orderData.service && orderData.package && (
                    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-8 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl p-4 border border-white sm:w-80 z-40 animate-in slide-in-from-bottom-10">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Estimasi Total</p>
                                <p className="text-xl font-black text-gray-900 leading-none">{formatPrice(calculateTotal())}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-gray-800">{packages.find(p => p.id === orderData.package)?.name}</p>
                                <p className="text-[10px] font-medium text-gray-500 truncate max-w-[100px]">{services.find(s => s.id === orderData.service)?.name}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}