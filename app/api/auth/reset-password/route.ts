import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { verifyAndConsumeOtp } from "@/lib/otp";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const emailRaw = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const otp = typeof body.otp === "string" ? body.otp.trim() : "";
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

    if (!emailRaw || !otp || !newPassword) {
      return NextResponse.json({ message: "Data tidak lengkap." }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ message: "Password minimal 8 karakter." }, { status: 400 });
    }

    const sql = getDb();
    const users = await sql`SELECT id FROM users WHERE email = ${emailRaw}`;
    if (users.length === 0) {
      return NextResponse.json(
        { message: "Kode salah atau kedaluwarsa." },
        { status: 400 }
      );
    }

    const ok = await verifyAndConsumeOtp(emailRaw, otp, "reset_password");
    if (!ok) {
      return NextResponse.json(
        { message: "Kode salah atau kedaluwarsa." },
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await sql`UPDATE users SET password = ${hash}, updated_at = NOW() WHERE email = ${emailRaw}`;

    return NextResponse.json({ success: true, message: "Password berhasil diubah." });
  } catch (e) {
    console.error("reset-password:", e);
    return NextResponse.json({ message: "Terjadi kesalahan." }, { status: 500 });
  }
}
