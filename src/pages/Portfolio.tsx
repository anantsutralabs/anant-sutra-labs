import type { ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SplitText } from '../components/SplitText'
import { Reveal, HairRule } from '../components/Reveal'
import { work, categories, type WorkItem, type Category } from '../data/work'
import { site } from '../data/site'

const slug = (c: string) => c.toLowerCase().replace(/\s+/g, '-')

/** Small filled play triangle — the hover cue that tells a client "this is
 *  a video, click it" without relying on them already knowing the site. */
function PlayGlyph() {
  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 scale-90">
      <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" aria-hidden="true">
        <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
      </svg>
    </span>
  )
}

/** Hover cue for still images — "this opens bigger", not "this plays". */
function ExpandGlyph() {
  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 scale-90">
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
      </svg>
    </span>
  )
}

/**
 * The catalogue is a real mix — anamorphic cinematic shots, plain 16:9, and
 * vertical Reels content — so one uniform grid cell flattens that out. This
 * varies each card's WIDTH by category (narrow for portrait/square, full-row
 * for ultra-wide anamorphic or a manually-featured `wide` item, half-row
 * for standard landscape); the card's HEIGHT is never forced — it's set
 * from the item's own aspect-ratio via inline style, so nothing is ever
 * stretched or cropped to fit a box that doesn't match its footage. A
 * `wide` item keeps its own real aspect ratio too — it just gets the
 * full-row width, so a 16:9 piece featured this way reads taller than an
 * anamorphic one in the same slot, not distorted to match it.
 */
function widthClasses(item: WorkItem): string {
  if (item.wide) {
    return 'col-span-2 md:col-span-6'
  }
  if (item.aspect < 1.2) {
    // portrait or square — a third-width column (Reels-shaped, or a square render)
    return 'col-span-1 md:col-span-2'
  }
  if (item.aspect > 1.95) {
    // anamorphic / ultra-wide — full-width row so it reads as large, not a sliver
    return 'col-span-2 md:col-span-6'
  }
  // standard 16:9 landscape
  return 'col-span-2 md:col-span-3'
}

function FilmCard({
  item,
  delay,
  onOpen,
}: {
  item: WorkItem
  delay: number
  onOpen: (i: WorkItem) => void
}) {
  return (
    <Reveal delay={delay} className={widthClasses(item)}>
      <button
        onClick={() => onOpen(item)}
        aria-label={
          item.still
            ? `View ${item.title} — ${item.category}. ${item.blurb}${
                item.galleryThumbs && item.galleryThumbs.length > 1 ? ` ${item.galleryThumbs.length} images.` : ''
              }`
            : `Play ${item.title} — ${item.category}. ${item.blurb} ${item.duration}.`
        }
        style={{ aspectRatio: String(item.aspect) }}
        className="focus-ring group relative block w-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] text-left transition-colors duration-300 hover:border-white/25"
      >
        <img
          src={item.poster}
          alt={
            item.still
              ? `${item.title} — ${item.category} by Naveen Sharma`
              : `${item.title} — ${item.category} film by Anant Sutra Labs`
          }
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover opacity-95 transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04] group-hover:opacity-100"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(5,5,8,0) 45%, rgba(5,5,8,0.82) 100%)' }}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {item.still ? <ExpandGlyph /> : <PlayGlyph />}
        </div>
        {!item.still && (
          <span className="t-label-sm tnum pointer-events-none absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-white/80 backdrop-blur">
            {item.duration}
          </span>
        )}
        {item.still && item.galleryThumbs && item.galleryThumbs.length > 1 && (
          <span className="t-label-sm tnum pointer-events-none absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-white/80 backdrop-blur">
            {item.galleryThumbs.length} images
          </span>
        )}
        {item.status === 'In development' && (
          <span className="t-label-sm pointer-events-none absolute left-3 top-3 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-cyan-soft backdrop-blur">
            Coming Soon
          </span>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3.5">
          <h2 className="text-[0.9rem] font-medium leading-tight tracking-[-0.01em] text-white">
            {item.title}
          </h2>
          <span className="t-label-sm shrink-0 text-white/65">{item.category}</span>
        </div>
      </button>
    </Reveal>
  )
}

/** Closes the 3D Work category with a link out to the live ArtStation
 *  profile — the projects are mirrored here, but the walkthrough videos and
 *  anything newer live there. Text only: no ArtStation logo, just an honest
 *  "this leaves the site" card. */
function ArtStationCard({ delay }: { delay: number }) {
  return (
    <Reveal delay={delay} className="col-span-2 md:col-span-3">
      <a
        href={site.artstation.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ aspectRatio: '16 / 9' }}
        className="focus-ring group relative flex w-full flex-col justify-between overflow-hidden rounded-lg border border-white/10 p-6 transition-colors duration-300 hover:border-white/30 md:p-8"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-80 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(70% 90% at 85% 15%, rgba(123,77,255,0.28), transparent 65%), radial-gradient(60% 80% at 10% 100%, rgba(34,211,238,0.18), transparent 70%)',
          }}
        />
        <span className="eyebrow relative">Full 3D portfolio</span>
        <div className="relative">
          <h2 className="t-display-sm max-w-[16ch]">The full profile on ArtStation</h2>
          <p className="body-copy mt-3 max-w-[36ch] text-sm">
            Every project above, plus the Unreal Engine walkthrough videos, in its original home.
          </p>
          <span className="t-label mt-6 inline-flex items-center gap-2 text-cyan-soft">
            View on ArtStation
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-1">↗</span>
          </span>
        </div>
      </a>
    </Reveal>
  )
}

