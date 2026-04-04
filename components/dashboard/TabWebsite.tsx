"use client"

import { Save, Edit, Globe, Instagram, Phone, Mail, Link as LinkIcon, Palette, MessageSquare } from "lucide-react"
import type { WebsiteSettings } from "./types"

interface Props {
  settings: WebsiteSettings
  setSettings: (s: WebsiteSettings) => void
  editing: boolean
  setEditing: (e: boolean) => void
  onSave: () => void
}

export function TabWebsite({ settings, setSettings, editing, setEditing, onSave }: Props) {
  const update = (key: keyof WebsiteSettings, value: any) => {
    setSettings({ ...settings, [key]: value })
  }

  const inputClass = `w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.2rem] text-[13px] font-bold text-slate-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-400 ${!editing ? "opacity-60 cursor-not-allowed bg-slate-100" : ""}`

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      <div className="flex items-center justify-between bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
            <Globe size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-[17px] font-black text-slate-800 leading-tight">Identitas Website</h2>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Informasi Publik</p>
          </div>
        </div>
        
        {editing ? (
          <button onClick={onSave} className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-extrabold rounded-[1.2rem] text-[13px] hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-orange-500/30 outline-none">
            <Save size={16} strokeWidth={2.5} /> Simpan
          </button>
        ) : (
          <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-extrabold rounded-[1.2rem] text-[13px] hover:bg-black active:scale-95 transition-all shadow-md outline-none">
            <Edit size={16} strokeWidth={2.5} /> Edit
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
        
        {/* General Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">Nama Brand / Situs</label>
            <div className="relative">
              <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={settings.siteName} onChange={(e) => update("siteName", e.target.value)} disabled={!editing} className={inputClass} placeholder="JokiPoster" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">Tema Warna Utama</label>
            <div className="flex items-center gap-3">
              {/* Color Picker Box */}
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-slate-200 shrink-0 shadow-sm">
                <input type="color" value={settings.primaryColor} onChange={(e) => update("primaryColor", e.target.value)} disabled={!editing} className="absolute -top-2 -left-2 w-20 h-20 cursor-pointer" />
              </div>
              <div className="relative flex-1">
                <Palette size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={settings.primaryColor} onChange={(e) => update("primaryColor", e.target.value)} disabled={!editing} className={inputClass} placeholder="#FF7A00" />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">Slogan / Tagline</label>
            <div className="relative">
              <MessageSquare size={18} className="absolute left-4 top-4 text-slate-400" />
              <textarea rows={2} value={settings.tagline} onChange={(e) => update("tagline", e.target.value)} disabled={!editing} className={`${inputClass} resize-none pt-4`} placeholder="Mewujudkan desain impian Anda..." />
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">Nomor WhatsApp</label>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={settings.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} disabled={!editing} className={inputClass} placeholder="628123456789" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">Alamat Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" value={settings.email} onChange={(e) => update("email", e.target.value)} disabled={!editing} className={inputClass} placeholder="admin@domain.com" />
            </div>
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">Username Instagram</label>
            <div className="relative">
              <Instagram size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={settings.instagram} onChange={(e) => update("instagram", e.target.value)} disabled={!editing} className={inputClass} placeholder="@username_ig" />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}