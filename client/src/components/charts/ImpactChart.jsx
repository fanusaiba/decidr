import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { differenceInDays } from 'date-fns'

const METRICS = [
  { key: 'Productivity', color: '#2d6a4f' },
  { key: 'Mood',         color: '#1e3a5f' },
  { key: 'Energy',       color: '#92400e' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="px-3 py-2 rounded-xl text-xs shadow-sm"
      style={{
        background: 'var(--color-surface-raised)',
        border: '1px solid var(--color-border)',
        minWidth: '140px',
      }}
    >
      <p className="font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-medium" style={{ color: 'var(--color-ink)' }}>{p.value}/10</span>
        </div>
      ))}
    </div>
  )
}

export default function ImpactChart({ checkins, startedAt }) {
  if (!checkins || checkins.length < 2) return null

  const baseline = checkins[0]
  const data = checkins.map((c) => ({
    label: `Day ${differenceInDays(new Date(c.loggedAt), new Date(baseline.loggedAt))}`,
    Productivity: c.productivity,
    Mood: c.mood,
    Energy: c.energy,
  }))

  return (
    <ResponsiveContainer width="100%" height={270}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[1, 10]}
          ticks={[1, 3, 5, 7, 10]}
          tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '12px', color: 'var(--color-ink-muted)', paddingTop: '12px' }}
        />
        {/* Reference lines at baseline values */}
        <ReferenceLine y={baseline.productivity} stroke="#2d6a4f" strokeDasharray="4 4" strokeOpacity={0.35} />
        <ReferenceLine y={baseline.mood} stroke="#1e3a5f" strokeDasharray="4 4" strokeOpacity={0.35} />
        <ReferenceLine y={baseline.energy} stroke="#92400e" strokeDasharray="4 4" strokeOpacity={0.35} />

        {METRICS.map(({ key, color }) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={color}
            strokeWidth={2.5}
            dot={{ r: 4, fill: color, strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
