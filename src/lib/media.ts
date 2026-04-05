/**
 * CMS uploads live on the API origin (/uploads/...). Next.js image optimization
 * resolves relative URLs against the Next app only, so /uploads paths must be
 * turned into absolute URLs that remotePatterns allow.
 */
export function getMediaOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_MEDIA_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const api = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").trim();
  const base = api.replace(/\/api\/?$/i, "");
  return base || "http://localhost:5000";
}

export function resolveMediaSrc(path: string | null | undefined, fallback = "/logo.png"): string {
  if (path == null || path === "") return fallback;
  const p = path.trim();
  if (!p) return fallback;
  if (/^https?:\/\//i.test(p)) return p;
  if (p.startsWith("/uploads")) {
    return `${getMediaOrigin()}${p}`;
  }
  return p;
}
