"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc, updateDoc, increment } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Navbar } from "@/components/navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import ReactMarkdown from "react-markdown"
import Link from "next/link"

interface Article {
  title: string
  body: string
  authorName: string
  createdAt: any
  updatedAt: any
  tags: string[]
}

export default function ArticlePage() {
  const { id } = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        if (!id || typeof id !== "string") return
        if (!db) throw new Error("Firestore is not initialized")

        const articleRef = doc(db, "Articles", id)
        const articleSnap = await getDoc(articleRef)

        if (articleSnap.exists()) {
          const articleData = articleSnap.data() as Article
          setArticle(articleData)

          // Increment read count
          try {
            await updateDoc(articleRef, {
              readCount: increment(1),
            })
          } catch (updateError) {
            console.error("Error updating read count:", updateError)
            // Continue even if read count update fails
          }
        } else {
          // Article not found - this is a normal condition, not an error
          console.log("Article not found:", id)
          setNotFound(true)
        }
      } catch (error) {
        console.error("Error fetching article:", error)

        // This is an actual error (not just article not found)
        let errorMessage = "Failed to load article. Please try again later."

        if (error instanceof Error) {
          if (error.message.includes("database") && error.message.includes("does not exist")) {
            errorMessage =
              "Firestore database has not been set up yet. Please create a Firestore database in your Firebase console."
          }
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
          duration: 3000,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id, toast])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </>
    )
  }

  if (notFound || !article) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Article not found</h1>
            <p className="text-muted-foreground">The article you're looking for doesn't exist or has been removed.</p>
            <Link href="/articles">
              <Button variant="outline" className="mt-4">
                Back to Articles
              </Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

  const formattedDate = article.updatedAt?.toDate
    ? new Date(article.updatedAt.toDate()).toLocaleDateString()
    : article.createdAt?.toDate
      ? new Date(article.createdAt.toDate()).toLocaleDateString()
      : "Unknown date"

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <article className="prose dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

          <div className="flex items-center justify-between mb-8">
            <div className="text-sm text-muted-foreground">
              By {article.authorName} • {formattedDate}
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="flex gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8">
            <ReactMarkdown>{article.body}</ReactMarkdown>
          </div>
        </article>
      </div>
    </>
  )
}
