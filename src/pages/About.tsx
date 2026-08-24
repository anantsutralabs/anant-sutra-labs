import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { SplitText } from '../components/SplitText'
import { Reveal, HairRule } from '../components/Reveal'
import { PageLink } from '../components/PageLink'
import { services, type Service } from '../data/services'
import { device } from '../lib/device'

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
      className="h-8 w-8"
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
      {kind === 'wave' && (
        <path d="M4 16h4l3-8 4 16 3.5-11 3 6 2.5-3H28" {...common} />
      )}
      {kind === 'avatar' && (
        <>
          <circle cx="13" cy="12" r="4.2" {...common} />
          <path d="M5.5 25c.8-4.4 4-6.6 7.5-6.6s6.7 2.2 7.5 6.6" {...common} />
          <path d="M22 9.6a4.2 4.2 0 0 1 0 7.2M25 7a7.4 7.4 0 0 1 0 12.4" {...common} opacity={0.55} />
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
    </motion.svg>
  )
}

export default function About() {
  const railWrap = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<string | null>(null)
  const [travel, setTravel] = useState(0)

  const { scrollYProgress } = useScroll({
    target: railWrap,
    offset: ['start start', 'end end'],
  })
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel])

  // measure how far the rail must travel so the last card lands flush
  useEffect(() => {
    const measure = () => {
      const track = railWrap.current?.querySelector<HTMLElement>('[data-track]')
      if (!track) return
      setTravel(Math.max(0, track.scrollWidth - window.innerWidth + 48))
    }
    measure()
    addEventListener('resize', measure)
    return () => removeEventListener('resize', measure)
  }, [])

  const pinned = !device.isMobile && !device.reducedMotion

  return (
    <>
      <section className="shell flex min-h-[92svh] flex-col justify-center pt-32">
        <Reveal>
          <span className="eyebrow">About Anant Sutra Labs</span>
        </Reveal>

        <h1 className="mt-7">
          <SplitText
            as="span"
            text="15 years in animation."
            className="t-display-lg block"
            stagger={0.018}
          />
          <SplitText
            as="span"
            text="Now powered by AI."
            className="t-display-lg block"
            accent={['ai']}
            stagger={0.018}
            delay={0.12}
          />
        </h1>

        <Reveal delay={0.45}>
          <p className="body-copy mt-10 max-w-[66ch]">
            Anant Sutra Labs is led by a 15-year veteran of the animation and VFX industry — from
            frame-by-frame craft to full studio productions. That background is why every
            AI-generated frame we deliver still gets held to a director's standard: composition,
            lighting, pacing, and story sense that AI alone can't replicate. We didn't start as an AI
            company that picked up filmmaking. We started as filmmakers who mastered AI — so you get
            studio-level judgment at AI-level speed and cost.
          </p>
        </Reveal>

        <Reveal delay={0.58}>
          <p className="mt-8 text-sm text-cyan-soft">— Naveen Sharma, AI Filmmaker & Founder</p>
        </Reveal>
      </section>

      {/* ── PINNED HORIZONTAL CAPABILITIES RAIL ──────────────── */}
      <section
        ref={railWrap}
        className="relative mt-28"
        style={{ height: pinned ? `${Math.max(180, services.length * 62)}vh` : 'auto' }}
      >
        <div
          className={
            pinned
              ? 'sticky top-0 flex h-screen flex-col justify-center overflow-hidden'
              : 'flex flex-col justify-center overflow-hidden'
          }
        >
          <div className="shell">
            <span className="eyebrow">What We Do</span>
            <h2 className="t-display-md mt-5 max-w-[18ch]">
              One studio. Every format you need.
            </h2>
            <HairRule className="mt-8" />
          </div>

          <motion.div
            data-track
            style={pinned ? { x } : undefined}
            className={`mt-12 flex gap-6 px-6 md:px-10 ${
              pinned ? 'w-max' : 'no-scrollbar w-full snap-x snap-mandatory overflow-x-auto pb-4'
            }`}
          >
            {services.map((s, i) => (
              <article
                key={s.id}
                onMouseEnter={() => setHover(s.id)}
                onMouseLeave={() => setHover((h) => (h === s.id ? null : h))}
                className="group glass-panel relative flex h-[330px] w-[78vw] shrink-0 snap-center flex-col justify-between rounded-xl p-7 transition-colors duration-500 hover:border-white/25 sm:w-[380px]"
              >
                <div className="flex items-start justify-between">
                  <Glyph kind={s.glyph} active={hover === s.id} />
                  <span className="t-label tnum text-faint">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <div>
                  <h3 className="t-display-sm">{s.title}</h3>
                  <p className="body-copy mt-3">{s.desc}</p>
                </div>

                <span
                  className="absolute inset-x-7 bottom-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100"
                  style={{ background: 'linear-gradient(90deg, #7B4DFF, #22D3EE)' }}
                />
              </article>
            ))}
          </motion.div>

          <div className="shell mt-10">
            <PageLink
              to="/contact"
              className="focus-ring group inline-flex items-center gap-3 text-sm text-cyan-soft transition-opacity hover:opacity-75"
            >
              Custom scope? Let's talk rates.
              <span className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
            </PageLink>
          </div>
        </div>
      </section>
    </>
  )
}
