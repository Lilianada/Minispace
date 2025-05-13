"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function NotFound() {
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
          <Button asChild>
            <Link href="/discover">Return Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
