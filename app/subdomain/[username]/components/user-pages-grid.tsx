'use client'

import { useEffect, useState } from 'react'
import { collection, query, getDocs, where, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface UserPagesGridProps {
  userId: string
  maxPages?: number
}

interface PageCard {
  id: string
  title: string
  slug: string
  description?: string
  isHomePage: boolean
}

export default function UserPagesGrid({ userId, maxPages = 6 }: UserPagesGridProps) {
  const [pages, setPages] = useState<PageCard[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const pagesRef = collection(db, `Users/${userId}/pages`)
        const pagesQuery = query(pagesRef, limit(maxPages))
        const pagesSnapshot = await getDocs(pagesQuery)
        
        const pageCards = pagesSnapshot.docs
          .map(doc => {
            const data = doc.data()
            return {
              id: doc.id,
              title: data.title,
              slug: data.slug,
              description: data.description || 'Click to read more about this page.',
              isHomePage: data.isHomePage || false
            }
          })
          // Filter out the home page since it's already displayed
          .filter(page => !page.isHomePage)
        
        setPages(pageCards)
      } catch (error) {
        console.error('Error fetching pages for grid:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (userId) {
      fetchPages()
    }
  }, [userId, maxPages])

  if (isLoading) {
    return (
      <div className="grid-loading">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="card-header">
              <div className="h-6 w-36 bg-gray-200 rounded"></div>
            </div>
            <div className="card-content">
              <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
              <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // If no pages, show default cards
  if (pages.length === 0) {
    return (
      <>
        <div className="card">
          <div className="card-header">
            <h2 style={{ margin: 0 }}>About Me</h2>
          </div>
          <div className="card-content">
            <p>Learn more about who I am and what I do.</p>
            <a href="/about">Read More →</a>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 style={{ margin: 0 }}>Projects</h2>
          </div>
          <div className="card-content">
            <p>Check out my latest work and projects.</p>
            <a href="/projects">View Projects →</a>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 style={{ margin: 0 }}>Contact</h2>
          </div>
          <div className="card-content">
            <p>Get in touch with me for collaborations or questions.</p>
            <a href="/contact">Contact Me →</a>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {pages.map(page => (
        <div key={page.id} className="card">
          <div className="card-header">
            <h2 style={{ margin: 0 }}>{page.title}</h2>
          </div>
          <div className="card-content">
            <p>{page.description}</p>
            <a href={`/${page.slug}`}>Read More →</a>
          </div>
        </div>
      ))}
    </>
  )
}
