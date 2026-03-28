import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--color-surface)' }}>
      <div className="text-center max-w-sm">
        <p className="font-display text-8xl mb-4" style={{ color: 'var(--color-border-strong)' }}>404</p>
        <h2 className="font-display text-2xl mb-3">Page not found</h2>
        <p className="text-sm mb-8" style={{ color: 'var(--color-ink-muted)' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary inline-flex">
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
