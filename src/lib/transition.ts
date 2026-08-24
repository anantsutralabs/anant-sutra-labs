import { useSyncExternalStore } from 'react'
import { frameState } from './frameState'

/**
 * Route transition controller.
 *
 * One motion, 900ms:
 *   0ms    wipe sweeps in (300ms)
 *   300ms  navigate happens under the wipe; camera begins its flight
 *   380ms  wipe retracts (320ms)
 *   900ms  settled
 *
 * The camera flight itself is owned by CameraRig, which simply reads
 * `frameState.route`. That keeps the WebGL layer decoupled from the router.
 */

export const WIPE_IN = 300
export const WIPE_HOLD = 80
export const WIPE_OUT = 320

export type WipePhase = 'idle' | 'in' | 'out'

type State = { phase: WipePhase; pending: string | null; token: number }

let state: State = { phase: 'idle', pending: null, token: 0 }
const listeners = new Set<() => void>()

const emit = () => listeners.forEach((l) => l())
const set = (next: Partial<State>) => {
  state = { ...state, ...next }
  emit()
}

export const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}
export const getSnapshot = () => state

export const useTransition = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

let timers: number[] = []
const clearTimers = () => {
  timers.forEach(clearTimeout)
  timers = []
}

/**
 * Drives the wipe and hands the actual navigation back to the caller at the
 * moment the screen is fully covered.
 */
export function runTransition(to: string, navigate: (to: string) => void, instant = false) {
  if (instant) {
    navigate(to)
    frameState.route = to.split('?')[0]
    return
  }

  clearTimers()
  const token = state.token + 1
  set({ phase: 'in', pending: to, token })

  timers.push(
    window.setTimeout(() => {
      if (state.token !== token) return
      navigate(to)
      frameState.route = to.split('?')[0]
      window.scrollTo(0, 0)
    }, WIPE_IN),
  )

  timers.push(
    window.setTimeout(() => {
      if (state.token !== token) return
      set({ phase: 'out', pending: null })
    }, WIPE_IN + WIPE_HOLD),
  )

  timers.push(
    window.setTimeout(() => {
      if (state.token !== token) return
      set({ phase: 'idle' })
    }, WIPE_IN + WIPE_HOLD + WIPE_OUT),
  )
}

/** Back/forward: the URL already changed, so play the retract half only. */
export function runPopTransition(to: string) {
  clearTimers()
  const token = state.token + 1
  frameState.route = to.split('?')[0]
  set({ phase: 'out', pending: null, token })
  timers.push(
    window.setTimeout(() => {
      if (state.token !== token) return
      set({ phase: 'idle' })
    }, WIPE_OUT),
  )
}
