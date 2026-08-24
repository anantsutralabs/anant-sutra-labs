/** Minimal line-art social icons — matches the site's glyph style rather than
 *  pulling in brand-marketing icon packs. */

type IconProps = { className?: string }

export function InstagramIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  )
}

export function WhatsAppIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 3a9 9 0 0 0-7.75 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M8.3 8.6c.2-.5.4-.5.6-.5h.5c.15 0 .35 0 .5.4.2.5.6 1.5.65 1.6.05.1.1.25 0 .4-.1.15-.15.25-.3.4l-.4.45c-.15.15-.3.3-.15.6.15.3.7 1.15 1.5 1.85.9.8 1.6 1.05 1.9 1.2.3.15.45.1.6-.05l.55-.65c.15-.2.35-.15.55-.1.2.1 1.4.65 1.65.8.25.15.4.2.45.3.05.1.05.65-.2 1.25-.25.6-1.35 1.15-1.85 1.15-.5.05-1 .05-3.1-1.15-2.5-1.4-4.05-3.95-4.15-4.15-.1-.2-.9-1.2-.9-2.3 0-1.1.55-1.6.75-1.85Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function LinkedInIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="7.2" cy="8" r="1.1" fill="currentColor" />
      <path d="M7.2 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M11 17v-3.6c0-1.2.8-2.1 2-2.1s2 .9 2 2.1V17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
