"use client";

import { useState, useEffect } from "react";

interface Props {
  articleId: string;
}

export default function BookmarkButton({ articleId }: Props) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("al-daftar-bookmarks") || "[]");
    setBookmarked(stored.includes(articleId));
  }, [articleId]);

  const toggle = () => {
    const stored: string[] = JSON.parse(
      localStorage.getItem("al-daftar-bookmarks") || "[]"
    );
    let updated: string[];
    if (stored.includes(articleId)) {
      updated = stored.filter((id) => id !== articleId);
    } else {
      updated = [...stored, articleId];
    }
    localStorage.setItem("al-daftar-bookmarks", JSON.stringify(updated));
    setBookmarked(!bookmarked);
  };

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
        bookmarked
          ? "bg-gold/20 text-gold-light border border-gold/30"
          : "bg-surface-alt dark:bg-surface-dark-alt text-text-secondary dark:text-text-dark-secondary hover:bg-gold/10"
      }`}
      aria-label={bookmarked ? "إزالة من المحفوظات" : "حفظ للقراءة لاحقاً"}
    >
      <svg
        className="w-5 h-5"
        fill={bookmarked ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
      {bookmarked ? "تم الحفظ" : "حفظ"}
    </button>
  );
}
