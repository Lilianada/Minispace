"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, Home, ExternalLink, Check, X } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface Page {
  id: string
  title: string
  slug: string
  content: string
  isHomePage: boolean
  createdAt: any
  updatedAt: any
  layout?: string // Add layout property for per-page layout selection
  published?: boolean
}

interface PageListProps {
  pages: Page[]
  isLoading: boolean
  username: string
  onEditPage: (page: Page) => void
  onDeletePage: (page: Page) => void
  onSetHomePage: (page: Page) => void
  onPublishToggle?: (page: Page) => void
}

export function PageList({ 
  pages, 
  isLoading, 
  username, 
  onEditPage, 
  onDeletePage, 
  onSetHomePage,
  onPublishToggle
}: PageListProps) {
  // Helper function to format dates
  const formatDate = (date: any) => {
    if (!date) return "Unknown"
    
    // Handle Firestore Timestamps
    const dateObj = date.toDate ? date.toDate() : new Date(date)
    
    // Format as DD/MM/YYYY
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dateObj)
  }
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-4 px-4 py-3 font-medium text-sm">
          <div className="col-span-1">Title</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-center">Last Updated</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-md border px-4 py-3">
            <div className="grid grid-cols-4 gap-4 items-center">
              <div className="col-span-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-24 mt-1" />
              </div>
              <div className="col-span-1 flex justify-center">
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="col-span-1 flex justify-center">
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="col-span-1 flex justify-end">
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </div>
          </div>
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
    <div className="space-y-2">
      {/* Table Headers */}
      <div className="grid grid-cols-4 px-4 py-3 font-medium text-sm">
        <div className="col-span-1">Title</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-1 text-center">Last Updated</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* Table Rows */}
      {pages.map((page) => (
        <div key={page.id} className="rounded-md border px-4 py-3">
          <div className="grid grid-cols-4 gap-4 items-center">
            {/* Title and URL */}
            <div className="col-span-1">
              <div className="font-medium line-clamp-1">{page.title}</div>
              <div className="text-xs text-muted-foreground">/{page.slug}</div>
            </div>

            {/* Status */}
            <div className="col-span-1 flex justify-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {page.isHomePage ? (
                      <Badge variant="outline" className="bg-primary/20 text-primary border-primary/40">
                        <Check className="h-3 w-3 mr-1" />
                        Published (Home)
                      </Badge>
                    ) : page.published ? (
                      <Badge variant="outline" className="bg-green-100 text-green-600 border-green-300">
                        <Check className="h-3 w-3 mr-1" />
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-muted text-muted-foreground">
                        Draft
                      </Badge>
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    {page.isHomePage 
                      ? "This is your home page and is always published"
                      : page.published 
                        ? "This page is visible to visitors" 
                        : "This page is only visible to you"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Last Updated */}
            <div className="col-span-1 text-center text-sm">
              {formatDate(page.updatedAt)}
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
                  <DropdownMenuItem asChild>
                    <Link href={`/${username}/dashboard/pages/edit/${page.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => window.open(`https://${username}.minispace.dev/${page.slug}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </DropdownMenuItem>
                  {!page.isHomePage && (
                    <>
                      <DropdownMenuItem onClick={() => onSetHomePage(page)}>
                        <Home className="h-4 w-4 mr-2" />
                        Set as Homepage
                      </DropdownMenuItem>
                      {onPublishToggle && (
                        page.published ? (
                          <DropdownMenuItem onClick={() => onPublishToggle(page)}>
                            <X className="h-4 w-4 mr-2" />
                            Unpublish
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => onPublishToggle(page)}>
                            <Check className="h-4 w-4 mr-2" />
                            Publish
                          </DropdownMenuItem>
                        )
                      )}
                      <DropdownMenuItem onClick={() => onDeletePage(page)} className="text-red-500 focus:text-red-500">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
