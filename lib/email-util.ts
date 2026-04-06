import nodemailer from "nodemailer";

// ----------------------------------------------------
// KONFIGURASI NODEMAILER
// ----------------------------------------------------
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || "465"),
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ----------------------------------------------------
// VALIDASI ENV
// ----------------------------------------------------
function checkCredentials() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER atau EMAIL_PASS belum diatur di .env");
  }
}

// ----------------------------------------------------
// FUNGSI GENERIC KIRIM EMAIL
// ----------------------------------------------------
export async function sendSuggestionEmail(options: nodemailer.SendMailOptions) {
  checkCredentials();
  const info = await transporter.sendMail(options);
  return { success: true, messageId: info.messageId };
}

// ----------------------------------------------------
// TEMPLATE EMAIL — ADMIN NOTIF SARAN BARU
// ----------------------------------------------------
export function adminNewSuggestionTemplate(data: any) {
  const admin = process.env.EMAIL_USER!;

  return {
    from: `"Sistem Saran" <${admin}>`,
    to: admin,
    subject: `🛎️ Saran Baru Masuk — ${data.kategori}`,
    html: `
      <div style="font-family: Arial; padding:20px;">
        <h2>🛎️ Saran Baru Masuk</h2>
        <p><strong>${data.nama}</strong> mengirimkan saran:</p>

        <table>
          <tr><td><strong>Email:</strong></td><td>${data.user_email}</td></tr>
          <tr><td><strong>Kategori:</strong></td><td>${data.kategori}</td></tr>
        </table>

        <h3>Saran:</h3>
        <blockquote>${data.saran}</blockquote>
      </div>
    `,
  };
}

// ----------------------------------------------------
// TEMPLATE EMAIL — USER NOTIF SARAN DIJAWAB
// ----------------------------------------------------
export function otpLoginEmailTemplate(code: string) {
  const admin = process.env.EMAIL_USER!;
  return {
    from: `"Fanajah" <${admin}>`,
    subject: "Kode verifikasi login",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 480px;">
        <h2 style="margin: 0 0 16px;">Kode verifikasi</h2>
        <p style="color: #444;">Gunakan kode berikut untuk menyelesaikan login. Kode berlaku sekitar 10 menit.</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #111;">${code}</p>
        <p style="color: #888; font-size: 12px;">Jika Anda tidak meminta kode ini, abaikan email ini.</p>
      </div>
    `,
  };
}

export function otpResetPasswordEmailTemplate(code: string) {
  const admin = process.env.EMAIL_USER!;
  return {
    from: `"Fanajah" <${admin}>`,
    subject: "Kode reset password",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 480px;">
        <h2 style="margin: 0 0 16px;">Reset password</h2>
        <p style="color: #444;">Gunakan kode berikut untuk mengatur ulang password. Kode berlaku sekitar 10 menit.</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #111;">${code}</p>
        <p style="color: #888; font-size: 12px;">Jika Anda tidak meminta reset, abaikan email ini.</p>
      </div>
    `,
  };
}

export function userUpdateNotificationTemplate(data: any) {
  const admin = process.env.EMAIL_USER!;

  return {
    from: `"Admin Sistem" <${admin}>`,
    to: data.user_email,
    subject: "📌 Saran Kamu Telah Dijawab",
    html: `
      <div style="font-family: Arial; padding:20px;">
        <h2>📌 Saran Kamu Telah Dibalas</h2>

        <p>Halo <strong>${data.nama}</strong>,</p>

        <h3>Balasan Admin:</h3>
        <blockquote style="background:#eef; padding:10px;">
          ${data.response}
        </blockquote>

        <h3>Saran Kamu:</h3>
        <blockquote style="background:#f4f4f4; padding:10px;">
          ${data.saran}
        </blockquote>

        <p style="color:gray;font-size:12px;">Email otomatis, jangan dibalas.</p>
      </div>
    `,
  };
}
