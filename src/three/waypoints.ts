import * as THREE from 'three'

/**
 * The scene is one continuous space. Each route is a place inside it, not a
 * new page. `via` is the mid control point the camera arcs through, which is
 * what keeps a navigation reading as a flight rather than a cut.
 */
export type Waypoint = {
  position: THREE.Vector3
  target: THREE.Vector3
  /** mid control point for the CatmullRom flight path */
  via: THREE.Vector3
  /** how strongly the logo object is lit / scaled at this stop */
  logoPresence: number
  /** where the glass mark drifts to for this stop — it follows the camera
   *  around the world rather than being abandoned at the origin */
  logoAnchor: THREE.Vector3
}

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)

export const waypoints: Record<string, Waypoint> = {
  // Hero — the glass mark is centred and dominant.
  '/': {
    position: V(0, 0, 6.2),
    target: V(0, 0, 0),
    via: V(1.6, 1.2, 8.4),
    logoPresence: 1,
    logoAnchor: V(1.5, 0.42, 0),
  },
  // A quieter, darker pocket. No object here — type carries the page.
  '/about': {
    position: V(14, -1.6, 4.2),
    target: V(16.5, -1.2, -1.5),
    via: V(7.5, 2.4, 7.5),
    logoPresence: 0,
    logoAnchor: V(19.5, -0.4, -15),
  },
  // The gallery. Camera sits inside the arc of work; nothing else in frame.
  '/portfolio': {
    position: V(-13.5, 0.4, 7.0),
    target: V(-13.5, 0.2, 0),
    via: V(-6.5, 4.5, 10.5),
    logoPresence: 0,
    logoAnchor: V(-13.5, 4.6, -14),
  },
  // Rate card — a shelf of light, camera slightly above.
  '/pricing': {
    position: V(2.5, 13.5, 6.4),
    target: V(2.5, 13.0, 0),
    via: V(3.5, 6.5, 11.0),
    logoPresence: 0,
    logoAnchor: V(4.5, 14.6, -10),
  },
  // Wide open dark space; the mark reappears far away, slowly rotating.
  '/contact': {
    position: V(-3.0, -13.5, 8.0),
    target: V(-2.0, -13.2, 0),
    via: V(-2.0, -6.0, 13.0),
    logoPresence: 0,
    logoAnchor: V(2.6, -13.4, -6.5),
  },
}

export const waypointFor = (path: string): Waypoint =>
  waypoints[path] ?? waypoints['/']

/** Where the glass logo object physically lives in the world. */
export const LOGO_ORIGIN = V(0, 0, 0)
