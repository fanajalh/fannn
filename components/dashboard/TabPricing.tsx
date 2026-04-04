"use client"

import { Save, Edit, DollarSign, Tag } from "lucide-react"
import type { WebsiteSettings } from "./types"

interface Props {
  settings: WebsiteSettings
  setSettings: (s: WebsiteSettings) => void
  editing: boolean
  setEditing: (e: boolean) => void
  onSave: () => void
}

export function TabPricing({ settings, setSettings, editing, setEditing, onSave }: Props) {
  const updateService = (index: number, key: string, value: any) => {
    const updated = [...settings.services]
    updated[index] = { ...updated[index], [key]: value }
    setSettings({ ...settings, services: updated })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center justify-between bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center">
            <Tag size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-[17px] font-black text-slate-800 leading-tight">Master Harga</h2>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Update katalog</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settings.services.map((service, idx) => (
          <div key={service.id} className={`bg-white p-5 rounded-[1.8rem] border transition-all duration-300 ${service.active ? 'border-slate-200 shadow-sm' : 'border-slate-100 opacity-60'}`}>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-[1.1rem] flex items-center justify-center shrink-0 transition-colors ${service.active ? "bg-emerald-50 text-emerald-500" : "bg-slate-100 text-slate-400"}`}>
                  <DollarSign size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[15px] font-extrabold text-slate-800">{service.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{service.id}</p>
                </div>
              </div>

              {/* iOS Style Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={service.active}
                  onChange={(e) => editing && updateService(idx, "active", e.target.checked)}
                  disabled={!editing}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 disabled:opacity-50"></div>
              </label>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Harga Dasar</p>
              {editing ? (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    value={service.price}
                    onChange={(e) => updateService(idx, "price", Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-lg font-black text-slate-800 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                  />
                </div>
              ) : (
                <p className="text-2xl font-black text-slate-800 tracking-tight ml-1">
                  <span className="text-sm font-bold text-slate-400 mr-1">Rp</span>
                  {new Intl.NumberFormat("id-ID").format(service.price)}
                </p>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}