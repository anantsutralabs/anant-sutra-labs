import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { frameState } from '../lib/frameState'
import { damp } from '../lib/easing'

const vert = /* glsl */ `
  uniform float uTime;
  uniform float uWarp;
  uniform float uVelocity;
  uniform vec2  uPointer;
  uniform float uSize;

  attribute float aScale;
  attribute float aSpeed;
  attribute vec3  aTint;

  varying vec3  vTint;
  varying float vFade;

  void main() {
    vec3 p = position;

    // slow ambient drift
    p.y += sin(uTime * aSpeed * 0.4 + p.x * 0.35) * 0.35;
    p.x += cos(uTime * aSpeed * 0.3 + p.z * 0.3) * 0.28;

    // scroll velocity streaks the field along its travel axis
    p.y -= uVelocity * (2.4 + aScale * 5.0);

    // parallax toward the pointer, depth-weighted
    float depth = clamp((p.z + 22.0) / 44.0, 0.0, 1.0);
    p.x += uPointer.x * (1.0 - depth) * 2.4;
    p.y += uPointer.y * (1.0 - depth) * 1.7;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // stretch points into streaks while scrolling fast
    float streak = 1.0 + uWarp * 3.0;
    gl_PointSize = uSize * aScale * streak * (14.0 / -mv.z);

    vTint = aTint;
    vFade = smoothstep(46.0, 6.0, -mv.z);
  }
`

const frag = /* glsl */ `
  varying vec3  vTint;
  varying float vFade;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    float glow = pow(core, 3.0);
    gl_FragColor = vec4(vTint * (glow * 1.15 + core * 0.12), (glow * 0.62 + core * 0.06) * vFade);
  }
`

const VIOLET = new THREE.Color('#7B4DFF')
const CYAN = new THREE.Color('#22D3EE')
const WHITE = new THREE.Color('#E7E5F0')

export function Particles({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null!)
  const smoothVel = useRef(0)

  const { geometry, uniforms } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const scale = new Float32Array(count)
    const speed = new Float32Array(count)
    const tint = new Float32Array(count * 3)
    const c = new THREE.Color()

    for (let i = 0; i < count; i++) {
      // a wide slab of space that covers every waypoint
      pos[i * 3 + 0] = (Math.random() - 0.5) * 46
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40
      pos[i * 3 + 2] = (Math.random() - 0.5) * 34 - 4

      scale[i] = 0.28 + Math.pow(Math.random(), 3.0) * 1.25
      speed[i] = 0.4 + Math.random() * 1.5

      // mostly dim white dust; colour is the exception, not the rule
      const r = Math.random()
      c.copy(r < 0.20 ? VIOLET : r < 0.34 ? CYAN : WHITE)
      c.lerp(WHITE, 0.25)
      c.multiplyScalar(0.16 + Math.pow(Math.random(), 2.4) * 0.62)
      tint[i * 3 + 0] = c.r
      tint[i * 3 + 1] = c.g
      tint[i * 3 + 2] = c.b
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aScale', new THREE.BufferAttribute(scale, 1))
    g.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1))
    g.setAttribute('aTint', new THREE.BufferAttribute(tint, 3))

    return {
      geometry: g,
      uniforms: {
        uTime: { value: 0 },
        uWarp: { value: 0 },
        uVelocity: { value: 0 },
        uPointer: { value: new THREE.Vector2() },
        uSize: { value: 13 },
      },
    }
  }, [count])

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30)
    uniforms.uTime.value = state.clock.elapsedTime
    smoothVel.current = damp(smoothVel.current, frameState.velocity, 5, delta)
    uniforms.uVelocity.value = smoothVel.current
    uniforms.uWarp.value = frameState.warp
    uniforms.uPointer.value.set(frameState.pointerLerp.x, frameState.pointerLerp.y)
  })

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
