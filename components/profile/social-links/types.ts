import * as React from "react"
import { ReactNode } from "react"
import { Twitter, Instagram, Github, Linkedin, Link2 } from "lucide-react"

export interface SocialLink {
  platform: string
  url: string
  icon: ReactNode
  prefix?: string
}

export interface SocialUsernames {
  X: string
  Instagram: string
  LinkedIn: string
  GitHub: string
  Custom: {
    platform: string
    url: string
  }
}

// Define social platforms with their prefixes
export const SOCIAL_PLATFORMS = {
  X: {
    prefix: "https://x.com/",
    icon: React.createElement(Twitter, { className: "h-4 w-4" })
  },
  Instagram: {
    prefix: "https://instagram.com/",
    icon: React.createElement(Instagram, { className: "h-4 w-4" })
  },
  LinkedIn: {
    prefix: "https://linkedin.com/in/",
    icon: React.createElement(Linkedin, { className: "h-4 w-4" })
  },
  GitHub: {
    prefix: "https://github.com/",
    icon: React.createElement(Github, { className: "h-4 w-4" })
  },
  Custom: {
    prefix: "https://",
    icon: React.createElement(Link2, { className: "h-4 w-4" })
  }
}