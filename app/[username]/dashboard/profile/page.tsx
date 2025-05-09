"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { collection, query, getDocs, doc, getDoc, updateDoc, serverTimestamp, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

// Import custom components
import {
  ProfileHeader,
  SocialLinks,
  ContentTabs,
  AnalyticsCard,
  ProfileEditDialog,
  ProfileSkeleton
} from "@/components/profile"

// Import types and constants from components
import { SocialLink, SOCIAL_PLATFORMS } from "@/components/profile/social-links"
import { Page, Post } from "@/components/profile/content-tabs"

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for user profile
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [joinDate, setJoinDate] = useState<Date | null>(null);
  
  // State for dialogs
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch profile data on mount
  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);
  
  // Fetch profile data from Firestore
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      if (!user?.uid) return;
      
      const userDoc = await getDoc(doc(db, `Users/${user.uid}`));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setDisplayName(userData.displayName || "");
        setBio(userData.bio || "");
        setCustomDomain(userData.customDomain || "");
        
        // Set join date if available
        if (userData.createdAt) {
          setJoinDate(userData.createdAt.toDate());
        }
        
        // Process social links
        const links: SocialLink[] = [];
        if (userData.socialLinks) {
          Object.entries(userData.socialLinks).forEach(([platform, username]) => {
            if (username && typeof username === "string") {
              // Create proper SocialLink objects with platform, url and icon
              const platformKey = platform as keyof typeof SOCIAL_PLATFORMS;
              const platformInfo = SOCIAL_PLATFORMS[platformKey] || SOCIAL_PLATFORMS.Custom;
              
              links.push({
                platform,
                url: username as string,
                icon: platformInfo.icon,
                prefix: platformInfo.prefix
              });
            }
          });
        }
        setSocialLinks(links);
      }
      
      // Fetch pages
      const pagesQuery = query(
        collection(db, `Users/${user.uid}/Pages`),
        orderBy("createdAt", "desc")
      );
      
      const pagesSnapshot = await getDocs(pagesQuery);
      const pagesData: Page[] = [];
      
      pagesSnapshot.forEach((doc) => {
        const data = doc.data();
        pagesData.push({
          id: doc.id,
          title: data.title || "Untitled",
          slug: data.slug || "",
          content: data.content || "",
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          views: data.views || 0,
          isHomePage: data.isHomePage || false
        });
      });
      
      setPages(pagesData);
      
      // Fetch blog posts from the blogPosts subcollection
      const postsQuery = query(
        collection(db, `Users/${user.uid}/blogPosts`),
        orderBy("createdAt", "desc")
      );
      
      const postsSnapshot = await getDocs(postsQuery);
      const postsData: Post[] = [];
      
      postsSnapshot.forEach((doc) => {
        const data = doc.data();
        postsData.push({
          id: doc.id,
          title: data.title || "Untitled",
          slug: data.slug || "",
          content: data.content || "",
          excerpt: data.excerpt || "",
          publishedAt: data.publishedAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          views: data.views || 0,
          readingTime: data.readTime || 0,
          tags: data.tags || []
        });
      });
      
      setPosts(postsData);
      
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle profile update
  const handleProfileUpdate = async (updatedName: string, updatedBio: string, updatedDomain: string) => {
    if (!user?.uid) return;
    
    try {
      setIsSaving(true);
      
      await updateDoc(doc(db, `Users/${user.uid}`), {
        displayName: updatedName,
        bio: updatedBio,
        customDomain: updatedDomain,
        updatedAt: serverTimestamp()
      });
      
      setDisplayName(updatedName);
      setBio(updatedBio);
      setCustomDomain(updatedDomain);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
      setProfileDialogOpen(false);
    }
  };
  
  // Handle social links update
  const handleSocialLinksUpdate = async (updatedLinks: SocialLink[]) => {
    if (!user?.uid) return;
    
    try {
      setIsSaving(true);
      
      // Convert array to object format for Firestore
      const socialLinksObj: Record<string, string> = {};
      updatedLinks.forEach(link => {
        if (link.url.trim()) {
          socialLinksObj[link.platform] = link.url.trim();
        }
      });
      
      await updateDoc(doc(db, `Users/${user.uid}`), {
        socialLinks: socialLinksObj,
        updatedAt: serverTimestamp()
      });
      
      setSocialLinks(updatedLinks);
      
      toast({
        title: "Social Links Updated",
        description: "Your social links have been updated successfully."
      });
      
    } catch (error) {
      console.error("Error updating social links:", error);
      toast({
        title: "Error",
        description: "Failed to update social links. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Share profile function
  const shareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${displayName}'s Profile`,
        text: `Check out ${displayName}'s profile on MINISPACE`,
        url: `https://${username}.minispace.app`
      }).catch(error => {
        console.error("Error sharing profile:", error);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(`https://${username}.minispace.app`);
      toast({
        title: "URL Copied",
        description: "Profile URL has been copied to clipboard"
      });
    }
  };
  
  // Loading state
  if (loading) {
    return <ProfileSkeleton />;
  }
  
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6">
      {/* Profile Header */}
      <ProfileHeader
        displayName={displayName}
        username={username}
        bio={bio}
        customDomain={customDomain}
        joinDate={joinDate}
        onEditProfile={() => setProfileDialogOpen(true)}
        onShareProfile={shareProfile}
      />
      
      <Separator />
      
      {/* Content Tabs */}
      <ContentTabs 
        username={username}
        pages={pages} 
        posts={posts} 
      />
      
      <Separator />
      
      {/* Social Links & Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SocialLinks 
          socialLinks={socialLinks} 
          userId={user?.uid || ""}
          onSocialLinksChange={handleSocialLinksUpdate}
        />
        
        <AnalyticsCard />
      </div>
      
      {/* Profile Edit Dialog */}
      <ProfileEditDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        displayName={displayName}
        bio={bio}
        customDomain={customDomain}
        onSave={handleProfileUpdate}
        // isSaving={isSaving}
      />
    </div>
  );
}
