import { SplitText } from '../components/SplitText'
import { Reveal, HairRule } from '../components/Reveal'
import { bio } from '../data/background'
import { clients } from '../data/clients'

export default function About() {
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
