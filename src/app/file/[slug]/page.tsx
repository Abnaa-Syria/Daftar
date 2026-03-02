import { notFound } from "next/navigation";
import Image from "next/image";
import { specialFiles, getSpecialFileBySlug, getArticleById, formatDate } from "@/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import NewsCard from "@/components/NewsCard";

export function generateStaticParams() {
  return specialFiles.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const file = getSpecialFileBySlug(slug);
  return { title: file ? `${file.title} - ملف خاص - الدفتر` : "الدفتر" };
}

export default async function SpecialFilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const file = getSpecialFileBySlug(slug);
  if (!file) return notFound();

  const fileArticles = file.articleIds
    .map((id) => getArticleById(id))
    .filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs
        items={[
          { label: "ملف خاص", href: "/section/special-file" },
          { label: file.title },
        ]}
      />

      {/* Cover */}
      <div className="relative aspect-[16/6] rounded-2xl overflow-hidden mt-4 mb-8">
        <Image
          src={file.coverImage}
          alt={file.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 right-0 left-0 p-8">
          <span className="inline-block px-3 py-1 rounded-md bg-[#4a148c] text-white text-xs font-bold mb-3">
            ملف خاص
          </span>
          <h1 className="text-white text-3xl md:text-4xl font-extrabold mb-3">
            {file.title}
          </h1>
          <p className="text-white/80 text-base max-w-3xl">{file.description}</p>
          <span className="text-white/50 text-sm mt-2 block">
            {formatDate(file.publishedAt)}
          </span>
        </div>
      </div>

      {/* Articles in the file */}
      <h2 className="text-xl font-extrabold mb-5 flex items-center gap-2">
        <span className="w-1 h-6 rounded-full bg-[#4a148c]" />
        مقالات الملف
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {fileArticles.map(
          (article) =>
            article && (
              <NewsCard key={article.id} article={article} variant="compact" showSection />
            )
        )}
      </div>
    </div>
  );
}
