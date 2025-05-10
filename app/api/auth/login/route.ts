import { NextRequest, NextResponse } from 'next/server';
import { getAdminApp } from '@/lib/firebase-admin';
import { devVerifyIdToken, devCreateSessionCookie } from '@/lib/dev-auth';

/**
 * API route for handling login and creating session cookies
 * This endpoint receives an ID token from the client-side Firebase Auth
 * and creates a secure HTTP-only cookie for server-side authentication
 */
export async function POST(request: NextRequest) {
  try {
    console.log('Login API route called');
    
    // Get the ID token from the request body
    const { idToken, redirect } = await request.json();
    
    console.log('Received request with redirect path:', redirect);
    
    if (!idToken) {
      console.log('No ID token provided');
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      );
    }
    
    console.log('ID token received, verifying...');
    
    try {
      // First verify the ID token
      let decodedToken;
      let sessionCookie;
      const expiresIn = 60 * 60 * 24 * 14 * 1000; // 2 weeks
      
      // Use development authentication utilities in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('Using development authentication utilities');
        decodedToken = await devVerifyIdToken(idToken);
        sessionCookie = await devCreateSessionCookie(idToken, { expiresIn });
      } else {
        // Use Firebase Admin in production
        const { auth } = getAdminApp();
        decodedToken = await auth.verifyIdToken(idToken);
        sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
      }
      
      console.log('ID token verified successfully for user:', decodedToken.uid);
      console.log('Session cookie created successfully');
      
      // Get the username from Firestore to create the dashboard redirect URL
      let dashboardRedirect = redirect;
      
      if (!dashboardRedirect) {
        try {
          // Get the user document from Firestore to get the username
          const { db } = getAdminApp();
          const userDoc = await db.collection('Users').doc(decodedToken.uid).get();
          
          let username;
          if (userDoc.exists) {
            const userData = userDoc.data();
            username = userData?.username;
          }
          if (username) {
            dashboardRedirect = `/${username}/dashboard`;
          } else {
            dashboardRedirect = '/settings';
          }
        } catch (e) {
          dashboardRedirect = '/settings';
        }
      }
      
      // Create the response
      const response = NextResponse.json(
        { success: true, redirect: dashboardRedirect },
        { status: 200 }
      );
      
      // Set cookie options
      const cookieOptions = {
        maxAge: expiresIn / 1000, // Convert to seconds
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict' as const,
      };
      
      // Set the cookie in the response
      response.cookies.set('session', sessionCookie, cookieOptions);
      console.log('Session cookie set successfully');
      
      return response;
    } catch (verifyError) {
      console.error('Error verifying ID token:', verifyError);
      return NextResponse.json(
        { 
          error: 'Invalid ID token', 
          details: verifyError instanceof Error ? verifyError.message : 'Unknown error' 
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { 
        error: 'Unauthorized request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 401 }
    );
  }
}

/**
 * API route for handling logout
 * This endpoint clears the session cookie
 */
export async function DELETE() {
  // Create a response that clears the session cookie
  const response = NextResponse.json(
    { success: true },
    { status: 200 }
  );
  
  // Clear the session cookie
  response.cookies.set('session', '', {
    expires: new Date(0),
    path: '/',
  });
  
  return response;
}
