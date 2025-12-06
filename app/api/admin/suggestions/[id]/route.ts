import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ✅ HARUS service role
)

/* =====================
   UPDATE / REPLY
===================== */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { response, status } = await req.json()

    if (!response) {
      return NextResponse.json(
        { error: "Response wajib diisi" },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("suggestions")
      .update({
        response,
        status: status || "reviewed",
      })
      .eq("id", params.id)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/* =====================
   DELETE
===================== */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from("suggestions")
      .delete()
      .eq("id", params.id)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
