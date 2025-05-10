"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { collection, query, getDocs, doc, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Layout } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageList, Page } from "@/components/pages/page-list"
import { EditPageDialog } from "@/components/pages/edit-page-dialog"
import { DeletePageDialog } from "@/components/pages/delete-page-dialog"
import { SiteSettings } from "@/components/pages/site-settings"
import DashboardShell from "@/components/dashboard/dashboard-shell"

export default function PagesPage() {
  // Use the useParams hook to get the username parameter
  const params = useParams();
  const username = params.username as string;
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [isHomePage, setIsHomePage] = useState(false);
  const [headerText, setHeaderText] = useState("");
  const [footerText, setFooterText] = useState("");
  // Layout and theme selection states
  const [selectedLayout, setSelectedLayout] = useState("classic-columnist")
  // Dialog states
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Theme color states
  const [fontFamily, setFontFamily] = useState("inter")
  const [accentColor, setAccentColor] = useState("#3b82f6")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [textColor, setTextColor] = useState("#000000")
  

  useEffect(() => {
    if (!user) return;

    const fetchPages = async () => {
      try {
        setIsLoading(true);
        // Use the nested collection structure: Users/{userId}/pages
        const pagesRef = collection(db, `Users/${user.uid}/pages`);
        const pagesQuery = query(pagesRef);

        const querySnapshot = await getDocs(pagesQuery);
        const fetchedPages = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Page[];

        // Sort pages with home page first, then alphabetically
        fetchedPages.sort((a, b) => {
          if (a.isHomePage) return -1;
          if (b.isHomePage) return 1;
          return a.title.localeCompare(b.title);
        });

        setPages(fetchedPages);

        // Also fetch user settings for header/footer and theme
        if (userData) {
          setHeaderText((userData as any)?.headerText || userData?.username || "");
          setFooterText((userData as any)?.footerText || "© " + new Date().getFullYear());
          
          // Load layout and theme settings if available
          if ((userData as any)?.selectedLayout) {
            setSelectedLayout((userData as any).selectedLayout);
          }
          
          // Load font and color settings if available
          if ((userData as any)?.fontFamily) {
            setFontFamily((userData as any).fontFamily);
          }
          
          if ((userData as any)?.accentColor) {
            setAccentColor((userData as any).accentColor);
          }
          
          if ((userData as any)?.backgroundColor) {
            setBackgroundColor((userData as any).backgroundColor);
          }
          
          if ((userData as any)?.textColor) {
            setTextColor((userData as any).textColor);
          }
        }
      } catch (error) {
        console.error("Error fetching pages:", error);
        toast({
          title: "Error",
          description: "Failed to load pages. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPages();
  }, [user, userData, toast]);

  const handleEditPage = async () => {
    if (!user || !currentPage) return;

    if (!title || !slug) {
      toast({
        title: "Missing fields",
        description: "Please provide both a title and URL path.",
        variant: "destructive",
      });
      return;
    }

    // Validate slug format (alphanumeric, hyphens, no spaces)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      toast({
        title: "Invalid URL path",
        description: "URL path can only contain lowercase letters, numbers, and hyphens.",
        variant: "destructive",
      });
      return;
    }

    // Check if slug already exists (excluding current page)
    const existingPage = pages.find(page => page.slug === slug && page.id !== currentPage.id);
    if (existingPage) {
      toast({
        title: "URL path already exists",
        description: "Please choose a different URL path.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsEditing(true);

      // If this is set as home page, update other pages
      if (isHomePage && !currentPage.isHomePage) {
        const homePages = pages.filter(page => page.isHomePage);
        for (const homePage of homePages) {
          await updateDoc(doc(db, `Users/${user.uid}/pages`, homePage.id), {
            isHomePage: false,
            updatedAt: serverTimestamp()
          });
        }
      }

      // Update page
      await updateDoc(doc(db, `Users/${user.uid}/pages`, currentPage.id), {
        title,
        slug,
        content,
        isHomePage: isHomePage || false, // Ensure isHomePage is never undefined
        updatedAt: serverTimestamp()
      });

      // Update local state
      setPages(prev => {
        const updated = isHomePage && !currentPage.isHomePage
          ? prev.map(p => ({ ...p, isHomePage: p.id === currentPage.id }))
          : [...prev];

        return updated.map(page =>
          page.id === currentPage.id
            ? { ...page, title, slug, content, isHomePage, updatedAt: new Date() }
            : page
        ).sort((a, b) => {
          if (a.isHomePage) return -1;
          if (b.isHomePage) return 1;
          return a.title.localeCompare(b.title);
        });
      });

      setShowEditDialog(false);

      toast({
        title: "Page updated",
        description: "Your page has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating page:", error);
      toast({
        title: "Error",
        description: "Failed to update page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEditing(false);
    }
  };

  const handleUpdateSiteSettings = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      // Update user document with header, footer, layout and theme settings
      const userDocRef = doc(db, `Users/${user.uid}`);
      await updateDoc(userDocRef, {
        headerText,
        footerText,
        selectedLayout,
        fontFamily,
        accentColor,
        backgroundColor,
        textColor
      });

      toast({
        title: "Settings Updated",
        description: "Your site settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating site settings:", error);
      toast({
        title: "Error",
        description: "Failed to update site settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePage = async () => {
    if (!currentPage || !user) return;

    try {
      await deleteDoc(doc(db, `Users/${user.uid}/pages`, currentPage.id));

      // Update local state
      setPages(prev => prev.filter(page => page.id !== currentPage.id));

      setShowDeleteDialog(false);
      setCurrentPage(null);

      toast({
        title: "Page deleted",
        description: "Your page has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting page:", error);
      toast({
        title: "Error",
        description: "Failed to delete page. Please try again.",
        variant: "destructive",
      });
    }
  };



  // Function to save theme selection
  const saveThemeSelection = async () => {
    if (!user) return;

    try {
      setIsSubmitting(true);

      const userDoc = doc(db, `Users/${user.uid}`);
      await updateDoc(userDoc, {
        theme: selectedTheme,
      });

      toast({
        title: "Theme saved",
        description: "Your theme has been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving theme:", error);
      toast({
        title: "Error",
        description: "Failed to save theme. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  // Function to save style preferences
    const saveStylePreferences = async () => {
      if (!user) return;
      
      try {
        setIsSubmitting(true);
        
        const userDoc = doc(db, `Users/${user.uid}`);
        await updateDoc(userDoc, {
          stylePreferences,
        });
        
        toast({
          title: "Appearance saved",
          description: "Your appearance settings have been updated successfully.",
        });
      } catch (error) {
        console.error("Error saving style preferences:", error);
        toast({
          title: "Error",
          description: "Failed to save appearance settings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    };

  const openEditDialog = (page: Page) => {
    setCurrentPage(page);
    setTitle(page.title);
    setSlug(page.slug);
    setContent(page.content);
    setIsHomePage(page.isHomePage);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (page: Page) => {
    setCurrentPage(page);
    setShowDeleteDialog(true);
  };

  const navigateToCreatePage = () => {
    router.push(`/${username}/dashboard/pages/new`);
  };

  return (
    <DashboardShell>
      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Pages</h1>
          <Button onClick={navigateToCreatePage}>
            <Plus className="h-4 w-4 mr-2" />
            Create Page
          </Button>
        </div>

        <Tabs defaultValue="pages">
          <TabsList>
            <TabsTrigger value="pages">
              <FileText className="h-4 w-4 mr-2" />
              Your Pages
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Layout className="h-4 w-4 mr-2" />
              Site Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="space-y-4">
            <PageList
              pages={pages}
              isLoading={isLoading}
              username={username}
              onEditPage={openEditDialog}
              onDeletePage={openDeleteDialog}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <SiteSettings
              username={username}
              headerText={headerText}
              setHeaderText={setHeaderText}
              footerText={footerText}
              setFooterText={setFooterText}
              selectedLayout={selectedLayout}
              setSelectedLayout={setSelectedLayout}
              fontFamily={fontFamily}
              setFontFamily={setFontFamily}
              accentColor={accentColor}
              setAccentColor={setAccentColor}
              backgroundColor={backgroundColor}
              setBackgroundColor={setBackgroundColor}
              textColor={textColor}
              setTextColor={setTextColor}
              onSave={handleUpdateSiteSettings}
              isSaving={isSaving}
            />
          </TabsContent>
        </Tabs>

        {/* Edit Page Dialog */}
        <EditPageDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          page={currentPage}
          username={username}
          isEditing={isEditing}
          onSave={handleEditPage}
          title={title}
          setTitle={setTitle}
          slug={slug}
          setSlug={setSlug}
          content={content}
          setContent={setContent}
          isHomePage={isHomePage}
          setIsHomePage={setIsHomePage}
        />

        {/* Delete Page Dialog */}
        <DeletePageDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          page={currentPage}
          onDelete={handleDeletePage}
        />
      </div>
    </DashboardShell>
  );
}
