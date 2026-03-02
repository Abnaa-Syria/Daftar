"use client";

import { useState } from "react";
import Link from "next/link";
import { getMostReadArticles, getLatestArticles, timeAgo } from "@/data";

const tabs = [
  { id: "most-read", label: "الأكثر قراءة" },
  { id: "latest", label: "الأحدث" },
];

export default function TabsMostRead() {
  const [activeTab, setActiveTab] = useState("most-read");

  const articles =
    activeTab === "most-read"
      ? getMostReadArticles(8)
      : getLatestArticles(8);

  return (
    <div className="bg-surface-alt dark:bg-surface-dark-alt rounded-xl p-5">
      <div className="flex gap-1 mb-5 bg-white dark:bg-surface-dark rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-colors ${
              activeTab === tab.id
                ? "bg-crimson text-white"
                : "text-text-secondary dark:text-text-dark-secondary hover:bg-surface-alt dark:hover:bg-surface-dark-alt"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {articles.map((article, index) => (
          <Link
            key={article.id}
            href={`/news/${article.slug}`}
            className="flex items-start gap-3 group"
          >
            <span className="shrink-0 w-8 h-8 rounded-full bg-navy dark:bg-navy-light text-white flex items-center justify-center text-sm font-bold">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm leading-snug line-clamp-2 group-hover:text-crimson transition-colors">
                {article.title}
              </h4>
              <span className="text-xs text-text-secondary dark:text-text-dark-secondary mt-1 block">
                {timeAgo(article.publishedAt)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
