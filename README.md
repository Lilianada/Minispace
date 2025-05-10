# MINISPACE &nbsp; <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/minimize.svg" alt="Minispace Logo" height="20" />

> A lightweight blogging platform with user subdomains.  
> Like Bear Blog, but with your own personal space.

<p align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/minimize.svg" width="60" alt="Minispace Logo" />
</p>

<p align="center">
  <b>Built with React • Firebase Powered • Minimal by Design</b>
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img alt="Firebase" src="https://img.shields.io/badge/Firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=white"/>
  <img alt="Lucide" src="https://img.shields.io/badge/Lucide_Icons-000000?style=for-the-badge&logo=lucide&logoColor=white"/>
</p>

---

## Overview
**MINISPACE** is a clean, lightweight blogging platform where users get their own subdomain (`username.minispace.dev`) to publish content with minimal distractions. Each user's blog functions as a standalone website with customizable pages, navigation styles, and appearance.

---

## Features
- Personal subdomains for each user (`username.minispace.dev`)
- Customizable pages (home, projects, archive, etc.)
- Multiple navigation style options
- Customizable footer text
- Extremely lightweight and fast-loading blogs
- No client-side JavaScript for blog pages
- Secure authentication with Firebase
- Cloud Firestore database
- Dashboard for content management
- Responsive on all devices

---

## Tech Stack
- **Frontend:** Next.js App Router
- **Icons:** `lucide-react`
- **Authentication:** Firebase Auth + Firebase Admin SDK
- **Database:** Firebase Firestore
- **Styling:** Inline CSS for fast loading
- **Subdomain Routing:** Next.js middleware
- **Hosting:** Vercel

---

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mini.git
   cd mini
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project
   - Enable **Authentication** (Email/Password)
   - Create a **Firestore** database
   - Add your Firebase configuration to `.env.local`

4. **Run the app locally**
   ```bash
   npm run dev
   ```

---

## Project Structure
```
/app
  /[username]/dashboard  → User dashboard pages
  /subdomain/[username]  → Subdomain blog routes
  /api                   → API routes
/components              → UI Components
/lib                     → Firebase, auth utilities
```

---

## License
MIT License.  
Feel free to fork, customize, and make it yours!

---

## Final Note
MINISPACE is intentionally lightweight.  
No bloated JavaScript. No tracking. No distractions.  
Just your content, delivered blazingly fast. ✍🏽

---

built by me, [Lily](https://github.com/lilianada)