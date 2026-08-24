import { useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { frameState } from '../lib/frameState'
import { damp } from '../lib/easing'

const vert = /* glsl */ `
  uniform float uBend;     // barrel bend from scroll velocity
  uniform float uHover;
  uniform float uOpen;
  varying vec2 vUv;
  varying float vBend;

  void main() {
    vUv = uv;
    vec3 p = position;

    // barrel: push the center toward camera, edges away
    float d = 1.0 - (uv.x - 0.5) * (uv.x - 0.5) * 4.0;
    p.z += d * (0.55 + uBend * 2.4) * 0.34;

    // vertical bow while scrolling fast
    p.z += sin(uv.y * 3.14159) * uBend * 0.5;

    // lift toward camera on hover / open
    p.z += (uHover * 0.16 + uOpen * 0.9);

    vBend = uBend;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const frag = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uSplit;     // rgb split amount
  uniform float uHover;
  uniform float uGrey;
  uniform float uFade;
  uniform float uTime;
  uniform vec3  uRimA;
  uniform vec3  uRimB;
  varying vec2 vUv;
  varying float vBend;

  void main() {
    vec2 uv = vUv;

    // slight lens pinch so the image sits on a curved surface
    uv.x = 0.5 + (uv.x - 0.5) * (1.0 - vBend * 0.06);

    float s = uSplit;
    vec3 col;
    col.r = texture2D(uMap, uv + vec2( s, 0.0)).r;
    col.g = texture2D(uMap, uv).g;
    col.b = texture2D(uMap, uv + vec2(-s, 0.0)).b;

    // a light lift toward full color on hover — resting state stays close
    // to true color rather than reading as washed out against the black scene
    float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
    col = mix(vec3(lum) * 0.96, col, uHover * (1.0 - uGrey) + (1.0 - uGrey) * 0.86);

    // gradient rim ignites on hover
    float edge = 1.0 - smoothstep(0.0, 0.045, min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y)));
    vec3 rim = mix(uRimA, uRimB, vUv.x + sin(uTime * 0.6) * 0.12);
    col += rim * edge * uHover * 1.5;

    // subtle vignette only — the plane should read as a solid image, not a
    // faded one, so the floor stays high
    float vig = smoothstep(1.15, 0.35, length(vUv - 0.5));
    col *= 0.88 + vig * 0.12;

    gl_FragColor = vec4(col, uFade);
  }
`

export type CardHandle = {
  setHover: (v: number) => void
}

type Props = {
  map: THREE.Texture
  width: number
  height: number
  hovered: boolean
  open: boolean
  dim: number
  onOver: (e: ThreeEvent<PointerEvent>) => void
  onOut: () => void
  onClick: (e: ThreeEvent<MouseEvent>) => void
}

export function CardPlane({ map, width, height, hovered, open, dim, onOver, onOut, onClick }: Props) {
  const mat = useRef<THREE.ShaderMaterial>(null!)

  const uniforms = useMemo(
    () => ({
      uMap: { value: map },
      uSplit: { value: 0 },
      uBend: { value: 0 },
      uHover: { value: 0 },
      uOpen: { value: 0 },
      uGrey: { value: 0 },
      uFade: { value: 1 },
      uTime: { value: 0 },
      uRimA: { value: new THREE.Color('#7B4DFF') },
      uRimB: { value: new THREE.Color('#22D3EE') },
    }),
    [map],
  )

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30)
    const u = uniforms
    u.uTime.value = state.clock.elapsedTime

    // RGB split + bend track scroll velocity, then snap flat when it settles
    const warp = frameState.warp
    u.uSplit.value = damp(u.uSplit.value, Math.min(warp * 0.02, 0.016), 9, delta)
    u.uBend.value = damp(u.uBend.value, Math.min(warp * 0.7, 0.55), 9, delta)
    u.uHover.value = damp(u.uHover.value, hovered ? 1 : 0, 8, delta)
    u.uOpen.value = damp(u.uOpen.value, open ? 1 : 0, 6, delta)
    u.uFade.value = damp(u.uFade.value, 1 - dim * 0.75, 5, delta)
  })

  return (
    // the visible plane is also the hit target — an extra invisible mesh would
    // not be raycast at all
    <mesh onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
      <planeGeometry args={[width, height, 32, 24]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        toneMapped={false}
      />
    </mesh>
  )
}
