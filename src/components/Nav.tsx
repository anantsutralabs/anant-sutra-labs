import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { nav, site } from '../data/site'
import { runTransition } from '../lib/transition'
import { device } from '../lib/device'
import { preloadRoute } from '../lib/preload'

export function Nav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const [underline, setUnderline] = useState({ left: 0, width: 0, ready: false })

  const isHero = pathname === '/' && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // slide the gradient underline to the active item
  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const active = list.querySelector<HTMLElement>('[data-active="true"]')
    if (!active) return setUnderline((u) => ({ ...u, width: 0 }))
    setUnderline({ left: active.offsetLeft, width: active.offsetWidth, ready: true })
  }, [pathname])

  const go = (to: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    if (to === pathname) return
    runTransition(to, navigate)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[70] transition-[background-color,backdrop-filter,border-color] duration-500 ${
          isHero
            ? 'border-b border-transparent bg-transparent'
            : 'border-b border-white/10 bg-[#050508]/70 backdrop-blur-xl'
        }`}
      >
        <div className="shell flex h-[68px] items-center justify-between md:h-[76px]">
          <a
            href="/"
            onClick={go('/')}
            className="focus-ring group flex items-center gap-3"
            aria-label={`${site.name} — home`}
          >
            <img
              src="/brand/logo-mark-256.png"
              alt=""
              width={38}
              height={36}
              className="h-[36px] w-auto object-contain transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.08]"
            />
            {/* full lockup — ANANT over SUTRA LABS, as the mark is drawn */}
            <span className="hidden leading-none sm:block">
              <span className="block text-[0.82rem] font-medium uppercase leading-none tracking-[0.3em] text-white">
                Anant
              </span>
              <span className="mt-[3px] block text-[0.5rem] font-medium uppercase leading-none tracking-[0.34em] text-white/55">
                Sutra&nbsp;Labs
              </span>
            </span>
          </a>

          {/* desktop */}
          <nav className="hidden md:block" aria-label="Primary">
            <div ref={listRef} className="relative flex items-center gap-9">
              {nav.map((item) => {
                const active = pathname === item.to
                return (
                  <a
                    key={item.to}
                    href={item.to}
                    data-active={active}
                    onClick={go(item.to)}
                    onMouseEnter={() => preloadRoute(item.to)}
                    onFocus={() => preloadRoute(item.to)}
                    className={`focus-ring t-label relative py-2 transition-colors duration-300 ${
                      active ? 'text-white' : 'text-white/55 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </a>
                )
              })}
              {underline.ready && (
                <motion.span
                  className="absolute -bottom-1 h-px"
                  animate={{ left: underline.left, width: underline.width }}
                  transition={{ type: 'spring', stiffness: 320, damping: 34 }}
                  style={{ background: 'linear-gradient(90deg, #7B4DFF, #22D3EE)' }}
                />
              )}
            </div>
          </nav>

          {/* mobile trigger */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="focus-ring relative z-[76] flex h-10 w-10 items-center justify-center md:hidden"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span className="relative block h-3 w-6">
              <motion.span
                className="absolute left-0 block h-px w-6 bg-white"
                animate={{ top: open ? 6 : 0, rotate: open ? 45 : 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.span
                className="absolute left-0 block h-px w-6 bg-white"
                animate={{ top: open ? 6 : 12, rotate: open ? -45 : 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </span>
          </button>
        </div>
      </header>

      {/* mobile overlay — canvas stays live behind it */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[72] flex flex-col justify-center md:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            style={{ background: 'rgba(5,5,8,0.82)', backdropFilter: 'blur(22px)' }}
          >
            <nav className="shell flex flex-col gap-1" aria-label="Mobile">
              {nav.map((item, i) => (
                <div key={item.to} className="overflow-hidden">
                  <motion.a
                    href={item.to}
                    onClick={go(item.to)}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '110%' }}
                    transition={{
                      duration: 0.7,
                      delay: 0.12 + i * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`block py-2 text-[13vw] font-bold leading-[1.05] tracking-[-0.035em] ${
                      pathname === item.to ? 'grad-text' : 'text-white'
                    }`}
                  >
                    {item.label}
                  </motion.a>
                </div>
              ))}
            </nav>
            <div className="shell mt-12">
              <div className="hair mb-5" />
              <a href={site.instagram.url} target="_blank" rel="noreferrer" className="body-copy text-sm">
                {site.instagram.handle}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
