import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import crypto from "crypto"

// Buat token acak yang aman — tidak pernah expose DB ID ke user
function generateOrderToken(): string {
  return "PREM-" + crypto.randomBytes(6).toString("hex").toUpperCase()
}

export async function POST(req: Request) {
  try {
    const sql = getDb()
    const body = await req.json()
    const { slug, wa } = body

    if (!slug || !wa) {
      return NextResponse.json({ success: false, message: "Slug produk dan nomor WA wajib diisi" }, { status: 400 })
    }

    // Cek produk ada dan aktif
    const product = await sql`
      SELECT id, name, price FROM premium_products WHERE id = ${slug} AND is_active IS NOT FALSE
    `
    if (product.length === 0) {
      return NextResponse.json({ success: false, message: "Produk tidak ditemukan" }, { status: 404 })
    }

    // Cek apakah ada stok AVAILABLE
    const stockCount = await sql`
      SELECT COUNT(*)::int AS count FROM premium_stock 
      WHERE product_id = ${slug} AND status = 'AVAILABLE'
    `
    if (stockCount[0].count === 0) {
      return NextResponse.json({ success: false, message: "Stok habis untuk produk ini" }, { status: 400 })
    }

    // Buat pesanan dengan token acak
    const orderToken = generateOrderToken()
    await sql`
      INSERT INTO premium_orders (order_token, product_id, buyer_wa, total_price, status)
      VALUES (${orderToken}, ${slug}, ${wa}, ${product[0].price}, 'pending')
    `

    // Return token, BUKAN id database
    return NextResponse.json({ 
      success: true, 
      orderToken: orderToken
    }, { status: 200 })

  } catch (error: any) {
    console.error("Premium order error:", error)
    return NextResponse.json({ success: false, message: "Gagal membuat pesanan" }, { status: 500 })
  }
}