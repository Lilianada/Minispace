import * as admin from 'firebase-admin';

/**
 * Initialize Firebase Admin SDK
 * This function ensures we only initialize Firebase Admin once
 */
function initializeFirebaseAdmin() {
  // Check if Firebase Admin is already initialized
  if (admin.apps.length > 0) {
    console.log('Firebase Admin already initialized, using existing instance');
    return admin;
  }
  
  console.log('Initializing Firebase Admin...');
  
  try {
    // Get the Firebase configuration from environment variables
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (projectId && clientEmail && privateKey) {
      // Initialize with service account credentials
      console.log('Using service account credentials from environment variables');
      // Create the config object with required fields
      const adminConfig: any = {
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        })
      };
      
      // Add databaseURL only if it exists
      if (process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL) {
        adminConfig.databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
      }
      
      // Initialize with the config
      admin.initializeApp(adminConfig);
      console.log('Firebase Admin initialized with service account credentials');
    } else if (process.env.FIREBASE_ADMIN_CREDENTIALS) {
      console.log('Using FIREBASE_ADMIN_CREDENTIALS from environment');
      try {
        // Initialize with credentials JSON
        const serviceAccount = JSON.parse(
          Buffer.from(process.env.FIREBASE_ADMIN_CREDENTIALS, 'base64').toString()
        );
        
        // Create the config object with required fields
        const adminConfig: any = {
          credential: admin.credential.cert(serviceAccount as any)
        };
        
        // Add databaseURL only if it exists
        if (process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL) {
          adminConfig.databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
        }
        
        // Initialize with the config
        admin.initializeApp(adminConfig);
        console.log('Firebase Admin initialized with service account credentials');
      } catch (error) {
        console.error('Error initializing Firebase Admin with credentials:', error);
        // Fallback to application default credentials
        initializeWithProjectId();
      }
    } else {
      // For development, initialize with project ID
      initializeWithProjectId();
    }
    
    return admin;
  } catch (error) {
    console.error('Error in initializeFirebaseAdmin:', error);
    throw error;
  }
}

// Helper function to initialize Firebase Admin with just the project ID
function initializeWithProjectId() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  
  console.log('No credentials provided, initializing with project ID:', projectId);
  
  // Initialize with the project ID at minimum
  admin.initializeApp({
    projectId: projectId || 'minispace-app-dev',
  });
  
  console.log('Firebase Admin initialized with project ID only');
}

// Initialize Firebase Admin on module load
const firebaseAdmin = initializeFirebaseAdmin();

// Export the admin app instance
export const getAdminApp = () => {
  return {
    auth: firebaseAdmin.auth(),
    db: firebaseAdmin.firestore(),
  };
};

/**
 * Verify a session cookie and return the user ID
 * @param sessionCookie - The session cookie to verify
 * @returns The user ID if the session is valid, null otherwise
 */
export async function verifySessionCookie(sessionCookie: string | undefined) {
  if (!sessionCookie) {
    return null;
  }
  
  // In development mode, use the dev auth utilities
  if (process.env.NODE_ENV === 'development') {
    try {
      // Import dynamically to avoid circular dependencies
      const { devVerifySessionCookie } = await import('./dev-auth');
      const decodedClaims = await devVerifySessionCookie(sessionCookie);
      return decodedClaims.uid;
    } catch (error) {
      console.error('Error in development session verification:', error);
      return null;
    }
  }
  
  // In production, use Firebase Admin
  try {
    // Get the admin app instance
    const adminApp = getAdminApp();
    
    // Verify the session cookie
    const decodedClaims = await adminApp.auth.verifySessionCookie(sessionCookie, true);
    return decodedClaims.uid;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return null;
  }
}

/**
 * Create a session cookie from an ID token
 * @param idToken - The ID token from the client
 * @param expiresIn - Session expiration in milliseconds (default: 2 weeks)
 * @returns The session cookie string
 */
export async function createSessionCookie(idToken: string, expiresIn = 60 * 60 * 24 * 14 * 1000) {
  try {
    console.log('Creating session cookie with token:', idToken.substring(0, 10) + '...');
    
    // Get the admin app instance
    const adminApp = getAdminApp();
    
    if (!adminApp || !adminApp.auth) {
      console.error('Admin app or auth is not properly initialized');
      throw new Error('Firebase Admin not properly initialized');
    }
    
    // First verify the ID token to ensure it's valid
    try {
      console.log('Verifying ID token...');
      await adminApp.auth.verifyIdToken(idToken);
      console.log('ID token verified successfully');
    } catch (verifyError) {
      console.error('Error verifying ID token:', verifyError);
      throw new Error('Invalid ID token');
    }
    
    // Create the session cookie
    console.log('Creating session cookie with expiresIn:', expiresIn);
    const sessionCookie = await adminApp.auth.createSessionCookie(idToken, { expiresIn });
    console.log('Session cookie created successfully');
    
    return sessionCookie;
  } catch (error) {
    console.error('Error creating session cookie:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error('Unauthorized request');
  }
}
