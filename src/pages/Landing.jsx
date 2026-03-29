import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { LANGUAGES } from '../utils/languages'

gsap.registerPlugin(ScrollTrigger)

export default function Landing() {
  return (
    <div className="min-h-screen newsprint-bg">
      <Navbar />
      <main>
        <Hero />
        <LanguageStrip />
        <WhyVernacular />
        <HowItWorks />
        <LanguageCards />
        <CTABand />
      </main>
      <Footer />
    </div>
  )
}

/* ── Hero ──────────────────────────────────────────────────────────── */
function Hero() {
  const headlineRef = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)
  const statsRef = useRef(null)
  const rulerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // Ruler line draws in
      tl.fromTo(rulerRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.5 }
      )

      // Headline words stagger in
      const words = headlineRef.current.querySelectorAll('.word')
      tl.fromTo(words,
        { opacity: 0, y: 40, rotateX: -20 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.6, stagger: 0.06 },
        '-=0.1'
      )

      // Subtext
      tl.fromTo(subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.2'
      )

      // CTA buttons
      tl.fromTo(ctaRef.current.children,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 },
        '-=0.2'
      )

      // Stats column — scroll trigger
      const statItems = statsRef.current.querySelectorAll('.stat-item')
      gsap.fromTo(statItems,
        { opacity: 0, x: 30 },
        {
          opacity: 1, x: 0, duration: 0.5, stagger: 0.12,
          scrollTrigger: { trigger: statsRef.current, start: 'top 80%' },
        }
      )

      // Animated number counters
      statsRef.current.querySelectorAll('.stat-number').forEach(el => {
        const target = el.dataset.target
        if (!target || isNaN(target)) return
        gsap.fromTo(
          { val: 0 },
          {
            val: parseFloat(target),
            duration: 1.5,
            ease: 'power2.out',
            onUpdate() { el.textContent = Math.round(this.targets()[0].val).toLocaleString('en-IN') },
            scrollTrigger: { trigger: el, start: 'top 85%' },
          }
        )
      })
    })
    return () => ctx.revert()
  }, [])

  const headlineLines = [
    ['Business', 'News.'],
    ['Now', 'in', 'Your'],
    ['Own', 'Tongue.'],
  ]

  return (
    <section className="max-w-6xl mx-auto px-6 pt-12 pb-10">
      <div ref={rulerRef} className="pb-2 mb-6" style={{ borderBottom: '2px solid var(--border-strong)' }}>
        <span className="news-tag news-tag-saffron">Exclusive Launch</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Headline column */}
        <div className="lg:col-span-8 pr-0 lg:pr-10" style={{ borderRight: '1px solid var(--border-color)' }}>
          <h1
            ref={headlineRef}
            className="font-display text-5xl lg:text-7xl font-black leading-none tracking-tight mb-6"
            style={{ color: 'var(--text-primary)', perspective: '600px' }}
          >
            {headlineLines.map((line, li) => (
              <span key={li} className="block">
                {line.map((word, wi) => (
                  <span
                    key={wi}
                    className="word inline-block mr-[0.2em]"
                    style={li === 1 && wi === 0 ? { color: 'var(--saffron)', fontStyle: 'italic' } : {}}
                  >
                    {word}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p ref={subRef} className="font-body text-lg leading-relaxed max-w-xl mb-8" style={{ color: 'var(--text-muted)' }}>
            Vaarta transforms English business journalism from Economic Times into culturally-rooted Hindi, Tamil, Telugu, and Bengali —
            not translated word-for-word, but{' '}
            <em>reimagined for how your region thinks about money and markets.</em>
          </p>

          <div ref={ctaRef} className="flex flex-wrap gap-4">
            <Link
              to="/translate"
              className="font-sans font-semibold text-sm tracking-widest uppercase px-8 py-4 inline-flex items-center gap-2 transition-all duration-200"
              style={{ backgroundColor: 'var(--bg-inverse)', color: 'var(--text-inverse)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--saffron)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-inverse)'}
            >
              Try the Engine →
            </Link>
            <a
              href="#how-it-works"
              className="font-sans font-medium text-sm tracking-wide px-8 py-4 inline-flex items-center gap-2 transition-colors"
              style={{ border: '1px solid var(--border-strong)', color: 'var(--text-primary)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Stats column */}
        <div ref={statsRef} className="lg:col-span-4 pt-8 lg:pt-0 lg:pl-10">
          <div className="pt-4 mb-6" style={{ borderTop: '4px solid var(--border-strong)' }}>
            <span className="font-sans text-xs tracking-widest uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>By the Numbers</span>
          </div>

          {[
            { display: '4',   target: null, label: 'Indian Languages',     sub: 'Hindi · Tamil · Telugu · Bengali' },
            { display: '1B+', target: null, label: 'Potential Readers',    sub: 'Native speakers across regions' },
            { display: '3',   target: null, label: 'Layers of Adaptation', sub: 'Translation · Context · Local Impact' },
          ].map((stat, i) => (
            <div key={i} className="stat-item mb-6 pb-6 last:border-0" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div
                className="stat-number font-display text-4xl font-black leading-none mb-1"
                data-target={stat.target}
                style={{ color: 'var(--saffron)' }}
              >
                {stat.display}
              </div>
              <div className="font-sans text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>{stat.label}</div>
              <div className="font-sans text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.sub}</div>
            </div>
          ))}

          <div className="pull-quote mt-6">
            <p className="text-base leading-snug" style={{ color: 'var(--text-primary)' }}>
              "The next billion internet users will consume content in their mother tongue."
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-4 flex justify-between items-center" style={{ borderTop: '1px solid var(--border-color)' }}>
        <span className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>Vol. I, Prototype Edition · 2025</span>
        <div className="flex gap-6">
          {LANGUAGES.map(l => (
            <span key={l.code} className="font-display text-base font-bold" style={{ color: l.color }}>{l.nativeName}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Language Strip ─────────────────────────────────────────────────── */
function LanguageStrip() {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current.querySelectorAll('.lang-item'),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: 'top 90%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="py-4 px-6 overflow-hidden" style={{ backgroundColor: 'var(--bg-inverse)' }}>
      <div className="flex gap-12 items-center justify-center flex-wrap">
        {LANGUAGES.map(lang => (
          <div key={lang.code} className="lang-item flex items-center gap-3">
            <span className="font-display text-2xl font-bold" style={{ color: lang.color }}>{lang.nativeName}</span>
            <div>
              <div className="font-sans text-xs font-semibold tracking-wide" style={{ color: 'var(--text-inverse)' }}>{lang.name}</div>
              <div className="font-sans text-xs opacity-50" style={{ color: 'var(--text-inverse)' }}>{lang.speakers} speakers</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Why Vernacular ─────────────────────────────────────────────────── */
function WhyVernacular() {
  const leftRef = useRef(null)
  const cardsRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: leftRef.current, start: 'top 80%' } }
      )
      gsap.fromTo(
        cardsRef.current.querySelectorAll('.feature-card'),
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.13, ease: 'power3.out',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 80%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-6 py-14">
      <div className="rule-thick mb-2" />
      <div className="rule-single mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div ref={leftRef}>
          <span className="news-tag mb-4 inline-block">The Problem</span>
          <h2 className="font-display text-4xl lg:text-5xl font-black leading-tight mb-6" style={{ color: 'var(--text-primary)' }}>
            Business news is still written{' '}
            <span className="italic" style={{ color: 'var(--saffron)' }}>for English readers.</span>
          </h2>
          <div className="drop-cap font-body text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            <p>India's business media has long served a narrow slice of the population — English-educated, metro-dwelling professionals. Yet the real economic story of India plays out in factories in Coimbatore, markets in Patna, and tech startups in Hyderabad — in languages that national business media ignores.</p>
          </div>
          <p className="font-body text-base leading-relaxed mt-4" style={{ color: 'var(--text-muted)' }}>
            Existing translation tools produce awkward, literal output that loses the nuance of financial reporting. A "quantitative easing" translated literally in Bengali means nothing to a jute mill owner in Murshidabad.
          </p>
        </div>

        <div ref={cardsRef} className="space-y-0">
          {[
            { title: 'Not Just Translation',      icon: '◈', body: 'Every output includes cultural adaptation — financial metaphors are replaced with regionally familiar equivalents that resonate with local economic realities.' },
            { title: 'Regional Economic Context', icon: '◉', body: "Each story is framed through the lens of the target region's economy. A Sensex story for Tamil readers focuses on its impact on Chennai's IT sector." },
            { title: '"Why It Matters Here"',     icon: '◎', body: "Every translated article ends with a locally-grounded paragraph explaining direct relevance to the reader's state, city, or industry." },
          ].map((item, i) => (
            <div
              key={i}
              className="feature-card p-6 transition-all"
              style={{ border: '1px solid var(--border-color)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.backgroundColor = 'var(--bg-secondary)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <div className="flex items-start gap-4">
                <span className="font-display text-2xl mt-0.5" style={{ color: 'var(--saffron)' }}>{item.icon}</span>
                <div>
                  <h3 className="font-display text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                  <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── How It Works ───────────────────────────────────────────────────── */
function HowItWorks() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.step-card'),
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="how-it-works" ref={sectionRef} className="py-16 px-6" style={{ backgroundColor: 'var(--bg-inverse)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="pb-2 mb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <span className="font-sans text-xs tracking-widest uppercase font-semibold" style={{ color: 'var(--saffron)' }}>The Process</span>
        </div>
        <h2 className="font-display text-4xl lg:text-5xl font-black leading-tight mb-12" style={{ color: 'var(--text-inverse)' }}>
          How Vaarta Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {[
            { step: '01', title: 'Paste Article',      body: 'Copy any English business news article — from ET, Mint, Business Standard — and paste it into the engine.' },
            { step: '02', title: 'Select Language',    body: 'Choose your target vernacular: Hindi, Tamil, Telugu, or Bengali. Each triggers a regionally-specific AI context window.' },
            { step: '03', title: 'Get Adapted Output', body: 'Receive translated text, bilingual cultural context, key term glossary, and a local impact summary.' },
          ].map((item, i) => (
            <div key={i} className="step-card p-8" style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
              <div className="font-display text-6xl font-black leading-none mb-4 opacity-30" style={{ color: 'var(--saffron)' }}>{item.step}</div>
              <h3 className="font-display text-xl font-bold mb-3" style={{ color: 'var(--text-inverse)' }}>{item.title}</h3>
              <p className="font-body text-sm leading-relaxed opacity-70" style={{ color: 'var(--text-inverse)' }}>{item.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 p-6" style={{ border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.04)' }}>
          <p className="font-sans text-xs tracking-widest uppercase font-semibold mb-2" style={{ color: 'var(--saffron)' }}>Powered By</p>
          <p className="font-body text-sm leading-relaxed opacity-80" style={{ color: 'var(--text-inverse)' }}>
            Vaarta uses <strong>Puter.js</strong> to call GPT-4o with a culturally-engineered prompt. A free Puter account is required. No data is stored server-side.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── Language Cards ─────────────────────────────────────────────────── */
function LanguageCards() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current.querySelectorAll('.lang-card'),
        { opacity: 0, y: 40, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 80%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-6 py-14">
      <div className="rule-thick mb-2" /><div className="rule-single mb-8" />
      <div className="flex justify-between items-baseline mb-8">
        <h2 className="font-display text-3xl font-black" style={{ color: 'var(--text-primary)' }}>Supported Languages</h2>
        <Link to="/translate" className="font-sans text-xs font-semibold tracking-widest uppercase hover:underline" style={{ color: 'var(--saffron)' }}>Try All →</Link>
      </div>
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0" style={{ border: '1px solid var(--border-color)' }}>
        {LANGUAGES.map((lang, i) => (
          <div
            key={lang.code}
            className="lang-card p-6 transition-colors cursor-default"
            style={{ borderRight: i < 3 ? '1px solid var(--border-color)' : 'none' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div className="w-1 h-8 mb-4" style={{ backgroundColor: lang.color }} />
            <div className="font-display text-3xl font-black mb-1" style={{ color: lang.color }}>{lang.nativeName}</div>
            <div className="font-sans text-sm font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-primary)' }}>{lang.name}</div>
            <div className="font-sans text-xs mb-4" style={{ color: 'var(--text-muted)' }}>{lang.region}</div>
            <div className="font-sans text-xs leading-relaxed pt-4" style={{ borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>{lang.economyNote}</div>
            <div className="font-display text-xs italic mt-4 opacity-60" style={{ color: 'var(--text-muted)' }}>{lang.speakers} native speakers</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── CTA Band ───────────────────────────────────────────────────────── */
function CTABand() {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 85%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-6 pb-14">
      <div ref={ref} className="p-10 lg:p-14 text-center" style={{ backgroundColor: 'var(--saffron)' }}>
        <span className="font-sans text-xs tracking-widest uppercase font-semibold opacity-70 block mb-4" style={{ color: '#faf7f2' }}>Ready to Read in Your Language</span>
        <h2 className="font-display text-4xl lg:text-5xl font-black leading-tight mb-4" style={{ color: '#faf7f2' }}>
          Business News.<br />Decoded for Bharat.
        </h2>
        <p className="font-body text-base opacity-80 max-w-xl mx-auto mb-8 leading-relaxed" style={{ color: '#faf7f2' }}>
          Paste any ET article. Select your language. Get culturally-adapted, regionally-relevant business journalism — in seconds.
        </p>
        <Link
          to="/translate"
          className="inline-block font-sans font-bold text-sm tracking-widest uppercase px-10 py-4 transition-colors"
          style={{ backgroundColor: 'var(--bg-inverse)', color: 'var(--text-inverse)' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1a1108'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-inverse)'}
        >
          Launch Vaarta Engine →
        </Link>
      </div>
    </section>
  )
}
