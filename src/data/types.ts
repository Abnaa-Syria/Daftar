export interface Section {
  id: string;
  slug: string;
  name: string;
  description: string;
  color: string;
}

export interface Author {
  id: string;
  slug: string;
  name: string;
  bio: string;
  avatar: string;
  role: string;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  sectionId: string;
  authorId: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  isFeatured: boolean;
  views: number;
  isBreaking?: boolean;
  isExclusive?: boolean;
  isAnalysis?: boolean;
  mostReadScore?: number;
}

export interface Infographic {
  id: string;
  slug: string;
  title: string;
  description: string;
  images: string[];
  sectionId: string;
  publishedAt: string;
}

export interface SpecialFile {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  articleIds: string[];
  publishedAt: string;
}

export interface BreakingItem {
  id: string;
  text: string;
  timestamp: string;
  articleSlug?: string;
}

export interface Series {
  id: string;
  slug: string;
  name: string;
  description: string;
  articleIds: string[];
}
