import { useState } from 'react'
import { motion } from 'framer-motion'
import { SplitText } from '../components/SplitText'
import { Reveal, HairRule } from '../components/Reveal'
import { PageLink } from '../components/PageLink'
import { services, type Service } from '../data/services'

/** Small line-art glyph per capability — animates on hover. */
function Glyph({ kind, active }: { kind: Service['glyph']; active: boolean }) {
  const stroke = active ? '#8FEAF5' : '#B79CFF'
  const common = {
    fill: 'none',
    stroke,
    strokeWidth: 1.25,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  return (
    <motion.svg
      viewBox="0 0 32 32"
      className="h-7 w-7"
      animate={{ rotate: active ? (kind === 'loop' ? 180 : 0) : 0, scale: active ? 1.12 : 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      aria-hidden="true"
    >
      {kind === 'aperture' && (
        <>
          <circle cx="16" cy="16" r="9" {...common} />
          <path d="M16 7v9l7.8 4.5M16 16 8.2 20.5M16 16l-4-8" {...common} />
        </>
      )}
      {kind === 'frame' && (
        <>
          <rect x="5" y="9" width="15" height="14" rx="2.5" {...common} />
          <path d="m20 14 7-3.5v11L20 18z" {...common} />
        </>
      )}
      {kind === 'motion' && (
        <>
          <path d="m9 23 5.5-14 3.2 8 2.6-3 4.7 9z" {...common} />
          <path d="M5 6.5 8 9M5 13h3.4" {...common} opacity={0.6} />
        </>
      )}
      {kind === 'cube' && (
        <>
          <path d="m16 5 10 5.5v11L16 27 6 21.5v-11z" {...common} />
          <path d="m6 10.5 10 5.5 10-5.5M16 16v11" {...common} opacity={0.75} />
        </>
      )}
      {kind === 'loop' && (
        <>
          <path d="M7 13a9 9 0 0 1 15.5-3.5M25 19a9 9 0 0 1-15.5 3.5" {...common} />
          <path d="M22 5.5V10h-4.5M10 26.5V22h4.5" {...common} />
        </>
      )}
      {kind === 'clapper' && (
        <>
          <path d="M5 13.5 26 12v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" {...common} />
          <path d="m5 13.5 1.3-6.8L25 10l-1 3.3z" {...common} />
          <path d="m10.5 6.3-1.6 6.9M16.5 7.2l-1.6 6.9M22 8l-1.5 6.9" {...common} opacity={0.6} />
        </>
      )}
      {kind === 'megaphone' && (
        <>
          <path d="M5 14v4h3l11 6V8L8 14z" {...common} />
          <path d="M19 8v16" {...common} />
          <path d="M23 13.5a4.6 4.6 0 0 1 0 5" {...common} opacity={0.6} />
          <path d="M6.5 18v5a1.5 1.5 0 0 0 3 0v-4" {...common} opacity={0.75} />
        </>
      )}
      {kind === 'browser' && (
        <>
          <rect x="4.5" y="7" width="23" height="18" rx="2" {...common} />
          <path d="M4.5 12.2h23" {...common} />
          <circle cx="7.6" cy="9.6" r="0.9" fill={stroke} stroke="none" />
          <circle cx="10.4" cy="9.6" r="0.9" fill={stroke} stroke="none" opacity={0.6} />
        </>
      )}
      {kind === 'reel' && (
        <>
          <rect x="9" y="4" width="14" height="24" rx="2.5" {...common} />
          <path d="M13 8.5h6M13 23.5h6" {...common} opacity={0.65} />
          <path d="m14.3 13.2 4.4 2.8-4.4 2.8z" fill={stroke} stroke="none" />
        </>
      )}
      {kind === 'building' && (
        <>
          <path d="M8 27V8.5L18 5v22" {...common} />
          <path d="M18 12.5 25 15v12" {...common} />
          <path d="M8 27h20" {...common} />
          <path d="M11.5 12h3M11.5 16.5h3M11.5 21h3" {...common} opacity={0.65} />
          <path d="M20.5 18.5h2M20.5 22.5h2" {...common} opacity={0.65} />
        </>
      )}
    </motion.svg>
  )
}

export default function Services() {
  const [hover, setHover] = useState<string | null>(null)

  return (
    <>
      <section className="shell flex min-h-[60svh] flex-col justify-center pt-32">
        <Reveal><span className="eyebrow">What We Do</span></Reveal>
        <h1 className="mt-6">
          <SplitText
            as="span"
            text="One studio."
            className="t-display-lg block"
            stagger={0.022}
          />
          <SplitText
            as="span"
            text="Every format you need."
            className="t-display-lg block"
            stagger={0.02}
            delay={0.1}
          />
        </h1>
        <Reveal delay={0.4}>
          <p className="body-copy mt-8 max-w-[52ch]">
            From a single product still to a full narrative short — one studio, one pipeline,
            held to a director's standard end to end.
          </p>
        </Reveal>
      </section>

      <section className="shell pt-4 md:pt-8">
        <HairRule />

        <div role="list" className="mt-4">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={Math.min(i, 6) * 0.05}>
              <article
                role="listitem"
                onMouseEnter={() => setHover(s.id)}
                onMouseLeave={() => setHover((h) => (h === s.id ? null : h))}
                className="group relative grid grid-cols-1 gap-3 border-t border-white/10 py-6 transition-colors duration-500 last:border-b sm:grid-cols-[3rem_15rem_1fr] sm:items-center sm:gap-6"
              >
                {/* accent bar — the hover state, not an image thumbnail */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -left-6 w-px origin-top scale-y-0 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100 md:-left-10"
                  style={{ background: 'linear-gradient(180deg, #7B4DFF, #22D3EE)' }}
                />

                <span className="t-label tnum hidden text-faint sm:block">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="flex items-center gap-4">
                  <span className="t-label tnum text-faint sm:hidden">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <Glyph kind={s.glyph} active={hover === s.id} />
                  <h2 className="t-display-sm">{s.title}</h2>
                </div>

                <p className="body-copy">{s.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10">
            <PageLink
              to="/contact"
              className="focus-ring group inline-flex items-center gap-3 text-sm text-cyan-soft transition-opacity hover:opacity-75"
            >
              Custom scope? Let's talk.
              <span className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
            </PageLink>
          </div>
        </Reveal>
      </section>
    </>
  )
}
