import type React from "react"
import { GeistSans } from "geist/font/sans"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/lib/auth-context"
import { FirebaseInitializer } from "@/components/firebase-initializer"
import Sidebar from "@/components/sidebar"

export const metadata = {
  title: "MINI - Read and Write without the noise",
  description: "A minimalist platform for reading and writing",
  generator: "Lily's Lab"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.className} antialiased min-h-screen bg-background text-foreground flex flex-col`}>
        <FirebaseInitializer />
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" themes={['dark']} enableSystem={false} disableTransitionOnChange>
            <div className=" max-w-4xl mx-auto w-full flex relative">
            <Sidebar />
            <main className="flex-1 flex flex-col  border-x">
              {children}
              </main>
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
