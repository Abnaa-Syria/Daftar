"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  title?: string;
}

export default function Carousel({ images, title }: Props) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((p) => (p + 1) % images.length);
  const prev = () => setCurrent((p) => (p - 1 + images.length) % images.length);

  return (
    <div className="relative">
      <div className="relative aspect-[3/4] md:aspect-[4/5] rounded-xl overflow-hidden bg-surface-alt dark:bg-surface-dark-alt">
        {images.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-500 ${
              i === current ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Image
              src={img}
              alt={title ? `${title} - ${i + 1}` : `صورة ${i + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>
        ))}

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          aria-label="السابق"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          aria-label="التالي"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Dots + Counter */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <span className="text-sm text-text-secondary dark:text-text-dark-secondary">
          {current + 1} / {images.length}
        </span>
        <div className="flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === current ? "bg-crimson w-5" : "bg-border dark:bg-border-dark"
              }`}
              aria-label={`صورة ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
