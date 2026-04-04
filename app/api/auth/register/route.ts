import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const sql = getDb();
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email dan Password wajib diisi" }, { status: 400 });
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const displayName = name || email.split("@")[0];

    const result = await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${displayName}, ${email}, ${hashedPassword}, 'user')
      RETURNING id, email
    `;

    return NextResponse.json(
      { message: "Registrasi berhasil", user: { id: result[0].id, email: result[0].email } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
