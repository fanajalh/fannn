import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

type Ctx = { params: { token: string } };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { token } = params;
    if (!token) {
      return NextResponse.json({ success: false, message: "Missing token" }, { status: 400 });
    }

    const sql = getDb();
    const rows = await sql`
      SELECT image_data FROM photobooth_shares
      WHERE token = ${token} AND expires_at > NOW()
    `;

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Link sudah expired atau tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, image: rows[0].image_data });
  } catch (e: any) {
    console.error("GET /api/photobooth-share/[token]:", e);
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
