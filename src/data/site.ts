export const site = {
  name: 'Anant Sutra Labs',
  tagline: 'AI Ads & Cinematic Films',
  sub: 'Studio-level judgment at AI-level speed.',
  email: 'anantsutralabs@gmail.com',
  phones: ['+91 99907 61899', '+91 75035 91899'],
  instagram: { handle: '@anantsutralabs', url: 'https://instagram.com/anantsutralabs' },
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
