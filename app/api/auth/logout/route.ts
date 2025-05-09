import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * API route for logging out a user
 * This endpoint clears the session cookie
 */
export async function GET(request: NextRequest) {
  try {
    // We can't directly delete cookies from the cookieStore in Next.js 13+
    // Instead, we'll set it to expire in the response
    
    // Get the redirect URL from the query parameters
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/';
    
    // Create a response that redirects to the specified URL
    const response = NextResponse.redirect(new URL(redirectTo, request.url));
    
    // Set the cookie to expire immediately
    response.cookies.set('session', '', { 
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    console.log('User logged out successfully, redirecting to:', redirectTo);
    
    return response;
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json(
      { error: 'Failed to log out' },
      { status: 500 }
    );
  }
}
