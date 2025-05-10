/**
 * Development-only authentication utilities
 * This file provides workarounds for Firebase Admin authentication in development
 * DO NOT USE IN PRODUCTION
 */

import { DecodedIdToken } from 'firebase-admin/auth';

/**
 * Development-only function to verify an ID token
 * In development, we'll accept any token and extract the UID from it
 */
export async function devVerifyIdToken(idToken: string): Promise<DecodedIdToken> {
  console.log('DEV MODE: Simulating ID token verification');
  
  try {
    // In development, we'll parse the token to extract the user ID
    // This is NOT secure and should NEVER be used in production
    const tokenParts = idToken.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    // Decode the payload (middle part of the JWT)
    const payload = JSON.parse(
      Buffer.from(tokenParts[1], 'base64').toString()
    );
    
    if (!payload.user_id && !payload.sub && !payload.uid) {
      throw new Error('Token does not contain a user ID');
    }
    
    // Get the project ID from environment variables for consistency
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'minispace-app-dev';
    
    // Create a simulated decoded token with the correct issuer
    return {
      aud: projectId,
      auth_time: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
      iss: `https://securetoken.google.com/${projectId}`,
      sub: payload.user_id || payload.sub || payload.uid,
      uid: payload.user_id || payload.sub || payload.uid,
    } as DecodedIdToken;
  } catch (error) {
    console.error('Error in development token verification:', error);
    throw new Error('Invalid token');
  }
}

/**
 * Development-only function to create a session cookie
 * In development, we'll just return the token as the cookie
 */
export async function devCreateSessionCookie(idToken: string, options: { expiresIn: number }): Promise<string> {
  console.log('DEV MODE: Creating simulated session cookie');
  // In development, just use the ID token as the session cookie
  return idToken;
}

/**
 * Development-only function to verify a session cookie
 * In development, we'll accept any cookie and extract the UID from it
 * If no cookie is provided or it's invalid, we'll use a default development user ID
 */
export async function devVerifySessionCookie(sessionCookie?: string): Promise<DecodedIdToken> {
  console.log('DEV MODE: Simulating session cookie verification');
  
  // Get the project ID from environment variables for consistency
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'minispace-app-dev';
  
  // If no session cookie is provided, use a default development user
  if (!sessionCookie) {
    console.log('DEV MODE: No session cookie provided, using default development user');
    return {
      aud: projectId,
      auth_time: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
      iss: `https://securetoken.google.com/${projectId}`,
      sub: 'dev-user-id',
      uid: 'dev-user-id',
    } as DecodedIdToken;
  }
  
  try {
    // For development, we'll try to parse the cookie directly
    // This is NOT secure and should NEVER be used in production
    let tokenParts;
    
    try {
      // First try to parse it as a JWT
      tokenParts = sessionCookie.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Not a valid JWT format');
      }
    } catch (e) {
      // If it's not a JWT, it might be our dev cookie format
      // Just use a placeholder UID for development
      console.log('DEV MODE: Using placeholder UID for non-JWT cookie');
      
      return {
        aud: projectId,
        auth_time: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        iss: `https://securetoken.google.com/${projectId}`,
        sub: 'dev-user-id',
        uid: 'dev-user-id',
      } as DecodedIdToken;
    }
    
    // If we got here, we have a JWT to parse
    return devVerifyIdToken(sessionCookie);
  } catch (error) {
    console.error('Error in development session cookie verification:', error);
    // Instead of throwing, return a default development user
    console.log('DEV MODE: Error verifying session cookie, using default development user');
    return {
      aud: projectId,
      auth_time: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
      iss: `https://securetoken.google.com/${projectId}`,
      sub: 'dev-user-id',
      uid: 'dev-user-id',
    } as DecodedIdToken;
  }
}
