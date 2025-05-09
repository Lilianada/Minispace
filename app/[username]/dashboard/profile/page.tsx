"use client"

import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Mail, UserIcon, PenLineIcon, FileText, Palette, Settings } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

// Define quick action types
interface QuickAction {
  title: string
  icon: React.ReactNode
  href: string
  description: string
}

export default function ProfilePage(props: { params: { username: string } }) {
  // Access username directly from props to avoid Next.js warning
  const { username } = props.params;
  const { user, userData, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  if (!user || loading) {
    return (
      <div className="space-y-4">
        <div>
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-4 w-48" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader className="py-3 px-4">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="py-2 px-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div>
                    <Skeleton className="h-3 w-20 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div>
                    <Skeleton className="h-3 w-20 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="py-3 px-4">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="py-2 px-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                  <Skeleton className="h-7 w-20 rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="py-3 px-4">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="py-2 px-4">
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="border rounded-md p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-base font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal information
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-muted rounded-full p-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Username</p>
                  <p className="text-sm font-medium">{userData?.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-muted rounded-full p-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{userData?.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Blog Settings */}
        <Card className="md:col-span-2">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Blog Settings</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="py-2 px-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Blog Status</h3>
                  <p className="text-xs text-muted-foreground">Enable or disable your blog</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {(userData as any)?.enableBlog ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Custom Domain</h3>
                  <p className="text-xs text-muted-foreground">{(userData as any)?.customDomain || "No custom domain set"}</p>
                </div>
                <Button asChild size="sm" variant="outline" className="h-7 px-2 text-xs">
                  <Link href={`/${username}/dashboard/settings`}>
                    <Edit className="h-3 w-3 mr-1" />
                    Configure
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <Card className="md:col-span-2">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4">
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              <Link href={`/${username}/dashboard/theme`} className="block">
                <div className="border rounded-md p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Customize Theme</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">Change colors, fonts and layout</p>
                </div>
              </Link>
              
              <Link href={`/${username}/dashboard/posts`} className="block">
                <div className="border rounded-md p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Manage Posts</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">Edit, publish or delete your posts</p>
                </div>
              </Link>
              
              <Link href={`/${username}/dashboard/write`} className="block">
                <div className="border rounded-md p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <PenLineIcon className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Write New Post</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">Create a new blog post</p>
                </div>
              </Link>
              
              <Link href={`https://${username}.minispace.app`} target="_blank" className="block">
                <div className="border rounded-md p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">View Blog</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">See your blog as visitors see it</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
