import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT slug, name, description, image_url, slots, sort_order, uploaded_by, uploader_name
      FROM photobooth_frames
      WHERE is_active IS NOT FALSE
      ORDER BY sort_order ASC, id ASC
    `;
    return NextResponse.json({ success: true, data: rows });
  } catch (e: any) {
    console.error("GET /api/frames:", e);
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
