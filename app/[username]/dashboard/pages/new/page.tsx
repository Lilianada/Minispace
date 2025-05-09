"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
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
import { ArrowLeft, Save, Eye, Calendar, Globe, Tag, FileText, Info, Image } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface PageMetadata {
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
}

export default function NewPagePage(props: { params: { username: string } }) {
  // Access username directly from props to avoid Next.js warning
  const { username } = props.params
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  // Form states
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("content")
  
  // Metadata states
  const [metadata, setMetadata] = useState<PageMetadata>({
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
    makeDiscoverable: true
  })
  
  // Preview state
  const [showPreview, setShowPreview] = useState(false)
  
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
  
  const handleMetadataChange = (key: keyof PageMetadata, value: any) => {
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
      
      // Create page document
      const pageData = {
        title,
        content,
        slug: metadata.slug,
        alias: metadata.alias || null,
        canonicalUrl: metadata.canonicalUrl || null,
        publishedDate: metadata.publishedDate ? metadata.publishedDate : serverTimestamp(),
        isPage: metadata.isPage,
        metaDescription: metadata.metaDescription || null,
        metaImage: metadata.metaImage || null,
        language: metadata.language || "en",
        tags: tagsArray,
        makeDiscoverable: metadata.makeDiscoverable,
        authorId: user.uid,
        username,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      await addDoc(collection(db, "Pages"), pageData)
      
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
  
  const togglePreview = () => {
    setShowPreview(!showPreview)
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
      <div className="flex items-center justify-between">
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
          >
            <Eye className="h-4 w-4 mr-1" />
            {showPreview ? "Edit" : "Preview"}
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
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h1>{title}</h1>
            {/* Simple markdown rendering - in a real app, use a markdown parser */}
            {content.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      ) : (
        <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
            <TabsTrigger value="metadata" className="flex-1">Metadata</TabsTrigger>
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
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your page content here using Markdown..."
                className="min-h-[300px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                You can use Markdown to format your content. 
                <a 
                  href="https://www.markdownguide.org/basic-syntax/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline ml-1"
                >
                  Learn more
                </a>
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
                    This will be the URL path: {username}.minispace.app/{metadata.slug || 'page-url'}
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
        </Tabs>
      )}
    </div>
  )
}
