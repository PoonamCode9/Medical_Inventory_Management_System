import { useMemo, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { logoutUser } from '../api'
import '../admin/AdminStyles.css'

const menu = [
  { label: 'Dashboard', to: '/staff/dashboard', icon: 'chart' },
  {
    label: 'Inventory',
    icon: 'cubes',
    items: [
      { label: 'Inventory', to: '/staff/dashboard/inventory' },
      { label: 'Receive Inventory', to: '/staff/dashboard/receive-inventory' },
    ],
  },
  {
    label: 'Operations',
    icon: 'list',
    items: [
      { label: 'Tasks', to: '/staff/dashboard/tasks' },
      { label: 'Notifications', to: '/staff/dashboard/notifications' },
      { label: 'Alerts', to: '/staff/dashboard/alerts' },
    ],
  },
  { label: 'Settings', to: '/staff/dashboard/settings', icon: 'gear' },
]

function Icon({ kind, className }) {
  const commonProps = {
    className,
    'aria-hidden': true,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  switch (kind) {
    case 'chev-left':
      return (
        <svg {...commonProps}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
      )
    case 'chev-right':
      return (
        <svg {...commonProps}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )
    case 'search':
      return (
        <svg {...commonProps}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      )
    case 'bell':
      return (
        <svg {...commonProps}>
          <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
      )
    case 'cog':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-1.41 3.41h-.09a1.65 1.65 0 00-1.82.33 1.65 1.65 0 00-.41 1.8V23a2 2 0 01-4 0v-.09a1.65 1.65 0 00-.41-1.8 1.65 1.65 0 00-1.82-.33H8a2 2 0 01-1.41-3.41l.06-.06A1.65 1.65 0 007 15.4a1.65 1.65 0 00-1.8-.41H5.09a2 2 0 010-4H5.2a1.65 1.65 0 001.8-.41 1.65 1.65 0 00.33-1.82l-.06-.06A2 2 0 018.68 3.2h.09a1.65 1.65 0 001.82-.33A1.65 1.65 0 0021 5.09V5a2 2 0 010 4h-.09a1.65 1.65 0 00-1.8.41" />
        </svg>
      )
    default:
      return (
        <svg {...commonProps}>
          <rect x="3" y="3" width="18" height="18" rx="4" />
        </svg>
      )
  }
}

function MenuIcon({ icon, className }) {
  switch (icon) {
    case 'chart':
      return (
        <svg
          {...{ className }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="3" y1="3" x2="3" y2="21" />
          <line x1="21" y1="21" x2="21" y2="11" />
          <polyline points="3 15 9 11 13 13 21 5" />
        </svg>
      )
    case 'cubes':
      return (
        <svg
          {...{ className }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73L13 3a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 3a2 2 0 0 0 2 0l7-3A2 2 0 0 0 21 16Z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22" x2="12" y2="12" />
        </svg>
      )
    case 'list':
      return (
        <svg
          {...{ className }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
        </svg>
      )
    case 'gear':
      return (
        <svg
          {...{ className }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 01-1.41 3.41h-.09a1.65 1.65 0 0 0-1.82.33 1.65 1.65 0 0 0-.41 1.8V23a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-.41-1.8 1.65 1.65 0 0 0-1.82-.33H8a2 2 0 0 1-1.41-3.41l.06-.06A1.65 1.65 0 007 15.4a1.65 1.65 0 0 0-1.8-.41H5.09a2 2 0 0 1 0-4H5.2a1.65 1.65 0 0 0 1.8-.41 1.65 1.65 0 0 0 .33-1.82l-.06-.06A2 2 0 0 1 8.68 3.2h.09a1.65 1.65 0 0 0 1.82-.33A1.65 1.65 0 0 0 12 2v0" />
        </svg>
      )
    default:
      return (
        <svg
          {...{ className }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="4" />
        </svg>
      )
  }
}

export default function StaffLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const content = useMemo(() => children, [children])
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/login', { replace: true })
  }

  return (
    <div className="bb-admin-shell">
      <aside
        className={collapsed ? 'bb-sidebar bb-sidebar--collapsed' : 'bb-sidebar'}
      >
        <div className="bb-sidebar-top">
          <div className="bb-brand">
            <div className="bb-brand-mark">MS</div>
            {!collapsed && (
              <div>
                <div className="bb-brand-name">MediStock</div>
                <div className="bb-brand-sub">Staff Console</div>
              </div>
            )}
          </div>

          <button
            type="button"
            className="bb-sidebar-toggle"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon kind={collapsed ? 'chev-right' : 'chev-left'} className="bb-icon" />
          </button>
        </div>

        <nav className="bb-sidebar-nav">
          {menu.map((item) => {
            const IconComp = item.icon
            if (item.items) {
              return (
                <div key={item.label} className="bb-nav-group">
                  <div className="bb-nav-group-title">
                    <MenuIcon icon={IconComp} className="bb-nav-icon" />
                    {!collapsed && <span>{item.label}</span>}
                  </div>

                  {!collapsed && (
                    <div className="bb-nav-sub">
                      {item.items.map((sub) => (
                        <NavLink
                          key={sub.to}
                          to={sub.to}
                          className={({ isActive }) =>
                            isActive ? 'bb-nav-link bb-nav-link--active' : 'bb-nav-link'
                          }
                        >
                          <span className="bb-nav-sub-dot" />
                          <span>{sub.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? 'bb-nav-link bb-nav-link--active' : 'bb-nav-link'
                }
              >
                <MenuIcon icon={IconComp} className="bb-nav-icon" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            )
          })}
        </nav>
      </aside>

      <div className="bb-main">
        <header className="bb-topbar">
          <div className="bb-topbar-left">
            <div className="bb-search">
              <Icon kind="search" className="bb-search-icon" />
              <input
                type="text"
                placeholder="Search medicines, suppliers, batches, invoices..."
                className="bb-search-input"
              />
            </div>
          </div>

          <div className="bb-topbar-right">
            

            <div className="bb-profile">
              <div className="bb-avatar" aria-hidden="true">
                S
              </div>
              <div className="bb-profile-meta">
                <div className="bb-profile-name">Staff</div>
                <div className="bb-profile-role">Warehouse Operations</div>
              </div>
            </div>

            <button
              type="button"
              className="bb-icon-btn"
              aria-label="Settings shortcut"
              onClick={() => navigate('/staff/dashboard/settings')}
            >
              <Icon kind="cog" className="bb-icon" />
            </button>

            <button
              type="button"
              className="bb-btn bb-btn--ghost bb-btn--sm"
              onClick={handleLogout}
              aria-label="Log out"
              style={{ borderColor: 'rgba(239, 68, 68, .35)', color: '#dc2626' }}
            >
              Log out
            </button>
          </div>
        </header>

        <main className="bb-main-scroll">{content}</main>
      </div>
    </div>
  )
}

