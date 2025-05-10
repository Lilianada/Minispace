import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import UserNavigation from '../components/user-navigation'
import UserPagesGrid from '../components/user-pages-grid'

// Cache the user data fetch with Next.js cache to improve performance
const getUserByUsername = unstable_cache(
  async (username: string) => {
    try {
      // Query the Users collection to find a user with the matching username
      const usersRef = collection(db, 'Users')
      const q = query(usersRef, where('username', '==', username))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        return null
      }
      
      // Get the first matching user
      const userDoc = querySnapshot.docs[0]
      return {
        id: userDoc.id,
        ...userDoc.data()
      }
    } catch (error) {
      console.error('Error fetching user by username:', error)
      return null
    }
  },
  ['user-by-username'],
  {
    revalidate: 3600, // Revalidate every hour
    tags: ['user-data']
  }
)

// Define TypeScript interfaces for better type safety
interface UserData {
  id: string;
  username: string;
  headerText?: string;
  footerText?: string;
  selectedLayout?: string;
  fontFamily?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  bio?: string;
  [key: string]: any; // For other potential properties
}

interface PageData {
  id: string;
  title: string;
  slug: string;
  content: string;
  isHomePage?: boolean;
  description?: string;
  createdAt?: any;
  updatedAt?: any;
  [key: string]: any; // For other potential properties
}

// Cache the page data fetch with Next.js cache
const getPageBySlug = unstable_cache(
  async (userId: string, slug: string): Promise<PageData | null> => {
    try {
      // Query the pages subcollection to find a page with the matching slug
      const pagesRef = collection(db, `Users/${userId}/pages`)
      const q = query(pagesRef, where('slug', '==', slug))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        // If no page matches the slug, check if there's a home page (for the root path)
        if (slug === '') {
          const homePageQuery = query(pagesRef, where('isHomePage', '==', true))
          const homePageSnapshot = await getDocs(homePageQuery)
          
          if (!homePageSnapshot.empty) {
            const homePageDoc = homePageSnapshot.docs[0]
            return {
              id: homePageDoc.id,
              ...homePageDoc.data()
            } as PageData
          }
        }
        return null
      }
      
      // Get the first matching page
      const pageDoc = querySnapshot.docs[0]
      return {
        id: pageDoc.id,
        ...pageDoc.data()
      } as PageData
    } catch (error) {
      console.error('Error fetching page by slug:', error)
      return null
    }
  },
  ['page-by-slug'],
  {
    revalidate: 60, // Revalidate every minute for fresh content
    tags: ['page-data']
  }
)

// Generate metadata for the page
export async function generateMetadata({
  params
}: {
  params: { username: string; slug?: string[] }
}): Promise<Metadata> {
  const { username, slug = [] } = params
  const slugPath = slug.join('/')
  
  // Fetch user data
  const userData = await getUserByUsername(username) as UserData | null
  
  if (!userData) {
    return {
      title: 'User Not Found',
      description: 'The requested user does not exist.'
    }
  }
  
  // Fetch page data
  const pageData = await getPageBySlug(userData.id, slugPath)
  
  if (!pageData) {
    return {
      title: `${userData.username} - Page Not Found`,
      description: `This page does not exist on ${userData.username}'s site.`
    }
  }
  
  return {
    title: `${pageData.title} | ${userData.username}`,
    description: pageData.description || `A page on ${userData.username}'s site.`
  }
}

