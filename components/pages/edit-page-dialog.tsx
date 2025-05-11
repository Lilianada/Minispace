"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Page } from "./page-list"
import { LayoutSelector } from "./layout-selector"

interface EditPageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  page: Page | null
  username: string
  isEditing: boolean
  onSave: () => void
  title: string
  setTitle: (title: string) => void
  slug: string
  setSlug: (slug: string) => void
  content: string
  setContent: (content: string) => void
  isHomePage: boolean
  setIsHomePage: (isHomePage: boolean) => void
  layout: string
  setLayout: (layout: string) => void
}

export function EditPageDialog({
  open,
  onOpenChange,
  page,
  username,
  isEditing,
  onSave,
  title,
  setTitle,
  slug,
  setSlug,
  content,
  setContent,
  isHomePage,
  setIsHomePage,
  layout,
  setLayout
}: EditPageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Page</DialogTitle>
          <DialogDescription>
            Update your page content and settings
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Page Title</Label>
            <Input 
              id="edit-title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-slug">URL Path</Label>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">/</span>
              <Input 
                id="edit-slug" 
                value={slug} 
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This will be the URL path for your page: {username}.minispace.dev/{slug}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-content">Page Content</Label>
            <Textarea 
              id="edit-content" 
              value={content} 
              onChange={(e) => setContent(e.target.value)}
              rows={6}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="edit-isHomePage" 
              checked={isHomePage}
              onCheckedChange={setIsHomePage}
              disabled={page?.isHomePage}
            />
            <Label htmlFor="edit-isHomePage" className={page?.isHomePage ? "text-muted-foreground" : ""}>
              {page?.isHomePage ? "This is your home page" : "Set as home page"}
            </Label>
          </div>

          <div className="pt-4 border-t">
            <Label className="text-base font-semibold mb-2 block">Page Layout</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Choose a specific layout for this page. Each page can have its own layout, while your theme style applies to all pages.
            </p>
            <LayoutSelector
              selectedLayout={layout || "landing-page"}
              setSelectedLayout={setLayout}
              onSave={() => {}}
              isSubmitting={false}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSave} disabled={isEditing}>
            {isEditing ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
