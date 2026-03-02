export * from "./types";
export { sections } from "./sections";
export { authors } from "./authors";
export { tags } from "./tags";
export { articles } from "./articles";
export { breakingItems } from "./breaking";
export { infographics } from "./infographics";
export { specialFiles } from "./special-files";
export { series } from "./series";

import { sections } from "./sections";
import { authors } from "./authors";
import { tags } from "./tags";
import { articles } from "./articles";
import { infographics } from "./infographics";
import { specialFiles } from "./special-files";
import { series } from "./series";
import type { Article, Author, Section, Tag, Infographic, SpecialFile, Series } from "./types";

export function getArticlesBySection(sectionSlug: string): Article[] {
  const section = sections.find((s) => s.slug === sectionSlug);
  if (!section) return [];
  return articles.filter((a) => a.sectionId === section.id);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticleById(id: string): Article | undefined {
  return articles.find((a) => a.id === id);
}

export function getAuthorById(id: string): Author | undefined {
  return authors.find((a) => a.id === id);
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

export function getSectionById(id: string): Section | undefined {
  return sections.find((s) => s.id === id);
}

export function getSectionBySlug(slug: string): Section | undefined {
  return sections.find((s) => s.slug === slug);
}

export function getTagBySlug(slug: string): Tag | undefined {
  return tags.find((t) => t.slug === slug);
}

export function getTagById(id: string): Tag | undefined {
  return tags.find((t) => t.id === id);
}

export function getArticlesByTag(tagSlug: string): Article[] {
  const tag = tags.find((t) => t.slug === tagSlug);
  if (!tag) return [];
  return articles.filter((a) => a.tags.includes(tag.id));
}

export function getArticlesByAuthor(authorSlug: string): Article[] {
  const author = authors.find((a) => a.slug === authorSlug);
  if (!author) return [];
  return articles.filter((a) => a.authorId === author.id);
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((a) => a.isFeatured);
}

export function getMostReadArticles(limit: number = 10): Article[] {
  return [...articles]
    .sort((a, b) => {
      const scoreA = a.mostReadScore ?? a.views;
      const scoreB = b.mostReadScore ?? b.views;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

export function getLatestArticles(limit: number = 10): Article[] {
  return [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export function getInfographicBySlug(slug: string): Infographic | undefined {
  return infographics.find((i) => i.slug === slug);
}

export function getSpecialFileBySlug(slug: string): SpecialFile | undefined {
  return specialFiles.find((sf) => sf.slug === slug);
}

export function getSeriesBySlug(slug: string): Series | undefined {
  return series.find((s) => s.slug === slug);
}

export function searchArticles(query: string): Article[] {
  const q = query.toLowerCase();
  return articles.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q)
  );
}

export function getRelatedArticles(article: Article, limit: number = 4): Article[] {
  return articles
    .filter(
      (a) =>
        a.id !== article.id &&
        (a.sectionId === article.sectionId ||
          a.tags.some((t) => article.tags.includes(t)))
    )
    .slice(0, limit);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "الآن";
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays < 7) return `منذ ${diffDays} يوم`;
  return formatDate(dateStr);
}
