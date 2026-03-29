import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// Tries to extract a partial headline from the streaming JSON
// so we can show something meaningful immediately
function extractPartialHeadline(raw) {
  const match = raw.match(/"headline"\s*:\s*"([^"]{4,})"?/)
  return match ? match[1].replace(/\\"/g, '"') : null
}

// Counts how many top-level JSON keys have fully closed values
function countCompletedSections(raw) {
  const keys = ['headline', 'translation', 'culturalContext', 'whyItMatters', 'keyTerms']
  return keys.filter(k => {
    const idx = raw.indexOf(`"${k}"`)
    if (idx === -1) return false
    // rough check — key exists and has at least some content after it
    return raw.indexOf(':', idx) !== -1 && raw.length > idx + k.length + 10
  }).length
}

const SECTION_LABELS = [
  { key: 'headline',       icon: '📰', label: 'Headline' },
  { key: 'translation',    icon: '🗞',  label: 'Article Translation' },
  { key: 'culturalContext',icon: '🌍', label: 'Cultural Context' },
  { key: 'whyItMatters',   icon: '💡', label: 'Why It Matters' },
  { key: 'keyTerms',       icon: '📖', label: 'Key Terms Glossary' },
]

export default function StreamingPreview({ streamText, language, streaming }) {
  const containerRef = useRef(null)
  const cursorRef    = useRef(null)
  const textRef      = useRef(null)

  const partialHeadline  = extractPartialHeadline(streamText)
  const completedCount   = countCompletedSections(streamText)
  const totalSections    = SECTION_LABELS.length
  const progressPct      = Math.min(Math.round((completedCount / totalSections) * 100), 95)
  const charCount        = streamText.length

  // Blinking cursor animation
  useEffect(() => {
    if (!cursorRef.current) return
    const tl = gsap.to(cursorRef.current, {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    })
    return () => tl.kill()
  }, [])

  // Entrance animation
  useEffect(() => {
    if (!containerRef.current) return
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
    )
  }, [])

  // Auto-scroll the raw text box as tokens arrive
  useEffect(() => {
    if (textRef.current) {
      textRef.current.scrollTop = textRef.current.scrollHeight
    }
  }, [streamText])

  return (
    <div ref={containerRef} className="space-y-0">

      {/* ── Header bar ─────────────────────────────────────────────── */}
      <div
        className="pt-4 pb-4 flex items-center justify-between"
        style={{ borderTop: '4px solid var(--saffron)', borderBottom: '1px solid var(--border-color)' }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{
              backgroundColor: streaming ? 'var(--saffron)' : '#22c55e',
              boxShadow: streaming ? '0 0 8px var(--saffron)' : 'none',
              animation: streaming ? 'pulse-dot 1s infinite' : 'none',
            }}
          />
          <span className="font-sans text-xs tracking-widest uppercase font-semibold" style={{ color: 'var(--saffron)' }}>
            {streaming ? 'Receiving translation…' : 'Processing complete — rendering…'}
          </span>
        </div>
        <span className="font-sans text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          {charCount.toLocaleString()} tokens
        </span>
      </div>

      {/* ── Partial headline preview ────────────────────────────────── */}
      {partialHeadline && (
        <div className="py-5" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <span className="news-tag mb-3 inline-block">Translated Headline</span>
          <h2 className="font-display text-xl lg:text-2xl font-bold leading-snug mt-2 flex items-end gap-1" style={{ color: 'var(--text-primary)' }}>
            {partialHeadline}
            {streaming && (
              <span ref={cursorRef} className="inline-block w-0.5 h-6 ml-1 mb-0.5" style={{ backgroundColor: 'var(--saffron)' }} />
            )}
          </h2>
        </div>
      )}

      {/* ── Progress tracker ────────────────────────────────────────── */}
      <div className="py-5" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-sans text-xs tracking-widest uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>
            Sections Generated
          </span>
          <span className="font-sans text-xs font-semibold" style={{ color: 'var(--saffron)' }}>
            {progressPct}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full mb-4 overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${progressPct}%`, backgroundColor: 'var(--saffron)' }}
          />
        </div>

        {/* Section checklist */}
        <div className="space-y-2">
          {SECTION_LABELS.map(({ key, icon, label }) => {
            const done = streamText.includes(`"${key}"`)
            return (
              <div key={key} className="flex items-center gap-3">
                <span className="text-sm w-5 text-center">
                  {done ? '✓' : streaming ? '○' : '○'}
                </span>
                <span
                  className="font-sans text-xs transition-colors"
                  style={{ color: done ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: done ? 600 : 400 }}
                >
                  {icon} {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Raw JSON stream viewer ──────────────────────────────────── */}
      <div className="py-5">
        <div className="flex items-center justify-between mb-2">
          <span className="font-sans text-xs tracking-widest uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>
            Live Stream
          </span>
          <span className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>raw JSON output</span>
        </div>
        <div
          ref={textRef}
          className="font-mono text-xs leading-relaxed p-4 overflow-y-auto"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            height: '180px',
            color: 'var(--text-muted)',
            wordBreak: 'break-all',
            whiteSpace: 'pre-wrap',
          }}
        >
          {streamText}
          {streaming && (
            <span
              ref={!partialHeadline ? cursorRef : undefined}
              className="inline-block w-1.5 h-3 ml-px align-middle"
              style={{ backgroundColor: 'var(--saffron)' }}
            />
          )}
        </div>
        <p className="font-sans text-xs mt-2 italic" style={{ color: 'var(--text-muted)' }}>
          Structured result will render automatically when complete.
        </p>
      </div>
    </div>
  )
}
