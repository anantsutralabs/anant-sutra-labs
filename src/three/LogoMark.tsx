import { useMemo, useRef } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { frameState } from '../lib/frameState'
import { waypointFor } from './waypoints'
import { damp } from '../lib/easing'
import { device } from '../lib/device'

/**
 * The Anant Sutra Labs mark itself, rendered as a luminous plane in the scene
 * rather than a stand-in 3D object — the brand artwork is the hero.
 *
 * It still lives in the WebGL layer so it keeps the particle field behind it,
 * picks up bloom, parallaxes with the pointer and reacts to scroll velocity.
 */
/**
 * A phone viewport is only ~2.2 world units wide, so the desktop hero anchor
 * (offset right of the headline) pushes the mark clean off frame. On mobile it
 * centres and sits above the type instead.
 */
const MOBILE_HERO_ANCHOR = new THREE.Vector3(0, 1.28, 0)

export function LogoMark() {
  const group = useRef<THREE.Group>(null!)
  const markRef = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)
  const presence = useRef(1)
  const anchor = useRef(new THREE.Vector3())

  const { gl } = useThree()
  const map = useLoader(THREE.TextureLoader, '/brand/logo-mark.png')

  useMemo(() => {
    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
    map.generateMipmaps = true
    map.minFilter = THREE.LinearMipmapLinearFilter
  }, [map, gl])

  const aspect = 1024 / 964

  // soft radial bloom seed behind the mark
  const glowTex = useMemo(() => {
    const s = 256
    const c = document.createElement('canvas')
    c.width = c.height = s
    const ctx = c.getContext('2d')!
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
    g.addColorStop(0, 'rgba(124,96,235,0.34)')
    g.addColorStop(0.28, 'rgba(88,80,200,0.13)')
    g.addColorStop(0.6, 'rgba(60,70,150,0.03)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, s, s)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30)
    const t = state.clock.elapsedTime
    const wp = waypointFor(frameState.route)

    presence.current = damp(presence.current, wp.logoPresence, 2.2, delta)
    const p = presence.current

    // culled entirely on inner routes — nothing to draw, nothing to cost
    group.current.visible = p > 0.02
    if (!group.current.visible) return

    const target = device.isMobile && frameState.route === '/' ? MOBILE_HERO_ANCHOR : wp.logoAnchor
    anchor.current.lerp(target, 1 - Math.exp(-2 * delta))

    const warp = frameState.warp
    const px = device.reducedMotion ? 0 : frameState.pointerLerp.x
    const py = device.reducedMotion ? 0 : frameState.pointerLerp.y

    group.current.position.set(
      anchor.current.x + px * 0.16,
      anchor.current.y + Math.sin(t * 0.4) * 0.08 + py * 0.1,
      anchor.current.z,
    )

    // a whisper of tilt so it reads as an object in space, not a sticker
    group.current.rotation.y = px * 0.075 + Math.sin(t * 0.19) * 0.02
    group.current.rotation.x = -py * 0.05 + Math.sin(t * 0.23) * 0.014

    const base = (device.isMobile ? 1.95 : 3.15) * (0.6 + p * 0.4)
    group.current.scale.setScalar(base * (1 + warp * 0.05))

    const mat = markRef.current.material as THREE.MeshBasicMaterial
    mat.opacity = p * (0.94 + Math.sin(t * 0.7) * 0.045 + warp * 0.06)

    const gm = glowRef.current.material as THREE.MeshBasicMaterial
    gm.opacity = p * (0.26 + Math.sin(t * 0.5) * 0.04 + warp * 0.07)
    glowRef.current.scale.setScalar(1.65 + Math.sin(t * 0.33) * 0.06)
  })

  return (
    <group ref={group}>
      <mesh ref={glowRef} position={[0, 0, -0.35]} scale={1.65}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={glowTex}
          transparent
          opacity={0.26}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={markRef}>
        <planeGeometry args={[aspect, 1]} />
        <meshBasicMaterial
          map={map}
          transparent
          opacity={0.95}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}
