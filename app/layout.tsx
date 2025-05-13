import type React from "react"
import { GeistSans } from "geist/font/sans"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"
import { FirebaseInitializer } from "@/components/firebase-initializer"
import SessionGuard from "@/components/session-guard"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>MINISPACE – Minimalist Reading & Writing Platform</title>
        <meta name="description" content="A minimalist platform for reading and writing. Publish, read, and discover articles without the noise." />
        <meta name="keywords" content="minimalist, writing, reading, articles, blog, platform, distraction-free, MINISPACE" />
        <meta name="author" content="Lily's Lab" />
        <meta property="og:title" content="MINISPACE – Minimalist Reading & Writing Platform" />
        <meta property="og:description" content="A minimalist platform for reading and writing. Publish, read, and discover articles without the noise." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://minispace.dev/" />
        <meta property="og:image" content="/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MINISPACE – Minimalist Reading & Writing Platform" />
        <meta name="twitter:description" content="A minimalist platform for reading and writing. Publish, read, and discover articles without the noise." />
        <meta name="twitter:image" content="/logo.png" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="canonical" href="https://minispace.dev/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "MINISPACE – Minimalist Reading & Writing Platform",
              "url": "https://minispace.dev/",
              "description": "A minimalist platform for reading and writing. Publish, read, and discover articles without the noise.",
              "image": "https://minispace.dev/logo.png",
              "publisher": {
                "@type": "Organization",
                "name": "Lily's Lab",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://minispace.dev/logo.png"
                }
              },
              "sameAs": [
                "https://twitter.com/minispace_dev",
                "https://github.com/Lilianada/minispace"
              ]
            })
          }}
        />
      </head>
      <body className={`${GeistSans.className} antialiased min-h-screen bg-background text-foreground flex flex-col`}>
        <FirebaseInitializer />
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" themes={['dark']} enableSystem={false} disableTransitionOnChange>
            <SessionGuard>
              <div className="max-w-4xl mx-auto w-full flex relative min-h-screen">
                <main className="flex-1 flex flex-col border-x border-border">
                  {children}
                </main>
              </div>
            </SessionGuard>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
