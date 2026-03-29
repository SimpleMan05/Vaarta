export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pt-4 pb-4 flex items-center gap-3" style={{ borderTop: '4px solid var(--saffron)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--saffron)', borderTopColor: 'transparent' }} />
        <span className="font-sans text-xs tracking-widest uppercase font-semibold" style={{ color: 'var(--saffron)' }}>
          AI is translating &amp; adapting…
        </span>
      </div>

      <div className="space-y-3 pt-2">
        <div className="skeleton h-8 w-3/4 rounded" />
        <div className="skeleton h-8 w-1/2 rounded" />
      </div>

      <div className="space-y-2 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton rounded" style={{ height: '16px', width: `${85 + Math.sin(i * 1.3) * 12}%`, animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton h-16 rounded" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>

      <div className="space-y-2 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton rounded" style={{ height: '14px', width: `${70 + Math.cos(i * 1.7) * 20}%`, animationDelay: `${i * 0.12}s` }} />
        ))}
      </div>

      <p className="font-sans text-xs text-center pt-4" style={{ color: 'var(--text-muted)' }}>
        Culturally adapting content for your region… This takes 10–20 seconds.
      </p>
    </div>
  )
}
