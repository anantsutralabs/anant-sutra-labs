import { work } from '../data/work'

const done = new Set<string>()

/** Warms the next route's chunk + its heaviest images on nav hover. */
export function preloadRoute(to: string) {
  const path = to.split('?')[0]
  if (done.has(path)) return
  done.add(path)

  switch (path) {
    case '/portfolio':
      import('../pages/Portfolio')
      work.slice(0, 8).forEach((w) => {
        const img = new Image()
        img.decoding = 'async'
        img.src = w.poster
      })
      break
    case '/about':
      import('../pages/About')
      break
    case '/pricing':
      import('../pages/Pricing')
      break
    case '/contact':
      import('../pages/Contact')
      break
    case '/':
      import('../pages/Home')
      break
  }
}
