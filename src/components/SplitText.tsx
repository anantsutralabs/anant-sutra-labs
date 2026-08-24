import { motion, type Variants } from 'framer-motion'
import { device } from '../lib/device'

const container: Variants = {
  hidden: {},
  show: (stagger: number = 0.022) => ({
    transition: { staggerChildren: stagger, delayChildren: 0.04 },
  }),
}

const charVariant: Variants = {
  hidden: { y: '105%', rotateX: 34, opacity: 0 },
  show: {
    y: '0%',
    rotateX: 0,
    opacity: 1,
    transition: { duration: 0.78, ease: [0.16, 1, 0.3, 1] },
  },
}

type Props = {
  text: string
  className?: string
  /** words that should render in the accent gradient */
  accent?: string[]
  stagger?: number
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

/**
 * Per-character mask-clip rise with a slight rotationX.
 * Splits per word first so wrapping stays natural, and keeps the whole
 * string readable to screen readers via aria-label.
 */
export function SplitText({
  text,
  className = '',
  accent = [],
  stagger = 0.022,
  delay = 0,
  as: Tag = 'h2',
}: Props) {
  const words = text.split(' ')
  const accentSet = new Set(accent.map((a) => a.toLowerCase()))

  if (device.reducedMotion) {
    return <Tag className={className}>{text}</Tag>
  }

  const MotionTag = motion[Tag] as typeof motion.h2

  return (
    <MotionTag
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-12% 0px' }}
      variants={container}
      custom={stagger}
      transition={{ delayChildren: delay }}
      style={{ perspective: 800 }}
    >
      {words.map((word, wi) => {
        const clean = word.replace(/[^a-z0-9]/gi, '').toLowerCase()
        const isAccent = accentSet.has(clean)
        return (
          <span key={wi} className="inline-block whitespace-nowrap" aria-hidden="true">
            {Array.from(word).map((ch, ci) => (
              <span key={ci} className="inline-block overflow-hidden align-bottom">
                <motion.span
                  className={`inline-block ${isAccent ? 'grad-text' : ''}`}
                  variants={charVariant}
                >
                  {ch}
                </motion.span>
              </span>
            ))}
            {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        )
      })}
    </MotionTag>
  )
}
