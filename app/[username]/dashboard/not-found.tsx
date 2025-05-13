"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function NotFound() {
  const [username, setUsername] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  
  // Extract username from pathname
  useEffect(() => {
    const parts = pathname.split('/');
    if (parts.length > 1) {
      setUsername(parts[1]); // Get the username part
      
      // Store the last path for potential recovery
      localStorage.setItem("lastPath", pathname);
    }
  }, [pathname]);
  
  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (currentUser) {
        // Update last active time
        localStorage.setItem("lastActive", Date.now().toString());
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Emoji animation
  useEffect(() => {
    const interval = setInterval(() => {
      const element = document.getElementById("notFoundEmoji");
      if (element) {
        const emojis = ["😕", "🤔", "😮", "😵‍💫", "🧐"];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        element.innerText = randomEmoji;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-4xl font-bold grid tracking-tighter">
          <span id="notFoundEmoji" className="inline-block animate-bounce">
            😕
          </span>
          404
        </h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          {!loading && (
            <>
              <Button asChild>
                <Link href={username ? `/${username}/dashboard` : "/"}>
                  Return to Dashboard
                </Link>
              </Button>
              {!user ? (
                <Button variant="outline" asChild>
                  <Link href={`/login?redirect=/${username}/dashboard`}>
                    Sign In
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" onClick={() => router.back()}>
                  Go Back
                </Button>
              )}
            </>
          )}
          {loading && (
            <Button disabled>
              Loading...
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}