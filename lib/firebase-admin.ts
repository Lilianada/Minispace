import * as admin from 'firebase-admin';

// Track if we've already initialized Firebase Admin
let isInitialized = false;
let firebaseAdmin: admin.app.App | undefined;

/**
 * Initialize Firebase Admin SDK
 * This function ensures we only initialize Firebase Admin once
 */
function initializeFirebaseAdmin(): admin.app.App | undefined {
  // Check if Firebase Admin is already initialized
  if (admin.apps.length > 0) {
    console.log('Firebase Admin already initialized, using existing instance');
    return admin.app();
  }

  try {
    // Try to get existing app if it exists
    try {
      const existingApp = admin.app();
      isInitialized = true;
      return existingApp;
    } catch (e) {
      // No existing app, continue with initialization
    }

    // Initialize with credentials if available
    if (initializeWithCredentials()) {
      isInitialized = true;
      return admin.app();
    }
    
    // Fall back to project ID only initialization
    if (initializeWithProjectId()) {
      isInitialized = true;
      return admin.app();
    }
    
    // Last resort - initialize with empty config
    console.log('Initializing Firebase Admin with default empty config');
    admin.initializeApp();
    isInitialized = true;
    return admin.app();
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    return undefined;
  }
}

/**
 * Attempts to initialize Firebase Admin with available credentials
 * @returns boolean indicating if initialization was successful
 */
function initializeWithCredentials(): boolean {
  try {
    // Check for application default credentials
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.log('Using GOOGLE_APPLICATION_CREDENTIALS from environment');
      admin.initializeApp({
        credential: admin.credential.applicationDefault()
      });
      console.log('Firebase Admin initialized with application default credentials');
      return true;
    }
    
    // Check for direct service account JSON
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      console.log('Using FIREBASE_SERVICE_ACCOUNT_KEY from environment');
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin initialized with service account JSON');
      return true;
    }
    
    // Check for credentials in various formats
    if (process.env.FIREBASE_ADMIN_CREDENTIALS) {
      console.log('Using FIREBASE_ADMIN_CREDENTIALS from environment');
      
      // Handle credentials based on format
      const config = createConfigFromCredentials(process.env.FIREBASE_ADMIN_CREDENTIALS);
      if (config) {
        admin.initializeApp(config);
        console.log('Firebase Admin initialized with credentials');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error initializing with credentials:', error);
    return false;
  }
}

/**
 * Creates Firebase config from credentials in various formats
 */
function createConfigFromCredentials(credentials: string): admin.AppOptions | null {
  try {
    let serviceAccount: any;
    
    // Handle JSON string format
    if (credentials.trim().startsWith('{')) {
      serviceAccount = JSON.parse(credentials);
    }
    // Handle PEM format (private key)
    else if (credentials.includes('-----BEGIN PRIVATE KEY-----')) {
      console.log('Detected PEM format private key');
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mini-app-00';
      const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL || 
                         `firebase-adminsdk@${projectId}.iam.gserviceaccount.com`;
      
      // Store key in environment variable instead of file
      process.env.FIREBASE_PRIVATE_KEY = credentials;
      
      serviceAccount = {
        projectId,
        privateKey: credentials,
        clientEmail
      };
    }
    // Try base64 decoding
    else {
      try {
        const decoded = Buffer.from(credentials, 'base64').toString();
        serviceAccount = JSON.parse(decoded);
      } catch (e) {
        console.error('Failed to parse credentials as base64 JSON');
        return null;
      }
    }
    
    // Create config object
    const config: admin.AppOptions = {
      credential: admin.credential.cert(serviceAccount)
    };
    
    // Add database URL if available
    if (process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL) {
      config.databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
    }
    
    return config;
  } catch (error) {
    console.error('Error creating config from credentials:', error);
    return null;
  }
}

/**
 * Initializes Firebase Admin with just the project ID
 * @returns boolean indicating if initialization was successful
 */
function initializeWithProjectId(): boolean {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mini-app-00';
    console.log(`Initializing with project ID: ${projectId}`);
    
    admin.initializeApp({ projectId });
    console.log('Firebase Admin initialized with project ID only');
    return true;
  } catch (error) {
    console.error('Error initializing with project ID:', error);
    return false;
  }
}

/**
 * Get the Firebase Admin app instance
 * This is a lazy-loaded singleton to avoid initializing Firebase Admin unnecessarily
 */
export function getAdminApp() {
  // Only initialize if not already done
  if (!isInitialized) {
    console.log('Initializing Firebase Admin...');
    firebaseAdmin = initializeFirebaseAdmin();
    
    if (!firebaseAdmin) {
      console.error('Failed to initialize Firebase Admin SDK. Authentication will not work.');
      console.error('Make sure you have set up the FIREBASE_SERVICE_ACCOUNT_KEY environment variable.');
    }
  }
  
  // Return the admin app and auth instance
  return {
    app: firebaseAdmin,
    auth: firebaseAdmin ? firebaseAdmin.auth() : undefined,
    firestore: firebaseAdmin ? firebaseAdmin.firestore() : undefined,
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
