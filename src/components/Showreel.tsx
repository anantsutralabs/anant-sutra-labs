import { useState } from 'react'
import { Reveal } from './Reveal'

const SRC = '/work/video/showreel.mp4'
const POSTER = '/work/poster/showreel.jpg'

/**
 * The studio showreel. Nothing but the poster is fetched until someone presses
 * play (the file is ~28MB), and it then plays inline with the browser's own
 * controls — sound on, since the click is the user's gesture — so fullscreen,
 * seeking and volume all work without a custom player.
 */
export function Showreel() {
  const [playing, setPlaying] = useState(false)

  return (
    <section className="shell pt-6 md:pt-10" aria-label="Showreel">
      <Reveal>
        <div
          className="relative overflow-hidden rounded-xl border border-white/10 bg-black shadow-[0_30px_90px_-30px_rgba(123,77,255,0.45)]"
          style={{ aspectRatio: '16 / 9' }}
        >
          {playing ? (
            <video
              src={SRC}
              poster={POSTER}
              controls
              autoPlay
              playsInline
              preload="auto"
              controlsList="nodownload"
              className="absolute inset-0 h-full w-full bg-black object-contain"
            >
              Your browser can't play this video.
            </video>
          ) : (
            <button
              onClick={() => setPlaying(true)}
              aria-label="Play the Anant Sutra Labs showreel, 2 minutes 14 seconds"
              className="focus-ring group absolute inset-0 block h-full w-full text-left"
            >
              <img
                src={POSTER}
                alt="Anant Sutra Labs showreel 2026 — AI ads and cinematic films"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03]"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(5,5,8,0.1) 0%, rgba(5,5,8,0) 40%)',
                }}
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-black/45 text-white transition-all duration-500 group-hover:scale-110 group-hover:border-white/80 group-hover:bg-black/60 md:h-24 md:w-24">
                  <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8 md:h-9 md:w-9" aria-hidden="true">
                    <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                  </svg>
                </span>
              </div>
              <span className="t-label-sm tnum pointer-events-none absolute right-5 top-5 rounded-full bg-black/70 px-3 py-1.5 text-white/85 md:right-8 md:top-8">
                2:14
              </span>
            </button>
          )}
        </div>
      </Reveal>
    </section>
  )
}
