import { Timestamp } from "firebase/firestore"

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage?: string
  isPublished: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
  publishedAt?: Timestamp
  layoutStyle?: 'curator' | 'stream' | 'gallery' | 'magazine'
  tags: string[]
  category?: string
  readTime?: number
  seoDescription?: string
  visibility: 'public' | 'private' | 'draft'
  type?: 'article' | 'website' | 'video' | 'resource'
  url?: string
  userId: string
}

export interface BlogPostContent {
  id: string
  postId: string
  content: string
  order: number
  type: 'text' | 'image' | 'code' | 'quote' | 'heading'
  metadata?: Record<string, any>
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface BlogSettings {
  enabled: boolean
  layoutStyle: 'curator' | 'stream' | 'gallery' | 'magazine'
  showSearch: boolean
  updatedAt: Timestamp
}

// Helper function to calculate read time based on content length
export function calculateReadTime(content: string): number {
  // Average reading speed: 200-250 words per minute
  // We'll use 225 words per minute as an average
  const wordsPerMinute = 225;
  const words = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(words / wordsPerMinute);
  
  // Return at least 1 minute for very short content
  return Math.max(1, readTime);
}

// Helper function to generate a slug from a title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
    .trim();
}

// Helper function to ensure slug uniqueness
export function ensureUniqueSlug(slug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(slug)) {
    return slug;
  }
  
  // If slug exists, add a number suffix
  let counter = 1;
  let newSlug = `${slug}-${counter}`;
  
  while (existingSlugs.includes(newSlug)) {
    counter++;
    newSlug = `${slug}-${counter}`;
  }
  
  return newSlug;
}
