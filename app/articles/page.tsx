"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  startAfter,
  type DocumentData,
  type QueryDocumentSnapshot,
  getCountFromServer,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Navbar } from "@/components/navbar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

interface Article {
  id: string
  title: string
  excerpt: string
  authorName: string
  tags: string[]
  createdAt: any
}

const ARTICLES_PER_PAGE = 20
const MAX_EXCERPT_LENGTH = 150 // Character limit for excerpts

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [allTags, setAllTags] = useState<string[]>([])
  const [totalArticles, setTotalArticles] = useState(0)
  const [indexError, setIndexError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchArticleCount = async () => {
    try {
      if (!db) throw new Error("Firestore is not initialized")

      const articlesQuery = query(collection(db, "Articles"), where("published", "==", true))
      const snapshot = await getCountFromServer(articlesQuery)
      const count = snapshot.data().count
      setTotalArticles(count)
      setTotalPages(Math.ceil(count / ARTICLES_PER_PAGE))
    } catch (error) {
      console.error("Error fetching article count:", error)
      // Don't show toast here as we'll handle it in fetchArticles
    }
  }

  // Helper function to extract the index URL from the error message
  const extractIndexUrl = (errorMessage: string) => {
    const urlMatch = errorMessage.match(/https:\/\/console\.firebase\.google\.com[^\s]+/)
    return urlMatch ? urlMatch[0] : "https://console.firebase.google.com"
  }

  const fetchArticles = useCallback(
    async (searchTerm = "", tag = null, pageReset = false) => {
      try {
        setLoading(true)

        if (!db) throw new Error("Firestore is not initialized")

        let articlesQuery = query(
          collection(db, "Articles"),
          where("published", "==", true),
          orderBy("createdAt", "desc"),
          limit(ARTICLES_PER_PAGE),
        )

        if (pageReset) {
          setLastVisible(null)
          setCurrentPage(1)
        } else if (lastVisible && !pageReset && currentPage > 1) {
          articlesQuery = query(
            collection(db, "Articles"),
            where("published", "==", true),
            orderBy("createdAt", "desc"),
            startAfter(lastVisible),
            limit(ARTICLES_PER_PAGE),
          )
        }

        try {
          const querySnapshot = await getDocs(articlesQuery)

          if (!querySnapshot.empty) {
            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
          }

          const fetchedArticles = querySnapshot.docs.map((doc) => {
            const data = doc.data()
            // Truncate excerpt if it exceeds the maximum length
            let excerpt = data.excerpt || ""
            if (excerpt.length > MAX_EXCERPT_LENGTH) {
              excerpt = excerpt.substring(0, MAX_EXCERPT_LENGTH) + "..."
            }

            return {
              id: doc.id,
              ...data,
              excerpt,
            }
          }) as Article[]

          // Filter by search term if provided
          let filteredArticles = fetchedArticles
          if (searchTerm) {
            filteredArticles = fetchedArticles.filter(
              (article) =>
                article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.authorName?.toLowerCase().includes(searchTerm.toLowerCase()),
            )
          }

          // Filter by tag if selected
          if (tag) {
            filteredArticles = filteredArticles.filter((article) => article.tags && article.tags.includes(tag))
          }

          setArticles(filteredArticles)
          setIndexError(null)

          // Collect all unique tags
          const tags = new Set<string>()
          fetchedArticles.forEach((article) => {
            if (article.tags) {
              article.tags.forEach((tag) => tags.add(tag))
            }
          })
          setAllTags(Array.from(tags))

          // Update total count
          await fetchArticleCount()
        } catch (indexErr: any) {
          console.error("Index error:", indexErr)

          // If the error is about missing index
          if (indexErr.code === "failed-precondition" && indexErr.message.includes("requires an index")) {
            setIndexError(indexErr.message)

            // Show toast with link to create index
            toast({
              title: "Firestore Index Required",
              description: (
                <div>
                  <p>This query requires a Firestore index. Please create it using the link below:</p>
                  <a
                    href={extractIndexUrl(indexErr.message)}
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
            const fallbackQuery = query(
              collection(db, "Articles"),
              where("published", "==", true),
              limit(ARTICLES_PER_PAGE),
            )

            const fallbackSnapshot = await getDocs(fallbackQuery)

            // Sort manually in JavaScript
            const fallbackArticles = fallbackSnapshot.docs.map((doc) => {
              const data = doc.data()
              // Truncate excerpt if it exceeds the maximum length
              let excerpt = data.excerpt || ""
              if (excerpt.length > MAX_EXCERPT_LENGTH) {
                excerpt = excerpt.substring(0, MAX_EXCERPT_LENGTH) + "..."
              }

              return {
                id: doc.id,
                ...data,
                excerpt,
              }
            }) as Article[]

            // Sort by createdAt in descending order
            fallbackArticles.sort((a, b) => {
              const dateA = a.createdAt?.toDate?.() || new Date(0)
              const dateB = b.createdAt?.toDate?.() || new Date(0)
              return dateB.getTime() - dateA.getTime()
            })

            setArticles(fallbackArticles)
          } else {
            // If it's another type of error, rethrow it
            throw indexErr
          }
        }
      } catch (error) {
        console.error("Error fetching articles:", error)

        // Only show toast for actual errors, not for "no articles found"
        if (error instanceof Error) {
          let errorMessage = "Failed to load articles. Please try again later."

          if (error.message.includes("database") && error.message.includes("does not exist")) {
            errorMessage =
              "Firestore database has not been set up yet. Please create a Firestore database in your Firebase console."
          }

          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
            duration: 3000,
          })
        }

        setArticles([])
      } finally {
        setLoading(false)
      }
    },
    [db, lastVisible, toast],
  )

  useEffect(() => {
    fetchArticles().catch((err) => {
      console.error("Error in initial fetch:", err)
    })
  }, [fetchArticles])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchArticles(searchTerm, selectedTag, true)
  }

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null)
      fetchArticles(searchTerm, null, true)
    } else {
      setSelectedTag(tag)
      fetchArticles(searchTerm, tag, true)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
      fetchArticles(searchTerm, selectedTag)
    }
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1)
    fetchArticles(searchTerm, selectedTag)
  }

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
    fetchArticles(searchTerm, selectedTag)
  }

  // Calculate pagination display
  const showPagination = totalArticles > ARTICLES_PER_PAGE
  const maxPageButtons = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2))
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1)

  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1)
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Articles</h1>

        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {indexError && (
          <div className="mb-4 p-4 border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 rounded-md">
            <p className="text-amber-800 dark:text-amber-200 mb-2">
              This query requires a Firestore index. Results below may be incomplete.
            </p>
            <a
              href={extractIndexUrl(indexError)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Create Firestore Index
            </a>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {articles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No articles found</p>
                <Link href="/write" className="mt-4 inline-block">
                  <Button variant="outline" className="mt-4">
                    Write Your First Article
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {articles.map((article) => (
                  <Link href={`/articles/${article.id}`} key={article.id}>
                    <div className="border p-6 rounded-lg hover:border-blue-500 transition-colors group">
                      <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-500 transition-colors">
                        {article.title}
                      </h2>
                      <p className="text-muted-foreground mb-4">{article.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{article.authorName}</span>
                        {article.tags && article.tags.length > 0 && (
                          <div className="flex gap-2">
                            {article.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Only show pagination if there are more than one page of articles */}
            {showPagination && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                  </Button>

                  {startPage > 1 && (
                    <>
                      <Button
                        variant={currentPage === 1 ? "default" : "outline"}
                        onClick={() => handlePageClick(1)}
                        className="w-10 h-10 p-0"
                      >
                        1
                      </Button>
                      {startPage > 2 && <span className="mx-1">...</span>}
                    </>
                  )}

                  {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
                    <Button
                      key={startPage + i}
                      variant={currentPage === startPage + i ? "default" : "outline"}
                      onClick={() => handlePageClick(startPage + i)}
                      className="w-10 h-10 p-0"
                    >
                      {startPage + i}
                    </Button>
                  ))}

                  {endPage < totalPages && (
                    <>
                      {endPage < totalPages - 1 && <span className="mx-1">...</span>}
                      <Button
                        variant={currentPage === totalPages ? "default" : "outline"}
                        onClick={() => handlePageClick(totalPages)}
                        className="w-10 h-10 p-0"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}

                  <Button
                    variant="outline"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages || articles.length < ARTICLES_PER_PAGE}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
