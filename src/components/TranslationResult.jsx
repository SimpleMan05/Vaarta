import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { LANGUAGES } from '../utils/languages'

export default function TranslationResult({ result, language, onCopy, copied }) {
  const lang = LANGUAGES.find(l => l.code === language)
  const containerRef = useRef(null)

  // GSAP reveal animation when result arrives
  useEffect(() => {
    if (!result || !containerRef.current) return
    const ctx = gsap.context(() => {
      const sections = containerRef.current.querySelectorAll('.result-section')
      gsap.fromTo(
        sections,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'all',
        }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [result])

  if (!result || !lang) return null

  // Normalise — support both old string format and new bilingual object format
  const normContext = (result.culturalContext || []).map(item =>
    typeof item === 'string' ? { vernacular: item, english: '' } : item
  )
  const normWhy =
    typeof result.whyItMatters === 'string'
      ? { vernacular: result.whyItMatters, english: '' }
      : result.whyItMatters || {}

  return (
    <div ref={containerRef} className="space-y-0">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div
        className="result-section pt-4 pb-4 flex items-center justify-between"
        style={{ borderTop: '4px solid var(--border-strong)', borderBottom: '1px solid var(--border-color)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-1 h-6" style={{ backgroundColor: lang.color }} />
          <span className="font-sans text-xs tracking-widest uppercase font-semibold" style={{ color: 'var(--text-primary)' }}>
            Translation Complete
          </span>
          <span className="font-display text-lg font-bold" style={{ color: lang.color }}>
            {lang.nativeName}
          </span>
        </div>
        <button
          onClick={onCopy}
          className="font-sans text-xs font-semibold tracking-widest uppercase px-4 py-2 transition-colors"
          style={{ border: '1px solid var(--border-strong)', color: 'var(--text-primary)', backgroundColor: 'transparent' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-inverse)'; e.currentTarget.style.color = 'var(--text-inverse)' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-primary)' }}
        >
          {copied ? 'Copied ✓' : 'Copy Output'}
        </button>
      </div>

      {/* ── Translated Headline ─────────────────────────────────────── */}
      {result.headline && (
        <div className="result-section py-6" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <span className="news-tag mb-3 inline-block">Translated Headline</span>
          <h2 className="font-display text-2xl lg:text-3xl font-bold leading-tight mt-2" style={{ color: 'var(--text-primary)' }}>
            {result.headline}
          </h2>
        </div>
      )}

      {/* ── Main Translation ─────────────────────────────────────────── */}
      <div className="result-section py-6" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <span className="news-tag mb-4 inline-block" style={{ backgroundColor: lang.color, color: '#faf7f2' }}>
          {lang.name} Translation
        </span>
        <div className="font-body text-base leading-relaxed whitespace-pre-wrap mt-3" style={{ color: 'var(--text-primary)' }}>
          {result.translation}
        </div>
      </div>

      {/* ── Cultural Context (bilingual) ─────────────────────────────── */}
      {normContext.length > 0 && (
        <div className="result-section py-6 px-5" style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <span className="news-tag mb-5 inline-block">🌍 Cultural Context</span>
          <ul className="space-y-5 mt-2">
            {normContext.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="font-display text-lg leading-none mt-1 flex-shrink-0" style={{ color: 'var(--saffron)' }}>◆</span>
                <div>
                  <p className="font-body text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    {point.vernacular}
                  </p>
                  {point.english && (
                    <p className="font-sans text-xs mt-1 leading-relaxed italic" style={{ color: 'var(--text-muted)' }}>
                      {point.english}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Why It Matters (bilingual) ───────────────────────────────── */}
      {normWhy.vernacular && (
        <div className="result-section py-6" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <span className="news-tag news-tag-saffron mb-5 inline-block">💡 Why It Matters in {lang.region}</span>
          <div className="pull-quote mt-3">
            <p className="font-body text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              {normWhy.vernacular}
            </p>
            {normWhy.english && (
              <p className="font-sans text-xs mt-3 leading-relaxed italic" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                {normWhy.english}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Key Terms Glossary ───────────────────────────────────────── */}
      {result.keyTerms?.length > 0 && (
        <div className="result-section py-6">
          <span className="news-tag mb-4 inline-block">📖 Key Terms Glossary</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            {result.keyTerms.map((term, i) => (
              <div
                key={i}
                className="p-3 transition-colors"
                style={{ border: '1px solid var(--border-color)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-sans text-xs font-semibold tracking-wide" style={{ color: 'var(--text-primary)' }}>{term.english}</span>
                  <span className="font-display text-sm font-bold" style={{ color: lang.color }}>{term.vernacular}</span>
                </div>
                {term.explanation && (
                  <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>{term.explanation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
