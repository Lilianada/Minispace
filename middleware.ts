import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js Middleware
 * This runs before every request and handles:
 * 1. Authentication for protected routes
 * 2. Subdomain routing for user blogs
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only protect specific routes
  const PROTECTED_PATHS = ['/dashboard', '/settings', '/content', '/theme', '/domain', '/emails', '/social'];
  const isProtected = PROTECTED_PATHS.some((protectedPath) => pathname.startsWith(protectedPath));
  if (isProtected) {
    // Get the session cookie
    const sessionCookie = request.cookies.get('session')?.value;
    
    // Check if we have a recent route activation for this path
    // This helps prevent redirect loops and improves UX
    const recentAuthHeader = request.headers.get('x-recent-auth');
    const hasRecentAuth = recentAuthHeader === 'true';
    
    // If no session cookie AND we haven't recently attempted auth, redirect to login
    if (!sessionCookie && !hasRecentAuth) {
      // Get username from path for dynamic routes
      const pathParts = pathname.split('/');
      let username = '';
      
      // Check if this is a username/dashboard style path
      if (pathParts.length > 2 && pathParts[2] === 'dashboard') {
        username = pathParts[1];
      }
      
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', request.nextUrl.pathname);
      
      const response = NextResponse.redirect(url);
      
      // Set a temporary cookie to prevent redirect loops
      response.cookies.set('recent_auth_attempt', 'true', { 
        maxAge: 5, // 5 seconds to avoid redirect loops 
        path: '/' 
      });
      
      return response;
    }
    
    // If there is a session cookie or recent auth attempt, we'll assume it's valid for now
    // The actual verification will happen in the API routes and server components
    
    // Continue with the request
    const response = NextResponse.next();
    
    // Add a header to indicate this is a protected route
    response.headers.set('x-protected-route', 'true');
    
    return response;
  }
  
  // Handle subdomain routing for user blogs
  const hostname = request.headers.get('host') || '';
  
  // Skip subdomain routing for the main domain (with or without www)
  if (hostname === 'minispace.dev' || hostname === 'www.minispace.dev') {
    return NextResponse.next();
  }
  
  // Skip for localhost during development
  if (hostname.startsWith('localhost') || hostname.startsWith('127.0.0.1')) {
    return NextResponse.next();
  }
  
  // Extract the subdomain
  const parts = hostname.split('.');
  const isSubdomain = parts.length > 2 || (parts.length === 2 && parts[1] === 'minispace.dev');
  
  // If this is a valid subdomain request (e.g., username.minispace.dev)
  if (isSubdomain) {
    const subdomain = parts[0];
    
    // Skip for www subdomain as it's treated as main domain
    if (subdomain === 'www') {
      return NextResponse.next();
    }
    
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
