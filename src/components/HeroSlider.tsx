"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Article, getAuthorById, getSectionById, timeAgo } from "@/data";

interface Props {
  articles: Article[];
}

export default function HeroSlider({ articles }: Props) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % articles.length);
  }, [articles.length]);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + articles.length) % articles.length);
  }, [articles.length]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  if (!articles.length) return null;

  const article = articles[current];
  const author = getAuthorById(article.authorId);
  const section = getSectionById(article.sectionId);

  return (
    <div className="relative aspect-[16/7] md:aspect-[16/6] rounded-2xl overflow-hidden group">
      {articles.map((a, i) => (
        <div
          key={a.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={a.image}
            alt={a.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority={i === 0}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      <div className="absolute bottom-0 right-0 left-0 p-6 md:p-10">
        {section && (
          <span
            className="inline-block px-3 py-1 rounded-md text-xs font-bold text-white mb-3"
            style={{ backgroundColor: section.color }}
          >
            {section.name}
          </span>
        )}
        <Link href={`/news/${article.slug}`}>
          <h2 className="text-white text-2xl md:text-4xl font-extrabold leading-tight mb-3 hover:underline line-clamp-2">
            {article.title}
          </h2>
        </Link>
        <p className="text-white/80 text-sm md:text-base line-clamp-2 mb-3 max-w-3xl">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-3 text-white/60 text-sm">
          {author && <span>{author.name}</span>}
          <span>•</span>
          <span>{timeAgo(article.publishedAt)}</span>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="السابق"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="التالي"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {articles.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? "bg-white w-6" : "bg-white/40"
            }`}
            aria-label={`الشريحة ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
