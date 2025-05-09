"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ExternalLink, Calendar, Link2, Video, FileText, Bookmark } from "lucide-react"
import { MockBlogPost, formatPostDate } from "@/lib/mock-data"

interface GalleryLayoutProps {
  posts: MockBlogPost[]
  username: string
  showSearch?: boolean
}

export function GalleryLayout({ posts, username, showSearch = true }: GalleryLayoutProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  
  // Get unique types
  const types = Array.from(new Set(posts.map(post => post.type || "article")))
  
  // Filter posts by search term and type
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === "" || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = selectedType === null || post.type === selectedType
    
    return matchesSearch && matchesType
  })

  // Get icon for post type
  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'article':
        return <FileText className="h-4 w-4" />
      case 'video':
        return <Video className="h-4 w-4" />
      case 'website':
        return <Link2 className="h-4 w-4" />
      case 'resource':
        return <Bookmark className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Bookmarks & Discoveries</h1>
        
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search bookmarks..."
              className="pl-8 w-full md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>
      
      {/* Type filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedType === null ? "secondary" : "outline"}
          size="sm"
          onClick={() => setSelectedType(null)}
        >
          All
        </Button>
        {types.map(type => (
          <Button
            key={type}
            variant={selectedType === type ? "secondary" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type)}
            className="flex items-center"
          >
            {getTypeIcon(type)}
            <span className="ml-1 capitalize">{type}s</span>
          </Button>
        ))}
      </div>
      
      {/* Bookmarks grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No bookmarks found. Try adjusting your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map(post => (
            <Card key={post.id} className="overflow-hidden transition-all hover:shadow-md">
              <Link 
                href={post.url || `/${username}/blog/${post.slug}`}
                target={post.url ? "_blank" : "_self"}
                rel={post.url ? "noopener noreferrer" : ""}
                className="block h-full"
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="flex items-center space-x-1">
                        {getTypeIcon(post.type)}
                        <span className="capitalize">{post.type}</span>
                      </Badge>
                    </div>
                    {post.url && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                  </div>
                  
                  <div>
                    <h3 className="font-medium line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{post.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="px-4 py-3 border-t text-xs text-muted-foreground flex justify-between">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatPostDate(post.publishedAt || post.createdAt)}
                  </div>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
