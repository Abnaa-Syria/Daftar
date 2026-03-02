"use client";

import Link from "next/link";
import Image from "next/image";
import { sections } from "@/data";
import { series } from "@/data/series";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawerMenu({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-surface-dark shadow-2xl animate-slide-in-right overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border dark:border-border-dark bg-navy text-white">
          <Image
            src="/logo.png"
            alt="الدفتر مصر"
            width={100}
            height={40}
            className="h-8 w-auto"
          />
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="إغلاق"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="p-4">
          <DrawerLink href="/" label="الرئيسية" icon="🏠" onClose={onClose} />
          <DrawerLink href="/breaking" label="عاجل" icon="🔴" onClose={onClose} />

          <div className="mt-4 mb-2 text-xs font-bold text-text-secondary dark:text-text-dark-secondary uppercase">
            الأقسام
          </div>

          {sections.map((section) => (
            <DrawerLink
              key={section.slug}
              href={`/section/${section.slug}`}
              label={section.name}
              color={section.color}
              onClose={onClose}
            />
          ))}

          <div className="mt-4 mb-2 text-xs font-bold text-text-secondary dark:text-text-dark-secondary uppercase">
            سلاسل المزيد
          </div>

          {series.map((s) => (
            <DrawerLink
              key={s.slug}
              href={`/series/${s.slug}`}
              label={s.name}
              onClose={onClose}
            />
          ))}

          <div className="mt-6 pt-4 border-t border-border dark:border-border-dark">
            <DrawerLink href="/about" label="عن الدفتر" onClose={onClose} />
            <DrawerLink href="/editorial-policy" label="السياسة التحريرية" onClose={onClose} />
            <DrawerLink href="/contact" label="تواصل معنا" onClose={onClose} />
            <DrawerLink href="/privacy" label="سياسة الخصوصية" onClose={onClose} />
            <DrawerLink href="/terms" label="شروط الاستخدام" onClose={onClose} />
          </div>
        </nav>
      </div>
    </div>
  );
}

function DrawerLink({
  href,
  label,
  icon,
  color,
  onClose,
}: {
  href: string;
  label: string;
  icon?: string;
  color?: string;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-primary dark:text-text-dark-primary hover:bg-surface-alt dark:hover:bg-surface-dark-alt transition-colors"
    >
      {icon && <span className="text-lg">{icon}</span>}
      {color && (
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
      )}
      <span className="font-bold text-sm">{label}</span>
    </Link>
  );
}
