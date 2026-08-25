import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CameraRig } from './CameraRig'
import { LogoMark } from './LogoMark'
import { Particles } from './Particles'
import { OrbitLights } from './OrbitLights'
import { Effects } from './Effects'
import { WorkArc } from './WorkArc'
import { device } from '../lib/device'
import { frameState } from '../lib/frameState'
import { damp } from '../lib/easing'
import type { WorkItem } from '../data/work'

/** Fog + exposure react to the lightbox focus state. */
function Atmosphere() {
  const { current: fog } = useRef(new THREE.FogExp2('#050508', 0.028))
  useFrame(({ scene, gl }, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30)
    scene.fog = fog
    fog.density = damp(fog.density, 0.028 + frameState.focus * 0.055, 4, delta)
    gl.toneMappingExposure = damp(gl.toneMappingExposure, 1 - frameState.focus * 0.55, 4, delta)
  })
  return null
}

export type SceneProps = {
  arcItems: WorkItem[]
  onOpen: (item: WorkItem) => void
  openId: string | null
  showArc: boolean
}

/**
 * The one persistent canvas. Mounted outside the router in App, so it survives
 * every navigation — the camera simply flies somewhere else.
 */
export function SceneRoot({ arcItems, onOpen, openId, showArc }: SceneProps) {
  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <Canvas
        aria-label="Decorative animated background"
        dpr={device.dpr}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: true,
        }}
        camera={{ fov: 42, near: 0.1, far: 90, position: [0, 0, 6.2] }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor('#050508', 1)
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.outputColorSpace = THREE.SRGBColorSpace
          scene.background = new THREE.Color('#050508')
        }}
      >
        <Atmosphere />
        <CameraRig />
        <OrbitLights />

        <Suspense fallback={null}>
          <LogoMark />
        </Suspense>

        <Particles count={device.particleCount} />

        {showArc && (
          <Suspense fallback={null}>
            <WorkArc items={arcItems} onOpen={onOpen} openId={openId} />
          </Suspense>
        )}

        {device.postprocessing && <Effects />}
      </Canvas>
    </div>
  )
}
