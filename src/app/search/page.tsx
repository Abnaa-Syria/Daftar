"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { searchArticles, sections } from "@/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import NewsCard from "@/components/NewsCard";
import type { Article } from "@/data";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Article[]>([]);
  const [sectionFilter, setSectionFilter] = useState("");
  const [sortBy, setSortBy] = useState<"relevance" | "date" | "views">("relevance");

  useEffect(() => {
    if (query.trim()) {
      let filtered = searchArticles(query);
      if (sectionFilter) {
        filtered = filtered.filter((a) => a.sectionId === sectionFilter);
      }
      if (sortBy === "date") {
        filtered.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      } else if (sortBy === "views") {
        filtered.sort((a, b) => b.views - a.views);
      }
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query, sectionFilter, sortBy]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <h1 className="text-3xl font-extrabold mt-4 mb-6">البحث</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="اكتب كلمة البحث..."
            className="flex-1 px-5 py-3 rounded-xl bg-surface-alt dark:bg-surface-dark-alt border border-border dark:border-border-dark focus:outline-none focus:border-crimson text-lg"
            autoFocus
          />
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <label className="text-sm font-bold">القسم:</label>
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface-alt dark:bg-surface-dark-alt border border-border dark:border-border-dark text-sm"
          >
            <option value="">الكل</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-bold">ترتيب حسب:</label>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "relevance" | "date" | "views")
            }
            className="px-3 py-2 rounded-lg bg-surface-alt dark:bg-surface-dark-alt border border-border dark:border-border-dark text-sm"
          >
            <option value="relevance">الصلة</option>
            <option value="date">الأحدث</option>
            <option value="views">الأكثر مشاهدة</option>
          </select>
        </div>

        {query && (
          <span className="text-sm text-text-secondary dark:text-text-dark-secondary">
            {results.length} نتيجة
          </span>
        )}
      </div>

      {query && results.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-xl font-bold mb-2">لا توجد نتائج</p>
          <p className="text-text-secondary dark:text-text-dark-secondary">
            جرب كلمات بحث مختلفة
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {results.map((article) => (
          <NewsCard key={article.id} article={article} variant="compact" showSection />
        ))}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "بحث" }]} />
      <Suspense
        fallback={
          <div className="text-center py-20">
            <p className="text-xl">جارٍ التحميل...</p>
          </div>
        }
      >
        <SearchContent />
      </Suspense>
    </div>
  );
}
