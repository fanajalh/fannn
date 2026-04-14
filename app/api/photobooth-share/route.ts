import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// POST: Store image temporarily and return a share token
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const image = body.image as string;

    if (!image) {
      return NextResponse.json({ success: false, message: "No image data" }, { status: 400 });
    }

    // Generate unique token
    const token = crypto.randomBytes(16).toString("hex");

    const sql = getDb();

    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS photobooth_shares (
        id SERIAL PRIMARY KEY,
        token VARCHAR(64) UNIQUE NOT NULL,
        image_data TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '24 hours'
      )
    `;

    // Cleanup expired entries (older than 24h)
    await sql`DELETE FROM photobooth_shares WHERE expires_at < NOW()`;

    // Store image
    await sql`
      INSERT INTO photobooth_shares (token, image_data)
      VALUES (${token}, ${image})
    `;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://fanajah.vercel.app";
    const shareUrl = `${baseUrl}/share/${token}`;

    return NextResponse.json({ success: true, token, shareUrl });
  } catch (e: any) {
    console.error("POST /api/photobooth-share:", e);
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
