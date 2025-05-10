# MINISPACE Implementation Guide

This document outlines the steps needed to transform the MINI app into MINISPACE - a lightweight blogging platform with user subdomains (username.minispace.dev) similar to bearblog.dev.

## 1. Domain and DNS Configuration

### For Main App
- Purchase the `minispace.dev` domain
- Set up DNS records for the main app:
  - `A` record for `minispace.dev` pointing to your server IP
  - `A` record for `www.minispace.dev` pointing to your server IP

### For User Subdomains
- Set up wildcard DNS records:
  - `A` record for `*.minispace.dev` pointing to your server IP
  - Obtain a wildcard SSL certificate for `*.minispace.dev` (using Let's Encrypt or similar)

## 2. Server Configuration

Bearblog uses a multi-tenant architecture where each subdomain is served by the same application but appears as a standalone website. There are two main approaches to implement this:

### Option 1: Hosting Provider with Built-in Domain Routing

If using Vercel, Netlify, or similar:

1. Configure domain routing in your hosting provider's dashboard
2. Set up wildcard domain handling for `*.minispace.dev`
3. Use environment variables to detect the hostname/subdomain

### Option 2: Custom Server Implementation

If using a custom Node.js server:

```javascript
const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Handle subdomain routing
  server.use((req, res, next) => {
    const hostname = req.hostname;
    
    // Check if we're dealing with a subdomain
    if (hostname.includes('.minispace.dev')) {
      const subdomain = hostname.split('.')[0];
      
      // Skip special subdomains
      if (!['www', 'app', 'api'].includes(subdomain)) {
        // Store subdomain in req for use in Next.js
        req.subdomain = subdomain;
      }
    }
    next();
  });

  // Let Next.js handle all requests
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
```

## 3. Route Structure

Bearblog uses a dual-route structure:

1. **Dashboard access** via the main domain: `bearblog.dev/username/dashboard/`
2. **Public blog access** via subdomain: `username.bearblog.dev/`

### Main App Routes

Create the following routes for the main app:

```
/app/[username]/dashboard/page.tsx               # User dashboard home
/app/[username]/dashboard/posts/page.tsx         # Manage all posts
/app/[username]/dashboard/posts/new/page.tsx     # Create new post
/app/[username]/dashboard/posts/edit/[id]/page.tsx  # Edit post
/app/[username]/dashboard/theme/page.tsx         # Theme settings
/app/[username]/dashboard/settings/page.tsx      # General settings
/app/[username]/dashboard/domain/page.tsx        # Domain settings
/app/[username]/dashboard/preview/page.tsx       # Preview blog
```

### Subdomain Handling

Create a dynamic route handler for subdomains:

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  
  // Skip for main domain and special subdomains
  if (hostname === 'minispace.dev' || 
      hostname === 'www.minispace.dev' || 
      hostname.startsWith('api.')) {
    return NextResponse.next();
  }
  
  // Handle subdomain
  if (hostname.endsWith('.minispace.dev')) {
    const subdomain = hostname.split('.')[0];
    
    // Rewrite to the blog renderer
    url.pathname = `/api/blog/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip static files and API routes
    '/((?!_next|static|favicon.ico|.*\\.).*)',
  ],
};
```

### Blog Renderer API Route

```typescript
// app/api/blog/[username]/[[...path]]/route.tsx
import { NextRequest } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function GET(request: NextRequest, { params }: { params: { username: string, path?: string[] } }) {
  const { username, path = [] } = params;
  
  // Fetch user and blog data
  const usersRef = collection(db, 'users');
  const userQuery = query(usersRef, where('username', '==', username));
  const userSnapshot = await getDocs(userQuery);
  
  if (userSnapshot.empty) {
    return new Response('Blog not found', { status: 404 });
  }
  
  const userData = userSnapshot.docs[0].data();
  const userId = userSnapshot.docs[0].id;
  
  // Render the appropriate content based on path
  if (path.length === 0) {
    // Home page
    return new Response(
      renderBlogHTML(userData, null, 'home'),
      { headers: { 'Content-Type': 'text/html' } }
    );
  } else if (path[0] === 'blog' && path.length > 1) {
    // Blog post
    const postSlug = path[1];
    // Fetch post data
    // ...
    return new Response(
      renderBlogHTML(userData, postData, 'post'),
      { headers: { 'Content-Type': 'text/html' } }
    );
  } else {
    // Custom page
    const pageSlug = path[0];
    // Fetch page data
    // ...
    return new Response(
      renderBlogHTML(userData, pageData, 'page'),
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}

// Helper function to render blog HTML
function renderBlogHTML(userData, contentData, type) {
  // Generate minimal HTML with inline styles
  // ...
}
```

## 4. Database Schema

### User Schema
Add the following fields to the user document in Firestore:

```typescript
interface UserDocument {
  // Existing fields...
  username: string;               // Used for the subdomain
  enableBlog: boolean;            // Whether the blog is active
  blogTitle: string;              // Title of the blog
  blogDescription: string;        // Description of the blog
  customDomain?: string;          // Optional custom domain
  blogSettings: {
    navStyle: 'minimal' | 'centered' | 'sidebar';
    footerText: string;
    customCSS: string;
    favicon: string;
  }
}
```

### Blog Posts Collection
Create a `posts` collection in Firestore:

```typescript
interface PostDocument {
  id: string;
  authorId: string;         // User ID
  title: string;            // Post title
  slug: string;             // URL slug
  content: string;          // Markdown content
  excerpt?: string;         // Optional short excerpt
  isPublished: boolean;     // Whether the post is published
  isPage: boolean;          // Whether this is a page or blog post
  tags?: string[];          // Optional tags for categorization
  publishedDate: Timestamp; // When to publish the post
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

The `isPage` field is crucial - it determines whether the post appears in the blog feed (false) or acts as a standalone page (true), exactly like bearblog.

## 5. Blog Components

### Blog Layout Component
Create a minimal blog layout that's completely separate from your main app layout:

```typescript
// components/blog/BlogLayout.tsx
export default function BlogLayout({ 
  children, 
  userData, 
  blogSettings 
}: { 
  children: React.ReactNode;
  userData: any;
  blogSettings: any;
}) {
  // Generate minimal inline CSS
  const styles = `
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 650px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    /* More minimal styles... */
    
    /* Custom CSS */
    ${blogSettings?.customCSS || ''}
  `;

  return (
    <html lang="en">
      <head>
        <title>{userData.blogTitle || userData.username}</title>
        <meta name="description" content={userData.blogDescription || ''} />
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        {/* No external CSS or JS */}
      </head>
      <body>
        <header>
          <h1>{userData.blogTitle || userData.username}</h1>
          <nav>
            {/* Navigation links */}
          </nav>
        </header>
        <main>{children}</main>
        <footer dangerouslySetInnerHTML={{ __html: blogSettings?.footerText || 'Powered by MINISPACE' }} />
      </body>
    </html>
  );
}
```

## 6. Dashboard Pages

Based on bearblog's actual structure, create the following dashboard pages:

### Dashboard Home
`/app/[username]/dashboard/page.tsx` - Main dashboard with overview and quick links

### Posts Management
`/app/[username]/dashboard/posts/page.tsx` - List all posts and pages
`/app/[username]/dashboard/posts/new/page.tsx` - Create new post or page
  - Add `?is_page=True` query parameter to create a page instead of a post
`/app/[username]/dashboard/posts/edit/[id]/page.tsx` - Edit existing post or page

### Theme Settings
`/app/[username]/dashboard/theme/page.tsx` - Customize blog appearance:
- Choose theme template
- Custom CSS
- Navigation style
- Footer text

### General Settings
`/app/[username]/dashboard/settings/page.tsx` - Basic blog settings:
- Blog title and description
- Username (subdomain)
- Privacy options
- SEO settings

### Domain Settings
`/app/[username]/dashboard/domain/page.tsx` - Custom domain configuration:
- Add custom domain
- View DNS setup instructions
- Verify domain status

### Preview
`/app/[username]/dashboard/preview/page.tsx` - Preview blog changes:
- Preview homepage
- Preview specific posts/pages

## 7. Performance Optimizations

To ensure blogs are lightweight and fast (like bearblog):

1. **Zero JavaScript**: No client-side JS for blog pages
2. **Inline CSS**: All styles inlined in the head
3. **No External Resources**: No external fonts, stylesheets, or scripts
4. **Static Generation**: Pre-render pages at build time where possible
5. **Minimal HTML**: Keep the HTML structure simple and clean
6. **Efficient Caching**: Set long cache times for static content
7. **Text-focused**: Prioritize text content over images and media

## 8. Custom Domain Support

Implement custom domain support similar to bearblog:

1. Allow users to enter their custom domain in settings
2. Provide DNS instructions (CNAME or A records)
3. Verify domain ownership
4. Configure your hosting provider to accept the custom domains
5. Issue SSL certificates for custom domains

## 9. Rename App from MINI to MINISPACE

1. Update `package.json` name field
2. Update all references to "MINI" in the codebase to "MINISPACE"
3. Update metadata, titles, and descriptions
4. Update logos and branding assets
