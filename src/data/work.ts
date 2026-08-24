/** Mirrors the production drive folders: COMMERCIAL, FASHION, MICRO DRAMA,
 *  MYTHOLOGY, SHORT FILM. */
export type Category =
  | 'Commercial'
  | 'Fashion'
  | 'Micro Drama'
  | 'Mythology'
  | 'Short Film'

export type WorkItem = {
  id: string
  title: string
  category: Category
  /** short line shown under the title in the lightbox */
  blurb: string
  /** 'wide' 16:9 · 'scope' 2.36:1 · 'vertical' 9:16 — drives plane + grid aspect */
  format: 'wide' | 'scope' | 'vertical'
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
}

const v = (id: string) => `/work/video/${id}.mp4`
const p = (id: string) => `/work/poster/${id}.jpg`

const make = (
  id: string, title: string, category: Category, blurb: string,
  format: WorkItem['format'], duration: string, spec = false,
): WorkItem => ({
  id, title, category, blurb, format,
  aspect: format === 'wide' ? 16 / 9 : format === 'scope' ? 1700 / 720 : 9 / 16,
  duration, spec, video: v(id), poster: p(id),
})

export const work: WorkItem[] = [
  // ── Commercial ──────────────────────────────────────────────
  make('royal-enfield',  'Royal Enfield',      'Commercial', 'Anamorphic motorcycle film — dust, chrome and long light.',       'scope',    '0:31', true),
  make('cheetos',        'Cheetos',            'Commercial', 'High-energy snack spot with hard-cut product beats.',             'wide',     '0:31', true),
  make('hell',           'Hell Energy',        'Commercial', 'Energy-drink commercial built on contrast and heat.',             'wide',     '0:43', true),
  make('diet-coke',      'Diet Coke',          'Commercial', 'Condensation, glass and colour — a classic beverage build.',      'wide',     '0:28', true),
  make('pringles',       'Pringles',           'Commercial', 'Stacked-product choreography and crisp macro texture.',           'wide',     '0:34', true),
  make('mac',            'MAC',                'Commercial', 'Beauty commercial — specular highlights and pigment.',            'wide',     '0:34', true),
  make('paper-boat',     'Paper Boat',         'Commercial', 'Nostalgia-led brand film with a warm, soft palette.',             'wide',     '0:17', true),
  make('pizza',          'Pizza',              'Commercial', 'Food commercial — steam, pull-apart and appetite cues.',          'wide',     '0:15', true),

  // ── Fashion ─────────────────────────────────────────────────
  make('fashion-01',     'Fashion Film 01',    'Fashion',    'Vertical fashion motion built for Reels placement.',              'vertical', '0:15'),
  make('fashion-02',     'Fashion Film 02',    'Fashion',    'Editorial styling with controlled studio lighting.',              'vertical', '0:15'),
  make('fashion-04',     'Fashion Film 03',    'Fashion',    'Short-form look reveal with a single continuous move.',           'vertical', '0:10'),
  make('fashion-05',     'Fashion Film 04',    'Fashion',    'Texture and silhouette study in vertical format.',                'vertical', '0:15'),
  make('fashion-03',     'Fashion Film 05',    'Fashion',    'Widescreen fashion cutdown for paid placement.',                  'wide',     '0:15'),

  // ── Micro Drama ─────────────────────────────────────────────
  make('game-teaser',    'Game Teaser',        'Micro Drama','Cinematic game teaser — world reveal and title beat.',            'wide',     '1:05'),
  make('dhurandhar',     'Dhurandhar',         'Micro Drama','Long-form dramatic sequence with sustained tension.',             'wide',     '0:59'),
  make('khep',           'Khep',               'Micro Drama','Character-driven short with grounded, gritty grade.',             'wide',     '0:44'),
  make('the-last-coffee','The Last Coffee',    'Micro Drama','Two-hander scene — performance, pacing and silence.',             'wide',     '0:36'),
  make('uri',            'Uri',                'Micro Drama','Action-drama sequence built from a written style guide.',         'wide',     '0:22'),
  make('movie-scene',    'Movie Scene',        'Micro Drama','Single dramatic scene staged and cut like live action.',          'wide',     '0:30'),
  make('podcast-ep-01',  'Podcast — Ep 01',    'Micro Drama','AI-hosted podcast format, vertical cutdown.',                     'vertical', '0:15'),
  make('podcast-ep-02',  'Podcast — Ep 02',    'Micro Drama','Second episode of the AI-hosted vertical series.',                'vertical', '0:15'),

  // ── Mythology ───────────────────────────────────────────────
  make('rama-trailer',   'Rama — Trailer',     'Mythology',  'Feature-scale mythological trailer in anamorphic scope.',         'scope',    '2:18'),
  make('narsimha',       'Narsimha',           'Mythology',  'Mythological sequence — transformation and scale.',               'wide',     '0:53'),
  make('shiv-tandav',    'Shiv Tandav',        'Mythology',  'Rhythm-cut devotional piece driven by the Tandav.',               'wide',     '0:30'),

  // ── Short Film ──────────────────────────────────────────────
  {
    id: 'the-moon-parcel',
    title: 'The Moon Parcel',
    category: 'Short Film',
    blurb:
      'An original short film in development — screenplay locked, design bible and character work complete.',
    format: 'wide',
    aspect: 1200 / 760,
    duration: 'In development',
    status: 'In development',
    poster: '/work/poster/the-moon-parcel.jpg',
    stills: [1, 2, 3, 4, 5].map((n) => `/work/stills/moon-parcel-0${n}.jpg`),
  },
]

export const categories: ('All' | Category)[] = [
  'All', 'Commercial', 'Fashion', 'Micro Drama', 'Mythology', 'Short Film',
]

export const featured = ['rama-trailer', 'royal-enfield', 'the-last-coffee']
  .map((id) => work.find((w) => w.id === id)!)
