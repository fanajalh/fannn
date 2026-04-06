import crypto from "crypto";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";

export type OtpPurpose = "login" | "reset_password" | "register_login";

const DUMMY_HASH =
  "$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6LrujpiIeDUzmO6K";

const OTP_EXPIRY_MIN = 10;
const SEND_WINDOW_MIN = 15;
const MAX_SENDS_PER_WINDOW = 3;
const MAX_SENDS_IP_PER_WINDOW = 25;
const MAX_OTP_ATTEMPTS = 5;

export async function dummyPasswordWork(password: string) {
  await bcrypt.compare(password, DUMMY_HASH);
}

export function generateSixDigitOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

export function generateRegisterToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function assertSendRateOk(
  email: string,
  purpose: OtpPurpose,
  ip: string | null
) {
  const sql = getDb();
  const since = new Date(Date.now() - SEND_WINDOW_MIN * 60 * 1000);

  const emailCount = await sql`
    SELECT COUNT(*)::int AS c FROM otp_send_log
    WHERE email = ${email} AND purpose = ${purpose} AND created_at > ${since.toISOString()}
  `;
  if ((emailCount[0] as { c: number }).c >= MAX_SENDS_PER_WINDOW) {
    throw new Error("RATE_LIMIT");
  }

  if (ip) {
    const ipCount = await sql`
      SELECT COUNT(*)::int AS c FROM otp_send_log
      WHERE ip = ${ip} AND created_at > ${since.toISOString()}
    `;
    if ((ipCount[0] as { c: number }).c >= MAX_SENDS_IP_PER_WINDOW) {
      throw new Error("RATE_LIMIT");
    }
  }
}

export async function logOtpSend(
  email: string,
  purpose: OtpPurpose,
  ip: string | null
) {
  const sql = getDb();
  await sql`
    INSERT INTO otp_send_log (email, purpose, ip)
    VALUES (${email}, ${purpose}, ${ip})
  `;
}

export async function invalidatePendingOtps(email: string, purpose: OtpPurpose) {
  const sql = getDb();
  await sql`
    UPDATE email_otps
    SET consumed_at = NOW()
    WHERE email = ${email} AND purpose = ${purpose} AND consumed_at IS NULL
  `;
}

export async function createOtpRow(
  email: string,
  purpose: OtpPurpose,
  plainCode: string
) {
  const sql = getDb();
  const codeHash = await bcrypt.hash(plainCode, 10);
  const expires = new Date(Date.now() + OTP_EXPIRY_MIN * 60 * 1000);
  await invalidatePendingOtps(email, purpose);
  await sql`
    INSERT INTO email_otps (email, code_hash, purpose, expires_at)
    VALUES (${email}, ${codeHash}, ${purpose}, ${expires.toISOString()})
  `;
}

export async function verifyAndConsumeOtp(
  email: string,
  plainCode: string,
  mode: "login" | "reset_password"
): Promise<boolean> {
  const sql = getDb();
  const rows =
    mode === "login"
      ? await sql`
          SELECT id, code_hash, attempt_count FROM email_otps
          WHERE email = ${email}
            AND purpose IN ('login', 'register_login')
            AND consumed_at IS NULL
            AND expires_at > NOW()
          ORDER BY created_at DESC
          LIMIT 1
        `
      : await sql`
          SELECT id, code_hash, attempt_count FROM email_otps
          WHERE email = ${email}
            AND purpose = 'reset_password'
            AND consumed_at IS NULL
            AND expires_at > NOW()
          ORDER BY created_at DESC
          LIMIT 1
        `;

  if (rows.length === 0) return false;

  const row = rows[0] as { id: number; code_hash: string; attempt_count: number };
  const match = await bcrypt.compare(plainCode, row.code_hash);
  if (match) {
    await sql`
      UPDATE email_otps SET consumed_at = NOW() WHERE id = ${row.id}
    `;
    return true;
  }
  const next = row.attempt_count + 1;
  if (next >= MAX_OTP_ATTEMPTS) {
    await sql`
      UPDATE email_otps SET attempt_count = ${next}, consumed_at = NOW() WHERE id = ${row.id}
    `;
  } else {
    await sql`
      UPDATE email_otps SET attempt_count = ${next} WHERE id = ${row.id}
    `;
  }
  return false;
}
