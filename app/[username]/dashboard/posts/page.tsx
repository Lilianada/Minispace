"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { collection, query, where, orderBy, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Edit, Mail, UserIcon, PenLineIcon } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

interface Article {
  id: string
  title: string
  excerpt: string
  createdAt: any
  published: boolean
  tags: string[]
}

export default function PostPage() {
  const [posts, setArticles] = useState<Article[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    const fetchUserArticles = async () => {
      try {
        if (!db) throw new Error("Firestore is not initialized")

        // First try to fetch posts with the index
        try {
          const postsQuery = query(
            collection(db, "Articles"),
            where("authorId", "==", user?.uid),
            orderBy("createdAt", "desc"),
          )

          const querySnapshot = await getDocs(postsQuery)

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
            const fallbackQuery = query(collection(db, "Articles"), where("authorId", "==", user?.uid))

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
        console.error("Error fetching posts:", error)
        setArticles([])
      } 
    }

    fetchUserArticles()
  }, [user, router])

  if (!user || loading) {
    return (
      <>
        <div className="container mx-auto   py-8 px-4 min-h-[calc(100vh-8rem)]">
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
         
      </>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-base font-bold tracking-tight">My Posts</h1>
            <p className="text-sm text-muted-foreground">
              Manage your published articles and drafts
            </p>
          </div>
          <Link href={`/${userData?.username}/dashboard/write`}>
            <Button size="sm">
              <PenLineIcon className="w-3.5 h-3.5 mr-1" />
              <span className="text-xs">New Post</span>
            </Button>
          </Link>
        </div>

          {posts.length === 0 ? (
            <div className="text-center py-8 border rounded-lg bg-muted/5">
              <p className="text-muted-foreground mb-4 text-sm">You haven't written any posts yet</p>
              <Link href={`/${userData?.username}/dashboard/write`}>
                <Button size="sm">
                  <PenLineIcon className="w-3.5 h-3.5 mr-1" />
                  Write Your First Post
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((article) => (
                <div key={article.id} className="py-4 px-2 rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-medium">{article.title}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        className="focus:outline-none"
                        title={article.published ? "Unpublish (move to Drafts)" : "Publish"}
                        onClick={async () => {
                          setUpdatingId(article.id);
                          try {
                            await updateDoc(doc(db, "Articles", article.id), {
                              published: !article.published,
                            });
                            setArticles((prev) => prev.map((a) =>
                              a.id === article.id ? { ...a, published: !a.published } : a
                            ));
                            toast({
                              title: "Success",
                              description: `Article ${article.published ? "moved to Drafts" : "published"}.`,
                            });
                          } catch (error) {
                            toast({
                              title: "Error",
                              description: "Failed to update publish status.",
                              variant: "destructive",
                            });
                          } finally {
                            setUpdatingId(null);
                          }
                        }}
                        disabled={updatingId === article.id}
                      >
                        {article.published ? (
                          <Eye className="h-3 w-3 text-green-600" />
                        ) : (
                          <EyeOff className="h-3 w-3 text-zinc-500" />
                        )}
                      </button>
                      {article.published ? (
                        <Badge variant="outline" className="flex items-center gap-1">
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          Draft
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-1">{article.excerpt}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                      {article.tags &&
                        article.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                    </div>

                    <div className="flex gap-2 items-center">
                      <Link href={`/${userData?.username}/dashboard/edit/${article.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-1 h-7 px-2 text-xs">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1"
                        disabled={deletingId === article.id}
                        onClick={() => {
                          setArticleToDelete(article);
                          setShowConfirm(true);
                        }}
                      >
                        {deletingId === article.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
      {/* Confirm Delete Dialog */}
      {showConfirm && articleToDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Delete Article</h2>
            <p className="mb-4">Are you sure you want to delete <span className="font-bold">{articleToDelete.title}</span>? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setShowConfirm(false); setArticleToDelete(null); }} disabled={deletingId !== null}>Cancel</Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (!articleToDelete) return;
                  setDeletingId(articleToDelete.id);
                  try {
                    await deleteDoc(doc(db, "Articles", articleToDelete.id));
                    setArticles((prev) => prev.filter((a) => a.id !== articleToDelete.id));
                    toast({
                      title: "Deleted",
                      description: "Article deleted successfully.",
                      variant: "destructive",
                    });
                    setShowConfirm(false);
                    setArticleToDelete(null);
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Failed to delete article.",
                      variant: "destructive",
                    });
                  } finally {
                    setDeletingId(null);
                  }
                }}
                disabled={deletingId !== null}
              >
                {deletingId !== null ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
