"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, RefreshCw, Loader2, ImageIcon, Pencil, X } from "lucide-react"
import Swal from "sweetalert2"

type FrameRow = {
  id: number
  slug: string
  name: string
  description: string | null
  image_url: string
  slots: number
  sort_order: number
  is_active: boolean
}

const emptyForm = {
  slug: "",
  name: "",
  description: "",
  image_url: "",
  slots: 4,
  sort_order: 0,
  is_active: true,
}

export default function TabPhotoboothFrames() {
  const [rows, setRows] = useState<FrameRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<FrameRow | null>(null)
  const [form, setForm] = useState(emptyForm)

  const fetchRows = async () => {
    try {
      const res = await fetch("/api/admin/photobooth-frames")
      const json = await res.json()
      if (json.success) setRows(json.data || [])
    } catch {
      setRows([])
    }
  }

  useEffect(() => {
    fetchRows().finally(() => setLoading(false))
  }, [])

  const openNew = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (r: FrameRow) => {
    setEditing(r)
    setForm({
      slug: r.slug,
      name: r.name,
      description: r.description || "",
      image_url: r.image_url,
      slots: r.slots,
      sort_order: r.sort_order,
      is_active: r.is_active,
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        const res = await fetch(`/api/admin/photobooth-frames/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.message || "Gagal")
        Swal.fire({ icon: "success", title: "Diperbarui", timer: 1200, showConfirmButton: false })
      } else {
        const res = await fetch("/api/admin/photobooth-frames", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.message || "Gagal")
        Swal.fire({ icon: "success", title: "Ditambahkan", timer: 1200, showConfirmButton: false })
      }
      setShowForm(false)
      setEditing(null)
      setForm(emptyForm)
      fetchRows()
    } catch (err: any) {
      Swal.fire({ icon: "error", text: err.message || "Error" })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (r: FrameRow) => {
    const ok = await Swal.fire({
      title: "Hapus frame?",
      text: r.name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    })
    if (!ok.isConfirmed) return
    try {
      const res = await fetch(`/api/admin/photobooth-frames/${r.id}`, { method: "DELETE" })
      const json = await res.json()
      if (json.success) {
        fetchRows()
        Swal.fire({ icon: "success", title: "Terhapus", timer: 1000, showConfirmButton: false })
      } else throw new Error(json.message)
    } catch (e: any) {
      Swal.fire({ icon: "error", text: e.message || "Gagal" })
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-3" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat frame…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600 max-w-xl">
          Tempel URL gambar dari CDN (https). Slug dipakai di URL studio, mis.{" "}
          <code className="text-xs bg-slate-100 px-1 rounded">/studio?frameId=good-vibes</code>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fetchRows()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50"
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button
            type="button"
            onClick={openNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 shadow-lg shadow-orange-500/20"
          >
            <Plus size={18} /> Frame baru
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((r) => (
          <div
            key={r.id}
            className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 shadow-sm"
          >
            <div className="w-24 h-32 shrink-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.image_url} alt="" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-black text-slate-900 truncate">{r.name}</p>
                  <p className="text-[11px] font-mono text-slate-500">{r.slug}</p>
                </div>
                {!r.is_active && (
                  <span className="text-[10px] font-bold uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    off
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 mt-1">{r.description || "—"}</p>
              <p className="text-[10px] text-slate-400 mt-2">
                {r.slots} slot · urut {r.sort_order}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => openEdit(r)}
                  className="text-xs font-bold text-orange-600 hover:underline inline-flex items-center gap-1"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(r)}
                  className="text-xs font-bold text-red-600 hover:underline inline-flex items-center gap-1"
                >
                  <Trash2 size={12} /> Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rows.length === 0 && (
        <p className="text-center text-slate-400 text-sm py-8">Belum ada frame. Tambah dari tombol di atas.</p>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <ImageIcon className="text-orange-500" size={22} />
              {editing ? "Edit frame" : "Frame baru"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500">Slug</label>
                <input
                  required
                  disabled={!!editing}
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50"
                  placeholder="good-vibes"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Nama</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-sm min-h-[72px]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">URL gambar (CDN / https)</label>
                <input
                  required
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  placeholder="https://cdn.example.com/frame.png"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500">Slots foto</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={form.slots}
                    onChange={(e) => setForm({ ...form, slots: parseInt(e.target.value, 10) || 4 })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">Urutan</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                />
                Aktif (tampil di halaman pengguna)
              </label>
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 disabled:opacity-60"
              >
                {saving ? "Menyimpan…" : editing ? "Simpan perubahan" : "Simpan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
