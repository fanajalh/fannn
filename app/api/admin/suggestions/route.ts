import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// POST: user kirim saran
export async function POST(req: Request) {
  try {
    const { name, email, category, message } = await req.json();

    if (!category)
      return NextResponse.json(
        { error: "Category wajib diisi" },
        { status: 400 }
      );

    const { data, error } = await supabase
      .from("suggestions")
      .insert({
        nama: name,
        user_email: email,
        category,
        saran: message,
        status: "pending",
      })
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET: admin lihat semua saran
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("suggestions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
