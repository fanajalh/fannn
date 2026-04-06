import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

// GET — Ambil semua pesanan premium untuk admin
export async function GET() {
  try {
    const sql = getDb()
    const orders = await sql`
      SELECT 
        o.id, o.order_token, o.buyer_wa, o.total_price, o.status, o.created_at, o.updated_at,
        p.name AS product_name, p.type, p.duration,
        s.email AS stock_email
      FROM premium_orders o
      LEFT JOIN premium_products p ON p.id = o.product_id
      LEFT JOIN premium_stock s ON s.id = o.stock_id
      ORDER BY o.created_at DESC
    `
    return NextResponse.json({ success: true, data: orders })
  } catch (error: any) {
    console.error("Admin premium orders error:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// PATCH — Update status pesanan
export async function PATCH(req: Request) {
  try {
    const sql = getDb()
    const body = await req.json()
    const { orderToken, status } = body

    if (!orderToken || !status) {
      return NextResponse.json({ success: false, message: "Token dan status diperlukan" }, { status: 400 })
    }

    // Jika status = "paid", assign stok ke pembeli
    if (status === "paid") {
      const order = await sql`
        SELECT id, product_id, buyer_wa FROM premium_orders WHERE order_token = ${orderToken}
      `
      if (order.length === 0) {
        return NextResponse.json({ success: false, message: "Pesanan tidak ditemukan" }, { status: 404 })
      }

      // Cari stok yang AVAILABLE untuk produk ini
      const availableStock = await sql`
        SELECT id FROM premium_stock 
        WHERE product_id = ${order[0].product_id} AND status = 'AVAILABLE'
        LIMIT 1
      `

      if (availableStock.length > 0) {
        const stockId = availableStock[0].id

        // Update stok jadi SOLD
        await sql`
          UPDATE premium_stock 
          SET status = 'SOLD', buyer_wa = ${order[0].buyer_wa}, order_token = ${orderToken}, sold_at = NOW()
          WHERE id = ${stockId}
        `

        // Update pesanan dengan stock_id dan status paid
        await sql`
          UPDATE premium_orders 
          SET status = 'paid', stock_id = ${stockId}, updated_at = NOW()
          WHERE order_token = ${orderToken}
        `
      } else {
        return NextResponse.json({ success: false, message: "Stok habis untuk produk ini" }, { status: 400 })
      }
    } else {
      await sql`
        UPDATE premium_orders SET status = ${status}, updated_at = NOW()
        WHERE order_token = ${orderToken}
      `
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Admin premium order PATCH error:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
