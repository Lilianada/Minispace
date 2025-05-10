"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Monitor, Tablet, Smartphone, ExternalLink, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface LayoutPreviewProps {
  username: string
  selectedLayout: string
  fontFamily: string
  headerText?: string
  footerText?: string
  accentColor?: string
  backgroundColor?: string
  textColor?: string
}

export function LayoutPreview({
  username,
  selectedLayout,
  fontFamily,
  headerText,
  footerText,
  accentColor = "#3b82f6",
  backgroundColor = "#ffffff",
  textColor = "#000000"
}: LayoutPreviewProps) {
  const [viewportSize, setViewportSize] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isLoading, setIsLoading] = useState(true)
  const [previewType, setPreviewType] = useState<"home" | "post" | "page">("home")
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Update iframe content when props change
  useEffect(() => {
    if (!iframeRef.current) return
    
    setIsLoading(true)
    
    // Get font family CSS
    const getFontFamily = (font: string) => {
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
    
    // Common CSS for all layouts
    const commonCSS = `
      body {
        margin: 0;
        padding: 0;
        font-family: ${getFontFamily(fontFamily)};
        line-height: 1.6;
        color: ${textColor};
        background-color: ${backgroundColor};
      }
      
      a {
        color: ${accentColor};
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
    
    // Layout-specific CSS
    let layoutCSS = ''
    let headerHTML = ''
    let footerHTML = ''
    let contentHTML = ''
    
    // Generate layout-specific styles and HTML
    switch (selectedLayout) {
      case 'classic-columnist':
        layoutCSS = `
          header {
            border-bottom: 1px solid rgba(0,0,0,0.1);
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
          }
        `
        
        headerHTML = `
          <header>
            <div class="container">
              <div style="display: flex; align-items: center; height: 60px;">
                <div style="font-weight: 600;">${headerText || username}</div>
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
              ${footerText || `© ${new Date().getFullYear()} ${username}`}
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
                    <p>This is a preview of your site with the Classic Columnist layout. The content is centered with an optional sidebar for categories or table of contents.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
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
                    <div style="opacity: 0.6; font-size: 0.9rem; margin-bottom: 1.5rem;">May 10, 2025 · 5 min read</div>
                    <p>This is a sample blog post using the Classic Columnist layout. The content is centered with a sidebar for table of contents.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    <h2>Getting Started</h2>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
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
                  <p>This is a sample about page using the Classic Columnist layout. The content is centered for optimal readability.</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  <h2>My Background</h2>
                  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                </div>
              </div>
            </main>
          `
        }
        break
        
      case 'modern-card-deck':
        layoutCSS = `
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
            background: linear-gradient(to right, ${accentColor}20, ${accentColor}10);
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
            opacity: 0.7;
            font-size: 0.9rem;
          }
          
          .card-footer {
            padding: 1rem 1.5rem;
            border-top: 1px solid rgba(0,0,0,0.1);
            font-size: 0.9rem;
            color: ${accentColor};
          }
          
          footer {
            border-top: 1px solid rgba(0,0,0,0.1);
            background-color: rgba(0,0,0,0.02);
            font-size: 0.8rem;
            text-align: center;
            padding: 1.5rem 0;
          }
        `
        
        headerHTML = `
          <header>
            <div class="container">
              <div style="display: flex; align-items: center; height: 60px;">
                <div style="font-weight: 600;">${headerText || username}</div>
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
              ${footerText || `© ${new Date().getFullYear()} ${username}`}
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
                  <div class="card">
                    <div class="card-image"></div>
                    <div class="card-content">
                      <div class="card-title">Project 1</div>
                      <div class="card-description">This is a preview of the Modern Card Deck layout with a responsive grid layout of cards.</div>
                    </div>
                    <div class="card-footer">
                      <a href="#" style="display: flex; align-items: center;">
                        View Project
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 0.5rem;"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </a>
                    </div>
                  </div>
                  <div class="card">
                    <div class="card-image"></div>
                    <div class="card-content">
                      <div class="card-title">Project 2</div>
                      <div class="card-description">This is a preview of the Modern Card Deck layout with a responsive grid layout of cards.</div>
                    </div>
                    <div class="card-footer">
                      <a href="#" style="display: flex; align-items: center;">
                        View Project
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 0.5rem;"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </a>
                    </div>
                  </div>
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
                  <div style="opacity: 0.6; font-size: 0.9rem; margin-bottom: 1.5rem;">May 10, 2025 · 5 min read</div>
                  <p>This is a sample blog post using the Modern Card Deck layout. The content is centered for optimal readability.</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  <h2>Related Projects</h2>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem;">
                  <div class="card">
                    <div class="card-image"></div>
                    <div class="card-content">
                      <div class="card-title">Related Project 1</div>
                      <div class="card-description">A related project that demonstrates the concepts discussed in this article.</div>
                    </div>
                    <div class="card-footer">
                      <a href="#" style="display: flex; align-items: center;">
                        View Project
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 0.5rem;"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </a>
                    </div>
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
                  <p>This is a sample about page using the Modern Card Deck layout. The content is centered for optimal readability.</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  <h2>My Skills</h2>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; margin-top: 2rem;">
                  <div class="card">
                    <div class="card-content">
                      <div class="card-title">Skill Category 1</div>
                      <div class="card-description">A description of my skills and expertise in this particular area.</div>
                    </div>
                  </div>
                  <div class="card">
                    <div class="card-content">
                      <div class="card-title">Skill Category 2</div>
                      <div class="card-description">A description of my skills and expertise in this particular area.</div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          `
        }
        break
        
      case 'minimalist-focus':
        layoutCSS = `
          .progress-bar {
            height: 2px;
            background-color: ${accentColor};
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
            border: 1px solid rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .menu-button-line {
            width: 1rem;
            height: 2px;
            background-color: rgba(0,0,0,0.6);
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
            border-top: 1px solid rgba(0,0,0,0.1);
            font-size: 0.8rem;
            padding: 1.5rem 0;
          }
        `
        
        headerHTML = `
          <div class="progress-bar" style="width: 30%;"></div>
          <header>
            <div class="container">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="font-weight: 500; font-size: 0.9rem;">${headerText || username}</div>
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
                <div>${footerText || `© ${new Date().getFullYear()} ${username}`}</div>
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
                  <p>This is a preview of the Minimalist Focus layout. It features a clean, distraction-free layout with a reading progress bar at the top. The navigation is hidden by default and appears on hover or scroll.</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  <h2>Recent Thoughts</h2>
                  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
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
                  <div style="opacity: 0.6; font-size: 0.9rem; margin-bottom: 2rem;">May 10, 2025 · 5 min read</div>
                  <p>This is a sample blog post using the Minimalist Focus layout. The content is centered for optimal readability with generous whitespace.</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  <h2>Finding Focus</h2>
                  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
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
                  <p>This is a sample about page using the Minimalist Focus layout. The content is centered for optimal readability with generous whitespace.</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  <h2>My Philosophy</h2>
                  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                </div>
              </div>
            </main>
          `
        }
        break
        
      default:
        // Default to classic-columnist if layout is not recognized
        layoutCSS = ``
        headerHTML = `<header><div class="container">Default Layout</div></header>`
        contentHTML = `<main><div class="container">Content</div></main>`
        footerHTML = `<footer><div class="container">Footer</div></footer>`
    }
    
    // Combine all HTML parts
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${headerText || username} - Layout Preview</title>
        <style>
          ${commonCSS}
          ${layoutCSS}
        </style>
      </head>
      <body>
        ${headerHTML}
        ${contentHTML}
        ${footerHTML}
      </body>
      </html>
    `
    
    // Update iframe content using document.write
    const iframe = iframeRef.current
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
    
    if (iframeDoc) {
      iframeDoc.open()
      iframeDoc.write(html)
      iframeDoc.close()
      setIsLoading(false)
    }
  }, [username, selectedLayout, fontFamily, headerText, footerText, previewType, accentColor, backgroundColor, textColor, viewportSize])
  
  // Get viewport dimensions based on selected size
  const getViewportStyle = () => {
    switch (viewportSize) {
      case "desktop":
        return { width: "100%", height: "600px", maxWidth: "1200px" }
      case "tablet":
        return { width: "768px", height: "600px" }
      case "mobile":
        return { width: "375px", height: "600px" }
    }
  }
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center">
              Layout Preview
              <Badge variant="outline" className="ml-2 text-xs font-normal">
                {selectedLayout.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Badge>
            </CardTitle>
            <CardDescription>
              Preview how your site will look with the selected layout and settings
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-1 bg-background/80 rounded-md p-1">
            <Button 
              variant={viewportSize === "desktop" ? "default" : "ghost"} 
              size="icon" 
              className="h-7 w-7"
              onClick={() => setViewportSize("desktop")}
            >
              <Monitor className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant={viewportSize === "tablet" ? "default" : "ghost"} 
              size="icon" 
              className="h-7 w-7"
              onClick={() => setViewportSize("tablet")}
            >
              <Tablet className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant={viewportSize === "mobile" ? "default" : "ghost"} 
              size="icon" 
              className="h-7 w-7"
              onClick={() => setViewportSize("mobile")}
            >
              <Smartphone className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        <Tabs value={previewType} onValueChange={(v) => setPreviewType(v as any)} className="mt-3">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="post">Blog Post</TabsTrigger>
            <TabsTrigger value="page">About Page</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="flex justify-center bg-background/50 border-t overflow-auto p-4">
          <div 
            className="relative transition-all duration-300 flex items-center justify-center"
            style={getViewportStyle()}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <div className="flex flex-col items-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="mt-2 text-sm text-muted-foreground">Loading preview...</span>
                </div>
              </div>
            )}
            
            <iframe 
              ref={iframeRef}
              className="w-full h-full border rounded-md"
              title="Layout Preview"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 border-t bg-muted/10">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Layout:</span> {selectedLayout.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            <span className="mx-2">•</span>
            <span className="font-medium">Font:</span> {fontFamily.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </div>
          
          <Button variant="outline" size="sm" className="text-xs h-7" asChild>
            <a href={`https://${username}.minispace.dev`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              View Live Site
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
