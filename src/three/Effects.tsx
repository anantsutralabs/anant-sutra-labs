import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { frameState } from '../lib/frameState'
import { damp } from '../lib/easing'

export function Effects() {
  const ca = useRef<{ offset: THREE.Vector2 } | null>(null)
  const base = useRef(new THREE.Vector2(0.0006, 0.0006))

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30)
    if (!ca.current) return
    // aberration widens with scroll velocity, settles when you stop
    const t = 0.0006 + Math.min(frameState.warp * 0.004, 0.0035)
    base.current.x = damp(base.current.x, t, 8, delta)
    base.current.y = damp(base.current.y, t * 0.6, 8, delta)
    ca.current.offset.set(base.current.x, base.current.y)
  })

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={0.62}
        luminanceThreshold={0.3}
        luminanceSmoothing={0.5}
        mipmapBlur
        radius={0.7}
      />
      <ChromaticAberration
        ref={ca as never}
        offset={new THREE.Vector2(0.0006, 0.0006)}
        radialModulation={false}
        modulationOffset={0}
      />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.14} />
      <Vignette eskil={false} offset={0.24} darkness={0.72} />
    </EffectComposer>
  )
}
