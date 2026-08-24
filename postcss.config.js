import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// Resolve the Tailwind config explicitly: PostCSS otherwise looks it up from
// process.cwd(), which breaks whenever vite is started from another directory.
const here = dirname(fileURLToPath(import.meta.url))

export default {
  plugins: {
    tailwindcss: { config: join(here, 'tailwind.config.js') },
    autoprefixer: {},
  },
}
