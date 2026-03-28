import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import { analyticsAPI, decisionsAPI } from '../api/services'
import { differenceInDays } from 'date-fns'

export default function Analytics() {
  const [summary, setSummary] = useState(null)
  const [decisions, setDecisions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([analyticsAPI.summary(), decisionsAPI.getAll()])
      .then(([sumRes, decRes]) => {
        setSummary(sumRes.data)
        setDecisions(decRes.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-700 rounded-full animate-spin" />
    </div>
  )

  const noData = !summary || summary.totalDecisions === 0

  // Per-decision impact scores for bar chart
  const decisionImpact = decisions
    .filter(d => d.checkins?.length >= 2)
    .map(d => {
      const base = d.checkins[0]
      const latest = d.checkins[d.checkins.length - 1]
      return {
        name: d.title.length > 22 ? d.title.slice(0, 22) + '…' : d.title,
        id: d.id,
        Productivity: latest.productivity - base.productivity,
        Mood: latest.mood - base.mood,
        Energy: latest.energy - base.energy,
        total: (latest.productivity + latest.mood + latest.energy) - (base.productivity + base.mood + base.energy),
      }
    })
    .sort((a, b) => b.total - a.total)

  const radarData = [
    { metric: 'Productivity', value: summary?.avgProductivityGain ?? 0 },
    { metric: 'Mood', value: summary?.avgMoodGain ?? 0 },
    { metric: 'Energy', value: summary?.avgEnergyGain ?? 0 },
  ]

  const fmtGain = (v) => v >= 0 ? `+${v}` : `${v}`
  const gainClass = (v) => v > 0 ? 'text-green-700' : v < 0 ? 'text-red-700' : ''

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-4xl mb-2">Analytics</h2>
        <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>
          The cumulative impact of all your tracked decisions.
        </p>
      </div>

      {noData ? (
        <div className="card p-12 text-center">
          <h3 className="font-display text-xl mb-2">Not enough data yet</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--color-ink-muted)' }}>
            Log decisions and check in a few times to see analytics here.
          </p>
          <Link to="/log" className="btn-primary inline-flex">Log your first decision</Link>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Decisions tracked', value: summary.totalDecisions, sub: 'total' },
              { label: 'Avg productivity gain', value: fmtGain(summary.avgProductivityGain), sub: 'pts from baseline', cls: gainClass(summary.avgProductivityGain) },
              { label: 'Avg mood gain', value: fmtGain(summary.avgMoodGain), sub: 'pts from baseline', cls: gainClass(summary.avgMoodGain) },
              { label: 'Avg energy gain', value: fmtGain(summary.avgEnergyGain), sub: 'pts from baseline', cls: gainClass(summary.avgEnergyGain) },
            ].map(({ label, value, sub, cls }) => (
              <div key={label} className="card p-4">
                <p className="text-xs mb-2" style={{ color: 'var(--color-ink-muted)' }}>{label}</p>
                <p className={`font-display text-3xl ${cls || ''}`}>{value}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-ink-faint)' }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Best decision */}
          {summary.bestDecision && (
            <div className="card p-5 mb-6 flex items-center gap-4" style={{ borderColor: 'var(--color-accent)', borderWidth: '1px' }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'var(--color-accent-light)' }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--color-accent)' }}>
                  <path d="M11.49 3.17c.43-1.03 1.59-1.03 2.02 0l1.95 4.67 4.97.43c1.1.1 1.55 1.52.74 2.28l-3.74 3.42 1.1 4.95c.25 1.1-.92 1.97-1.87 1.4L12 17.77l-4.66 2.55c-.95.57-2.12-.3-1.87-1.4l1.1-4.95L2.83 10.55c-.8-.76-.36-2.18.74-2.28l4.97-.43 1.95-4.67z" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-xs mb-0.5" style={{ color: 'var(--color-accent)' }}>Best decision</p>
                <Link to={`/decisions/${summary.bestDecision.id}`} className="font-medium hover:underline" style={{ fontFamily: 'DM Serif Display', color: 'var(--color-ink)' }}>
                  {summary.bestDecision.title}
                </Link>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-muted)' }}>
                  Total impact: {fmtGain(summary.bestDecision.totalDelta)} pts
                </p>
              </div>
            </div>
          )}

          {/* Per-decision impact */}
          {decisionImpact.length >= 2 && (
            <div className="card p-6 mb-6">
              <h3 className="font-display text-lg mb-4">Impact per decision</h3>
              <ResponsiveContainer width="100%" height={Math.max(180, decisionImpact.length * 50)}>
                <BarChart data={decisionImpact} layout="vertical" barSize={8} barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }} />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-surface-raised)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="Productivity" fill="#2d6a4f" radius={[0, 3, 3, 0]} />
                  <Bar dataKey="Mood" fill="#1e3a5f" radius={[0, 3, 3, 0]} />
                  <Bar dataKey="Energy" fill="#92400e" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-3">
                {[['Productivity', '#2d6a4f'], ['Mood', '#1e3a5f'], ['Energy', '#92400e']].map(([l, c]) => (
                  <span key={l} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                    <span className="w-2 h-2 rounded-sm inline-block" style={{ background: c }} />{l}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Category breakdown */}
          {summary.categoryBreakdown?.length > 0 && (
            <div className="card p-6">
              <h3 className="font-display text-lg mb-4">Impact by category</h3>
              <div className="space-y-3">
                {summary.categoryBreakdown
                  .sort((a, b) => b.avgImpact - a.avgImpact)
                  .map(({ category, avgImpact, count }) => {
                    const pct = Math.min(100, Math.max(0, ((avgImpact + 10) / 20) * 100))
                    return (
                      <div key={category}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm" style={{ color: 'var(--color-ink)' }}>{category}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>{count} decision{count > 1 ? 's' : ''}</span>
                            <span className={`text-sm font-medium ${gainClass(avgImpact)}`}>{fmtGain(avgImpact)} pts</span>
                          </div>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-sunken)' }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              background: avgImpact >= 0 ? 'var(--color-accent)' : 'var(--color-red)',
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
