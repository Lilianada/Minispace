// Mock data for blog posts and layouts
import { formatDistanceToNow } from 'date-fns';

export interface MockBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: {
    name: string;
    avatar?: string;
  };
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  layoutStyle: 'curator' | 'stream' | 'gallery' | 'magazine';
  tags: string[];
  category?: string;
  readTime: number;
  seoDescription?: string;
  visibility: 'public' | 'private' | 'draft';
  type?: 'article' | 'website' | 'video' | 'resource';
  url?: string;
}

// Generate random dates within the last year
const getRandomDate = (monthsAgo = 12) => {
  const date = new Date();
  date.setMonth(date.getMonth() - Math.floor(Math.random() * monthsAgo));
  date.setDate(Math.floor(Math.random() * 28) + 1);
  return date;
};

// Generate random read time between 2-15 minutes
const getRandomReadTime = () => Math.floor(Math.random() * 13) + 2;

// Common tags
const commonTags = [
  'design', 'development', 'productivity', 'tools', 'resources', 
  'minimalism', 'writing', 'creativity', 'workflow', 'inspiration',
  'technology', 'web', 'tutorial', 'guide', 'review'
];

// Generate random tags
const getRandomTags = (count = 3) => {
  const shuffled = [...commonTags].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.max(1, Math.min(count, commonTags.length)));
};

// Mock blog posts for "The Curator's Shelf" layout
export const curatorPosts: MockBlogPost[] = [
  {
    id: 'resource-1',
    title: 'Essential Design Tools for Minimalists',
    slug: 'essential-design-tools',
    excerpt: 'A curated collection of lightweight design tools that won\'t bloat your workflow.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    featuredImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    author: { name: 'Alex Chen' },
    isPublished: true,
    createdAt: getRandomDate(6),
    updatedAt: getRandomDate(2),
    publishedAt: getRandomDate(2),
    layoutStyle: 'curator',
    tags: ['design', 'tools', 'minimalism'],
    category: 'Resources',
    readTime: 5,
    visibility: 'public',
    type: 'resource',
  },
  {
    id: 'resource-2',
    title: 'Free Minimal Website Templates',
    slug: 'free-minimal-website-templates',
    excerpt: 'A collection of lightweight, fast-loading website templates for your next project.',
    content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    featuredImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    author: { name: 'Jamie Lee' },
    isPublished: true,
    createdAt: getRandomDate(8),
    updatedAt: getRandomDate(3),
    publishedAt: getRandomDate(3),
    layoutStyle: 'curator',
    tags: ['web', 'resources', 'templates'],
    category: 'Resources',
    readTime: 7,
    visibility: 'public',
    type: 'resource',
  },
  {
    id: 'resource-3',
    title: 'Productivity Apps That Respect Your Focus',
    slug: 'productivity-apps-focus',
    excerpt: 'Distraction-free tools to help you get more done with less digital noise.',
    content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    featuredImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    author: { name: 'Taylor Morgan' },
    isPublished: true,
    createdAt: getRandomDate(5),
    updatedAt: getRandomDate(1),
    publishedAt: getRandomDate(1),
    layoutStyle: 'curator',
    tags: ['productivity', 'tools', 'focus'],
    category: 'Tools',
    readTime: 6,
    visibility: 'public',
    type: 'resource',
  },
  {
    id: 'resource-4',
    title: 'Markdown Writing Templates',
    slug: 'markdown-writing-templates',
    excerpt: 'Ready-to-use templates for different types of writing projects in Markdown.',
    content: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    featuredImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    author: { name: 'Jordan Rivera' },
    isPublished: true,
    createdAt: getRandomDate(7),
    updatedAt: getRandomDate(2),
    publishedAt: getRandomDate(2),
    layoutStyle: 'curator',
    tags: ['writing', 'templates', 'markdown'],
    category: 'Resources',
    readTime: 4,
    visibility: 'public',
    type: 'resource',
  },
  {
    id: 'resource-5',
    title: 'Color Palette Generators',
    slug: 'color-palette-generators',
    excerpt: 'Tools to create harmonious color schemes for your design projects.',
    content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    featuredImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    author: { name: 'Casey Kim' },
    isPublished: true,
    createdAt: getRandomDate(4),
    updatedAt: getRandomDate(1),
    publishedAt: getRandomDate(1),
    layoutStyle: 'curator',
    tags: ['design', 'color', 'tools'],
    category: 'Tools',
    readTime: 3,
    visibility: 'public',
    type: 'resource',
  },
  {
    id: 'resource-6',
    title: 'Minimal JavaScript Libraries',
    slug: 'minimal-javascript-libraries',
    excerpt: 'Lightweight JS libraries that won\'t slow down your website.',
    content: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.',
    featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    author: { name: 'Robin Chen' },
    isPublished: true,
    createdAt: getRandomDate(9),
    updatedAt: getRandomDate(3),
    publishedAt: getRandomDate(3),
    layoutStyle: 'curator',
    tags: ['development', 'javascript', 'web'],
    category: 'Development',
    readTime: 8,
    visibility: 'public',
    type: 'resource',
  },
];

