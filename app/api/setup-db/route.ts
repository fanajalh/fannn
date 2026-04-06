import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  try {
    if (process.env.NODE_ENV === "production") {
      const expected = process.env.SETUP_DB_SECRET;
      if (!expected) {
        return NextResponse.json({ error: "Setup dinonaktifkan di production." }, { status: 403 });
      }
      const url = new URL(request.url);
      if (url.searchParams.get("secret") !== expected) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const sql = getDb();

    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        image TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        company VARCHAR(255),
        service VARCHAR(100) NOT NULL,
        package VARCHAR(100) NOT NULL,
        title VARCHAR(500),
        description TEXT,
        dimensions VARCHAR(100),
        colors VARCHAR(255),
        deadline VARCHAR(100),
        additional_info TEXT,
        total_price INTEGER NOT NULL DEFAULT 0,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS suggestions (
        id SERIAL PRIMARY KEY,
        nama VARCHAR(255),
        user_email VARCHAR(255),
        category VARCHAR(255) NOT NULL,
        saran TEXT NOT NULL,
        response TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        type VARCHAR(20) DEFAULT 'general' CHECK (type IN ('general', 'game')),
        author VARCHAR(255),
        upvotes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS suggestion_replies (
        id SERIAL PRIMARY KEY,
        suggestion_id INTEGER NOT NULL REFERENCES suggestions(id) ON DELETE CASCADE,
        author VARCHAR(255),
        content TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        channel_id VARCHAR(255) NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Tabel Kabar Terbaru / Promo Banners
    await sql`
      CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        badge VARCHAR(100) DEFAULT '⚡ Info',
        color_from VARCHAR(50) DEFAULT 'teal-500',
        color_to VARCHAR(50) DEFAULT 'emerald-700',
        link TEXT,
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Tabel Karya Unggulan (Featured Works)
    await sql`
      CREATE TABLE IF NOT EXISTS featured_works (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        client_name VARCHAR(255),
        badge VARCHAR(100) DEFAULT 'Top',
        duration_text VARCHAR(100) DEFAULT 'Selesai dalam 2 hari',
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Tabel Client Updates (Area Pesanan info yg tampil di user homepage)
    await sql`
      CREATE TABLE IF NOT EXISTS client_updates (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
        client_email VARCHAR(255) NOT NULL,
        title VARCHAR(500) NOT NULL,
        status_text VARCHAR(255) DEFAULT 'Sedang Dikerjakan...',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // ==================== PREMIUM TABLES ====================

    // Kategori aplikasi premium (Canva, CapCut, Netflix, dll)
    await sql`
      CREATE TABLE IF NOT EXISTS premium_categories (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        icon VARCHAR(20) DEFAULT '📱',
        active_color VARCHAR(100) DEFAULT 'bg-blue-500',
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Paket produk premium (CapCut Private 7 Hari, Canva Owner 1 Tahun, dll)
    await sql`
      CREATE TABLE IF NOT EXISTS premium_products (
        id VARCHAR(100) PRIMARY KEY,
        category_id VARCHAR(50) REFERENCES premium_categories(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50),
        duration VARCHAR(50),
        price INTEGER NOT NULL DEFAULT 0,
        popular BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Stok akun aktual (email + password)
    await sql`
      CREATE TABLE IF NOT EXISTS premium_stock (
        id SERIAL PRIMARY KEY,
        product_id VARCHAR(100) REFERENCES premium_products(id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'SOLD', 'RESERVED')),
        buyer_wa VARCHAR(50),
        order_token VARCHAR(100),
        sold_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Pesanan premium — menggunakan token acak, bukan ID sequential
    await sql`
      CREATE TABLE IF NOT EXISTS premium_orders (
        id SERIAL PRIMARY KEY,
        order_token VARCHAR(100) UNIQUE NOT NULL,
        product_id VARCHAR(100) REFERENCES premium_products(id) ON DELETE SET NULL,
        buyer_wa VARCHAR(50) NOT NULL,
        total_price INTEGER NOT NULL DEFAULT 0,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'delivered', 'cancelled')),
        stock_id INTEGER REFERENCES premium_stock(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // OTP email (login, reset password, register sekali pakai)
    await sql`
      CREATE TABLE IF NOT EXISTS email_otps (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        code_hash TEXT NOT NULL,
        purpose VARCHAR(30) NOT NULL CHECK (purpose IN ('login', 'reset_password', 'register_login')),
        expires_at TIMESTAMP NOT NULL,
        consumed_at TIMESTAMP,
        attempt_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_email_otps_email_purpose ON email_otps (email, purpose)`;

    await sql`
      CREATE TABLE IF NOT EXISTS otp_send_log (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        purpose VARCHAR(30) NOT NULL,
        ip VARCHAR(45),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_otp_send_log_email ON otp_send_log (email, created_at)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_otp_send_log_ip ON otp_send_log (ip, created_at)`;

    await sql`
      CREATE TABLE IF NOT EXISTS photobooth_frames (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(64) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT NOT NULL,
        slots INTEGER NOT NULL DEFAULT 4,
        sort_order INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // ==================== SEED PREMIUM DATA ====================

    // Seed Kategori
    const seedCategories = [
      { id: "capcut", name: "CapCut Pro", icon: "✂️", color: "bg-slate-900", sort: 1 },
      { id: "canva", name: "Canva Pro", icon: "🎨", color: "bg-blue-500", sort: 2 },
      { id: "netflix", name: "Netflix", icon: "🍿", color: "bg-red-600", sort: 3 },
      { id: "spotify", name: "Spotify", icon: "🎵", color: "bg-emerald-600", sort: 4 },
    ];

    for (const cat of seedCategories) {
      await sql`
        INSERT INTO premium_categories (id, name, icon, active_color, sort_order)
        VALUES (${cat.id}, ${cat.name}, ${cat.icon}, ${cat.color}, ${cat.sort})
        ON CONFLICT (id) DO NOTHING
      `;
    }

    // Seed Produk
    const seedProducts = [
      { id: "capcut-7hari", cat: "capcut", name: "CapCut Private - 7 Hari", type: "Private", dur: "7 Hari", price: 3600, pop: false },
      { id: "capcut-1bulan", cat: "capcut", name: "CapCut Private - 1 Bulan", type: "Private", dur: "1 Bulan", price: 25000, pop: true },
      { id: "canva-1tahun", cat: "canva", name: "Canva Owner - 1 Tahun", type: "Owner", dur: "1 Tahun", price: 25000, pop: true },
    ];

    for (const p of seedProducts) {
      await sql`
        INSERT INTO premium_products (id, category_id, name, type, duration, price, popular)
        VALUES (${p.id}, ${p.cat}, ${p.name}, ${p.type}, ${p.dur}, ${p.price}, ${p.pop})
        ON CONFLICT (id) DO NOTHING
      `;
    }

    // Frame photobooth: dikelola sepenuhnya via admin dashboard, tanpa seed otomatis.

    // Create / update admin account
    const oldAdminEmail = "fanajalh@joki.com";
    const adminEmail = "muhammadfachriarfan7@gmail.com";
    const adminPassword = "faNajalh_459";

    // Hapus admin lama jika masih ada
    await sql`DELETE FROM users WHERE email = ${oldAdminEmail}`;

    const existing = await sql`SELECT id FROM users WHERE email = ${adminEmail}`;
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    let adminMsg = "";
    if (existing.length === 0) {
      await sql`
        INSERT INTO users (name, email, password, role)
        VALUES ('Super Admin Fanajah', ${adminEmail}, ${hashedPassword}, 'admin')
      `;
      adminMsg = "Admin created with new email";
    } else {
      // Update password & pastikan role admin
      await sql`
        UPDATE users SET password = ${hashedPassword}, role = 'admin', updated_at = NOW()
        WHERE email = ${adminEmail}
      `;
      adminMsg = "Admin updated with new password";
    }

    return NextResponse.json({
      success: true,
      message: "Database setup complete!",
      admin: adminMsg,
      tables: [
        "users", "orders", "suggestions", "suggestion_replies", "messages",
        "news", "featured_works", "client_updates",
        "premium_categories", "premium_products", "premium_stock", "premium_orders",
        "email_otps", "otp_send_log", "photobooth_frames",
      ],
    });
  } catch (e: any) {
    console.error("Setup DB error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
