"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth-context'
import ReactMarkdown from 'react-markdown'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

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
        
        // First, find the user by username
        const usersQuery = query(collection(db, 'Users'), where('username', '==', username))
        const userSnapshot = await getDocs(usersQuery)
        
        if (userSnapshot.empty) {
          setError('User not found')
          setLoading(false)
          return
        }
        
        const userId = userSnapshot.docs[0].id
        
        // Then, find the page by slug in the user's pages collection
        const pagesQuery = query(
          collection(db, `Users/${userId}/pages`), 
          where('slug', '==', slug)
        )
        const pageSnapshot = await getDocs(pagesQuery)
        
        if (pageSnapshot.empty) {
          setError('Page not found')
          setLoading(false)
          return
        }
        
        const pageData = {
          id: pageSnapshot.docs[0].id,
          ...pageSnapshot.docs[0].data()
        }
        
        setPage(pageData)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching page:', err)
        setError('Failed to load page')
        setLoading(false)
      }
    }
    
    fetchPage()
  }, [username, slug])
  
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