// Mock blog posts for "The Thought Stream" layout
export const streamPosts: MockBlogPost[] = [
  {
    id: 'note-1',
    title: 'On Minimalism in Design',
    slug: 'on-minimalism-in-design',
    excerpt: 'Thoughts on how less can truly be more in the digital space.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    author: { name: 'Alex Chen' },
    isPublished: true,
    createdAt: getRandomDate(1),
    updatedAt: getRandomDate(1),
    publishedAt: getRandomDate(1),
    layoutStyle: 'stream',
    tags: ['design', 'minimalism', 'thoughts'],
    readTime: 2,
    visibility: 'public',
  },
  {
    id: 'note-2',
    title: 'The Value of Deep Work',
    slug: 'value-of-deep-work',
    excerpt: 'Reflections on creating space for focused, meaningful work.',
    content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    author: { name: 'Jamie Lee' },
    isPublished: true,
    createdAt: getRandomDate(2),
    updatedAt: getRandomDate(1),
    publishedAt: getRandomDate(1),
    layoutStyle: 'stream',
    tags: ['productivity', 'focus', 'work'],
    readTime: 3,
    visibility: 'public',
  },
  {
    id: 'note-3',
    title: 'Digital Gardens vs Traditional Blogs',
    slug: 'digital-gardens-vs-blogs',
    excerpt: 'Exploring the differences between curated and chronological content.',
    content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    author: { name: 'Taylor Morgan' },
    isPublished: true,
    createdAt: getRandomDate(3),
    updatedAt: getRandomDate(2),
    publishedAt: getRandomDate(2),
    layoutStyle: 'stream',
    tags: ['writing', 'content', 'blogs'],
    readTime: 4,
    visibility: 'public',
  },
  {
    id: 'note-4',
    title: 'Weekly Reading Notes: May 2025',
    slug: 'weekly-reading-notes-may-2025',
    excerpt: 'Highlights from articles and books I\'ve been reading this week.',
    content: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    author: { name: 'Jordan Rivera' },
    isPublished: true,
    createdAt: getRandomDate(0),
    updatedAt: getRandomDate(0),
    publishedAt: getRandomDate(0),
    layoutStyle: 'stream',
    tags: ['reading', 'notes', 'books'],
    readTime: 5,
    visibility: 'public',
  },
  {
    id: 'note-5',
    title: 'Thoughts on Sustainable Web Design',
    slug: 'sustainable-web-design',
    excerpt: 'How minimalism in web design can contribute to a more sustainable internet.',
    content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    author: { name: 'Casey Kim' },
    isPublished: true,
    createdAt: getRandomDate(5),
    updatedAt: getRandomDate(3),
    publishedAt: getRandomDate(3),
    layoutStyle: 'stream',
    tags: ['design', 'sustainability', 'web'],
    readTime: 3,
    visibility: 'public',
  },
  {
    id: 'note-6',
    title: 'Learning in Public',
    slug: 'learning-in-public',
    excerpt: 'The benefits of sharing your learning journey with others.',
    content: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.',
    author: { name: 'Robin Chen' },
    isPublished: true,
    createdAt: getRandomDate(4),
    updatedAt: getRandomDate(2),
    publishedAt: getRandomDate(2),
    layoutStyle: 'stream',
    tags: ['learning', 'community', 'growth'],
    readTime: 4,
    visibility: 'public',
  },
  {
    id: 'note-7',
    title: 'Simple Tools I Use Daily',
    slug: 'simple-tools-daily-use',
    excerpt: 'The minimal set of apps and tools that power my workflow.',
    content: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
    author: { name: 'Alex Chen' },
    isPublished: true,
    createdAt: getRandomDate(6),
    updatedAt: getRandomDate(4),
    publishedAt: getRandomDate(4),
    layoutStyle: 'stream',
    tags: ['tools', 'productivity', 'workflow'],
    readTime: 3,
    visibility: 'public',
  },
  {
    id: 'note-8',
    title: 'The Joy of Plain Text',
    slug: 'joy-of-plain-text',
    excerpt: 'Why plain text remains the most versatile and durable format.',
    content: 'Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
    author: { name: 'Jamie Lee' },
    isPublished: true,
    createdAt: getRandomDate(7),
    updatedAt: getRandomDate(5),
    publishedAt: getRandomDate(5),
    layoutStyle: 'stream',
    tags: ['writing', 'simplicity', 'text'],
    readTime: 2,
    visibility: 'public',
  },
];

