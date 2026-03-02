import { breakingItems, getArticleBySlug, formatDate, formatTime } from "@/data";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = { title: "عاجل - الدفتر" };

export default function BreakingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "عاجل" }]} />

      <div className="flex items-center gap-3 mb-8">
        <span className="w-3 h-3 rounded-full bg-crimson animate-pulse" />
        <h1 className="text-3xl font-extrabold">أخبار عاجلة</h1>
      </div>

      <div className="space-y-0">
        {breakingItems.map((item, index) => (
          <div
            key={item.id}
            className="relative pr-8 pb-8 border-r-2 border-crimson/30 last:pb-0"
          >
            {/* Timeline dot */}
            <div className="absolute -right-[9px] top-0 w-4 h-4 rounded-full bg-crimson border-2 border-white dark:border-surface-dark" />

            <div className="bg-white dark:bg-surface-dark-alt rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-xs text-text-secondary dark:text-text-dark-secondary">
                <span>{formatDate(item.timestamp)}</span>
                <span>•</span>
                <span>{formatTime(item.timestamp)}</span>
              </div>

              <p className="font-bold text-base leading-relaxed">
                {item.text}
              </p>

              {item.articleSlug && (
                <Link
                  href={`/news/${item.articleSlug}`}
                  className="inline-block mt-3 text-sm font-bold text-crimson hover:underline"
                >
                  اقرأ التفاصيل ←
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
