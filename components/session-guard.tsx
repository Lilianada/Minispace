"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { isAuthenticatedFromStorage, isSessionExpiredButRecent, extendSession } from '@/lib/auth-storage';

/**
 * This component prevents unnecessary redirects to login page
 * by checking client-side auth state and revalidating sessions that might have expired
 */
export default function SessionGuard({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // This runs on client-side only
    const checkAuthState = async () => {
      // Update last activity timestamp
      localStorage.setItem('lastActive', Date.now().toString());
      
      // Check if this is a dashboard or protected route
      const isProtectedRoute = pathname.includes('/dashboard');
      
      if (!isProtectedRoute) {
        // No need to check auth state for public routes
        return;
      }
      
      // Check if we have an active Firebase auth session
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        // We have a valid Firebase auth session, refresh the ID token
        try {
          await currentUser.getIdToken(true);
          extendSession();
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      } else {
        // No Firebase auth session, check localStorage
        const isAuthenticated = isAuthenticatedFromStorage();
        const isRecentlyExpired = isSessionExpiredButRecent(15); // 15 minutes grace period
        
        if (isAuthenticated || isRecentlyExpired) {
          // We have a valid or recently expired session in localStorage
          // Let's try to refresh the page once to trigger reauth flow
          const hasTriedReauth = sessionStorage.getItem(`reauth_attempt_${pathname}`);
          
          if (!hasTriedReauth) {
            // Mark that we've tried to reauth for this path
            sessionStorage.setItem(`reauth_attempt_${pathname}`, Date.now().toString());
            
            // Refresh once to try getting a new auth session from cookies
            router.refresh();
          }
        }
      }
    };

    checkAuthState();
    
    // Clean up old reauth attempts
    const cleanupReauthAttempts = () => {
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('reauth_attempt_')) {
          const timestamp = parseInt(sessionStorage.getItem(key) || '0');
          // Remove attempts older than 30 minutes
          if (Date.now() - timestamp > 30 * 60 * 1000) {
            sessionStorage.removeItem(key);
          }
        }
      });
    };
    
    cleanupReauthAttempts();
    
    // Check auth state on route changes and every few minutes
    const interval = setInterval(checkAuthState, 5 * 60 * 1000); // Every 5 minutes
    
    return () => clearInterval(interval);
  }, [pathname, router]);

  return <>{children}</>;
}