// Mock blog posts for "The Inspiration Gallery" layout
export const galleryPosts: MockBlogPost[] = [
  {
    id: 'bookmark-1',
    title: 'The Case for Digital Minimalism',
    slug: 'case-for-digital-minimalism',
    excerpt: 'An insightful article on reducing digital clutter and focusing on what matters.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    featuredImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    author: { name: 'Cal Newport' },
    isPublished: true,
    createdAt: getRandomDate(3),
    updatedAt: getRandomDate(1),
    publishedAt: getRandomDate(1),
    layoutStyle: 'gallery',
    tags: ['minimalism', 'digital', 'focus'],
    readTime: 7,
    visibility: 'public',
    type: 'article',
    url: 'https://example.com/digital-minimalism',
  },
  {
    id: 'bookmark-2',
    title: 'Beautiful Examples of Minimal Websites',
    slug: 'beautiful-minimal-websites',
    excerpt: 'A curated gallery of stunning minimalist web design examples.',
    content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    featuredImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    author: { name: 'Design Inspiration' },
    isPublished: true,
    createdAt: getRandomDate(5),
    updatedAt: getRandomDate(2),
    publishedAt: getRandomDate(2),
    layoutStyle: 'gallery',
    tags: ['design', 'web', 'inspiration'],
    readTime: 5,
    visibility: 'public',
    type: 'website',
    url: 'https://example.com/minimal-websites',
  },
  {
    id: 'bookmark-3',
    title: 'The Art of Writing Simply',
    slug: 'art-of-writing-simply',
    excerpt: 'How to communicate complex ideas with clarity and simplicity.',
    content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    featuredImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    author: { name: 'Writing Lab' },
    isPublished: true,
    createdAt: getRandomDate(2),
    updatedAt: getRandomDate(1),
    publishedAt: getRandomDate(1),
    layoutStyle: 'gallery',
    tags: ['writing', 'communication', 'simplicity'],
    readTime: 6,
    visibility: 'public',
    type: 'article',
    url: 'https://example.com/simple-writing',
  },
  {
    id: 'bookmark-4',
    title: 'Designing for Focus',
    slug: 'designing-for-focus',
    excerpt: 'A video tutorial on creating distraction-free user interfaces.',
    content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
    featuredImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    author: { name: 'UX Masters' },
    isPublished: true,
    createdAt: getRandomDate(1),
    updatedAt: getRandomDate(0),
    publishedAt: getRandomDate(0),
    layoutStyle: 'gallery',
    tags: ['design', 'ux', 'focus'],
    readTime: 12,
    visibility: 'public',
    type: 'video',
    url: 'https://example.com/focus-design-video',
  },
  {
    id: 'bookmark-5',
    title: 'Productivity Without Burnout',
    slug: 'productivity-without-burnout',
    excerpt: 'Sustainable approaches to staying productive in the long run.',
    content: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
    featuredImage: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    author: { name: 'Wellness Works' },
    isPublished: true,
    createdAt: getRandomDate(4),
    updatedAt: getRandomDate(2),
    publishedAt: getRandomDate(2),
    layoutStyle: 'gallery',
    tags: ['productivity', 'wellness', 'work'],
    readTime: 8,
    visibility: 'public',
    type: 'article',
    url: 'https://example.com/sustainable-productivity',
  },
  {
    id: 'bookmark-6',
    title: 'Essential Typography Resources',
    slug: 'essential-typography-resources',
    excerpt: 'A collection of tools and guides for better typography in your projects.',
    content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.',
    featuredImage: 'https://images.unsplash.com/photo-1467703834117-04386e3dadd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    author: { name: 'Type Foundry' },
    isPublished: true,
    createdAt: getRandomDate(6),
    updatedAt: getRandomDate(3),
    publishedAt: getRandomDate(3),
    layoutStyle: 'gallery',
    tags: ['typography', 'design', 'resources'],
    readTime: 5,
    visibility: 'public',
    type: 'resource',
    url: 'https://example.com/typography-resources',
  },
];

