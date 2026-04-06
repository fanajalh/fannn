import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export const dynamic = "force-dynamic"
// GET — Detail pesanan berdasarkan TOKEN (bukan ID)
export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const sql = getDb()
    const { token } = params

    const order = await sql`
      SELECT 
        o.order_token, o.buyer_wa, o.total_price, o.status, o.created_at,
        p.name AS product_name, p.type, p.duration
      FROM premium_orders o
      LEFT JOIN premium_products p ON p.id = o.product_id
      WHERE o.order_token = ${token}
    `

    if (order.length === 0) {
      return NextResponse.json({ success: false, message: "Pesanan tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: order[0] })
  } catch (error: any) {
    console.error("Premium order detail error:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// POST — Simulasi pembayaran (dev only) — set status ke paid dan assign stok
export async function POST(
  req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const sql = getDb()
    const { token } = params

    // Ambil pesanan
    const order = await sql`
      SELECT id, product_id, buyer_wa, status FROM premium_orders WHERE order_token = ${token}
    `
    if (order.length === 0) {
      return NextResponse.json({ success: false, message: "Pesanan tidak ditemukan" }, { status: 404 })
    }
    if (order[0].status !== "pending") {
      return NextResponse.json({ success: false, message: "Pesanan sudah diproses" }, { status: 400 })
    }

    // Cari stok AVAILABLE
    const stock = await sql`
      SELECT id FROM premium_stock 
      WHERE product_id = ${order[0].product_id} AND status = 'AVAILABLE'
      LIMIT 1
    `

    if (stock.length === 0) {
      return NextResponse.json({ success: false, message: "Stok habis" }, { status: 400 })
    }

    const stockId = stock[0].id

    // Update stok → SOLD
    await sql`
      UPDATE premium_stock 
      SET status = 'SOLD', buyer_wa = ${order[0].buyer_wa}, order_token = ${token}, sold_at = NOW()
      WHERE id = ${stockId}
    `

    // Update pesanan → paid
    await sql`
      UPDATE premium_orders 
      SET status = 'paid', stock_id = ${stockId}, updated_at = NOW()
      WHERE order_token = ${token}
    `

    return NextResponse.json({ success: true, message: "Pembayaran berhasil" })
  } catch (error: any) {
    console.error("Premium simulate payment error:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
