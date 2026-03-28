import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useDecisions } from '../hooks/useDecisions'
import DecisionCard from '../components/DecisionCard'
import EmptyState from '../components/ui/EmptyState'
import { differenceInDays } from 'date-fns'

export default function Dashboard() {
  const { user } = useAuth()
  const { decisions, loading, error, remove } = useDecisions()

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  // Quick stats
  const totalDays = decisions.reduce(
    (sum, d) => sum + differenceInDays(new Date(), new Date(d.startedAt)), 0
  )
  const decisionsWithData = decisions.filter((d) => d.checkins?.length >= 2)
  const positiveDecisions = decisionsWithData.filter((d) => {
    const b = d.checkins[0], l = d.checkins[d.checkins.length - 1]
    return (l.productivity + l.mood + l.energy) > (b.productivity + b.mood + b.energy)
  })

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-700 rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="card p-6 text-center">
      <p className="text-sm" style={{ color: 'var(--color-red)' }}>{error}</p>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="font-display text-4xl mb-1">
            {getGreeting()}, {user?.name?.split(' ')[0]}
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>
            {decisions.length === 0
              ? 'Start by logging your first decision below.'
              : `Tracking ${decisions.length} decision${decisions.length !== 1 ? 's' : ''} · ${totalDays} total days of data`}
          </p>
        </div>
        <Link to="/log" className="btn-primary shrink-0">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" strokeLinecap="round" />
          </svg>
          Log decision
        </Link>
      </div>

      {/* Summary stats row — only when there's data */}
      {decisions.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: 'Decisions tracked',
              value: decisions.length,
              sub: 'active',
            },
            {
              label: 'Total days of data',
              value: totalDays,
              sub: 'across all decisions',
            },
            {
              label: 'Positive impact',
              value: decisionsWithData.length > 0
                ? `${Math.round((positiveDecisions.length / decisionsWithData.length) * 100)}%`
                : '—',
              sub: 'of measured decisions',
            },
          ].map(({ label, value, sub }) => (
            <div key={label} className="card p-4">
              <p className="text-xs mb-2" style={{ color: 'var(--color-ink-muted)' }}>{label}</p>
              <p className="font-display text-3xl" style={{ color: 'var(--color-ink)' }}>{value}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-ink-faint)' }}>{sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {decisions.length === 0 && (
        <EmptyState
          icon={
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24" style={{ color: 'var(--color-ink-muted)' }}>
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          title="No decisions tracked yet"
          description="Log a decision with your current baseline, then check in over time to see how it shaped your life."
          action="/log"
          actionLabel="Log your first decision"
        />
      )}

      {/* Decision cards */}
      {decisions.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl">Your decisions</h3>
            {decisions.length > 0 && (
              <Link
                to="/analytics"
                className="text-sm flex items-center gap-1"
                style={{ color: 'var(--color-ink-muted)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-ink)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-ink-muted)'}
              >
                View analytics
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            )}
          </div>
          <div className="grid gap-4">
            {decisions.map((d) => (
              <DecisionCard key={d.id} decision={d} onDelete={remove} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
