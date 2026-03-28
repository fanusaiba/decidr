import { useNavigate } from 'react-router-dom'
import { differenceInDays } from 'date-fns'

const getDeltaClass = (v) => (v > 0 ? 'badge-up' : v < 0 ? 'badge-down' : 'badge-neutral')
const fmt = (v) => (v > 0 ? `+${v}` : `${v}`)

export default function DecisionCard({ decision, onDelete }) {
  const navigate = useNavigate()

  const checkins = decision.checkins || []
  const hasData = checkins.length >= 2
  const baseline = checkins[0]
  const latest = checkins[checkins.length - 1]
  const days = differenceInDays(new Date(), new Date(decision.startedAt))

  const impact = hasData
    ? {
        prod: latest.productivity - baseline.productivity,
        mood: latest.mood - baseline.mood,
        energy: latest.energy - baseline.energy,
      }
    : null

  return (
    <div
      className="card p-5 cursor-pointer transition-all duration-150 group"
      style={{ '--tw-shadow': '0 1px 8px rgba(0,0,0,0.06)' }}
      onClick={() => navigate(`/decisions/${decision.id}`)}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '')}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Category + days */}
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'var(--color-surface-sunken)', color: 'var(--color-ink-muted)' }}
            >
              {decision.category}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>
              {days}d running
            </span>
            <span className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>
              · {checkins.length} check-in{checkins.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-base font-medium truncate mb-1"
            style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--color-ink)' }}
          >
            {decision.title}
          </h3>

          {/* Description */}
          {decision.description && (
            <p
              className="text-xs line-clamp-1"
              style={{ color: 'var(--color-ink-muted)' }}
            >
              {decision.description}
            </p>
          )}
        </div>

        {/* Impact badges */}
        <div className="shrink-0 flex flex-col items-end gap-1.5">
          {impact ? (
            <>
              <span className={getDeltaClass(impact.prod)}>Prod {fmt(impact.prod)}</span>
              <span className={getDeltaClass(impact.mood)}>Mood {fmt(impact.mood)}</span>
              <span className={getDeltaClass(impact.energy)}>Energy {fmt(impact.energy)}</span>
            </>
          ) : (
            <span className="badge-neutral">Awaiting data</span>
          )}
        </div>
      </div>

      {/* Progress bar — days active */}
      <div className="mt-4">
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-sunken)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(100, (days / 90) * 100)}%`,
              background: impact && (impact.prod + impact.mood + impact.energy) > 0
                ? 'var(--color-accent)'
                : 'var(--color-border-strong)',
            }}
          />
        </div>
        <p className="text-xs mt-1" style={{ color: 'var(--color-ink-faint)' }}>
          {Math.min(days, 90)}/90 days
        </p>
      </div>
    </div>
  )
}
