import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// Anchor content globs to this file rather than process.cwd(), so the dev
// server works no matter which directory vite was launched from.
const here = dirname(fileURLToPath(import.meta.url))

/** @type {import('tailwindcss').Config} */
export default {
  content: [join(here, 'index.html'), join(here, 'src/**/*.{ts,tsx}')],
  theme: {
    extend: {
      colors: {
        ink:    '#050508',
        ink2:   '#08080d',
        violet: { DEFAULT: '#7B4DFF', soft: '#B79CFF' },
        cyan:   { DEFAULT: '#22D3EE', soft: '#8FEAF5' },
        gold:   '#E9B85E',
        muted:  '#918DA3',
        faint:  '#6C6880',
      },
      fontFamily: { sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'] },
      maxWidth: { shell: '1280px' },
    },
  },
  plugins: [],
}
