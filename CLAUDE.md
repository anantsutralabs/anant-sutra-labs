# CLAUDE.md

Claude Code reads this file automatically at the start of every session in
this repo. It exists so you don't have to re-explain who you are, what the
studio is, and how you like to work, every time.

## Who you are

Naveen Sharma — founder of Anant Sutra Labs. 15 years in animation and
VFX before moving the studio's production pipeline to AI. See
`POSITIONING.md` for the full title/sentence and the reasoning behind it;
the short version:

> **AI Filmmaker.** Fifteen years of VFX, now directing ads and films
> with AI.

## The site

React + TypeScript + React Router, one persistent WebGL canvas across five
routes. Full technical notes live in `README.md`. Content lives in data
files (`src/data/*.ts`) — never hand-edit copy inside layout components.

## Categories (provisional — not yet finalized)

Currently: Commercial, Fashion, Micro Drama, Mythology, Short Film. These
mirror the production drive folders as-is. A deliberate re-pass on
category framing (by outcome vs. by client type, fashion film naming,
credit lines per piece) is a separate, later task — don't restructure this
without being asked.

## Communication preferences

*Not yet established — draft, correct freely.*
- Direct, no padding. Flag problems plainly rather than softening them.
- Confirm before anything irreversible or public-facing (see Netlify
  deploy rule below).

## Current goals

*Not yet established — draft, correct freely.*
- Studio site live at www.anantsutralabs.com, functioning as the
  professional footprint for client + hiring conversations.
- Portfolio, pricing and contact all sourced from real project data — no
  placeholder content shipped to production.

## Rules that don't change

- **Never fabricate case-study content.** Briefs, decisions, results —
  if you don't have the real story from Naveen, ask for it. Don't invent
  client outcomes or creative reasoning on his behalf.
- **Brand-name films in the reel are spec work**, not commissioned. That
  disclaimer stays visible (footer + portfolio page) as long as those
  films are in the reel.
- **Netlify deploys:** always `netlify deploy` (preview) first, let
  Naveen look, then `netlify deploy --prod` only after he confirms.
  Never push to production unasked.
- **Domain:** canonical is `https://www.anantsutralabs.com` — use it
  consistently in meta tags, structured data, sitemap.

## Working folder conventions

- Video masters live in `../WORK` (outside this repo), transcoded copies
  in `public/work/video/`. Never commit a master file.
- One data file per concern (`work.ts`, `pricing.ts`, `services.ts`,
  `site.ts`) — content changes should never require touching layout code.
