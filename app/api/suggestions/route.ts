import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// =========================
// POST — USER KIRIM SARAN
// =========================
export async function POST(req: Request) {
  try {
    const { name, email, category, message } = await req.json();

    if (!category) {
      return NextResponse.json(
        { error: "Category wajib diisi" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("suggestions")
      .insert([
        {
          nama: name || null,
          user_email: email || null,
          category,
          saran: message,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    console.error("SERVER ERROR:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// =========================
// GET — ADMIN AMBIL SEMUA SARAN
// =========================
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("suggestions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET /suggestions error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (e) {
    console.error("SERVER GET ERROR:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
