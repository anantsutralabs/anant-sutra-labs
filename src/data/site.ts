export const site = {
  name: 'Anant Sutra Labs',
  tagline: 'AI Ads & Cinematic Films',
  sub: 'Studio-level judgment at AI-level speed.',
  email: 'anantsutralabs@gmail.com',
  /** displayed as plain text / tel: link */
  phone: '+91 99907 61899',
  /** click-to-chat only — not shown as plain text elsewhere on the site */
  whatsapp: { number: '917503591899', display: '+91 75035 91899' },
  instagram: { handle: '@anantsutralabs', url: 'https://instagram.com/anantsutralabs' },
  linkedin: { handle: 'naveensharma03', url: 'https://www.linkedin.com/in/naveensharma03/' },
  year: 2026,
  /** Brand films in the reel are independent concept/spec work. Stated plainly for accuracy. */
  specNotice:
    'Brand films shown are independent concept work created to demonstrate craft. They are not commissioned by, affiliated with, or endorsed by the brands depicted.',
} as const

export const nav = [
  { label: 'Home',       to: '/' },
  { label: 'About Us',   to: '/about' },
  { label: 'Portfolio',  to: '/portfolio' },
  { label: 'Contact',    to: '/contact' },
] as const
