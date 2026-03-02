 "use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, MouseEvent } from "react";
import { Infographic } from "@/data";
import SectionHeaderBar from "./SectionHeaderBar";

interface Props {
  items: Infographic[];
}

export default function InfographicCarouselStacked({ items }: Props) {
  if (!items.length) return null;

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const [isHovered, setIsHovered] = useState(false);

  const scrollByPage = (direction: 1 | -1) => {
    const container = scrollRef.current;
    if (!container) return;
    const { clientWidth, scrollWidth, scrollLeft } = container;
    const delta = direction * (clientWidth * 0.9);

    const nextLeft = scrollLeft + delta;

    if (nextLeft + clientWidth >= scrollWidth || nextLeft <= 0) {
      container.scrollTo({ left: direction === 1 ? 0 : scrollWidth, behavior: "smooth" });
      return;
    }

    container.scrollBy({ left: delta, behavior: "smooth" });
  };

  useEffect(() => {
    if (!items.length) return;
    if (isHovered) return;

    const id = window.setInterval(() => {
      scrollByPage(1);
    }, 7000);

    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, items.length]);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    scrollStartRef.current = container.scrollLeft;
    container.classList.add("cursor-grabbing");
  };

  const handleMouseUpOrLeave = () => {
    const container = scrollRef.current;
    isDraggingRef.current = false;
    container?.classList.remove("cursor-grabbing");
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container) return;
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const dx = e.clientX - dragStartXRef.current;
    container.scrollLeft = scrollStartRef.current - dx;
  };

  return (
    <section className="space-y-4">
      <SectionHeaderBar
        title="الانفو جراف"
        href="/section/infographic"
        accentColor="#00838f"
      />

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide cursor-grab select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            handleMouseUpOrLeave();
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUpOrLeave}
          onMouseMove={handleMouseMove}
        >
          {items.map((info, index) => (
            <Link
              key={info.id}
              href={`/infographic/${info.slug}`}
              className="group relative shrink-0 w-40 sm:w-48 md:w-56"
            >
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_18px_45px_rgba(0,0,0,0.35)] bg-surface dark:bg-surface-dark transition-transform group-hover:-translate-y-1">
                <div
                  className={`absolute inset-0 rounded-3xl border border-white/10 pointer-events-none ${
                    index % 2 === 0 ? "translate-y-1 translate-x-1" : "-translate-y-1 -translate-x-1"
                  } opacity-40`}
                />
                <Image
                  src={info.images[0]}
                  alt={info.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 60vw, 260px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                <div className="absolute bottom-3 right-3 left-3 space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-cyan-600/90 text-[11px] font-bold text-white">
                    إنفوجراف
                  </span>
                  <h3 className="text-sm font-extrabold text-white leading-snug line-clamp-2">
                    {info.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollByPage(1)}
          className="hidden md:flex absolute right-[-18px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface dark:bg-surface-dark shadow-lg border border-border dark:border-border-dark items-center justify-center text-navy dark:text-text-dark-primary hover:bg-crimson hover:text-white transition-colors"
          aria-label="التالي"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scrollByPage(-1)}
          className="hidden md:flex absolute left-[-18px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface dark:bg-surface-dark shadow-lg border border-border dark:border-border-dark items-center justify-center text-navy dark:text-text-dark-primary hover:bg-crimson hover:text-white transition-colors"
          aria-label="السابق"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
