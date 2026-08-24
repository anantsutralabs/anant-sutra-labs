export type Service = {
  id: string
  title: string
  desc: string
  /** drives the small 3D icon rendered on the capability card */
  glyph: 'aperture' | 'frame' | 'wave' | 'avatar' | 'motion' | 'cube' | 'loop'
  /** real still from the portfolio, used as dimmed background texture on the
   *  capability card — ties an abstract service name back to actual work
   *  without claiming a literal 1:1 match */
  image: string
}

export const services: Service[] = [
  { id: 'image',    title: 'AI Image Generation',        desc: 'Product, fashion, portrait, food and branded visuals',   glyph: 'aperture', image: '/work/poster/fashion-reel.jpg' },
  { id: 'video',    title: 'AI Video Generation',        desc: 'Reels, demos, commercials and cinematic films',          glyph: 'frame',    image: '/work/poster/frostborn-teaser.jpg' },
  { id: 'audio',    title: 'AI Voice & Audio',           desc: 'Voiceovers, dubbing, jingles and scores',                glyph: 'wave',     image: '/work/poster/ucha-lamba-kad.jpg' },
  { id: 'avatars',  title: 'AI Avatars & Characters',    desc: 'Virtual influencers and brand spokespeople',             glyph: 'avatar',   image: '/work/stills/moon-parcel-03.jpg' },
  { id: 'post',     title: 'Motion & Post-Production',   desc: 'Graphics, editing, grading and upscaling',               glyph: 'motion',   image: '/work/poster/paanch-gend.jpg' },
  { id: '3d',       title: '3D & Product Visualization', desc: '360° spins and multi-angle renders',                     glyph: 'cube',     image: '/work/poster/jacket-review.jpg' },
  { id: 'retainer', title: 'Retainer & Recurring Programs', desc: 'Monthly content packages and seasonal campaign bundles', glyph: 'loop',  image: '/work/poster/the-last-coffee.jpg' },
]

export const capabilityStats = [
  { title: 'Studio output, AI-speed delivery', desc: 'Days, not weeks — no studio, cast, or location bookings.' },
  { title: 'Cost-efficient production',        desc: 'A fraction of traditional shoot costs, every time.' },
  { title: 'Flexible formats',                 desc: 'From single carousels to full narrative short films.' },
  { title: 'Built for performance',            desc: 'Scroll-stopping hooks, built for Reels & paid placements.' },
]
