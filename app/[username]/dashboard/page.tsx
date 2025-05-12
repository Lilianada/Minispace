import { redirect } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { getAuthenticatedUser } from '@/lib/auth-utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, Edit, Eye, Settings, Palette, Globe, LayoutDashboard } from 'lucide-react';

export default async function DashboardPage({ params }: { params: { username: string } }) {
  // In Next.js 13+, dynamic params should be properly awaited
  const resolvedParams = await Promise.resolve(params);
  const { username } = resolvedParams;
  
  // Get authenticated user data using our server-side auth utility
  // This will verify the session cookie and check ownership of the dashboard
  const result = await getAuthenticatedUser(username);
  
  // Handle redirects if needed
  if (result.redirectTo) {
    redirect(result.redirectTo);
  }
  
  // Extract user data
  const { userId, userData } = result;
  
  // Fetch recent posts - simplified query to avoid index errors
  const postsRef = collection(db, 'articles');
  const postsQuery = query(
    postsRef,
    where('authorId', '==', userId)
    // Note: We removed the orderBy to avoid the index error
    // In production, you should create the index in Firebase
  );
  
  const postsSnapshot = await getDocs(postsQuery);
  
  // Fetch total pages
  const pagesRef = collection(db, `Users/${userId}/pages`);
  const pagesQuery = query(pagesRef);
  const pagesSnapshot = await getDocs(pagesQuery);
  
  // Pages stats
  const totalPages = pagesSnapshot.size;
  const publishedPages = pagesSnapshot.docs.filter(doc => {
    const data = doc.data();
    return data.isHomepage || data.isPublished;
  }).length;
  const draftPages = totalPages - publishedPages;
  const homePage = pagesSnapshot.docs.find(doc => doc.data().isHomepage);
  
  // Create a function to safely convert Firestore data to plain objects
  function convertFirestoreData(data: any) {
    // Create a new plain object
    const result: Record<string, any> = {};
    
    // Process each field
    Object.keys(data).forEach(key => {
      const value = data[key];
      
      // Check if it's a Firestore Timestamp
      if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
        // Convert Timestamp to ISO string
        result[key] = value.toDate().toISOString();
      } 
      // Handle nested objects
      else if (value && typeof value === 'object' && !Array.isArray(value) && value !== null) {
        result[key] = convertFirestoreData(value);
      }
      // Handle arrays
      else if (Array.isArray(value)) {
        result[key] = value.map(item => {
          if (item && typeof item === 'object' && item !== null) {
            return convertFirestoreData(item);
          }
          return item;
        });
      }
      // Use the value as is for primitives
      else {
        result[key] = value;
      }
    });
    
    return result;
  }
  
  // Convert all Firestore documents to safe plain objects
  const recentPosts = postsSnapshot.docs.map(doc => {
    const data = doc.data();
    const safeData = convertFirestoreData(data);
    
    return {
      id: doc.id,
      ...safeData
    };
  });
  
  // Blog stats
  const totalPosts = postsSnapshot.size;
  const publishedPosts = recentPosts.filter((post: any) => post.published).length;
  const draftPosts = totalPosts - publishedPosts;
  
  // Convert Firestore pages to safe plain objects
  const recentPages = pagesSnapshot.docs
    .map(doc => {
      const data = doc.data();
      const safeData = convertFirestoreData(data);
      
      return {
        id: doc.id,
        ...safeData,
        // Ensure consistent property names for our UI
        isHomePage: safeData.isHomepage || false,
        published: safeData.isHomepage ? true : (safeData.isPublished || false)
      };
    })
    .sort((a, b) => {
      if (a.isHomePage) return -1;
      if (b.isHomePage) return 1;
      return 0;
    })
    .slice(0, 3); // Only get 3 most recent pages
  
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage your blog and content
        </p>
      </div>
      
      {/* Preview notification */}
      <Alert>
        <Eye className="h-4 w-4" />
        <AlertTitle>Preview functionality improved</AlertTitle>
        <AlertDescription>
          The page preview feature has been enhanced. When editing pages, you can now use both in-app preview and 
          full-page preview in a new tab.
        </AlertDescription>
      </Alert>
      
      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-base font-bold">{totalPosts}</div>
            <p className="text-sm text-muted-foreground">
              {publishedPosts} published, {draftPosts} drafts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-base font-bold">{totalPages}</div>
            <p className="text-sm text-muted-foreground">
              {publishedPages} published, {draftPages} drafts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom Domain</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-base font-bold">
              {userData?.customDomain ? 'Connected' : 'Not Set'}
            </div>
            <p className="text-xs text-muted-foreground">
              {userData?.customDomain || 'No custom domain configured'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Button asChild className="h-auto flex-col gap-2 p-3">
          <Link href={`/${username}/dashboard/posts/new`}>
            <Edit className="h-5 w-5" />
            <span>New Post</span>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-auto flex-col gap-2 p-3">
          <Link href={`/${username}/dashboard/posts`}>
            <FileText className="h-5 w-5" />
            <span>Manage Posts</span>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-auto flex-col gap-2 p-3">
          <Link href={`/${username}/dashboard/pages`}>
            <LayoutDashboard className="h-5 w-5" />
            <span>Manage Pages</span>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-auto flex-col gap-2 p-3">
          <Link href={`/${username}/dashboard/theme`}>
            <Palette className="h-5 w-5" />
            <span>Customize Theme</span>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-auto flex-col gap-2 p-3">
          <Link href={`/${username}/dashboard/settings`}>
            <Settings className="h-5 w-5" />
            <span>Blog Settings</span>
          </Link>
        </Button>
      </div>
      
      {/* Notification about improved preview functionality */}
      <Alert>
        <AlertTitle className="font-medium">New Preview Feature!</AlertTitle>
        <AlertDescription>
          You can now preview your posts and pages with the new improved preview functionality. 
          Check it out in the post and page editor.
        </AlertDescription>
      </Alert>
      
      {/* Recent posts */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Posts</h2>
        {recentPosts.length > 0 ? (
          <div className="space-y-4">
            {recentPosts.map((post: any) => (
              <Card key={post.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">{post.title}</CardTitle>
                  <CardDescription>
                    {post.published 
                      ? `Published on ${new Date(post.createdAt).toLocaleDateString()}` 
                      : 'Draft'}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-2">
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/${username}/dashboard/posts/edit/${post.id}`}>
                        Edit
                      </Link>
                    </Button>
                    {post.published && (
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`https://${username}.minispace.dev/blog/${post.slug}`} target="_blank">
                          View
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <CardContent className="pt-4 pb-6">
              <h3 className="text-base font-medium mb-2">No posts yet</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Create your first post to get started with your blog
              </p>
              <Button asChild>
                <Link href={`/${username}/dashboard/posts/new`}>
                  Create Your First Post
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Recent pages */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Pages</h2>
        {recentPages.length > 0 ? (
          <div className="space-y-4">
            {recentPages.map((page: any) => (
              <Card key={page.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">
                    {page.title}
                    {page.isHomePage && (
                      <Badge variant="outline" className="ml-2 bg-primary/20 text-primary border-primary/40">
                        Home
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {page.slug && `/${page.slug}`}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-2">
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/${username}/dashboard/pages/edit/${page.id}`}>
                        Edit
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`https://${username}.minispace.dev/${page.slug}`} target="_blank">
                        View
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <CardContent className="pt-4 pb-6">
              <h3 className="text-base font-medium mb-2">No pages yet</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Create your first page to start building your site
              </p>
              <Button asChild>
                <Link href={`/${username}/dashboard/pages/new`}>
                  Create Your First Page
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
