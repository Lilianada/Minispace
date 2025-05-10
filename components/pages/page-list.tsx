"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Home, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export interface Page {
  id: string
  title: string
  slug: string
  content: string
  isHomePage: boolean
  createdAt: any
  updatedAt: any
}

interface PageListProps {
  pages: Page[]
  isLoading: boolean
  username: string
  onEditPage: (page: Page) => void
  onDeletePage: (page: Page) => void
}

export function PageList({ 
  pages, 
  isLoading, 
  username, 
  onEditPage, 
  onDeletePage 
}: PageListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (pages.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <p className="text-muted-foreground mb-4">You haven't created any pages yet</p>
          <Link href={`/${username}/dashboard/pages/new`}>
            <Button>
              Create Your First Page
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {pages.map((page) => (
        <Card key={page.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{page.title}</h3>
                  {page.isHomePage && (
                    <Home className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground truncate">
                /{page.slug}
              </p>
              
              <div className="flex justify-between pt-2">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEditPage(page)}>
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                  
                  {!page.isHomePage && (
                    <Button size="sm" variant="outline" onClick={() => onDeletePage(page)}>
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
                
                <Button size="sm" variant="outline" asChild>
                  <a href={`https://${username}.minispace.dev/${page.slug}`} target="_blank" rel="noopener noreferrer">
                    View <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
