import { type NextRequest, NextResponse } from "next/server"
import nodemailer from 'nodemailer'
import { createClient } from "@supabase/supabase-js" // Mengganti mysql2

// ----------------------------------------------------
// KONFIGURASI SUPABASE API
// ----------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey 
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : null

// ----------------------------------------------------
// HELPER: NODEMAILER
// ----------------------------------------------------
// Konfigurasi Nodemailer tetap sama
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendEmail(mailOptions: nodemailer.SendMailOptions) {
    if (!process.env.EMAIL_USER) {
        console.error("Email credentials not configured. Skipping email.");
        return { success: false, message: "Email credentials missing" };
    }
    
    try {
        const info = await transporter.sendMail(mailOptions);
        return { success: true, message: `Email sent: ${info.messageId}` };
    } catch (error) {
        console.error("Nodemailer failed to send email:", error);
        return { success: false, message: "Nodemailer error" };
    }
}

// ----------------------------------------------------
// POST (Submit Pesanan Baru)
// ----------------------------------------------------
export async function POST(request: NextRequest) {
    
    // Variabel koneksi MySQL dihapus
    const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY // Tetap gunakan ENV ini untuk mengecek kredensial lama
    
    try {
        // 1. Cek Konfigurasi Supabase
        if (!supabase) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Server configuration error: Missing Supabase API credentials",
                },
                { status: 500 },
            )
        }

        const orderData = await request.json()
        const orderNumber = `JP${Date.now()}`

        // Logika Perhitungan Harga (TIDAK BERUBAH)
        const servicePrices: { [key: string]: number } = {
            "poster-event": 15000, "poster-edukasi": 20000, "social-media": 25000,
            "print-flyer": 15000, "lainya": 10000,
        }

        const packageIncrement: { [key: string]: number } = {
            basic: 0, professional: 5000, enterprise: 20000,
        }

        const basePrice = servicePrices[orderData.service] || 0
        const packageAddon = packageIncrement[orderData.package] || 0
        const totalPrice = basePrice + packageAddon
        
        // 2. Query INSERT Supabase (menggantikan Kueri MySQL)
        const newOrder = {
            order_number: orderNumber,
            name: orderData.contact.name,
            email: orderData.contact.email,
            phone: orderData.contact.phone,
            company: orderData.contact.company,
            service: orderData.service,
            package: orderData.package,
            title: orderData.details.title,
            description: orderData.details.description,
            dimensions: orderData.details.dimensions,
            colors: orderData.details.colors,
            deadline: orderData.details.deadline,
            additional_info: orderData.details.additionalInfo,
            total_price: totalPrice,
            status: "pending",
        }

        const { data: insertedOrder, error: insertError } = await supabase
            .from('poster_orders')
            .insert(newOrder)
            .select('*') // Minta Supabase mengembalikan data yang baru dimasukkan
            .single()

        if (insertError || !insertedOrder) {
            console.error("Supabase INSERT error:", insertError);
            return NextResponse.json({ success: false, message: `Gagal menyimpan pesanan: ${insertError?.message || "Unknown error"}` }, { status: 500 })
        }

        const order = insertedOrder

        // Send notifications (optional - logika Nodemailer & UltraMsg tetap sama)
        try {
            // --- KIRIM NOTIFIKASI EMAIL MENGGUNAKAN NODEMAILER ---
            if (process.env.EMAIL_USER) {
                console.log("Sending email notification via Nodemailer...")
                
                const htmlContent = `
    <div style="font-family: 'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f7f7f7; padding: 20px;">
        <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);">
            
            <div style="background-color: #ff5722; color: #ffffff; padding: 25px 30px; text-align: center; border-bottom: 4px solid #e64a19;">
                <h1 style="margin: 0; font-size: 26px; font-weight: 700;">💰 PESANAN ANDA MASUK!</h1>
                <p style="margin: 5px 0 0; font-size: 14px; font-weight: 300;">Order ID: ${orderNumber}</p>
            </div>

            <div style="padding: 30px;">
                <h2 style="color: #1f2937; font-size: 20px; margin-top: 0; margin-bottom: 15px;">Detail Pesanan</h2>
                
                <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 15px; border-radius: 8px; overflow: hidden;">
                    <tr>
                        <td colspan="2" style="padding: 8px 0 4px; font-size: 15px; font-weight: 600; color: #555;">DATA KONTAK</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 15px; background-color: #f9f9f9; border-bottom: 1px solid #eee; width: 35%;">Nama</td>
                        <td style="padding: 10px 15px; background-color: #ffffff; border-bottom: 1px solid #eee;">${orderData.contact.name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 15px; background-color: #f9f9f9; border-bottom: 1px solid #eee;">Email</td>
                        <td style="padding: 10px 15px; background-color: #ffffff; border-bottom: 1px solid #eee;"><a href="mailto:${orderData.contact.email}" style="color: #ff5722; text-decoration: none;">${orderData.contact.email}</a></td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 15px; background-color: #f9f9f9; border-bottom: 1px solid #eee;">Phone</td>
                        <td style="padding: 10px 15px; background-color: #ffffff; border-bottom: 1px solid #eee;">${orderData.contact.phone}</td>
                    </tr>

                    <tr>
                        <td colspan="2" style="padding: 20px 0 4px; font-size: 15px; font-weight: 600; color: #555;">LAYANAN & JADWAL</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 15px; background-color: #f9f9f9; border-bottom: 1px solid #eee;">Layanan</td>
                        <td style="padding: 10px 15px; background-color: #ffffff; border-bottom: 1px solid #eee;">${orderData.service} (${orderData.package})</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 15px; background-color: #f9f9f9; border-bottom: 1px solid #eee;"><strong>WA Admin</strong></td>
                        <td style="padding: 10px 15px; background-color: #ffffff; border-bottom: 1px solid #eee; font-weight: 700; color: #2ecc71;">
                            <a href="https://wa.me/${process.env.WA_ADMIN_NUMBER}" style="color: #2ecc71; text-decoration: none;">
                                ${process.env.WA_ADMIN_NUMBER || 'Mohon Atur Variabel WA_ADMIN_NUMBER'}
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 15px; background-color: #f9f9f9; border-bottom: 1px solid #eee;">Deadline</td>
                        <td style="padding: 10px 15px; background-color: #ffffff; border-bottom: 1px solid #eee; font-weight: 600; color: #2ecc71;">${orderData.details.deadline}</td>
                    </tr>

                    <tr>
                        <td colspan="2" style="padding-top: 25px;">
                            <div style="background-color: #2ecc71; color: #ffffff; padding: 15px 20px; text-align: center; border-radius: 8px;">
                                <span style="font-size: 16px; font-weight: 500; display: block;">TOTAL HARGA:</span>
                                <strong style="font-size: 26px; display: block; margin-top: 5px;">Rp ${totalPrice.toLocaleString("id-ID")}</strong>
                            </div>
                        </td>
                    </tr>
                </table>

                <h3 style="color: #1f2937; margin-top: 35px; font-size: 18px;">Deskripsi Kebutuhan:</h3>
                <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #ff5722; border-radius: 4px; font-style: italic; color: #555; margin-bottom: 30px;">${orderData.details.description}</p>
                
                <p style="font-size: 16px; font-weight: 600; text-align: center; color: #ff5722;">Segera proses pesanan ini!</p>
            </div>

            <div style="background-color: #e0e0e0; padding: 15px 30px; text-align: center; font-size: 11px; color: #666; border-top: 1px solid #ccc;">
                Ini adalah notifikasi otomatis dari sistem JokiPoster.
            </div>
        </div>
    </div>
`;

                await sendEmail({
                    from: `"JokiPoster System" <${process.env.EMAIL_USER}>`,
                    to: orderData.contact.email, 
                    bcc: process.env.EMAIL_USER, 
                    subject: `[JokiPoster] Pesanan Anda Berhasil Dibuat (${orderNumber})`,
                    html: htmlContent,
                });
                
                console.log("Email notification sent successfully via Nodemailer");
            } else {
                console.log("Nodemailer credentials not configured. Skipping email notification.");
            }

            // Send WhatsApp notification via UltraMsg (Logika ini tetap sama)
            if (process.env.ULTRAMSG_INSTANCE_ID && process.env.ULTRAMSG_TOKEN) {
                console.log("Sending WhatsApp notification...")

                let adminPhone = "6285728150223"
                if (adminPhone.startsWith("0")) {
                    adminPhone = "62" + adminPhone.substring(1)
                }

                const whatsappMessage = `🎉 *PESANAN BARU MASUK!*

📋 *Order Details:*
• Order ID: ${orderNumber}
• Nama: ${orderData.contact.name}
• Email: ${orderData.contact.email}
• Phone: ${orderData.contact.phone}
• Service: ${orderData.service}
• Package: ${orderData.package}
• Total: Rp ${totalPrice.toLocaleString("id-ID")}
• Deadline: ${orderData.details.deadline}

📝 *Deskripsi:*
${orderData.details.description}

⏰ Segera follow up customer!`

                const whatsappResponse = await fetch(
                    `https://api.ultramsg.com/${process.env.ULTRAMSG_INSTANCE_ID}/messages/chat`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: new URLSearchParams({
                            token: process.env.ULTRAMSG_TOKEN!,
                            to: adminPhone,
                            body: whatsappMessage,
                        }),
                    },
                )

                const whatsappResult = await whatsappResponse.json()
                if (whatsappResult.sent) {
                    console.log("WhatsApp notification sent successfully")
                } else {
                    console.error("WhatsApp notification failed:", whatsappResult)
                }
            } else {
                console.log("WhatsApp credentials not configured")
            }
        } catch (notificationError) {
            console.error("Notification error:", notificationError)
            // Jangan gagal mengirim pesanan jika notifikasi gagal
        }

        return NextResponse.json({
            success: true,
            message: "Pesanan berhasil dikirim! Kami akan segera menghubungi Anda.",
            order: order,
        })
    } catch (error) {
        console.error("Order submission error:", error)
        return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 })
    }
    // Block finally untuk connection.end() dihapus karena Supabase tidak memerlukannya
}

