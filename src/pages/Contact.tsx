import { useState } from 'react'
import { SplitText } from '../components/SplitText'
import { Reveal, HairRule } from '../components/Reveal'
import { Magnetic } from '../components/Magnetic'
import { site } from '../data/site'
import { services } from '../data/services'
import { InstagramIcon, WhatsAppIcon, LinkedInIcon, PhoneIcon, EmailIcon } from '../components/SocialIcon'
import { EmailMenu } from '../components/EmailMenu'

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

/** Optional attachment picker. Styled like Field but a real file input can't
 *  share its underline-only look, so it gets its own compact treatment. */
function FileField({
  label,
  accept,
  file,
  onChange,
}: {
  label: string
  accept: string
  file: File | null
  onChange: (f: File | null) => void
}) {
  const id = `file-${accept.replace(/[^a-z]/gi, '')}`
  return (
    <label htmlFor={id} className="group relative block cursor-pointer">
      <span className="t-label-sm text-faint">{label}</span>
      <div className="relative mt-1 flex items-center justify-between border-b border-white/15 py-3.5 text-[15px] transition-colors duration-500">
        <span className={file ? 'text-white' : 'text-faint'}>
          {file ? file.name : 'Choose file'}
        </span>
        <span className="t-label-sm text-cyan-soft">{file ? 'Change' : 'Browse'}</span>
      </div>
      <input
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </label>
  )
}

