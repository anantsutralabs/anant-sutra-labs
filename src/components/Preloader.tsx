import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SEEN_KEY = 'asl:visited'

export function hasVisited() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * First visit only. A brief branded beat — logo fade, then a curtain
 * reveal — on a short FIXED duration, not gated on the 3D scene's actual
 * asset load. A counted percentage made people feel like they were waiting
 * for something slow; the scene's textures stream in progressively behind
 * this regardless (Suspense fallbacks are already null), so there's nothing
 * real to wait for on screen.
 */
const HOLD_MS = 650

export function Preloader({ onDone }: { onDone: () => void }) {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setDone(true)
      try {
        sessionStorage.setItem(SEEN_KEY, '1')
      } catch { /* private mode */ }
      setTimeout(onDone, 700)
    }, HOLD_MS)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.img
            src="/brand/logo-mark.png"
            alt=""
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 0.94, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="h-[22vh] w-auto object-contain md:h-[26vh]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
