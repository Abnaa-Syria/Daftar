"use client";

import { useEffect, useRef, useState, TouchEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/data";
import { getAuthorById, timeAgo, getSectionById } from "@/data";

interface Props {
  articles: Article[];
  title?: string;
}

export default function HomeHeroWithThumbStrip({ articles, title = "أهم الأخبار" }: Props) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const visibleArticles = articles.slice(0, 8);

  const next = () => {
    setCurrent((prev) => (prev + 1) % visibleArticles.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + visibleArticles.length) % visibleArticles.length);
  };

  useEffect(() => {
    if (visibleArticles.length <= 1) return;
    if (isHovered) return;
    const id = window.setInterval(next, 7000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, visibleArticles.length]);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current == null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 50;
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        prev();
      } else {
        next();
      }
    }
    touchStartX.current = null;
  };

  if (!visibleArticles.length) return null;

  const active = visibleArticles[current];
  const author = getAuthorById(active.authorId);
  const section = getSectionById(active.sectionId);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-extrabold flex items-center gap-2">
          <span className="inline-block w-1.5 h-7 rounded-full bg-crimson" />
          {title}
        </h1>
        {section && (
          <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-alt dark:bg-surface-dark-alt text-xs font-bold text-text-secondary dark:text-text-dark-secondary">
            من قسم{" "}
            <span className="text-crimson">{section.name}</span>
          </span>
        )}
      </div>

      <div
        className="relative rounded-3xl overflow-hidden bg-black/50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[16/5]">
          {visibleArticles.map((article, i) => (
            <div
              key={article.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === current ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-8 pb-12 sm:pb-12 md:pb-8 flex flex-col gap-2.5 sm:gap-3 md:gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-white/80">
              {active.isBreaking && (
                <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-[11px] font-bold">
                  عاجل
                </span>
              )}
              {active.isExclusive && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-[11px] font-bold">
                  حصري
                </span>
              )}
              {active.isAnalysis && (
                <span className="px-2.5 py-0.5 rounded-full bg-sky-600 text-[11px] font-bold">
                  تحليل
                </span>
              )}
              {section && (
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[11px] font-bold">
                  {section.name}
                </span>
              )}
            </div>

            <Link href={`/news/${active.slug}`}>
              <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold leading-tight text-white mb-1 line-clamp-2 hover:underline">
                {active.title}
              </h2>
            </Link>

            <p className="hidden sm:block text-sm md:text-base text-white/80 max-w-2xl line-clamp-2">
              {active.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
              {author && <span>{author.name}</span>}
              <span>•</span>
              <span>{timeAgo(active.publishedAt)}</span>
              <span>•</span>
              <span>{active.readTime} دقائق قراءة</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Link
                href={`/news/${active.slug}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-crimson text-white text-[13px] sm:text-sm font-bold hover:bg-crimson-light transition-colors"
              >
                اقرأ الآن
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <button
                type="button"
                onClick={prev}
                className="hidden md:inline-flex w-9 h-9 rounded-full bg-white/10 text-white items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="السابق"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={next}
                className="hidden md:inline-flex w-9 h-9 rounded-full bg-white/10 text-white items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="التالي"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {visibleArticles.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full border border-white/50 transition-all ${
                i === current ? "bg-white w-5" : "bg-white/20"
              }`}
              aria-label={`الخبر رقم ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {visibleArticles.map((article, i) => (
          <button
            key={article.id}
            type="button"
            onClick={() => setCurrent(i)}
            className={`flex gap-2 rounded-xl border text-right overflow-hidden group transition-colors ${
              i === current
                ? "border-crimson bg-surface-alt dark:bg-surface-dark-alt"
                : "border-border dark:border-border-dark bg-surface dark:bg-surface-dark hover:border-crimson/70"
            }`}
          >
            <div className="relative w-16 h-16 shrink-0">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="flex-1 p-2 min-w-0">
              <p className="text-[11px] font-bold line-clamp-2 group-hover:text-crimson">
                {article.title}
              </p>
              <span className="text-[10px] text-text-secondary dark:text-text-dark-secondary">
                {timeAgo(article.publishedAt)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

