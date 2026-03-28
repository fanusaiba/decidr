import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { decisionsAPI } from '../api/services'

const CATEGORIES = [
  'Health & Fitness', 'Productivity', 'Career', 'Relationships',
  'Finance', 'Habits', 'Learning', 'Mental Health', 'Other',
]

const METRICS = [
  { key: 'baselineProductivity', label: 'Productivity', description: 'How productive do you feel daily?' },
  { key: 'baselineMood', label: 'Mood', description: 'Your general emotional state' },
  { key: 'baselineEnergy', label: 'Energy', description: 'Physical and mental energy levels' },
]

export default function LogDecision() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Habits',
    startedAt: new Date().toISOString().slice(0, 10),
    baselineProductivity: 5,
    baselineMood: 5,
    baselineEnergy: 5,
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) { setError('Please enter a decision title'); return }
    setLoading(true)
    try {
      const res = await decisionsAPI.create(form)
      navigate(`/decisions/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to log decision')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="font-display text-4xl mb-2">Log a decision</h2>
        <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>
          Record what you're changing and your current baseline. Check in over time to see the real impact.
        </p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg text-sm" style={{ background: 'var(--color-red-light)', color: 'var(--color-red)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Decision details */}
        <div className="card p-6 space-y-4">
          <h3 className="font-display text-lg">The decision</h3>

          <div>
            <label className="label">What are you changing?</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Started waking up at 5am every day"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Why? (optional)</label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="What motivated this decision? What outcome are you hoping for?"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select
                className="input"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Start date</label>
              <input
                type="date"
                className="input"
                value={form.startedAt}
                onChange={(e) => set('startedAt', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Baseline metrics */}
        <div className="card p-6">
          <div className="mb-5">
            <h3 className="font-display text-lg">Baseline metrics</h3>
            <p className="text-sm mt-1" style={{ color: 'var(--color-ink-muted)' }}>
              Rate yourself <em>before</em> this decision. This is your starting point — all future check-ins are measured against this.
            </p>
          </div>

          <div className="space-y-5">
            {METRICS.map(({ key, label, description }) => (
              <div key={key}>
                <div className="flex justify-between items-baseline mb-2">
                  <div>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{label}</span>
                    <span className="text-xs ml-2" style={{ color: 'var(--color-ink-faint)' }}>{description}</span>
                  </div>
                  <span className="text-lg font-display" style={{ color: 'var(--color-ink)' }}>{form[key]}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={form[key]}
                  onChange={(e) => set(key, parseInt(e.target.value))}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>Poor</span>
                  <span className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>Excellent</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex-1" disabled={loading}>
            {loading ? 'Logging…' : 'Log this decision →'}
          </button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
