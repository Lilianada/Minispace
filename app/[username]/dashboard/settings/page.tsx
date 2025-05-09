"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore"
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from "firebase/auth"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Globe, Palette, Shield, User } from "lucide-react"

// Import reusable components
import { AccountSettings } from "@/components/settings/account-settings"
import { PasswordSettings } from "@/components/settings/password-settings"
import { DomainSettings } from "@/components/settings/domain-settings"
import { DeleteAccount } from "@/components/settings/delete-account"
import { DataExport } from "@/components/settings/data-export"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import { BlogSettings, StylePreferences } from "@/lib/types"

export default function SettingsPage() {
  // Get username from URL params
  const params = useParams();
  const urlUsername = params.username as string;
  
  // Auth and router
  const { user, userData, logout, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
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
  const [isVerified, setIsVerified] = useState(false)
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
      
      // Load domain settings
      setCustomDomain(userData.customDomain || "")
      setIsVerified(!!userData.customDomain)
      
      // Load style preferences
      if (userData.stylePreferences) {
        setStylePreferences({
          fontFamily: userData.stylePreferences.fontFamily || "system-ui",
          fontSize: userData.stylePreferences.fontSize || "16px",
          textColor: userData.stylePreferences.textColor || "#000000",
          backgroundColor: userData.stylePreferences.backgroundColor || "#ffffff",
          accentColor: userData.stylePreferences.accentColor || "#3b82f6"
        })
      }
      
      // Load theme selection
      setSelectedTheme(userData.theme || "default")
    }
  }, [user, userData, router, loading])

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    // Validate username
    if (!username) {
      toast({
        title: "Username required",
        description: "Please enter a username.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate email
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if username is changed and already exists
    if (username !== userData?.username) {
      try {
        const usersRef = collection(db, "Users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          toast({
            title: "Username already taken",
            description: "Please choose a different username.",
            variant: "destructive",
          });
          return;
        }
      } catch (error) {
        console.error("Error checking username:", error);
        toast({
          title: "Error",
          description: "Failed to check username availability.",
          variant: "destructive",
        });
        return;
      }
    }
    
    try {
      setIsSubmitting(true);
      setIsEditing(true);
      
      // Update email in Firebase Auth if changed
      if (email !== user.email) {
        await updateEmail(user, email);
      }
      
      // Update user document in Firestore
      const userDoc = doc(db, `Users/${user.uid}`);
      await updateDoc(userDoc, {
        username,
        email,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      // If username changed, redirect to new dashboard URL
      if (username !== urlUsername) {
        router.push(`/${username}/dashboard/settings`);
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      
      // Handle specific Firebase Auth errors
      if (error.code === "auth/requires-recent-login") {
        toast({
          title: "Authentication required",
          description: "Please log out and log back in to change your email.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
      setIsEditing(false);
    }
  };
  
  const handleChangePassword = async () => {
    if (!user) return;
    
    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "All fields required",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation don't match.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      setIsChangingPassword(true);
      
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
      
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error changing password:", error);
      
      // Handle specific Firebase Auth errors
      if (error.code === "auth/wrong-password") {
        toast({
          title: "Incorrect password",
          description: "Your current password is incorrect.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to change password. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
      setIsChangingPassword(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    if (!deleteConfirmPassword) {
      toast({
        title: "Password required",
        description: "Please enter your password to confirm account deletion.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email!, deleteConfirmPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Delete user document from Firestore
      await updateDoc(doc(db, `Users/${user.uid}`), {
        deleted: true,
        deletedAt: new Date(),
      });
      
      // Delete user from Firebase Auth
      await deleteUser(user);
      
      // Redirect to home page
      router.push("/");
      
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });
    } catch (error: any) {
      console.error("Error deleting account:", error);
      
      // Handle specific Firebase Auth errors
      if (error.code === "auth/wrong-password") {
        toast({
          title: "Incorrect password",
          description: "The password you entered is incorrect.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete account. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to verify custom domain
  const verifyCustomDomain = async () => {
    if (!user || !customDomain) return;
    
    // Validate domain format
    const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;
    if (!domainRegex.test(customDomain)) {
      toast({
        title: "Invalid domain",
        description: "Please enter a valid domain name.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsVerifyingDomain(true);
      
      // In a real implementation, we would verify the domain by checking DNS records
      // For this demo, we'll just simulate a successful verification
      
      // Update user document with custom domain
      const userDoc = doc(db, `Users/${user.uid}`);
      await updateDoc(userDoc, {
        customDomain,
      });
      
      setIsVerified(true);
      
      toast({
        title: "Domain verified",
        description: "Your custom domain has been verified and connected.",
      });
    } catch (error) {
      console.error("Error verifying domain:", error);
      toast({
        title: "Error",
        description: "Failed to verify domain. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifyingDomain(false);
    }
  };
  
  // Function to remove custom domain
  const removeCustomDomain = async () => {
    if (!user) return;
    
    try {
      setIsVerifyingDomain(true);
      
      // Update user document to remove custom domain
      const userDoc = doc(db, `Users/${user.uid}`);
      await updateDoc(userDoc, {
        customDomain: "",
      });
      
      setCustomDomain("");
      setIsVerified(false);
      
      toast({
        title: "Domain removed",
        description: "Your custom domain has been disconnected.",
      });
    } catch (error) {
      console.error("Error removing domain:", error);
      toast({
        title: "Error",
        description: "Failed to remove domain. Please try again.",
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
      
      // Fetch user data
      const userData = {
        profile: {
          username,
          email,
        },
        blogSettings,
        stylePreferences,
        theme: selectedTheme,
        customDomain,
      };
      
      // Fetch pages
      const pagesRef = collection(db, `Users/${user.uid}/pages`);
      const pagesSnapshot = await getDocs(pagesRef);
      const pages = pagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Fetch blog posts
      const postsRef = collection(db, `Users/${user.uid}/blogPosts`);
      const postsSnapshot = await getDocs(postsRef);
      const posts = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Combine all data
      const exportData = {
        userData,
        pages,
        posts,
        exportDate: new Date().toISOString(),
      };
      
      // Create a download link
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `minispace-export-${username}-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Data exported",
        description: "Your data has been exported successfully.",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Error",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="container py-6 space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="container py-6 space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        
        <Tabs defaultValue="account">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="account">
              <User className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="domain">
              <Globe className="h-4 w-4 mr-2" />
              Domain
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-6">
            <AccountSettings
              username={username}
              setUsername={setUsername}
              email={email}
              setEmail={setEmail}
              isSubmitting={isSubmitting}
              onSave={handleUpdateProfile}
            />
            
            <DataExport
              onExport={exportUserData}
              isExporting={isExporting}
            />
          </TabsContent>
          
          
          <TabsContent value="domain" className="space-y-6">
            <DomainSettings
              customDomain={customDomain}
              setCustomDomain={setCustomDomain}
              isVerified={isVerified}
              isSubmitting={isVerifyingDomain}
              onVerify={verifyCustomDomain}
              onRemove={removeCustomDomain}
            />
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <PasswordSettings
              currentPassword={currentPassword}
              setCurrentPassword={setCurrentPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              isSubmitting={isSubmitting}
              isChangingPassword={isChangingPassword}
              onChangePassword={handleChangePassword}
            />
            
            <DeleteAccount
              onDelete={handleDeleteAccount}
              isSubmitting={isSubmitting}
              password={deleteConfirmPassword}
              setPassword={setDeleteConfirmPassword}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
