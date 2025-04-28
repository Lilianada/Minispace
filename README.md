# MINI - Minimalist Reading and Writing Platform

A minimalist platform for reading and writing without all the extra noise.

## Features

- Dark/light theme toggle
- User authentication (signup, login, forgot password)
- Article reading with markdown support
- Article writing and editing
- User profile and settings management
- Tag-based filtering and search

## Setup Instructions

### Prerequisites

- Node.js 16.8.0 or later
- Firebase account

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
\`\`\`

### Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database with the following collections:
   - `Users` - For storing user information
   - `Articles` - For storing article data

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app` - Next.js app router pages
- `/components` - Reusable React components
- `/lib` - Utility functions and Firebase setup
- `/public` - Static assets

## Technologies Used

- Next.js
- React
- Tailwind CSS
- Firebase (Authentication & Firestore)
- shadcn/ui components
