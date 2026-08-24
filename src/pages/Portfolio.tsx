import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SplitText } from '../components/SplitText'
import { Reveal, HairRule } from '../components/Reveal'
import { work, categories, type WorkItem } from '../data/work'
import { device } from '../lib/device'
import { site } from '../data/site'

const slug = (c: string) => c.toLowerCase().replace(/\s+/g, '-')

export default function Portfolio({
  onOpen,
  openItem,
}: {
  onOpen: (i: WorkItem | null) => void
  openItem: WorkItem | null
}) {
  const [params, setParams] = useSearchParams()
  const active = params.get('filter') ?? 'all'

  const items =
    active === 'all' ? work : work.filter((w) => slug(w.category) === active)
  const shown = items.length ? items : work

  const setFilter = (c: string) => {
    const next = new URLSearchParams(params)
    if (c === 'all') next.delete('filter')
    else next.set('filter', c)
    setParams(next, { replace: true })
  }

  // let pointer events reach the canvas while the arc is the main content
  useEffect(() => {
    if (device.flatGallery) return
    document.body.classList.add('arc-active')
    return () => document.body.classList.remove('arc-active')
  }, [])

  // the 3D arc needs page height to scroll against
  const scrollHeight = device.flatGallery ? undefined : `${Math.max(220, shown.length * 44)}vh`

  return (
    <>
      <section data-ui className="shell pt-28 md:pt-32">
        <Reveal><span className="eyebrow">Our Work</span></Reveal>

        <h1 className="mt-6">
          <SplitText
            as="span"
            text="Selected films"
            className="t-display-lg block"
            stagger={0.024}
          />
        </h1>

        <Reveal delay={0.35}>
          <p className="body-copy mt-5 max-w-[46ch]">
            {device.flatGallery
              ? 'Tap any frame to play the film.'
              : 'Scroll to travel the arc. Click any frame to play the film.'}
          </p>
        </Reveal>

        {/* filter pills */}
        <Reveal delay={0.45}>
          <div className="mt-7 flex flex-wrap gap-2.5" role="tablist" aria-label="Filter work">
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
              {shown.length} films
            </span>
          </div>
        </Reveal>
        <HairRule className="mt-8" />
      </section>

      {/* ── 3D ARC: this block is just scroll runway; the planes live in WebGL ── */}
      {!device.flatGallery && (
        <div style={{ height: scrollHeight }} aria-hidden="true">
          <div className="sr-only">
            {shown.map((w) => (
              <button key={w.id} onClick={() => onOpen(w)}>
                {w.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── FLAT GRID: mobile / reduced-motion ─────────────────── */}
      {device.flatGallery && (
        <section data-ui className="shell mt-12">
          <div className="grid gap-5 sm:grid-cols-2">
            {shown.map((item, i) => (
              <Reveal key={item.id} delay={Math.min(i, 6) * 0.06}>
                <button
                  onClick={() => onOpen(item)}
                  className="focus-ring group block w-full text-left"
                >
                  <div
                    className="relative overflow-hidden rounded-lg border border-white/10"
                    style={{ aspectRatio: String(item.aspect) }}
                  >
                    <img
                      src={item.poster}
                      alt={`${item.title} — ${item.category} film by Anant Sutra Labs`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
                    />
                    <span className="t-label-sm tnum absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-white/80 backdrop-blur">
                      {item.duration}
                    </span>
                  </div>
                  <div className="mt-3.5 flex items-baseline justify-between gap-4">
                    <h3 className="text-[0.9rem] font-medium tracking-[-0.01em]">{item.title}</h3>
                    <span className="t-label-sm text-faint">
                      {item.category}
                    </span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section data-ui className="shell mt-24">
        <HairRule />
        <p className="mt-8 max-w-[70ch] text-[11px] leading-relaxed text-faint">
          {site.specNotice}
        </p>
      </section>
    </>
  )
}
