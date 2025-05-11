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
  // Lint fix: state for theme/style/submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>("light");
  const [stylePreferences, setStylePreferences] = useState<any>({});

  // Handler for editing a page: opens the edit dialog and sets the current page
  const handleEditPageClick = (page: Page) => {
    setCurrentPage(page);
    setTitle(page.title);
    setSlug(page.slug);
    setContent(page.content || "");
    setIsHomePage(!!page.isHomePage);
    setPageLayout(page.layout || "landing-page"); // Set the page-specific layout
    setShowEditDialog(true);
  };

  // Handler for deleting a page: opens the delete dialog and sets the current page
  const handleDeletePageClick = (page: Page) => {
    setCurrentPage(page);
    setShowDeleteDialog(true);
  };

  // Handler for setting a page as homepage
  const handleSetHomePage = async (page: Page) => {
    if (!user) return;
    try {
      // Unset other homepages
      const homePages = pages.filter(p => p.isHomePage);
      for (const homePage of homePages) {
        await updateDoc(doc(db, `Users/${user.uid}/pages`, homePage.id), {
          isHomePage: false,
          updatedAt: serverTimestamp()
        });
      }
      // Set selected page as homepage
      await updateDoc(doc(db, `Users/${user.uid}/pages`, page.id), {
        isHomePage: true,
        updatedAt: serverTimestamp()
      });
      setPages(prev => prev.map(p => ({ ...p, isHomePage: p.id === page.id })));
      toast({
        title: "Homepage set",
        description: `"${page.title}" is now your homepage.`,
        duration: 3000
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set homepage.",
        variant: "destructive",
        duration: 3000
      });
    }
  };

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
  const [pageLayout, setPageLayout] = useState("landing-page"); // For per-page layout
  const [headerText, setHeaderText] = useState("");
  const [footerText, setFooterText] = useState("");
  // Layout and theme selection states - this is the global theme
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
          duration: 3000
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
        duration: 3000
      });
      return;
    }

    // Validate slug format (alphanumeric, hyphens, no spaces)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      toast({
        title: "Invalid URL path",
        description: "URL path can only contain lowercase letters, numbers, and hyphens.",
        variant: "destructive",
        duration: 3000
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
        duration: 3000
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

      // Update page with the new layout
      await updateDoc(doc(db, `Users/${user.uid}/pages`, currentPage.id), {
        title,
        slug,
        content,
        layout: pageLayout,
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
            ? { 
                ...page, 
                title, 
                slug, 
                content, 
                layout: pageLayout, 
                isHomePage, 
                updatedAt: new Date() 
              }
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
        duration: 3000
      });
    } catch (error) {
      console.error("Error updating page:", error);
      toast({
        title: "Error",
        description: "Failed to update page. Please try again.",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsEditing(false);
    }
  };

  const handleUpdateSiteSettings = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      // Update user document with header, footer, and theme settings
      // Note: selectedLayout is now for global theme only, not page layouts
      const userDocRef = doc(db, `Users/${user.uid}`);
      await updateDoc(userDocRef, {
        headerText,
        footerText,
        selectedLayout, // This is now the global theme
        fontFamily,
        accentColor,
        backgroundColor,
        textColor
      });

      toast({
        title: "Settings Updated",
        description: "Your site settings have been updated successfully.",
        duration: 3000
      });
    } catch (error) {
      console.error("Error updating site settings:", error);
      toast({
        title: "Error",
        description: "Failed to update site settings. Please try again.",
        variant: "destructive",
        duration: 3000
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
        duration: 3000
      });
    } catch (error) {
      console.error("Error deleting page:", error);
      toast({
        title: "Error",
        description: "Failed to delete page. Please try again.",
        variant: "destructive",
        duration: 3000
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
        duration: 3000
      });
    } catch (error) {
      console.error("Error saving theme:", error);
      toast({
        title: "Error",
        description: "Failed to save theme. Please try again.",
        variant: "destructive",
        duration: 3000
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
          duration: 3000
        });
      } catch (error) {
        console.error("Error saving style preferences:", error);
        toast({
          title: "Error",
          description: "Failed to save appearance settings. Please try again.",
          variant: "destructive",
          duration: 3000
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
    setPageLayout(page.layout || "landing-page");
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
      <header>
          <h1 className="text-2xl font-bold tracking-tight">Pages</h1>
          <p className="text-muted-foreground">
            Choose the layout and theme of your minispace.
          </p>
        </header>
        <Tabs defaultValue="pages" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="pages">
            <div className="flex justify-end mb-4">
              <Button onClick={() => router.push(`/${username}/dashboard/pages/new`)}>
                <Plus className="h-4 w-4 mr-2" /> New Page
              </Button>
            </div>
            <PageList
              pages={pages}
              isLoading={isLoading}
              username={username}
              onEditPage={handleEditPageClick}
              onDeletePage={handleDeletePageClick}
              onSetHomePage={handleSetHomePage}
            />
          </TabsContent>
          <TabsContent value="settings">
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
        {currentPage && (
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
            layout={pageLayout}
            setLayout={setPageLayout}
          />
        )}
        {/* Delete Page Dialog */}
        {currentPage && (
          <DeletePageDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            page={currentPage}
            onDelete={handleDeletePage}
          />
        )}
      </div>
    </DashboardShell>
  );
};
