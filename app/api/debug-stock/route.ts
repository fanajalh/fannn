import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  try {
    const sql = getDb()

    // 1. Raw data dari premium_stock
    const stocks = await sql`
      SELECT id, product_id, email, status FROM premium_stock ORDER BY id
    `

    // 2. Raw data dari premium_products 
    const products = await sql`
      SELECT id, name, is_active FROM premium_products ORDER BY id
    `

    // 3. Stock count query yang dipakai di API premium (debug version)
    const stockCounts = await sql`
      SELECT product_id, COUNT(*) AS stock_count
      FROM premium_stock
      WHERE status = 'AVAILABLE'
      GROUP BY product_id
    `

    return NextResponse.json({
      success: true,
      stocks,
      products,
      stockCounts,
    })
  } catch (error: any) {
    console.error("Debug stock error:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
