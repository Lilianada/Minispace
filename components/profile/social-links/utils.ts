import { SOCIAL_PLATFORMS, SocialLink, SocialUsernames } from "./types"

export const buildSocialLinks = (socialUsernames: SocialUsernames): SocialLink[] => {
  const newSocialLinks: SocialLink[] = []
  
  // Add standard social platforms
  if (socialUsernames.X) {
    newSocialLinks.push({
      platform: "X",
      url: SOCIAL_PLATFORMS.X.prefix + socialUsernames.X,
      icon: SOCIAL_PLATFORMS.X.icon,
      prefix: SOCIAL_PLATFORMS.X.prefix
    })
  }
  
  if (socialUsernames.Instagram) {
    newSocialLinks.push({
      platform: "Instagram",
      url: SOCIAL_PLATFORMS.Instagram.prefix + socialUsernames.Instagram,
      icon: SOCIAL_PLATFORMS.Instagram.icon,
      prefix: SOCIAL_PLATFORMS.Instagram.prefix
    })
  }
  
  if (socialUsernames.LinkedIn) {
    newSocialLinks.push({
      platform: "LinkedIn",
      url: SOCIAL_PLATFORMS.LinkedIn.prefix + socialUsernames.LinkedIn,
      icon: SOCIAL_PLATFORMS.LinkedIn.icon,
      prefix: SOCIAL_PLATFORMS.LinkedIn.prefix
    })
  }
  
  if (socialUsernames.GitHub) {
    newSocialLinks.push({
      platform: "GitHub",
      url: SOCIAL_PLATFORMS.GitHub.prefix + socialUsernames.GitHub,
      icon: SOCIAL_PLATFORMS.GitHub.icon,
      prefix: SOCIAL_PLATFORMS.GitHub.prefix
    })
  }
  
  // Add custom link if both platform and URL are provided
  if (socialUsernames.Custom.platform && socialUsernames.Custom.url) {
    newSocialLinks.push({
      platform: socialUsernames.Custom.platform,
      url: SOCIAL_PLATFORMS.Custom.prefix + socialUsernames.Custom.url,
      icon: SOCIAL_PLATFORMS.Custom.icon,
      prefix: SOCIAL_PLATFORMS.Custom.prefix
    })
  }
  
  return newSocialLinks
}

export const extractSocialUsernames = (socialLinks: SocialLink[]): SocialUsernames => {
  const initialUsernames: SocialUsernames = {
    X: "",
    Instagram: "",
    LinkedIn: "",
    GitHub: "",
    Custom: {
      platform: "",
      url: ""
    }
  }
  
  socialLinks.forEach(link => {
    if (link.platform === "X" || link.platform === "Twitter") {
      initialUsernames.X = link.url.replace(SOCIAL_PLATFORMS.X.prefix, "")
    } else if (link.platform === "Instagram") {
      initialUsernames.Instagram = link.url.replace(SOCIAL_PLATFORMS.Instagram.prefix, "")
    } else if (link.platform === "LinkedIn") {
      initialUsernames.LinkedIn = link.url.replace(SOCIAL_PLATFORMS.LinkedIn.prefix, "")
    } else if (link.platform === "GitHub") {
      initialUsernames.GitHub = link.url.replace(SOCIAL_PLATFORMS.GitHub.prefix, "")
    } else {
      initialUsernames.Custom = {
        platform: link.platform,
        url: link.url.replace("https://", "")
      }
    }
  })
  
  return initialUsernames
}