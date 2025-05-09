"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink } from "lucide-react"

export interface Page {
  id: string
  title: string
  slug: string
  content: string
  isHomePage?: boolean
  createdAt: Date
  updatedAt: Date
  views?: number
}

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  publishedAt: Date
  updatedAt: Date
  views?: number
  readingTime?: number
  tags?: string[]
  category?: string
  featuredImage?: string
  isPublished?: boolean
  visibility?: 'public' | 'private' | 'draft'
  type?: 'article' | 'website' | 'video' | 'resource'
  url?: string
}

interface ContentTabsProps {
  username: string
  pages: Page[]
  posts: Post[]
}

export function ContentTabs({ username, pages, posts }: ContentTabsProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="pages" className="w-full">
        <TabsList>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pages" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Your Pages</h3>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/${username}/dashboard/pages/new`}>
                Create Page
              </Link>
            </Button>
          </div>
          
          {pages.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">You haven't created any pages yet.</p>
                <Button className="mt-4" size="sm" asChild>
                  <Link href={`/${username}/dashboard/pages/new`}>
                    Create Your First Page
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pages.map((page: Page) => (
                <Card key={page.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">{page.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {page.views || 0} views
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        /{page.slug}
                      </p>
                      <div className="flex justify-between pt-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/${username}/dashboard/content/pages/${page.id}`}>
                            Edit
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href={`https://${username}.minispace.app/${page.slug}`} target="_blank" rel="noopener noreferrer">
                            View <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="posts" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Your Posts</h3>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/${username}/dashboard/posts/new`}>
                Create Post
              </Link>
            </Button>
          </div>
          
          {posts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">You haven't created any posts yet.</p>
                <Button className="mt-4" size="sm" asChild>
                  <Link href={`/${username}/dashboard/posts/new`}>
                    Create Your First Post
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {posts.map((post: Post) => (
                <Card key={post.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">{post.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {post.views || 0} views
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {new Date(post.updatedAt).toLocaleDateString()}
                      </p>
                      <div className="flex justify-between pt-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/${username}/dashboard/content/posts/${post.id}`}>
                            Edit
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href={`https://${username}.minispace.app/posts/${post.slug}`} target="_blank" rel="noopener noreferrer">
                            View <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
