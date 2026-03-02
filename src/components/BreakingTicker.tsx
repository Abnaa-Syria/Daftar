"use client";

import Link from "next/link";
import type { BreakingItem } from "@/data";

interface Props {
  items: BreakingItem[];
}

export default function BreakingTicker({ items }: Props) {
  if (!items.length) return null;

  return (
    <div className="bg-crimson text-white overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center">
        <div className="shrink-0 bg-crimson-dark px-4 py-2 font-extrabold text-sm z-10">
          عاجل
        </div>
        <div className="flex-1 overflow-hidden py-2">
          <div className="animate-ticker whitespace-nowrap text-sm font-bold">
            {items.map((item) => (
              <span key={item.id} className="mx-4 inline">
                {item.articleSlug ? (
                  <Link
                    href={`/news/${item.articleSlug}`}
                    className="hover:underline"
                  >
                    {item.text}
                  </Link>
                ) : (
                  item.text
                )}
                <span className="mx-3 text-white/50">◆</span>
              </span>
            ))}
          </div>
        </div>
        <Link
          href="/breaking"
          className="shrink-0 px-4 py-2 text-xs font-bold hover:bg-crimson-dark transition-colors"
        >
          عرض كل العاجل
        </Link>
      </div>
    </div>
  );
}
