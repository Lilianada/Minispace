"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Edit } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

interface Article {
  id: string
  title: string
  excerpt: string
  createdAt: any
  published: boolean
  tags: string[]
}

export default function ProfilePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const { user, userData } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchUserArticles = async () => {
      try {
        if (!db) throw new Error("Firestore is not initialized")

        // Create the composite index if it doesn't exist
        try {
          // First try to fetch articles with the index
          const articlesQuery = query(
            collection(db, "Articles"),
            where("authorId", "==", user.uid),
            orderBy("createdAt", "desc"),
          )

          const querySnapshot = await getDocs(articlesQuery)

          const fetchedArticles = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Article[]

          setArticles(fetchedArticles)
        } catch (indexError: any) {
          console.error("Index error:", indexError)

          // If the error is about missing index
          if (indexError.code === "failed-precondition" && indexError.message.includes("requires an index")) {
            // Show toast with link to create index
            toast({
              title: "Firestore Index Required",
              description: (
                <div>
                  <p>This query requires a Firestore index. Please create it using the link below:</p>
                  <a
                    href={extractIndexUrl(indexError.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline mt-2 block"
                  >
                    Create Firestore Index
                  </a>
                </div>
              ),
              duration: 10000,
            })

            // Try to fetch without ordering as a fallback
            const fallbackQuery = query(collection(db, "Articles"), where("authorId", "==", user.uid))

            const fallbackSnapshot = await getDocs(fallbackQuery)

            // Sort manually in JavaScript
            const fallbackArticles = fallbackSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Article[]

            // Sort by createdAt in descending order
            fallbackArticles.sort((a, b) => {
              const dateA = a.createdAt?.toDate?.() || new Date(0)
              const dateB = b.createdAt?.toDate?.() || new Date(0)
              return dateB.getTime() - dateA.getTime()
            })

            setArticles(fallbackArticles)
          } else {
            // If it's another type of error, rethrow it
            throw indexError
          }
        }
      } catch (error) {
        console.error("Error fetching articles:", error)
        toast({
          title: "Error",
          description: "Failed to load your articles. Please try again later.",
          variant: "destructive",
          duration: 3000,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserArticles()
  }, [user, router, toast])

  // Helper function to extract the index URL from the error message
  const extractIndexUrl = (errorMessage: string) => {
    const urlMatch = errorMessage.match(/https:\/\/console\.firebase\.google\.com[^\s]+/)
    return urlMatch ? urlMatch[0] : "https://console.firebase.google.com"
  }

  if (!user || loading) {
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

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Link href="/write">
            <Button>Write New Article</Button>
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
          <div className="border p-4 rounded-lg">
            <p>
              <span className="font-medium">Username:</span> {userData?.username}
            </p>
            <p>
              <span className="font-medium">Email:</span> {userData?.email}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">My Articles</h2>

          {articles.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground mb-4">You haven't written any articles yet</p>
              <Link href="/write">
                <Button>Write Your First Article</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <div key={article.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium">{article.title}</h3>
                    <div className="flex items-center">
                      {article.published ? (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <EyeOff className="h-3 w-3" />
                          Draft
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">{article.excerpt}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {article.tags &&
                        article.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                    </div>

                    <Link href={`/edit/${article.id}`}>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
