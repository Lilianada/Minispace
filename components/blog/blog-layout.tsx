"use client"

import { CuratorLayout } from "./curator-layout"
import { StreamLayout } from "./stream-layout"
import { GalleryLayout } from "./gallery-layout"
import { MagazineLayout } from "./magazine-layout"
import { MockBlogPost } from "@/lib/mock-data"
import { BlogLayoutStyle } from "./blog-layout-selector"

interface BlogLayoutProps {
  posts: MockBlogPost[]
  username: string
  layoutStyle: BlogLayoutStyle
  showSearch?: boolean
}

export function BlogLayout({ posts, username, layoutStyle, showSearch = true }: BlogLayoutProps) {
  // Render the appropriate layout based on the selected style
  switch (layoutStyle) {
    case "curator":
      return <CuratorLayout posts={posts} username={username} showSearch={showSearch} />
    case "stream":
      return <StreamLayout posts={posts} username={username} showSearch={showSearch} />
    case "gallery":
      return <GalleryLayout posts={posts} username={username} showSearch={showSearch} />
    case "magazine":
      return <MagazineLayout posts={posts} username={username} showSearch={showSearch} />
    default:
      // Default to stream layout if no valid layout is specified
      return <StreamLayout posts={posts} username={username} showSearch={showSearch} />
  }
}
