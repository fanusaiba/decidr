import { Link } from 'react-router-dom'

export default function EmptyState({ icon, title, description, action, actionLabel }) {
  return (
    <div className="card p-14 text-center">
      {icon && (
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: 'var(--color-surface-sunken)' }}
        >
          {icon}
        </div>
      )}
      <h3 className="font-display text-xl mb-2">{title}</h3>
      {description && (
        <p className="text-sm max-w-xs mx-auto mb-6" style={{ color: 'var(--color-ink-muted)' }}>
          {description}
        </p>
      )}
      {action && (
        <Link to={action} className="btn-primary inline-flex">
          {actionLabel || 'Get started'}
        </Link>
      )}
    </div>
  )
}
