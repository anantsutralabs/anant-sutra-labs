import { site, nav } from '../data/site'
import { PageLink } from './PageLink'
import { HairRule } from './Reveal'

export function Footer() {
  return (
    <footer className="relative z-10 mt-32 pb-10">
      <div className="shell">
        <HairRule className="mb-10" />

        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/brand/logo-mark-256.png"
              alt=""
              width={44}
              height={41}
              className="h-11 w-auto object-contain"
            />
            <div>
              <p className="t-label text-[0.8rem] tracking-[0.22em]">Anant Sutra Labs</p>
              <p className="mt-1 text-xs text-faint">{site.tagline}</p>
            </div>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
            {nav.map((item) => (
              <PageLink
                key={item.to}
                to={item.to}
                className="focus-ring t-label text-white/55 transition-colors duration-300 hover:text-white"
              >
                {item.label}
              </PageLink>
            ))}
          </nav>

          <div className="t-label flex flex-col gap-2">
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noreferrer"
              className="focus-ring text-cyan-soft transition-opacity duration-300 hover:opacity-70"
            >
              Instagram ↗
            </a>
            <a
              href={`mailto:${site.email}`}
              className="focus-ring text-white/55 transition-colors duration-300 hover:text-white"
            >
              Email
            </a>
          </div>
        </div>

        <HairRule className="mt-10" />

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <p className="max-w-[62ch] text-[11px] leading-relaxed text-faint">{site.specNotice}</p>
          <p className="shrink-0 text-[11px] tracking-wide text-faint">
            © {site.year} {site.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
