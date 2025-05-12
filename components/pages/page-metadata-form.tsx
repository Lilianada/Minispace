import React from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { Calendar as CalendarIcon, Globe, Tag, Info, Image } from 'lucide-react'
import Link from 'next/link'

interface PageFormData {
  title: string
  slug: string
  alias: string
  canonicalUrl: string
  publishedDate: Date | undefined
  isPage: boolean
  metaDescription: string
  metaImage: string
  language: string
  tags: string
  makeDiscoverable: boolean
  backgroundColor: string
  textColor: string
  fontFamily: string
  fontSize: string
  layout: string
  isPublished?: boolean
  isHomepage?: boolean
}

interface PageMetadataFormProps {
  metadata: PageFormData
  username: string
  handleMetadataChange: (key: keyof PageFormData, value: any) => void
}

export function PageMetadataForm({ metadata, username, handleMetadataChange }: PageMetadataFormProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Basic Metadata</CardTitle>
          <CardDescription className="text-xs">
            Configure how your page appears and behaves
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slug">URL Path</Label>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">/</span>
              <Input
                id="slug"
                value={metadata.slug}
                onChange={(e) => handleMetadataChange("slug", e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder="my-page"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This will be the URL path: {username}.minispace.dev/{metadata.slug || 'page-url'}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alias">URL Alias (Optional)</Label>
            <Input
              id="alias"
              value={metadata.alias}
              onChange={(e) => handleMetadataChange("alias", e.target.value)}
              placeholder="2023/01/01/old-url.html"
            />
            <p className="text-xs text-muted-foreground">
              Alternative URL that redirects to this page
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="isPage"
              checked={metadata.isPage}
              onCheckedChange={(checked) => handleMetadataChange("isPage", checked)}
            />
            <Label htmlFor="isPage">This is a static page (not a blog post)</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="publishedDate">Published Date</Label>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !metadata.publishedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {metadata.publishedDate ? format(metadata.publishedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={metadata.publishedDate}
                    onSelect={(date) => handleMetadataChange("publishedDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">SEO & Discovery</CardTitle>
          <CardDescription className="text-xs">
            Optimize how your page appears in search engines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={metadata.metaDescription}
              onChange={(e) => handleMetadataChange("metaDescription", e.target.value)}
              placeholder="A brief description of your page"
              className="h-20"
            />
            <p className="text-xs text-muted-foreground flex items-center">
              <Info className="h-3 w-3 mr-1" />
              Recommended length: 150-160 characters
              <span className="ml-auto">{metadata.metaDescription.length}/160</span>
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="metaImage">Meta Image URL (Optional)</Label>
            <Input
              id="metaImage"
              value={metadata.metaImage}
              onChange={(e) => handleMetadataChange("metaImage", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-muted-foreground flex items-center">
              <Image className="h-3 w-3 mr-1" />
              Image that appears when sharing on social media
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="canonicalUrl">Canonical URL (Optional)</Label>
            <Input
              id="canonicalUrl"
              value={metadata.canonicalUrl}
              onChange={(e) => handleMetadataChange("canonicalUrl", e.target.value)}
              placeholder="https://example.com/original-content"
            />
            <p className="text-xs text-muted-foreground flex items-center">
              <Globe className="h-3 w-3 mr-1" />
              Original source if this content appears elsewhere
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Input
              id="language"
              value={metadata.language}
              onChange={(e) => handleMetadataChange("language", e.target.value)}
              placeholder="en"
            />
            <p className="text-xs text-muted-foreground flex items-center">
              <Globe className="h-3 w-3 mr-1" />
              Language code (e.g., en, es, fr)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (Comma Separated)</Label>
            <Input
              id="tags"
              value={metadata.tags}
              onChange={(e) => handleMetadataChange("tags", e.target.value)}
              placeholder="blog, writing, thoughts"
            />
            <p className="text-xs text-muted-foreground flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              Tags help categorize and find your content
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="makeDiscoverable"
              checked={metadata.makeDiscoverable}
              onCheckedChange={(checked) => handleMetadataChange("makeDiscoverable", checked)}
            />
            <Label htmlFor="makeDiscoverable">Make discoverable</Label>
          </div>
          <p className="text-xs text-muted-foreground ml-6">
            Allow this page to appear in search engines and the MINISPACE discovery feed
          </p>
        </CardContent>
      </Card>
    </>
  )
}
