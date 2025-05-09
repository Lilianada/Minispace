"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Home, FileText, Layout, ExternalLink, Save } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Page {
  id: string
  title: string
  slug: string
  content: string
  isHomePage: boolean
  createdAt: any
  updatedAt: any
}

export default function PagesPage(props: { params: { username: string } }) {
  // Access username directly from props to avoid Next.js warning
  const { username } = props.params;
  const { user, userData, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  
  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [isHomePage, setIsHomePage] = useState(false);
  const [headerText, setHeaderText] = useState("");
  const [footerText, setFooterText] = useState("");
  
  // Dialog states
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchPages = async () => {
      try {
        setIsLoading(true);
        const pagesRef = collection(db, "Pages");
        const pagesQuery = query(
          pagesRef,
          where("authorId", "==", user.uid)
        );
        
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
        
        // Also fetch user settings for header/footer
        if (userData) {
          setHeaderText((userData as any)?.headerText || userData?.username || "");
          setFooterText((userData as any)?.footerText || "© " + new Date().getFullYear());
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
  
  const handleCreatePage = async () => {
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
    
    // Check if slug already exists
    const existingPage = pages.find(page => page.slug === slug);
    if (existingPage) {
      toast({
        title: "URL path already exists",
        description: "Please choose a different URL path.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsCreating(true);
      
      // If this is set as home page, update other pages
      if (isHomePage) {
        const homePages = pages.filter(page => page.isHomePage);
        for (const homePage of homePages) {
          await updateDoc(doc(db, "Pages", homePage.id), {
            isHomePage: false,
            updatedAt: serverTimestamp()
          });
        }
      }
      
      // Create new page
      const newPage = {
        title,
        slug,
        content,
        isHomePage,
        authorId: user?.uid,
        username,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, "Pages"), newPage);
      
      // Update local state
      setPages(prev => {
        const updated = isHomePage 
          ? prev.map(p => ({ ...p, isHomePage: false })) 
          : [...prev];
        
        return [
          ...updated, 
          { 
            id: docRef.id, 
            ...newPage, 
            createdAt: new Date(), 
            updatedAt: new Date() 
          }
        ].sort((a, b) => {
          if (a.isHomePage) return -1;
          if (b.isHomePage) return 1;
          return a.title.localeCompare(b.title);
        });
      });
      
      // Reset form
      setTitle("");
      setSlug("");
      setContent("");
      setIsHomePage(false);
    //   setShowCreateDialog(false);
      
      toast({
        title: "Page created",
        description: "Your new page has been created successfully.",
      });
    } catch (error) {
      console.error("Error creating page:", error);
      toast({
        title: "Error",
        description: "Failed to create page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleEditPage = async () => {
    if (!currentPage) return;
    
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
          await updateDoc(doc(db, "Pages", homePage.id), {
            isHomePage: false,
            updatedAt: serverTimestamp()
          });
        }
      }
      
      // Update page
      await updateDoc(doc(db, "Pages", currentPage.id), {
        title,
        slug,
        content,
        isHomePage,
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
  
  const handleDeletePage = async () => {
    if (!currentPage) return;
    
    try {
      await deleteDoc(doc(db, "Pages", currentPage.id));
      
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
  
  const handleUpdateSiteSettings = async () => {
    if (!user) return;
    
    try {
      // Update user document with header and footer text
      await updateDoc(doc(db, "Users", user.uid), {
        headerText,
        footerText,
        updatedAt: serverTimestamp()
      });
      
      toast({
        title: "Settings updated",
        description: "Your site settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating site settings:", error);
      toast({
        title: "Error",
        description: "Failed to update site settings. Please try again.",
        variant: "destructive",
      });
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
  
  if (!user || loading) {
    return (
      <div className="space-y-4">
        <div>
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-4 w-48" />
        </div>
        
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
        
        <Tabs defaultValue="pages">
          <TabsList className="w-full">
            <Skeleton className="h-10 w-full" />
          </TabsList>
        </Tabs>
        
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="py-3 px-4">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="py-2 px-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter className="py-2 px-4 border-t flex justify-end gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-base font-bold tracking-tight">Pages</h1>
        <p className="text-sm text-muted-foreground">
          Manage your blog pages and site appearance
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {pages.length} {pages.length === 1 ? 'page' : 'pages'} total
        </p>
        <Button size="sm" onClick={navigateToCreatePage}>
          <Plus className="h-3.5 w-3.5 mr-1" />
          <span className="text-xs">New Page</span>
        </Button>
      </div>
      
      <Tabs defaultValue="pages">
        <TabsList className="w-full">
          <TabsTrigger value="pages" className="flex-1">Pages</TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">Site Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pages" className="mt-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="py-3 px-4">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent className="py-2 px-4">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter className="py-2 px-4 border-t flex justify-end gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : pages.length === 0 ? (
            <Card className="p-6 text-center">
              <CardContent className="pt-4 pb-6">
                <h3 className="text-base font-medium mb-2">No pages yet</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Create your first page to get started with your blog
                </p>
                <Button onClick={navigateToCreatePage}>
                  Create Your First Page
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pages.map(page => (
                <Card key={page.id}>
                  <CardHeader className="py-3 px-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">{page.title}</CardTitle>
                      {page.isHomePage && (
                        <Badge variant="outline" className="text-xs">
                          <Home className="h-3 w-3 mr-1" />
                          Home
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-xs">
                      /{page.slug}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="py-2 px-4">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {page.content ? page.content.substring(0, 100) + (page.content.length > 100 ? '...' : '') : 'No content'}
                    </p>
                  </CardContent>
                  <CardFooter className="py-2 px-4 border-t flex justify-between">
                    <Button asChild size="sm" variant="ghost" className="h-7 px-2 text-xs">
                      <Link href={`https://${username}.minispace.app/${page.slug}`} target="_blank">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Link>
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 px-2 text-xs"
                        onClick={() => openEditDialog(page)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="h-7 px-2 text-xs"
                        onClick={() => openDeleteDialog(page)}
                        disabled={page.isHomePage} // Prevent deleting home page
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Site Appearance</CardTitle>
              <CardDescription className="text-xs">
                Customize how your blog looks to visitors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="headerText">Header Text / Blog Name</Label>
                <Input 
                  id="headerText" 
                  value={headerText} 
                  onChange={(e) => setHeaderText(e.target.value)}
                  placeholder="Enter your blog name"
                />
                <p className="text-xs text-muted-foreground">
                  This appears at the top of your blog
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="footerText">Footer Text</Label>
                <Input 
                  id="footerText" 
                  value={footerText} 
                  onChange={(e) => setFooterText(e.target.value)}
                  placeholder="© 2025 Your Name"
                />
                <p className="text-xs text-muted-foreground">
                  This appears at the bottom of your blog
                </p>
              </div>
              
              <div className="pt-2">
                <Button onClick={handleUpdateSiteSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Site Settings
                </Button>
              </div>
            </CardContent>
            <CardFooter className="border-t py-3">
              <p className="text-xs text-muted-foreground">
                To add social links to your footer, visit your <Link href={`/${username}/dashboard/profile`} className="underline">profile settings</Link>.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Create Page Dialog removed - now using a separate page */}
      
      {/* Edit Page Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
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
                This will be the URL path for your page: {username}.minispace.app/{slug}
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
                disabled={currentPage?.isHomePage}
              />
              <Label htmlFor="edit-isHomePage" className={currentPage?.isHomePage ? "text-muted-foreground" : ""}>
                {currentPage?.isHomePage ? "This is your home page" : "Set as home page"}
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEditPage} disabled={isEditing}>
              {isEditing ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Page Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Page</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this page? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="font-medium">{currentPage?.title}</p>
            <p className="text-sm text-muted-foreground">/{currentPage?.slug}</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeletePage}>
              Delete Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}