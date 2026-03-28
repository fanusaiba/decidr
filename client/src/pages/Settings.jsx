import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import api from '../api/axios'

export default function Settings() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [nameForm, setNameForm] = useState({ name: user?.name || '' })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [nameLoading, setNameLoading] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)

  const handleName = async (e) => {
    e.preventDefault()
    setNameLoading(true)
    try {
      await api.put('/auth/profile', { name: nameForm.name })
      toast('Name updated', 'success')
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to update', 'error')
    } finally { setNameLoading(false) }
  }

  const handlePassword = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirm) {
      toast('Passwords do not match', 'error')
      return
    }
    if (pwForm.newPassword.length < 6) {
      toast('Password must be at least 6 characters', 'error')
      return
    }
    setPwLoading(true)
    try {
      await api.put('/auth/password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      })
      toast('Password changed', 'success')
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to change password', 'error')
    } finally { setPwLoading(false) }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h2 className="font-display text-4xl mb-2">Settings</h2>
        <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>Manage your account</p>
      </div>

      {/* Profile */}
      <div className="card p-6 mb-5">
        <h3 className="font-display text-lg mb-4">Profile</h3>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-5 pb-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-medium"
            style={{ background: 'var(--color-surface-sunken)', color: 'var(--color-ink)' }}
          >
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-medium" style={{ color: 'var(--color-ink)' }}>{user?.name}</p>
            <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleName} className="space-y-4">
          <div>
            <label className="label">Display name</label>
            <input
              type="text"
              className="input"
              value={nameForm.name}
              onChange={(e) => setNameForm({ name: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-ghost" disabled={nameLoading}>
            {nameLoading ? 'Saving…' : 'Update name'}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="card p-6 mb-5">
        <h3 className="font-display text-lg mb-4">Change password</h3>
        <form onSubmit={handlePassword} className="space-y-4">
          <div>
            <label className="label">Current password</label>
            <input type="password" className="input" placeholder="••••••••"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
              required />
          </div>
          <div>
            <label className="label">New password</label>
            <input type="password" className="input" placeholder="Min. 6 characters"
              value={pwForm.newPassword}
              onChange={(e) => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
              required />
          </div>
          <div>
            <label className="label">Confirm new password</label>
            <input type="password" className="input" placeholder="Repeat new password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm(f => ({ ...f, confirm: e.target.value }))}
              required />
          </div>
          <button type="submit" className="btn-ghost" disabled={pwLoading}>
            {pwLoading ? 'Changing…' : 'Change password'}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="card p-6" style={{ borderColor: 'rgba(153,27,27,0.2)' }}>
        <h3 className="font-display text-lg mb-1" style={{ color: 'var(--color-red)' }}>Danger zone</h3>
        <p className="text-sm mb-4" style={{ color: 'var(--color-ink-muted)' }}>
          These actions are permanent and cannot be undone.
        </p>
        <button
          onClick={handleLogout}
          className="btn-ghost text-sm"
          style={{ color: 'var(--color-red)', borderColor: 'rgba(153,27,27,0.3)' }}
        >
          Sign out of all devices
        </button>
      </div>
    </div>
  )
}
