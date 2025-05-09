import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  Timestamp,
  limit,
  startAfter,
  DocumentSnapshot
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { BlogPost, BlogPostContent, BlogSettings, calculateReadTime, generateSlug, ensureUniqueSlug } from "@/lib/models/blog-post"

// Get blog settings for a user
export async function getBlogSettings(userId: string): Promise<BlogSettings | null> {
  try {
    const userDoc = await getDoc(doc(db, `Users/${userId}`))
    
    if (!userDoc.exists()) {
      return null
    }
    
    const userData = userDoc.data()
    
    // Return default settings if not set
    if (!userData.blogSettings) {
      return {
        enabled: false,
        layoutStyle: 'stream',
        showSearch: true,
        updatedAt: Timestamp.now()
      }
    }
    
    return userData.blogSettings as BlogSettings
  } catch (error) {
    console.error("Error getting blog settings:", error)
    throw error
  }
}

// Update blog settings for a user
export async function updateBlogSettings(userId: string, settings: Partial<BlogSettings>): Promise<void> {
  try {
    await updateDoc(doc(db, `Users/${userId}`), {
      blogSettings: {
        enabled: settings.enabled !== undefined ? settings.enabled : true,
        layoutStyle: settings.layoutStyle || 'stream',
        showSearch: settings.showSearch !== undefined ? settings.showSearch : true,
        updatedAt: serverTimestamp()
      }
    })
  } catch (error) {
    console.error("Error updating blog settings:", error)
    throw error
  }
}

// Get all blog posts for a user
export async function getBlogPosts(
  userId: string, 
  options: { 
    publishedOnly?: boolean, 
    limit?: number, 
    startAfter?: DocumentSnapshot,
    category?: string,
    tag?: string
  } = {}
): Promise<{ posts: BlogPost[], lastDoc: DocumentSnapshot | null }> {
  try {
    let postsQuery = query(
      collection(db, `Users/${userId}/blogPosts`),
      orderBy("createdAt", "desc")
    )
    
    // Filter by published status if requested
    if (options.publishedOnly) {
      postsQuery = query(
        postsQuery,
        where("isPublished", "==", true)
      )
    }
    
    // Filter by category if provided
    if (options.category) {
      postsQuery = query(
        postsQuery,
        where("category", "==", options.category)
      )
    }
    
    // Filter by tag if provided
    if (options.tag) {
      postsQuery = query(
        postsQuery,
        where("tags", "array-contains", options.tag)
      )
    }
    
    // Add pagination if requested
    if (options.limit) {
      postsQuery = query(postsQuery, limit(options.limit))
      
      if (options.startAfter) {
        postsQuery = query(postsQuery, startAfter(options.startAfter))
      }
    }
    
    const postsSnapshot = await getDocs(postsQuery)
    const lastDoc = postsSnapshot.docs.length > 0 ? postsSnapshot.docs[postsSnapshot.docs.length - 1] : null
    
    const posts = postsSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data
      } as BlogPost
    })
    
    return { posts, lastDoc }
  } catch (error) {
    console.error("Error getting blog posts:", error)
    throw error
  }
}

// Get a single blog post by ID
export async function getBlogPostById(userId: string, postId: string): Promise<BlogPost | null> {
  try {
    const postDoc = await getDoc(doc(db, `Users/${userId}/blogPosts/${postId}`))
    
    if (!postDoc.exists()) {
      return null
    }
    
    return {
      id: postDoc.id,
      ...postDoc.data()
    } as BlogPost
  } catch (error) {
    console.error("Error getting blog post:", error)
    throw error
  }
}

// Get a single blog post by slug
export async function getBlogPostBySlug(userId: string, slug: string): Promise<BlogPost | null> {
  try {
    const postsQuery = query(
      collection(db, `Users/${userId}/blogPosts`),
      where("slug", "==", slug),
      limit(1)
    )
    
    const postsSnapshot = await getDocs(postsQuery)
    
    if (postsSnapshot.empty) {
      return null
    }
    
    const postDoc = postsSnapshot.docs[0]
    
    return {
      id: postDoc.id,
      ...postDoc.data()
    } as BlogPost
  } catch (error) {
    console.error("Error getting blog post by slug:", error)
    throw error
  }
}

// Create a new blog post
export async function createBlogPost(userId: string, postData: Partial<BlogPost>): Promise<string> {
  try {
    // Get existing slugs to ensure uniqueness
    const existingSlugs: string[] = []
    const postsSnapshot = await getDocs(collection(db, `Users/${userId}/blogPosts`))
    
    postsSnapshot.forEach(doc => {
      const data = doc.data()
      if (data.slug) {
        existingSlugs.push(data.slug)
      }
    })
    
    // Generate slug from title if not provided
    let slug = postData.slug || generateSlug(postData.title || 'untitled')
    
    // Ensure slug uniqueness
    slug = ensureUniqueSlug(slug, existingSlugs)
    
    // Calculate read time if content is provided
    const readTime = postData.content ? calculateReadTime(postData.content) : undefined
    
    const newPost = {
      title: postData.title || 'Untitled',
      slug,
      excerpt: postData.excerpt || '',
      content: postData.content || '',
      featuredImage: postData.featuredImage,
      isPublished: postData.isPublished || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: postData.isPublished ? serverTimestamp() : null,
      layoutStyle: postData.layoutStyle,
      tags: postData.tags || [],
      category: postData.category,
      readTime,
      seoDescription: postData.seoDescription,
      visibility: postData.visibility || 'draft',
      type: postData.type || 'article',
      url: postData.url,
      userId
    }
    
    const postRef = await addDoc(collection(db, `Users/${userId}/blogPosts`), newPost)
    return postRef.id
  } catch (error) {
    console.error("Error creating blog post:", error)
    throw error
  }
}

