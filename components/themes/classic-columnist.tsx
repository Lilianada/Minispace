"use client"

import React from 'react'
import Link from 'next/link'
import { Search, User, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ClassicColumnistProps {
  siteTitle: string
  navigation: { title: string; href: string }[]
  content: React.ReactNode
  sidebar?: React.ReactNode
  footerText?: string
  socialLinks?: { icon: React.ReactNode; href: string }[]
  fontFamily?: string
}

export function ClassicColumnist({
  siteTitle,
  navigation,
  content,
  sidebar,
  footerText,
  socialLinks,
  fontFamily = 'font-serif'
}: ClassicColumnistProps) {
  return (
    <div className={`flex flex-col min-h-screen ${fontFamily}`}>
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="font-medium text-lg">
            {siteTitle}
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.title}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Optional Sidebar */}
          {sidebar && (
            <aside className="md:w-64 shrink-0 order-2 md:order-1">
              {sidebar}
            </aside>
          )}
          
          {/* Main Content */}
          <div className={`flex-1 order-1 md:order-2 ${sidebar ? 'md:max-w-3xl' : 'max-w-4xl mx-auto'}`}>
            <article className="prose">
              {content}
            </article>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <Link href="/" className="font-medium">
                {siteTitle}
              </Link>
              <p className="mt-1">{footerText || '© 2025. All rights reserved.'}</p>
            </div>
            
            {socialLinks && (
              <div className="flex items-center space-x-4">
                {socialLinks.map((link, i) => (
                  <Link key={i} href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.icon}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}

// Preview component for theme selection
export function ClassicColumnistPreview() {
  return (
    <div className="w-full h-full border rounded-md overflow-hidden flex flex-col">
      {/* Header preview */}
      <div className="h-10 border-b bg-background flex items-center px-4">
        <div className="w-24 h-4 bg-muted rounded-sm"></div>
        <div className="flex-1 flex justify-center">
          <div className="flex space-x-4">
            <div className="w-12 h-3 bg-muted rounded-sm"></div>
            <div className="w-12 h-3 bg-muted rounded-sm"></div>
            <div className="w-12 h-3 bg-muted rounded-sm"></div>
          </div>
        </div>
        <div className="w-8 h-4 bg-muted rounded-sm"></div>
      </div>
      
      {/* Content preview */}
      <div className="flex-1 p-4 flex">
        {/* Sidebar */}
        <div className="w-1/4 pr-4 hidden md:block">
          <div className="w-full h-4 bg-muted rounded-sm mb-2"></div>
          <div className="w-3/4 h-3 bg-muted/60 rounded-sm mb-2"></div>
          <div className="w-full h-3 bg-muted/60 rounded-sm mb-2"></div>
          <div className="w-5/6 h-3 bg-muted/60 rounded-sm"></div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <div className="w-3/4 h-6 bg-muted rounded-sm mb-4"></div>
          <div className="w-full h-3 bg-muted/60 rounded-sm mb-2"></div>
          <div className="w-full h-3 bg-muted/60 rounded-sm mb-2"></div>
          <div className="w-5/6 h-3 bg-muted/60 rounded-sm mb-4"></div>
          
          <div className="w-1/2 h-5 bg-muted rounded-sm mb-3"></div>
          <div className="w-full h-3 bg-muted/60 rounded-sm mb-2"></div>
          <div className="w-full h-3 bg-muted/60 rounded-sm mb-2"></div>
          <div className="w-3/4 h-3 bg-muted/60 rounded-sm"></div>
        </div>
      </div>
      
      {/* Footer preview */}
      <div className="h-8 border-t bg-muted/20 flex items-center px-4">
        <div className="w-20 h-3 bg-muted/60 rounded-sm"></div>
        <div className="flex-1"></div>
        <div className="flex space-x-2">
          <div className="w-4 h-4 bg-muted/60 rounded-full"></div>
          <div className="w-4 h-4 bg-muted/60 rounded-full"></div>
          <div className="w-4 h-4 bg-muted/60 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
