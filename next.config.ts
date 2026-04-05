import type { NextConfig } from "next";

function mediaRemotePattern():
  | { protocol: "http" | "https"; hostname: string; port?: string; pathname: string }
  | null {
  const base =
    process.env.NEXT_PUBLIC_MEDIA_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/i, "")?.trim();
  if (!base) return null;
  try {
    const u = new URL(base);
    const protocol = u.protocol === "https:" ? "https" : "http";
    return {
      protocol,
      hostname: u.hostname,
      ...(u.port ? { port: u.port } : {}),
      pathname: "/**",
    };
  } catch {
    return null;
  }
}

const mediaPattern = mediaRemotePattern();

const nextConfig: NextConfig = {
  allowedDevOrigins: ["aldaftar.news", "*.aldaftar.news"],
  images: {
    remotePatterns: [
      ...(mediaPattern ? [mediaPattern] : []),
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "back.aldaftar.news",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