// Main page component
export default async function SubdomainPage({
  params
}: {
  params: { username: string; slug?: string[] }
}) {
  const { username, slug = [] } = params
  const slugPath = slug.join('/')
  
  // We'll skip draft mode for now as it's not needed for the initial implementation
  
  // Fetch user data
  const userData = await getUserByUsername(username) as UserData | null
  
  if (!userData) {
    notFound()
  }
  
  // Fetch page data
  const pageData = await getPageBySlug(userData.id, slugPath)
  
  if (!pageData) {
    notFound()
  }
  
  // Extract user settings for styling
  const {
    headerText = userData.username,
    footerText = `© ${new Date().getFullYear()} ${userData.username}`,
    selectedLayout = 'classic-columnist',
    fontFamily = 'inter',
    accentColor = '#3b82f6',
    backgroundColor = '#ffffff',
    textColor = '#000000'
  } = userData

  // Generate CSS based on user settings
  const userStyles = `
    :root {
      --font-family: ${getFontFamily(fontFamily)};
      --text-color: ${textColor};
      --background-color: ${backgroundColor};
      --accent-color: ${accentColor};
    }
    
    body {
      font-family: var(--font-family);
      color: var(--text-color);
      background-color: var(--background-color);
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }
    
    a {
      color: var(--accent-color);
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .prose {
      max-width: 65ch;
      margin: 0 auto;
    }
    
    .prose h1 {
      font-size: 2rem;
      margin-top: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .prose h2 {
      font-size: 1.5rem;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }
    
    .prose p {
      margin-bottom: 1.25rem;
    }
    
    /* Layout-specific styles */
    ${getLayoutStyles(selectedLayout, accentColor)}
  `
  
  // Render the page with the appropriate layout
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: userStyles }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Lora:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Fira+Code:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {renderLayout(selectedLayout, {
          username,
          headerText,
          footerText,
          pageData,
          userId: userData.id
        })}
      </body>
    </html>
  )
}

// Helper function to get font family CSS
function getFontFamily(font: string): string {
  switch (font) {
    case 'inter': return "'Inter', system-ui, sans-serif"
    case 'montserrat': return "'Montserrat', system-ui, sans-serif"
    case 'poppins': return "'Poppins', system-ui, sans-serif"
    case 'satoshi': return "'Satoshi', system-ui, sans-serif"
    case 'geist': return "'Geist', system-ui, sans-serif"
    case 'geist-mono': return "'Geist Mono', monospace"
    case 'playfair': return "'Playfair Display', Georgia, serif"
    case 'merriweather': return "'Merriweather', Georgia, serif"
    case 'lora': return "'Lora', Georgia, serif"
    case 'georgia': return "Georgia, serif"
    case 'jetbrains': return "'JetBrains Mono', monospace"
    case 'fira': return "'Fira Code', monospace"
    case 'source-code': return "'Source Code Pro', monospace"
    default: return "system-ui, sans-serif"
  }
}

// Helper function to get layout-specific CSS
function getLayoutStyles(layout: string, accentColor: string): string {
  switch (layout) {
    case 'classic-columnist':
      return `
        header {
          border-bottom: 1px solid rgba(0,0,0,0.1);
          padding: 1rem 0;
        }
        
        nav a {
          margin: 0 1rem;
          font-size: 0.9rem;
        }
        
        .sidebar {
          border-right: 1px solid rgba(0,0,0,0.1);
          padding-right: 2rem;
        }
        
        .sidebar-title {
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .sidebar-item {
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
        
        footer {
          border-top: 1px solid rgba(0,0,0,0.1);
          background-color: rgba(0,0,0,0.02);
          font-size: 0.8rem;
          text-align: center;
          padding: 1rem 0;
          margin-top: 2rem;
        }
      `
    case 'modern-card-deck':
      return `
        header {
          background: linear-gradient(to right, ${accentColor}20, ${accentColor}10);
          padding: 1rem 0;
        }
        
        nav a {
          margin-left: 1.5rem;
          font-size: 0.9rem;
        }
        
        .card {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px rgba(0,0,0,0.1);
        }
        
        .card-header {
          padding: 1rem;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        
        .card-content {
          padding: 1rem;
        }
        
        footer {
          background-color: rgba(0,0,0,0.03);
          font-size: 0.8rem;
          text-align: center;
          padding: 1rem 0;
          margin-top: 2rem;
        }
      `
    case 'minimalist-focus':
      return `
        body {
          line-height: 1.7;
        }
        
        header {
          padding: 1.5rem 0;
        }
        
        .header-accent {
          height: 3px;
          width: 60px;
          background-color: var(--accent-color);
          margin-bottom: 1.5rem;
        }
        
        nav a {
          margin-left: 2rem;
          font-size: 0.9rem;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        
        nav a:hover {
          opacity: 1;
        }
        
        .content {
          max-width: 680px;
          margin: 0 auto;
          padding: 2rem 0;
        }
        
        footer {
          font-size: 0.8rem;
          text-align: center;
          padding: 2rem 0;
          opacity: 0.7;
        }
      `
    default:
      return ''
  }
}

