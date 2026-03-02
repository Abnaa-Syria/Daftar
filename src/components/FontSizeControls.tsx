"use client";

import { useState, useEffect } from "react";

const sizes = ["sm", "md", "lg"] as const;
type FontSize = (typeof sizes)[number];

const labels: Record<FontSize, string> = {
  sm: "ص",
  md: "م",
  lg: "ك",
};

export default function FontSizeControls() {
  const [fontSize, setFontSize] = useState<FontSize>("md");

  useEffect(() => {
    const stored = localStorage.getItem("al-daftar-fontsize") as FontSize | null;
    if (stored && sizes.includes(stored)) {
      setFontSize(stored);
    }
  }, []);

  const change = (size: FontSize) => {
    setFontSize(size);
    localStorage.setItem("al-daftar-fontsize", size);
    document.documentElement.className = document.documentElement.className
      .replace(/font-size-\w+/g, "")
      .trim();
    document.documentElement.classList.add(`font-size-${size}`);
  };

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-text-secondary dark:text-text-dark-secondary ml-2">
        حجم الخط:
      </span>
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => change(size)}
          className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold transition-colors ${
            fontSize === size
              ? "bg-navy text-white dark:bg-crimson"
              : "bg-surface-alt dark:bg-surface-dark-alt text-text-secondary dark:text-text-dark-secondary hover:bg-navy/10"
          }`}
          style={{ fontSize: size === "sm" ? 12 : size === "md" ? 14 : 17 }}
          aria-label={`حجم الخط ${labels[size]}`}
        >
          {labels[size]}
        </button>
      ))}
    </div>
  );
}
