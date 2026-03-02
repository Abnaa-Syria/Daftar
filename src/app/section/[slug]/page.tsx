import { notFound } from "next/navigation";
import { sections, getArticlesBySection, getSectionBySlug, infographics, specialFiles, formatDate } from "@/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import NewsCard from "@/components/NewsCard";
import Link from "next/link";
import Image from "next/image";

export function generateStaticParams() {
  return sections.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const section = getSectionBySlug(slug);
  return { title: section ? `${section.name} - الدفتر` : "الدفتر" };
}

export default async function SectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const section = getSectionBySlug(slug);
  if (!section) return notFound();

  if (section.slug === "infographic") {
    return <InfographicSection />;
  }

  if (section.slug === "special-file") {
    return <SpecialFileSection />;
  }

  const articles = getArticlesBySection(section.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: section.name }]} />

      <div className="flex items-center gap-3 mb-8">
        <span
          className="w-1.5 h-10 rounded-full"
          style={{ backgroundColor: section.color }}
        />
        <div>
          <h1 className="text-3xl font-extrabold">{section.name}</h1>
          <p className="text-text-secondary dark:text-text-dark-secondary text-sm mt-1">
            {section.description}
          </p>
        </div>
      </div>

      {articles.length > 0 && (
        <div className="mb-10">
          <NewsCard article={articles[0]} variant="featured" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {articles.slice(1).map((article) => (
          <NewsCard key={article.id} article={article} variant="compact" />
        ))}
      </div>
    </div>
  );
}

function InfographicSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "الانفو جراف" }]} />

      <div className="flex items-center gap-3 mb-8">
        <span className="w-1.5 h-10 rounded-full bg-[#00838f]" />
        <div>
          <h1 className="text-3xl font-extrabold">الانفو جراف</h1>
          <p className="text-text-secondary dark:text-text-dark-secondary text-sm mt-1">
            المعلومات في صورة بصرية مبسطة
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {infographics.map((info) => (
          <Link
            key={info.id}
            href={`/infographic/${info.slug}`}
            className="group block"
          >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3">
              <Image
                src={info.images[0]}
                alt={info.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 right-3 left-3">
                <span className="inline-block px-2 py-0.5 rounded bg-[#00838f] text-white text-xs font-bold mb-1">
                  انفوجراف
                </span>
                <h3 className="text-white font-bold text-sm line-clamp-2">
                  {info.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SpecialFileSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "ملف خاص" }]} />

      <div className="flex items-center gap-3 mb-8">
        <span className="w-1.5 h-10 rounded-full bg-[#4a148c]" />
        <div>
          <h1 className="text-3xl font-extrabold">ملف خاص</h1>
          <p className="text-text-secondary dark:text-text-dark-secondary text-sm mt-1">
            ملفات وتحقيقات معمّقة في قضايا الساعة
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {specialFiles.map((file) => (
          <Link
            key={file.id}
            href={`/file/${file.slug}`}
            className="group block"
          >
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
              <Image
                src={file.coverImage}
                alt={file.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 p-5">
                <span className="inline-block px-2 py-0.5 rounded bg-[#4a148c] text-white text-xs font-bold mb-2">
                  ملف خاص
                </span>
                <h3 className="text-white text-xl font-extrabold line-clamp-2 mb-1">
                  {file.title}
                </h3>
                <p className="text-white/70 text-sm line-clamp-2">
                  {file.description}
                </p>
                <span className="text-white/50 text-xs mt-2 block">
                  {formatDate(file.publishedAt)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
