import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const getSupabaseAdminClient = () => {
    // Memastikan variabel lingkungan ada sebelum mencoba membuat klien
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        // Ini akan muncul jika variabel belum diatur di Vercel/lokal
        throw new Error("Missing Supabase URL or Service Role Key");
    }

    return createClient(url, key);
};

/* =====================
    UPDATE / REPLY
===================== */
export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    // 1. Inisialisasi Klien di DALAM fungsi handler
    let supabase;
    try {
        supabase = getSupabaseAdminClient();
    } catch (e: any) {
         return NextResponse.json(
            { error: e.message || "Failed to initialize Supabase client" },
            { status: 500 }
        );
    }
    
    try {
        const { response, status } = await req.json();

        if (!response) {
            return NextResponse.json(
                { error: "Response wajib diisi" },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from("suggestions")
            .update({
                response,
                status: status || "reviewed",
            })
            .eq("id", params.id);

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        // Tangkap error JSON parse atau lainnya
        return NextResponse.json(
            { error: "Internal server error during request handling" },
            { status: 500 }
        );
    }
}

/* =====================
    DELETE
===================== */
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    // 1. Inisialisasi Klien di DALAM fungsi handler
    let supabase;
    try {
        supabase = getSupabaseAdminClient();
    } catch (e: any) {
         return NextResponse.json(
            { error: e.message || "Failed to initialize Supabase client" },
            { status: 500 }
        );
    }

    try {
        const { error } = await supabase
            .from("suggestions")
            .delete()
            .eq("id", params.id);

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json(
            { error: "Internal server error during request handling" },
            { status: 500 }
        );
    }
}