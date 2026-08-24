/**
 * Mutable per-frame state shared between the DOM layer and the WebGL graph.
 * Deliberately NOT React state: these values change every frame and must never
 * trigger a re-render. Components read them inside useFrame.
 */
export const frameState = {
  /** normalised pointer, -1..1 */
  pointer: { x: 0, y: 0 },
  /** smoothed pointer, used for parallax */
  pointerLerp: { x: 0, y: 0 },
  /** current scroll offset in px */
  scroll: 0,
  /** signed scroll velocity, normalised roughly to -1..1 */
  velocity: 0,
  /** smoothed absolute velocity — drives shader warping */
  warp: 0,
  /** 0..1 progress of the current page's scroll */
  progress: 0,
  /**
   * 0..1 progress through the portfolio scroll runway specifically — NOT
   * the whole page. The arc used to read `progress` directly, which mixes
   * in the header and footer text block's height, so the arc's position
   * drifted out of sync with what was actually on screen. Portfolio.tsx
   * writes this from the runway element's own scroll range.
   */
  arcProgress: 0,
  /** route the camera is flying toward */
  route: '/',
  /** 0..1 camera flight progress; 1 === settled */
  flight: 1,
  /** set while the portfolio lightbox is open — dims + blurs the scene */
  focus: 0,
}

if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      frameState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      frameState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    },
    { passive: true },
  )
}
