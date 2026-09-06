import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

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
import type { WorkItem } from './data/work'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

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
}: {
  openItem: WorkItem | null
  setOpenItem: (i: WorkItem | null) => void
}) {
  useLenisScroll()
  const location = useLocation()

  return (
    <>
      {/* first focusable element on the page — invisible until tabbed to,
          so keyboard users can jump straight past the nav to real content */}
      <a
        href="#main"
        className="focus-ring fixed left-4 top-4 z-[95] -translate-y-24 rounded-full bg-white px-5 py-3 text-[13px] font-medium text-ink transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Suspense key={location.pathname} fallback={<div className="min-h-screen" />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio onOpen={setOpenItem} openItem={openItem} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
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

  return (
    <BrowserRouter>
      {/* the canvas lives outside <Routes> — it never unmounts */}
      <SceneRoot />

      <RouteSync />
      <Cursor />
      <RouteWipe />

      {!ready && <Preloader onDone={() => setReady(true)} />}

      <Shell openItem={openItem} setOpenItem={setOpenItem} />
    </BrowserRouter>
  )
}