function FilmGrid({ items, onOpen, delayOffset = 0, trailing }: {
  items: WorkItem[]
  onOpen: (i: WorkItem) => void
  delayOffset?: number
  trailing?: ReactNode
}) {
  return (
    <div className="grid grid-flow-dense grid-cols-2 items-start gap-4 md:grid-cols-6">
      {items.map((item, i) => (
        <FilmCard key={item.id} item={item} onOpen={onOpen} delay={Math.min(i + delayOffset, 8) * 0.04} />
      ))}
      {trailing}
    </div>
  )
}

export default function Portfolio({
  onOpen,
}: {
  onOpen: (i: WorkItem | null) => void
  openItem: WorkItem | null
}) {
  const [params, setParams] = useSearchParams()
  const active = params.get('filter') ?? 'all'

  const items =
    active === 'all' ? work : work.filter((w) => slug(w.category) === active)
  const shown = items.length ? items : work

  // one flagship pick per category, in category order — a quick cross-section
  // of the whole reel before someone commits to a single category
  const highlightIds = new Set<string>()
  const highlights: WorkItem[] =
    active === 'all'
      ? (categories.filter((c): c is Category => c !== 'All')
          .map((c) => work.find((w) => w.category === c))
          .filter((w): w is WorkItem => {
            if (!w || highlightIds.has(w.id)) return false
            highlightIds.add(w.id)
            return true
          }))
          // a square 3D cover would leave a hole beside a 16:9 film, so the
          // flagship pick shows its first full frame (16:9) instead
          .map((w) => (w.still && w.aspect < 1.2 && w.gallery?.length
            ? { ...w, poster: w.gallery[0], aspect: 16 / 9 }
            : w))
      : []
  const rest = active === 'all' ? shown.filter((w) => !highlightIds.has(w.id)) : shown

  const setFilter = (c: string) => {
    const next = new URLSearchParams(params)
    if (c === 'all') next.delete('filter')
    else next.set('filter', c)
    setParams(next, { replace: true })
  }

  return (
    <>
      <section data-ui className="shell pt-32">
        <Reveal><span className="eyebrow">Our Work</span></Reveal>

        <h1 className="mt-4">
          <SplitText as="span" text="AI Films" className="t-display-lg block" stagger={0.024} />
        </h1>

        <Reveal delay={0.35}>
          <p className="body-copy mt-4 max-w-[46ch]">
            Pick a category, or browse everything below. Click any frame to open it.
          </p>
        </Reveal>

        {/* filter pills */}
        <Reveal delay={0.45}>
          <div className="mt-6 flex flex-wrap gap-2.5" role="tablist" aria-label="Filter work">
            {categories.map((c) => {
              const key = c === 'All' ? 'all' : slug(c)
              const isActive = active === key
              return (
                <button
                  key={c}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setFilter(key)}
                  className={`focus-ring t-label-sm relative overflow-hidden rounded-full border px-5 py-2 transition-colors duration-500 ${
                    isActive
                      ? 'border-transparent text-ink'
                      : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="pill"
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(100deg, #B79CFF, #8FEAF5)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10">{c}</span>
                </button>
              )
            })}
            <span className="t-label-sm tnum ml-1 self-center text-faint">
              {shown.length} works
            </span>
          </div>
        </Reveal>
        <HairRule className="mt-6" />
      </section>

      {highlights.length > 0 && (
        <section className="shell mt-10">
          <Reveal><span className="eyebrow">One From Every Category</span></Reveal>
          <div className="mt-5">
            <FilmGrid items={highlights} onOpen={onOpen} />
          </div>
        </section>
      )}

      <section className="shell mt-10 pb-24">
        {highlights.length > 0 && (
          <Reveal>
            <span className="eyebrow">Everything Else</span>
          </Reveal>
        )}
        <div className={highlights.length > 0 ? 'mt-5' : ''}>
          <FilmGrid
            items={rest}
            onOpen={onOpen}
            delayOffset={highlights.length}
            trailing={
              active === '3d-work' ? <ArtStationCard delay={Math.min(rest.length, 8) * 0.04} /> : undefined
            }
          />
        </div>
      </section>
    </>
  )
}
