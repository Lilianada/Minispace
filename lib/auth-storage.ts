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

// Extend session expiration time and update activity timestamp
export function extendSession(expiresInHours = 24): void {
  const session = getSessionFromStorage();
  if (!session) return;
  
  // Update session expiry
  saveSessionToStorage(session.isAuthenticated, expiresInHours);
  
  // Update last active timestamp
  localStorage.setItem("lastActive", Date.now().toString());
  
  // Also update user's lastUpdated time
  const user = getUserFromStorage();
  if (user) {
    saveUserToStorage({
      ...user,
      lastUpdated: Date.now()
    });
  }
}

// Check if session is expired but within a recent grace period (useful for reducing immediate redirects)
export function isSessionExpiredButRecent(graceMinutes = 5): boolean {
  const session = getSessionFromStorage();
  if (!session) return false;
  
  const now = Date.now();
  const graceWindowMs = graceMinutes * 60 * 1000;
  
  // If session expired but within the grace period
  return session.expiresAt < now && (now - session.expiresAt) < graceWindowMs;
}

// Get the remaining session time in seconds
export function getSessionRemainingTime(): number {
  const session = getSessionFromStorage();
  if (!session) return 0;
  
  const remainingMs = Math.max(0, session.expiresAt - Date.now());
  return Math.floor(remainingMs / 1000); // Convert to seconds
}
