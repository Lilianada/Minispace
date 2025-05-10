import { Metadata } from 'next'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Generate metadata for the subdomain
export async function generateMetadata({
  params
}: {
  params: { username: string }
}): Promise<Metadata> {
  const { username } = params
  
  try {
    // Query the Users collection to find a user with the matching username
    const usersRef = collection(db, 'Users')
    const q = query(usersRef, where('username', '==', username))
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      return {
        title: 'User Not Found',
        description: 'The requested user does not exist.'
      }
    }
    
    // Get the first matching user
    const userDoc = querySnapshot.docs[0]
    const userData = userDoc.data()
    
    return {
      title: {
        default: userData.headerText || userData.username,
        template: `%s | ${userData.username}`
      },
      description: userData.bio || `${userData.username}'s personal site on MINISPACE`,
      openGraph: {
        title: userData.headerText || userData.username,
        description: userData.bio || `${userData.username}'s personal site on MINISPACE`,
        url: `https://${username}.minispace.dev`,
        siteName: userData.headerText || userData.username,
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: userData.headerText || userData.username,
        description: userData.bio || `${userData.username}'s personal site on MINISPACE`,
        creator: `@${userData.username}`,
      },
      metadataBase: new URL(`https://${username}.minispace.dev`),
    }
  } catch (error) {
    console.error('Error fetching user data for metadata:', error)
    return {
      title: username,
      description: `${username}'s personal site on MINISPACE`
    }
  }
}

export default function SubdomainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
