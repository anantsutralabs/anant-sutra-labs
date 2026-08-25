import { useEffect, useRef } from 'react'
import { device } from '../lib/device'

/**
 * Ring cursor with a trailing distortion blob.
 * The blob is a blurred, screen-blended gradient that lags the ring — it reads
 * as a light smear over the WebGL layer without costing a second canvas.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const blob = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (device.isMobile || device.reducedMotion) return
    document.body.classList.add('has-cursor')

    const target = { x: innerWidth / 2, y: innerHeight / 2 }
    const r = { x: target.x, y: target.y }
    const b = { x: target.x, y: target.y }
    let scale = 1
    let targetScale = 1
    let raf = 0

    const isInteractive = (el: Element | null) =>
      !!el?.closest('a, button, [data-cursor="hover"], input, textarea, select, label')

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      targetScale = isInteractive(e.target as Element) ? 1.85 : 1
    }
    const onDown = () => (targetScale *= 0.78)
    const onUp = () => (targetScale = Math.abs(targetScale) / 0.78)

    addEventListener('pointermove', onMove, { passive: true })
    addEventListener('pointerdown', onDown, { passive: true })
    addEventListener('pointerup', onUp, { passive: true })

    const loop = () => {
      r.x += (target.x - r.x) * 0.20
      r.y += (target.y - r.y) * 0.20
      b.x += (target.x - b.x) * 0.085
      b.y += (target.y - b.y) * 0.085
      scale += (targetScale - scale) * 0.14

      if (ring.current)
        ring.current.style.transform = `translate3d(${r.x}px, ${r.y}px, 0) translate(-50%,-50%) scale(${scale})`
      if (dot.current)
        dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%,-50%)`
      if (blob.current) {
        const stretch = Math.min(1.7, 1 + Math.hypot(target.x - b.x, target.y - b.y) * 0.006)
        blob.current.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) translate(-50%,-50%) scale(${stretch}, ${2 - stretch})`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('pointermove', onMove)
      removeEventListener('pointerdown', onDown)
      removeEventListener('pointerup', onUp)
      document.body.classList.remove('has-cursor')
    }
  }, [])

  if (device.isMobile || device.reducedMotion) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[90]" aria-hidden="true">
      <div
        ref={blob}
        className="absolute left-0 top-0 h-[220px] w-[220px] rounded-full opacity-40"
        style={{
          background:
            'radial-gradient(circle, rgba(123,77,255,0.42) 0%, rgba(34,211,238,0.18) 42%, transparent 68%)',
          filter: 'blur(26px)',
          mixBlendMode: 'screen',
        }}
      />
      <div
        ref={ring}
        className="absolute left-0 top-0 h-8 w-8 rounded-full border"
        style={{ borderColor: 'rgba(255,255,255,0.55)', mixBlendMode: 'difference' }}
      />
      <div
        ref={dot}
        className="absolute left-0 top-0 h-1 w-1 rounded-full bg-white"
        style={{ mixBlendMode: 'difference' }}
      />
    </div>
  )
}
