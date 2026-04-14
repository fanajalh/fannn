import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, image } = await req.json();

    if (!email || !image) {
      return NextResponse.json({ error: "Email dan gambar harus diisi" }, { status: 400 });
    }

    // 1. Setup Transporter (Penghubung ke Gmail kamu)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Email fanajah kamu
        pass: process.env.EMAIL_PASS, // Password Aplikasi Gmail (bukan password login biasa)
      },
    });

    // 2. Pisahkan header base64 dari datanya
    // Gambar dari canvas bentuknya: "data:image/png;base64,iVBORw0KGgo..."
    const base64Data = image.split(";base64,").pop();

    // 3. Konfigurasi isi Email
    const mailOptions = {
      from: `"Fanajah Studio" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "📸 Ini dia hasil fotomu dari Fanajah Photobooth!",
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; text-align: center;">
            <h2 style="color: #f97316;">Terima kasih sudah berfoto! 🎉</h2>
            <p style="color: #475569;">Berikut adalah hasil keseruanmu di Fanajah Studio. Fotonya sudah kami lampirkan di email ini, jangan lupa di-download ya!</p>
            <br/>
            <p style="font-size: 12px; color: #94a3b8;">Dibuat dengan ❤️ oleh Fanajah ID</p>
        </div>
      `,
      attachments: [
        {
          filename: `Fanajah-Snap-${Date.now()}.png`,
          content: base64Data,
          encoding: "base64",
        },
      ],
    };

    // 4. Kirim Email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email berhasil dikirim!" }, { status: 200 });
    
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Gagal mengirim email" }, { status: 500 });
  }
}