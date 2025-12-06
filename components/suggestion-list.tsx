"use client"

import useSWR from "swr"
import { useState } from "react"
import {
    User,
    Calendar,
    Inbox,
    Loader2,
    ShieldCheck,
    Zap,
    BookOpen,
    Palette,
    Feather,
} from "lucide-react"

// Interface untuk data saran
interface Suggestion {
    id: number
    nama: string | null
    kategori: string
    saran: string
    created_at: string
    status: "pending" | "reviewed"
    response: string | null
}

/* ================= COLOR & ICON MAP ================= */
// Pemetaan kategori ke warna dan ikon yang sesuai
const categoryMap: Record<string, { color: string; icon: React.ReactNode }> = {
    "Desain UI/UX": { color: "bg-orange-500", icon: <Palette className="w-3 h-3" /> },
    "Fitur Baru": { color: "bg-amber-500", icon: <Inbox className="w-3 h-3" /> },
    Dokumentasi: { color: "bg-indigo-500", icon: <BookOpen className="w-3 h-3" /> },
    Lainnya: { color: "bg-purple-500", icon: <Feather className="w-3 h-3" /> },
}

/* ================= SAFE FETCHER ================= */
// Fungsi fetcher untuk SWR, menangani respons JSON
const fetcher = async (url: string) => {
    const res = await fetch(url)
    const json = await res.json()
    // Pastikan data yang dikembalikan adalah array
    return Array.isArray(json?.data) ? json.data : []
}

export default function SuggestionList() {
    const [filter, setFilter] = useState("Semua")

    // Ambil data menggunakan SWR
    const { data = [], isLoading, error } = useSWR<Suggestion[]>(
        "/api/suggestions",
        fetcher,
        {
            refreshInterval: 5000, // Refresh data setiap 5 detik
            revalidateOnFocus: true,
        }
    )

    /* ================= FILTERING & DATA PREP ================= */
    // Filter hanya saran yang sudah di-review/diverifikasi oleh admin
    const verified = data.filter((s) => s.status === "reviewed")

    // Filter berdasarkan kategori yang dipilih
    const filtered =
        filter === "Semua"
            ? verified
            : verified.filter((s) => s.kategori === filter)

    // Daftar kategori untuk tombol filter
    const categories = ["Semua", ...Object.keys(categoryMap)]

    // Fungsi untuk memformat tanggal
    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })

    return (
        // Bagian utama dengan latar belakang abu-abu muda
        // *** BAGIAN INI DITAMBAHKAN ID AGAR BISA DIAKSES DARI HEROSECTION ***
        <section id="daftar-saran" className="py-16 bg-gray-50"> 
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* HEADER */}
                <div className="text-center mb-16">
                    {/* Label status terverifikasi */}
                    <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full mb-4 shadow-sm">
                        <Inbox className="w-5 h-5 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">Saran Terverifikasi</span>
                    </div>
                    <h2 className="text-4xl font-extrabold text-gray-900">
                        Dengar Suara Pengguna Kami 📣
                    </h2>
                    <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
                        Jelajahi masukan pengguna yang telah ditinjau dan balasan resmi dari tim kami.
                    </p>
                </div>
                
                {/* --- */}

                {/* FILTER BUTTONS */}
                <div className="flex justify-center flex-wrap gap-3 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-in-out shadow-md
                                ${
                                    filter === cat
                                        ? "bg-orange-600 text-white shadow-orange-300/50 transform scale-105" // Active style: orange, shadow, slight scale
                                        : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 border border-gray-200" // Inactive style: white, hover effect
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* --- */}

                {/* LOADING STATE */}
                {isLoading && (
                    <div className="flex flex-col items-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
                        <p className="text-gray-500 mt-4 text-lg">Memuat data saran...</p>
                    </div>
                )}

                {/* ERROR STATE */}
                {error && (
                    <p className="text-center text-red-500 text-lg py-10">
                        Gagal memuat data. Silakan coba muat ulang.
                    </p>
                )}

                {/* DATA GRID */}
                {!isLoading && filtered.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map((s) => {
                            // Ambil info warna dan ikon kategori
                            const categoryInfo = categoryMap[s.kategori] || { color: "bg-gray-400", icon: <Feather className="w-3 h-3" /> }
                            
                            return (
                                <div
                                    key={s.id}
                                    // Card styling: white background, rounded, shadow, full height
                                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full"
                                >
                                    {/* CARD HEADER */}
                                    <div className="flex justify-between items-start mb-4">
                                        
                                        {/* Category Tag (Icon + Text) */}
                                        <span
                                            className={`${categoryInfo.color} text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-md`}
                                        >
                                            {categoryInfo.icon}
                                            {s.kategori}
                                        </span>

                                        {/* Meta Info (User & Date) */}
                                        <div className="text-right flex flex-col items-end space-y-1">
                                            <p className="text-sm font-medium text-gray-800 flex items-center gap-1">
                                             <User className="w-4 h-4 text-gray-500" />
                                             {s.nama || "Anonim"}
                                            </p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(s.created_at)}
                                            </p>
                                        </div>

                                    </div>

                                    {/* SARAN CONTENT */}
                                    <div className="flex-grow">
                                            <p className="text-base text-gray-700 leading-relaxed mb-4 italic border-l-2 border-orange-200 pl-3">
                                                "{s.saran}"
                                            </p>
                                    </div>

                                    {/* ADMIN RESPONSE */}
                                    {s.response && (
                                        <div className="bg-green-50 p-4 rounded-xl border border-green-200 mt-4">
                                            <div className="flex items-center gap-2 mb-2 text-green-700 text-sm font-bold">
                                                <ShieldCheck className="w-5 h-5" />
                                                Balasan Resmi Tim
                                            </div>
                                            <p className="text-sm text-gray-800 leading-snug">
                                                {s.response}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* --- */}

                {/* EMPTY STATE */}
                {!isLoading && filtered.length === 0 && (
                    <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-200">
                        <Inbox className="w-10 h-10 mx-auto mb-4 text-orange-400" />
                        <p className="text-xl font-medium">
                            Tidak ada saran terverifikasi untuk kategori **{filter}**.
                        </p>
                        <p className="mt-2 text-gray-400">
                            Coba pilih kategori lain atau tunggu masukan baru ditinjau.
                        </p>
                    </div>
                )}
            </div>
        </section>
    )
}