import { useNavigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { runTransition } from '../lib/transition'
import { preloadRoute } from '../lib/preload'

/**
 * Every internal link goes through the transition controller so navigation
 * always reads as a camera flight, never a page load.
 */
export function PageLink({
  to,
  children,
  className = '',
  ariaLabel,
}: {
  to: string
  children: ReactNode
  className?: string
  ariaLabel?: string
}) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <a
      href={to}
      aria-label={ariaLabel}
      className={className}
      onMouseEnter={() => preloadRoute(to)}
      onFocus={() => preloadRoute(to)}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        if (to.split('?')[0] === pathname) return
        runTransition(to, navigate)
      }}
    >
      {children}
    </a>
  )
}

/** Primary / secondary button treatment shared across pages. */
export function ButtonLink({
  to,
  children,
  variant = 'primary',
}: {
  to: string
  children: ReactNode
  variant?: 'primary' | 'ghost'
}) {
  const base =
    'focus-ring t-label group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-3.5 transition-colors duration-500'

  if (variant === 'primary') {
    return (
      <PageLink to={to} className={`${base} text-ink`}>
        <span
          className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]"
          style={{ background: 'linear-gradient(100deg, #B79CFF, #8FEAF5)' }}
        />
        <span className="relative z-10">{children}</span>
        <span className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">→</span>
      </PageLink>
    )
  }

  return (
    <PageLink
      to={to}
      className={`${base} border border-white/20 bg-white/5 text-white backdrop-blur-md hover:border-white/50 hover:bg-white/10`}
    >
      <span className="relative z-10">{children}</span>
      <span className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">→</span>
    </PageLink>
  )
}
