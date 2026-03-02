import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  articles,
  getArticleBySlug,
  getAuthorById,
  getSectionById,
  getTagById,
  getRelatedArticles,
  formatDate,
  timeAgo,
} from "@/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShareBar from "@/components/ShareBar";
import BookmarkButton from "@/components/BookmarkButton";
import FontSizeControls from "@/components/FontSizeControls";
import RelatedList from "@/components/RelatedList";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  return { title: article ? `${article.title} - الدفتر` : "الدفتر" };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return notFound();

  const author = getAuthorById(article.authorId);
  const section = getSectionById(article.sectionId);
  const tagObjects = article.tags.map((t) => getTagById(t)).filter(Boolean);
  const related = getRelatedArticles(article, 4);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Breadcrumbs
        items={[
          ...(section
            ? [{ label: section.name, href: `/section/${section.slug}` }]
            : []),
          { label: article.title },
        ]}
      />

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mt-4 mb-4">
        {article.title}
      </h1>

      {/* Excerpt */}
      <p className="text-lg text-text-secondary dark:text-text-dark-secondary leading-relaxed mb-6">
        {article.excerpt}
      </p>

      {/* Meta Row */}
      <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-border dark:border-border-dark">
        {author && (
          <Link
            href={`/author/${author.slug}`}
            className="flex items-center gap-3 group"
          >
            <Image
              src={author.avatar}
              alt={author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <span className="block text-sm font-bold group-hover:text-crimson transition-colors">
                {author.name}
              </span>
              <span className="block text-xs text-text-secondary dark:text-text-dark-secondary">
                {author.role}
              </span>
            </div>
          </Link>
        )}
        <div className="flex items-center gap-3 text-xs text-text-secondary dark:text-text-dark-secondary">
          <span>{formatDate(article.publishedAt)}</span>
          <span>•</span>
          <span>{timeAgo(article.publishedAt)}</span>
          <span>•</span>
          <span>{article.readTime} دقائق قراءة</span>
          <span>•</span>
          <span>{article.views.toLocaleString("ar-EG")} مشاهدة</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <ShareBar title={article.title} />
        <div className="flex items-center gap-3">
          <FontSizeControls />
          <BookmarkButton articleId={article.id} />
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
          priority
        />
      </div>

      {/* Article Content */}
      <article
        className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-extrabold prose-p:leading-[1.9] prose-p:text-text-primary dark:prose-p:text-text-dark-primary"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Tags */}
      {tagObjects.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-border dark:border-border-dark">
          <span className="text-sm font-bold text-text-secondary dark:text-text-dark-secondary">
            الوسوم:
          </span>
          {tagObjects.map(
            (tag) =>
              tag && (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="px-3 py-1 rounded-full bg-surface-alt dark:bg-surface-dark-alt text-sm font-bold hover:bg-crimson hover:text-white transition-colors"
                >
                  {tag.name}
                </Link>
              )
          )}
        </div>
      )}

      {/* Related */}
      <RelatedList articles={related} />
    </div>
  );
}
