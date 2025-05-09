import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get the ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Send the ID token to our API to create a session cookie
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign in');
      }
      
      // Redirect to dashboard
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data();
      
      if (userData?.username) {
        router.push(`/${userData.username}/dashboard`);
      } else {
        router.push('/');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, username: string, displayName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if username is already taken
      const usernameQuery = await getDoc(doc(db, 'usernames', username));
      
      if (usernameQuery.exists()) {
        throw new Error('Username is already taken');
      }
      
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email,
        username,
        displayName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        enableBlog: true,
        customDomain: null,
      });
      
      // Reserve the username
      await setDoc(doc(db, 'usernames', username), {
        uid: user.uid,
      });
      
      // Get the ID token
      const idToken = await user.getIdToken();
      
      // Send the ID token to our API to create a session cookie
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }
      
      // Redirect to dashboard
      router.push(`/${username}/dashboard`);
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Sign out from Firebase Auth
      await firebaseSignOut(auth);
      
      // Clear the session cookie
      await fetch('/api/auth/login', {
        method: 'DELETE',
      });
      
      // Redirect to home page
      router.push('/');
    } catch (error: any) {
      console.error('Sign out error:', error);
      setError(error.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
