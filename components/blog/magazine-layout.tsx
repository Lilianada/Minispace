"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ArrowRight, Clock, Calendar } from "lucide-react"
import { MockBlogPost, formatPostDate } from "@/lib/mock-data"

interface MagazineLayoutProps {
  posts: MockBlogPost[]
  username: string
  showSearch?: boolean
}

export function MagazineLayout({ posts, username, showSearch = true }: MagazineLayoutProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  // Get unique categories
  const categories = Array.from(new Set(posts.map(post => post.category || "Uncategorized")))
  
  // Filter posts by search term and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === "" || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === null || post.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // Get featured post (most recent)
  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null

  // Get remaining posts
  const remainingPosts = filteredPosts.slice(1)

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Articles</h1>
        
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="pl-8 w-full md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>
      
      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "secondary" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "secondary" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No articles found. Try adjusting your search.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Featured Article */}
          {featuredPost && (
            <div className="space-y-4">
              <Card className="overflow-hidden border-0 shadow-none">
                <Link href={`/${username}/blog/${featuredPost.slug}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredPost.featuredImage && (
                      <div className="relative h-64 md:h-auto rounded-lg overflow-hidden">
                        <Image
                          src={featuredPost.featuredImage}
                          alt={featuredPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex flex-col justify-center space-y-4">
                      <div>
                        <Badge variant="outline" className="mb-2">Featured</Badge>
                        <h2 className="text-2xl font-bold">{featuredPost.title}</h2>
                        <p className="text-muted-foreground mt-2">{featuredPost.excerpt}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {featuredPost.tags.map(tag => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={featuredPost.author.avatar} alt={featuredPost.author.name} />
                            <AvatarFallback>{featuredPost.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{featuredPost.author.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatPostDate(featuredPost.publishedAt || featuredPost.createdAt)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-4 w-4" />
                          {featuredPost.readTime} min read
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-fit">
                        Read Article <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Link>
              </Card>
              
              <div className="border-t my-8" />
            </div>
          )}
          
          {/* Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingPosts.map(post => (
              <Card key={post.id} className="overflow-hidden flex flex-col h-full">
                <Link href={`/${username}/blog/${post.slug}`} className="flex flex-col h-full">
                  {post.featuredImage && (
                    <div className="relative h-40 w-full">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  
                  <CardContent className="flex-grow space-y-3 p-4">
                    <div>
                      <h3 className="font-semibold">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{post.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t p-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback>{post.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{post.author.name}</span>
                      </div>
                      
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatPostDate(post.publishedAt || post.createdAt)}
                      </div>
                    </div>
                  </CardFooter>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
