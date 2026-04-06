import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

// GET — Ambil semua stok akun premium
export async function GET() {
  try {
    const sql = getDb()
    const stocks = await sql`
      SELECT 
        s.id, s.email, s.password, s.status, s.buyer_wa, s.order_token, s.sold_at, s.created_at,
        p.name AS product_name, p.type, p.duration, p.category_id AS app
      FROM premium_stock s
      LEFT JOIN premium_products p ON p.id = s.product_id
      ORDER BY s.created_at DESC
    `
    return NextResponse.json({ success: true, data: stocks })
  } catch (error: any) {
    console.error("Admin premium GET error:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// POST — Tambah stok akun baru
export async function POST(req: Request) {
  try {
    const sql = getDb()
    const body = await req.json()
    const { app, type, duration, email, password } = body

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email dan password wajib diisi" }, { status: 400 })
    }

    // Cari product_id yang cocok berdasarkan app + type + duration
    // Jika tidak ada, buat product_id baru
    const productSlug = `${app.toLowerCase()}-${duration.toLowerCase().replace(/\s+/g, "")}`
    const productName = `${app} ${type} - ${duration}`

    // Upsert produk (buat jika belum ada)
    await sql`
      INSERT INTO premium_products (id, category_id, name, type, duration, price)
      VALUES (${productSlug}, ${app.toLowerCase()}, ${productName}, ${type}, ${duration}, 0)
      ON CONFLICT (id) DO NOTHING
    `

    // Insert stok baru
    const result = await sql`
      INSERT INTO premium_stock (product_id, email, password, status)
      VALUES (${productSlug}, ${email}, ${password}, 'AVAILABLE')
      RETURNING id
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error: any) {
    console.error("Admin premium POST error:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// DELETE — Hapus stok akun
export async function DELETE(req: Request) {
  try {
    const sql = getDb()
    const { searchParams } = new URL(req.url)
    const stockId = searchParams.get("id")

    if (!stockId) {
      return NextResponse.json({ success: false, message: "ID stok diperlukan" }, { status: 400 })
    }

    await sql`DELETE FROM premium_stock WHERE id = ${parseInt(stockId)}`
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Admin premium DELETE error:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
