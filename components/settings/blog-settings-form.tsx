"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, Save } from "lucide-react"
import { BlogSettings } from "@/lib/types"

interface BlogSettingsFormProps {
  blogSettings: BlogSettings
  setBlogSettings: (settings: BlogSettings) => void
  enableBlog: boolean
  setEnableBlog: (enabled: boolean) => void
  onSave: () => void
  isSubmitting: boolean
}

export function BlogSettingsForm({
  blogSettings,
  setBlogSettings,
  enableBlog,
  setEnableBlog,
  onSave,
  isSubmitting
}: BlogSettingsFormProps) {
  const updateSettings = (key: keyof BlogSettings, value: any) => {
    setBlogSettings({
      ...blogSettings,
      [key]: value
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="mr-2 h-5 w-5" />
          Blog Settings
        </CardTitle>
        <CardDescription>Configure your blog appearance and behavior</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="enable-blog">Enable Blog</Label>
            <p className="text-sm text-muted-foreground">
              When enabled, your blog will be visible to visitors
            </p>
          </div>
          <Switch
            id="enable-blog"
            checked={enableBlog}
            onCheckedChange={setEnableBlog}
          />
        </div>
        
        {enableBlog && (
          <>
            <div className="space-y-2">
              <Label htmlFor="blog-title">Blog Title</Label>
              <Input
                id="blog-title"
                value={blogSettings.title}
                onChange={(e) => updateSettings('title', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="blog-description">Blog Description</Label>
              <Textarea
                id="blog-description"
                value={blogSettings.description}
                onChange={(e) => updateSettings('description', e.target.value)}
                disabled={isSubmitting}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                A brief description of your blog for SEO and sharing
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="footer-text">Footer Text</Label>
              <Input
                id="footer-text"
                value={blogSettings.footerText}
                onChange={(e) => updateSettings('footerText', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nav-style">Navigation Style</Label>
              <Select
                value={blogSettings.navStyle}
                onValueChange={(value) => updateSettings('navStyle', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="nav-style">
                  <SelectValue placeholder="Select a navigation style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="centered">Centered</SelectItem>
                  <SelectItem value="sidebar">Sidebar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="default-layout">Default Layout</Label>
              <Select
                value={blogSettings.defaultLayout}
                onValueChange={(value) => updateSettings('defaultLayout', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="default-layout">
                  <SelectValue placeholder="Select a default layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="curator">Curator's Shelf</SelectItem>
                  <SelectItem value="stream">Thought Stream</SelectItem>
                  <SelectItem value="gallery">Inspiration Gallery</SelectItem>
                  <SelectItem value="magazine">Mini Magazine</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The default layout for your blog posts
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-dates">Show Dates</Label>
                <p className="text-sm text-muted-foreground">
                  Display publish dates on your blog posts
                </p>
              </div>
              <Switch
                id="show-dates"
                checked={blogSettings.showDates}
                onCheckedChange={(checked) => updateSettings('showDates', checked)}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-tags">Show Tags</Label>
                <p className="text-sm text-muted-foreground">
                  Display tags on your blog posts
                </p>
              </div>
              <Switch
                id="show-tags"
                checked={blogSettings.showTags}
                onCheckedChange={(checked) => updateSettings('showTags', checked)}
                disabled={isSubmitting}
              />
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Saving...' : 'Save Blog Settings'}
        </Button>
      </CardFooter>
    </Card>
  )
}