type SubmitState = 'idle' | 'sending' | 'sent' | 'error'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  // no default — an unselected placeholder forces an actual choice rather
  // than silently submitting whichever service happened to be first
  const [project, setProject] = useState('')
  const [message, setMessage] = useState('')
  const [refImage, setRefImage] = useState<File | null>(null)
  const [refVideo, setRefVideo] = useState<File | null>(null)
  const [state, setState] = useState<SubmitState>('idle')

  /**
   * Posts straight to Netlify Forms — no visitor mail client involved, no
   * backend of our own to run. The static, hidden form in index.html (same
   * name, same fields) is what lets Netlify's build step register this
   * form's schema; this fetch is what actually submits it at runtime.
   *
   * Only works once deployed on Netlify — the local dev server has no forms
   * backend to receive this, so a local test will show the "sending" state
   * and then fail. That's expected, not a bug; real delivery needs a deploy.
   */
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState('sending')

    const data = new FormData()
    data.set('form-name', 'contact')
    data.set('name', name)
    data.set('email', email)
    data.set('project', project)
    data.set('message', message)
    if (refImage) data.set('referenceImage', refImage)
    if (refVideo) data.set('referenceVideo', refVideo)

    try {
      const res = await fetch('/', { method: 'POST', body: data })
      if (!res.ok) throw new Error(`${res.status}`)
      setState('sent')
    } catch {
      setState('error')
    }
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
          {state === 'sent' ? (
            <div className="flex min-h-[420px] flex-col justify-center">
              <span className="eyebrow text-cyan-soft">Sent</span>
              <h2 className="t-display-md mt-4">Got it — thank you.</h2>
              <p className="body-copy mt-3 max-w-[46ch]">
                Your inquiry landed directly in our inbox. Typical reply within one business day.
              </p>
              <button
                onClick={() => {
                  setState('idle')
                  setName('')
                  setEmail('')
                  setMessage('')
                  setRefImage(null)
                  setRefVideo(null)
                }}
                className="focus-ring t-label mt-8 inline-flex w-fit items-center gap-3 text-cyan-soft transition-opacity hover:opacity-75"
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              name="contact"
              onSubmit={submit}
              className="flex flex-col gap-9"
              aria-busy={state === 'sending'}
            >
              {/* honeypot — real visitors never see or fill this; bots that
                  fill every field will, and Netlify silently drops those */}
              <p hidden>
                <label>
                  Don&rsquo;t fill this out: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                </label>
              </p>

              <div className="grid gap-9 sm:grid-cols-2">
                <Field label="Name" name="name" required value={name} onChange={setName} />
                <Field label="Email" name="email" type="email" required value={email} onChange={setEmail} />
              </div>

              <Field label="Project type" name="project" as="select" required value={project} onChange={setProject}>
                <option value="" disabled hidden className="text-faint">
                  Select a project type
                </option>
                {services.map((s) => (
                  <option key={s.id} value={s.title} className="bg-ink2">
                    {s.title}
                  </option>
                ))}
                <option value="Custom scope" className="bg-ink2">Custom scope</option>
              </Field>

              <div className="grid gap-9 sm:grid-cols-2">
                <FileField
                  label="Reference image (optional)"
                  accept="image/*"
                  file={refImage}
                  onChange={setRefImage}
                />
                <FileField
                  label="Reference video (optional)"
                  accept="video/*"
                  file={refVideo}
                  onChange={setRefVideo}
                />
              </div>

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
                    disabled={state === 'sending'}
                    className="focus-ring t-label group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-8 py-4 text-ink disabled:opacity-60"
                  >
                    <span
                      className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]"
                      style={{ background: 'linear-gradient(100deg, #B79CFF, #8FEAF5)' }}
                    />
                    <span className="relative z-10">{state === 'sending' ? 'Sending…' : 'Send inquiry'}</span>
                    {state !== 'sending' && (
                      <span className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">→</span>
                    )}
                  </button>
                </Magnetic>
                <p className="mt-4 text-[11px] text-faint">
                  {state === 'error'
                    ? "That didn't go through — try again, or reach us on WhatsApp or email directly."
                    : 'Sends straight to our inbox — no email app needed on your end.'}
                </p>
              </div>
            </form>
          )}
        </Reveal>

        {/* details */}
        <Reveal delay={0.12}>
          <div className="flex flex-col gap-5">
            <a
              href={`https://wa.me/${site.whatsapp.number}`}
              target="_blank"
              rel="noreferrer"
              className="focus-ring group flex items-center gap-4 rounded-xl border border-white/10 px-5 py-4 transition-colors duration-300 hover:border-white/25"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-[#25D366] transition-colors group-hover:bg-white/10">
                <WhatsAppIcon />
              </span>
              <span>
                <span className="t-label-sm block text-faint">WhatsApp</span>
                <span className="text-[15px]">Message on WhatsApp</span>
              </span>
            </a>

            <a
              href={`tel:${site.phone.replace(/\s/g, '')}`}
              className="focus-ring group flex items-center gap-4 rounded-xl border border-white/10 px-5 py-4 transition-colors duration-300 hover:border-white/25"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-violet-soft transition-colors group-hover:bg-white/10">
                <PhoneIcon />
              </span>
              <span>
                <span className="t-label-sm block text-faint">Phone</span>
                <span className="text-[15px]">{site.phone}</span>
              </span>
            </a>

            <a
              href={site.instagram.url}
              target="_blank"
              rel="noreferrer"
              className="focus-ring group flex items-center gap-4 rounded-xl border border-white/10 px-5 py-4 transition-colors duration-300 hover:border-white/25"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-cyan-soft transition-colors group-hover:bg-white/10">
                <InstagramIcon />
              </span>
              <span>
                <span className="t-label-sm block text-faint">Instagram</span>
                <span className="text-[15px]">{site.instagram.handle}</span>
              </span>
            </a>

            <a
              href={site.linkedin.url}
              target="_blank"
              rel="noreferrer"
              className="focus-ring group flex items-center gap-4 rounded-xl border border-white/10 px-5 py-4 transition-colors duration-300 hover:border-white/25"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-violet-soft transition-colors group-hover:bg-white/10">
                <LinkedInIcon />
              </span>
              <span>
                <span className="t-label-sm block text-faint">LinkedIn</span>
                <span className="text-[15px]">Naveen Sharma</span>
              </span>
            </a>

            <EmailMenu className="focus-ring group flex w-full items-center gap-4 rounded-xl border border-white/10 px-5 py-4 text-left transition-colors duration-300 hover:border-white/25">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-cyan-soft transition-colors group-hover:bg-white/10">
                <EmailIcon />
              </span>
              <span>
                <span className="t-label-sm block text-faint">Email</span>
                <span className="break-all text-[15px]">{site.email}</span>
              </span>
            </EmailMenu>

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
