/** Mirrors the production drive folders, ordered by strategic weight, not
 *  alphabetically: Mythology and Short Film lead because they're what a
 *  studio can't get from anyone else; Fashion trails as the least
 *  differentiated category. */
export type Category =
  | 'Mythology'
  | 'Short Film'
  | 'Micro Drama'
  | 'Commercial'
  | 'Fashion'

/** What Naveen actually did on the piece. Default assumes solo AI
 *  production (director + art direction + AI pipeline, one person) since
 *  that's the studio's real shape — override per-piece if a specific film
 *  had a different credit. */
const SOLO = 'Directed, art directed & AI-produced — solo'

export type WorkItem = {
  id: string
  title: string
  category: Category
  role: string
  /** short line shown under the title in the lightbox */
  blurb: string
  aspect: number
  duration: string
  /** independent concept/spec work rather than a commissioned campaign */
  spec?: boolean
  /** absent while a project is still in development — the entry shows its
   *  design boards instead of a player */
  video?: string
  poster: string
  /** development artwork, shown in place of a film */
  stills?: string[]
  status?: string
  /** longer synopsis, shown instead of blurb when present — used for the
   *  in-development entry, where there's no film to speak for itself */
  synopsis?: string
  /** attributed pull-quote, sourced verbatim from the project bible */
  quote?: { text: string; from: string }
  /** English WebVTT captions — set only for films whose dialogue isn't
   *  English, so an international viewer isn't lost */
  captions?: string
}

const v = (id: string) => `/work/video/${id}.mp4`
const p = (id: string) => `/work/poster/${id}.jpg`

const make = (
  id: string, title: string, category: Category, blurb: string,
  w: number, h: number, duration: string, spec = false, role: string = SOLO,
): WorkItem => ({
  id, title, category, role, blurb, aspect: w / h,
  duration, spec, video: v(id), poster: p(id),
})

export const work: WorkItem[] = [
  // ── Mythology — leads: culturally specific, irreplaceable locally ──
  make('rama-trailer',   'Rama Trailer',        'Mythology',   'Feature-scale mythological trailer in anamorphic scope.',          2212, 936,  '2:18'),
  make('narsimha',       'Narasimha Ji',        'Mythology',   'Mythological sequence — transformation and scale.',                1920, 1080, '0:53'),

  // ── Short Film — the personal/experimental work; the actual differentiator ──
  {
    id: 'the-moon-parcel',
    title: 'The Moon Parcel',
    category: 'Short Film',
    role: SOLO,
    blurb: 'A sky courier who can\'t leave anything unfinished takes on an impossible delivery.',
    synopsis:
      'High above the clouds, a city of floating islands runs on rope bridges, airship lanes ' +
      'and parcel wires. Nibo, its most devoted courier, can\'t leave anything unfinished — ' +
      'until a bunny named Joe brings in a parcel addressed to her late father: destination, ' +
      'the Moon. Nibo promises to deliver it. What follows is a string of failed inventions, ' +
      'until an old memory box reveals the parcel he\'s really been chasing was never someone ' +
      'else\'s. It was his own.',
    quote: {
      text: 'Sometimes we think we\'re delivering a package… when we\'re really carrying a promise.',
      from: 'Granny Hazel',
    },
    aspect: 1400 / 787,
    duration: '5 min · In development',
    status: 'In development',
    poster: '/work/poster/the-moon-parcel.jpg',
    stills: [1, 2, 3, 4, 5].map((n) => `/work/stills/moon-parcel-0${n}.jpg`),
  },

  // ── Micro Drama ─────────────────────────────────────────────
  make('frostborn-teaser',  'Frostborn Teaser',    'Micro Drama', 'Cinematic game teaser — world reveal and title beat.',           1920, 1080, '1:05'),
  make('khep',               'Khep',                'Micro Drama', 'Character-driven short with grounded, gritty grade.',            1920, 1080, '0:44'),
  make('the-last-coffee',    'The Last Coffee',     'Micro Drama', 'Two-hander scene — performance, pacing and silence.',            1920, 1080, '0:36'),
  make('didi-dhurandhar',    'Didi Dhurandhar Song','Micro Drama', 'Narrative song sequence built around a lead performance.',       1920, 1080, '0:59'),
  make('ucha-lamba-kad',     'Ucha Lamba Kad Song', 'Micro Drama', 'Narrative song piece with sustained character staging.',         1920, 1080, '1:23'),
  make('paanch-gend',        'Paanch Gend',         'Micro Drama', 'Long-form dramatic sequence in anamorphic scope.',               2560, 1100, '1:55'),
  make('alone',               'Alone',               'Micro Drama', 'Single-character dramatic piece, minimal and quiet.',            1280, 720,  '0:30'),

  // ── Commercial (spec work — no client, credit is the concept + execution) ──
  make('royal-enfield', 'Royal Enfield Commercial', 'Commercial', 'Anamorphic motorcycle film — dust, chrome and long light.',        2212, 936,  '0:31', true),
  make('cheetos',       'Cheetos Commercial',       'Commercial', 'High-energy snack spot with hard-cut product beats.',              1920, 1080, '0:31', true),
  make('hell',          'Hell Commercial',          'Commercial', 'Energy-drink commercial built on contrast and heat.',              1920, 1080, '0:43', true),
  make('diet-coke',     'Diet Coke Commercial',     'Commercial', 'Condensation, glass and color — a classic beverage build.',       1920, 1080, '0:28', true),
  make('pringles',      'Pringles Commercial',      'Commercial', 'Stacked-product choreography and crisp macro texture.',            1920, 1080, '0:34', true),
  make('mac',           'MAC Commercial',           'Commercial', 'Beauty commercial — specular highlights and pigment.',             1920, 1080, '0:34', true),
  make('paper-boat',    'Paper Boat Commercial',    'Commercial', 'Nostalgia-led brand film with a warm, soft palette.',              1920, 1080, '0:17', true),
  make('oreo',          'Oreo Commercial',          'Commercial', 'Cookie commercial — twist, dunk and classic product beats.',       1920, 1080, '0:29', true),
  make('britannia',     'Britannia Commercial',     'Commercial', 'Packaged-food spot with warm domestic staging.',                   1280, 720,  '0:30', true),
  make('pizza',         'Pizza Commercial',         'Commercial', 'Food commercial — steam, pull-apart and appetite cues.',           1280, 720,  '0:15', true),
  make('cupid',         'Cupid Commercial',         'Commercial', 'Vertical product spot built for Reels placement.',                 720,  1280, '0:15', true),
  make('jacket-review',  'Jacket Product Review',    'Commercial', 'Vertical product-review style piece, UGC-adjacent.',              1080, 1920, '0:15', true),

  // ── Fashion — leanest category, kept to the two strongest pieces ──
  make('fashion-multiverse', 'Fashion Multiverse', 'Fashion', 'Vertical fashion motion built for Reels placement.',                  1080, 1920, '0:16'),
  make('fashion-reel',       'Fashion Reel',        'Fashion', 'Editorial styling with controlled studio lighting.',                 1080, 1920, '0:16'),

  // ── Unplaced — genre doesn't match any category above; flagged, not dropped ──
  make('paris-vlog', 'Paris Vlog', 'Micro Drama', 'Location-shot vlog-style piece.', 1280, 720, '0:15'),
]

export const categories: ('All' | Category)[] = [
  'All', 'Mythology', 'Short Film', 'Micro Drama', 'Commercial', 'Fashion',
]

export const featured = ['rama-trailer', 'the-moon-parcel', 'royal-enfield']
  .map((id) => work.find((w) => w.id === id)!)