// Helper function to render the layout with content
function renderLayout(layout: string, props: {
  username: string
  headerText: string
  footerText: string
  pageData: PageData
  userId: string
}) {
  const { username, headerText, footerText, pageData, userId } = props
  
  switch (layout) {
    case 'classic-columnist':
      return (
        <>
          <header>
            <div className="container">
              <div style={{ display: 'flex', alignItems: 'center', height: '60px' }}>
                <a href="/" style={{ fontWeight: 600, color: 'inherit', textDecoration: 'none' }}>{headerText}</a>
                <nav style={{ marginLeft: 'auto', display: 'flex' }}>
                  {/* Client-side component for dynamic navigation */}
                  <UserNavigation userId={userId} className="flex gap-4" />
                </nav>
              </div>
            </div>
          </header>
          
          <main style={{ padding: '2rem 0' }}>
            <div className="container" style={{ display: 'flex' }}>
              <aside className="sidebar" style={{ width: '250px' }}>
                <div className="sidebar-title">Navigation</div>
                {/* Client-side component for dynamic navigation */}
                <UserNavigation userId={userId} />
              </aside>
              <div style={{ flex: 1, paddingLeft: '2rem' }}>
                <div className="prose">
                  <h1>{pageData.title}</h1>
                  <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
                </div>
              </div>
            </div>
          </main>
          
          <footer>
            <div className="container">
              {footerText}
            </div>
          </footer>
        </>
      )
      
    case 'modern-card-deck':
      return (
        <>
          <header>
            <div className="container">
              <div style={{ display: 'flex', alignItems: 'center', height: '60px' }}>
                <a href="/" style={{ fontWeight: 600, color: 'inherit', textDecoration: 'none' }}>{headerText}</a>
                <nav style={{ marginLeft: 'auto', display: 'flex', gap: '1.5rem' }}>
                  {/* Client-side component for dynamic navigation */}
                  <UserNavigation userId={userId} className="flex gap-6" />
                </nav>
              </div>
            </div>
          </header>
          
          <main style={{ padding: '2rem 0' }}>
            <div className="container">
              {pageData.isHomePage ? (
                <>
                  <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>{pageData.title}</h1>
                  <div className="grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1.5rem'
                  }}>
                    {/* We'll fetch and display user pages dynamically */}
                    <UserPagesGrid userId={userId} />
                  </div>
                </>
              ) : (
                <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                  <div className="card-header">
                    <h1 style={{ margin: 0 }}>{pageData.title}</h1>
                  </div>
                  <div className="card-content">
                    <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
                  </div>
                </div>
              )}
            </div>
          </main>
          
          <footer>
            <div className="container">
              {footerText}
            </div>
          </footer>
        </>
      )
      
    case 'minimalist-focus':
      return (
        <>
          <header>
            <div className="container">
              <div className="header-accent"></div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <a href="/" style={{ fontWeight: 500, color: 'inherit', textDecoration: 'none' }}>{headerText}</a>
                <nav>
                  {/* Client-side component for dynamic navigation */}
                  <UserNavigation userId={userId} className="flex gap-8" />
                </nav>
              </div>
            </div>
          </header>
          
          <main>
            <div className="content">
              <h1>{pageData.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
              
              {/* If this is the home page, show a few other pages */}
              {pageData.isHomePage && (
                <div className="other-pages" style={{ marginTop: '3rem' }}>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Explore More</h2>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '1.5rem'
                  }}>
                    <UserPagesGrid userId={userId} maxPages={3} />
                  </div>
                </div>
              )}
            </div>
          </main>
          
          <footer>
            <div className="container">
              {footerText}
            </div>
          </footer>
        </>
      )
      
    default:
      return (
        <>
          <header>
            <div className="container" style={{ padding: '1rem 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <a href="/" style={{ fontWeight: 600, fontSize: '1.5rem', color: 'inherit', textDecoration: 'none' }}>{headerText}</a>
                <nav>
                  {/* Client-side component for dynamic navigation */}
                  <UserNavigation userId={userId} className="flex gap-4" />
                </nav>
              </div>
            </div>
          </header>
          
          <main style={{ padding: '2rem 0' }}>
            <div className="container">
              <h1 style={{ marginBottom: '1.5rem' }}>{pageData.title}</h1>
              <div className="prose" dangerouslySetInnerHTML={{ __html: pageData.content }} />
            </div>
          </main>
          
          <footer style={{ marginTop: '2rem', padding: '1rem 0', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            <div className="container">
              {footerText}
            </div>
          </footer>
        </>
      )
  }
}
