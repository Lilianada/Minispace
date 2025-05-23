"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc, serverTimestamp, collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generatePreviewId, getPreviewUrl } from "@/lib/preview-utils";
import { Page, ContentBlock, PageStyles } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PageHeader,
  PageContentForm,
  PageMetadataForm,
  PageStylingForm,
  PagePreview,
  PageLoadingSkeleton,
  LayoutSelector
} from "@/components/pages";

interface PageFormData {
  title: string;
  slug: string;
  alias: string;
  canonicalUrl: string;
  publishedDate: Date | undefined;
  isPage: boolean;
  metaDescription: string;
  metaImage: string;
  language: string;
  tags: string;
  makeDiscoverable: boolean;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  layout: string;
  isPublished?: boolean;
  isHomepage?: boolean;
}

export default function EditPagePage() {
  // Use the useParams hook to get the username and page ID parameters
  const params = useParams();
  const username = params.username as string;
  const pageId = params.id as string;

  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [isLoading, setIsLoading] = useState(true);
  const [contentBlockId, setContentBlockId] = useState("");
  const [isHomepage, setIsHomepage] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  
  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  
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
    layout: "default",
    isPublished: false,
    isHomepage: false,
  });

  // Load page data on component mount
  useEffect(() => {
    const fetchPageData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        // Get the page document
        const pageDocRef = doc(db, `Users/${user.uid}/pages/${pageId}`);
        const pageDoc = await getDoc(pageDocRef);

        if (!pageDoc.exists()) {
          toast({
            title: "Page not found",
            description: "The requested page could not be found.",
            variant: "destructive",
          });
          router.push(`/${username}/dashboard/pages`);
          return;
        }

        const pageData = pageDoc.data() as Page;
        setTitle(pageData.title);
        setIsHomepage(pageData.isHomepage || false);
        setIsPublished(
          pageData.isHomepage ? true : pageData.isPublished || false
        );

        // Set metadata from page data
        setMetadata({
          title: pageData.title,
          slug: pageData.slug,
          alias: pageData.alias || "",
          canonicalUrl: pageData.canonicalUrl || "",
          publishedDate: pageData.createdAt?.toDate() || new Date(),
          isPage: pageData.isStaticPage || true,
          metaDescription: pageData.seoDescription || "",
          metaImage: pageData.seoImage || "",
          language: pageData.language || "en",
          tags: pageData.tags ? pageData.tags.join(", ") : "",
          makeDiscoverable: pageData.makeDiscoverable ?? true,
          backgroundColor: pageData.styles?.backgroundColor || "#ffffff",
          textColor: pageData.styles?.textColor || "#000000",
          fontFamily: pageData.styles?.fontFamily || "system-ui",
          fontSize: pageData.styles?.fontSize || "16px",
          layout: pageData.layout || "default",
          isPublished: pageData.isHomepage ? true : pageData.isPublished || false,
          isHomepage: pageData.isHomepage || false,
        });

        // Get content blocks
        const contentBlocksRef = collection(pageDocRef, "content");
        const contentQuery = query(contentBlocksRef, orderBy("order"));
        const contentSnapshot = await getDocs(contentQuery);

        // We're assuming the first content block for simplicity
        if (!contentSnapshot.empty) {
          const firstBlock = contentSnapshot.docs[0].data() as ContentBlock;
          setContent(firstBlock.content || "");
          setContentBlockId(firstBlock.blockId);
        }
      } catch (error) {
        console.error("Error fetching page:", error);
        toast({
          title: "Error",
          description: "Failed to load page data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user && pageId) {
      fetchPageData();
    }
  }, [user, pageId, username, router, toast]);

  const handleMetadataChange = (key: keyof PageFormData, value: any) => {
    setMetadata((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (!title) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your page.",
        variant: "destructive",
      });
      return;
    }

    if (!metadata.slug) {
      toast({
        title: "Missing URL path",
        description: "Please provide a URL path for your page.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare tags array
      const tagsArray = metadata.tags
        ? metadata.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      // Create styles object
      const styles: PageStyles = {
        backgroundColor: metadata.backgroundColor,
        textColor: metadata.textColor,
        fontFamily: metadata.fontFamily,
        fontSize: metadata.fontSize,
      };

      // Update page document
      const pageDocRef = doc(db, `Users/${user.uid}/pages/${pageId}`);
      await updateDoc(pageDocRef, {
        title,
        slug: metadata.slug,
        updatedAt: serverTimestamp(),
        layout: metadata.layout,
        styles,
        seoDescription: metadata.metaDescription || null,
        seoImage: metadata.metaImage || null,
        canonicalUrl: metadata.canonicalUrl || null,
        alias: metadata.alias || null,
        language: metadata.language || "en",
        tags: tagsArray,
        makeDiscoverable: metadata.makeDiscoverable,
        isStaticPage: metadata.isPage,
        isPublished: isHomepage ? true : isPublished, // Homepage is always published
      });

      // Update content block if it exists
      if (contentBlockId) {
        const contentBlockRef = doc(
          db,
          `Users/${user.uid}/pages/${pageId}/content/${contentBlockId}`
        );
        await updateDoc(contentBlockRef, {
          content,
        });
      }

      toast({
        title: "Page updated",
        description: "Your page has been updated successfully.",
      });

      // Redirect back to the pages listing
      router.push(`/${username}/dashboard/pages`);
    } catch (error) {
      console.error("Error updating page:", error);
      toast({
        title: "Error",
        description: "Failed to update page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishToggle = async () => {
    // Cannot unpublish homepage
    if (isHomepage && isPublished) {
      toast({
        title: "Cannot unpublish homepage",
        description: "Your homepage must remain published.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Toggle the published state
      const newPublishedState = !isPublished;
      setIsPublished(newPublishedState);

      if (user) {
        await updateDoc(doc(db, `Users/${user.uid}/pages/${pageId}`), {
          isPublished: newPublishedState,
          updatedAt: serverTimestamp(),
        });
      }

      toast({
        title: "Success",
        description: newPublishedState ? "Page published" : "Page unpublished",
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

  const togglePreview = async () => {
    // For simple previews, just toggle the state
    if (showPreview) {
      setShowPreview(false);
      return;
    }

    // For the first preview, use the simple in-page preview
    setShowPreview(true);

    // Also prepare a full preview in a new window
    try {
      setIsPreviewLoading(true);

      // Create preview settings based on current page data
      const previewSettings = {
        title,
        content,
        layout: metadata.layout,
        styles: {
          backgroundColor: metadata.backgroundColor,
          textColor: metadata.textColor,
          fontFamily: metadata.fontFamily,
          fontSize: metadata.fontSize,
        },
      };

      // Generate a preview ID
      const previewId = await generatePreviewId(username, previewSettings);

      // Get the preview URL
      const url = getPreviewUrl(username, previewId);
      setPreviewUrl(url);

      // Open the preview in a new tab
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating preview:", error);
      toast({
        title: "Preview Error",
        description: "Failed to generate page preview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPreviewLoading(false);
    }
  };

  if (isLoading || !user || loading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        username={username}
        isPublished={isPublished}
        isHomepage={isHomepage}
        isSubmitting={isSubmitting}
        isPreviewLoading={isPreviewLoading}
        showPreview={showPreview}
        handlePublishToggle={handlePublishToggle}
        handleSubmit={handleSubmit}
        togglePreview={togglePreview}
      />
      
      {showPreview ? (
        <PagePreview title={title} content={content} />
      ) : (
        <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
            <TabsTrigger value="metadata" className="flex-1">Metadata</TabsTrigger>
            <TabsTrigger value="layout" className="flex-1">Layout</TabsTrigger>
            <TabsTrigger value="styling" className="flex-1">Styling</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-4 pt-4">
            <PageContentForm
              title={title}
              content={content}
              setTitle={setTitle}
              setContent={setContent}
            />
          </TabsContent>
          
          <TabsContent value="metadata" className="space-y-4 pt-4">
            <PageMetadataForm
              metadata={metadata}
              username={username}
              handleMetadataChange={handleMetadataChange}
            />
          </TabsContent>
          
          <TabsContent value="layout" className="space-y-4 pt-4">
            <div className="space-y-4">
              <LayoutSelector
                selectedLayout={metadata.layout}
                setSelectedLayout={(layout) => handleMetadataChange("layout", layout)}
                onSave={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="styling" className="space-y-4 pt-4">
            <PageStylingForm
              metadata={metadata}
              handleMetadataChange={handleMetadataChange}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
