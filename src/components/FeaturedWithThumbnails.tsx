import type { Article, Section } from "@/data";
import NewsCard from "./NewsCard";
import SectionHeaderBar from "./SectionHeaderBar";

interface Props {
  section: Section;
  articles: Article[];
}

export default function FeaturedWithThumbnails({ section, articles }: Props) {
  if (!articles.length) return null;
  const [featured, ...rest] = articles;
  const thumbnails = rest.slice(0, 3);

  return (
    <section className="space-y-4">
      <SectionHeaderBar
        title={section.name}
        href={`/section/${section.slug}`}
        accentColor={section.color}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <NewsCard article={featured} variant="featured" showSection />
        </div>
        <div className="space-y-4">
          {thumbnails.map((article) => (
            <div
              key={article.id}
              className="rounded-xl border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-3">
                <NewsCard article={article} variant="horizontal" showSection />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

