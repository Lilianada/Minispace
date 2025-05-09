import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js Middleware
 * This runs before every request and handles:
 * 1. Authentication for protected routes
 * 2. Subdomain routing for user blogs
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if this is a dashboard route that needs authentication
  if (pathname.includes('/dashboard')) {
    // Get the session cookie
    const sessionCookie = request.cookies.get('session')?.value;
    
    // If no session cookie, redirect to login
    if (!sessionCookie) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    
    // If there is a session cookie, we'll assume it's valid for now
    // The actual verification will happen in the API routes and server components
    // This avoids using Firebase Admin in the middleware
    
    // Continue with the request
    return NextResponse.next();
  }
  
  // Handle subdomain routing for user blogs
  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];
  
  // If this is a subdomain request (e.g., username.minispace.app)
  // and not localhost during development
  if (
    subdomain && 
    !hostname.startsWith('localhost') && 
    !hostname.startsWith('127.0.0.1') &&
    !subdomain.includes('minispace')
  ) {
    // Rewrite to the subdomain route
    const url = request.nextUrl.clone();
    url.pathname = `/subdomain/${subdomain}${pathname}`;
    return NextResponse.rewrite(url);
  }
  
  // Continue with the request for non-protected routes
  return NextResponse.next();
}

/**
 * Configure which paths should run the middleware
 * See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
 */
export const config = {
  matcher: [
    // Match all dashboard routes
    '/:username/dashboard/:path*',
    // Match all API routes
    '/api/:path*',
    // Match all paths (for subdomain handling)
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
