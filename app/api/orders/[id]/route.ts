import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// ----------------------------------------------------
// KONFIGURASI SUPABASE API
// ----------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey 
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : null

function checkSupabaseConnection() {
    if (!supabase) {
        throw new Error("Supabase API client is not initialized. Check environment variables.")
    }
    return supabase
}

// ----------------------------------------------------
// PATCH (Update Status Pesanan)
// ----------------------------------------------------
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const supabaseClient = checkSupabaseConnection()

        const { status } = await request.json()
        const orderId = params.id 

        if (!status) {
            return NextResponse.json({ success: false, message: "Status harus diisi" }, { status: 400 })
        }
        
        const { data: updatedOrder, error: updateError } = await supabaseClient
            .from('poster_orders')
            .update({ 
                status: status, 
                updated_at: new Date().toISOString()
            })
            .eq('id', orderId)
            .select('*')
            .single()

        if (updateError) {
            console.error("Supabase UPDATE error:", updateError)
            return NextResponse.json({ success: false, message: `Gagal mengupdate pesanan: ${updateError.message}` }, { status: 500 })
        }
        
        if (!updatedOrder) {
            return NextResponse.json({ success: false, message: "Pesanan tidak ditemukan atau ID tidak valid" }, { status: 404 })
        }
        
        return NextResponse.json({ success: true, order: updatedOrder })
    } catch (error) {
        console.error("PATCH error (Supabase):", error)
        return NextResponse.json({ success: false, message: (error as Error).message || "Terjadi kesalahan server saat update status" }, { status: 500 })
    }
}

// ----------------------------------------------------
// DELETE (Hapus Pesanan)
// ----------------------------------------------------
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    try {
        const supabaseClient = checkSupabaseConnection()
        const orderId = params.id 
        
        const { error: deleteError } = await supabaseClient
            .from('poster_orders')
            .delete()
            .eq('id', orderId)

        if (deleteError) {
            console.error("Supabase DELETE error:", deleteError)
            return NextResponse.json({ success: false, message: `Gagal menghapus pesanan: ${deleteError.message}` }, { status: 500 })
        }

        return NextResponse.json({ success: true, message: "Pesanan berhasil dihapus" })
    } catch (error) {
        console.error("DELETE error (Supabase):", error)
        return NextResponse.json({ success: false, message: (error as Error).message || "Terjadi kesalahan server saat menghapus pesanan" }, { status: 500 })
    }
}