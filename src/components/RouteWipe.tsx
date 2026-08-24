import { motion, AnimatePresence } from 'framer-motion'
import { useTransition, WIPE_IN, WIPE_OUT } from '../lib/transition'

/**
 * Gradient shader-style wipe that sweeps across during a route change.
 * It sweeps in from the left, then retracts off to the right — one motion,
 * never a symmetrical curtain.
 */
export function RouteWipe() {
  const { phase } = useTransition()

  return (
    <AnimatePresence>
      {phase !== 'idle' && (
        <motion.div
          key="wipe"
          className="pointer-events-none fixed inset-0 z-[80]"
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{
            clipPath: phase === 'in' ? 'inset(0 0% 0 0)' : 'inset(0 0 0 100%)',
          }}
          transition={{
            duration: (phase === 'in' ? WIPE_IN : WIPE_OUT) / 1000,
            ease: phase === 'in' ? [0.7, 0, 0.84, 0] : [0.16, 1, 0.3, 1],
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(100deg, #050508 0%, #2A1466 24%, #7B4DFF 52%, #22D3EE 78%, #050508 100%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(120% 80% at 30% 50%, rgba(255,255,255,0.22), transparent 60%)',
              mixBlendMode: 'screen',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
