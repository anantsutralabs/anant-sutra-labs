import { useState } from 'react'
import { SplitText } from '../components/SplitText'
import { Reveal, HairRule } from '../components/Reveal'
import { Magnetic } from '../components/Magnetic'
import { site } from '../data/site'
import { services } from '../data/services'

/** Hairline-underline field with a gradient underline that animates on focus. */
function Field({
  label,
  name,
  type = 'text',
  required,
  value,
  onChange,
  as = 'input',
  children,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  value: string
  onChange: (v: string) => void
  as?: 'input' | 'textarea' | 'select'
  children?: React.ReactNode
}) {
  const shared =
    'peer w-full appearance-none border-0 border-b border-white/15 bg-transparent px-0 py-3.5 text-[15px] outline-none transition-colors duration-500 placeholder:text-faint focus:border-white/15'

  return (
    <label className="group relative block">
      <span className="t-label-sm text-faint">{label}</span>
      <span className="relative mt-1 block">
        {as === 'textarea' ? (
          <textarea
            name={name}
            required={required}
            rows={4}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${shared} resize-none`}
          />
        ) : as === 'select' ? (
          <select
            name={name}
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${shared} cursor-pointer`}
          >
            {children}
          </select>
        ) : (
          <input
            name={name}
            type={type}
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={shared}
          />
        )}
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] peer-focus:scale-x-100"
          style={{ background: 'linear-gradient(90deg, #7B4DFF, #22D3EE)' }}
        />
      </span>
    </label>
  )
}

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [project, setProject] = useState(services[1].title)
  const [message, setMessage] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = `New project enquiry — ${project}`
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Project type: ${project}`,
      '',
      message,
    ].join('\n')
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <section className="shell flex min-h-[100svh] flex-col justify-center pb-10 pt-32">
      <Reveal><span className="eyebrow">Contact</span></Reveal>

      <h1 className="mt-6">
        {['Let’s create', 'something', 'extraordinary', 'together.'].map((line, i) => (
          <SplitText
            key={line}
            as="span"
            text={line}
            className="t-display-lg block"
            stagger={0.02}
            delay={i * 0.08}
          />
        ))}
      </h1>

      <HairRule className="mt-14" />

      <div className="mt-12 grid gap-16 lg:grid-cols-[1.25fr_0.75fr]">
        {/* form */}
        <Reveal>
          <form onSubmit={submit} className="flex flex-col gap-9">
            <div className="grid gap-9 sm:grid-cols-2">
              <Field label="Name" name="name" required value={name} onChange={setName} />
              <Field label="Email" name="email" type="email" required value={email} onChange={setEmail} />
            </div>

            <Field label="Project type" name="project" as="select" value={project} onChange={setProject}>
              {services.map((s) => (
                <option key={s.id} value={s.title} className="bg-ink2">
                  {s.title}
                </option>
              ))}
              <option value="Custom scope" className="bg-ink2">Custom scope</option>
            </Field>

            <Field
              label="Tell us about the project"
              name="message"
              as="textarea"
              required
              value={message}
              onChange={setMessage}
            />

            <div className="pt-2">
              <Magnetic>
                <button
                  type="submit"
                  className="focus-ring t-label group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-8 py-4 text-ink"
                >
                  <span
                    className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]"
                    style={{ background: 'linear-gradient(100deg, #B79CFF, #8FEAF5)' }}
                  />
                  <span className="relative z-10">Send enquiry</span>
                  <span className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">→</span>
                </button>
              </Magnetic>
              <p className="mt-4 text-[11px] text-faint">
                Opens your email client with the brief pre-filled.
              </p>
            </div>
          </form>
        </Reveal>

        {/* details */}
        <Reveal delay={0.12}>
          <div className="flex flex-col gap-9">
            <div>
              <span className="t-label-sm text-faint">Phone</span>
              <div className="mt-3 flex flex-col gap-1.5">
                {site.phones.map((p) => (
                  <a
                    key={p}
                    href={`tel:${p.replace(/\s/g, '')}`}
                    className="focus-ring text-[15px] transition-colors duration-300 hover:text-cyan-soft"
                  >
                    {p}
                  </a>
                ))}
              </div>
            </div>

            <div className="hair" />

            <div>
              <span className="t-label-sm text-faint">Instagram</span>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noreferrer"
                className="focus-ring mt-3 block text-[15px] transition-colors duration-300 hover:text-cyan-soft"
              >
                {site.instagram.handle} ↗
              </a>
            </div>

            <div className="hair" />

            <div>
              <span className="t-label-sm text-faint">Email</span>
              <a
                href={`mailto:${site.email}`}
                className="focus-ring mt-3 block break-all text-[15px] transition-colors duration-300 hover:text-cyan-soft"
              >
                {site.email}
              </a>
            </div>

            <div className="hair" />

            <p className="body-copy text-xs">
              Typical reply within one business day. Standard turnaround is 3–5 days from brief
              approval.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
