import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import TranslationResult from '../components/TranslationResult'
import LoadingSkeleton from '../components/LoadingSkeleton'
import StreamingPreview from '../components/StreamingPreview'
import { usePuterAI } from '../hooks/usePuterAI'
import { usePuter } from '../context/PuterContext'
import { LANGUAGES, SAMPLE_ARTICLES } from '../utils/languages'

const MIN_LENGTH = 100

export default function Translate() {
  const [articleText, setArticleText] = useState('')
  const [selectedLang, setSelectedLang] = useState('hi')
  const [copied, setCopied] = useState(false)
  const { translate, loading, streaming, streamText, error, result, reset } = usePuterAI()
  const { status: puterStatus, retry: puterRetry } = usePuter()
  const resultRef = useRef(null)
  const headerRef = useRef(null)
  const inputPanelRef = useRef(null)

  // Page entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      )
      gsap.fromTo(
        inputPanelRef.current,
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55, ease: 'power3.out', delay: 0.15 }
      )
    })
    return () => ctx.revert()
  }, [])

  const wordCount = articleText.trim().split(/\s+/).filter(Boolean).length
  const charCount = articleText.length
  const isPuterReady = puterStatus === 'ready'
  const canTranslate = charCount >= MIN_LENGTH && !loading && !streaming && isPuterReady

  async function handleTranslate() {
    if (!canTranslate) return
    reset()
    try {
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
      await translate(articleText, selectedLang)
    } catch {}
  }

  function handleSample(article) {
    setArticleText(article.text)
    reset()
  }

  function handleCopy() {
    if (!result) return
    const text = [
      result.headline && `HEADLINE: ${result.headline}`,
      `\nTRANSLATION:\n${result.translation}`,
      result.culturalContext?.length && `\nCULTURAL CONTEXT:\n${result.culturalContext.map(c => `• ${c}`).join('\n')}`,
      result.whyItMatters && `\nWHY IT MATTERS:\n${result.whyItMatters}`,
    ].filter(Boolean).join('\n')

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const selectedLangObj = LANGUAGES.find(l => l.code === selectedLang)

  return (
    <div className="min-h-screen newsprint-bg">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-10 pb-16">
        {/* Page header */}
        <div ref={headerRef} className="pt-4 mb-2" style={{ borderTop: '4px solid var(--border-strong)' }}>
          <span className="news-tag news-tag-saffron">Translation Engine</span>
        </div>
        <div className="pb-4 mb-8 flex items-baseline justify-between" style={{ borderBottom: '2px solid var(--border-strong)' }}>
          <h1 className="font-display text-4xl lg:text-5xl font-black leading-none" style={{ color: 'var(--text-primary)' }}>
            Vaarta <span className="italic" style={{ color: 'var(--saffron)' }}>Engine</span>
          </h1>
          <span className="font-sans text-xs tracking-wide hidden md:block" style={{ color: 'var(--text-muted)' }}>
            Culturally-adapted vernacular business news
          </span>
        </div>

        {/* Puter not ready — show banner */}
        {!isPuterReady && (
          <PuterAuthBanner status={puterStatus} onRetry={puterRetry} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Input panel */}
          <div ref={inputPanelRef} className="lg:col-span-5 space-y-6">

            {/* Language selector */}
            <div>
              <label className="font-sans text-xs tracking-widest uppercase font-semibold block mb-3" style={{ color: 'var(--text-muted)' }}>
                Target Language
              </label>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map(lang => {
                  const isSelected = selectedLang === lang.code
                  return (
                    <button
                      key={lang.code}
                      onClick={() => { setSelectedLang(lang.code); reset() }}
                      className="p-3 border-2 text-left transition-all"
                      style={{
                        borderColor: isSelected ? 'var(--border-strong)' : 'var(--border-color)',
                        backgroundColor: isSelected ? 'var(--bg-inverse)' : 'var(--bg-tertiary)',
                        color: isSelected ? 'var(--text-inverse)' : 'var(--text-primary)',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: isSelected ? 'var(--bg-primary)' : lang.color }} />
                        <span className="font-display text-base font-bold leading-none">{lang.nativeName}</span>
                      </div>
                      <div className="font-sans text-xs mt-1 opacity-60">{lang.name} · {lang.region}</div>
                    </button>
                  )
                })}
              </div>

              <div className="mt-3 p-3 text-xs font-sans" style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                <span className="font-semibold" style={{ color: selectedLangObj?.color }}>{selectedLangObj?.name}</span>
                {' '}· {selectedLangObj?.speakers} speakers · {selectedLangObj?.regionDetail}
              </div>
            </div>

            {/* Sample articles */}
            <div>
              <label className="font-sans text-xs tracking-widest uppercase font-semibold block mb-3" style={{ color: 'var(--text-muted)' }}>
                Sample Articles
              </label>
              <div className="space-y-2">
                {SAMPLE_ARTICLES.map((article, i) => (
                  <button
                    key={i}
                    onClick={() => handleSample(article)}
                    className="w-full p-3 text-left transition-all group"
                    style={{ border: '1px solid var(--border-color)' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    <div className="flex items-start gap-2">
                      <span className="news-tag text-xs flex-shrink-0 mt-0.5">ET</span>
                      <span className="font-body text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>
                        {article.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Article input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-sans text-xs tracking-widest uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>
                  Paste Article Text
                </label>
                <span className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>
                  {wordCount} words · {charCount} chars
                </span>
              </div>
              <textarea
                value={articleText}
                onChange={e => { setArticleText(e.target.value); if (result) reset() }}
                placeholder="Paste your English business news article here — from ET, Mint, Business Standard, or any financial publication..."
                className="w-full h-52 p-4 border-2 outline-none resize-none font-body text-sm leading-relaxed transition-colors"
                style={{
                  borderColor: 'var(--border-color)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--border-strong)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
              />
              {charCount > 0 && charCount < MIN_LENGTH && (
                <p className="font-sans text-xs mt-1" style={{ color: '#c0392b' }}>
                  Paste more text — at least {MIN_LENGTH} characters needed ({MIN_LENGTH - charCount} more)
                </p>
              )}
            </div>

            {/* Translate button */}
            <button
              onClick={handleTranslate}
              disabled={!canTranslate}
              className="w-full py-4 font-sans font-bold text-sm tracking-widest uppercase transition-all"
              style={
                canTranslate
                  ? { backgroundColor: 'var(--bg-inverse)', color: 'var(--text-inverse)', cursor: 'pointer' }
                  : { backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)', cursor: 'not-allowed', border: '2px solid var(--border-color)' }
              }
              onMouseEnter={e => { if (canTranslate) e.currentTarget.style.backgroundColor = 'var(--saffron)' }}
              onMouseLeave={e => { if (canTranslate) e.currentTarget.style.backgroundColor = 'var(--bg-inverse)' }}
            >
              {loading && streaming ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--saffron)', animation: 'pulse-dot 1s infinite' }} />
                  Streaming…
                </span>
              ) : loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-t-transparent rounded-full inline-block animate-spin" style={{ borderColor: 'var(--text-inverse)', borderTopColor: 'transparent' }} />
                  Connecting…
                </span>
              ) : !isPuterReady ? (
                `Waiting for AI connection…`
              ) : (
                `Translate to ${selectedLangObj?.name} →`
              )}
            </button>

            {/* Tips */}
            <div className="p-4 space-y-1" style={{ border: '1px solid var(--border-color)' }}>
              <p className="font-sans text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-primary)' }}>Tips for Best Results</p>
              {[
                'Works best with 150–800 word articles',
                'Include full article body, not just headlines',
                'Financial reports and market news work best',
                'Policy news gets the most cultural adaptation',
              ].map((tip, i) => (
                <p key={i} className="font-sans text-xs flex gap-2" style={{ color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--saffron)' }}>◆</span> {tip}
                </p>
              ))}
            </div>
          </div>

          {/* Vertical divider */}
          <div className="hidden lg:flex lg:col-span-1 justify-center">
            <div className="w-px h-full" style={{ backgroundColor: 'var(--border-color)' }} />
          </div>

          {/* Right: Output panel */}
          <div className="lg:col-span-6" ref={resultRef}>
            <div className="sticky top-32">
              {!result && !loading && !error && <EmptyState lang={selectedLangObj} />}
              {loading && !streaming && <LoadingSkeleton />}
              {loading && streaming && (
                <StreamingPreview
                  streamText={streamText}
                  language={selectedLang}
                  streaming={streaming}
                />
              )}
              {error && <ErrorState error={error} onRetry={handleTranslate} />}
              {result && !loading && (
                <TranslationResult result={result} language={selectedLang} onCopy={handleCopy} copied={copied} />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function PuterAuthBanner({ status, onRetry }) {
  const isError = status === 'error'
  const isSigningIn = status === 'signing-in'

  return (
    <div className="mb-8 p-4 flex items-start gap-4" style={{
      border: `2px solid ${isError ? '#c0392b' : 'var(--saffron)'}`,
      backgroundColor: 'var(--bg-secondary)',
    }}>
      <div className="mt-0.5 flex-shrink-0">
        {isError ? (
          <span className="text-xl">⚠️</span>
        ) : (
          <span className="w-5 h-5 border-2 border-t-transparent rounded-full inline-block animate-spin mt-1" style={{ borderColor: 'var(--saffron)', borderTopColor: 'transparent', display: 'inline-block', width: '18px', height: '18px' }} />
        )}
      </div>
      <div className="flex-1">
        <p className="font-sans text-sm font-semibold mb-1" style={{ color: isError ? '#c0392b' : 'var(--saffron)' }}>
          {isError ? 'Puter AI Not Connected' : isSigningIn ? 'Complete Sign-in in the Popup Window' : 'Connecting to Puter AI…'}
        </p>
        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
          {isError
            ? 'The Puter sign-in popup was closed or failed. Click "Reconnect" to try again — a login popup will open.'
            : isSigningIn
            ? 'A Puter.com sign-in popup has opened. Create a free account or sign in to enable AI translation.'
            : 'Establishing a secure connection to Puter AI. This takes a few seconds…'}
        </p>
      </div>
      {isError && (
        <button
          onClick={onRetry}
          className="font-sans text-xs font-semibold tracking-widest uppercase px-4 py-2 flex-shrink-0 transition-colors"
          style={{ backgroundColor: '#c0392b', color: '#faf7f2' }}
        >
          Reconnect
        </button>
      )}
    </div>
  )
}

function EmptyState({ lang }) {
  return (
    <div className="text-center py-16 border-2 border-dashed" style={{ borderColor: 'var(--border-color)' }}>
      <div className="font-display text-6xl font-black mb-4 opacity-20" style={{ color: lang?.color }}>
        {lang?.nativeName}
      </div>
      <p className="font-display text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Output Appears Here</p>
      <p className="font-body text-sm leading-relaxed max-w-xs mx-auto" style={{ color: 'var(--text-muted)' }}>
        Paste an article and select your language to receive a culturally-adapted translation.
      </p>
      <div className="mt-8 space-y-2">
        {['📰 Translated Article', '🌍 Cultural Context Notes', '💡 Why It Matters Locally', '📖 Key Terms Glossary'].map((item, i) => (
          <div key={i} className="font-sans text-xs opacity-40" style={{ color: 'var(--text-muted)' }}>{item}</div>
        ))}
      </div>
    </div>
  )
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="p-6" style={{ border: '2px solid #c0392b', backgroundColor: 'var(--bg-tertiary)' }}>
      <div className="flex items-start gap-3 mb-4">
        <span className="text-xl">⚠</span>
        <div>
          <p className="font-sans text-sm font-semibold mb-1" style={{ color: '#c0392b' }}>Translation Failed</p>
          <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{error}</p>
        </div>
      </div>
      <div className="text-xs font-sans space-y-1 pt-4 mb-4" style={{ borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
        <p>• Ensure Puter AI shows "Ready" in the top bar</p>
        <p>• Check your internet connection</p>
        <p>• Try refreshing the page if this persists</p>
      </div>
      <button
        onClick={onRetry}
        className="font-sans text-xs font-semibold tracking-widest uppercase px-5 py-2.5 transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#c0392b', color: '#faf7f2' }}
      >
        Retry Translation
      </button>
    </div>
  )
}
