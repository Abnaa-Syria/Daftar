import Image from "next/image";
import Link from "next/link";
import { SpecialFile, getArticleById, formatDate } from "@/data";
import NewsCard from "./NewsCard";
import SectionHeaderBar from "./SectionHeaderBar";

interface Props {
  file: SpecialFile;
}

export default function SpecialFileHighlight({ file }: Props) {
  const relatedArticles = file.articleIds
    .map((id) => getArticleById(id))
    .filter(Boolean)
    .slice(0, 4);

  return (
    <section className="space-y-4">
      <SectionHeaderBar
        title="ملف خاص"
        href="/section/special-file"
        accentColor="#4a148c"
        badge="تحقيقات معمّقة"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <Link
          href={`/file/${file.slug}`}
          className="group relative overflow-hidden rounded-3xl lg:col-span-2 h-full border border-border dark:border-border-dark bg-surface dark:bg-surface-dark shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2"
        >
          <div className="relative h-full transition-transform duration-700 group-hover:scale-[1.03]">
            <Image
              src={file.coverImage}
              alt={file.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 space-y-2 md:space-y-2.5">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-700 text-[11px] font-bold text-white">
                ملف خاص
              </span>
              <h2 className="text-xl md:text-3xl font-extrabold text-white leading-tight line-clamp-2">
                {file.title}
              </h2>
              <p className="hidden sm:block text-sm text-white/80 max-w-2xl line-clamp-2">
                {file.description}
              </p>
              <span className="text-[11px] text-white/70">
                نُشر في {formatDate(file.publishedAt)}
              </span>
            </div>
          </div>
        </Link>

        <div className="space-y-3">
          {relatedArticles.map(
            (article) =>
              article && (
                <div
                  key={article.id}
                  className="rounded-2xl border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-3">
                    <NewsCard article={article} variant="horizontal" showSection />
                  </div>
                </div>
              ),
          )}
        </div>
      </div>
    </section>
  );
}

