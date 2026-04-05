"use client";

import type { SocialKey } from "@/lib/social";
import { SOCIAL_LINKS } from "@/lib/social";

import { siFacebook, siInstagram, siTiktok, siThreads, siX, siYoutube } from "simple-icons/icons";

const ICONS: Record<SocialKey, { path: string }> = {
  facebook: { path: siFacebook.path },
  instagram: { path: siInstagram.path },
  tiktok: { path: siTiktok.path },
  threads: { path: siThreads.path },
  x: { path: siX.path },
  youtube: { path: siYoutube.path },
};

export default function SocialLinks({
  keys = ["facebook", "instagram", "tiktok", "threads", "x", "youtube"],
  className = "flex items-center gap-3",
}: {
  keys?: SocialKey[];
  className?: string;
}) {
  return (
    <div className={className}>
      {keys.map((k) => (
        <a
          key={k}
          href={SOCIAL_LINKS[k].url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={SOCIAL_LINKS[k].label}
          className="inline-flex shrink-0 items-center justify-center w-11 h-11 rounded-2xl bg-white/5 border border-white/10 text-white/90 hover:text-white hover:bg-white/10 hover:border-white/20 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={ICONS[k].path} />
          </svg>
        </a>
      ))}
    </div>
  );
}

