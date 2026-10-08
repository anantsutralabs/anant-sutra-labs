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
function Icon({ kind }: { kind: 'play' | 'pause' | 'expand' | 'compress' | 'cc' }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (kind === 'play') return <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none" /></svg>
  if (kind === 'pause') return <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1" fill="currentColor" /><rect x="13.5" y="5" width="4" height="14" rx="1" fill="currentColor" /></svg>
  if (kind === 'expand') return <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" {...common} /></svg>
  if (kind === 'cc') return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="2.2" {...common} />
      <path d="M9.2 10.3c-.5-.5-1.2-.5-1.8-.5-1.2 0-2 .8-2 2.2s.8 2.2 2 2.2c.6 0 1.3 0 1.8-.5" {...common} />
      <path d="M16.6 10.3c-.5-.5-1.2-.5-1.8-.5-1.2 0-2 .8-2 2.2s.8 2.2 2 2.2c.6 0 1.3 0 1.8-.5" {...common} />
    </svg>
  )
  return <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path d="M4 9h5V4M20 9h-5V4M4 15h5v5M20 15h-5v5" {...common} /></svg>
}

export function Lightbox({ item, onClose }: { item: WorkItem | null; onClose: () => void }) {
  const gallery = item?.gallery ?? []
  const galleryMode = gallery.length > 0
  const portrait = !!item && item.aspect < 1 && !galleryMode
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
  // on by default when captions exist — the whole point is that an
  // international viewer shouldn't have to hunt for a toggle
  const [captionsOn, setCaptionsOn] = useState(true)
  // which image of a still project's gallery is on screen
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (!item) return
    restoreFocus.current = document.activeElement as HTMLElement
    document.body.style.overflow = 'hidden'
    setPlaying(false)
    setProgress(0)
    setTime(0)
    setCaptionsOn(true)
    setIdx(0)

    const n = item.gallery?.length ?? 0
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (n > 1 && e.key === 'ArrowRight') setIdx((i) => (i + 1) % n)
      if (n > 1 && e.key === 'ArrowLeft') setIdx((i) => (i - 1 + n) % n)
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

  // warm the next image so stepping through a project doesn't flash
  useEffect(() => {
    if (gallery.length > 1) new Image().src = gallery[(idx + 1) % gallery.length]
  }, [idx, gallery])

  const step = (d: number) => setIdx((i) => (i + d + gallery.length) % gallery.length)

  // HTMLTrackElement's mode isn't a React prop — synced imperatively
  useEffect(() => {
    const track = video.current?.textTracks?.[0]
    if (track) track.mode = captionsOn ? 'showing' : 'hidden'
  }, [captionsOn, item])

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
          className="fixed inset-0 z-[85] flex justify-center overflow-y-auto p-5 [align-items:safe_center] md:p-10"
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
            <div className={portrait ? 'flex justify-center' : ''}>
            <div
              ref={frame}
              onMouseMove={wake}
              onClick={() => item.video && togglePlay()}
              className={`group relative overflow-hidden rounded-xl border border-white/10 bg-black ${portrait ? '' : 'w-full'}`}
              style={
                galleryMode
                  ? { aspectRatio: '16 / 9', maxHeight: '72svh' }
                  : portrait
                    ? { aspectRatio: String(item.aspect), height: 'min(76svh, 820px)', maxWidth: '100%' }
                    : { aspectRatio: String(item.aspect) }
              }
            >
              {item.video ? (
                <>
                  <video
                    ref={video}
                    key={item.id}
                    src={item.video}
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
                  >
                    {item.captions && (
                      <track
                        kind="subtitles"
                        srcLang="en"
                        label="English"
                        src={item.captions}
                        default
                      />
                    )}
                  </video>
                  {/*
                    Not the native `poster` attribute: some engines render it
                    with cover-like behavior regardless of the video's own
                    object-fit, which cropped the still for anything that
                    isn't 16:9. This layer is under our own CSS and always
                    matches the video's contain framing exactly.
                  */}
                  {!playing && (
                    <img
                      src={item.poster}
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                    />
                  )}
                </>
              ) : galleryMode ? (
                <>
                  {/* contain, not cover: a project mixes landscape renders,
                      square crops and wide model sheets — none get cropped */}
                  <img
                    key={gallery[idx]}
                    src={gallery[idx]}
                    alt={`${item.title} — image ${idx + 1} of ${gallery.length} by Naveen Sharma. ${item.blurb}`}
                    className="h-full w-full object-contain"
                  />
                  {gallery.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); step(-1) }}
                        aria-label="Previous image"
                        className="focus-ring absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white/85 backdrop-blur transition-colors hover:bg-black/75 hover:text-white"
                      >
                        <span aria-hidden="true" className="text-xl">←</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); step(1) }}
                        aria-label="Next image"
                        className="focus-ring absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white/85 backdrop-blur transition-colors hover:bg-black/75 hover:text-white"
                      >
                        <span aria-hidden="true" className="text-xl">→</span>
                      </button>
                      <span className="t-label-sm tnum pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-white/80 backdrop-blur">
                        {idx + 1} / {gallery.length}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <img
                  src={item.poster}
                  alt={
                    item.still
                      ? `${item.title} — ${item.category} by Naveen Sharma. ${item.blurb}`
                      : `${item.title} — ${item.category} film by Anant Sutra Labs`
                  }
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

                      {item.captions && (
                        <button
                          onClick={() => setCaptionsOn((c) => !c)}
                          aria-label={captionsOn ? 'Turn off captions' : 'Turn on captions'}
                          aria-pressed={captionsOn}
                          className={`focus-ring flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/10 ${captionsOn ? 'text-cyan-soft' : ''}`}
                        >
                          <Icon kind="cc" />
                        </button>
                      )}

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
            </div>

            {/* thumbnail strip — jump straight to any image in the project */}
            {galleryMode && item.galleryThumbs && item.galleryThumbs.length > 1 && (
              <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Project images">
                {item.galleryThumbs.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setIdx(i)}
                    aria-label={`Show image ${i + 1} of ${item.galleryThumbs!.length}`}
                    aria-current={i === idx}
                    className={`focus-ring relative h-16 w-28 shrink-0 overflow-hidden rounded-md border transition-all duration-300 ${
                      i === idx ? 'border-cyan-soft/70 opacity-100' : 'border-white/10 opacity-55 hover:opacity-90'
                    }`}
                  >
                    <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

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
                {item.link && (
                  <a
                    href={item.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring t-label mt-4 inline-flex items-center gap-2 text-cyan-soft transition-opacity hover:opacity-75"
                  >
                    {item.link.label}
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
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
