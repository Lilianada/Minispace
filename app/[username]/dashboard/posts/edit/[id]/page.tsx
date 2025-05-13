"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Check,
  X,
  ArrowLeft,
  FileText,
  Hash,
  MoreHorizontal,
  Eye,
  Save,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

const MAX_EXCERPT_LENGTH = 150;
const MAX_TAGS = 3;
const MARKDOWN_TIPS = [
  { label: "Heading", syntax: "# Heading" },
  { label: "Bold", syntax: "**bold text**" },
  { label: "Italic", syntax: "*italicized text*" },
  { label: "Link", syntax: "[title](https://www.example.com)" },
  { label: "Quote", syntax: "> blockquote" },
  { label: "Code", syntax: "`code`" },
  { label: "List", syntax: "- Item 1\n- Item 2" },
];

export default function EditPost() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [openTips, setOpenTips] = useState(false);
  const [published, setPublished] = useState(false);
  const [isPostLoading, setIsPostLoading] = useState(true);
  const [errors, setErrors] = useState({
    title: "",
    excerpt: "",
    body: "",
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    const fetchPostData = async () => {
      try {
        setIsPostLoading(true);
        const postDoc = await getDoc(doc(db, "Articles", postId));

        if (!postDoc.exists()) {
          toast({
            title: "Error",
            description: "Post not found",
            variant: "destructive",
            duration: 3000,
          });
          router.push(`/${userData?.username}/dashboard/posts`);
          return;
        }

        const postData = postDoc.data();

        // Verify this post belongs to the current user
        if (postData.authorId !== user?.uid) {
          toast({
            title: "Error",
            description: "You don't have permission to edit this post",
            variant: "destructive",
            duration: 3000,
          });
          router.push(`/${userData?.username}/dashboard/posts`);
          return;
        }

        setTitle(postData.title || "");
        setExcerpt(postData.excerpt || "");
        setBody(postData.body || "");
        setTags(postData.tags || []);
        setPublished(postData.published || false);
        setIsPostLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast({
          title: "Error",
          description: "Failed to load post data",
          variant: "destructive",
          duration: 3000,
        });
      }
    };

    if (user && postId) {
      fetchPostData();
    }
  }, [user, postId, router, loading, userData?.username, toast]);

  const handleAddTag = () => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && tags.length < MAX_TAGS && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTag("");
    } else if (tags.includes(trimmedTag)) {
      toast({
        title: "Duplicate tag",
        description: "This tag has already been added",
        variant: "destructive",
        duration: 2000,
      });
    } else if (tags.length >= MAX_TAGS) {
      toast({
        title: "Tag limit reached",
        description: `You can only add up to ${MAX_TAGS} tags per post`,
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleExcerptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_EXCERPT_LENGTH) {
      setExcerpt(value);
      setErrors((prev) => ({ ...prev, excerpt: "" }));
    } else {
      setExcerpt(value.substring(0, MAX_EXCERPT_LENGTH));
      setErrors((prev) => ({
        ...prev,
        excerpt: `Excerpt cannot exceed ${MAX_EXCERPT_LENGTH} characters`,
      }));
    }
  };

  const insertMarkdownSyntax = (syntax: string) => {
    // Insert the syntax at the current cursor position or at the end
    setBody((prevBody) => prevBody + syntax);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: "", excerpt: "", body: "" };

    if (!title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!excerpt.trim()) {
      newErrors.excerpt = "Excerpt is required";
      isValid = false;
    } else if (excerpt.length > MAX_EXCERPT_LENGTH) {
      newErrors.excerpt = `Excerpt cannot exceed ${MAX_EXCERPT_LENGTH} characters`;
      isValid = false;
    }

    if (!body.trim()) {
      newErrors.body = "Content is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      setIsSubmitting(true);

      if (!db) {
        throw new Error("Firestore is not initialized");
      }

      await updateDoc(doc(db, "Articles", postId), {
        title,
        excerpt,
        body,
        updatedAt: serverTimestamp(),
        tags,
        published,
      });

      toast({
        title: "Success",
        description: "Post updated successfully",
        duration: 3000,
      });

      // Redirect to the posts listing page
      router.push(`/${userData?.username}/dashboard/posts`);
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update post",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishToggle = async () => {
    try {
      setIsSubmitting(true);

      await updateDoc(doc(db, "Articles", postId), {
        published: !published,
        updatedAt: serverTimestamp(),
      });

      setPublished(!published);

      toast({
        title: "Success",
        description: published ? "Post unpublished" : "Post published",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast({
        title: "Error",
        description: "Failed to update publish status",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavigateAway = () => {
    // If form has content, show confirmation dialog
    if (title.trim() || excerpt.trim() || body.trim() || tags.length > 0) {
      setConfirmDialogOpen(true);
    } else {
      router.back();
    }
  };

  if (isPostLoading || loading) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <div className="h-6 bg-gray-300 rounded w-48"></div>
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            <div className="h-32 bg-gray-300 rounded w-full"></div>
            <div className="h-64 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className=" mx-auto py-6">
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
            <h1 className="text-lg font-semibold">Edit Post</h1>
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
                <TooltipContent>
                  {showPreview ? "Switch to editor" : "Preview your post"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </header>

        <Card className="overflow-hidden border-none shadow-none">
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-between items-end">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="title" className="text-base font-medium">
                    Post Title
                  </Label>
                </div>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter an attention-grabbing title"
                  disabled={isSubmitting}
                  className="text-lg font-medium"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="excerpt" className="text-base font-medium">
                  Post Summary
                </Label>
                <span
                  className={`text-xs ${
                    excerpt.length >= MAX_EXCERPT_LENGTH
                      ? "text-red-500 font-medium"
                      : "text-muted-foreground"
                  }`}
                >
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
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-500">{errors.excerpt}</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="body" className="text-base font-medium">
                  Content
                </Label>
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
                    <TooltipContent>
                      Show Markdown formatting tips
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {openTips && (
                <div className="bg-muted/50 p-3 rounded-md mb-2">
                  <div className="text-xs font-medium mb-2">
                    Markdown Formatting
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {MARKDOWN_TIPS.map((tip) => (
                      <Button
                        key={tip.syntax}
                        variant="outline"
                        size="sm"
                        className="text-xs justify-start"
                        onClick={() => insertMarkdownSyntax(tip.syntax)}
                      >
                        {tip.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {!showPreview ? (
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your post content in Markdown..."
                  disabled={isSubmitting}
                  className="min-h-[400px] font-mono text-sm"
                />
              ) : (
                <div className="border rounded-md p-4 min-h-[400px] prose prose-sm max-w-none">
                  {/* Markdown preview content would go here */}
                  <div className="text-muted-foreground italic">
                    {body
                      ? "Preview content would render here"
                      : "Nothing to preview yet"}
                  </div>
                  <pre className="text-xs mt-4 p-2 bg-muted/50 rounded">
                    {body || "No content"}
                  </pre>
                </div>
              )}
              {errors.body && (
                <p className="mt-1 text-sm text-red-500">{errors.body}</p>
              )}
            </div>

            <div>
              <Label
                htmlFor="tags"
                className="text-base font-medium block mb-2"
              >
                Tags
              </Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((t) => (
                  <Badge
                    key={t}
                    variant="secondary"
                    className="gap-1 text-xs py-1"
                  >
                    <Hash className="h-3 w-3" />
                    {t}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 rounded-full"
                      onClick={() => handleRemoveTag(t)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {t}</span>
                    </Button>
                  </Badge>
                ))}
                {tags.length === 0 && (
                  <span className="text-xs text-muted-foreground">
                    No tags added yet
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="tags"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Add up to ${MAX_TAGS} tags...`}
                  disabled={isSubmitting || tags.length >= MAX_TAGS}
                  className="max-w-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTag}
                  disabled={
                    !tag.trim() || tags.length >= MAX_TAGS || isSubmitting
                  }
                >
                  Add
                </Button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Press Enter to add. {MAX_TAGS - tags.length} tag
                {MAX_TAGS - tags.length !== 1 ? "s" : ""} remaining.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t p-0 py-4 bg-muted/20">
           <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleNavigateAway}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
              <div className="ml-4 flex items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2 rounded-md border p-2">
                        <Switch
                          checked={published}
                          onCheckedChange={handlePublishToggle}
                          id="publish-status"
                          disabled={isSubmitting}
                        />
                        <Label
                          htmlFor="publish-status"
                          className="font-medium text-sm flex items-center"
                        >
                          {published ? (
                            <>
                              <span className="text-green-500 flex items-center">
                                <Check className="h-3 w-3 mr-1" />
                                Published
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-muted-foreground">
                                Draft
                              </span>
                            </>
                          )}
                        </Label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {published
                        ? "This post is published and visible to visitors"
                        : "This post is a draft and only visible to you"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
           </div>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave this
              page? Your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue editing</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.back()}>
              Discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
