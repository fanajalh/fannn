const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateFrameSlug(slug: string): boolean {
  const s = slug.trim();
  return s.length >= 1 && s.length <= 64 && SLUG_RE.test(s);
}

/** URL gambar: https di production, http hanya dev; path situs `/...` diperbolehkan. */
export function validateFrameImageUrl(url: string): boolean {
  const t = url.trim();
  if (t.length === 0 || t.length > 2048) return false;
  if (t.startsWith("/") && !t.startsWith("//")) return true;
  try {
    const u = new URL(t);
    if (u.protocol === "https:") return true;
    if (process.env.NODE_ENV !== "production" && u.protocol === "http:") return true;
    return false;
  } catch {
    return false;
  }
}
