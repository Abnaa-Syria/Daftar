"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import MobileDrawerMenu from "./MobileDrawerMenu";

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();

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
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="الدفتر مصر"
                width={120}
                height={48}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="تبديل المظهر"
              >
                {theme === "light" ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>

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
              <NavLink href="/section/events-today" label="أحداث اليوم" />
              <NavLink href="/section/country-affairs" label="شؤون البلد" />
              <NavLink href="/section/market-movement" label="حركة السوق" />
              <NavLink href="/section/style-stars" label="ستايل ونجوم" />
              <NavLink href="/section/inside-goal" label="جوّه الجون" />
              <NavLink href="/section/egypt-reality" label="الواقع المصري" />
              <NavLink href="/section/special-file" label="ملف خاص" />
              <NavLink href="/section/infographic" label="الانفو جراف" />
              <NavLink href="/section/people-street" label="الناس والشارع" />
            </div>
          </div>
        </nav>
      </header>

      <MobileDrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
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
