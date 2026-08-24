import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { SplitText } from '../components/SplitText'
import { Reveal, HairRule } from '../components/Reveal'
import { ButtonLink } from '../components/PageLink'
import { Magnetic } from '../components/Magnetic'
import { tiers, priceNote, addOns, terms, type Tier } from '../data/pricing'
import { device } from '../lib/device'

/** Card that lifts and tilts in 3D toward the cursor. */
function TierCard({ tier, index }: { tier: Tier; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 220, damping: 22 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 220, damping: 22 })

  const interactive = !device.isMobile && !device.reducedMotion

  return (
    <Reveal delay={index * 0.07}>
      <motion.div
        ref={ref}
        onPointerMove={(e) => {
          if (!interactive) return
          const r = ref.current!.getBoundingClientRect()
          mx.set((e.clientX - r.left) / r.width - 0.5)
          my.set((e.clientY - r.top) / r.height - 0.5)
        }}
        onPointerLeave={() => {
          mx.set(0)
          my.set(0)
        }}
        style={interactive ? { rotateX: rx, rotateY: ry, transformPerspective: 900 } : undefined}
        className={`group relative overflow-hidden rounded-xl p-7 transition-transform duration-500 md:p-9 ${
          tier.featured ? '' : 'glass-panel hover:border-white/25'
        }`}
      >
        {/* animated gradient border for the featured tier */}
        {tier.featured && (
          /*
            Gradient border as a 1.5px inset frame with a sweeping gradient.
            Rotation was escaping the card's 3D tilt context and, once clipped,
            collapsed to nothing on a card this wide — a moving linear sweep
            covers the full perimeter at any aspect ratio.
          */
          <motion.span
            className="absolute inset-0 rounded-xl p-[1.5px]"
            style={{
              background:
                'linear-gradient(100deg, #7B4DFF, #22D3EE, #E9B85E, #22D3EE, #7B4DFF)',
              backgroundSize: '260% 100%',
            }}
            animate={device.reducedMotion ? undefined : { backgroundPosition: ['0% 50%', '260% 50%'] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
          >
            <span className="block h-full w-full rounded-[10.5px] bg-[#08080d]" />
          </motion.span>
        )}

        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-[42ch]">
            {tier.featured && (
              <span className="t-label-sm mb-3 inline-block rounded-full border border-white/15 px-3 py-1 text-cyan-soft">
                Most booked
              </span>
            )}
            <h3 className="t-display-sm">{tier.title}</h3>
            <p className="body-copy mt-3">{tier.desc}</p>
          </div>

          <div className="shrink-0 text-left sm:text-right">
            <p className="t-display-md tnum text-gold">{tier.price}</p>
            <p className="t-label-sm mt-1.5 text-faint">{tier.unit}</p>
          </div>
        </div>
      </motion.div>
    </Reveal>
  )
}

export default function Pricing() {
  return (
    <>
      <section className="shell pt-32 md:pt-40">
        <Reveal><span className="eyebrow">Service Rate Card</span></Reveal>

        <h1 className="mt-6">
          <SplitText
            as="span"
            text="Investment for"
            className="t-display-lg block"
            stagger={0.022}
          />
          <SplitText
            as="span"
            text="your next campaign"
            className="t-display-lg block"
            stagger={0.02}
            delay={0.12}
          />
        </h1>

        <HairRule className="mt-12" />

        <div className="mt-10 flex flex-col gap-4">
          {tiers.map((t, i) => (
            <TierCard key={t.id} tier={t} index={i} />
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-7 text-xs text-faint">{priceNote}</p>
        </Reveal>
      </section>

      {/* ── GOOD TO KNOW ─────────────────────────────────────── */}
      <section className="shell pt-28 md:pt-36">
        <Reveal><span className="eyebrow">Good to Know</span></Reveal>
        <Reveal delay={0.08}>
          <h2 className="t-display-md mt-5 max-w-[16ch]">
            Add-ons &amp; working terms
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {addOns.map((a, i) => (
            <Reveal key={a.label} delay={i * 0.08}>
              <div className="glass-panel flex items-center justify-between gap-6 rounded-xl px-6 py-5">
                <p className="text-[0.9rem] tracking-[-0.008em]">{a.label}</p>
                <p className="t-display-sm tnum shrink-0 text-cyan">{a.value}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-col">
          {terms.map((t, i) => (
            <Reveal key={t} delay={i * 0.07}>
              <div className="flex items-start gap-5 border-t border-white/10 py-5">
                <span className="t-label-sm tnum mt-1 text-violet-soft">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="body-copy">{t}</p>
              </div>
            </Reveal>
          ))}
          <HairRule />
        </div>

        <Reveal delay={0.2}>
          <div className="mt-14">
            <Magnetic>
              <ButtonLink to="/contact">Start a Project</ButtonLink>
            </Magnetic>
          </div>
        </Reveal>
      </section>
    </>
  )
}
