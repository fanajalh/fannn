import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js" // Import library Supabase

// Kredensial Supabase (menggunakan Public URL & Service Role Key/Anon Key)
// PENTING: Untuk operasi server-side yang aman, disarankan menggunakan Service Role Key
// untuk inisialisasi client yang terpisah jika Anda ingin melakukan operasi admin penuh.
// Namun, untuk login user biasa (termasuk admin) menggunakan signInWithPassword,
// Anon Key sudah cukup, asalkan RLS diatur dengan benar untuk user terotentikasi.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Inisialisasi Supabase Client
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export async function POST(request: NextRequest) {
    try {
        // 1. Ambil body request
        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json({ success: false, message: "Email dan password harus diisi" }, { status: 400 })
        }
        
        // 2. Cek Konfigurasi Supabase
        if (!supabase) {
            console.error("Server configuration error: Missing Supabase credentials")
            return NextResponse.json(
                { success: false, message: "Supabase configuration missing" },
                { status: 500 },
            )
        }

        // 3. Otentikasi menggunakan Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        
        if (authError || !authData.user) {
            console.error("Supabase Auth Error:", authError?.message)
            return NextResponse.json({ success: false, message: "Email atau password salah" }, { status: 401 })
        }

        const user = authData.user

        // 4. (Opsional) Ambil Role dari tabel public (jika Role tidak disimpan di metadata Supabase Auth)
        // Kita asumsikan tabel user/admin Anda memiliki kolom 'role'
        const { data: adminProfile, error: profileError } = await supabase
            .from('admin_users') // Ganti dengan nama tabel profil admin Anda
            .select('role') // Ambil hanya kolom role
            .eq('email', user.email)
            .single()

        if (profileError || !adminProfile) {
             // Jika profile tidak ditemukan, mungkin user bukan admin
            return NextResponse.json({ success: false, message: "Akses ditolak" }, { status: 403 })
        }
        
        // 5. Set session cookie
        const cookieStore = cookies()
        const sessionData = JSON.stringify({
            id: user.id, // Supabase user UUID
            email: user.email,
            role: adminProfile.role, // Ambil role dari tabel profil
        })

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
            user: { id: user.id, email: user.email, role: adminProfile.role },
        })

    } catch (error) {
        console.error("Login error (Supabase):", error)
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan server" },
            { status: 500 },
        )
    }
}