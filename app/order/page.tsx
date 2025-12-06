"use client"

import type React from "react"

import { useState } from "react"
// Import ikon Check yang dibutuhkan
import { ArrowLeft, Upload, X, MessageCircle, Loader, Check } from "lucide-react" 
import Link from "next/link"
import Image from "next/image"


// --- KOMPONEN MODAL SUKSES BARU ---
interface SuccessModalProps {
    isOpen: boolean;
    orderId: string;
    onClose: (confirmWhatsapp: boolean) => void;
    totalPrice: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, orderId, onClose, totalPrice }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all duration-300 scale-100">
                <div className="flex flex-col items-center">
                    {/* Ikon Centang Hijau */}
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <Check size={32} className="text-green-600" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Terkirim!</h2>
                    <p className="text-gray-600 text-center mb-6">
                        Pesanan Anda **Order ID: {orderId}** berhasil dikirim.
                    </p>

                    {/* Ringkasan Cepat di Modal */}
                    <div className="w-full p-4 bg-gray-50 rounded-xl mb-6">
                        <div className="flex justify-between text-sm font-medium text-gray-700">
                            <span>Total Pesanan:</span>
                            <span className="text-lg font-bold gradient-text">{totalPrice}</span>
                        </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Langkah Selanjutnya</h3>

                    <button
                        onClick={() => onClose(true)}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors duration-300 mb-3"
                    >
                        <MessageCircle size={20} />
                        <span>Lanjut ke WhatsApp Konfirmasi</span>
                    </button>

                    <button
                        onClick={() => onClose(false)}
                        className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-300"
                    >
                        Tutup dan Tunggu Email
                    </button>
                </div>
            </div>
        </div>
    );
};
// ------------------------------------


