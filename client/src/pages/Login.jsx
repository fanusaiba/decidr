import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-surface)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-16" style={{ background: 'var(--color-ink)' }}>
        <div>
          <h1 className="font-display text-4xl text-white">Decidr</h1>
        </div>
        <div>
          <blockquote className="font-display text-3xl text-white leading-snug mb-6">
            "Most people track habits.<br />
            <em>You track impact.</em>"
          </blockquote>
          <div className="space-y-4">
            {[
              { label: 'Decision', val: 'Started waking up at 5am' },
              { label: 'After 30 days', val: 'Productivity +4 · Mood +3 · Energy +5' },
            ].map(({ label, val }) => (
              <div key={label} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</p>
                <p className="text-sm text-white font-medium">{val}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>© 2025 Decidr</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="font-display text-3xl mb-2">Welcome back</h2>
            <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>Sign in to your Decidr account</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: 'var(--color-red-light)', color: 'var(--color-red)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-ink-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-medium underline" style={{ color: 'var(--color-ink)' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
