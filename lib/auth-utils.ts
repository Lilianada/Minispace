import { redirect } from 'next/navigation';
import { getDoc, doc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { verifySessionCookie, getAdminApp } from './firebase-admin';

/**
 * Serializes Firestore data to ensure it can be safely passed to client components
 * This approach creates a completely new plain object with all values converted to simple types
 */
function serializeUserData(userData: any): any {
  if (!userData) return null;
  
  // Use JSON.parse(JSON.stringify()) to strip methods and convert to plain objects
  // But first we need to handle Timestamps manually
  const preparedData: Record<string, any> = {};
  
  // Convert all fields to simple values
  Object.keys(userData).forEach(key => {
    const value = userData[key];
    
    // Handle Timestamp objects
    if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
      preparedData[key] = value.toDate().toISOString();
    } 
    // Handle nested objects that might contain Timestamps
    else if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nestedObj: Record<string, any> = {};
      Object.keys(value).forEach(nestedKey => {
        const nestedValue = value[nestedKey];
        if (nestedValue && typeof nestedValue === 'object' && 'toDate' in nestedValue && typeof nestedValue.toDate === 'function') {
          nestedObj[nestedKey] = nestedValue.toDate().toISOString();
        } else {
          nestedObj[nestedKey] = nestedValue;
        }
      });
      preparedData[key] = nestedObj;
    } 
    // Handle arrays
    else if (Array.isArray(value)) {
      preparedData[key] = value.map(item => {
        if (item && typeof item === 'object' && 'toDate' in item && typeof item.toDate === 'function') {
          return item.toDate().toISOString();
        }
        return item;
      });
    } 
    // Handle primitive values
    else {
      preparedData[key] = value;
    }
  });
  
  return preparedData;
}

// Import types but use dynamic imports for the actual functions
// This helps avoid Next.js Server Component compatibility issues
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';

/**
 * Safely get cookies in a way that works with all Next.js versions
 * This handles both synchronous and asynchronous cookies() implementations
 */
async function getCookies(): Promise<ReadonlyRequestCookies> {
  // Dynamically import cookies to avoid SSR issues
  const { cookies } = await import('next/headers');
  const cookieStore = cookies();
  return cookieStore instanceof Promise ? await cookieStore : cookieStore;
}

/**
 * Safely get headers in a way that works with all Next.js versions
 * This handles both synchronous and asynchronous headers() implementations
 */
async function getHeaders(): Promise<ReadonlyHeaders> {
  // Dynamically import headers to avoid SSR issues
  const { headers } = await import('next/headers');
  const headersList = headers();
  return headersList instanceof Promise ? await headersList : headersList;
}

/**
 * Server-side authentication utility for Next.js Server Components
 * This function verifies the session cookie and returns the user data
 * @param username - The username from the URL params for ownership verification
 * @param noRedirect - If true, don't redirect and just return null for userData
 * @returns The user data if authenticated and authorized, redirects otherwise (unless noRedirect is true)
 */
