"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Check, X, ArrowLeft, FileText, Hash, MoreHorizontal, Eye, Save, Info } from "lucide-react"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const MAX_EXCERPT_LENGTH = 150
const MAX_TAGS = 3
const MARKDOWN_TIPS = [
  { label: "Heading", syntax: "# Heading" },
  { label: "Bold", syntax: "**bold text**" },
  { label: "Italic", syntax: "*italicized text*" },
  { label: "Link", syntax: "[title](https://www.example.com)" },
  { label: "Quote", syntax: "> blockquote" },
  { label: "Code", syntax: "`code`" },
  { label: "List", syntax: "- Item 1\n- Item 2" },
]

export default function NewPost() {
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [body, setBody] = useState("")
  const [tag, setTag] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [openTips, setOpenTips] = useState(false)
  const [errors, setErrors] = useState({
    title: "",
    excerpt: "",
    body: "",
  })
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();


  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleAddTag = () => {
    const trimmedTag = tag.trim().toLowerCase()
    if (trimmedTag && tags.length < MAX_TAGS && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTag("")
    } else if (tags.includes(trimmedTag)) {
      toast({
        title: "Duplicate tag",
        description: "This tag has already been added",
        variant: "destructive",
        duration: 2000,
      })
    } else if (tags.length >= MAX_TAGS) {
      toast({
        title: "Tag limit reached",
        description: `You can only add up to ${MAX_TAGS} tags per post`,
        variant: "destructive",
        duration: 2000,
      })
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleExcerptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= MAX_EXCERPT_LENGTH) {
      setExcerpt(value)
      setErrors((prev) => ({ ...prev, excerpt: "" }))
    } else {
      setExcerpt(value.substring(0, MAX_EXCERPT_LENGTH))
      setErrors((prev) => ({ ...prev, excerpt: `Excerpt cannot exceed ${MAX_EXCERPT_LENGTH} characters` }))
    }
  }

  const insertMarkdownSyntax = (syntax: string) => {
    // Insert the syntax at the current cursor position or at the end
    setBody(prevBody => prevBody + syntax)
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { title: "", excerpt: "", body: "" }

    if (!title.trim()) {
      newErrors.title = "Title is required"
      isValid = false
    }

    if (!excerpt.trim()) {
      newErrors.excerpt = "Excerpt is required"
      isValid = false
    } else if (excerpt.length > MAX_EXCERPT_LENGTH) {
      newErrors.excerpt = `Excerpt cannot exceed ${MAX_EXCERPT_LENGTH} characters`
      isValid = false
    }

    if (!body.trim()) {
      newErrors.body = "Content is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (published: boolean) => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    try {
      setIsSubmitting(true)

      if (!db) {
        throw new Error("Firestore is not initialized")
      }

      await addDoc(collection(db, "Articles"), {
        title,
        excerpt,
        body,
        authorId: user?.uid,
        authorName: userData?.username,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        tags,
        readCount: 0,
        published,
      })

      toast({
        title: "Success",
        description: published ? "Article published successfully" : "Draft saved successfully",
        duration: 3000,
      })

      // Redirect to the posts listing page
      router.push(`/${userData?.username}/dashboard/posts`)
    } catch (error) {
      console.error("Error saving article:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save article",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNavigateAway = () => {
    // If form has content, show confirmation dialog
    if (title.trim() || excerpt.trim() || body.trim() || tags.length > 0) {
      setConfirmDialogOpen(true)
    } else {
      router.back()
    }
  }

  return (
    <>
      <div className="container mx-auto py-6 max-w-4xl">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleNavigateAway}
                    aria-label="Go back"
                    className="rounded-full h-9 w-9"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Back</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <h1 className="text-2xl font-semibold">Create New Post</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline"
                    size="sm" 
                    onClick={() => setShowPreview(!showPreview)}
                    aria-label={showPreview ? "Show editor" : "Show preview"}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    {showPreview ? "Editor" : "Preview"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{showPreview ? "Switch to editor" : "Preview your post"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </header>

        <Card className="overflow-hidden border-none shadow-md">
          <CardContent className="p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="title" className="text-base font-medium">Post Title</Label>
              </div>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an attention-grabbing title"
                disabled={isSubmitting}
                className="text-lg font-medium"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="excerpt" className="text-base font-medium">
                  Post Summary
                </Label>
                <span className={`text-xs ${excerpt.length >= MAX_EXCERPT_LENGTH ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
                  {excerpt.length}/{MAX_EXCERPT_LENGTH} characters
                </span>
              </div>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={handleExcerptChange}
                placeholder="Write a brief summary that will appear in post listings (max 150 characters)"
                disabled={isSubmitting}
                className="resize-none h-24"
              />
              {errors.excerpt && <p className="mt-1 text-sm text-red-500">{errors.excerpt}</p>}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="body" className="text-base font-medium">Content</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setOpenTips(!openTips)}
                        className="text-xs flex items-center gap-1 h-7 px-2"
                      >
                        <Info className="h-3 w-3" />
                        Markdown Tips
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Show Markdown formatting tips</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {openTips && (
                <div className="bg-muted/50 p-3 rounded-md mb-2">
                  <div className="text-xs font-medium mb-2">Markdown Formatting</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {MARKDOWN_TIPS.map((tip) => (
                      <Button 
                        key={tip.syntax} 
                        variant="outline" 
                        size="sm"
                        className="text-xs h-7 justify-start"
                        onClick={() => insertMarkdownSyntax(tip.syntax)}
                      >
                        {tip.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {!showPreview ? (
                <>
                  <Textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your post content here using Markdown..."
                    disabled={isSubmitting}
                    className="min-h-[400px]"
                  />
                  {errors.body && <p className="mt-1 text-sm text-red-500">{errors.body}</p>}
                </>
              ) : (
                <div className="border rounded-lg p-5 min-h-[400px] prose prose-sm dark:prose-invert max-w-none">
                  {body ? (
                    <div dangerouslySetInnerHTML={{ __html: body.replace(/\n/g, '<br>') }} />
                  ) : (
                    <p className="text-muted-foreground">No content to preview yet...</p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (max 3)</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a tag"
                  disabled={isSubmitting || tags.length >= 3}
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddTag} disabled={isSubmitting || tags.length >= 3 || !tag.trim()}>
                  Add
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((t) => (
                    <Badge key={t} className="flex items-center gap-1">
                      {t}
                      <button
                        onClick={() => handleRemoveTag(t)}
                        className="rounded-full hover:bg-muted p-1"
                        aria-label={`Remove ${t} tag`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={() => handleSubmit(true)} disabled={isSubmitting}>
                {isSubmitting ? "Publishing..." : "Publish"}
              </Button>
              <Button variant="outline" onClick={() => handleSubmit(false)} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save as Draft"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
