import { type NextRequest, NextResponse } from "next/server";
import nodemailer from 'nodemailer'; // Pustaka Nodemailer

// ----------------------------------------------------
// KONFIGURASI NODEMAILER
// ----------------------------------------------------

// Transporter menggunakan kredensial dari environment variables (.env.local)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    // Gunakan 'true' untuk port 465 (SSL/TLS), 'false' untuk port lain (587, 2525)
    secure: process.env.EMAIL_PORT === '465', 
    auth: {
        user: process.env.EMAIL_USER, // Email Pengirim (contoh: muhammadfachriarfan7@gmail.com)
        pass: process.env.EMAIL_PASS, // App Password Gmail atau SMTP Password
    },
});

export async function POST(request: NextRequest) {
    try {
        const data = await request.json(); 
        const { name, email, phone, message } = data;

        // 1. Validasi Data Dasar
        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, message: "Data Nama, Email, dan Pesan harus diisi." }, 
                { status: 400 }
            );
        }
        
        // Cek jika kredensial email belum terkonfigurasi
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
             console.error("Nodemailer: Email credentials not configured. Cannot send email.");
             return NextResponse.json(
                { success: false, message: "Server error: Konfigurasi pengiriman email hilang." }, 
                { status: 500 }
            );
        }

        // 2. Siapkan Konten Email (HTML)
        const emailContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            
            <div style="background-color: #ff9d00ff; color: #ffffff; padding: 25px 30px; text-align: center; border-bottom: 4px solid #af531eff;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 600;">🔔 Notifikasi Kontak Baru</h1>
                <p style="margin: 5px 0 0; font-size: 14px;">Dari Formulir Kontak JokiPoster</p>
            </div>

            <div style="padding: 30px;">
                <p style="font-size: 16px; margin-top: 0;">Halo Admin,</p>
                <p style="font-size: 16px;">Anda baru saja menerima pesan masuk baru dari pengunjung situs:</p>
                
                <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 25px; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <tr>
                        <td style="padding: 12px; width: 30%; background-color: #f9fafb; border-right: 1px solid #e5e7eb; border-top-left-radius: 8px;"><strong>Nama</strong></td>
                        <td style="padding: 12px; border-top-right-radius: 8px;">${name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; width: 30%; background-color: #f9fafb; border-right: 1px solid #e5e7eb;"><strong>Email</strong></td>
                        <td style="padding: 12px;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; width: 30%; background-color: #f9fafb; border-right: 1px solid #e5e7eb; border-bottom-left-radius: 8px;"><strong>Phone</strong></td>
                        <td style="padding: 12px; border-bottom-right-radius: 8px;">${phone || 'Tidak Diisi'}</td>
                    </tr>
                </table>

                <h3 style="color: #1f2937; margin-top: 35px; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Isi Pesan:</h3>
                <div style="white-space: pre-wrap; padding: 15px; background-color: #eff6ff; border-left: 5px solid #3b82f6; border-radius: 4px; font-style: italic; color: #1e40af;">
                    ${message}
                </div>

                <p style="margin-top: 30px; font-size: 14px; color: #4b5563;">Harap segera tindak lanjuti pesan ini.</p>
            </div>

            <div style="background-color: #e5e7eb; padding: 15px 30px; text-align: center; font-size: 11px; color: #6b7280; border-top: 1px solid #d1d5db;">
                Ini adalah notifikasi otomatis dari sistem fan ajalah JokiPoster.
            </div>
        </div>
    </div>
`;

        // 3. Opsi Email
        const mailOptions = {
            from: `"JokiPoster Contact" <${process.env.EMAIL_USER}>`, // Alamat pengirim (EMAIL_USER)
            to: process.env.EMAIL_USER, // Kirim ke alamat admin/pengirim
            replyTo: email, // Setel agar Admin bisa langsung Reply ke email pelanggan
            subject: `Pesan Kontak Baru dari ${name}`,
            html: emailContent,
        };

        // 4. Kirim Email melalui Nodemailer
        console.log("Sending email notification via Nodemailer...");
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: %s", info.messageId);

        // 5. Respons Sukses
        return NextResponse.json({ 
            success: true, 
            message: "Pesan Anda berhasil dikirim! Kami akan segera merespons.",
        });

    } catch (error) {
        console.error("Internal Server Error (Nodemailer):", error);
        
        // Tambahkan detail error untuk debugging (HANYA untuk developer)
        let errorMessage = "Terjadi kesalahan server internal saat mengirim email.";
        if (error instanceof Error) {
            errorMessage += ` Detail: ${error.message}`;
        }
        
        return NextResponse.json(
            { success: false, message: errorMessage }, 
            { status: 500 }
        );
    }
}