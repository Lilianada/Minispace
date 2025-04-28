"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Edit, Mail, UserIcon } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

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

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchUserArticles = async () => {
      try {
        if (!db) throw new Error("Firestore is not initialized")

        // First try to fetch articles with the index
        try {
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
            // Extract index URL for console logging
            const urlMatch = indexError.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/)
            const indexUrl = urlMatch ? urlMatch[0] : "https://console.firebase.google.com"
            console.log("Create Firestore index at:", indexUrl)

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
        setArticles([])
      } finally {
        setLoading(false)
      }
    }

    fetchUserArticles()
  }, [user, router])

  if (!user || loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-8 px-4 min-h-[calc(100vh-8rem)]">
          <div className="mb-8">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Skeleton className="h-7 w-52 mb-4" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="py-4 px-2 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <div className="flex gap-2">
                    {[...Array(2)].map((_, j) => (
                      <Skeleton key={j} className="h-5 w-12 rounded-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 px-4 min-h-[calc(100vh-8rem)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <Link href="/write">
            <Button>Write New Article</Button>
          </Link>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-muted rounded-full p-2">
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="font-medium">{userData?.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-muted rounded-full p-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{userData?.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 px-2">My Articles</h2>

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
                <div key={article.id} className="py-4 px-2 rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-medium">{article.title}</h3>
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

                  <p className="text-sm text-muted-foreground mb-2">{article.excerpt}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">
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
      <Footer />
    </>
  )
}
