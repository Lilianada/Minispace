import { NextRequest, NextResponse } from 'next/server';
import { getAdminApp } from '@/lib/firebase-admin';
import { devVerifySessionCookie } from '@/lib/dev-auth';

/**
 * Server-side authentication middleware for protected routes
 * This middleware checks for a valid session cookie and redirects to login if not found
 */
export async function authMiddleware(req: NextRequest) {
  // Get the session cookie
  const sessionCookie = req.cookies.get('session')?.value;
  
  // Verify the session cookie
  let userId: string | null = null;
  
  if (sessionCookie) {
    try {
      // Use development authentication utilities in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('Middleware: Using development authentication utilities');
        const decodedClaims = await devVerifySessionCookie(sessionCookie);
        userId = decodedClaims.uid;
      } else {
        // Use Firebase Admin in production
        const { auth } = getAdminApp();
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        userId = decodedClaims.uid;
      }
    } catch (error) {
      console.error('Error verifying session cookie:', error);
      // Invalid or expired session cookie
    }
  }
  
  // If no valid user ID, redirect to login
  if (!userId) {
    const url = new URL('/login', req.url);
    url.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  
  // Add the user ID to the request headers for use in Server Components
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', userId);
  
  // Continue with the request
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
