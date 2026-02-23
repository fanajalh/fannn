import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

// ----------------------------------------------------
// KONFIGURASI SUPABASE (SISI SERVER)
// ----------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// Gunakan SERVICE_ROLE_KEY untuk akses admin yang lebih kuat di backend
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = supabaseUrl && supabaseServiceKey 
    ? createClient(supabaseUrl, supabaseServiceKey) 
    : null

export async function POST(request: NextRequest) {
    try {
        // 1. Validasi Kredensial Environment
        if (!supabase) {
            console.error("❌ ERROR: Supabase credentials tidak ditemukan di .env")
            return NextResponse.json({ success: false, message: "Server configuration error" }, { status: 500 })
        }

        // 2. Ambil data dari body request
        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json({ success: false, message: "Email dan password wajib diisi" }, { status: 400 })
        }

        console.log(`🚀 Mencoba login untuk: ${email}`)

        // 3. Proses Sign In ke Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        // DEBUGGING: Jika kena 401, cek pesan di terminal ini
        if (authError) {
            console.error("❌ AUTH ERROR:", {
                status: authError.status,
                message: authError.message
            })
            
            // Pesan khusus jika email belum dikonfirmasi
            if (authError.message.includes("Email not confirmed")) {
                return NextResponse.json({ 
                    success: false, 
                    message: "Email belum dikonfirmasi. Cek inbox kamu atau matikan 'Confirm Email' di dashboard Supabase." 
                }, { status: 401 })
            }

            return NextResponse.json({ success: false, message: "Email atau password salah" }, { status: 401 })
        }

        const user = authData.user
        if (!user) throw new Error("User data not found after login")

        // 4. Verifikasi Role di Tabel 'admin_users'
        // Kita cek apakah user ini benar-benar terdaftar sebagai admin
        const { data: adminProfile, error: profileError } = await supabase
            .from('admin_users') 
            .select('id, email, role')
            .eq('email', user.email)
            .single()

        if (profileError || !adminProfile) {
            console.warn(`⚠️ AKSES DITOLAK: ${user.email} sukses Auth tapi tidak ada di tabel admin_users`)
            return NextResponse.json({ 
                success: false, 
                message: "Akses ditolak: Akun kamu bukan Admin resmi." 
            }, { status: 403 })
        }

        // 5. Membuat Session Cookie
        const cookieStore = cookies()
        const sessionData = JSON.stringify({
            id: adminProfile.id,
            email: adminProfile.email,
            role: adminProfile.role,
        })

        cookieStore.set("admin_session", sessionData, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7 hari
            sameSite: "lax",
            path: "/",
        })

        console.log(`✅ LOGIN SUKSES: Welcome back, ${adminProfile.email}`)

        return NextResponse.json({
            success: true,
            message: "Login berhasil",
            user: { id: adminProfile.id, email: adminProfile.email, role: adminProfile.role },
        })

    } catch (error) {
        console.error("💥 CRITICAL ERROR:", error)
        return NextResponse.json({
            success: false,
            message: "Terjadi kesalahan server internal",
            error: error instanceof Error ? error.message : "Unknown error",
        }, { status: 500 })
    }
}

// Handler untuk CORS (Pre-flight request)
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    })
}