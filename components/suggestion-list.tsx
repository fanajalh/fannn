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
    Sparkles,
    Bug,
    MessageSquareQuote
} from "lucide-react"

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
// Disesuaikan dengan pilihan di SuggestionForm agar sinkron
const categoryMap: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    "Desain UI/UX": { color: "text-purple-600", bg: "bg-purple-50", icon: <Palette size={14} /> },
    "Fitur Baru": { color: "text-blue-600", bg: "bg-blue-50", icon: <Sparkles size={14} /> },
    "Perbaikan Bug": { color: "text-rose-600", bg: "bg-rose-50", icon: <Bug size={14} /> },
    "Performa": { color: "text-amber-600", bg: "bg-amber-50", icon: <Zap size={14} /> },
    "Dokumentasi": { color: "text-indigo-600", bg: "bg-indigo-50", icon: <BookOpen size={14} /> },
    "Lainnya": { color: "text-orange-600", bg: "bg-orange-50", icon: <Feather size={14} /> },
}

/* ================= SAFE FETCHER ================= */
const fetcher = async (url: string) => {
    const res = await fetch(url)
    const json = await res.json()
    return Array.isArray(json?.data) ? json.data : []
}

export default function SuggestionList() {
    const [filter, setFilter] = useState("Semua")

    const { data = [], isLoading, error } = useSWR<Suggestion[]>(
        "/api/suggestions",
        fetcher,
        {
            refreshInterval: 5000,
            revalidateOnFocus: true,
        }
    )

    /* ================= FILTERING & DATA PREP ================= */
    const verified = data.filter((s) => s.status === "reviewed")
    const filtered = filter === "Semua" ? verified : verified.filter((s) => s.kategori === filter)
    const categories = ["Semua", ...Object.keys(categoryMap)]

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })

    return (
        <section id="daftar-saran" className="py-24 relative overflow-hidden bg-[#FAFAFA] selection:bg-orange-100 selection:text-orange-900">
            
            {/* Background Decor */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* --- HEADER --- */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-full mb-6 shadow-sm">
                        <Inbox className="w-4 h-4 text-orange-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Saran Terverifikasi</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.1] mb-4">
                        Suara Pengguna <br className="hidden sm:block" />
                        <span className="text-orange-500">JokiPoster.</span>
                    </h2>
                    <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        Jelajahi masukan yang telah ditinjau dan balasan resmi dari tim kami. Ide terbaik seringkali datang dari Anda.
                    </p>
                </div>

                {/* --- FILTER BUTTONS --- */}
                <div className="flex justify-center flex-wrap gap-3 mb-16 animate-in fade-in duration-1000">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                                filter === cat
                                    ? "bg-gray-900 text-white shadow-xl shadow-gray-900/20 scale-105"
                                    : "bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-gray-100 shadow-sm"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* --- LOADING & ERROR STATES --- */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">Sinkronisasi Data...</p>
                    </div>
                )}

                {error && (
                    <div className="max-w-md mx-auto bg-red-50 border border-red-100 p-6 rounded-2xl text-center">
                        <p className="text-sm font-bold text-red-600">Gagal memuat data saran. Silakan muat ulang halaman.</p>
                    </div>
                )}

                {/* --- DATA GRID --- */}
                {!isLoading && filtered.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map((s) => {
                            const categoryInfo = categoryMap[s.kategori] || { color: "text-gray-600", bg: "bg-gray-100", icon: <Feather size={14} /> }
                            
                            return (
                                <div
                                    key={s.id}
                                    className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-orange-900/5 border border-gray-100 flex flex-col h-full transition-all duration-500 hover:-translate-y-1 group"
                                >
                                    {/* Card Header */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 font-black border border-gray-100">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900">{s.nama || "Anonim"}</p>
                                                <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-wider mt-0.5">
                                                    <Calendar size={10} /> {formatDate(s.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`${categoryInfo.bg} ${categoryInfo.color} text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5`}>
                                            {categoryInfo.icon}
                                            {s.kategori}
                                        </span>
                                    </div>

                                    {/* User Suggestion */}
                                    <div className="flex-grow mb-6">
                                        <div className="flex gap-2">
                                            <MessageSquareQuote className="text-gray-200 flex-shrink-0 rotate-180" size={24} />
                                            <p className="text-gray-700 font-medium leading-relaxed">
                                                {s.saran}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Admin Response (If any) */}
                                    {s.response && (
                                        <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50 mt-auto relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl" />
                                            <div className="flex items-center gap-2 mb-3 relative z-10">
                                                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                                                </div>
                                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Respon Developer</span>
                                            </div>
                                            <p className="text-sm text-gray-700 font-medium leading-relaxed relative z-10">
                                                {s.response}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* --- EMPTY STATE --- */}
                {!isLoading && filtered.length === 0 && (
                    <div className="max-w-2xl mx-auto text-center py-20 px-6 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
                            <Inbox size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Belum Ada Masukan</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Tidak ada saran terverifikasi untuk kategori <span className="text-gray-900 font-bold">"{filter}"</span>. 
                            Jadilah yang pertama memberikan ide brilian untuk kategori ini!
                        </p>
                    </div>
                )}
            </div>
        </section>
    )
}