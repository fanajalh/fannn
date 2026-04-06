import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

// Mencegah Next.js caching — data harus selalu fresh
export const dynamic = "force-dynamic"
export const revalidate = 0
// GET detail produk premium berdasarkan slug (product id)
export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const sql = getDb()
    const { slug } = params

    // Ambil detail produk + hitung stok AVAILABLE
    const product = await sql`
      SELECT 
        p.id, p.category_id AS category, p.name, p.type, p.price, p.popular, p.duration,
        COALESCE(s.stock_count, 0)::int AS stock
      FROM premium_products p
      LEFT JOIN (
        SELECT product_id, COUNT(*) AS stock_count
        FROM premium_stock
        WHERE status = 'AVAILABLE'
        GROUP BY product_id
      ) s ON s.product_id = p.id
      WHERE p.id = ${slug} AND p.is_active IS NOT FALSE
    `

    if (product.length === 0) {
      return NextResponse.json(
        { success: false, message: "Produk tidak ditemukan" },
        { status: 404 }
      )
    }

    // Ambil nama kategori
    const category = await sql`
      SELECT name, icon, active_color AS "activeColor"
      FROM premium_categories
      WHERE id = ${product[0].category}
    `

    return NextResponse.json({
      success: true,
      data: {
        ...product[0],
        categoryName: category[0]?.name || "",
        categoryIcon: category[0]?.icon || "",
      }
    })
  } catch (error: any) {
    console.error("Premium product detail error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Gagal memuat detail produk" },
      { status: 500 }
    )
  }
}
