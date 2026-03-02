"use client";

import { useEffect, useRef, useState, TouchEvent } from "react";

interface CardCarouselProps {
  items: React.ReactNode[];
  itemsPerView?: number;
  ariaLabel?: string;
  autoPlay?: boolean;
  autoPlayIntervalMs?: number;
}

export default function CardCarousel({
  items,
  itemsPerView = 3,
  ariaLabel,
  autoPlay = false,
  autoPlayIntervalMs = 7000,
}: CardCarouselProps) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerView));

  const goTo = (page: number) => {
    const safe = ((page % totalPages) + totalPages) % totalPages;
    setIndex(safe);
  };

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  useEffect(() => {
    if (!autoPlay || totalPages <= 1) return;
    if (isHovered) return;
    const id = window.setInterval(next, autoPlayIntervalMs);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, autoPlayIntervalMs, index, isHovered, totalPages]);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current == null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 40;
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        // swipe right (previous in RTL)
        prev();
      } else {
        // swipe left (next)
        next();
      }
    }
    touchStartX.current = null;
  };

  const start = index * itemsPerView;
  const visible = items.slice(start, start + itemsPerView);

  return (
    <div
      className="relative"
      aria-label={ariaLabel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((item, i) => (
          <div key={start + i} className="h-full">
            {item}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <>
          <button
            type="button"
            onClick={next}
            className="hidden md:flex absolute right-[-18px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface dark:bg-surface-dark shadow-lg border border-border dark:border-border-dark items-center justify-center text-navy dark:text-text-dark-primary hover:bg-crimson hover:text-white transition-colors"
            aria-label="التالي"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={prev}
            className="hidden md:flex absolute left-[-18px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface dark:bg-surface-dark shadow-lg border border-border dark:border-border-dark items-center justify-center text-navy dark:text-text-dark-primary hover:bg-crimson hover:text-white transition-colors"
            aria-label="السابق"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center justify-center gap-1 mt-4">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === index ? "bg-crimson w-5" : "bg-border dark:bg-border-dark"
                }`}
                aria-label={`الصفحة ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

