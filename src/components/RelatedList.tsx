import { Article } from "@/data";
import NewsCard from "./NewsCard";

interface Props {
  articles: Article[];
  title?: string;
}

export default function RelatedList({ articles, title = "مقالات ذات صلة" }: Props) {
  if (!articles.length) return null;

  return (
    <section className="mt-10">
      <h3 className="text-xl font-extrabold mb-5 flex items-center gap-2">
        <span className="w-1 h-6 rounded-full bg-crimson" />
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} variant="compact" showSection />
        ))}
      </div>
    </section>
  );
}