// ----------------------------------------------------
// GET (Ambil Semua Pesanan) - (DIKOREKSI UNTUK SUPABASE)
// ----------------------------------------------------
export async function GET() {
    try {
        if (!supabase) {
            console.log("Missing environment variables for orders API, returning mock data")
            // ... (Mock Data)
            return NextResponse.json({
                success: true,
                orders: [
                    // Mock data item 1
                    { id: 1, order_number: "JP1234567890", name: "John Doe", email: "john@example.com", phone: "08123456789", company: "Test Company", service: "poster-event", package: "professional", title: "Mock Event Poster", description: "This is a mock order for testing purposes", dimensions: "A3", colors: "Blue and White", deadline: "2024-01-15", additional_info: "Mock additional info", status: "pending", total_price: 150000, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
                    // Mock data item 2
                    { id: 2, order_number: "JP1234567891", name: "Jane Smith", email: "jane@example.com", phone: "08987654321", company: "Design Co", service: "logo-design", package: "basic", title: "Company Logo", description: "Modern logo design for startup company", dimensions: "Vector", colors: "Orange and Black", deadline: "2024-01-20", additional_info: "Need multiple variations", status: "in_progress", total_price: 150000, created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date().toISOString() },
                    // Mock data item 3
                    { id: 3, order_number: "JP1234567892", name: "Bob Wilson", email: "bob@example.com", phone: "08555666777", company: null, service: "social-media", package: "enterprise", title: "Instagram Templates", description: "Social media template set for restaurant", dimensions: "1080x1080", colors: "Food themed colors", deadline: "2024-01-10", additional_info: "Need 10 different templates", status: "completed", total_price: 82500, created_at: new Date(Date.now() - 172800000).toISOString(), updated_at: new Date().toISOString() },
                ],
                message: "Using mock data - database not configured",
            })
        }

        // 1. Kueri SELECT Supabase (menggantikan Kueri MySQL)
        const { data: orders, error: selectError } = await supabase
            .from('poster_orders') // Nama tabel di Supabase
            .select('*')
            .order('created_at', { ascending: false }); // Urutkan berdasarkan created_at

        if (selectError) {
            console.error("Supabase SELECT error:", selectError);
            return NextResponse.json({ success: false, message: `Gagal mengambil data pesanan: ${selectError.message}` }, { status: 500 })
        }

        return NextResponse.json({ success: true, orders })
    } catch (error) {
        console.error("Orders GET error (Supabase):", error)
        return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 })
    }
    // Block finally dihapus
}