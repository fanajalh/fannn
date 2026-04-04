"use client"

import { inputStyle, labelStyle, type OrderData } from "./types"

interface StepDetailsProps {
  orderData: OrderData
  setOrderData: React.Dispatch<React.SetStateAction<OrderData>>
}

export function StepDetails({ orderData, setOrderData }: StepDetailsProps) {
  const minDate = new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split("T")[0]

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-2xl font-black text-gray-900 mb-8">2. Detail Desain Proyek</h2>
      <div className="space-y-6">
        <div>
          <label className={labelStyle}>Judul / Tema Utama *</label>
          <input
            type="text"
            value={orderData.details.title}
            onChange={(e) => setOrderData({ ...orderData, details: { ...orderData.details, title: e.target.value } })}
            className={inputStyle}
            placeholder="Contoh: Poster Promo Diskon Ramadhan"
          />
        </div>

        <div>
          <label className={labelStyle}>Deskripsi Lengkap *</label>
          <textarea
            value={orderData.details.description}
            onChange={(e) =>
              setOrderData({ ...orderData, details: { ...orderData.details, description: e.target.value } })
            }
            rows={4}
            className={`${inputStyle} resize-none`}
            placeholder="Jelaskan detail isi teks yang mau dimasukkan, gaya desain (minimalis/elegan/ramai), dan info penting lainnya..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>Dimensi Ukuran</label>
            <input
              type="text"
              value={orderData.details.dimensions}
              onChange={(e) =>
                setOrderData({ ...orderData, details: { ...orderData.details, dimensions: e.target.value } })
              }
              className={inputStyle}
              placeholder="Contoh: A4 / 1080x1080px"
            />
          </div>
          <div>
            <label className={labelStyle}>Preferensi Warna</label>
            <input
              type="text"
              value={orderData.details.colors}
              onChange={(e) =>
                setOrderData({ ...orderData, details: { ...orderData.details, colors: e.target.value } })
              }
              className={inputStyle}
              placeholder="Contoh: Dominan Hijau Tosca"
            />
          </div>
        </div>

        <div>
          <label className={labelStyle}>Tenggat Waktu (Deadline) *</label>
          <input
            type="date"
            value={orderData.details.deadline}
            onChange={(e) =>
              setOrderData({ ...orderData, details: { ...orderData.details, deadline: e.target.value } })
            }
            className={inputStyle}
            min={minDate}
          />
        </div>

        <div>
          <label className={labelStyle}>Catatan Tambahan (Opsional)</label>
          <textarea
            value={orderData.details.additionalInfo}
            onChange={(e) =>
              setOrderData({ ...orderData, details: { ...orderData.details, additionalInfo: e.target.value } })
            }
            rows={3}
            className={`${inputStyle} resize-none`}
            placeholder="Link referensi GDrive/Pinterest atau pesan khusus untuk desainer..."
          />
        </div>
      </div>
    </div>
  )
}
