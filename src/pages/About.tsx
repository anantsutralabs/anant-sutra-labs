import { useState } from 'react'
import { motion } from 'framer-motion'
import { SplitText } from '../components/SplitText'
import { Reveal, HairRule } from '../components/Reveal'
import { PageLink } from '../components/PageLink'
import { services, type Service } from '../data/services'
import { bio } from '../data/background'
import { clients } from '../data/clients'

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
    </motion.svg>
  )
}

export default function About() {
  const [hover, setHover] = useState<string | null>(null)

  return (
    <>
      <section className="shell flex min-h-[92svh] flex-col justify-center pt-32">
        <Reveal>
          <span className="eyebrow">About Anant Sutra Labs</span>
        </Reveal>

        <h1 className="mt-7">
          <SplitText
            as="span"
            text="13+ years in animation."
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
            Anant Sutra Labs is led by a 13+ year veteran of the animation and VFX industry — from
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

      {/* ── BACKGROUND — career history prior to Anant Sutra Labs ────── */}
      <section className="shell pt-28 md:pt-36">
        <Reveal><span className="eyebrow">Background</span></Reveal>
        <Reveal delay={0.08}>
          <h2 className="t-display-md mt-5 max-w-[20ch]">Before the studio.</h2>
        </Reveal>
        <HairRule className="mt-8" />

        <Reveal delay={0.15}>
          <p className="body-copy mt-8 max-w-[72ch] text-[15px] leading-[1.75]">{bio}</p>
        </Reveal>
      </section>

      {/* ── WHAT WE DO — capability list, not a thumbnail grid ────────── */}
      <section className="shell pt-28 md:pt-36">
        <span className="eyebrow">What We Do</span>
        <Reveal delay={0.06}>
          <h2 className="t-display-md mt-5 max-w-[18ch]">
            One studio. Every format you need.
          </h2>
        </Reveal>
        <HairRule className="mt-8" />

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
                  <h3 className="t-display-sm">{s.title}</h3>
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

      {/* ── WORKED WITH — brands & networks, sourced from the resume ───── */}
      <section className="shell pt-28 md:pt-36">
        <span className="eyebrow">Worked With</span>
        <Reveal delay={0.06}>
          <h2 className="t-display-md mt-5 max-w-[20ch]">
            Studios, networks and broadcasts.
          </h2>
        </Reveal>
        <HairRule className="mt-8" />

        <Reveal delay={0.12}>
          <div className="mt-10 flex flex-wrap items-center gap-x-14 gap-y-10">
            {clients.map((c) => (
              <img
                key={c.id}
                src={`/brand/clients/${c.id}.png`}
                alt={c.name}
                loading="lazy"
                decoding="async"
                className="h-[72px] w-auto max-w-[18rem] object-contain transition-transform duration-500 hover:scale-[1.05] sm:h-[88px]"
              />
            ))}
          </div>
        </Reveal>
      </section>
    </>
  )
}
