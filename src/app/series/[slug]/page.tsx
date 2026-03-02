import { notFound } from "next/navigation";
import { series, getSeriesBySlug, getArticleById } from "@/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import NewsCard from "@/components/NewsCard";

export function generateStaticParams() {
  return series.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSeriesBySlug(slug);
  return { title: s ? `${s.name} - الدفتر` : "الدفتر" };
}

export default async function SeriesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSeriesBySlug(slug);
  if (!s) return notFound();

  const seriesArticles = s.articleIds
    .map((id) => getArticleById(id))
    .filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "سلاسل" }, { label: s.name }]} />

      <div className="bg-gradient-to-l from-navy to-navy-light dark:from-navy-dark dark:to-surface-dark rounded-2xl p-8 mt-4 mb-10 text-white">
        <span className="inline-block px-3 py-1 rounded-md bg-crimson text-xs font-bold mb-3">
          سلسلة
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{s.name}</h1>
        <p className="text-white/80 max-w-2xl">{s.description}</p>
        <span className="text-white/50 text-sm mt-3 block">
          {seriesArticles.length} حلقة
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {seriesArticles.map(
          (article, i) =>
            article && (
              <div key={article.id} className="relative">
                <span className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <NewsCard article={article} variant="compact" showSection />
              </div>
            )
        )}
      </div>
    </div>
  );
}
