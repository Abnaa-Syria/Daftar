"use client";

import { useState } from "react";
import type { Article } from "@/data";
import { getMostReadArticles, getLatestArticles, getSectionById, timeAgo } from "@/data";
import CardCarousel from "./CardCarousel";
import SectionHeaderBar from "./SectionHeaderBar";
import Link from "next/link";
import Image from "next/image";

export default function MostReadCarouselTabs() {
  const [tab, setTab] = useState<"day" | "week">("day");

  const dayArticles = getMostReadArticles(9);
  const weekArticles = getMostReadArticles(9).slice().sort((a, b) => {
    // simple variation: sort by publishedAt descending as a stand-in for weekly
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const current: Article[] = tab === "day" ? dayArticles : weekArticles;

  return (
    <section className="space-y-4">
      <SectionHeaderBar title="الأكثر قراءة" />

      <div className="flex items-center gap-2 mb-2">
        <button
          type="button"
          onClick={() => setTab("day")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
            tab === "day"
              ? "bg-crimson text-white border-crimson"
              : "bg-surface-alt dark:bg-surface-dark-alt text-text-secondary dark:text-text-dark-secondary border-border dark:border-border-dark"
          }`}
        >
          آخر ٢٤ ساعة
        </button>
        <button
          type="button"
          onClick={() => setTab("week")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
            tab === "week"
              ? "bg-crimson text-white border-crimson"
              : "bg-surface-alt dark:bg-surface-dark-alt text-text-secondary dark:text-text-dark-secondary border-border dark:border-border-dark"
          }`}
        >
          هذا الأسبوع
        </button>
      </div>

      <CardCarousel
        items={current.map((article) => (
          <MostReadCard key={article.id} article={article} />
        ))}
        itemsPerView={3}
        ariaLabel="الأكثر قراءة"
        autoPlay
      />
    </section>
  );
}

interface CardProps {
  article: Article;
}

function MostReadCard({ article }: CardProps) {
  const section = getSectionById(article.sectionId);

  return (
    <Link
      href={`/news/${article.slug}`}
      className="group block h-full rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark shadow-sm hover:shadow-lg overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[16/10]">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 260px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {section && (
          <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/60 text-[11px] font-bold text-white">
            {section.name}
          </span>
        )}
      </div>
      <div className="p-3 space-y-1.5">
        <h3 className="text-sm font-extrabold leading-snug line-clamp-2 group-hover:text-crimson transition-colors">
          {article.title}
        </h3>
        <p className="text-[11px] text-text-secondary dark:text-text-dark-secondary flex items-center gap-2">
          <span>{timeAgo(article.publishedAt)}</span>
          <span>•</span>
          <span>{article.readTime} دقائق قراءة</span>
        </p>
      </div>
    </Link>
  );
}

