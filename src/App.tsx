import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useSearchParams } from 'react-router-dom'

import { SceneRoot } from './three/SceneRoot'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Cursor } from './components/Cursor'
import { RouteWipe } from './components/RouteWipe'
import { Preloader, hasVisited } from './components/Preloader'
import { Lightbox } from './components/Lightbox'

import { useLenisScroll } from './lib/useLenis'
import { frameState } from './lib/frameState'
import { runPopTransition } from './lib/transition'
import { device } from './lib/device'
import { work, type WorkItem, type Category } from './data/work'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const Contact = lazy(() => import('./pages/Contact'))

/** Keeps frameState.route in sync however navigation happened. */
function RouteSync() {
  const { pathname } = useLocation()
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      frameState.route = pathname
      return
    }
    // If the wipe controller already set this, it's a no-op; if the change
    // came from back/forward, play the retract half.
    if (frameState.route !== pathname) runPopTransition(pathname)
  }, [pathname])

  return null
}

function Shell({
  openItem,
  setOpenItem,
  setArcItems,
  onEnterPortfolio,
}: {
  openItem: WorkItem | null
  setOpenItem: (i: WorkItem | null) => void
  setArcItems: (i: WorkItem[]) => void
  onEnterPortfolio: () => void
}) {
  useLenisScroll()
  const location = useLocation()
  const [params] = useSearchParams()

  // portfolio filter lives in the URL
  const filter = (params.get('filter') ?? 'all').toLowerCase()

  useEffect(() => {
    if (location.pathname !== '/portfolio') {
      setArcItems(work)
      return
    }
    onEnterPortfolio()
    const next =
      filter === 'all'
        ? work
        : work.filter((w) => w.category.toLowerCase().replace(/\s+/g, '-') === filter)
    setArcItems(next.length ? next : work)
  }, [filter, location.pathname, setArcItems, onEnterPortfolio])

  return (
    <>
      <Nav />
      <main id="main">
        <Suspense key={location.pathname} fallback={<div className="min-h-screen" />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio onOpen={setOpenItem} openItem={openItem} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <Lightbox item={openItem} onClose={() => setOpenItem(null)} />
    </>
  )
}

export default function App() {
  const [ready, setReady] = useState(() => hasVisited())
  const [openItem, setOpenItem] = useState<WorkItem | null>(null)
  const [arcItems, setArcItems] = useState<WorkItem[]>(work)
  const [showArc, setShowArc] = useState(false)

  /**
   * The arc mounts the first time the gallery is visited and then stays
   * mounted for the session, so returning to it costs no texture reload.
   */
  const onEnterPortfolio = useCallback(() => setShowArc(true), [])

  useEffect(() => {
    let raf = 0
    const loop = () => {
      const target = openItem ? 1 : 0
      frameState.focus += (target - frameState.focus) * 0.1
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [openItem])

  const onOpen = useCallback((item: WorkItem) => setOpenItem(item), [])

  return (
    <BrowserRouter>
      {/* the canvas lives outside <Routes> — it never unmounts */}
      <SceneRoot
        arcItems={arcItems}
        onOpen={onOpen}
        openId={openItem?.id ?? null}
        showArc={showArc && !device.flatGallery}
      />

      <RouteSync />
      <Cursor />
      <RouteWipe />

      {!ready && <Preloader onDone={() => setReady(true)} />}

      <Shell
        openItem={openItem}
        setOpenItem={setOpenItem}
        setArcItems={setArcItems}
        onEnterPortfolio={onEnterPortfolio}
      />
    </BrowserRouter>
  )
}
