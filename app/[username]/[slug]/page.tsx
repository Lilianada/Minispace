"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth-context'
import ReactMarkdown from 'react-markdown'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getCachedData } from '@/lib/data-cache'

export default function PageView() {
  const params = useParams()
  const username = params.username as string
  const slug = params.slug as string
  
  const [page, setPage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function fetchPage() {
      try {
        setLoading(true)
        
        // Use data cache for user lookup
        const userId = await getCachedData(
          `user:${username}`,
          async () => {
            // Only run this if not in cache
            const usersQuery = query(collection(db, 'Users'), where('username', '==', username))
            const userSnapshot = await getDocs(usersQuery)
            
            if (userSnapshot.empty) {
              throw new Error('User not found')
            }
            
            return userSnapshot.docs[0].id
          },
          { expirationTimeMs: 30 * 60 * 1000 } // Cache user ID for 30 minutes
        ).catch(err => {
          setError('User not found')
          setLoading(false)
          throw err
        })
        
        if (!userId) return // Error was already handled
        
        // Use data cache for page content
        const pageData = await getCachedData(
          `page:${userId}:${slug}`,
          async () => {
            // Only run this if not in cache
            const pagesQuery = query(
              collection(db, `Users/${userId}/pages`), 
              where('slug', '==', slug)
            )
            const pageSnapshot = await getDocs(pagesQuery)
            
            if (pageSnapshot.empty) {
              throw new Error('Page not found')
            }
            
            return {
              id: pageSnapshot.docs[0].id,
              ...pageSnapshot.docs[0].data()
            }
          },
          { expirationTimeMs: 5 * 60 * 1000 } // Cache page content for 5 minutes
        ).catch(err => {
          setError('Page not found')
          setLoading(false)
          throw err
        })
        
        if (!pageData) return // Error was already handled
        
        setPage(pageData)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching page:', err)
        if (!error) { // Only set error if not already set
          setError('Failed to load page')
          setLoading(false)
        }
      }
    }
    
    fetchPage()
  }, [username, slug, error])
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Skeleton className="h-10 w-3/4 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Card>
          <CardContent className="py-8 text-center">
            <h1 className="text-xl font-bold mb-2">{error}</h1>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or you don't have permission to view it.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
      
      <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown>
          {page.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
