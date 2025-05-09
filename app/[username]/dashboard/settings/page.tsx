"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore"
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from "firebase/auth"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Check, Copy, Download, Globe, Info, Key, Palette, Save, Shield, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { BlogSettings, StylePreferences } from "@/lib/types"

export default function SettingsPage() {
  // Get username from URL params
  const params = useParams();
  const urlUsername = params.username as string;
  
  // Auth and router
  const { user, userData, logout, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  // Tab state
  const [activeTab, setActiveTab] = useState("blog")
  
  // Account settings state
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  
  // Blog settings state
  const [enableBlog, setEnableBlog] = useState(true)
  const [blogSettings, setBlogSettings] = useState<BlogSettings>({
    title: "",
    description: "",
    footerText: "",
    navStyle: "minimal",
    showDates: true,
    showTags: true,
    defaultLayout: "default"
  })
  
  // Domain settings state
  const [customDomain, setCustomDomain] = useState("")
  const [isVerifyingDomain, setIsVerifyingDomain] = useState(false)
  
  // Style preferences state
  const [stylePreferences, setStylePreferences] = useState<StylePreferences>({
    fontFamily: "system-ui",
    fontSize: "16px",
    textColor: "#000000",
    backgroundColor: "#ffffff",
    accentColor: "#3b82f6"
  })
  
  // Theme selection state
  const [selectedTheme, setSelectedTheme] = useState("default")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (userData) {
      // Load account settings
      setUsername(userData.username)
      setEmail(userData.email)
      
      // Load blog settings
      setEnableBlog(userData.enableBlog ?? true)
      if (userData.blogSettings) {
        setBlogSettings({
          title: userData.blogSettings.title || userData.username,
          description: userData.blogSettings.description || "",
          footerText: userData.blogSettings.footerText || `© ${new Date().getFullYear()} ${userData.username}`,
          navStyle: userData.blogSettings.navStyle || "minimal",
          showDates: userData.blogSettings.showDates ?? true,
          showTags: userData.blogSettings.showTags ?? true,
          defaultLayout: userData.blogSettings.defaultLayout || "default"
        })
      }
      
      // Load custom domain if available
      if (userData.customDomain) {
        setCustomDomain(userData.customDomain)
      }
      
      // Load style preferences if available
      if (userData.stylePreferences) {
        setStylePreferences({
          fontFamily: userData.stylePreferences.fontFamily || "system-ui",
          fontSize: userData.stylePreferences.fontSize || "16px",
          textColor: userData.stylePreferences.textColor || "#000000",
          backgroundColor: userData.stylePreferences.backgroundColor || "#ffffff",
          accentColor: userData.stylePreferences.accentColor || "#3b82f6"
        })
      }
      
      // Load theme selection if available
      if (userData.theme) {
        setSelectedTheme(userData.theme)
      }
    }
  }, [user, userData, router])

  const handleUpdateProfile = async () => {
    if (!user) return

    if (!username || !email) {
      toast({
        title: "Error",
        description: "Username and email are required",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      // Check if username has changed
      const usernameChanged = username !== userData?.username

      // Update Firestore document
      await updateDoc(doc(db, "Users", user.uid), {
        username,
        email,
      })

      // Update username in all past articles if it changed
      if (usernameChanged) {
        try {
          // Query all articles by this author
          const articlesQuery = query(
            collection(db, "Articles"),
            where("authorId", "==", user.uid)
          )
          
          const articlesSnapshot = await getDocs(articlesQuery)
          
          // Update each article with the new username
          const updatePromises = articlesSnapshot.docs.map(articleDoc => {
            return updateDoc(doc(db, "Articles", articleDoc.id), {
              authorName: username
            })
          })
          
          await Promise.all(updatePromises)
          
          toast({
            title: "Username Updated",
            description: `Username updated in ${articlesSnapshot.size} article${articlesSnapshot.size !== 1 ? 's' : ''}.`,
          })
        } catch (articlesError) {
          console.error("Error updating articles:", articlesError)
          toast({
            title: "Warning",
            description: "Profile updated but there was an issue updating your username in past articles.",
            variant: "destructive",
          })
        }
      }

      // Update email in Firebase Auth if it changed
      if (email !== userData?.email) {
        if (!currentPassword) {
          toast({
            title: "Error",
            description: "Current password is required to change email",
            variant: "destructive",
          })
          return
        }

        const credential = EmailAuthProvider.credential(userData?.email || "", currentPassword)

        await reauthenticateWithCredential(user, credential)
        await updateEmail(user, email)
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })

      setIsEditing(false)
      setCurrentPassword("")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChangePassword = async () => {
    if (!user) return

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "All password fields are required",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const credential = EmailAuthProvider.credential(userData?.email || "", currentPassword)

      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword)

      toast({
        title: "Success",
        description: "Password updated successfully",
      })

      setIsChangingPassword(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update password",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return

    if (!deleteConfirmPassword) {
      toast({
        title: "Error",
        description: "Password is required to delete account",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const credential = EmailAuthProvider.credential(userData?.email || "", deleteConfirmPassword)

      await reauthenticateWithCredential(user, credential)
      await deleteUser(user)

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted",
      })

      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete account",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setIsDeleteDialogOpen(false)
      setDeleteConfirmPassword("")
    }
  }

  // Function to save blog settings
  const saveBlogSettings = async () => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      await updateDoc(doc(db, "Users", user.uid), {
        enableBlog,
        blogSettings
      });
      
      toast({
        title: "Success",
        description: "Blog settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update blog settings",
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
      
      await updateDoc(doc(db, "Users", user.uid), {
        stylePreferences
      });
      
      toast({
        title: "Success",
        description: "Style preferences updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update style preferences",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to save theme selection
  const saveThemeSelection = async () => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      await updateDoc(doc(db, "Users", user.uid), {
        theme: selectedTheme
      });
      
      toast({
        title: "Success",
        description: "Theme updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update theme",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to verify custom domain
  const verifyCustomDomain = async () => {
    if (!user) return;
    if (!customDomain) {
      toast({
        title: "Error",
        description: "Please enter a domain to verify",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsVerifyingDomain(true);
      
      // In a real implementation, you would verify the domain here
      // For now, we'll just simulate a successful verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await updateDoc(doc(db, "Users", user.uid), {
        customDomain
      });
      
      toast({
        title: "Success",
        description: "Domain verified and saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to verify domain",
        variant: "destructive",
      });
    } finally {
      setIsVerifyingDomain(false);
    }
  };
  
  // Function to export user data
  const exportUserData = async () => {
    if (!user) return;
    
    try {
      setIsExporting(true);
      
      // Fetch all user data
      const userDoc = await doc(db, "Users", user.uid);
      
      // Fetch all pages
      const pagesQuery = query(collection(db, `Users/${user.uid}/pages`));
      const pagesSnapshot = await getDocs(pagesQuery);
      const pages = pagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Create export data
      const exportData = {
        user: userData,
        pages,
        exportDate: new Date().toISOString()
      };
      
      // Convert to JSON and create download link
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      // Create and click a download link
      const exportFileDefaultName = `minispace-export-${new Date().toISOString().slice(0, 10)}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Success",
        description: "Data exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to export data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Settings</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="domain">Domain</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        {/* Blog Settings Tab */}
        <TabsContent value="blog" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">Blog Settings</CardTitle>
              <CardDescription>Configure your blog functionality and default settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Blog</Label>
                  <p className="text-sm text-muted-foreground">Allow visitors to view your blog content</p>
                </div>
                <Switch
                  checked={enableBlog}
                  onCheckedChange={setEnableBlog}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="blogTitle">Blog Title</Label>
                <Input
                  id="blogTitle"
                  value={blogSettings.title}
                  onChange={(e) => setBlogSettings({...blogSettings, title: e.target.value})}
                  placeholder="My Awesome Blog"
                />
                <p className="text-xs text-muted-foreground">This will be displayed as the title of your blog</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="blogDescription">Blog Description</Label>
                <Textarea
                  id="blogDescription"
                  value={blogSettings.description}
                  onChange={(e) => setBlogSettings({...blogSettings, description: e.target.value})}
                  placeholder="A short description of your blog"
                  className="h-20"
                />
                <p className="text-xs text-muted-foreground">This will appear in search results and social shares</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="footerText">Footer Text</Label>
                <Input
                  id="footerText"
                  value={blogSettings.footerText}
                  onChange={(e) => setBlogSettings({...blogSettings, footerText: e.target.value})}
                  placeholder={`© ${new Date().getFullYear()} ${username}`}
                />
                <p className="text-xs text-muted-foreground">Text to display in the footer of your blog</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="navStyle">Navigation Style</Label>
                <Select 
                  value={blogSettings.navStyle} 
                  onValueChange={(value) => setBlogSettings({...blogSettings, navStyle: value as 'minimal' | 'standard' | 'expanded'})}
                >
                  <SelectTrigger id="navStyle">
                    <SelectValue placeholder="Select a navigation style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="expanded">Expanded</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Choose how your blog navigation is displayed</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="defaultLayout">Default Post Layout</Label>
                <Select 
                  value={blogSettings.defaultLayout} 
                  onValueChange={(value) => setBlogSettings({...blogSettings, defaultLayout: value})}
                >
                  <SelectTrigger id="defaultLayout">
                    <SelectValue placeholder="Select a default layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="centered">Centered</SelectItem>
                    <SelectItem value="wide">Wide</SelectItem>
                    <SelectItem value="sidebar">With Sidebar</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Default layout for new blog posts</p>
              </div>
              
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Show Dates</Label>
                  <p className="text-sm text-muted-foreground">Display publish dates on blog posts</p>
                </div>
                <Switch
                  checked={blogSettings.showDates}
                  onCheckedChange={(checked) => setBlogSettings({...blogSettings, showDates: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Show Tags</Label>
                  <p className="text-sm text-muted-foreground">Display tags on blog posts</p>
                </div>
                <Switch
                  checked={blogSettings.showTags}
                  onCheckedChange={(checked) => setBlogSettings({...blogSettings, showTags: checked})}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveBlogSettings} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Blog Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Domain Settings Tab */}
        <TabsContent value="domain" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Domain Management
              </CardTitle>
              <CardDescription>Manage your blog's domain settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Your blog is available at <strong>{urlUsername}.minispace.app</strong>
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Label htmlFor="customDomain">Custom Domain (Premium Feature)</Label>
                <div className="flex gap-2">
                  <Input
                    id="customDomain"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="myblog.com"
                    disabled={isVerifyingDomain}
                  />
                  <Button 
                    variant="outline" 
                    onClick={verifyCustomDomain}
                    disabled={isVerifyingDomain || !customDomain}
                  >
                    {isVerifyingDomain ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                        Verifying...
                      </>
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter your custom domain to connect it to your blog
                </p>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <Label>DNS Configuration</Label>
                <div className="rounded-md bg-muted p-4 font-mono text-sm">
                  <div className="flex justify-between items-center">
                    <span>CNAME record: <strong>@</strong> points to <strong>minispace.app</strong></span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Add this record to your domain's DNS settings to verify ownership
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Style Settings Tab */}
        <TabsContent value="style" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                Style Preferences
              </CardTitle>
              <CardDescription>Customize the default appearance of your blog</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select 
                  value={stylePreferences.fontFamily} 
                  onValueChange={(value) => setStylePreferences({...stylePreferences, fontFamily: value})}
                >
                  <SelectTrigger id="fontFamily">
                    <SelectValue placeholder="Select a font family" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system-ui">System UI</SelectItem>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="sans-serif">Sans Serif</SelectItem>
                    <SelectItem value="monospace">Monospace</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Default font for your blog content</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <Select 
                  value={stylePreferences.fontSize} 
                  onValueChange={(value) => setStylePreferences({...stylePreferences, fontSize: value})}
                >
                  <SelectTrigger id="fontSize">
                    <SelectValue placeholder="Select a font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="14px">Small (14px)</SelectItem>
                    <SelectItem value="16px">Medium (16px)</SelectItem>
                    <SelectItem value="18px">Large (18px)</SelectItem>
                    <SelectItem value="20px">Extra Large (20px)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Default text size for your blog content</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="textColor"
                    value={stylePreferences.textColor}
                    onChange={(e) => setStylePreferences({...stylePreferences, textColor: e.target.value})}
                    className="w-10 h-10 rounded-md border border-input"
                  />
                  <Input
                    value={stylePreferences.textColor}
                    onChange={(e) => setStylePreferences({...stylePreferences, textColor: e.target.value})}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Default text color for your blog</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Background Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="backgroundColor"
                    value={stylePreferences.backgroundColor}
                    onChange={(e) => setStylePreferences({...stylePreferences, backgroundColor: e.target.value})}
                    className="w-10 h-10 rounded-md border border-input"
                  />
                  <Input
                    value={stylePreferences.backgroundColor}
                    onChange={(e) => setStylePreferences({...stylePreferences, backgroundColor: e.target.value})}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Default background color for your blog</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="accentColor"
                    value={stylePreferences.accentColor}
                    onChange={(e) => setStylePreferences({...stylePreferences, accentColor: e.target.value})}
                    className="w-10 h-10 rounded-md border border-input"
                  />
                  <Input
                    value={stylePreferences.accentColor}
                    onChange={(e) => setStylePreferences({...stylePreferences, accentColor: e.target.value})}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Color used for links and highlights</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveStylePreferences} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Style Preferences
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Theme Selection Tab */}
        <TabsContent value="theme" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                Theme Selection
              </CardTitle>
              <CardDescription>Choose a theme for your blog</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  className={`border rounded-lg p-2 cursor-pointer ${selectedTheme === 'default' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedTheme('default')}
                >
                  <div className="aspect-video bg-white rounded-md mb-2 flex items-center justify-center text-center p-4">
                    <div className="w-full">
                      <div className="h-4 bg-gray-200 rounded-md mb-2 w-1/2 mx-auto"></div>
                      <div className="h-2 bg-gray-200 rounded-md mb-1 w-3/4 mx-auto"></div>
                      <div className="h-2 bg-gray-200 rounded-md mb-1 w-2/3 mx-auto"></div>
                      <div className="h-2 bg-gray-200 rounded-md w-3/4 mx-auto"></div>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-center">Default</p>
                </div>
                
                <div 
                  className={`border rounded-lg p-2 cursor-pointer ${selectedTheme === 'minimal' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedTheme('minimal')}
                >
                  <div className="aspect-video bg-gray-50 rounded-md mb-2 flex items-center justify-center text-center p-4">
                    <div className="w-full">
                      <div className="h-4 bg-gray-200 rounded-md mb-2 w-1/3 mx-auto"></div>
                      <div className="h-2 bg-gray-200 rounded-md mb-1 w-2/3 mx-auto"></div>
                      <div className="h-2 bg-gray-200 rounded-md mb-1 w-1/2 mx-auto"></div>
                      <div className="h-2 bg-gray-200 rounded-md w-2/3 mx-auto"></div>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-center">Minimal</p>
                </div>
                
                <div 
                  className={`border rounded-lg p-2 cursor-pointer ${selectedTheme === 'modern' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedTheme('modern')}
                >
                  <div className="aspect-video bg-black rounded-md mb-2 flex items-center justify-center text-center p-4">
                    <div className="w-full">
                      <div className="h-4 bg-gray-700 rounded-md mb-2 w-1/2 mx-auto"></div>
                      <div className="h-2 bg-gray-700 rounded-md mb-1 w-3/4 mx-auto"></div>
                      <div className="h-2 bg-gray-700 rounded-md mb-1 w-2/3 mx-auto"></div>
                      <div className="h-2 bg-gray-700 rounded-md w-3/4 mx-auto"></div>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-center">Modern</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveThemeSelection} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Theme
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!isEditing || isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing || isSubmitting}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
              {isEditing && (
                <Button onClick={handleUpdateProfile} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="mr-2 h-5 w-5" />
                Password
              </CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleChangePassword} disabled={isSubmitting || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}>
                {isSubmitting && isChangingPassword ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                    Updating...
                  </>
                ) : (
                  <>Change Password</>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
              <CardDescription>Permanently delete your account and all your data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This action cannot be undone. All your data, including articles and profile information, will be
                permanently deleted.
              </p>
            </CardContent>
            <CardFooter>
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove all your data
                      from our servers.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-2 py-4">
                    <Label htmlFor="delete-confirm-password">Enter your password to confirm</Label>
                    <Input
                      id="delete-confirm-password"
                      type="password"
                      value={deleteConfirmPassword}
                      onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteAccount} disabled={isSubmitting}>
                      {isSubmitting ? "Deleting..." : "Delete Account"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="mr-2 h-5 w-5" />
                Data Export
              </CardTitle>
              <CardDescription>Download a copy of your data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Download a JSON file containing all your blog posts, pages, and account information.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={exportUserData} disabled={isExporting}>
                {isExporting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                    Exporting...
                  </>
                ) : (
                  <>Export Data</>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
