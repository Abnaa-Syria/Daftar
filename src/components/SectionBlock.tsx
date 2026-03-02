import Link from "next/link";
import { Article, Section } from "@/data";
import NewsCard from "./NewsCard";

interface Props {
  section: Section;
  articles: Article[];
}

export default function SectionBlock({ section, articles }: Props) {
  if (!articles.length) return null;

  const featured = articles[0];
  const rest = articles.slice(1, 5);

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span
            className="w-1 h-8 rounded-full"
            style={{ backgroundColor: section.color }}
          />
          <h2 className="text-xl md:text-2xl font-extrabold">{section.name}</h2>
        </div>
        <Link
          href={`/section/${section.slug}`}
          className="text-sm font-bold text-crimson hover:underline"
        >
          المزيد ←
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NewsCard article={featured} variant="featured" />
        <div className="space-y-4">
          {rest.map((article) => (
            <NewsCard key={article.id} article={article} variant="horizontal" />
          ))}
        </div>
      </div>
    </section>
  );
}
