import { motion } from 'framer-motion'
import { SplitText } from '../components/SplitText'
import { Reveal, HairRule } from '../components/Reveal'
import { Magnetic } from '../components/Magnetic'
import { ButtonLink, PageLink } from '../components/PageLink'
import { capabilityStats } from '../data/services'
import { featured } from '../data/work'
import { site } from '../data/site'

export default function Home() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative flex min-h-[100svh] flex-col justify-center">
        {/* keeps the headline legible where it crosses the glass mark — a
            second, tighter radial sits under the mark's own position, since
            the mark is bright enough that the linear scrim alone still let
            text go soft where the two directly overlapped */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(100deg, rgba(5,5,8,0.94) 0%, rgba(5,5,8,0.8) 30%, rgba(5,5,8,0.32) 55%, rgba(5,5,8,0.05) 78%), radial-gradient(46% 60% at 68% 46%, rgba(5,5,8,0.55), transparent 70%)',
          }}
        />
        <div className="relative z-10 shell pt-24">
          <Reveal>
            <span className="eyebrow">AI Content Production Studio</span>
          </Reveal>

          <h1 className="mt-7">
            <SplitText
              as="span"
              text="AI Ads &"
              className="t-display-xl block"
              stagger={0.03}
            />
            <SplitText
              as="span"
              text="Cinematic Films"
              className="t-display-xl block"
              stagger={0.026}
              delay={0.14}
            />
          </h1>

          <Reveal delay={0.5}>
            <p className="t-lead mt-8 max-w-[34ch]">{site.sub}</p>
          </Reveal>

          <Reveal delay={0.62}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic>
                <ButtonLink to="/portfolio">View Work</ButtonLink>
              </Magnetic>
              <Magnetic>
                <ButtonLink to="/contact" variant="ghost">Start a Project</ButtonLink>
              </Magnetic>
            </div>
          </Reveal>
        </div>

        {/* scroll cue */}
        <motion.div
          className="pointer-events-none absolute bottom-8 left-0 right-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
        >
          <div className="shell flex items-center justify-between">
            <span className="t-label-sm text-faint">Scroll</span>
            <div className="h-10 w-px overflow-hidden bg-white/10">
              <motion.div
                className="h-full w-full"
                style={{ background: 'linear-gradient(180deg, #7B4DFF, #22D3EE)' }}
                animate={{ y: ['-100%', '100%'] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── CAPABILITY STATS ─────────────────────────────────── */}
      <section className="shell pt-24 md:pt-36">
        <Reveal><span className="eyebrow">Why Anant Sutra</span></Reveal>
        <Reveal delay={0.06}>
          <h2 className="t-display-md mt-5 max-w-[18ch]">Built for how briefs actually move.</h2>
        </Reveal>
        <HairRule className="mt-8" />

        <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {capabilityStats.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <article>
                <span className="t-label tnum text-violet-soft">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="t-display-sm mt-4">{s.title}</h3>
                <p className="body-copy mt-3 text-sm">{s.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <PageLink
            to="/about"
            className="focus-ring t-label group mt-14 inline-flex items-center gap-3 text-white/70 transition-colors hover:text-white"
          >
            About the studio
            <span className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
          </PageLink>
        </Reveal>
      </section>

      {/* ── FEATURED WORK STRIP ──────────────────────────────── */}
      <section className="shell pt-28 md:pt-40">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Reveal><span className="eyebrow">Selected Work</span></Reveal>
            <Reveal delay={0.06}>
              <h2 className="t-display-md mt-5 max-w-[16ch]">The work that gets referenced most.</h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <PageLink
              to="/portfolio"
              className="focus-ring t-label group flex shrink-0 items-center gap-3 pb-1 text-white/60 transition-colors hover:text-white"
            >
              All work
              <span className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
            </PageLink>
          </Reveal>
        </div>
        <HairRule className="mt-8" />

        <div className="mt-10 grid gap-7 md:grid-cols-3">
          {featured.map((item, i) => {
            const comingSoon = item.status === 'In development'
            return (
              <Reveal key={item.id} delay={i * 0.1}>
                <PageLink to="/portfolio" className="focus-ring group block">
                  <div
                    className="relative overflow-hidden rounded-lg border border-white/10 shadow-[0_20px_60px_-25px_rgba(123,77,255,0.35)]"
                    style={{ aspectRatio: String(item.aspect) }}
                  >
                    <img
                      src={item.poster}
                      alt={`${item.title} — ${item.category} film by Anant Sutra Labs`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover opacity-95 transition-all duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04] group-hover:opacity-100"
                    />
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(5,5,8,0) 55%, rgba(5,5,8,0.65) 100%)',
                      }}
                    />
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                      style={{
                        background:
                          'linear-gradient(160deg, rgba(123,77,255,0.22), transparent 42%, rgba(34,211,238,0.18))',
                      }}
                    />
                    {comingSoon && (
                      <span className="t-label-sm absolute left-4 top-4 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-cyan-soft backdrop-blur">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <h3 className="text-[0.9rem] font-medium tracking-[-0.01em]">{item.title}</h3>
                    <span className="t-label-sm text-faint">
                      {item.category}
                    </span>
                  </div>
                </PageLink>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ── PROJECT CTA ───────────────────────────────────────── */}
      <section className="shell pt-28 md:pt-40">
        <HairRule />
        <Reveal delay={0.05}>
          <PageLink to="/contact" className="focus-ring group block py-14 md:py-20">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="t-label text-white/50">Have a project in mind?</span>
                <p className="t-display-lg mt-3 flex items-center gap-4">
                  Start a conversation
                  <span className="transition-transform duration-500 group-hover:translate-x-3">→</span>
                </p>
              </div>
            </div>
          </PageLink>
        </Reveal>
        <HairRule />
      </section>
    </>
  )
}
