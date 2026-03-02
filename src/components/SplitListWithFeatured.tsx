import Link from "next/link";
import type { Article, Section } from "@/data";
import NewsCard from "./NewsCard";
import SectionHeaderBar from "./SectionHeaderBar";
import { timeAgo } from "@/data";

interface Props {
  section: Section;
  articles: Article[];
}

export default function SplitListWithFeatured({ section, articles }: Props) {
  if (!articles.length) return null;
  const [featured, ...rest] = articles;
  const list = rest.slice(0, 6);

  return (
    <section className="space-y-4">
      <SectionHeaderBar
        title={section.name}
        href={`/section/${section.slug}`}
        accentColor={section.color}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NewsCard article={featured} variant="featured" showSection />
        </div>
        <div className="bg-surface-alt dark:bg-surface-dark-alt rounded-2xl border border-border dark:border-border-dark p-4">
          <h3 className="text-sm font-extrabold mb-3 text-text-secondary dark:text-text-dark-secondary">
            عناوين مختارة
          </h3>
          <ul className="space-y-2">
            {list.map((article) => (
              <li key={article.id} className="border-b border-border/60 dark:border-border-dark/60 last:border-0 pb-2 last:pb-0">
                <Link
                  href={`/news/${article.slug}`}
                  className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 rounded-md"
                >
                  <p className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-crimson transition-colors">
                    {article.title}
                  </p>
                  <span className="text-[11px] text-text-secondary dark:text-text-dark-secondary">
                    {timeAgo(article.publishedAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

