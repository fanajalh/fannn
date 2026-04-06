import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

// Mencegah Next.js caching — data harus selalu fresh dari database
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const sql = getDb()

    // Ambil kategori aktif, urutkan
    const categories = await sql`
      SELECT id, name, icon, active_color AS "activeColor"
      FROM premium_categories
      WHERE is_active IS NOT FALSE
      ORDER BY sort_order ASC
    `

    // Ambil produk aktif + hitung stok AVAILABLE per produk
    const products = await sql`
      SELECT 
        p.id, p.category_id AS category, p.name, p.type, p.price, p.popular,
        COALESCE(s.stock_count, 0)::int AS stock
      FROM premium_products p
      LEFT JOIN (
        SELECT product_id, COUNT(*) AS stock_count
        FROM premium_stock
        WHERE status = 'AVAILABLE'
        GROUP BY product_id
      ) s ON s.product_id = p.id
      WHERE p.is_active IS NOT FALSE
      ORDER BY p.popular DESC, p.name ASC
    `

    return NextResponse.json({
      success: true,
      data: { categories, products }
    })
  } catch (error: any) {
    console.error("Premium catalog error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Gagal memuat katalog" },
      { status: 500 }
    )
  }
}