export default function OrderPage() {
    const [step, setStep] = useState(1)
    
    // === STATES UNTUK SUBMISSION & UI ===
    const [isSubmitting, setIsSubmitting] = useState(false);
    // isSuccess tetap digunakan untuk styling tombol submit
    const [isSuccess, setIsSuccess] = useState(false); 
    
    // STATE BARU untuk mengontrol modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // STATE BARU untuk menyimpan detail setelah sukses
    const [lastOrderDetails, setLastOrderDetails] = useState({
        orderNumber: "",
        totalPrice: 0,
    });
    // ===================================
    
    const [orderData, setOrderData] = useState({
        service: "",
        package: "",
        details: {
            title: "",
            description: "",
            dimensions: "",
            colors: "",
            deadline: "",
            additionalInfo: "",
        },
        files: [] as File[],
        contact: {
            name: "",
            email: "",
            phone: "",
            company: "",
        },
    })

    const services = [
    {
      id: "poster-event",
      name: "Poster Event",
      description: "Poster untuk konser, seminar, workshop",
      price: 15000,
      image: "/feed arfan (20).png",
    },
    {
      id: "poster-edukasi",
      name: "Poster Edukasi",
      description: "Poster informatif untuk kampanye dan edukasi",
      price: 20000,
      image: "/feed arfan (20).png",
    },
    {
      id: "social-media",
      name: "Social Media Design",
      description: "Template untuk Instagram, Facebook",
      price: 25000,
      image: "/feed arfan (20).png",
    },
    {
      id: "print-flyer",
      name: "Flyer & Leaflet",
      description: "Desain flyer dan leaflet untuk promosi",
      price: 15000,
      image: "/feed arfan (20).png",
    },
    {
      id: "lainnya",
      name: "Layanan Lainnya",
      description: "Desain, spanduk, brosur, dan kebutuhan cetak lainnya harga menyesuaikan",
      price: 10000,
      image: "/feed arfan (20).png",
    },
  ]

    const packages = [
        {
            id: "basic",
            name: "Basic",
            priceIncrement: 0, 
            features: ["2 Revisi", "Format JPG/PNG", "Pengerjaan 2-3 hari"],
        },
        {
            id: "professional",
            name: "Professional",
            priceIncrement: 5000, 
            features: ["5 Revisi", "Semua Format", "Source File", "Pengerjaan 1-2 hari"],
        },
        {
            id: "enterprise",
            name: "Enterprise",
            priceIncrement: 20000, 
            features: ["Unlimited Revisi", "Semua Format + Vector", "Rush Order", "Dedicated Support"],
        },
    ]

    const removeFile = (index: number) => {
        setOrderData((prev) => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index),
        }))
    }

    const calculateTotal = () => {
        const selectedService = services.find((s) => s.id === orderData.service)
        const selectedPackage = packages.find((p) => p.id === orderData.package)

        if (!selectedService || !selectedPackage) return 0

        return Math.round(selectedService.price + selectedPackage.priceIncrement)
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price)
    }

    const nextStep = () => {
        if (step === 1 && (!orderData.service || !orderData.package)) return
        if (step === 2 && (!orderData.details.title || !orderData.details.description || !orderData.details.deadline)) return

        if (step < 4) setStep(step + 1)
    }

    const prevStep = () => {
        if (step > 1) setStep(step - 1)
    }
    
    // Fungsi baru untuk menutup modal dan memproses WhatsApp
    const closeModal = (confirmWhatsApp: boolean) => {
        setIsModalOpen(false); // Tutup modal

        const currentTotal = formatPrice(lastOrderDetails.totalPrice);
        const orderNumber = lastOrderDetails.orderNumber;

        // Teks WhatsApp menggunakan data dari state terakhir
        const whatsappMessage = `Halo! Saya baru saja submit pesanan dengan Order ID: ${orderNumber}

            Detail pesanan:
            - Layanan: ${orderData.service.replace("-", " ")}
            - Paket: ${orderData.package}
            - Total: ${currentTotal}

            Mohon konfirmasi dan info lebih lanjut. Terima kasih!`

        const whatsappUrl = `https://wa.me/6285728150223?text=${encodeURIComponent(whatsappMessage)}`
        
        // Buka WhatsApp hanya jika pengguna memilih untuk konfirmasi via WhatsApp
        if (confirmWhatsApp) {
            window.open(whatsappUrl, "_blank")
        }

        // Reset form setelah semua selesai (jika perlu)
        setOrderData({
            service: "",
            package: "",
            details: {
                title: "",
                description: "",
                dimensions: "",
                colors: "",
                deadline: "",
                additionalInfo: "",
            },
            files: [],
            contact: {
                name: "",
                email: "",
                phone: "",
                company: "",
            },
        })
        setStep(1)
        // Setelah reset, hapus detail pesanan terakhir
        setLastOrderDetails({ orderNumber: "", totalPrice: 0 }); 
    }


    const handleSubmit = async () => {
        // 1. Mencegah double-click jika sudah dalam proses submit ATAU SUKSES
        if (isSubmitting || isSuccess) {
            return; 
        }

        if (!orderData.contact.name || !orderData.contact.email || !orderData.contact.phone) {
            alert("Harap lengkapi Nama, Email, dan No. WhatsApp.")
            return
        }

        // 2. Set status menjadi sedang submit
        setIsSubmitting(true);
        setIsSuccess(false); // Pastikan status sukses direset

        try {
            const { files, ...dataToSend } = orderData;
            
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            })

            const result = await response.json()

            if (result.success) {
                // === LOGIKA SUKSES BARU ===
                setIsSuccess(true);
                
                // Simpan detail pesanan yang berhasil (Order ID & Total)
                const currentTotal = calculateTotal();
                setLastOrderDetails({
                    orderNumber: result.order.order_number,
                    totalPrice: currentTotal,
                });
                
                // Tampilkan modal sukses
                setIsModalOpen(true);
                
                // Atur timer untuk menghilangkan status sukses di tombol (opsional, bisa dihilangkan)
                setTimeout(() => {
                    setIsSuccess(false);
                }, 3000);

                // Catatan: Logika window.confirm/window.open WhatsApp dipindahkan ke fungsi closeModal()
                // ==========================
                
            } else {
                alert(`Error: ${result.message}`)
            }
        } catch (error) {
            console.error("Submit error:", error)
            alert("Terjadi kesalahan saat mengirim pesanan. Silakan coba lagi.")
        } finally {
            // 3. Pastikan status loading kembali ke false setelah selesai
            setIsSubmitting(false);
        }
    }
    

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* RENDER MODAL SUKSES */}
            <SuccessModal
                isOpen={isModalOpen}
                orderId={lastOrderDetails.orderNumber}
                totalPrice={formatPrice(lastOrderDetails.totalPrice)}
                onClose={closeModal}
            />
            
            {/* Menambahkan mb-16 untuk memberikan ruang di bagian bawah agar summary mobile terlihat */}
            <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${orderData.service && orderData.package ? 'mb-20 sm:mb-12' : ''}`}>
                
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors duration-300"
                    >
                        <ArrowLeft size={20} />
                        <span>Kembali</span>
                    </Link>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <h1 className="text-3xl font-bold text-gray-800">Buat Pesanan</h1>
                </div>

                {/* Progress Bar */}
                <div className="mb-12 overflow-x-auto"> {/* Tambahkan overflow-x-auto untuk mobile */}
                    <div className="flex items-center justify-between mb-4 min-w-max"> {/* min-w-max agar tidak terpotong */}
                        {["Pilih Layanan", "Detail Proyek", "Upload File", "Konfirmasi"].map((label, index) => (
                            <div key={index} className="flex items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                        step > index + 1
                                            ? "bg-green-500 text-white"
                                            : step === index + 1
                                                ? "bg-orange-500 text-white"
                                                : "bg-gray-200 text-gray-500"
                                    }`}
                                >
                                    {step > index + 1 ? "✓" : index + 1}
                                </div>
                                <span className={`ml-2 text-sm font-medium ${step >= index + 1 ? "text-gray-800" : "text-gray-500"}`}>
                                    {label}
                                </span>
                                {index < 3 && (
                                    <div className={`w-16 h-0.5 mx-4 ${step > index + 1 ? "bg-green-500" : "bg-gray-200"}`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {/* Step 1: Service Selection */}
                    {step === 1 && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Pilih Layanan</h2>
                            
                            {/* PERUBAHAN: sm:grid-cols-2 agar 2 kolom di layar mobile/tablet kecil */}
                            <div className="grid sm:grid-cols-2 gap-6">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        onClick={() => setOrderData((prev) => ({ ...prev, service: service.id }))}
                                        className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                                            orderData.service === service.id
                                                ? "border-orange-500 bg-orange-50"
                                                : "border-gray-200 hover:border-orange-300"
                                        }`}
                                    >
                                        <Image
                                            src={service.image || "/placeholder.svg"}
                                            alt={service.name}
                                            width={200}
                                            height={200}
                                            className="w-full h-32 object-cover rounded-lg mb-4"
                                        />
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.name}</h3>
                                        <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                                        <div className="text-xl font-bold gradient-text">Mulai {formatPrice(service.price)}</div>
                                    </div>
                                ))}
                            </div>

                            {orderData.service && (
                                <div className="mt-8">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Pilih Paket</h3>
                                    
                                    {/* PERUBAHAN: sm:grid-cols-2 md:grid-cols-3 agar responsif 2 dan 3 kolom */}
                                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {packages.map((pkg) => (
                                            <div
                                                key={pkg.id}
                                                onClick={() => setOrderData((prev) => ({ ...prev, package: pkg.id }))}
                                                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                                                    orderData.package === pkg.id
                                                        ? "border-orange-500 bg-orange-50"
                                                        : "border-gray-200 hover:border-orange-300"
                                                }`}
                                            >
                                                <h4 className="font-semibold text-gray-800 mb-2">{pkg.name}</h4>
                                                <div className="text-lg font-bold gradient-text mb-3">
                                                    {formatPrice(
                                                        Math.round((services.find((s) => s.id === orderData.service)?.price || 0) + pkg.priceIncrement),
                                                    )}
                                                </div>
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    {pkg.features.map((feature, index) => (
                                                        <li key={index} className="flex items-center gap-2">
                                                            <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
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

                    {/* Step 2: Project Details */}
                    {step === 2 && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Detail Proyek</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Judul/Nama Proyek *</label>
                                    <input
                                        type="text"
                                        value={orderData.details.title}
                                        onChange={(e) =>
                                            setOrderData((prev) => ({
                                                ...prev,
                                                details: { ...prev.details, title: e.target.value },
                                            }))
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Contoh: Poster Konser Musik Indie 2024"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Detail *</label>
                                    <textarea
                                        value={orderData.details.description}
                                        onChange={(e) =>
                                            setOrderData((prev) => ({
                                                ...prev,
                                                details: { ...prev.details, description: e.target.value },
                                            }))
                                        }
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Jelaskan detail proyek, konsep yang diinginkan, target audience, dll..."
                                    />
                                </div>

                                {/* PERUBAHAN: grid-cols-1 di mobile, 2 kolom di tablet/desktop */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Ukuran/Dimensi</label>
                                        <input
                                            type="text"
                                            value={orderData.details.dimensions}
                                            onChange={(e) =>
                                                setOrderData((prev) => ({
                                                    ...prev,
                                                    details: { ...prev.details, dimensions: e.target.value },
                                                }))
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="Contoh: A3 (297x420mm) atau Custom"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Preferensi Warna</label>
                                        <input
                                            type="text"
                                            value={orderData.details.colors}
                                            onChange={(e) =>
                                                setOrderData((prev) => ({
                                                    ...prev,
                                                    details: { ...prev.details, colors: e.target.value },
                                                }))
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="Contoh: Biru dan putih, atau sesuai brand"
                                        />
                                    </div>
                                </div>

                               <div>
    {/* Label untuk input */}
    <label className="block text-sm font-semibold text-gray-700 mb-2">Deadline *</label>
    
    <input
        type="date" 
        value={orderData.details.deadline} 
        onChange={(e) =>
            setOrderData((prev) => ({
                ...prev,
                details: { ...prev.details, deadline: e.target.value },
            }))
        }
        
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        min={
            // 1. Dapatkan tanggal hari ini, lalu tambahkan 3 hari
            new Date(new Date().setDate(new Date().getDate() + 3)) 
            // 2. Konversi ke format string YYYY-MM-DD yang dibutuhkan oleh atribut 'min'
            .toISOString().split("T")[0]
        }
    />
</div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Informasi Tambahan</label>
                                    <textarea
                                        value={orderData.details.additionalInfo}
                                        onChange={(e) =>
                                            setOrderData((prev) => ({
                                                ...prev,
                                                details: { ...prev.details, additionalInfo: e.target.value },
                                            }))
                                        }
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Referensi, inspirasi, atau hal lain yang perlu diketahui..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: File Upload */}
                    {step === 3 && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload File Referensi</h2>
                            <p className="text-gray-600 mb-6">
                                Upload logo, foto, atau file referensi lainnya yang diperlukan untuk proyek Anda.
                            </p>

                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6">
                                <Upload size={48} className="text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-4">upload file via chat .</p>
                                <label htmlFor="file-upload" className="btn btn-secondary cursor-pointer">
                                    Nanti di Chat jika ada Upload File
                                </label>
                            </div>

                            {/* Uploaded Files */}
                            {orderData.files.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-4">File yang diupload:</h3>
                                    <div className="space-y-3">
                                        {orderData.files.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                                        <Upload size={20} className="text-orange-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{file.name}</p>
                                                        <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeFile(index)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 4: Confirmation */}
                    {step === 4 && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Konfirmasi Pesanan</h2>

                            {/* Contact Info */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Kontak</h3>
                                {/* PERUBAHAN: grid-cols-1 di mobile, 2 kolom di tablet/desktop */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Nama Lengkap *"
                                        value={orderData.contact.name}
                                        onChange={(e) =>
                                            setOrderData((prev) => ({
                                                ...prev,
                                                contact: { ...prev.contact, name: e.target.value },
                                            }))
                                        }
                                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email *"
                                        value={orderData.contact.email}
                                        onChange={(e) =>
                                            setOrderData((prev) => ({
                                                ...prev,
                                                contact: { ...prev.contact, email: e.target.value },
                                            }))
                                        }
                                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                    <input
                                        type="tel"
                                        placeholder="No. WhatsApp *"
                                        value={orderData.contact.phone}
                                        onChange={(e) =>
                                            setOrderData((prev) => ({
                                                ...prev,
                                                contact: { ...prev.contact, phone: e.target.value },
                                            }))
                                        }
                                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Nama Perusahaan (Opsional)"
                                        value={orderData.contact.company}
                                        onChange={(e) =>
                                            setOrderData((prev) => ({
                                                ...prev,
                                                contact: { ...prev.contact, company: e.target.value },
                                            }))
                                        }
                                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan Pesanan</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Layanan:</span>
                                        <span className="font-medium">{services.find((s) => s.id === orderData.service)?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Paket:</span>
                                        <span className="font-medium">{packages.find((p) => p.id === orderData.package)?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Deadline:</span>
                                        <span className="font-medium">{orderData.details.deadline}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">File Upload:</span>
                                        <span className="font-medium">{orderData.files.length} file</span>
                                    </div>
                                    <div className="border-t pt-3 mt-3">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total:</span>
                                            <span className="gradient-text">{formatPrice(calculateTotal())}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* WhatsApp Info */}
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <MessageCircle size={20} className="text-green-600" />
                                    <h4 className="font-semibold text-green-800">Notifikasi WhatsApp</h4>
                                </div>
                                <p className="text-green-700 text-sm">
                                    Setelah submit pesanan, Anda akan mendapat opsi untuk langsung chat WhatsApp untuk konfirmasi dan
                                    pembayaran.
                                </p>
                            </div>

                            {/* Payment Info */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                                <h4 className="font-semibold text-blue-800 mb-2">Informasi Pembayaran</h4>
                                <p className="text-blue-700 text-sm">
                                    Setelah pesanan dikonfirmasi, Anda akan menerima invoice dan detail pembayaran via WhatsApp.
                                    Pembayaran 50% di awal, 50% setelah desain selesai.
                                </p>
                            </div>

                            {/* Warning */}
                            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <MessageCircle size={20} className="text-yellow-600" />
                                    <h4 className="font-semibold text-yellow-800">Peringatan Penting</h4>
                                </div>
                                <p className="text-yellow-700 text-sm">
                                    Pastikan semua informasi yang Anda masukkan sudah benar sebelum mengirim pesanan. klik 1 kali jika belum terkirim selama 2 menit klik kirim lagi
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                        <button
                            onClick={prevStep}
                            disabled={step === 1}
                            className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Sebelumnya
                        </button>

                        {step < 4 ? (
                            <button
                                onClick={nextStep}
                                disabled={
                                    (step === 1 && (!orderData.service || !orderData.package)) ||
                                    (step === 2 &&
                                        (!orderData.details.title || !orderData.details.description || !orderData.details.deadline))
                                }
                                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Selanjutnya
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                // Kondisi disabled diperbarui: dinonaktifkan jika data tidak lengkap, loading, ATAU MODAL TERBUKA
                                disabled={!orderData.contact.name || !orderData.contact.email || !orderData.contact.phone || isSubmitting || isModalOpen}
                                className={`btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed ${isSuccess ? 'bg-green-600 hover:bg-green-700' : ''}`}
                            >
                                {/* Logika tampilan tombol diperbarui */}
                                {isSuccess ? (
                                    // Status SUKSES (ikon centang)
                                    <>
                                        <Check size={20} />
                                        <span>Terkirim!</span>
                                    </>
                                ) : isSubmitting ? (
                                    // Status LOADING (ikon berputar)
                                    <>
                                        <Loader size={20} className="animate-spin" />
                                        <span>Mengirim...</span> 
                                    </>
                                ) : (
                                    // Status NORMAL
                                    <>
                                        <MessageCircle size={20} />
                                        <span>Kirim Pesanan</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Order Summary Sidebar/Floating Bar */}
                {orderData.service && orderData.package && (
                    <div className="fixed bottom-0 sm:bottom-4 right-0 left-0 sm:right-4 sm:left-auto bg-white rounded-t-xl sm:rounded-xl shadow-lg p-4 border border-gray-200 w-full sm:max-w-sm z-50">
                        <h4 className="font-semibold text-gray-800 mb-2">Ringkasan</h4>
                        <div className="text-sm text-gray-600 mb-2">
                            {services.find((s) => s.id === orderData.service)?.name} -{" "}
                            {packages.find((p) => p.id === orderData.package)?.name}
                        </div>
                        <div className="text-lg font-bold gradient-text">{formatPrice(calculateTotal())}</div>
                    </div>
                )}
            </div>
        </div>
    )
}