"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { generatePreviewId, getPreviewUrl } from "@/lib/preview-utils"
import { Page, ContentBlock, PageStyles } from "@/lib/types"
import { MarkdownEditor } from "@/components/markdown-editor"
import ReactMarkdown from "react-markdown"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Save, Eye, Calendar, Globe, Tag, FileText, Info, Image, Layout } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { LayoutSelector } from "@/components/pages/layout-selector"

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
}

export default function NewPagePage() {
  // Use the useParams hook to get the username parameter
  const params = useParams()
  const username = params.username as string
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  // Form states
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("content")
  
  // Metadata states
  const [metadata, setMetadata] = useState<PageFormData>({
    title: "",
    slug: "",
    alias: "",
    canonicalUrl: "",
    publishedDate: new Date(),
    isPage: true,
    metaDescription: "",
    metaImage: "",
    language: "en",
    tags: "",
    makeDiscoverable: true,
    backgroundColor: "#ffffff",
    textColor: "#000000",
    fontFamily: "system-ui",
    fontSize: "16px",
    layout: "default"
  })
  
  // Preview state
  const [showPreview, setShowPreview] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  
  // Update slug based on title
  useEffect(() => {
    if (title && !metadata.slug) {
      setMetadata(prev => ({
        ...prev,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }))
    }
  }, [title, metadata.slug])
  
  // Update metadata title when main title changes
  useEffect(() => {
    setMetadata(prev => ({
      ...prev,
      title: title
    }))
  }, [title])
  
  // Generate meta description from content if empty
  useEffect(() => {
    if (content && !metadata.metaDescription) {
      const firstParagraph = content.split('\n')[0]
      if (firstParagraph) {
        setMetadata(prev => ({
          ...prev,
          metaDescription: firstParagraph.substring(0, 160) + (firstParagraph.length > 160 ? '...' : '')
        }))
      }
    }
  }, [content, metadata.metaDescription])
  
  const handleMetadataChange = (key: keyof PageFormData, value: any) => {
    setMetadata(prev => ({
      ...prev,
      [key]: value
    }))
  }
  
  const handleSubmit = async () => {
    if (!user) return
    
    if (!title) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your page.",
        variant: "destructive"
      })
      return
    }
    
    if (!metadata.slug) {
      toast({
        title: "Missing URL path",
        description: "Please provide a URL path for your page.",
        variant: "destructive"
      })
      return
    }
    
    try {
      setIsSubmitting(true)
      
      // Prepare tags array
      const tagsArray = metadata.tags
        ? metadata.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : []
      
      // Create styles object
      const styles: PageStyles = {
        backgroundColor: metadata.backgroundColor,
        textColor: metadata.textColor,
        fontFamily: metadata.fontFamily,
        fontSize: metadata.fontSize
      }
      
      // Create page document in the User's pages subcollection
      const userPagesCollection = collection(db, `Users/${user.uid}/pages`)
      const pageDocRef = await addDoc(userPagesCollection, {
        pageId: '', // Will be updated after we get the ID
        title,
        slug: metadata.slug,
        isPublished: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        layout: metadata.layout,
        styles,
        seoDescription: metadata.metaDescription || null,
        seoImage: metadata.metaImage || null,
        canonicalUrl: metadata.canonicalUrl || null,
        isHomepage: false,
        alias: metadata.alias || null,
        language: metadata.language || "en",
        tags: tagsArray,
        makeDiscoverable: metadata.makeDiscoverable,
        isStaticPage: metadata.isPage
      })
      
      // Update the pageId field with the generated document ID
      await setDoc(pageDocRef, { pageId: pageDocRef.id }, { merge: true })
      
      // Create the initial content block in the content subcollection
      const contentBlocksCollection = collection(pageDocRef, 'content')
      const contentBlockRef = await addDoc(contentBlocksCollection, {
        blockId: '', // Will be updated after we get the ID
        type: 'markdown',
        content,
        layoutType: 'column',
        order: 0,
        styles: {
          padding: '1rem',
          margin: '0',
          backgroundColor: 'transparent'
        }
      })
      
      // Update the blockId field with the generated document ID
      await setDoc(contentBlockRef, { blockId: contentBlockRef.id }, { merge: true })
      
      toast({
        title: "Page created",
        description: "Your page has been created successfully."
      })
      
      // Redirect to pages list
      router.push(`/${username}/dashboard/pages`)
    } catch (error) {
      console.error("Error creating page:", error)
      toast({
        title: "Error",
        description: "Failed to create page. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const togglePreview = async () => {
    // For simple previews, just toggle the state
    if (showPreview) {
      setShowPreview(false)
      return
    }
    
    // For the first preview, use the simple in-page preview
    setShowPreview(true)
    
    // Also prepare a full preview in a new window
    try {
      setIsPreviewLoading(true)
      
      // Create preview settings based on current page data
      const previewSettings = {
        title,
        content,
        layout: metadata.layout,
        styles: {
          backgroundColor: metadata.backgroundColor,
          textColor: metadata.textColor,
          fontFamily: metadata.fontFamily,
          fontSize: metadata.fontSize
        }
      }
      
      // Generate a preview ID
      const previewId = await generatePreviewId(username, previewSettings)
      
      // Get the preview URL
      const url = getPreviewUrl(username, previewId)
      setPreviewUrl(url)
      
      // Open the preview in a new tab
      window.open(url, '_blank')
    } catch (error) {
      console.error("Error generating preview:", error)
      toast({
        title: "Preview Error",
        description: "Failed to generate page preview. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsPreviewLoading(false)
    }
  }
  
  if (!user || loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-6 w-32" />
        </div>
        
        <div className="grid gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Link href={`/${username}/dashboard/pages`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-base font-bold tracking-tight">Create New Page</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={togglePreview}
            className="h-8"
            disabled={isPreviewLoading}
          >
            <Eye className="h-4 w-4 mr-1" />
            {isPreviewLoading ? "Loading..." : showPreview ? "Edit" : "Preview"}
          </Button>
          
          <Button 
            size="sm" 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-8"
          >
            <Save className="h-4 w-4 mr-1" />
            {isSubmitting ? "Creating..." : "Create Page"}
          </Button>
        </div>
      </div>
      
      {showPreview ? (
        <div className="border rounded-md p-6 max-w-3xl mx-auto">
          <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <ReactMarkdown>
              {content}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
            <TabsTrigger value="metadata" className="flex-1">Metadata</TabsTrigger>
            <TabsTrigger value="layout" className="flex-1">Layout</TabsTrigger>
            <TabsTrigger value="styling" className="flex-1">Styling</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My New Page"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown)</Label>
              <MarkdownEditor 
                initialValue={content} 
                onChange={(value) => setContent(value)}
              />
              <p className="text-xs text-muted-foreground">
                You can use Markdown to format your content. 
                <Link 
                  href="/docs/markdown" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline ml-1"
                >
                  View Markdown Guide
                </Link>
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="metadata" className="space-y-4 pt-4">
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
                          <Calendar className="mr-2 h-4 w-4" />
                          {metadata.publishedDate ? format(metadata.publishedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
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
          </TabsContent>
          
          <TabsContent value="layout" className="space-y-4 pt-4">
            <LayoutSelector
              selectedLayout={metadata.layout}
              setSelectedLayout={(layout) => handleMetadataChange("layout", layout)}
              onSave={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
          
          <TabsContent value="styling" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Page Styling</CardTitle>
                <CardDescription className="text-xs">
                  Customize the appearance of your page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id="backgroundColor"
                      value={metadata.backgroundColor}
                      onChange={(e) => handleMetadataChange("backgroundColor", e.target.value)}
                      className="w-10 h-10 rounded-md border border-input"
                    />
                    <Input
                      value={metadata.backgroundColor}
                      onChange={(e) => handleMetadataChange("backgroundColor", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id="textColor"
                      value={metadata.textColor}
                      onChange={(e) => handleMetadataChange("textColor", e.target.value)}
                      className="w-10 h-10 rounded-md border border-input"
                    />
                    <Input
                      value={metadata.textColor}
                      onChange={(e) => handleMetadataChange("textColor", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <select
                    id="fontFamily"
                    value={metadata.fontFamily}
                    onChange={(e) => handleMetadataChange("fontFamily", e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="system-ui">System UI</option>
                    <option value="serif">Serif</option>
                    <option value="sans-serif">Sans Serif</option>
                    <option value="monospace">Monospace</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <select
                    id="fontSize"
                    value={metadata.fontSize}
                    onChange={(e) => handleMetadataChange("fontSize", e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="14px">Small (14px)</option>
                    <option value="16px">Medium (16px)</option>
                    <option value="18px">Large (18px)</option>
                    <option value="20px">Extra Large (20px)</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
