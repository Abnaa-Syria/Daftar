import { notFound } from "next/navigation";
import { tags, getTagBySlug, getArticlesByTag } from "@/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import NewsCard from "@/components/NewsCard";

export function generateStaticParams() {
  return tags.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tag = getTagBySlug(slug);
  return { title: tag ? `${tag.name} - الدفتر` : "الدفتر" };
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tag = getTagBySlug(slug);
  if (!tag) return notFound();

  const tagArticles = getArticlesByTag(tag.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: `#${tag.name}` }]} />

      <div className="flex items-center gap-3 mb-8 mt-4">
        <span className="text-4xl">#</span>
        <div>
          <h1 className="text-3xl font-extrabold">{tag.name}</h1>
          <p className="text-text-secondary dark:text-text-dark-secondary text-sm">
            {tagArticles.length} مقال
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tagArticles.map((article) => (
          <NewsCard key={article.id} article={article} variant="compact" showSection />
        ))}
      </div>
    </div>
  );
}
