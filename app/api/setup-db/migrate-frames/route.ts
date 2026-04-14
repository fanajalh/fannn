import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const sql = getDb();

    // Add uploaded_by column (nullable FK to users)
    await sql`
      ALTER TABLE photobooth_frames
      ADD COLUMN IF NOT EXISTS uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL
    `;

    // Add uploader_name column
    await sql`
      ALTER TABLE photobooth_frames
      ADD COLUMN IF NOT EXISTS uploader_name VARCHAR(255)
    `;

    return NextResponse.json({
      success: true,
      message: "Migration complete! Added uploaded_by and uploader_name columns.",
    });
  } catch (e: any) {
    console.error("migrate-frames error:", e);
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
