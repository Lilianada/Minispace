"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowRight, Calendar } from "lucide-react"
import { MockBlogPost, formatPostDate } from "@/lib/mock-data"

interface StreamLayoutProps {
  posts: MockBlogPost[]
  username: string
  showSearch?: boolean
}

export function StreamLayout({ posts, username, showSearch = true }: StreamLayoutProps) {
  const [searchTerm, setSearchTerm] = useState("")
  
  // Filter posts by search term
  const filteredPosts = posts.filter(post => 
    searchTerm === "" || 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  
  // Group posts by year and month
  const groupedPosts = useMemo(() => {
    const grouped: Record<string, Record<string, MockBlogPost[]>> = {}
    
    filteredPosts.forEach(post => {
      const date = post.publishedAt || post.createdAt
      const year = date.getFullYear().toString()
      const month = date.toLocaleString('default', { month: 'long' })
      
      if (!grouped[year]) {
        grouped[year] = {}
      }
      
      if (!grouped[year][month]) {
        grouped[year][month] = []
      }
      
      grouped[year][month].push(post)
    })
    
    // Sort years in descending order
    return Object.entries(grouped)
      .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
      .map(([year, months]) => ({
        year,
        months: Object.entries(months)
          .map(([month, monthPosts]) => ({
            month,
            posts: monthPosts.sort((a, b) => {
              const dateA = a.publishedAt || a.createdAt
              const dateB = b.publishedAt || b.createdAt
              return dateB.getTime() - dateA.getTime()
            })
          }))
      }))
  }, [filteredPosts])

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Notes & Reflections</h1>
        
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="pl-8 w-full md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>
      
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No notes found. Try adjusting your search.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {groupedPosts.map(({ year, months }) => (
            <div key={year} className="space-y-6">
              <h2 className="text-xl font-semibold border-b pb-2">{year}</h2>
              
              {months.map(({ month, posts }) => (
                <div key={month} className="space-y-4">
                  <h3 className="text-md font-medium text-muted-foreground">{month}</h3>
                  
                  <ul className="space-y-3">
                    {posts.map(post => (
                      <li key={post.id} className="group">
                        <Link 
                          href={`/${username}/blog/${post.slug}`}
                          className="flex items-center justify-between py-2 hover:bg-accent hover:text-accent-foreground rounded-md px-2 -mx-2 transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{post.title}</h4>
                              <div className="flex flex-wrap gap-1">
                                {post.tags.slice(0, 2).map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {post.tags.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{post.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="mr-1 h-3 w-3" />
                              {formatPostDate(post.publishedAt || post.createdAt)}
                              <span className="mx-2">•</span>
                              <span>{post.readTime} min read</span>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
