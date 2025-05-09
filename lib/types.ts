// User types
export interface UserData {
  username: string;
  email: string;
  enableBlog?: boolean;
  customDomain?: string;
  blogSettings?: BlogSettings;
}

export interface BlogSettings {
  title?: string;
  description?: string;
  footerText?: string;
  navStyle?: 'minimal' | 'standard' | 'expanded';
  showDates?: boolean;
  showTags?: boolean;
  defaultLayout?: string;
}

// Page types
export interface Page {
  pageId: string;
  title: string;
  slug: string;
  isPublished: boolean;
  createdAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
  layout: string; // Theme selection
  styles: PageStyles;
  seoDescription?: string;
  seoImage?: string;
  canonicalUrl?: string;
  isHomepage: boolean;
  alias?: string;
  language?: string;
  tags?: string[];
  makeDiscoverable?: boolean;
  isStaticPage?: boolean;
}

export interface PageStyles {
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  fontSize?: string;
  headerImage?: string;
  headerOverlay?: boolean;
  headerTextColor?: string;
}

// Content Block types
export interface ContentBlock {
  blockId: string;
  type: ContentBlockType;
  content: string;
  layoutType: 'flex' | 'column' | 'row';
  order: number;
  styles: ContentBlockStyles;
  metadata?: Record<string, any>;
}

export type ContentBlockType = 
  | 'text' 
  | 'image' 
  | 'spacer' 
  | 'divider'
  | 'quote'
  | 'code'
  | 'embed'
  | 'gallery'
  | 'list'
  | 'table'
  | 'html'
  | 'markdown';

export interface ContentBlockStyles {
  alignment?: 'left' | 'center' | 'right' | 'justify';
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  boxShadow?: string;
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
}
