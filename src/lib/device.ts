export type Tier = 'high' | 'low'

export type DeviceProfile = {
  tier: Tier
  isMobile: boolean
  reducedMotion: boolean
  particleCount: number
  postprocessing: boolean
  dpr: [number, number]
  /** portfolio falls back to a flat DOM grid instead of the 3D arc */
  flatGallery: boolean
}

function detect(): DeviceProfile {
  if (typeof window === 'undefined') {
    return { tier: 'high', isMobile: false, reducedMotion: false, particleCount: 4200, postprocessing: true, dpr: [1, 2], flatGallery: false }
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const narrow = window.innerWidth < 1024
  const isMobile = coarse || narrow

  const cores = navigator.hardwareConcurrency ?? 4
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  const weak = cores <= 4 || mem <= 4

  const tier: Tier = isMobile || weak || reducedMotion ? 'low' : 'high'

  return {
    tier,
    isMobile,
    reducedMotion,
    particleCount: tier === 'high' ? 4200 : 1500,
    postprocessing: tier === 'high' && !reducedMotion,
    dpr: tier === 'high' ? [1, 2] : [1, 1.5],
    flatGallery: isMobile || reducedMotion,
  }
}

/** Resolved once at boot — the 3D graph reads this synchronously. */
export const device: DeviceProfile = detect()
