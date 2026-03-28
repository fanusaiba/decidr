import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/', label: 'Dashboard', icon: HomeIcon, end: true },
  { to: '/log', label: 'Log Decision', icon: PlusIcon },
  { to: '/analytics', label: 'Analytics', icon: ChartIcon },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className="w-56 shrink-0 flex flex-col"
        style={{ background: 'var(--color-surface-raised)', borderRight: '1px solid var(--color-border)', position: 'sticky', top: 0, height: '100vh' }}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h1 className="font-display text-2xl" style={{ color: 'var(--color-ink)' }}>Decidr</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-faint)' }}>Track what matters</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                  isActive ? 'font-medium' : 'font-normal'
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? 'var(--color-surface-sunken)' : 'transparent',
                color: isActive ? 'var(--color-ink)' : 'var(--color-ink-muted)',
              })}
              onMouseEnter={(e) => { if (!e.currentTarget.classList.contains('font-medium')) e.currentTarget.style.background = 'var(--color-surface-sunken)' }}
              onMouseLeave={(e) => { if (!e.currentTarget.classList.contains('font-medium')) e.currentTarget.style.background = 'transparent' }}
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: Settings + User */}
        <div className="px-3 pb-3 border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
          <NavLink
            to="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150"
            style={({ isActive }) => ({
              background: isActive ? 'var(--color-surface-sunken)' : 'transparent',
              color: isActive ? 'var(--color-ink)' : 'var(--color-ink-muted)',
            })}
          >
            <SettingsIcon />
            Settings
          </NavLink>
        </div>

        <div className="px-4 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
              style={{ background: 'var(--color-surface-sunken)', color: 'var(--color-ink)' }}
            >
              {user?.name?.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--color-ink)' }}>{user?.name}</p>
              <p className="text-xs truncate" style={{ color: 'var(--color-ink-faint)' }}>{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors"
            style={{ color: 'var(--color-ink-muted)' }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--color-red)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--color-ink-muted)')}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto" style={{ background: 'var(--color-surface)' }}>
        <div className="max-w-4xl mx-auto px-8 py-8 page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

function HomeIcon() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M3 12L12 3l9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function PlusIcon() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M12 4v16m8-8H4" strokeLinecap="round" />
    </svg>
  )
}
function ChartIcon() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M3 3v18h18M7 16l4-4 4 4 4-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function SettingsIcon() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
