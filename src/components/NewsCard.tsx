import Link from "next/link";
import Image from "next/image";
import { Article, getAuthorById, getSectionById, timeAgo } from "@/data";

interface Props {
  article: Article;
  variant?: "featured" | "horizontal" | "compact";
  showSection?: boolean;
}

export default function NewsCard({ article, variant = "compact", showSection = false }: Props) {
  const author = getAuthorById(article.authorId);
  const section = getSectionById(article.sectionId);

  if (variant === "featured") {
    return (
      <Link href={`/news/${article.slug}`} className="group block">
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 p-5">
            {showSection && section && (
              <span
                className="inline-block px-3 py-1 rounded-md text-xs font-bold text-white mb-2"
                style={{ backgroundColor: section.color }}
              >
                {section.name}
              </span>
            )}
            <h3 className="text-white text-xl md:text-2xl font-extrabold leading-tight mb-2 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-white/70 text-sm line-clamp-2 mb-2">{article.excerpt}</p>
            <div className="flex items-center gap-3 text-white/60 text-xs">
              {author && <span>{author.name}</span>}
              <span>•</span>
              <span>{timeAgo(article.publishedAt)}</span>
              <span>•</span>
              <span>{article.readTime} د قراءة</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link href={`/news/${article.slug}`} className="group flex gap-4">
        <div className="relative w-32 h-24 md:w-44 md:h-28 rounded-lg overflow-hidden shrink-0">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="180px"
          />
        </div>
        <div className="flex-1 min-w-0 py-1">
          {showSection && section && (
            <span
              className="inline-block px-2 py-0.5 rounded text-xs font-bold text-white mb-1"
              style={{ backgroundColor: section.color }}
            >
              {section.name}
            </span>
          )}
          <h3 className="font-bold text-sm md:text-base leading-snug line-clamp-2 group-hover:text-crimson transition-colors">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 text-text-secondary dark:text-text-dark-secondary text-xs mt-2">
            <span>{timeAgo(article.publishedAt)}</span>
            <span>•</span>
            <span>{article.readTime} د قراءة</span>
          </div>
        </div>
      </Link>
    );
  }

  // compact
  return (
    <Link href={`/news/${article.slug}`} className="group block">
      <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-3">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {showSection && section && (
          <span
            className="absolute top-3 right-3 px-2 py-0.5 rounded text-xs font-bold text-white"
            style={{ backgroundColor: section.color }}
          >
            {section.name}
          </span>
        )}
      </div>
      <h3 className="font-bold text-sm leading-snug line-clamp-2 group-hover:text-crimson transition-colors">
        {article.title}
      </h3>
      <div className="flex items-center gap-2 text-text-secondary dark:text-text-dark-secondary text-xs mt-2">
        <span>{timeAgo(article.publishedAt)}</span>
        <span>•</span>
        <span>{article.readTime} د قراءة</span>
      </div>
    </Link>
  );
}
