import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../api'
import '../admin/AdminStyles.css'

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

export default function SupplierLayout({ children }) {
  const [collapsed] = useState(false) // kept for parity; supplier has no sidebar
  const content = useMemo(() => children, [children])
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/login', { replace: true })
  }

  return (
    <div className={collapsed ? 'bb-admin-shell' : 'bb-admin-shell'}>
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
            <button type="button" className="bb-btn bb-btn--ghost">
              <span className="bb-btn-icon">+</span>
              <span>Quick Add</span>
            </button>

            <div className="bb-profile">
              <div className="bb-avatar" aria-hidden="true">
                S
              </div>
              <div className="bb-profile-meta">
                <div className="bb-profile-name">Supplier</div>
                <div className="bb-profile-role">Supply Operations</div>
              </div>
            </div>

            <button type="button" className="bb-icon-btn" aria-label="Settings shortcut">
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