export async function getAuthenticatedUser(username: string, noRedirect = false) {
  // Get the session cookie from Next.js headers
  let sessionCookie: string | undefined;
  let userId: string | null = null;
  
  // In development mode, we'll still verify the user exists
  if (process.env.NODE_ENV === 'development') {
    // We'll try to find a user with this username in the User collection
    try {
      // Query the User collection by username
      const usersRef = collection(db, 'Users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // User found by username
        const userDoc = querySnapshot.docs[0];
        userId = userDoc.id;
      } else {
        // For development, we'll use the username as the userId if not found
        userId = username;
      }
    } catch (error) {
      console.error('Error finding user by username:', error);
      // Fallback to using username as userId
      userId = username;
    }
  } else {
    try {
      // Get cookies using our safe method
      const cookieStore = await getCookies();
      sessionCookie = cookieStore.get('session')?.value;
      
      // Try to get the user ID from the request headers (set by middleware)
      const headersList = await getHeaders();
      userId = headersList.get('x-user-id') || null;
      
      // If no user ID in headers, verify the session cookie
      if (!userId && sessionCookie) {
        userId = await verifySessionCookie(sessionCookie);
      }
    } catch (error) {
      console.error('Error in authentication:', error);
    }
  }
  
  // If no user ID, handle accordingly
  if (!userId) {
    if (!noRedirect) {
      // Only redirect if noRedirect is false
      return { redirectTo: '/login', userId: null, userData: null };
    } else {
      // Return null data if noRedirect is true
      return { userId: null, userData: null };
    }
  }
  
  try {
    // For development mode, we need to find the user by username
    if (process.env.NODE_ENV === 'development') {
      // console.log('Development mode: Looking up user by username or ID');
      
      // First try to find the user by username in the User collection
      try {
        const usersRef = collection(db, 'Users');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          // User found by username
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          return { userId: userDoc.id, userData: userData };
        }
      } catch (error) {
        console.error('Error finding user by username:', error);
      }
      
      // If that fails, try to get the user document directly using userId
      try {
        const userDoc = await getDoc(doc(db, 'Users', userId));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          return { userId, userData: userData };
        }
      } catch (error) {
        console.error('Error finding user by ID:', error);
      }
      
      console.log('User not found by ID or username, using fallback data');
      
      // Fallback for development mode
      return { userId: username, userData: { username, displayName: username } };
    }
    
    // In production, fetch user data from Firestore using userId
    const userDoc = await getDoc(doc(db, 'Users', userId));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      // Verify this user owns this dashboard by checking username
      if (userData.username !== username) {
        console.log(`Username mismatch: ${userData.username} vs ${username}`);
        if (!noRedirect) {
          return { redirectTo: '/', userId, userData: null };
        } else {
          return { userId, userData: null };
        }
      }
      
      // Convert Firestore timestamps to plain objects to avoid serialization issues
      const serializedUserData = serializeUserData(userData);
      
      return { userId, userData: serializedUserData };
    } else {
      console.log(`User document not found for userId: ${userId}`);
      if (!noRedirect) {
        return { redirectTo: '/', userId, userData: null };
      } else {
        return { userId, userData: null };
      }
    }
    
    // Return is handled in the try block above
  } catch (error) {
    console.error('Error fetching user data:', error);
    if (!noRedirect) {
      return { redirectTo: '/login', userId, userData: null };
    } else {
      return { userId, userData: null };
    }
  }
}

/**
 * Create a session cookie from an ID token and set it in the response
 * Use this in API routes to handle login
 */
export async function createAndSetSessionCookie(idToken: string, response: Response) {
  try {
    console.log('createAndSetSessionCookie called with idToken:', idToken.substring(0, 10) + '...');
    
    // Get the admin app instance
    console.log('Getting admin app instance...');
    const adminApp = getAdminApp();
    console.log('Admin app instance obtained:', !!adminApp);
    
    if (!adminApp || !adminApp.auth) {
      console.error('Admin app or auth is not properly initialized:', adminApp);
      throw new Error('Firebase Admin not properly initialized');
    }
    
    // Create a session cookie (2 weeks expiration)
    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 2 weeks
    console.log('Creating session cookie with expiresIn:', expiresIn);
    const sessionCookie = await adminApp.auth.createSessionCookie(idToken, { expiresIn });
    console.log('Session cookie created successfully:', !!sessionCookie);
    
    // Set the cookie in the response
    const cookieOptions = {
      maxAge: expiresIn / 1000, // Convert to seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict' as const,
    };
    
    console.log('Setting cookie in response with options:', cookieOptions);
    
    // Set the cookie header
    response.headers.set(
      'Set-Cookie',
      `session=${sessionCookie}; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`
    );
    
    console.log('Cookie set in response headers');
    return response;
  } catch (error) {
    console.error('Error creating session cookie:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error('Unauthorized request');
  }
}
