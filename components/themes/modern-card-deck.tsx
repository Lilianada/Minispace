"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ModernCardDeckProps {
  siteTitle: string
  navigation: { title: string; href: string }[]
  cards: {
    title: string
    description: string
    image?: string
    tags?: string[]
    link?: { text: string; href: string }
  }[]
  heroImage?: string
  heroTitle?: string
  heroSubtitle?: string
  sidebar?: React.ReactNode
  footerContent?: {
    about?: string
    links?: { title: string; href: string }[]
    newsletter?: boolean
  }
  socialLinks?: { icon: React.ReactNode; href: string }[]
  fontFamily?: string
}

export function ModernCardDeck({
  siteTitle,
  navigation,
  cards,
  heroImage = '/placeholder-hero.jpg',
  heroTitle,
  heroSubtitle,
  sidebar,
  footerContent,
  socialLinks,
  fontFamily = 'font-sans'
}: ModernCardDeckProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className={`flex flex-col min-h-screen ${fontFamily}`}>
      {/* Hero Section with Navbar */}
      <header className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 z-10" />
        
        {heroImage && (
          <div className="relative h-[50vh] min-h-[400px]">
            <Image 
              src={heroImage} 
              alt={heroTitle || siteTitle}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        
        {/* Navbar */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="font-medium text-white text-xl">
              {siteTitle}
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className="text-sm font-medium text-white/90 hover:text-white transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-background z-50 flex flex-col">
            <div className="container flex h-16 items-center justify-between">
              <Link href="/" className="font-medium text-lg">
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
        
        {/* Hero Content */}
        {(heroTitle || heroSubtitle) && (
          <div className="absolute bottom-0 left-0 right-0 z-20 container py-8">
            <div className="max-w-2xl">
              {heroTitle && (
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {heroTitle}
                </h1>
              )}
              {heroSubtitle && (
                <p className="text-white/80 text-lg">
                  {heroSubtitle}
                </p>
              )}
            </div>
          </div>
        )}
      </header>
      
      {/* Main Content */}
      <main className="flex-1 container py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Optional Sidebar */}
          {sidebar && (
            <aside className="md:w-64 shrink-0">
              {sidebar}
            </aside>
          )}
          
          {/* Card Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, i) => (
                <Card key={i} className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                  {card.image && (
                    <div className="relative h-48 w-full">
                      <Image 
                        src={card.image} 
                        alt={card.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground">{card.description}</p>
                    {card.tags && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {card.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  {card.link && (
                    <CardFooter>
                      <Link 
                        href={card.link.href}
                        className="text-sm font-medium text-primary flex items-center hover:underline"
                      >
                        {card.link.text}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <h3 className="font-medium text-lg mb-4">{siteTitle}</h3>
              <p className="text-muted-foreground text-sm">
                {footerContent?.about || 'A modern collection of content, resources, and ideas.'}
              </p>
              {socialLinks && (
                <div className="flex items-center space-x-4 mt-4">
                  {socialLinks.map((link, i) => (
                    <Link key={i} href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {link.icon}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="font-medium text-lg mb-4">Quick Links</h3>
              <nav className="flex flex-col space-y-2">
                {(footerContent?.links || navigation).map((link, i) => (
                  <Link 
                    key={i}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.title}
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* Newsletter */}
            {footerContent?.newsletter && (
              <div>
                <h3 className="font-medium text-lg mb-4">Stay Updated</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Subscribe to our newsletter for the latest updates.
                </p>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email"
                    className="flex h-10 w-full rounded-l-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  />
                  <Button className="rounded-l-none">Subscribe</Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteTitle}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

// Preview component for theme selection
export function ModernCardDeckPreview() {
  return (
    <div className="w-full h-full border rounded-md overflow-hidden flex flex-col">
      {/* Hero preview */}
      <div className="h-20 bg-gradient-to-r from-primary/20 to-primary/10 relative">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute top-0 left-0 right-0 h-10 flex items-center px-4">
          <div className="w-24 h-4 bg-white/80 rounded-sm"></div>
          <div className="flex-1"></div>
          <div className="hidden md:flex space-x-4">
            <div className="w-12 h-3 bg-white/80 rounded-sm"></div>
            <div className="w-12 h-3 bg-white/80 rounded-sm"></div>
            <div className="w-12 h-3 bg-white/80 rounded-sm"></div>
          </div>
          <div className="md:hidden w-6 h-6 bg-white/20 rounded-md"></div>
        </div>
        <div className="absolute bottom-2 left-4">
          <div className="w-32 h-5 bg-white/90 rounded-sm"></div>
        </div>
      </div>
      
      {/* Content preview */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border rounded-md overflow-hidden">
              <div className="h-12 bg-muted/30"></div>
              <div className="p-2">
                <div className="w-full h-3 bg-muted rounded-sm mb-2"></div>
                <div className="w-2/3 h-2 bg-muted/60 rounded-sm"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer preview */}
      <div className="h-12 border-t bg-muted/20 p-2">
        <div className="grid grid-cols-3 gap-2 h-full">
          <div className="flex flex-col">
            <div className="w-16 h-2 bg-muted/80 rounded-sm mb-1"></div>
            <div className="w-24 h-1 bg-muted/40 rounded-sm"></div>
          </div>
          <div className="flex flex-col">
            <div className="w-16 h-2 bg-muted/80 rounded-sm mb-1"></div>
            <div className="w-24 h-1 bg-muted/40 rounded-sm"></div>
          </div>
          <div className="flex flex-col">
            <div className="w-16 h-2 bg-muted/80 rounded-sm mb-1"></div>
            <div className="flex">
              <div className="w-16 h-4 bg-muted/30 rounded-l-sm"></div>
              <div className="w-8 h-4 bg-primary/30 rounded-r-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
