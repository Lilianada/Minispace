'use client'

import { useEffect, useState } from 'react'
import { collection, query, getDocs, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface UserNavigationProps {
  userId: string
  className?: string
}

interface PageLink {
  title: string
  slug: string
  isHomePage: boolean
}

export default function UserNavigation({ userId, className = '' }: UserNavigationProps) {
  const [pages, setPages] = useState<PageLink[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const pagesRef = collection(db, `Users/${userId}/pages`)
        const pagesSnapshot = await getDocs(pagesRef)
        
        const pageLinks = pagesSnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            title: data.title,
            slug: data.slug,
            isHomePage: data.isHomePage || false
          }
        })
        
        // Sort pages with home page first, then alphabetically
        pageLinks.sort((a, b) => {
          if (a.isHomePage) return -1
          if (b.isHomePage) return 1
          return a.title.localeCompare(b.title)
        })
        
        setPages(pageLinks)
      } catch (error) {
        console.error('Error fetching navigation pages:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (userId) {
      fetchPages()
    }
  }, [userId])

  if (isLoading) {
    return (
      <nav className={className}>
        <div className="nav-placeholder animate-pulse">
          <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
      </nav>
    )
  }

  return (
    <nav className={className}>
      {pages.map(page => (
        <a 
          key={page.slug} 
          href={page.isHomePage ? '/' : `/${page.slug}`}
          className="block mb-2 hover:underline"
        >
          {page.title}
        </a>
      ))}
    </nav>
  )
}
