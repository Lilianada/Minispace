"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { collection, query, where, orderBy, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Filter, PlusIcon, MoreHorizontal, Search } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

interface Article {
  id: string
  title: string
  excerpt: string
  createdAt: any
  published: boolean
  tags: string[]
  views?: number
}

export default function PostPage() {
  const [posts, setArticles] = useState<Article[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Article[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTab, setCurrentTab] = useState("all")
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
            views: Math.floor(Math.random() * 200) // Temporary random views for demo
          })) as Article[]

          setArticles(fetchedArticles)
          setFilteredPosts(fetchedArticles)
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
              views: Math.floor(Math.random() * 200) // Temporary random views for demo
            })) as Article[]

            // Sort by createdAt in descending order
            fallbackArticles.sort((a, b) => {
              const dateA = a.createdAt?.toDate?.() || new Date(0)
              const dateB = b.createdAt?.toDate?.() || new Date(0)
              return dateB.getTime() - dateA.getTime()
            })

            setArticles(fallbackArticles)
            setFilteredPosts(fallbackArticles)
          } else {
            // If it's another type of error, rethrow it
            throw indexError
          }
        }
      } catch (error) {
        console.error("Error fetching posts:", error)
        setArticles([])
        setFilteredPosts([])
      } 
    }

    fetchUserArticles()
  }, [user, router])

  // Handle search and filtering
  useEffect(() => {
    let results = [...posts];
    
    // Apply search filter
    if (searchQuery) {
      results = results.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply tab filter
    if (currentTab === "published") {
      results = results.filter(post => post.published);
    } else if (currentTab === "drafts") {
      results = results.filter(post => !post.published);
    }
    
    setFilteredPosts(results);
  }, [searchQuery, currentTab, posts]);

  // Format date in DD/MM/YYYY format
  const formatDate = (date: any) => {
    if (!date) return "N/A";
    
    const d = date.toDate ? date.toDate() : new Date(date);
    
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(d);
  }

  // Calculate reading time in minutes
  const getReadingTime = (article: Article) => {
    const excerpt = article.excerpt || '';
    const wordsPerMinute = 200;
    const words = excerpt.split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / wordsPerMinute))} min read`;
  }

  if (!user || loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-9 w-24" />
        </div>
        
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-10" />
        </div>
        
        <div className="space-y-2">
          <div className="grid grid-cols-5 px-4 py-3">
            <Skeleton className="h-5 w-20 col-span-1" />
            <Skeleton className="h-5 w-16 col-span-1 mx-auto" />
            <Skeleton className="h-5 w-24 col-span-1 mx-auto" />
            <Skeleton className="h-5 w-16 col-span-1 mx-auto" />
            <Skeleton className="h-5 w-20 col-span-1 ml-auto" />
          </div>
          
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-md px-4 py-3">
              <div className="grid grid-cols-5 gap-4 items-center">
                <div className="col-span-1">
                  <Skeleton className="h-5 w-full max-w-[200px]" />
                  <Skeleton className="h-3 w-24 mt-1" />
                </div>
                <div className="col-span-1 flex justify-center">
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="col-span-1 flex justify-center">
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="col-span-1 flex justify-center">
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="col-span-1 flex justify-end">
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl font-bold">Posts</h1>
        <Button className="ml-auto" onClick={() => router.push(`/${userData?.username}/dashboard/posts/new`)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-stretch gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts..."
            className="w-full pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex gap-2 items-center h-10">
            <Filter className="h-3.5 w-3.5" />
            All Posts
          </Button>
          <Button variant="outline" className="px-3 h-10">
            Sort
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="w-full max-w-md grid grid-cols-3 mb-6">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <p className="text-muted-foreground mb-4">You haven't created any posts yet</p>
            <Button onClick={() => router.push(`/${userData?.username}/dashboard/posts/new`)}>
              Create Your First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {/* Table Headers - Hide on mobile, show on larger screens */}
          <div className="hidden md:grid md:grid-cols-5 px-4 py-3 font-medium text-sm">
            <div className="col-span-1">Title</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-1 text-center">Date</div>
            <div className="col-span-1 text-center">Views</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Table Rows */}
          {filteredPosts.map((article) => (
            <div key={article.id} className="rounded-md border px-4 py-3">
              {/* Desktop view: Grid layout */}
              <div className="hidden md:grid md:grid-cols-5 gap-4 items-center">
                {/* Title and Slug */}
                <div className="col-span-1">
                  <div className="font-medium line-clamp-1">{article.title}</div>
                  <div className="text-xs text-muted-foreground">/{article.id.toLowerCase()}</div>
                </div>

                {/* Status */}
                <div className="col-span-1 flex justify-center">
                  {article.published ? (
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary/40">
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-muted text-muted-foreground">
                      Draft
                    </Badge>
                  )}
                </div>

                {/* Date */}
                <div className="col-span-1 text-center text-sm">
                  {formatDate(article.createdAt)}
                  <div className="text-xs text-muted-foreground">{getReadingTime(article)}</div>
                </div>

                {/* Views */}
                <div className="col-span-1 text-center">
                  {article.views || 0}
                </div>

                {/* Actions */}
                <div className="col-span-1 flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.push(`/${userData?.username}/dashboard/posts/edit/${article.id}`)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => window.open(`https://${userData?.username}.minispace.dev/posts/${article.id.toLowerCase()}`, '_blank')}
                      >
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem 
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
                      >
                        {article.published ? "Unpublish" : "Publish"}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-500 focus:text-red-500"
                        onClick={() => {
                          setArticleToDelete(article);
                          setShowConfirm(true);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Mobile view: Card layout */}
              <div className="md:hidden space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{article.title}</div>
                    <div className="text-xs text-muted-foreground">/{article.id.toLowerCase()}</div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.push(`/${userData?.username}/dashboard/posts/edit/${article.id}`)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => window.open(`https://${userData?.username}.minispace.dev/posts/${article.id.toLowerCase()}`, '_blank')}
                      >
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem 
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
                      >
                        {article.published ? "Unpublish" : "Publish"}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-500 focus:text-red-500"
                        onClick={() => {
                          setArticleToDelete(article);
                          setShowConfirm(true);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex justify-between items-center text-sm pt-1">
                  <div className="flex items-center">
                    <span className="text-xs font-medium mr-1">Status:</span>
                    {article.published ? (
                      <Badge variant="outline" className="bg-primary/20 text-primary border-primary/40">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-muted text-muted-foreground">
                        Draft
                      </Badge>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-medium mr-1">Views:</span>
                    <span>{article.views || 0}</span>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {formatDate(article.createdAt)} • {getReadingTime(article)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete Dialog */}
      {showConfirm && articleToDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-background rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Delete Post</h2>
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
                    setFilteredPosts((prev) => prev.filter((a) => a.id !== articleToDelete.id));
                    toast({
                      title: "Deleted",
                      description: "Post deleted successfully.",
                      variant: "destructive",
                    });
                    setShowConfirm(false);
                    setArticleToDelete(null);
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Failed to delete post.",
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
    </div>
  )
}
