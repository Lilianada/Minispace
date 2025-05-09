// Local storage keys
const AUTH_USER_KEY = 'mini-app-auth-user';
const AUTH_SESSION_KEY = 'mini-app-auth-session';

// Types
interface StoredUser {
  uid: string;
  email: string;
  username: string;
  lastUpdated: number;
}

interface StoredSession {
  isAuthenticated: boolean;
  expiresAt: number;
}

// Save user data to local storage
export function saveUserToStorage(user: any): void {
  if (!user) return;
  
  const userData: StoredUser = {
    uid: user.uid,
    email: user.email,
    username: user.username || '',
    lastUpdated: Date.now()
  };
  
  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user to local storage:', error);
  }
}

// Save session data to local storage
export function saveSessionToStorage(isAuthenticated: boolean, expiresInHours = 24): void {
  const sessionData: StoredSession = {
    isAuthenticated,
    expiresAt: Date.now() + (expiresInHours * 60 * 60 * 1000)
  };
  
  try {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.error('Error saving session to local storage:', error);
  }
}

// Get user data from local storage
export function getUserFromStorage(): StoredUser | null {
  try {
    const userData = localStorage.getItem(AUTH_USER_KEY);
    if (!userData) return null;
    
    return JSON.parse(userData) as StoredUser;
  } catch (error) {
    console.error('Error getting user from local storage:', error);
    return null;
  }
}

// Get session data from local storage
export function getSessionFromStorage(): StoredSession | null {
  try {
    const sessionData = localStorage.getItem(AUTH_SESSION_KEY);
    if (!sessionData) return null;
    
    return JSON.parse(sessionData) as StoredSession;
  } catch (error) {
    console.error('Error getting session from local storage:', error);
    return null;
  }
}

// Check if the user is authenticated based on local storage
export function isAuthenticatedFromStorage(): boolean {
  const session = getSessionFromStorage();
  
  if (!session) return false;
  
  // Check if session is expired
  if (session.expiresAt < Date.now()) {
    clearAuthFromStorage();
    return false;
  }
  
  return session.isAuthenticated;
}

// Clear all auth data from local storage (for logout)
export function clearAuthFromStorage(): void {
  try {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_SESSION_KEY);
  } catch (error) {
    console.error('Error clearing auth from local storage:', error);
  }
}

// Extend session expiration time
export function extendSession(expiresInHours = 24): void {
  const session = getSessionFromStorage();
  if (!session) return;
  
  saveSessionToStorage(session.isAuthenticated, expiresInHours);
}
