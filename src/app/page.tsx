import {
  sections,
  breakingItems,
  infographics,
  specialFiles,
  getFeaturedArticles,
  getLatestArticles,
  getArticlesBySection,
} from "@/data";
import HomeHeroWithThumbStrip from "@/components/HomeHeroWithThumbStrip";
import BreakingTicker from "@/components/BreakingTicker";
import FeaturedWithThumbnails from "@/components/FeaturedWithThumbnails";
import SplitListWithFeatured from "@/components/SplitListWithFeatured";
import TwoRowGridSection from "@/components/TwoRowGridSection";
import CardCarousel from "@/components/CardCarousel";
import NewsCard from "@/components/NewsCard";
import InfographicCarouselStacked from "@/components/InfographicCarouselStacked";
import MostReadCarouselTabs from "@/components/MostReadCarouselTabs";
import SpecialFileHighlight from "@/components/SpecialFileHighlight";
import NewsletterCTA from "@/components/NewsletterCTA";
import SectionHeaderBar from "@/components/SectionHeaderBar";
import type { Article, Section } from "@/data";

export default function HomePage() {
  const featured = getFeaturedArticles();
  const latest = getLatestArticles(8);

  const heroArticles: Article[] = dedupeArticles([...featured, ...latest]).slice(0, 8);

  const eventsToday = sections.find((s) => s.slug === "events-today");
  const countryAffairs = sections.find((s) => s.slug === "country-affairs");
  const marketMovement = sections.find((s) => s.slug === "market-movement");
  const styleStars = sections.find((s) => s.slug === "style-stars");
  const insideGoal = sections.find((s) => s.slug === "inside-goal");
  const egyptReality = sections.find((s) => s.slug === "egypt-reality");

  const specialFile = specialFiles[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
      {/* 1) Hero with thumbnail strip */}
      <HomeHeroWithThumbStrip articles={heroArticles} />

      {/* 2) Breaking ticker */}
      <BreakingTicker items={breakingItems} />

      {/* 3) Section modules with diverse layouts */}
      <div className="space-y-10 mt-4">
        {eventsToday && (
          <FeaturedWithThumbnails
            section={eventsToday}
            articles={getArticlesBySection(eventsToday.slug)}
          />
        )}

        {countryAffairs && (
          <SplitListWithFeatured
            section={countryAffairs}
            articles={getArticlesBySection(countryAffairs.slug)}
          />
        )}

        {marketMovement && (
          <SectionCarouselModule
            section={marketMovement}
            articles={getArticlesBySection(marketMovement.slug)}
          />
        )}

        {styleStars && (
          <ShotStyleSection
            section={styleStars}
            articles={getArticlesBySection(styleStars.slug)}
          />
        )}

        {insideGoal && (
          <TwoRowGridSection
            section={insideGoal}
            articles={getArticlesBySection(insideGoal.slug)}
          />
        )}

        {egyptReality && (
          <HeadlineGridSection
            section={egyptReality}
            articles={getArticlesBySection(egyptReality.slug)}
          />
        )}
      </div>

      {/* 4) Infographic carousel */}
      <InfographicCarouselStacked items={infographics} />

      {/* 5) Most read premium carousel */}
      <MostReadCarouselTabs />

      {/* 6) Special file highlight */}
      {specialFile && <SpecialFileHighlight file={specialFile} />}

      {/* 7) Newsletter CTA strip */}
      <NewsletterCTA />
    </div>
  );
}

function dedupeArticles(list: Article[]): Article[] {
  const seen = new Set<string>();
  const result: Article[] = [];
  for (const article of list) {
    if (seen.has(article.id)) continue;
    seen.add(article.id);
    result.push(article);
  }
  return result;
}

interface SectionModuleProps {
  section: Section;
  articles: Article[];
}

function SectionCarouselModule({ section, articles }: SectionModuleProps) {
  if (!articles.length) return null;
  const subset = articles.slice(0, 10);

  return (
    <section className="space-y-4">
      <SectionHeaderBar
        title={section.name}
        href={`/section/${section.slug}`}
        accentColor={section.color}
      />
      <CardCarousel
        items={subset.map((article) => (
          <div key={article.id} className="h-full">
            <NewsCard article={article} variant="compact" showSection />
          </div>
        ))}
        itemsPerView={3}
        ariaLabel={section.name}
        autoPlay
      />
    </section>
  );
}

function ShotStyleSection({ section, articles }: SectionModuleProps) {
  if (!articles.length) return null;
  const subset = articles.slice(0, 9);

  return (
    <section className="space-y-4">
      <SectionHeaderBar
        title={section.name}
        href={`/section/${section.slug}`}
        accentColor={section.color}
        badge="لقطة وتعليق"
      />
      <CardCarousel
        items={subset.map((article) => (
          <div
            key={article.id}
            className="h-full rounded-2xl overflow-hidden border border-border dark:border-border-dark bg-surface dark:bg-surface-dark shadow-sm hover:shadow-lg transition-shadow"
          >
            <NewsCard article={article} variant="compact" showSection />
          </div>
        ))}
        itemsPerView={3}
        ariaLabel={section.name}
        autoPlay
      />
    </section>
  );
}

function HeadlineGridSection({ section, articles }: SectionModuleProps) {
  if (!articles.length) return null;
  const top = articles[0];
  const rest = articles.slice(1, 7);

  return (
    <section className="space-y-4">
      <SectionHeaderBar
        title={section.name}
        href={`/section/${section.slug}`}
        accentColor={section.color}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NewsCard article={top} variant="featured" showSection />
        </div>
        <div className="space-y-3">
          {rest.map((article) => (
            <div
              key={article.id}
              className="rounded-2xl border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-3">
                <NewsCard article={article} variant="horizontal" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

