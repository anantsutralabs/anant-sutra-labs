export type Service = {
  id: string
  title: string
  desc: string
  /** drives the small 3D icon rendered on the capability card */
  glyph: 'aperture' | 'frame' | 'wave' | 'avatar' | 'motion' | 'cube' | 'loop'
}

export const services: Service[] = [
  { id: 'image',    title: 'AI Image Generation',        desc: 'Product, fashion, portrait, food and branded visuals',   glyph: 'aperture' },
  { id: 'video',    title: 'AI Video Generation',        desc: 'Reels, demos, commercials and cinematic films',          glyph: 'frame'    },
  { id: 'audio',    title: 'AI Voice & Audio',           desc: 'Voiceovers, dubbing, jingles and scores',                glyph: 'wave'     },
  { id: 'avatars',  title: 'AI Avatars & Characters',    desc: 'Virtual influencers and brand spokespeople',             glyph: 'avatar'   },
  { id: 'post',     title: 'Motion & Post-Production',   desc: 'Graphics, editing, grading and upscaling',               glyph: 'motion'   },
  { id: '3d',       title: '3D & Product Visualization', desc: '360° spins and multi-angle renders',                     glyph: 'cube'     },
  { id: 'retainer', title: 'Retainer & Recurring Programs', desc: 'Monthly content packages and seasonal campaign bundles', glyph: 'loop'  },
]

export const capabilityStats = [
  { title: 'Studio output, AI-speed delivery', desc: 'Days, not weeks — no studio, cast, or location bookings.' },
  { title: 'Cost-efficient production',        desc: 'A fraction of traditional shoot costs, every time.' },
  { title: 'Flexible formats',                 desc: 'From single carousels to full narrative short films.' },
  { title: 'Built for performance',            desc: 'Scroll-stopping hooks, built for Reels & paid placements.' },
]
