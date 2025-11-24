import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js" // Mengganti mysql2

// ----------------------------------------------------
// KONFIGURASI SUPABASE API
// ----------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Inisialisasi Supabase Client
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export async function POST(request: NextRequest) {
    try {
        // 1. Cek Konfigurasi Supabase
        if (!supabase) {
            console.error("Server configuration error: Missing Supabase credentials")
            return NextResponse.json(
                {
                    success: false,
                    message: "Server configuration error: Missing Supabase credentials",
                },
                { status: 500 },
            )
        }

        // 2. Parse request body
        let body
        try {
            body = await request.json()
        } catch (parseError) {
            console.error("Failed to parse request body:", parseError)
            return NextResponse.json({ success: false, message: "Invalid request format" }, { status: 400 })
        }

        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json({ success: false, message: "Email dan password harus diisi" }, { status: 400 })
        }

        console.log("Login attempt for email:", email)

        // 3. Otentikasi menggunakan Supabase Auth (Mengganti SELECT MySQL)
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        
        if (authError || !authData.user) {
            console.error("Supabase Auth Error:", authError?.message)
            return NextResponse.json({ success: false, message: "Email atau password salah" }, { status: 401 })
        }

        const user = authData.user

        // 4. Ambil Role dari tabel 'admin_users'
        // Memastikan user yang login memiliki role admin di tabel profil
        const { data: adminProfile, error: profileError } = await supabase
            .from('admin_users') 
            .select('id, email, role') // Ambil data yang diperlukan
            .eq('email', user.email)
            .single()

        if (profileError || !adminProfile) {
            console.log("Login failed: Profile not found in admin_users table")
            // Jika profile tidak ditemukan, user berhasil login via Auth, tetapi BUKAN Admin yang terdaftar
            return NextResponse.json({ success: false, message: "Akses ditolak: Akun tidak terdaftar sebagai Admin" }, { status: 403 })
        }
        
        // 5. Set session cookie
        try {
            const cookieStore = cookies()
            const sessionData = JSON.stringify({
                id: adminProfile.id, // Gunakan ID dari tabel admin_users
                email: adminProfile.email,
                role: adminProfile.role, // Ambil role dari tabel profil
            })

            console.log("Setting session cookie")

            cookieStore.set("admin_session", sessionData, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7, // 7 days
                sameSite: "lax",
                path: "/",
            })

            return NextResponse.json({
                success: true,
                message: "Login berhasil",
                user: { id: adminProfile.id, email: adminProfile.email, role: adminProfile.role },
            })
        } catch (cookieError) {
            console.error("Failed to set cookie:", cookieError)
            return NextResponse.json({ success: false, message: "Failed to create session" }, { status: 500 })
        }
    } catch (error) {
        console.error("Login error (Supabase):", error)
        return NextResponse.json(
            {
                success: false,
                message: "Terjadi kesalahan server",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        )
    }
    // Block finally dihapus karena tidak ada koneksi database yang perlu ditutup secara manual
}

// Add OPTIONS handler for CORS (tetap sama)
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