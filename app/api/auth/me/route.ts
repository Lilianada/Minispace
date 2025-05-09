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
    
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Verify the session cookie
    try {
      let decodedClaims;
      
      // Use development authentication utilities in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('ME API: Using development authentication utilities');
        decodedClaims = await devVerifySessionCookie(sessionCookie);
      } else {
        // Use Firebase Admin in production
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
      return NextResponse.json(
        { error: 'Invalid session', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
