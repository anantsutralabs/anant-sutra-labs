export type Tier = {
  id: string
  title: string
  price: string
  unit: string
  desc: string
  featured?: boolean
}

/** Rate card — USD. Source: Anant Sutra Labs client proposal & rate card, 2026. */
export const tiers: Tier[] = [
  { id: 'product-images', title: 'Product Shoot Images', price: '$15',      unit: 'per image', desc: 'Per-image product photography, no physical shoot required' },
  { id: 'carousel',       title: 'Carousel Post',        price: '$30–50',   unit: 'per post',  desc: '3–5 AI-generated product / lifestyle images' },
  { id: 'reels',          title: 'Reels / UGC Video',    price: '$60–80',   unit: 'per video', desc: '15–30 sec AI avatar or product-demo style video' },
  { id: 'commercial',     title: 'Commercial / TV Ad',   price: '$100–160', unit: 'per ad',    desc: '30–60 sec, multi-shot branded ad', featured: true },
  { id: 'short-film',     title: 'Cinematic Short Film', price: '$200–550', unit: 'per film',  desc: '1–3 min narrative-driven short film' },
]

export const priceNote =
  'Price includes delivery in one format only, as specified in your brief.'

export const addOns = [
  { label: 'Additional delivery format (e.g. vertical + square)', value: '+30%' },
  { label: 'Rush delivery — under 3 days',                        value: '+20%' },
]

export const terms = [
  '2 rounds of revisions included with every project',
  'Standard turnaround: 3–5 days from brief approval (longer for Commercial / Film tiers)',
  '50% advance to begin production, balance due on final delivery',
]
