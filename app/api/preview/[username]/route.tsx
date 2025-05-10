import { NextRequest, NextResponse } from 'next/server'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// This API route serves as a staging/preview environment for theme testing
export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const { username } = params
  const searchParams = request.nextUrl.searchParams
  
  // Get theme settings from query parameters
  const theme = searchParams.get('theme') || 'classic-columnist'
  const font = searchParams.get('font') || 'inter'
  const header = searchParams.get('header') || username
  const footer = searchParams.get('footer') || `© ${new Date().getFullYear()} ${username}`
  const previewType = searchParams.get('type') || 'home'
  
  try {
    // Get user data to ensure the user exists
    const usersRef = doc(db, 'User', username)
    const userDoc = await getDoc(usersRef)
    
    if (!userDoc.exists()) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    // Generate HTML for the preview based on theme and content type
    const html = generatePreviewHTML(username, theme, font, header, footer, previewType)
    
    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    })
  } catch (error) {
    console.error('Error generating preview:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to generate preview' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// Generate HTML for the preview based on theme and content type
function generatePreviewHTML(
  username: string,
  theme: string,
  font: string,
  header: string,
  footer: string,
  previewType: string
) {
  // Common CSS for all themes
  const commonCSS = `
    body {
      margin: 0;
      padding: 0;
      font-family: ${getFontFamily(font)};
      line-height: 1.6;
    }
    
    a {
      color: inherit;
      text-decoration: none;
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
  `
  
  // Theme-specific CSS
  let themeCSS = ''
  let headerHTML = ''
  let footerHTML = ''
  let contentHTML = ''
  
  // Generate theme-specific styles and HTML
  switch (theme) {
    case 'classic-columnist':
      themeCSS = `
        body {
          color: #333;
          background-color: #fff;
        }
        
        header {
          border-bottom: 1px solid #eaeaea;
          background-color: #fff;
        }
        
        nav a {
          margin: 0 1rem;
          font-size: 0.9rem;
          color: #555;
        }
        
        nav a:hover {
          color: #000;
        }
        
        .sidebar {
          border-right: 1px solid #eaeaea;
          padding-right: 2rem;
        }
        
        .sidebar-title {
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .sidebar-item {
          color: #666;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
        
        footer {
          border-top: 1px solid #eaeaea;
          background-color: #f9f9f9;
          color: #666;
          font-size: 0.8rem;
          text-align: center;
          padding: 1rem 0;
        }
      `
      
      headerHTML = `
        <header>
          <div class="container">
            <div style="display: flex; align-items: center; height: 60px;">
              <div style="font-weight: 600;">${header}</div>
              <nav style="margin-left: auto; display: flex;">
                <a href="#">Blog</a>
                <a href="#">About</a>
                <a href="#">Contact</a>
              </nav>
            </div>
          </div>
        </header>
      `
      
      footerHTML = `
        <footer>
          <div class="container">
            ${footer}
          </div>
        </footer>
      `
      
      // Content based on preview type
      if (previewType === 'home') {
        contentHTML = `
          <main style="padding: 2rem 0;">
            <div class="container" style="display: flex;">
              <aside class="sidebar" style="width: 250px;">
                <div class="sidebar-title">Categories</div>
                <div class="sidebar-item">Technology</div>
                <div class="sidebar-item">Travel</div>
                <div class="sidebar-item">Lifestyle</div>
                <div class="sidebar-item">Food</div>
              </aside>
              <div style="flex: 1; padding-left: 2rem;">
                <div class="prose">
                  <h1>Welcome to ${username}'s Blog</h1>
                  <p>This is a preview of your site with the Classic Columnist theme. The content is centered with an optional sidebar for categories or table of contents.</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                  <h2>Recent Posts</h2>
                  <p>Here are some of my recent articles that you might find interesting.</p>
                </div>
              </div>
            </div>
          </main>
        `
      } else if (previewType === 'post') {
        contentHTML = `
          <main style="padding: 2rem 0;">
            <div class="container" style="display: flex;">
              <aside class="sidebar" style="width: 250px;">
                <div class="sidebar-title">Table of Contents</div>
                <div class="sidebar-item">Introduction</div>
                <div class="sidebar-item">Getting Started</div>
                <div class="sidebar-item">Advanced Techniques</div>
                <div class="sidebar-item">Conclusion</div>
              </aside>
              <div style="flex: 1; padding-left: 2rem;">
                <div class="prose">
                  <h1>How to Build a Beautiful Blog</h1>
                  <div style="color: #666; font-size: 0.9rem; margin-bottom: 1.5rem;">May 9, 2025 · 5 min read</div>
                  <p>This is a sample blog post using the Classic Columnist theme. The content is centered with a sidebar for table of contents.</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                  <h2>Getting Started</h2>
                  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
              </div>
            </div>
          </main>
        `
      } else {
        contentHTML = `
          <main style="padding: 2rem 0;">
            <div class="container">
              <div class="prose" style="margin: 0 auto;">
                <h1>About Me</h1>
                <p>This is a sample about page using the Classic Columnist theme. The content is centered for optimal readability.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <h2>My Background</h2>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
            </div>
          </main>
        `
      }
      break
      
    case 'modern-card-deck':
      themeCSS = `
        body {
          color: #333;
          background-color: #fafafa;
        }
        
        header {
          background: linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.1));
          padding: 1rem 0;
        }
        
        nav a {
          margin-left: 1.5rem;
          font-size: 0.9rem;
          color: #333;
        }
        
        .card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s, box-shadow 0.2s;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        
        .card-image {
          height: 180px;
          background: linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.1));
        }
        
        .card-content {
          padding: 1.5rem;
          flex: 1;
        }
        
        .card-title {
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .card-description {
          color: #666;
          font-size: 0.9rem;
        }
        
        .card-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid #eaeaea;
          font-size: 0.9rem;
          color: #3b82f6;
        }
        
        footer {
          border-top: 1px solid #eaeaea;
          background-color: #f5f5f5;
          color: #666;
          font-size: 0.8rem;
          text-align: center;
          padding: 1.5rem 0;
        }
      `
      
      headerHTML = `
        <header>
          <div class="container">
            <div style="display: flex; align-items: center; height: 60px;">
              <div style="font-weight: 600;">${header}</div>
              <nav style="margin-left: auto; display: flex;">
                <a href="#">Projects</a>
                <a href="#">Gallery</a>
                <a href="#">About</a>
              </nav>
            </div>
          </div>
        </header>
      `
      
      footerHTML = `
        <footer>
          <div class="container">
            ${footer}
          </div>
        </footer>
      `
      
      // Content based on preview type
      if (previewType === 'home') {
        contentHTML = `
          <main style="padding: 2rem 0;">
            <div class="container">
              <h1 style="margin-bottom: 2rem; text-align: center;">Featured Projects</h1>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;">
                ${Array.from({ length: 6 }).map((_, i) => `
                  <div class="card">
                    <div class="card-image"></div>
                    <div class="card-content">
                      <div class="card-title">Project ${i + 1}</div>
                      <div class="card-description">This is a preview of the Modern Card Deck theme with a responsive grid layout of cards.</div>
                    </div>
                    <div class="card-footer">
                      <a href="#" style="display: flex; align-items: center;">
                        View Project
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 0.5rem;"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </a>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </main>
        `
      } else if (previewType === 'post') {
        contentHTML = `
          <main style="padding: 2rem 0;">
            <div class="container">
              <div class="prose" style="margin: 0 auto;">
                <h1>Creating a Card-Based Portfolio</h1>
                <div style="color: #666; font-size: 0.9rem; margin-bottom: 1.5rem;">May 9, 2025 · 5 min read</div>
                <p>This is a sample blog post using the Modern Card Deck theme. The content is centered for optimal readability.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <h2>Related Projects</h2>
              </div>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem;">
                ${Array.from({ length: 3 }).map((_, i) => `
                  <div class="card">
                    <div class="card-image"></div>
                    <div class="card-content">
                      <div class="card-title">Related Project ${i + 1}</div>
                      <div class="card-description">A related project that demonstrates the concepts discussed in this article.</div>
                    </div>
                    <div class="card-footer">
                      <a href="#" style="display: flex; align-items: center;">
                        View Project
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 0.5rem;"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </a>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </main>
        `
      } else {
        contentHTML = `
          <main style="padding: 2rem 0;">
            <div class="container">
              <div class="prose" style="margin: 0 auto;">
                <h1>About Me</h1>
                <p>This is a sample about page using the Modern Card Deck theme. The content is centered for optimal readability.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <h2>My Skills</h2>
              </div>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; margin-top: 2rem;">
                ${Array.from({ length: 4 }).map((_, i) => `
                  <div class="card">
                    <div class="card-content">
                      <div class="card-title">Skill Category ${i + 1}</div>
                      <div class="card-description">A description of my skills and expertise in this particular area.</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </main>
        `
      }
      break
      
    case 'minimalist-focus':
      themeCSS = `
        body {
          color: #333;
          background-color: #fff;
        }
        
        .progress-bar {
          height: 2px;
          background-color: #3b82f6;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 100;
        }
        
        header {
          padding: 1.5rem 0;
        }
        
        .menu-button {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          border: 1px solid #eaeaea;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .menu-button-line {
          width: 1rem;
          height: 2px;
          background-color: #666;
        }
        
        .prose {
          font-size: 1.125rem;
        }
        
        .prose h1 {
          font-size: 2.5rem;
          font-weight: 700;
        }
        
        .prose h2 {
          font-size: 1.75rem;
          font-weight: 600;
        }
        
        footer {
          border-top: 1px solid #eaeaea;
          color: #666;
          font-size: 0.8rem;
          padding: 1.5rem 0;
        }
      `
      
      headerHTML = `
        <div class="progress-bar" style="width: 30%;"></div>
        <header>
          <div class="container">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="font-weight: 500; font-size: 0.9rem;">${header}</div>
              <div class="menu-button">
                <div class="menu-button-line"></div>
              </div>
            </div>
          </div>
        </header>
      `
      
      footerHTML = `
        <footer>
          <div class="container">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div>${footer}</div>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </div>
            </div>
          </div>
        </footer>
      `
      
      // Content based on preview type
      if (previewType === 'home') {
        contentHTML = `
          <main style="padding: 2rem 0;">
            <div class="container">
              <div class="prose" style="max-width: 680px; margin: 0 auto;">
                <h1>Distraction-free reading</h1>
                <p>This is a preview of the Minimalist Focus theme. It features a clean, distraction-free layout with a reading progress bar at the top. The navigation is hidden by default and appears on hover or scroll.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <h2>Recent Thoughts</h2>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
              </div>
            </div>
          </main>
        `
      } else if (previewType === 'post') {
        contentHTML = `
          <main style="padding: 2rem 0;">
            <div class="container">
              <div class="prose" style="max-width: 680px; margin: 0 auto;">
                <h1>The Art of Minimalism</h1>
                <div style="color: #666; font-size: 0.9rem; margin-bottom: 2rem;">May 9, 2025 · 5 min read</div>
                <p>This is a sample blog post using the Minimalist Focus theme. The content is centered for optimal readability with generous whitespace.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <h2>Finding Focus</h2>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
              </div>
            </div>
          </main>
        `
      } else {
        contentHTML = `
          <main style="padding: 2rem 0;">
            <div class="container">
              <div class="prose" style="max-width: 680px; margin: 0 auto;">
                <h1>About</h1>
                <p>This is a sample about page using the Minimalist Focus theme. The content is centered for optimal readability with generous whitespace.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <h2>My Philosophy</h2>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
              </div>
            </div>
          </main>
        `
      }
      break
      
    default:
      // Default to classic-columnist if theme is not recognized
      return generatePreviewHTML(username, 'classic-columnist', font, header, footer, previewType)
  }
  
  // Combine all HTML parts
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${header} - Theme Preview</title>
      <style>
        ${commonCSS}
        ${themeCSS}
      </style>
    </head>
    <body>
      ${headerHTML}
      ${contentHTML}
      ${footerHTML}
    </body>
    </html>
  `
}

// Helper function to get font family CSS based on font name
function getFontFamily(font: string) {
  switch (font) {
    case 'inter':
      return 'var(--font-inter), system-ui, sans-serif'
    case 'montserrat':
      return 'var(--font-montserrat), system-ui, sans-serif'
    case 'poppins':
      return 'var(--font-poppins), system-ui, sans-serif'
    case 'satoshi':
      return 'var(--font-satoshi), system-ui, sans-serif'
    case 'geist':
      return 'var(--font-geist), system-ui, sans-serif'
    case 'geist-mono':
      return 'var(--font-geist-mono), monospace'
    case 'playfair':
      return "'Playfair Display', Georgia, serif"
    case 'merriweather':
      return "'Merriweather', Georgia, serif"
    case 'lora':
      return "'Lora', Georgia, serif"
    case 'georgia':
      return "Georgia, serif"
    case 'jetbrains':
      return "'JetBrains Mono', monospace"
    case 'fira':
      return "'Fira Code', monospace"
    case 'source-code':
      return "'Source Code Pro', monospace"
    default:
      return 'system-ui, sans-serif'
  }
}
