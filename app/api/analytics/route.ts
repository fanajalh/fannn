import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js" // Import library Supabase

// Kredensial Supabase (menggunakan Public URL & Anon Key)
// Catatan: Pastikan variabel ini ada di file .env Anda
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Inisialisasi Supabase Client di luar handler untuk efisiensi
// Anda bisa menggunakan service_role key untuk operasi server-side jika diperlukan,
// tetapi anon key cukup untuk pengujian jika RLS Anda diatur.
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export async function GET() {
    try {
        // 1. Cek konfigurasi Supabase
        if (!supabase) {
            // Return mock analytics data jika konfigurasi Supabase belum lengkap
            const mockAnalytics = {
                totalRevenue: 2500000,
                monthlyRevenue: 750000,
                totalOrders: 15,
                monthlyOrders: 5,
                averageOrderValue: 166667,
                topServices: [
                    { service: "poster-event", count: 6, revenue: 900000 },
                    { service: "logo-design", count: 4, revenue: 600000 },
                    { service: "poster-promo", count: 3, revenue: 600000 },
                    { service: "social-media", count: 2, revenue: 400000 },
                ],
                recentActivity: [
                    {
                        type: "order",
                        message: "Pesanan baru dari John Doe - poster-event",
                        time: new Date().toISOString(),
                    },
                    {
                        type: "order",
                        message: "Pesanan baru dari Jane Smith - logo-design",
                        time: new Date(Date.now() - 3600000).toISOString(),
                    },
                ],
            }

            return NextResponse.json({
                success: true,
                analytics: mockAnalytics,
                message: "Menggunakan mock data - database Supabase belum dikonfigurasi",
            })
        }

        // 2. Ambil data order menggunakan Supabase API
        // Menggunakan select('*') untuk mengambil semua kolom
        // Menggunakan order() untuk mengurutkan data
        const { data: rows, error } = await supabase
            .from('poster_orders') // Ganti dengan nama tabel Anda di Supabase
            .select('created_at, total_price, service, name') // Hanya ambil kolom yang relevan
            .order('created_at', { ascending: false })

        if (error) {
            console.error("Supabase query error:", error)
            return NextResponse.json({ success: false, message: `Gagal mengambil data dari Supabase: ${error.message}` }, { status: 500 })
        }

        const orders: Array<{ created_at: string; total_price: number; service: string; name: string }> = rows || []

        if (orders.length === 0) {
            return NextResponse.json({ 
                success: true, 
                analytics: { 
                    totalRevenue: 0, monthlyRevenue: 0, totalOrders: 0, 
                    monthlyOrders: 0, averageOrderValue: 0, topServices: [], recentActivity: [] 
                } 
            })
        }

        // 3. Lakukan perhitungan Analitik (Logika perhitungan tetap sama)
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()

        const totalRevenue = orders.reduce((sum: number, order) => sum + order.total_price, 0)
        const totalOrders = orders.length

        // Di PostgreSQL/Supabase, created_at biasanya berupa string ISO yang dapat langsung diolah
        const monthlyOrders = orders.filter((order) => {
            const orderDate = new Date(order.created_at)
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
        })

        const monthlyRevenue = monthlyOrders.reduce((sum: number, order) => sum + order.total_price, 0)
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

        // Top services
        const serviceStats: { [key: string]: { count: number; revenue: number } } = {}
        orders.forEach((order) => {
            if (!serviceStats[order.service]) {
                serviceStats[order.service] = { count: 0, revenue: 0 }
            }
            serviceStats[order.service].count++
            serviceStats[order.service].revenue += order.total_price
        })

        const topServices = Object.entries(serviceStats)
            .map(([service, stats]) => ({ service, ...stats }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)

        // Recent activity
        const recentActivity = orders.slice(0, 10).map((order) => ({
            type: "order",
            message: `Pesanan baru dari ${order.name} - ${order.service}`,
            time: order.created_at,
        }))

        const analytics = {
            totalRevenue,
            monthlyRevenue,
            totalOrders,
            monthlyOrders: monthlyOrders.length,
            averageOrderValue,
            topServices,
            recentActivity,
        }

        return NextResponse.json({ success: true, analytics })
    } catch (error) {
        console.error("Analytics database error (Supabase):", error)
        return NextResponse.json({ success: false, message: "Gagal mengambil data analytics dari Supabase" }, { status: 500 })
    }
    // Tidak ada 'finally' dengan connection.end() karena Supabase client tidak perlu ditutup secara eksplisit.
}