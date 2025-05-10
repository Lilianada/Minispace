import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminApp } from '@/lib/firebase-admin';
import { devVerifySessionCookie } from '@/lib/dev-auth';

/**
 * API route for getting the current user's information
 * This endpoint verifies the session cookie and returns the user data
 */
export async function GET(request: NextRequest) {
  try {
    // Get the session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    
    // Verify the session cookie
    try {
      let decodedClaims;
      
      // Use development authentication utilities in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('ME API: Using development authentication utilities');
        decodedClaims = await devVerifySessionCookie(sessionCookie);
        
        // In development mode, if we're using the default dev user ID, return mock data
        if (decodedClaims.uid === 'dev-user-id') {
          console.log('ME API: Returning mock user data for development');
          return NextResponse.json({
            uid: 'dev-user-id',
            username: 'devuser',
            displayName: 'Development User',
            email: 'dev@example.com',
            enableBlog: true,
            customDomain: null,
            // Add a flag to indicate this is mock data
            _devMode: true
          }, { status: 200 });
        }
      } else {
        // Use Firebase Admin in production
        if (!sessionCookie) {
          return NextResponse.json(
            { error: 'Not authenticated' },
            { status: 401 }
          );
        }
        
        const { auth } = getAdminApp();
        decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
      }
      
      const userId = decodedClaims.uid;
      
      if (!userId) {
        return NextResponse.json(
          { error: 'Invalid user ID in session' },
          { status: 401 }
        );
      }
    
      // Get the user data from Firestore
      const { db } = getAdminApp();
      const userDoc = await db.collection('Users').doc(userId).get();
      
      if (!userDoc.exists) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
    
      // Return the user data (excluding sensitive information)
      const userData = userDoc.data();
      
      if (!userData) {
        return NextResponse.json(
          { error: 'User data is empty' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        uid: userData.uid,
        username: userData.username,
        displayName: userData.displayName,
        email: userData.email,
        enableBlog: userData.enableBlog,
        customDomain: userData.customDomain,
      }, { status: 200 });
    } catch (error) {
      console.error('Error verifying session cookie:', error);
      
      // In development mode, return mock data even if there's an error
      if (process.env.NODE_ENV === 'development') {
        console.log('ME API: Error in development mode, returning mock user data');
        return NextResponse.json({
          uid: 'dev-user-id',
          username: 'devuser',
          displayName: 'Development User',
          email: 'dev@example.com',
          enableBlog: true,
          customDomain: null,
          _devMode: true
        }, { status: 200 });
      }
      
      return NextResponse.json(
        { error: 'Invalid session', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    
    // In development mode, return mock data even if there's an error
    if (process.env.NODE_ENV === 'development') {
      console.log('ME API: Error in development mode, returning mock user data');
      return NextResponse.json({
        uid: 'dev-user-id',
        username: 'devuser',
        displayName: 'Development User',
        email: 'dev@example.com',
        enableBlog: true,
        customDomain: null,
        _devMode: true
      }, { status: 200 });
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
