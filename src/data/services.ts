export type Service = {
  id: string
  title: string
  desc: string
  /** drives the small line-icon rendered next to each row */
  glyph: 'clapper' | 'megaphone' | 'aperture' | 'frame' | 'browser' | 'reel' | 'cube' | 'motion' | 'loop' | 'building'
}

export const services: Service[] = [
  { id: 'cinematic', title: 'Cinematic Films',           desc: 'Narrative-driven short films and trailers, mythology to micro-drama.',    glyph: 'clapper'    },
  { id: 'commercial', title: 'Commercials',               desc: 'Brand spots and product ads, concept to final cut.',                      glyph: 'megaphone'  },
  { id: 'realestate', title: 'Real Estate & Architectural Films', desc: 'Property walkthroughs, architectural showcases and commercial-space ads.', glyph: 'building' },
  { id: 'product',    title: 'Product Shoots & Reviews',  desc: 'AI-generated product photography and UGC-style review content.',          glyph: 'aperture'   },
  { id: 'video',      title: 'Image & Video Generation',  desc: 'Product, fashion, portrait and branded visuals, stills to motion.',        glyph: 'frame'      },
  { id: 'web',        title: 'Website Design',            desc: 'Studio sites and campaign pages, built and deployed end-to-end.',          glyph: 'browser'    },
  { id: 'fashion',    title: 'Fashion Reels',             desc: 'Editorial motion and styling content, built for Reels placement.',         glyph: 'reel'       },
  { id: '3d',         title: '3D Visualization',          desc: '360° spins and multi-angle product renders.',                              glyph: 'cube'       },
  { id: 'post',       title: 'Motion & Post-Production',  desc: 'Graphics, editing, grading and upscaling.',                                 glyph: 'motion'     },
  { id: 'retainer',   title: 'Retainer & Recurring Programs', desc: 'Monthly content packages and seasonal campaign bundles.',               glyph: 'loop'       },
]

export const capabilityStats = [
  { title: 'Studio output, AI-speed delivery', desc: 'Days, not weeks — no studio, cast, or location bookings.' },
  { title: 'Cost-efficient production',        desc: 'A fraction of traditional shoot costs, every time.' },
  { title: 'Flexible formats',                 desc: 'From single carousels to full narrative short films.' },
  { title: 'Built for performance',            desc: 'Scroll-stopping hooks, built for Reels & paid placements.' },
]