// Update an existing blog post
export async function updateBlogPost(userId: string, postId: string, postData: Partial<BlogPost>): Promise<void> {
  try {
    const postRef = doc(db, `Users/${userId}/blogPosts/${postId}`)
    const postDoc = await getDoc(postRef)
    
    if (!postDoc.exists()) {
      throw new Error("Blog post not found")
    }
    
    const currentData = postDoc.data()
    
    // Check if slug is being changed
    if (postData.slug && postData.slug !== currentData.slug) {
      // Get existing slugs to ensure uniqueness
      const existingSlugs: string[] = []
      const postsSnapshot = await getDocs(collection(db, `Users/${userId}/blogPosts`))
      
      postsSnapshot.forEach(doc => {
        if (doc.id !== postId) { // Exclude current post
          const data = doc.data()
          if (data.slug) {
            existingSlugs.push(data.slug)
          }
        }
      })
      
      // Ensure slug uniqueness
      postData.slug = ensureUniqueSlug(postData.slug, existingSlugs)
    }
    
    // Calculate read time if content is updated
    if (postData.content) {
      postData.readTime = calculateReadTime(postData.content)
    }
    
    // Set publishedAt timestamp if publishing for the first time
    if (postData.isPublished && !currentData.isPublished) {
      postData.publishedAt = serverTimestamp()
    }
    
    await updateDoc(postRef, {
      ...postData,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error("Error updating blog post:", error)
    throw error
  }
}

// Delete a blog post
export async function deleteBlogPost(userId: string, postId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, `Users/${userId}/blogPosts/${postId}`))
    
    // Delete all content blocks associated with this post
    const contentQuery = query(
      collection(db, `Users/${userId}/blogPosts/${postId}/content`)
    )
    
    const contentSnapshot = await getDocs(contentQuery)
    
    const deletePromises = contentSnapshot.docs.map(doc => 
      deleteDoc(doc.ref)
    )
    
    await Promise.all(deletePromises)
  } catch (error) {
    console.error("Error deleting blog post:", error)
    throw error
  }
}

// Get content blocks for a blog post
export async function getBlogPostContent(userId: string, postId: string): Promise<BlogPostContent[]> {
  try {
    const contentQuery = query(
      collection(db, `Users/${userId}/blogPosts/${postId}/content`),
      orderBy("order", "asc")
    )
    
    const contentSnapshot = await getDocs(contentQuery)
    
    return contentSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as BlogPostContent))
  } catch (error) {
    console.error("Error getting blog post content:", error)
    throw error
  }
}

// Add a content block to a blog post
export async function addBlogPostContent(
  userId: string, 
  postId: string, 
  content: string,
  type: BlogPostContent['type'] = 'text',
  metadata?: Record<string, any>
): Promise<string> {
  try {
    // Get the current highest order value
    const contentQuery = query(
      collection(db, `Users/${userId}/blogPosts/${postId}/content`),
      orderBy("order", "desc"),
      limit(1)
    )
    
    const contentSnapshot = await getDocs(contentQuery)
    const highestOrder = contentSnapshot.empty ? 0 : contentSnapshot.docs[0].data().order
    
    const newContent = {
      postId,
      content,
      order: highestOrder + 1,
      type,
      metadata,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    const contentRef = await addDoc(collection(db, `Users/${userId}/blogPosts/${postId}/content`), newContent)
    
    // Update the post's content field with a preview
    const postRef = doc(db, `Users/${userId}/blogPosts/${postId}`)
    await updateDoc(postRef, {
      updatedAt: serverTimestamp()
    })
    
    return contentRef.id
  } catch (error) {
    console.error("Error adding blog post content:", error)
    throw error
  }
}

// Update a content block
export async function updateBlogPostContent(
  userId: string, 
  postId: string, 
  contentId: string,
  updates: Partial<BlogPostContent>
): Promise<void> {
  try {
    const contentRef = doc(db, `Users/${userId}/blogPosts/${postId}/content/${contentId}`)
    
    await updateDoc(contentRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
    
    // Update the post's updatedAt field
    const postRef = doc(db, `Users/${userId}/blogPosts/${postId}`)
    await updateDoc(postRef, {
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error("Error updating blog post content:", error)
    throw error
  }
}

// Delete a content block
export async function deleteBlogPostContent(userId: string, postId: string, contentId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, `Users/${userId}/blogPosts/${postId}/content/${contentId}`))
    
    // Update the post's updatedAt field
    const postRef = doc(db, `Users/${userId}/blogPosts/${postId}`)
    await updateDoc(postRef, {
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error("Error deleting blog post content:", error)
    throw error
  }
}

// Reorder content blocks
export async function reorderBlogPostContent(
  userId: string, 
  postId: string, 
  contentOrder: { id: string, order: number }[]
): Promise<void> {
  try {
    const updatePromises = contentOrder.map(item => 
      updateDoc(doc(db, `Users/${userId}/blogPosts/${postId}/content/${item.id}`), {
        order: item.order,
        updatedAt: serverTimestamp()
      })
    )
    
    await Promise.all(updatePromises)
    
    // Update the post's updatedAt field
    const postRef = doc(db, `Users/${userId}/blogPosts/${postId}`)
    await updateDoc(postRef, {
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error("Error reordering blog post content:", error)
    throw error
  }
}
