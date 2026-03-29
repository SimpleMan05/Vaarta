import { Link } from 'react-router-dom'
import { usePuter } from '../context/PuterContext'

export default function Footer() {
  const { status } = usePuter()

  return (
    <footer style={{ backgroundColor: 'var(--bg-inverse)', color: 'var(--text-inverse)' }} className="mt-16 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="border-b-2 border-t-4 mb-8 opacity-20" style={{ borderColor: 'var(--text-inverse)' }} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="font-display text-3xl font-black" style={{ color: 'var(--text-inverse)' }}>Vaarta</span>
              <span className="font-display text-lg font-bold italic" style={{ color: 'var(--saffron)' }}>वार्ता</span>
            </div>
            <p className="font-body text-sm leading-relaxed opacity-70" style={{ color: 'var(--text-inverse)' }}>
              Real-time, culturally-adapted translation of English business news into Hindi, Tamil, Telugu, and Bengali — for the next billion readers.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase mb-4 font-semibold" style={{ color: 'var(--saffron)' }}>Languages</h4>
            <ul className="space-y-2">
              {[
                { name: 'Hindi',   script: 'हिंदी',   region: 'North India' },
                { name: 'Tamil',   script: 'தமிழ்',   region: 'Tamil Nadu' },
                { name: 'Telugu',  script: 'తెలుగు',  region: 'Andhra & Telangana' },
                { name: 'Bengali', script: 'বাংলা',   region: 'West Bengal' },
              ].map(lang => (
                <li key={lang.name} className="flex items-center gap-3">
                  <span className="font-display text-base" style={{ color: 'var(--saffron)' }}>{lang.script}</span>
                  <span className="font-sans text-xs opacity-60" style={{ color: 'var(--text-inverse)' }}>{lang.region}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase mb-4 font-semibold" style={{ color: 'var(--saffron)' }}>Technology</h4>
            <ul className="space-y-2 font-sans text-xs opacity-60" style={{ color: 'var(--text-inverse)' }}>
              <li className="flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${status === 'ready' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                Puter.js AI — {status === 'ready' ? 'Connected' : status}
              </li>
              <li>Cultural context adaptation</li>
              <li>Regional economic framing</li>
              <li>React + Vite + Tailwind</li>
              <li>Zero-backend architecture</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-10 pt-6 flex justify-between items-center opacity-30" style={{ borderColor: 'var(--text-inverse)' }}>
          <p className="font-sans text-xs" style={{ color: 'var(--text-inverse)' }}>
            © 2025 Vaarta. Prototype build. Not affiliated with Economic Times.
          </p>
          <Link to="/translate" className="font-sans text-xs font-semibold tracking-widest uppercase transition-colors" style={{ color: 'var(--saffron)' }}>
            Launch Engine →
          </Link>
        </div>
      </div>
    </footer>
  )
}
