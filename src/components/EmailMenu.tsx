import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { site } from '../data/site'

/**
 * Wraps its trigger content in a button that opens a picker instead of a
 * bare `mailto:` link. A plain mailto hands the click to whatever the OS
 * considers the default mail client — on a machine with none configured
 * (the common case now) that's a first-run account-setup dialog, not an
 * email. This lets the visitor pick a real destination instead.
 */

const encoded = encodeURIComponent(site.email)

const providers = [
  { name: 'Gmail', href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encoded}` },
  { name: 'Outlook', href: `https://outlook.live.com/mail/0/deeplink/compose?to=${encoded}` },
  { name: 'Default mail app', href: `mailto:${site.email}` },
]

export function EmailMenu({ children, className }: { children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const panel = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    restoreFocus.current = document.activeElement as HTMLElement
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    addEventListener('keydown', onKey)
    const t = setTimeout(() => panel.current?.focus(), 50)
    return () => {
      clearTimeout(t)
      removeEventListener('keydown', onKey)
      restoreFocus.current?.focus?.()
    }
  }, [open])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard blocked by browser permissions — address is still shown in the panel
    }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            data-ui
            className="fixed inset-0 z-[90] flex items-center justify-center p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
            role="dialog"
            aria-modal="true"
            aria-label="Choose how to email us"
          >
            <div
              className="absolute inset-0 bg-[#050508]/85 backdrop-blur-xl"
              onClick={() => setOpen(false)}
            />

            <motion.div
              ref={panel}
              tabIndex={-1}
              className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#0a0a10] p-6 outline-none"
              initial={{ y: 16, scale: 0.97, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 10, scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="eyebrow">Email us</span>
              <p className="mt-3 break-all text-[15px] text-white/85">{site.email}</p>

              <div className="mt-6 flex flex-col gap-2">
                {providers.map((p) => (
                  <a
                    key={p.name}
                    href={p.href}
                    target={p.name === 'Default mail app' ? undefined : '_blank'}
                    rel="noreferrer"
                    onClick={() => setOpen(false)}
                    className="focus-ring flex items-center justify-between rounded-lg border border-white/10 px-4 py-3 text-sm transition-colors duration-300 hover:border-white/25 hover:bg-white/5"
                  >
                    {p.name}
                    <span className="text-faint">→</span>
                  </a>
                ))}
                <button
                  type="button"
                  onClick={copyEmail}
                  className="focus-ring flex items-center justify-between rounded-lg border border-white/10 px-4 py-3 text-left text-sm transition-colors duration-300 hover:border-white/25 hover:bg-white/5"
                >
                  {copied ? 'Copied' : 'Copy email address'}
                  {copied && <span className="text-cyan-soft">✓</span>}
                </button>
              </div>

              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="focus-ring absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/5 hover:text-white"
              >
                <span aria-hidden="true" className="text-xl leading-none">×</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
