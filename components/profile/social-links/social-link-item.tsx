import { SocialLink } from "./types"

interface SocialLinkItemProps {
  link: SocialLink
}

export const SocialLinkItem = ({ link }: SocialLinkItemProps) => {
  const fullUrl = `${link.prefix || ''}${link.url}`
  
  return (
    <div className="flex items-stretch w-full rounded-md overflow-hidden border">
      {/* Icon section */}
      <div className="flex items-center justify-center bg-muted w-16 shrink-0">
        <div className="flex items-center justify-center h-5 w-5">
          {link.icon}
        </div>
      </div>
      
      {/* URL display section */}
      <div className="flex flex-col justify-center flex-1 pl-3 py-2 truncate">
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium hover:underline truncate"
        >
          {link.platform}
        </a>
        <span className="text-xs text-muted-foreground truncate">{fullUrl}</span>
      </div>
    </div>
  )
}