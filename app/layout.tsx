import type React from "react"
import { GeistSans } from "geist/font/sans"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"
import { FirebaseDebug } from "@/components/firebase-debug"
import { FirebaseInitializer } from "@/components/firebase-initializer"
import { FirebaseSetupGuide } from "@/components/firebase-setup-guide"

export const metadata = {
  title: "MINI - Read and Write without the noise",
  description: "A minimalist platform for reading and writing",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.className} antialiased min-h-screen bg-background text-foreground`}>
        <FirebaseInitializer />
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
