import { notFound } from "next/navigation";
import { publicApi } from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";
export const dynamic = "force-dynamic";
import NewsCard from "@/components/NewsCard";
import type { Author, Article } from "@/types/content";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await publicApi.getAuthor(slug).catch(() => null);
  const author = (res?.data as { author: Author })?.author;
  return { title: author ? `${author.name} - الدفتر` : "الدفتر" };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await publicApi.getAuthor(slug).catch(() => null);
  const payload = res?.data as { author: Author; data: Article[] } | undefined;
  const author = payload?.author;
  if (!author) return notFound();
  const authorArticles = payload?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: author.name }]} />

      {/* Author Card */}
      <div className="bg-surface-alt dark:bg-surface-dark-alt rounded-2xl p-6 md:p-8 mt-4 mb-10">
        <div className="text-center md:text-right">
          <h1 className="text-3xl font-extrabold mb-1">{author.name}</h1>
          <span className="text-crimson font-bold text-sm">{author.role}</span>
          <p className="text-text-secondary dark:text-text-dark-secondary mt-3 leading-relaxed max-w-2xl">
            {author.bio}
          </p>
          <span className="text-sm text-text-secondary dark:text-text-dark-secondary mt-2 block">
            {authorArticles.length} مقال منشور
          </span>
        </div>
      </div>

      {/* Articles */}
      <h2 className="text-xl font-extrabold mb-5 flex items-center gap-2">
        <span className="w-1 h-6 rounded-full bg-crimson" />
        مقالات {author.name}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {authorArticles.map((article) => (
          <NewsCard key={article.id} article={article} variant="compact" showSection />
        ))}
      </div>
    </div>
  );
}
