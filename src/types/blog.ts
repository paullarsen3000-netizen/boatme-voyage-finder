export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  category: BlogCategory;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  readTime: number;
  featured: boolean;
  canonicalUrl?: string;
  seoKeywords?: string[];
}

export type BlogCategory = 
  | 'boating-tips'
  | 'skipper-guides' 
  | 'destinations'
  | 'regulations'
  | 'safety'
  | 'maintenance';

export interface BlogCategoryInfo {
  id: BlogCategory;
  name: string;
  description: string;
  color: string;
}

export interface BlogMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage: string;
  keywords: string[];
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  category: string;
}