import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// For custom domains, we can override the authDomain
// This helps with authentication on custom domains
if (typeof window !== 'undefined') {
  // Only run in browser environment
  const hostname = window.location.hostname;
  
  // If we're on the production domain (not localhost or firebase domain)
  if (hostname === 'minispace.dev' || hostname === 'www.minispace.dev' || hostname.endsWith('.minispace.dev')) {
    // Use the current domain as the auth domain
    // This ensures the auth popup opens on the same domain
    firebaseConfig.authDomain = hostname;
  }
}

// Check if all required config values are present
const isConfigValid = Object.values(firebaseConfig).every(
  (value) => value !== undefined && value !== null && value !== ""
);

if (!isConfigValid) {
  console.error(
    "Firebase configuration is incomplete. Check your environment variables:",
    Object.keys(firebaseConfig)
      .filter((key) => !firebaseConfig[key])
      .join(", ")
  );
}

// Singleton pattern for Firebase initialization (SSR + Client)
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (isConfigValid) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  // Only set persistence on client
  if (typeof window !== "undefined") {
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error("Error setting auth persistence:", error);
    });
  }
  db = getFirestore(app);
}

export { app, auth, db };