// Mock blog posts for "The Mini Magazine" layout
export const magazinePosts: MockBlogPost[] = [
  {
    id: 'article-1',
    title: 'The Future of Minimal Web Design',
    slug: 'future-minimal-web-design',
    excerpt: 'Exploring emerging trends in minimalist approaches to web interfaces.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    featuredImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    author: { 
      name: 'Alex Chen',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    isPublished: true,
    createdAt: getRandomDate(1),
    updatedAt: getRandomDate(0),
    publishedAt: getRandomDate(0),
    layoutStyle: 'magazine',
    tags: ['design', 'web', 'trends'],
    category: 'Design',
    readTime: 7,
    seoDescription: 'Learn about the future trends of minimal web design and how they\'ll shape the digital landscape.',
    visibility: 'public',
  },
  {
    id: 'article-2',
    title: 'Writing for Clarity: A Guide',
    slug: 'writing-for-clarity',
    excerpt: 'Techniques for crafting clear, concise, and compelling content.',
    content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    featuredImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    author: { 
      name: 'Jamie Lee',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    isPublished: true,
    createdAt: getRandomDate(2),
    updatedAt: getRandomDate(1),
    publishedAt: getRandomDate(1),
    layoutStyle: 'magazine',
    tags: ['writing', 'communication', 'content'],
    category: 'Writing',
    readTime: 9,
    seoDescription: 'Master the art of clear writing with practical techniques for creating concise and compelling content.',
    visibility: 'public',
  },
  {
    id: 'article-3',
    title: 'Sustainable Digital Practices',
    slug: 'sustainable-digital-practices',
    excerpt: 'How minimalism in technology can contribute to environmental sustainability.',
    content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    featuredImage: 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    author: { 
      name: 'Taylor Morgan',
      avatar: 'https://randomuser.me/api/portraits/women/67.jpg'
    },
    isPublished: true,
    createdAt: getRandomDate(3),
    updatedAt: getRandomDate(2),
    publishedAt: getRandomDate(2),
    layoutStyle: 'magazine',
    tags: ['sustainability', 'technology', 'minimalism'],
    category: 'Sustainability',
    readTime: 11,
    seoDescription: 'Discover how digital minimalism can lead to more sustainable technology practices and reduce environmental impact.',
    visibility: 'public',
  },
  {
    id: 'article-4',
    title: 'The Psychology of Simple Interfaces',
    slug: 'psychology-simple-interfaces',
    excerpt: 'Understanding how minimalist design affects user perception and behavior.',
    content: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    featuredImage: 'https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    author: { 
      name: 'Jordan Rivera',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    isPublished: true,
    createdAt: getRandomDate(4),
    updatedAt: getRandomDate(2),
    publishedAt: getRandomDate(2),
    layoutStyle: 'magazine',
    tags: ['psychology', 'ux', 'design'],
    category: 'UX Design',
    readTime: 8,
    seoDescription: 'Explore the psychological principles behind minimalist interfaces and how they influence user behavior.',
    visibility: 'public',
  },
  {
    id: 'article-5',
    title: 'Minimalist Productivity Systems',
    slug: 'minimalist-productivity-systems',
    excerpt: 'Simple frameworks for getting things done without the complexity.',
    content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    featuredImage: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    author: { 
      name: 'Casey Kim',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
    },
    isPublished: true,
    createdAt: getRandomDate(5),
    updatedAt: getRandomDate(3),
    publishedAt: getRandomDate(3),
    layoutStyle: 'magazine',
    tags: ['productivity', 'minimalism', 'systems'],
    category: 'Productivity',
    readTime: 10,
    seoDescription: 'Learn about effective minimalist productivity systems that help you accomplish more with less complexity.',
    visibility: 'public',
  },
  {
    id: 'article-6',
    title: 'The Art of Digital Decluttering',
    slug: 'art-of-digital-decluttering',
    excerpt: 'Strategies for maintaining a clean and organized digital life.',
    content: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.',
    featuredImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    author: { 
      name: 'Robin Chen',
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg'
    },
    isPublished: true,
    createdAt: getRandomDate(6),
    updatedAt: getRandomDate(4),
    publishedAt: getRandomDate(4),
    layoutStyle: 'magazine',
    tags: ['organization', 'digital', 'minimalism'],
    category: 'Digital Life',
    readTime: 6,
    seoDescription: 'Master the art of digital decluttering with practical strategies for organizing your digital life and reducing digital noise.',
    visibility: 'public',
  },
];

// Combine all posts for general use
export const allMockPosts = [
  ...curatorPosts,
  ...streamPosts,
  ...galleryPosts,
  ...magazinePosts
];

// Helper function to get posts by layout style
export const getPostsByLayout = (layoutStyle: 'curator' | 'stream' | 'gallery' | 'magazine') => {
  switch (layoutStyle) {
    case 'curator':
      return curatorPosts;
    case 'stream':
      return streamPosts;
    case 'gallery':
      return galleryPosts;
    case 'magazine':
      return magazinePosts;
    default:
      return [];
  }
};

// Helper function to format post date for display
export const formatPostDate = (date: Date) => {
  return formatDistanceToNow(date, { addSuffix: true });
};
