import { NextResponse } from "next/server"

export async function GET() {
  // Semua variabel lingkungan yang dibutuhkan oleh aplikasi
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    
    // --- Konfigurasi Supabase API (Frontend/Client) ---
    // Diperlukan untuk inisialisasi Supabase Client
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing",
    
    // Optional: Konfigurasi Server Supabase (Gunakan jika perlu Service Role Key)
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Missing/Not Used",

    // --- Konfigurasi Frontend ---
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ? "Set" : "Missing",
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ? "Set" : "Missing",
    
    // --- Konfigurasi Layanan Pihak Ketiga (Tetap Sama) ---
    WEB3FORMS_ACCESS_KEY: process.env.WEB3FORMS_ACCESS_KEY ? "Set" : "Missing",
    ULTRAMSG_INSTANCE_ID: process.env.ULTRAMSG_INSTANCE_ID ? "Set" : "Missing",
    ULTRAMSG_TOKEN: process.env.ULTRAMSG_TOKEN ? "Set" : "Missing",
  }

  // Menampilkan sebagian nilai untuk debugging
  const debugInfo = {
    // Menampilkan Supabase URL untuk verifikasi koneksi
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...`
        : "MISSING",
    // Menampilkan API URL yang digunakan Frontend
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL.substring(0, 30)}...`
      : "MISSING",
  }
  
  // Memeriksa variabel lingkungan MySQL/Database Individual yang seharusnya sudah hilang
  const legacyKeys = Object.keys(process.env).filter((key) => 
    key.startsWith("DB_") || key.startsWith("PG_") || key.includes("DB_PORT")
  );

  return NextResponse.json({
    success: true,
    message: "Environment variables check for Supabase API configuration",
    envVars,
    debugInfo,
    legacyKeys, // Membantu memastikan variabel MySQL/Individual DB lama sudah hilang
  })
}