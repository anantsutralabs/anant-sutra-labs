import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { WorkItem } from '../data/work'

function fmt(t: number) {
  if (!Number.isFinite(t)) return '0:00'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Minimal line-icon set for the custom transport bar — matches the rest of the site. */
function Icon({ kind }: { kind: 'play' | 'pause' | 'expand' | 'compress' }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (kind === 'play') return <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none" /></svg>
  if (kind === 'pause') return <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1" fill="currentColor" /><rect x="13.5" y="5" width="4" height="14" rx="1" fill="currentColor" /></svg>
  if (kind === 'expand') return <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" {...common} /></svg>
  return <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path d="M4 9h5V4M20 9h-5V4M4 15h5v5M20 15h-5v5" {...common} /></svg>
}

export function Lightbox({ item, onClose }: { item: WorkItem | null; onClose: () => void }) {
  const video = useRef<HTMLVideoElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout>>()

  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    if (!item) return
    restoreFocus.current = document.activeElement as HTMLElement
    document.body.style.overflow = 'hidden'
    setPlaying(false)
    setProgress(0)
    setTime(0)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === ' ' && item.video) {
        e.preventDefault()
        video.current?.paused ? video.current?.play() : video.current?.pause()
      }
    }
    addEventListener('keydown', onKey)
    const t = setTimeout(() => {
      panel.current?.focus()
      video.current?.play().catch(() => { /* autoplay blocked — the center play button is there */ })
    }, 220)

    return () => {
      clearTimeout(t)
      removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      restoreFocus.current?.focus?.()
    }
  }, [item, onClose])

  useEffect(() => {
    const onFsChange = () => setFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  const wake = () => {
    setShowControls(true)
    clearTimeout(hideTimer.current)
    if (playing) hideTimer.current = setTimeout(() => setShowControls(false), 2400)
  }

  const togglePlay = () => {
    const v = video.current
    if (!v) return
    v.paused ? v.play() : v.pause()
  }

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else frame.current?.requestFullscreen()
  }

  const seek = (clientX: number, bar: HTMLElement) => {
    const v = video.current
    if (!v || !v.duration) return
    const rect = bar.getBoundingClientRect()
    const p = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    v.currentTime = p * v.duration
  }

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          // `data-ui` exempts this from the site-wide rule that disables
          // pointer events on #root while the portfolio's 3D arc is active —
          // without it, every control here (including Close) was unclickable.
          data-ui
          className="fixed inset-0 z-[85] flex items-center justify-center p-5 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label={`${item.title} — ${item.category}`}
        >
          <div className="absolute inset-0 bg-[#050508]/95 backdrop-blur-xl" onClick={onClose} />

          <motion.div
            ref={panel}
            tabIndex={-1}
            className="relative w-full max-w-5xl outline-none"
            initial={{ y: 26, scale: 0.965, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 18, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              ref={frame}
              onMouseMove={wake}
              onClick={() => item.video && togglePlay()}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-black"
              style={{ aspectRatio: String(item.aspect) }}
            >
              {item.video ? (
                <video
                  ref={video}
                  key={item.id}
                  src={item.video}
                  poster={item.poster}
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-contain"
                  onPlay={() => { setPlaying(true); wake() }}
                  onPause={() => { setPlaying(false); setShowControls(true) }}
                  onTimeUpdate={(e) => {
                    const v = e.currentTarget
                    setTime(v.currentTime)
                    setProgress(v.duration ? v.currentTime / v.duration : 0)
                  }}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onEnded={() => setShowControls(true)}
                />
              ) : (
                <img
                  src={item.poster}
                  alt={`${item.title} — ${item.category} film by Anant Sutra Labs`}
                  className="h-full w-full object-cover"
                />
              )}

              {item.video && (
                <>
                  {/* center play/pause — tap the frame to toggle, YouTube-style */}
                  <AnimatePresence>
                    {(!playing || showControls) && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePlay()
                        }}
                        aria-label={playing ? 'Pause' : 'Play'}
                        className="focus-ring absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:bg-black/70"
                      >
                        <span className={playing ? '' : 'translate-x-0.5'}>
                          <Icon kind={playing ? 'pause' : 'play'} />
                        </span>
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* bottom transport bar */}
                  <motion.div
                    initial={false}
                    animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 8 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pb-3 pt-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="group/bar relative mb-2.5 h-1 cursor-pointer rounded-full bg-white/25"
                      onClick={(e) => seek(e.clientX, e.currentTarget)}
                    >
                      <div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{ width: `${progress * 100}%`, background: 'linear-gradient(90deg, #7B4DFF, #22D3EE)' }}
                      />
                      <div
                        className="absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover/bar:opacity-100"
                        style={{ left: `${progress * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center gap-3 text-white">
                      <button
                        onClick={togglePlay}
                        aria-label={playing ? 'Pause' : 'Play'}
                        className="focus-ring flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                      >
                        <Icon kind={playing ? 'pause' : 'play'} />
                      </button>

                      <span className="t-label-sm tnum text-white/75">
                        {fmt(time)} / {fmt(duration)}
                      </span>

                      <span className="flex-1" />

                      <button
                        onClick={toggleFullscreen}
                        aria-label={fullscreen ? 'Exit full screen' : 'Full screen'}
                        className="focus-ring flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                      >
                        <Icon kind={fullscreen ? 'compress' : 'expand'} />
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </div>

            {/* development boards stand in for a film that does not exist yet */}
            {item.stills && (
              <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
                {item.stills.map((src, i) => (
                  <a
                    key={src}
                    href={src}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring group relative h-20 w-32 shrink-0 overflow-hidden rounded-md border border-white/10"
                  >
                    <img
                      src={src}
                      alt={`${item.title} — development board ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover opacity-70 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                    />
                  </a>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="t-display-md">{item.title}</h2>
                <p className="body-copy mt-2 max-w-[58ch]">{item.synopsis ?? item.blurb}</p>
                <p className="t-label-sm mt-2 text-faint">{item.role}</p>
              </div>
              <div className="t-label flex shrink-0 items-center gap-4">
                <span className="text-cyan-soft">{item.category}</span>
                <span className="text-faint">{item.duration}</span>
                {item.spec && <span className="text-faint">Concept</span>}
              </div>
            </div>

            {item.quote && (
              <blockquote className="mt-6 max-w-[52ch] border-l-2 border-violet-soft/40 pl-5">
                <p className="text-lg italic text-white/85">&ldquo;{item.quote.text}&rdquo;</p>
                <cite className="t-label-sm mt-2 block not-italic text-faint">— {item.quote.from}</cite>
              </blockquote>
            )}
          </motion.div>

          {/* pinned to the viewport, not the panel, so it's reachable regardless of video aspect ratio */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="focus-ring fixed right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur transition-colors hover:bg-black/70 hover:text-white md:right-6 md:top-6"
          >
            <span aria-hidden="true" className="text-2xl leading-none">×</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
