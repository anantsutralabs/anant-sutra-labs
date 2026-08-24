# Anant Sutra Labs — WebGL Portfolio Site

Multi-page React + TypeScript site with one **persistent WebGL canvas**. The
canvas is mounted outside the router, so navigating never unmounts it — the
camera flies to a new waypoint in the same continuous 3D space.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview
```

Requires Node 18+.

## How the persistent world works

- `src/three/SceneRoot.tsx` — the single `<Canvas>`, mounted in `App.tsx`
  **outside** `<Routes>`.
- `src/three/LogoMark.tsx` — the brand mark itself, rendered as a luminous
  plane in the scene (not a stand-in 3D object). It appears in the home hero
  only; every inner route culls it. On mobile it re-anchors above the type,
  because a phone viewport is ~2.2 world units wide and the desktop anchor
  would push it off frame.
- `src/three/waypoints.ts` — each route is a camera position + look-at target +
  a `via` control point, plus where the glass logo drifts to.
- `src/three/CameraRig.tsx` — flies along a `CatmullRomCurve3` between
  waypoints. It reads `frameState.route`, never React state, so navigation
  causes zero re-renders in the 3D graph.
- `src/lib/transition.ts` — the 900ms route sequence: wipe in (300ms) →
  navigate under the wipe → wipe retracts. Back/forward plays the retract half.
- `src/lib/frameState.ts` — mutable per-frame values (pointer, scroll velocity,
  warp) shared with shaders. Deliberately **not** React state.

## Content lives in data files

Edit these; never touch layout code:

| File | Contents |
|---|---|
| `src/data/work.ts` | 25 entries — title, category, blurb, format, duration |
| `src/data/pricing.ts` | 5 rate-card tiers, add-ons, working terms |
| `src/data/services.ts` | 7 capabilities + the four home-page stats |
| `src/data/site.ts` | Contact details, nav, spec-work notice |

Media lives in `public/work/video/<id>.mp4` and `public/work/poster/<id>.jpg`,
keyed by the `id` in `work.ts`.

### Categories mirror the production drive

The five filter pills are the five folders in `../WORK`: **Commercial, Fashion,
Micro Drama, Mythology, Short Film**. To add a category, add the folder, then
add it to the `Category` union and the `categories` array in `work.ts`.

An entry with no `video` is treated as in development: it shows its `poster`
plus a `stills` strip of design boards instead of a player. *The Moon Parcel*
uses this — screenplay and design bible are complete, the film is not shot.

## Re-encoding source footage

Masters in `../WORK` were transcoded to web-ready H.264 (faststart) with a
small AVFoundation tool — 1.9 GB of masters → 222 MB of MP4. Posters are pulled
at 28% of each film's duration. If you add a film, drop the master in the right
`../WORK` category folder, encode it to `public/work/video/<id>.mp4`, add a
poster, and append an entry to `src/data/work.ts`.

## Typography

One fluid scale in `src/styles/index.css`, not per-page `vw` values:
`.t-display-xl / -lg / -md / -sm`, `.t-lead`, `.body-copy`, `.eyebrow`,
`.t-label`, `.t-label-sm`. Sizes use `clamp()` so display type neither runs
away on an ultrawide monitor nor collapses on a phone, and tracking tightens as
size grows — one letter-spacing value cannot serve a 128px headline and a 15px
paragraph. Add `.tnum` to anything numeric (prices, durations, counters) so
digits do not jitter as they change.

## Performance & accessibility

`src/lib/device.ts` resolves one profile at boot:

| | High | Low (mobile / weak GPU / reduced-motion) |
|---|---|---|
| Particles | 4,200 | 1,500 |
| Postprocessing | Bloom + aberration + grain + vignette | off |
| DPR cap | 2 | 1.5 |
| Portfolio | 3D arc | flat responsive grid |

The mark appears in the home hero only; on inner routes it is culled entirely
(`logoPresence: 0` in `waypoints.ts`).

The arc fades cards past `VISIBLE_ARC` in `WorkArc.tsx`. Without that, a
catalogue larger than `2π / SPREAD` closes the circle and the last card lands
on top of the first.

- `prefers-reduced-motion` renders static type with no reveal animations.
- Next route's chunk + posters preload on nav hover.
- `useFrame` uses clamped `delta`; geometries are disposed on unmount.

### Two implementation notes worth keeping

1. **`overflow-x: clip`, not `hidden`, on `html`/`body`.** `hidden` makes the
   element a scroll container, which breaks Lenis.
2. **Viewport reveal triggers sit on the outer wrapper.** The inner element
   starts translated past the bottom of its mask, so observing it directly
   reports zero intersected area and the animation never fires.

## Brand assets

`public/brand/` holds only what is used: `logo-mark.png` (hero + preloader),
`logo-mark-256.png` (nav, footer, favicon) and `og-image.png` (social card).
Both marks are alpha-keyed from the black-background originals in `../Logo` —
alpha is derived from luminance, then cropped to the luminous bounds, so the
mark sits on any background without a black box behind it.

## Brand films

Brand pieces in the reel are independent concept work, not commissioned
campaigns. The notice is in `site.ts` and renders in the footer and on the
portfolio page — keep it if you keep those films.
