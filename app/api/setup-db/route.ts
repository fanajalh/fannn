import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
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

    // Create admin account
    const adminEmail = "fanajalh@joki.com";
    const existing = await sql`SELECT id FROM users WHERE email = ${adminEmail}`;

    let adminMsg = "Admin already exists";
    if (existing.length === 0) {
      const hashedPassword = await bcrypt.hash("faNajalh_459", 10);
      await sql`
        INSERT INTO users (name, email, password, role)
        VALUES ('Super Admin Fanajah', ${adminEmail}, ${hashedPassword}, 'admin')
      `;
      adminMsg = "Admin created successfully";
    }

    return NextResponse.json({
      success: true,
      message: "Database setup complete!",
      admin: adminMsg,
      tables: ["users", "orders", "suggestions", "suggestion_replies", "messages"],
    });
  } catch (e: any) {
    console.error("Setup DB error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
