export interface Section {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  color?: string;
}

export interface Author {
  id: number;
  slug: string;
  name: string;
  role?: string | null;
  avatar?: string | null;
  bio?: string | null;
}

export interface Tag {
  id: number;
  slug: string;
  name: string;
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  image?: string | null;
  publishedAt?: string | null;
  readTime?: number;
  views?: number;
  isBreaking?: boolean;
  isFeatured?: boolean;
  isExclusive?: boolean;
  isAnalysis?: boolean;
  section?: Section | null;
  author?: Author | null;
  tags?: Tag[];
}

export interface BreakingItem {
  id: number;
  title: string;
  publishedAt?: string | null;
  article?: { slug: string; title: string } | null;
}

export interface Infographic {
  id: number;
  slug: string;
  title: string;
  description?: string | null;
  coverImage?: string | null;
  images: { url: string }[];
  publishedAt?: string | null;
}

export interface SpecialFile {
  id: number;
  slug: string;
  title: string;
  description?: string | null;
  coverImage?: string | null;
  publishedAt?: string | null;
  articles?: { article: Article }[];
}
