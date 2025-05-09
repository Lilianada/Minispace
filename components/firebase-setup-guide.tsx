"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export function FirebaseSetupGuide() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="fixed bottom-4 left-4 z-50">
          Firebase Setup Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="  max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Firebase Setup Guide</DialogTitle>
          <DialogDescription>
            Follow these steps to properly set up Firebase for your MINISPACE application
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="env">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="env">Environment Variables</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="firestore">Firestore</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          </TabsList>

          <TabsContent value="env" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Environment Variables</AlertTitle>
              <AlertDescription>
                Make sure all Firebase environment variables are properly set in your .env.local file.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="font-semibold">Required Environment Variables:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <code>NEXT_PUBLIC_FIREBASE_API_KEY</code>
                </li>
                <li>
                  <code>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</code>
                </li>
                <li>
                  <code>NEXT_PUBLIC_FIREBASE_PROJECT_ID</code>
                </li>
                <li>
                  <code>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</code>
                </li>
                <li>
                  <code>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</code>
                </li>
                <li>
                  <code>NEXT_PUBLIC_FIREBASE_APP_ID</code>
                </li>
              </ul>

              <h3 className="font-semibold">How to get these values:</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  Go to the{" "}
                  <a
                    href="https://console.firebase.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Firebase Console
                  </a>
                </li>
                <li>Select your project (or create a new one)</li>
                <li>Click on the gear icon (⚙️) next to "Project Overview" and select "Project settings"</li>
                <li>Scroll down to "Your apps" section</li>
                <li>If you haven't added a web app yet, click on the web icon (&lt;/&gt;) to add one</li>
                <li>Register your app with a nickname</li>
                <li>Copy the configuration values from the provided code snippet</li>
              </ol>

              <h3 className="font-semibold">Example .env.local file:</h3>
              <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                {`NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id`}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="auth" className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle>Authentication Setup</AlertTitle>
              <AlertDescription>Enable Email/Password authentication in your Firebase project.</AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="font-semibold">Steps to enable Email/Password authentication:</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  Go to the{" "}
                  <a
                    href="https://console.firebase.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Firebase Console
                  </a>
                </li>
                <li>Select your project</li>
                <li>Click on "Authentication" in the left sidebar</li>
                <li>Click on "Get started" if you haven't set up authentication yet</li>
                <li>Click on the "Sign-in method" tab</li>
                <li>Click on "Email/Password" in the list of providers</li>
                <li>Toggle the "Enable" switch to on</li>
                <li>Click "Save"</li>
              </ol>

              <h3 className="font-semibold">Testing Authentication:</h3>
              <p>
                After enabling Email/Password authentication, you should be able to sign up and log in using the app. If
                you encounter issues, check the Firebase Debug panel for more information.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="firestore" className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle>Firestore Setup</AlertTitle>
              <AlertDescription>Create a Firestore database for your application.</AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="font-semibold">Steps to create a Firestore database:</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  Go to the{" "}
                  <a
                    href="https://console.firebase.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Firebase Console
                  </a>
                </li>
                <li>Select your project</li>
                <li>Click on "Firestore Database" in the left sidebar</li>
                <li>Click "Create database"</li>
                <li>Choose either "Start in production mode" or "Start in test mode" (for development)</li>
                <li>Select a location for your database (choose one close to your users)</li>
                <li>Click "Enable"</li>
              </ol>

              <h3 className="font-semibold">Required Collections:</h3>
              <p>The app uses the following collections:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <code>Users</code> - Stores user information
                </li>
                <li>
                  <code>Articles</code> - Stores article data
                </li>
              </ul>

              <p>These collections will be created automatically as users sign up and create articles.</p>

              <h3 className="font-semibold">Firestore Rules:</h3>
              <p>For security, consider setting up Firestore rules. Here's a basic example:</p>
              <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                {`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read published articles
    match /Articles/{articleId} {
      allow read: if resource.data.published == true;
      
      // Allow users to read their own drafts
      allow read: if request.auth != null && resource.data.authorId == request.auth.uid;
      
      // Allow users to create and update their own articles
      allow create: if request.auth != null && request.resource.data.authorId == request.auth.uid;
      allow update: if request.auth != null && resource.data.authorId == request.auth.uid;
      
      // Allow users to delete their own articles
      allow delete: if request.auth != null && resource.data.authorId == request.auth.uid;
    }
    
    // Allow users to read and write their own user data
    match /Users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
      
      // Allow reading username for display purposes
      allow read: if request.auth != null && resource.data.username != null;
    }
  }
}`}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="troubleshooting" className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Common Issues</AlertTitle>
              <AlertDescription>Solutions for common Firebase setup problems.</AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="font-semibold">Firebase: Error (auth/invalid-api-key)</h3>
              <p>
                <strong>Cause:</strong> The API key in your environment variables is incorrect or missing.
              </p>
              <p>
                <strong>Solution:</strong>
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Check your .env.local file to ensure NEXT_PUBLIC_FIREBASE_API_KEY is set correctly</li>
                <li>Verify the API key matches the one in your Firebase project settings</li>
                <li>Restart your development server after updating environment variables</li>
              </ol>

              <h3 className="font-semibold">Error fetching user data: Missing or insufficient permissions</h3>
              <p>
                <strong>Cause:</strong> Firestore security rules are preventing access to user data.
              </p>
              <p>
                <strong>Solution:</strong>
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Check your Firestore security rules</li>
                <li>For development, you can temporarily set rules to allow all access:</li>
                <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                  {`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                </pre>
                <li>Remember to set proper security rules before deploying to production</li>
              </ol>

              <h3 className="font-semibold">The database does not exist for project</h3>
              <p>
                <strong>Cause:</strong> You haven't created a Firestore database for your project yet.
              </p>
              <p>
                <strong>Solution:</strong>
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Go to the Firebase Console</li>
                <li>Select your project</li>
                <li>Click on "Firestore Database" in the left sidebar</li>
                <li>Click "Create database" and follow the setup process</li>
              </ol>

              <h3 className="font-semibold">User logged out unexpectedly</h3>
              <p>
                <strong>Cause:</strong> Auth persistence may not be set correctly or there might be an issue with token
                refresh.
              </p>
              <p>
                <strong>Solution:</strong>
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Ensure auth persistence is set to LOCAL in the Firebase initialization</li>
                <li>Check for any console errors related to token refresh</li>
                <li>Try clearing your browser cache and cookies, then log in again</li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
