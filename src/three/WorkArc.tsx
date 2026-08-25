import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { CardPlane } from './CardPlane'
import { work, type WorkItem } from '../data/work'
import { frameState } from '../lib/frameState'
import { damp, clamp } from '../lib/easing'
import { waypoints } from './waypoints'

const CENTER = waypoints['/portfolio'].target
const RADIUS = 8.0
/** spacing must exceed the widest card (2.36:1 scope) so frames never overlap */
const SPREAD = 0.415 // radians between cards
/** Cards beyond this angle fade out. Without it the arc closes on itself once
 *  the catalog passes ~2π/SPREAD entries and the last card lands on top of
 *  the first. */
const VISIBLE_ARC = 1.45
const FADE_FROM = 0.95
const CARD_H = 1.85
/** drops the arc below the page header so type and film never collide */
const ARC_Y = -1.05

/** Vertical scroll drives travel along the arc. */
export function WorkArc({
  items,
  onOpen,
  openId,
}: {
  items: WorkItem[]
  onOpen: (item: WorkItem) => void
  openId: string | null
}) {
  const group = useRef<THREE.Group>(null!)
  const [hover, setHover] = useState<string | null>(null)
  const scrollT = useRef(0)
  const { gl } = useThree()

  const posters = useTexture(work.map((w) => w.poster))
  const texMap = useMemo(() => {
    const m = new Map<string, THREE.Texture>()
    work.forEach((w, i) => {
      const t = posters[i]
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
      m.set(w.id, t)
    })
    return m
  }, [posters, gl])

  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : ''
    return () => {
      document.body.style.cursor = ''
    }
  }, [hover])

  // per-card animated angle, so filtering re-flows the arc with a spring
  const angles = useRef(new Map<string, number>())
  const visible = useRef(new Map<string, number>())

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30)

    // page scroll → arc rotation
    const span = Math.max(1, items.length - 1)
    scrollT.current = damp(scrollT.current, frameState.arcProgress * span, 5, delta)

    // A thin category (e.g. two Fashion films) spread across the same
    // SPREAD used for the full 25-film catalog reads as an empty arc with
    // two cards lost in it — tighten the spacing when there's little to show.
    const spread = items.length <= 2 ? SPREAD * 0.55 : items.length <= 4 ? SPREAD * 0.75 : SPREAD

    const target = new Map<string, number>()
    items.forEach((it, i) => target.set(it.id, (i - scrollT.current) * spread))

    group.current.children.forEach((child) => {
      const id = child.userData.id as string
      const idx = items.findIndex((i) => i.id === id)
      const isIn = idx !== -1

      // spring the angle toward its new slot (or park it off to the side)
      const wanted = isIn ? target.get(id)! : (angles.current.get(id) ?? 0) + 0.9
      const a = damp(angles.current.get(id) ?? wanted, wanted, 6, delta)
      angles.current.set(id, a)

      // fade toward the ends of the visible arc rather than wrapping around
      const edge = 1 - THREE.MathUtils.smoothstep(Math.abs(a), FADE_FROM, VISIBLE_ARC)
      const vis = damp(visible.current.get(id) ?? 0, isIn ? edge : 0, 7, delta)
      visible.current.set(id, vis)

      // place on the arc, facing the camera at the center
      child.position.set(
        CENTER.x + Math.sin(a) * RADIUS,
        CENTER.y + ARC_Y + Math.sin(a * 1.7) * 0.18,
        CENTER.z - RADIUS + Math.cos(a) * RADIUS,
      )
      child.rotation.y = -a

      const isOpen = openId === id
      const near = 1 - clamp(Math.abs(a) / (SPREAD * 4))
      const s = (0.72 + near * 0.28) * vis * (isOpen ? 1.18 : 1)
      child.scale.setScalar(Math.max(0.0001, s))
      child.visible = vis > 0.01

      // tilt toward the cursor in 3D on hover
      const isHover = hover === id
      const tx = isHover ? -frameState.pointerLerp.y * 0.22 : 0
      const tz = isHover ? frameState.pointerLerp.x * 0.12 : 0
      child.rotation.x = damp(child.rotation.x, tx, 8, delta)
      child.rotation.z = damp(child.rotation.z, tz, 8, delta)
    })
  })

  return (
    <group ref={group}>
      {work.map((item) => {
        const tex = texMap.get(item.id)!
        const h = CARD_H
        const w = h * item.aspect
        return (
          <group key={item.id} userData={{ id: item.id }}>
            <CardPlane
              map={tex}
              width={w}
              height={h}
              hovered={hover === item.id}
              open={openId === item.id}
              dim={openId ? (openId === item.id ? 0 : 1) : 0}
              onOver={(e) => {
                e.stopPropagation()
                setHover(item.id)
              }}
              onOut={() => setHover((h2) => (h2 === item.id ? null : h2))}
              onClick={(e) => {
                e.stopPropagation()
                onOpen(item)
              }}
            />
          </group>
        )
      })}
    </group>
  )
}
