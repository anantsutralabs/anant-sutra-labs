import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { frameState } from '../lib/frameState'
import { waypointFor } from './waypoints'

/** Two lights, violet and cyan, orbiting whatever the camera is looking at. */
export function OrbitLights() {
  const a = useRef<THREE.PointLight>(null!)
  const b = useRef<THREE.PointLight>(null!)
  const centre = useRef(new THREE.Vector3())

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30)
    const t = state.clock.elapsedTime
    const wp = waypointFor(frameState.route)
    centre.current.lerp(wp.target, 1 - Math.exp(-2.5 * delta))
    const c = centre.current

    a.current.position.set(
      c.x + Math.cos(t * 0.34) * 4.2,
      c.y + Math.sin(t * 0.27) * 2.6,
      c.z + Math.sin(t * 0.34) * 3.4 + 1.5,
    )
    b.current.position.set(
      c.x + Math.cos(t * 0.34 + Math.PI) * 4.6,
      c.y + Math.sin(t * 0.31 + Math.PI) * 2.2,
      c.z + Math.sin(t * 0.34 + Math.PI) * 3.0 + 1.0,
    )

    const boost = 1 + frameState.warp * 1.4
    a.current.intensity = 26 * boost
    b.current.intensity = 22 * boost
  })

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight ref={a} color="#7B4DFF" intensity={26} distance={26} decay={1.6} />
      <pointLight ref={b} color="#22D3EE" intensity={22} distance={26} decay={1.6} />
      <directionalLight position={[3, 6, 8]} intensity={0.5} color="#cfd4ff" />
    </>
  )
}
