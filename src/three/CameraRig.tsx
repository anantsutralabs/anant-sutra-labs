import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { waypointFor } from './waypoints'
import { frameState } from '../lib/frameState'
import { easeInOutQuint, damp } from '../lib/easing'
import { device } from '../lib/device'

const FLIGHT = 0.95 // seconds

/**
 * Flies the camera between route waypoints along a CatmullRom curve.
 * Reads frameState.route, so it never re-renders on navigation.
 */
export function CameraRig() {
  const { camera } = useThree()

  const from = useRef(new THREE.Vector3().copy(waypointFor('/').position))
  const fromTarget = useRef(new THREE.Vector3().copy(waypointFor('/').target))
  const curve = useRef<THREE.CatmullRomCurve3 | null>(null)
  const t = useRef(1)
  const currentRoute = useRef(frameState.route)
  const lookAt = useRef(new THREE.Vector3().copy(waypointFor('/').target))
  const parallax = useRef(new THREE.Vector3())

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30)

    // ── new route? build a fresh flight path ────────────────────
    if (frameState.route !== currentRoute.current) {
      const wp = waypointFor(frameState.route)
      from.current.copy(camera.position).sub(parallax.current)
      fromTarget.current.copy(lookAt.current)
      curve.current = new THREE.CatmullRomCurve3(
        [from.current.clone(), wp.via.clone(), wp.position.clone()],
        false,
        'catmullrom',
        0.5,
      )
      t.current = 0
      currentRoute.current = frameState.route
    }

    const wp = waypointFor(currentRoute.current)

    // ── advance the flight ──────────────────────────────────────
    if (t.current < 1 && curve.current) {
      t.current = Math.min(1, t.current + delta / FLIGHT)
      const e = easeInOutQuint(t.current)
      const p = curve.current.getPoint(e)
      camera.position.copy(p)
      lookAt.current.lerpVectors(fromTarget.current, wp.target, e)
    } else {
      camera.position.copy(wp.position)
      lookAt.current.copy(wp.target)
    }
    frameState.flight = t.current

    // ── pointer parallax, layered on top of the flight ──────────
    const fs = frameState
    fs.pointerLerp.x = damp(fs.pointerLerp.x, fs.pointer.x, 3.5, delta)
    fs.pointerLerp.y = damp(fs.pointerLerp.y, fs.pointer.y, 3.5, delta)
    const amp = device.reducedMotion ? 0 : 0.32 * (1 - fs.focus * 0.8)
    parallax.current.set(fs.pointerLerp.x * amp, fs.pointerLerp.y * amp * 0.6, 0)
    camera.position.add(parallax.current)

    camera.lookAt(lookAt.current)

    // ── smoothed warp value shared with every shader ────────────
    fs.warp = damp(fs.warp, Math.abs(fs.velocity), 6, delta)
    fs.velocity *= Math.pow(0.0001, delta) // decay when Lenis stops emitting
  })

  return null
}
