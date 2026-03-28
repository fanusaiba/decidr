import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { decisionsAPI, checkinsAPI } from '../api/services'
import { useToast } from '../components/ui/Toast'
import Modal from '../components/ui/Modal'
import MetricSlider from '../components/ui/MetricSlider'
import ImpactChart from '../components/charts/ImpactChart'
import DeltaChart from '../components/charts/DeltaChart'
import { format, differenceInDays } from 'date-fns'

const CATEGORIES = [
  'Health & Fitness','Productivity','Career','Relationships',
  'Finance','Habits','Learning','Mental Health','Other',
]
const METRIC_KEYS   = ['productivity', 'mood', 'energy']
const METRIC_COLORS = { productivity: '#2d6a4f', mood: '#1e3a5f', energy: '#92400e' }

export default function DecisionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [decision, setDecision]         = useState(null)
  const [loading, setLoading]           = useState(true)
  const [checkinOpen, setCheckinOpen]   = useState(false)
  const [checkinForm, setCheckinForm]   = useState({ productivity: 5, mood: 5, energy: 5, notes: '' })
  const [checkinLoading, setCheckinLoading] = useState(false)
  const [editOpen, setEditOpen]         = useState(false)
  const [editForm, setEditForm]         = useState({ title: '', description: '', category: '' })
  const [editLoading, setEditLoading]   = useState(false)
  const [chartTab, setChartTab]         = useState('raw')

  const load = () => {
    setLoading(true)
    decisionsAPI.getOne(id)
      .then((res) => {
        setDecision(res.data)
        setEditForm({
          title:       res.data.title,
          description: res.data.description || '',
          category:    res.data.category,
        })
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [id])

  const handleCheckin = async (e) => {
    e.preventDefault()
    setCheckinLoading(true)
    try {
      await checkinsAPI.create(id, checkinForm)
      toast('Check-in saved!', 'success')
      setCheckinOpen(false)
      setCheckinForm({ productivity: 5, mood: 5, energy: 5, notes: '' })
      load()
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to save', 'error')
    } finally { setCheckinLoading(false) }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    setEditLoading(true)
    try {
      await decisionsAPI.update(id, editForm)
      toast('Decision updated', 'success')
      setEditOpen(false)
      load()
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to update', 'error')
    } finally { setEditLoading(false) }
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${decision.title}" and all its check-ins?`)) return
    try {
      await decisionsAPI.delete(id)
      toast('Decision deleted', 'success')
      navigate('/')
    } catch { toast('Failed to delete', 'error') }
  }

  // MongoDB: pass both decisionId (id) and the subdoc _id
  const handleDeleteCheckin = async (checkinId) => {
    if (!confirm('Remove this check-in?')) return
    try {
      await checkinsAPI.delete(id, checkinId)
      toast('Check-in removed', 'success')
      load()
    } catch { toast('Failed to remove', 'error') }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-700 rounded-full animate-spin" />
    </div>
  )
  if (!decision) return null

  const checkins   = decision.checkins || []
  const baseline   = checkins[0]
  const latest     = checkins[checkins.length - 1]
  const days       = differenceInDays(new Date(), new Date(decision.startedAt))
  const hasImpact  = checkins.length >= 2

  const getDelta   = (key) => hasImpact ? latest[key] - baseline[key] : null
  const fmtDelta   = (v) => v === null ? '—' : v > 0 ? `+${v}` : `${v}`
  const deltaClass = (v) => v === null ? 'badge-neutral' : v > 0 ? 'badge-up' : v < 0 ? 'badge-down' : 'badge-neutral'

  return (
    <div>
      {/* Back */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors"
        style={{ color: 'var(--color-ink-muted)' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--color-ink)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--color-ink-muted)'}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 12H5m7-7l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        All decisions
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: 'var(--color-surface-sunken)', color: 'var(--color-ink-muted)' }}>
              {decision.category}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>
              Started {format(new Date(decision.startedAt), 'MMM d, yyyy')} · {days} days running
            </span>
          </div>
          <h2 className="font-display text-3xl leading-tight">{decision.title}</h2>
          {decision.description && (
            <p className="text-sm mt-1.5" style={{ color: 'var(--color-ink-muted)' }}>{decision.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="btn-ghost" onClick={() => setEditOpen(true)}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Edit
          </button>
          <button className="btn-primary" onClick={() => setCheckinOpen(true)}>Check in today</button>
          <button className="btn-ghost" onClick={handleDelete} style={{ color: 'var(--color-red)' }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {METRIC_KEYS.map((key) => {
          const delta = getDelta(key)
          const cur   = latest ? latest[key] : baseline ? baseline[key] : null
          return (
            <div key={key} className="card p-5">
              <p className="text-xs uppercase tracking-widest mb-3"
                style={{ color: 'var(--color-ink-faint)', letterSpacing: '0.1em' }}>
                {key}
              </p>
              <div className="flex items-end gap-1 mb-2">
                <span className="font-display text-3xl">{cur ?? '—'}</span>
                <span className="text-sm mb-0.5" style={{ color: 'var(--color-ink-faint)' }}>/10</span>
              </div>
              <span className={deltaClass(delta)}>{fmtDelta(delta)} from baseline</span>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      {checkins.length >= 2 && (
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-xl">Progress over time</h3>
            <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--color-surface-sunken)' }}>
              {[['raw', 'Raw scores'], ['delta', 'Δ from baseline']].map(([tab, label]) => (
                <button key={tab} onClick={() => setChartTab(tab)}
                  className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                  style={{
                    background: chartTab === tab ? 'var(--color-surface-raised)' : 'transparent',
                    color: chartTab === tab ? 'var(--color-ink)' : 'var(--color-ink-muted)',
                    boxShadow: chartTab === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          {chartTab === 'raw'
            ? <ImpactChart checkins={checkins} startedAt={decision.startedAt} />
            : <DeltaChart  checkins={checkins} />}
          <p className="text-xs mt-3" style={{ color: 'var(--color-ink-faint)' }}>
            {chartTab === 'raw'
              ? 'Dashed lines show your baseline values.'
              : 'Values above 0 indicate improvement from your starting point.'}
          </p>
        </div>
      )}

      {/* Check-in history */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-xl">Check-in history</h3>
          <span className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>
            {checkins.length} entr{checkins.length === 1 ? 'y' : 'ies'}
          </span>
        </div>

        {checkins.length === 0 && (
          <p className="text-sm py-6 text-center" style={{ color: 'var(--color-ink-muted)' }}>
            No check-ins yet.
          </p>
        )}

        <div>
          {[...checkins].reverse().map((c) => {
            // MongoDB subdoc uses _id
            const checkinId  = c._id
            const isBaseline = checkinId === baseline?._id ||
                               c.notes === 'Baseline measurement'
            return (
              <div key={checkinId} className="flex items-start gap-5 py-4 border-b last:border-0 group"
                style={{ borderColor: 'var(--color-border)' }}>
                {/* Date */}
                <div className="shrink-0 w-14 text-right">
                  <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                    {format(new Date(c.loggedAt), 'MMM d')}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>
                    {format(new Date(c.loggedAt), 'yyyy')}
                  </p>
                </div>

                {/* Metrics */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {METRIC_KEYS.map((key) => (
                      <span key={key} className="text-xs px-2 py-1 rounded-lg"
                        style={{ background: 'var(--color-surface-sunken)', color: 'var(--color-ink-muted)' }}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:{' '}
                        <strong style={{ color: METRIC_COLORS[key] }}>{c[key]}</strong>/10
                      </span>
                    ))}
                    {isBaseline && <span className="badge-neutral">baseline</span>}
                  </div>
                  {c.notes && c.notes !== 'Baseline measurement' && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-muted)' }}>
                      "{c.notes}"
                    </p>
                  )}
                </div>

                {/* Delete button — hide on baseline */}
                {!isBaseline && (
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded"
                    onClick={() => handleDeleteCheckin(checkinId)}
                    style={{ color: 'var(--color-ink-faint)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-red)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-ink-faint)'}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Check-in Modal ── */}
      <Modal open={checkinOpen} onClose={() => setCheckinOpen(false)} title="Today's check-in">
        <p className="text-sm mb-5" style={{ color: 'var(--color-ink-muted)' }}>
          How are you doing since making this decision?
        </p>
        <form onSubmit={handleCheckin} className="space-y-5">
          {METRIC_KEYS.map((key) => (
            <MetricSlider key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={checkinForm[key]}
              onChange={(v) => setCheckinForm(f => ({ ...f, [key]: v }))} />
          ))}
          <div>
            <label className="label">Notes (optional)</label>
            <textarea className="input resize-none" rows={2} placeholder="Any reflections?"
              value={checkinForm.notes}
              onChange={e => setCheckinForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1" disabled={checkinLoading}>
              {checkinLoading ? 'Saving…' : 'Save check-in'}
            </button>
            <button type="button" className="btn-ghost" onClick={() => setCheckinOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>

      {/* ── Edit Modal ── */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit decision">
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input type="text" className="input" value={editForm.title}
              onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={3} value={editForm.description}
              onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={editForm.category}
              onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1" disabled={editLoading}>
              {editLoading ? 'Saving…' : 'Save changes'}
            </button>
            <button type="button" className="btn-ghost" onClick={() => setEditOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
