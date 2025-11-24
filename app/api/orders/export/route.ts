import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js" // Mengganti mysql2

// ----------------------------------------------------
// KONFIGURASI SUPABASE API
// ----------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey 
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : null

// Helper untuk mengecek koneksi Supabase
function checkSupabaseConnection() {
    if (!supabase) {
        throw new Error("Supabase API client is not initialized. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
    }
    return supabase
}

export async function GET() {
    try {
        const supabaseClient = checkSupabaseConnection()

        // 1. Ambil semua pesanan dari Supabase (Mengganti connection.execute)
        const { data: orders, error: selectError } = await supabaseClient
            .from('poster_orders')
            .select('*')
            .order('created_at', { ascending: false })

        if (selectError) {
            console.error("Supabase SELECT error:", selectError)
            return NextResponse.json({ success: false, message: `Gagal mengambil data pesanan: ${selectError.message}` }, { status: 500 })
        }
        
        // Kita asumsikan 'orders' adalah array data order
        const orderData: any[] = orders || []

        if (orderData.length === 0) {
            // Jika tidak ada data, kembalikan CSV dengan hanya header
            const csvContent = "Order Number,Name,Email,Phone,Company,Service,Package,Title,Description,Dimensions,Colors,Deadline,Status,Total Price,Created At,Updated At"
            return new NextResponse(csvContent, {
                headers: {
                    "Content-Type": "text/csv",
                    "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().split("T")[0]}.csv"`,
                },
            })
        }

        // 2. Buat konten CSV (Logika pembuatan CSV tetap sama)
        const headers = [
            "Order Number", "Name", "Email", "Phone", "Company", "Service",
            "Package", "Title", "Description", "Dimensions", "Colors",
            "Deadline", "Status", "Total Price", "Created At", "Updated At",
        ]

        const csvContent = [
            headers.join(","),
            ...orderData.map((order: any) =>
                [
                    order.order_number,
                    // Pastikan data string dibungkus dalam kutipan ganda ("")
                    `"${order.name}"`,
                    order.email,
                    order.phone,
                    `"${order.company || ""}"`,
                    order.service,
                    order.package,
                    `"${order.title}"`,
                    // Menghapus baris baru/line break dan escape kutipan ganda untuk deskripsi
                    `"${String(order.description || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
                    `"${order.dimensions || ""}"`,
                    `"${order.colors || ""}"`,
                    // Tanggal dari Supabase (ISO string) akan digunakan di sini
                    order.deadline, 
                    order.status,
                    order.total_price,
                    order.created_at,
                    order.updated_at,
                ].join(","),
            ),
        ].join("\n")

        // 3. Kembalikan response sebagai file CSV
        return new NextResponse(csvContent, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().split("T")[0]}.csv"`,
            },
        })

    } catch (error) {
        console.error("Export error (Supabase):", error)
        return NextResponse.json({ success: false, message: (error as Error).message || "Terjadi kesalahan server saat ekspor data" }, { status: 500 })
    }
    // Block finally dihapus karena Supabase client tidak perlu ditutup
}