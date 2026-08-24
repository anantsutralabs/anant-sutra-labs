import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { frameState } from './frameState'
import { device } from './device'

let lenis: Lenis | null = null
export const getLenis = () => lenis

/**
 * One Lenis instance for the app lifetime, reset on each route change.
 * It drives frameState.velocity, which shaders read as a warp amount.
 */
export function useLenisScroll() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (device.reducedMotion) return

    const instance = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    })
    lenis = instance

    let raf = 0
    const loop = (time: number) => {
      instance.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onScroll = ({ scroll, velocity, progress }: { scroll: number; velocity: number; progress: number }) => {
      frameState.scroll = scroll
      frameState.velocity = Math.max(-3, Math.min(3, velocity / 40))
      frameState.progress = progress
    }
    instance.on('scroll', onScroll)

    return () => {
      cancelAnimationFrame(raf)
      instance.destroy()
      if (lenis === instance) lenis = null
    }
  }, [])

  // reset scroll position + internal state whenever the route changes
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true })
    frameState.scroll = 0
    frameState.velocity = 0
    frameState.progress = 0
  }, [pathname])
}
