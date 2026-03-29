import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { usePuter } from '../context/PuterContext'

const NAV_DATE = new Date().toLocaleDateString('en-IN', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
})

export default function Navbar() {
  const { pathname } = useLocation()
  const { theme, toggleTheme } = useTheme()
  const { status, user, errorMsg, retry } = usePuter()

  return (
    <header style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-strong)' }} className="border-b-2 sticky top-0 z-50 transition-colors duration-300">

      {/* Top metadata bar */}
      <div style={{ backgroundColor: 'var(--bg-inverse)', color: 'var(--text-inverse)' }} className="px-6 py-1 flex justify-between items-center transition-colors duration-300">
        <span className="font-sans text-xs tracking-widest uppercase opacity-70">{NAV_DATE}</span>
        <span className="font-sans text-xs tracking-widest uppercase opacity-70 hidden md:block">Vernacular Business Intelligence</span>
        <div className="flex items-center gap-4">
          {/* Puter connection status */}
          <PuterStatusBadge status={status} user={user} errorMsg={errorMsg} retry={retry} />
          {['हि', 'த', 'తె', 'বা'].map((lang, i) => (
            <span key={i} className="font-display text-sm opacity-80 cursor-default" style={{ color: 'var(--saffron)' }}>{lang}</span>
          ))}
        </div>
      </div>

      {/* Masthead */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <Link to="/" className="group">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl font-black tracking-tight leading-none" style={{ color: 'var(--text-primary)' }}>Vaarta</span>
            <span className="font-display text-xl font-bold italic leading-none" style={{ color: 'var(--saffron)' }}>वार्ता</span>
          </div>
          <p className="font-sans text-xs tracking-widest uppercase mt-1" style={{ color: 'var(--text-muted)' }}>
            Vernacular Business News Engine
          </p>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="font-sans text-sm font-medium tracking-wide transition-colors"
            style={{ color: pathname === '/' ? 'var(--saffron)' : 'var(--text-muted)' }}
          >
            Home
          </Link>
          <Link
            to="/translate"
            className="font-sans text-sm font-medium tracking-wide transition-colors"
            style={{ color: pathname === '/translate' ? 'var(--saffron)' : 'var(--text-muted)' }}
          >
            Translate
          </Link>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            )}
          </button>

          {/* Hide Try Now when already on /translate */}
          {pathname !== '/translate' && (
            <Link
              to="/translate"
              className="font-sans text-xs font-semibold tracking-widest uppercase px-5 py-2.5 transition-colors"
              style={{ backgroundColor: 'var(--bg-inverse)', color: 'var(--text-inverse)' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--saffron)'; e.currentTarget.style.color = '#faf7f2' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--bg-inverse)'; e.currentTarget.style.color = 'var(--text-inverse)' }}
            >
              Try Now →
            </Link>
          )}
        </nav>
      </div>

      {/* News ticker */}
      <Ticker />
    </header>
  )
}

function PuterStatusBadge({ status, user, errorMsg, retry }) {
  const configs = {
    checking:   { dot: 'checking', label: 'Connecting…',  color: 'var(--saffron)', cursor: 'default' },
    'signing-in': { dot: 'checking', label: 'Sign in popup…', color: 'var(--saffron)', cursor: 'default' },
    ready:      { dot: 'ready',    label: user?.username ? `AI: ${user.username}` : 'AI Ready', color: '#22c55e', cursor: 'default' },
    error:      { dot: 'error',    label: 'Disconnected — Connect', color: '#ef4444', cursor: 'pointer' },
  }
  const cfg = configs[status] || configs.checking

  return (
    <button
      className="puter-status"
      style={{ color: cfg.color, cursor: cfg.cursor, background: 'transparent', border: 'none', padding: '3px 8px' }}
      onClick={status === 'error' ? retry : undefined}
      title={status === 'error' ? (errorMsg || 'Click to reconnect') : `Puter.js AI status: ${status}`}
    >
      <span className={`puter-dot ${cfg.dot}`} />
      {cfg.label}
    </button>
  )
}

function Ticker() {
  const items = [
    'Sensex closes 312 pts higher • Nifty50 breaches 23,400',
    'RBI holds repo rate at 6.5% for seventh consecutive time',
    'Tata Group eyes $2B acquisition in renewable energy sector',
    'Reliance Industries Q3 profit rises 11% to ₹21,930 crore',
    'India GDP growth forecast revised to 7.2% for FY2025',
    'SEBI tightens F&O rules amid retail investor surge',
    'Adani Ports wins major contract in Sri Lanka port expansion',
  ]
  const doubled = [...items, ...items]

  return (
    <div className="py-1.5 ticker-wrapper" style={{ backgroundColor: 'var(--saffron)' }}>
      <div className="ticker-content font-sans text-xs font-medium tracking-wide" style={{ color: '#faf7f2' }}>
        {doubled.map((item, i) => (
          <span key={i} className="mx-8">
            <span className="opacity-60 mr-2">◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
