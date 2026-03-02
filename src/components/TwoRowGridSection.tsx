import type { Article, Section } from "@/data";
import NewsCard from "./NewsCard";
import SectionHeaderBar from "./SectionHeaderBar";

interface Props {
  section: Section;
  articles: Article[];
}

export default function TwoRowGridSection({ section, articles }: Props) {
  if (!articles.length) return null;
  const topRow = articles.slice(0, 2);
  const bottomRow = articles.slice(2, 6);

  return (
    <section className="space-y-4">
      <SectionHeaderBar
        title={section.name}
        href={`/section/${section.slug}`}
        accentColor={section.color}
      />

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {topRow.map((article) => (
            <div
              key={article.id}
              className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-3">
                <NewsCard article={article} variant="featured" showSection />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {bottomRow.map((article) => (
            <NewsCard key={article.id} article={article} variant="compact" showSection />
          ))}
        </div>
      </div>
    </section>
  );
}

