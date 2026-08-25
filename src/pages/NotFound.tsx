import { SplitText } from '../components/SplitText'
import { Reveal } from '../components/Reveal'
import { ButtonLink } from '../components/PageLink'

/**
 * Every unmatched path used to fall through to Home, which meant any typo'd
 * URL served the homepage with a 200 — a soft-404 that reads as duplicate
 * content to a crawler. This is a distinct page, so at minimum the content
 * differs; Netlify's SPA rewrite still returns 200 at the HTTP layer (a true
 * 404 status would need a server/edge function), but visitors and crawlers
 * alike now see an actual "not found" state instead of the homepage again.
 */
export default function NotFound() {
  return (
    <section className="shell flex min-h-[80svh] flex-col justify-center pt-32">
      <Reveal><span className="eyebrow">404</span></Reveal>
      <h1 className="mt-6">
        <SplitText as="span" text="Nothing here." className="t-display-lg block" stagger={0.02} />
      </h1>
      <Reveal delay={0.3}>
        <p className="body-copy mt-6 max-w-[46ch]">
          That page doesn't exist. It might have moved, or the link was mistyped.
        </p>
      </Reveal>
      <Reveal delay={0.4}>
        <div className="mt-10">
          <ButtonLink to="/">Back to home</ButtonLink>
        </div>
      </Reveal>
    </section>
  )
}
