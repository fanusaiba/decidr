import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { differenceInDays } from 'date-fns'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="px-3 py-2 rounded-xl text-xs"
      style={{
        background: 'var(--color-surface-raised)',
        border: '1px solid var(--color-border)',
        minWidth: '150px',
      }}
    >
      <p className="font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-medium" style={{ color: p.value >= 0 ? '#2d6a4f' : '#991b1b' }}>
            {p.value > 0 ? '+' : ''}{p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function DeltaChart({ checkins }) {
  if (!checkins || checkins.length < 2) return null

  const baseline = checkins[0]
  const data = checkins.map((c) => ({
    label: `Day ${differenceInDays(new Date(c.loggedAt), new Date(baseline.loggedAt))}`,
    Productivity: c.productivity - baseline.productivity,
    Mood: c.mood - baseline.mood,
    Energy: c.energy - baseline.energy,
  }))

  const METRICS = [
    { key: 'Productivity', color: '#2d6a4f', fill: 'rgba(45,106,79,0.08)' },
    { key: 'Mood', color: '#1e3a5f', fill: 'rgba(30,58,95,0.08)' },
    { key: 'Energy', color: '#92400e', fill: 'rgba(146,64,14,0.08)' },
  ]

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }} axisLine={false} tickLine={false} />
        <ReferenceLine y={0} stroke="var(--color-border-strong)" strokeWidth={1.5} />
        <Tooltip content={<CustomTooltip />} />
        {METRICS.map(({ key, color, fill }) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke={color}
            fill={fill}
            strokeWidth={2}
            dot={{ r: 3, fill: color, strokeWidth: 0 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}
