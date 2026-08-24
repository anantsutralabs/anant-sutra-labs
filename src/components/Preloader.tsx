import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgress } from '@react-three/drei'

const SEEN_KEY = 'asl:visited'

export function hasVisited() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * First visit only. Huge percentage counter while assets load, then a
 * curtain reveal. The counter eases toward real load progress so it never
 * stalls on a single number.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const { progress, active } = useProgress()
  const [shown, setShown] = useState(0)
  const [done, setDone] = useState(false)
  const raf = useRef(0)
  const value = useRef(0)
  const settled = useRef(false)

  useEffect(() => {
    const start = performance.now()
    const loop = () => {
      // never let it sit at 0, and never let it hit 100 before assets are in
      const elapsed = (performance.now() - start) / 1000
      const floor = Math.min(88, elapsed * 34)
      const target = Math.max(floor, progress)
      value.current += (target - value.current) * 0.08
      setShown(Math.min(100, value.current))

      const ready = !active && progress >= 100 && elapsed > 1.1
      if (ready && !settled.current) {
        settled.current = true
        value.current = 100
        setShown(100)
        setTimeout(() => {
          setDone(true)
          try {
            sessionStorage.setItem(SEEN_KEY, '1')
          } catch { /* private mode */ }
          setTimeout(onDone, 900)
        }, 260)
        return
      }
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf.current)
  }, [progress, active, onDone])

  const pct = Math.round(shown)

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink px-6 py-8 md:px-10"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex items-center justify-between">
            <span className="eyebrow">Anant Sutra Labs</span>
            <span className="eyebrow">Loading</span>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <motion.img
              src="/brand/logo-mark.png"
              alt=""
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 0.92, scale: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="h-[26vh] w-auto object-contain md:h-[30vh]"
            />
          </div>

          <div className="flex items-end justify-between gap-6">
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="tnum text-[22vw] font-bold leading-[0.8] tracking-[-0.05em] md:text-[16vw]"
              >
                {String(pct).padStart(2, '0')}
                <span className="text-[0.36em] align-super text-cyan-soft">%</span>
              </motion.div>
            </div>
            <div className="hidden pb-4 text-right md:block">
              <p className="body-copy max-w-[34ch] text-right">
                Studio-level judgment at AI-level speed.
              </p>
            </div>
          </div>

          <div className="relative h-px w-full bg-white/10">
            <motion.div
              className="absolute inset-y-0 left-0"
              style={{
                width: `${pct}%`,
                background: 'linear-gradient(90deg, #7B4DFF, #22D3EE)',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
