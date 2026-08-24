import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { WorkItem } from '../data/work'

export function Lightbox({ item, onClose }: { item: WorkItem | null; onClose: () => void }) {
  const video = useRef<HTMLVideoElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!item) return
    restoreFocus.current = document.activeElement as HTMLElement
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    addEventListener('keydown', onKey)
    // let the open animation start before we hit play
    const t = setTimeout(() => {
      panel.current?.focus()
      video.current?.play().catch(() => { /* autoplay blocked — controls are there */ })
    }, 220)

    return () => {
      clearTimeout(t)
      removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      restoreFocus.current?.focus?.()
    }
  }, [item, onClose])

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[85] flex items-center justify-center p-5 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label={`${item.title} — ${item.category}`}
        >
          <div
            className="absolute inset-0 bg-[#050508]/95 backdrop-blur-xl"
            onClick={onClose}
          />

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
              className="relative overflow-hidden rounded-xl border border-white/10 bg-black"
              style={{ aspectRatio: String(item.aspect) }}
            >
              {item.video ? (
                <video
                  ref={video}
                  key={item.id}
                  src={item.video}
                  poster={item.poster}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-contain"
                />
              ) : (
                <img
                  src={item.poster}
                  alt={`${item.title} — ${item.category} film by Anant Sutra Labs`}
                  className="h-full w-full object-cover"
                />
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
                <p className="body-copy mt-2 max-w-[52ch]">{item.blurb}</p>
              </div>
              <div className="t-label flex shrink-0 items-center gap-4">
                <span className="text-cyan-soft">{item.category}</span>
                <span className="text-faint">{item.duration}</span>
                {item.spec && <span className="text-faint">Concept</span>}
              </div>
            </div>

            <button
              onClick={onClose}
              className="focus-ring t-label absolute -top-12 right-0 flex items-center gap-2 text-white/60 transition-colors hover:text-white"
            >
              Close <span aria-hidden="true">×</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
