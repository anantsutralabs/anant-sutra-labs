export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const easeOutExpo   = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))
export const easeOutCubic  = (t: number) => 1 - Math.pow(1 - t, 3)
export const easeInOutQuint = (t: number) => (t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2)
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt))
/** cubic-bezier matching the CSS easing used across the DOM layer */
export const EASE = [0.16, 1, 0.3, 1] as const
