"use client"

import { useState, useEffect } from "react"
import { 
  Plus, Trash2, X, Newspaper, Crown, Bell, 
  Loader2, Link as LinkIcon, Edit3, Image as ImageIcon, Briefcase, Activity, Sparkles, Clock
} from "lucide-react"
import Swal from "sweetalert2"

interface NewsItem { id: number; title: string; description: string; badge: string; color_from: string; color_to: string; link: string; is_active: boolean }
interface FeaturedWork { id: number; title: string; client_name: string; badge: string; duration_text: string; is_active: boolean }
interface ClientUpdate { id: number; client_email: string; title: string; status_text: string; is_active: boolean }

export function TabContent() {
  const [activeSection, setActiveSection] = useState<"news" | "works" | "updates">("news")
  const [news, setNews] = useState<NewsItem[]>([])
  const [works, setWorks] = useState<FeaturedWork[]>([])
  const [updates, setUpdates] = useState<ClientUpdate[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form states
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [n, w, u] = await Promise.all([
        fetch("/api/admin/news").then(r => r.json()).catch(() => ({ data: [] })),
        fetch("/api/admin/featured-works").then(r => r.json()).catch(() => ({ data: [] })),
        fetch("/api/admin/client-updates").then(r => r.json()).catch(() => ({ data: [] })),
      ])
      setNews(n.data || [])
      setWorks(w.data || [])
      setUpdates(u.data || [])
    } catch { /* silently fail */ }
    setLoading(false)
  }

  const handleAdd = async () => {
    setIsSubmitting(true)
    const endpoints: Record<string, string> = { news: "/api/admin/news", works: "/api/admin/featured-works", updates: "/api/admin/client-updates" }
    try {
      const res = await fetch(endpoints[activeSection], {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) { setShowForm(false); setFormData({}); fetchAll(); Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Data ditambahkan!', timer: 1500, showConfirmButton: false }); }
      else Swal.fire({ icon: 'error', text: 'Gagal menambah data' })
    } catch { Swal.fire({ icon: 'error', text: 'Error jaringan' }) }
    finally { setIsSubmitting(false) }
  }

  const handleDelete = async (section: string, id: number) => {
    const result = await Swal.fire({ title: 'Hapus Item?', text: "Data akan dihapus secara permanen.", icon: 'warning', showCancelButton: true, confirmButtonText: 'Ya, Hapus!' })
    if (!result.isConfirmed) return
    const endpoints: Record<string, string> = { news: "/api/admin/news", works: "/api/admin/featured-works", updates: "/api/admin/client-updates" }
    try {
      await fetch(`${endpoints[section]}/${id}`, { method: "DELETE" })
      fetchAll()
      Swal.fire({ icon: 'success', title: 'Terhapus!', timer: 1500, showConfirmButton: false })
    } catch { Swal.fire({ icon: 'error', text: 'Gagal menghapus' }) }
  }

  const sections = [
    { id: "news" as const, label: "Kabar Info", icon: Newspaper, count: news.length, color: "orange" },
    { id: "works" as const, label: "Karya Top", icon: Crown, count: works.length, color: "blue" },
    { id: "updates" as const, label: "Live Order", icon: Activity, count: updates.length, color: "emerald" },
  ]

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32">
      <Loader2 size={32} className="animate-spin text-orange-500 mb-4" />
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Memuat Data Server</p>
    </div>
  )

  const activeColor = sections.find(s => s.id === activeSection)?.color || "orange"

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 select-none pb-10">
      
      {/* ================= HEADER & TABS ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100">
        
        {/* Segmented Control (iOS Style) */}
        <div className="flex p-1.5 bg-slate-100/80 rounded-2xl overflow-x-auto no-scrollbar w-full md:w-auto border border-slate-200/50 shadow-inner">
          {sections.map((s) => {
            const Icon = s.icon
            const isActive = activeSection === s.id
            return (
              <button key={s.id} onClick={() => { setActiveSection(s.id); setShowForm(false) }}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-extrabold transition-all duration-300 outline-none whitespace-nowrap ${
                  isActive 
                    ? "bg-white text-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.06)]" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}>
                <Icon size={16} className={isActive ? `text-${s.color}-500` : "opacity-70"} strokeWidth={isActive ? 2.5 : 2} /> 
                {s.label}
                <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${isActive ? `bg-${s.color}-50 text-${s.color}-600` : 'bg-slate-200 text-slate-500'}`}>
                  {s.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Add Button */}
        <button onClick={() => { setShowForm(!showForm); setFormData({}) }}
          className={`flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[13px] font-extrabold hover:bg-black active:scale-95 transition-all shadow-lg shadow-slate-900/20 outline-none shrink-0 ${showForm ? 'hidden' : ''}`}>
          <Plus size={18} strokeWidth={2.5} /> Tambah Data
        </button>
      </div>

      {/* ================= ADD FORM CARD ================= */}
      {showForm && (
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 animate-in zoom-in-95 duration-300 relative overflow-hidden">
          {/* Decorative Line */}
          <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-${activeColor}-400 to-${activeColor}-500`} />
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
              <Edit3 size={18} className={`text-${activeColor}-500`} /> Form Input Baru
            </h3>
            <button onClick={() => setShowForm(false)} className="bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 p-2 rounded-full transition-colors active:scale-90">
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          <div className="space-y-4">
            {activeSection === "news" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">Judul Kabar Utama</label>
                  <input placeholder="Ketik judul menarik..." value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.2rem] text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-400" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">Deskripsi Singkat</label>
                  <textarea placeholder="Jelaskan detail kabar ini..." rows={3} value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.2rem] text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-400 resize-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">Teks Badge</label>
                    <div className="relative">
                      <Sparkles size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input placeholder="Misal: ⚡ Promo" value={formData.badge || ""} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.2rem] text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">Link Tujuan (Opsional)</label>
                    <div className="relative">
                      <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input placeholder="https://..." value={formData.link || ""} onChange={(e) => setFormData({ ...formData, link: e.target.value })} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.2rem] text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === "works" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">Nama Karya / Project</label>
                  <input placeholder="Misal: Redesign Logo Kopi Senja" value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.2rem] text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">Nama Client</label>
                    <div className="relative">
                      <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input placeholder="PT. ABC / Anonim" value={formData.client_name || ""} onChange={(e) => setFormData({ ...formData, client_name: e.target.value })} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.2rem] text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">Lama Pengerjaan</label>
                    <div className="relative">
                      <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input placeholder="Misal: 2 Hari" value={formData.duration_text || ""} onChange={(e) => setFormData({ ...formData, duration_text: e.target.value })} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.2rem] text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5 mt-2">
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">Teks Badge</label>
                    <input placeholder="Misal: Bestseller / Top Rated" value={formData.badge || ""} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.2rem] text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400" />
                </div>
              </>
            )}

            {activeSection === "updates" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">Email Client (Atau 'all' untuk semua)</label>
                  <input placeholder="user@gmail.com / all" value={formData.client_email || ""} onChange={(e) => setFormData({ ...formData, client_email: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.2rem] text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">Judul / Nama Orderan</label>
                  <input placeholder="Misal: Desain Banner 17an" value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.2rem] text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">Status Progres Pengerjaan</label>
                  <input placeholder="Misal: Sedang tahap sketsa..." value={formData.status_text || ""} onChange={(e) => setFormData({ ...formData, status_text: e.target.value })} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.2rem] text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400" />
                </div>
              </>
            )}

            {/* Action Buttons Form */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end mt-6 pt-4 border-t border-slate-100">
              <button onClick={() => setShowForm(false)} className="px-6 py-3.5 bg-slate-100 text-slate-600 rounded-[1.2rem] text-[13px] font-extrabold hover:bg-slate-200 active:scale-95 transition-all outline-none">
                Batal
              </button>
              <button onClick={handleAdd} disabled={isSubmitting} className={`flex items-center justify-center gap-2 px-8 py-3.5 bg-${activeColor}-500 text-white rounded-[1.2rem] text-[13px] font-extrabold hover:bg-${activeColor}-600 active:scale-95 transition-all shadow-[0_8px_20px_rgba(0,0,0,0.15)] outline-none disabled:opacity-50`}>
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Simpan Data"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DATA LIST ================= */}
      <div className="space-y-3">
        {/* ---- NEWS LIST ---- */}
        {activeSection === "news" && (
          news.length > 0 ? news.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-[1.5rem] border border-slate-100 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] group hover:border-orange-200 transition-colors">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="hidden sm:flex w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl items-center justify-center shrink-0">
                  <ImageIcon size={20} strokeWidth={2.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15px] font-extrabold text-slate-800 truncate mb-0.5">{item.title}</h3>
                  <p className="text-[12px] text-slate-500 truncate font-medium">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className={`hidden sm:inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${item.is_active ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-400 border border-slate-200"}`}>
                  {item.is_active ? "Aktif" : "Off"}
                </span>
                <button onClick={() => handleDelete("news", item.id)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors active:scale-90 outline-none">
                  <Trash2 size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )) : <EmptyState section="Kabar Info" />
        )}

        {/* ---- WORKS LIST ---- */}
        {activeSection === "works" && (
          works.length > 0 ? works.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-[1.5rem] border border-slate-100 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] group hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="hidden sm:flex w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl items-center justify-center shrink-0">
                  <Crown size={20} strokeWidth={2.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15px] font-extrabold text-slate-800 truncate mb-0.5">{item.title}</h3>
                  <p className="text-[12px] text-slate-500 truncate font-medium flex items-center gap-1.5">
                    <span className="bg-slate-100 text-slate-600 px-1.5 rounded uppercase text-[9px] font-bold">{item.client_name}</span> 
                    &bull; {item.duration_text}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 px-2.5 py-1 rounded-md border border-amber-100">
                  {item.badge}
                </span>
                <button onClick={() => handleDelete("works", item.id)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors active:scale-90 outline-none">
                  <Trash2 size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )) : <EmptyState section="Karya Top" />
        )}

        {/* ---- UPDATES LIST ---- */}
        {activeSection === "updates" && (
          updates.length > 0 ? updates.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-[1.5rem] border border-slate-100 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] group hover:border-emerald-200 transition-colors">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="hidden sm:flex w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl items-center justify-center shrink-0">
                  <Activity size={20} strokeWidth={2.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15px] font-extrabold text-slate-800 truncate mb-0.5">{item.title}</h3>
                  <div className="flex items-center gap-1.5 truncate">
                    <span className={`px-1.5 rounded uppercase text-[9px] font-bold ${item.client_email === 'all' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                      {item.client_email === 'all' ? 'Semua User' : item.client_email}
                    </span>
                    <span className="text-[12px] text-slate-500 font-medium truncate">&bull; {item.status_text}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <button onClick={() => handleDelete("updates", item.id)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors active:scale-90 outline-none">
                  <Trash2 size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )) : <EmptyState section="Live Order" />
        )}
      </div>
    </div>
  )
}

// Komponen Reusable untuk Empty State
function EmptyState({ section }: { section: string }) {
  return (
    <div className="text-center py-12 bg-white rounded-[2rem] border border-dashed border-slate-200 shadow-sm">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Newspaper size={24} className="text-slate-300" strokeWidth={2} />
      </div>
      <h4 className="text-[15px] font-black text-slate-700 mb-1">Belum ada data {section}</h4>
      <p className="text-[12px] font-medium text-slate-500">Klik tombol "Tambah Data" di atas untuk membuat.</p>
    </div>
  )
}