import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { device } from '../lib/device'

/**
 * Mask-clip rise for blocks. No plain fades anywhere on the site.
 *
 * The viewport trigger sits on the OUTER wrapper on purpose. The inner element
 * starts translated past the bottom of the mask, so observing it directly would
 * report zero intersected area — it would be clipped by the very mask that is
 * meant to reveal it, and the animation would never start.
 */
const outer: Variants = { hidden: {}, show: {} }

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = '',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  if (device.reducedMotion) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-8% 0px' }}
      variants={outer}
    >
      <motion.div
        variants={{
          hidden: { y, opacity: 0, filter: 'blur(6px)' },
          show: {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] },
          },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

/**
 * Hairline that draws itself in from the left. Same reasoning as above — a
 * scaleX(0) element has a zero-width box and would never register as visible,
 * so the trigger lives on a full-width wrapper.
 */
export function HairRule({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  if (device.reducedMotion) return <div className={`hair ${className}`} />

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-4% 0px' }}
      variants={outer}
    >
      <motion.div
        className="hair origin-left"
        variants={{
          hidden: { scaleX: 0 },
          show: { scaleX: 1, transition: { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] } },
        }}
      />
    </motion.div>
  )
}
