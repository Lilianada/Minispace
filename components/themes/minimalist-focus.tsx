"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, MoreHorizontal, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface MinimalistFocusProps {
  siteTitle: string
  navigation: { title: string; href: string }[]
  content: React.ReactNode
  socialLinks?: { icon: React.ReactNode; href: string }[]
  footerText?: string
  fontFamily?: string
}

export function MinimalistFocus({
  siteTitle,
  navigation,
  content,
  socialLinks,
  footerText,
  fontFamily = 'font-sans'
}: MinimalistFocusProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showNav, setShowNav] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Handle scroll events for progress bar and navbar visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollHeight = document.body.scrollHeight - window.innerHeight
      
      // Calculate scroll progress
      if (scrollHeight > 0) {
        setScrollProgress((currentScrollY / scrollHeight) * 100)
      }
      
      // Show/hide navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNav(false)
      } else {
        setShowNav(true)
      }
      
      // Show/hide back to top button
      if (currentScrollY > 500) {
        setShowBackToTop(true)
      } else {
        setShowBackToTop(false)
      }
      
      setLastScrollY(currentScrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={`flex flex-col min-h-screen ${fontFamily}`}>
      {/* Progress Bar */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-50"
        style={{ width: `${scrollProgress}%` }}
      />
      
      {/* Navbar - hidden by default, appears on hover or scroll up */}
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ${
          showNav ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container flex h-16 items-center justify-between bg-background/80 backdrop-blur-md">
          <Link href="/" className="font-medium">
            {siteTitle}
          </Link>
          
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {navigation.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href}>{item.title}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-background z-50 flex flex-col">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="font-medium">
              {siteTitle}
            </Link>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="container flex-1 flex flex-col space-y-4 py-8">
            {navigation.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className="text-lg font-medium py-2 border-b"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-1 container py-20">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg">
            {content}
          </article>
        </div>
      </main>
      
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-2 rounded-full bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-shadow"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
      
      {/* Footer - fades in at the end */}
      <footer 
        className="border-t py-6"
        style={{ 
          opacity: scrollProgress > 90 ? 1 : scrollProgress > 80 ? (scrollProgress - 80) / 10 : 0,
          transition: 'opacity 0.3s ease'
        }}
      >
        <div className="container">
          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              {footerText || `© ${new Date().getFullYear()} ${siteTitle}`}
            </div>
            
            {socialLinks && socialLinks.length > 0 && (
              <Link 
                href={socialLinks[0].href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {socialLinks[0].icon}
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}

// Preview component for theme selection
export function MinimalistFocusPreview() {
  return (
    <div className="w-full h-full border rounded-md overflow-hidden flex flex-col">
      {/* Progress bar */}
      <div className="h-1 w-1/3 bg-primary/40"></div>
      
      {/* Hidden navbar hint */}
      <div className="h-8 flex items-center justify-between px-4 bg-background/60 text-xs text-muted-foreground">
        <div className="w-20 h-3 bg-muted/80 rounded-sm"></div>
        <div className="w-6 h-6 bg-muted/30 rounded-full flex items-center justify-center">
          <div className="w-4 h-1 bg-muted/80 rounded-sm"></div>
        </div>
      </div>
      
      {/* Content preview */}
      <div className="flex-1 p-6 flex flex-col items-center">
        <div className="w-3/4 max-w-md">
          <div className="w-full h-6 bg-muted rounded-sm mb-6"></div>
          
          <div className="space-y-3 mb-6">
            <div className="w-full h-3 bg-muted/60 rounded-sm"></div>
            <div className="w-full h-3 bg-muted/60 rounded-sm"></div>
            <div className="w-5/6 h-3 bg-muted/60 rounded-sm"></div>
          </div>
          
          <div className="w-2/3 h-5 bg-muted rounded-sm mb-4"></div>
          
          <div className="space-y-3">
            <div className="w-full h-3 bg-muted/60 rounded-sm"></div>
            <div className="w-full h-3 bg-muted/60 rounded-sm"></div>
            <div className="w-4/5 h-3 bg-muted/60 rounded-sm"></div>
          </div>
        </div>
      </div>
      
      {/* Minimal footer */}
      <div className="h-6 border-t flex items-center justify-between px-4">
        <div className="w-24 h-2 bg-muted/40 rounded-sm"></div>
        <div className="w-4 h-4 bg-muted/40 rounded-full"></div>
      </div>
    </div>
  )
}
