"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import MobileDrawerMenu from "./MobileDrawerMenu";
import type { Section } from "@/types/content";

export default function Header({
  sections = [],
  supervisorName,
  editorInChiefName,
}: {
  sections?: Section[];
  supervisorName?: string;
  editorInChiefName?: string;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-navy dark:bg-navy-dark shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Menu Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="القائمة"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="الدفتر مصر"
                width={120}
                height={48}
                className="h-10 w-auto"
                priority
              />
              {/* Desktop-only editorial names (mobile gets its own stacked row below) */}
              <div className="hidden md:block text-right leading-tight text-white">
                <p className="text-xs font-semibold text-white/90">
                  المشرف العام {supervisorName || "عبدالرحمن الناصري"}
                </p>
                <p className="text-xs font-semibold text-white/80 mt-0.5">
                  رئيس التحرير {editorInChiefName || "محمد مجلى"}
                </p>
              </div>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="بحث"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile editorial names: two separated side-by-side columns */}
        <div className="md:hidden border-t border-white/10 bg-navy dark:bg-navy-dark">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="grid grid-cols-2 gap-4 text-white">
              <div className="text-center leading-tight">
                <p className="text-[11px] font-semibold text-white/80">المشرف العام</p>
                <p className="text-[12px] font-bold text-white mt-0.5">
                  {supervisorName || "عبدالرحمن الناصري"}
                </p>
              </div>
              <div className="text-center leading-tight">
                <p className="text-[11px] font-semibold text-white/80">رئيس التحرير</p>
                <p className="text-[12px] font-bold text-white mt-0.5">
                  {editorInChiefName || "محمد مجلى"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-white/10 bg-navy-light dark:bg-navy-dark animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في الدفتر..."
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white/40"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-crimson text-white rounded-lg hover:bg-crimson-light transition-colors"
                >
                  بحث
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Navigation Bar */}
        <nav className="border-t border-white/10 bg-navy-light dark:bg-navy-dark overflow-x-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-1 py-2 whitespace-nowrap">
              <NavLink href="/" label="الرئيسية" />
              <NavLink href="/breaking" label="عاجل" highlight />
              {sections.map((section) => (
                <NavLink key={section.slug} href={`/section/${section.slug}`} label={section.name} />
              ))}
            </div>
          </div>
        </nav>
      </header>

      <MobileDrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} sections={sections} />
    </>
  );
}

function NavLink({ href, label, highlight }: { href: string; label: string; highlight?: boolean }) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${
        highlight
          ? "bg-crimson text-white hover:bg-crimson-light"
          : "text-white/80 hover:text-white hover:bg-white/10"
      }`}
    >
      {label}
    </Link>
  );
}
