import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const sql = getDb()
    const body = await req.json()
    
    // Contoh untuk Midtrans
    const { order_id, transaction_status } = body

    if (transaction_status === "settlement" || transaction_status === "capture") {
      // UANG MASUK! — order_id di Midtrans = order_token di DB kita

      // 1. Ambil pesanan berdasarkan token
      const order = await sql`
        SELECT id, product_id, buyer_wa, status 
        FROM premium_orders 
        WHERE order_token = ${order_id}
      `
      if (order.length === 0) {
        return NextResponse.json({ message: "Order not found" }, { status: 404 })
      }
      if (order[0].status !== "pending") {
        return NextResponse.json({ message: "Already processed" }, { status: 200 })
      }

      // 2. Ambil 1 stok AVAILABLE untuk produk ini
      const stock = await sql`
        SELECT id FROM premium_stock 
        WHERE product_id = ${order[0].product_id} AND status = 'AVAILABLE'
        LIMIT 1
      `

      if (stock.length > 0) {
        const stockId = stock[0].id

        // 3. Update stok jadi SOLD
        await sql`
          UPDATE premium_stock 
          SET status = 'SOLD', buyer_wa = ${order[0].buyer_wa}, order_token = ${order_id}, sold_at = NOW()
          WHERE id = ${stockId}
        `

        // 4. Update pesanan → paid + assign stock
        await sql`
          UPDATE premium_orders 
          SET status = 'paid', stock_id = ${stockId}, updated_at = NOW()
          WHERE order_token = ${order_id}
        `
      } else {
        // Stok habis — tandai pesanan perlu restock
        await sql`
          UPDATE premium_orders 
          SET status = 'paid', updated_at = NOW()
          WHERE order_token = ${order_id}
        `
      }

      // TODO: (Opsional) Kirim notifikasi WhatsApp ke pembeli
    }

    return NextResponse.json({ message: "Webhook received" }, { status: 200 })

  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 })
  }
}