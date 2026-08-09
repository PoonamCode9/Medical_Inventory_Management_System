import { useEffect, useState } from 'react'
import { fetchCurrentUser, changePassword } from '../api'

const roleToneMap = {
  ADMIN: 'bb-status--ok',
  Admin: 'bb-status--ok',
  PHARMACIST: 'bb-status--warn',
  Pharmacist: 'bb-status--warn',
  STAFF: 'bb-status--warn',
  Staff: 'bb-status--warn',
  SUPPLIER: 'bb-status--ok',
  Supplier: 'bb-status--ok',
}

export default function SettingsContent() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswords, setShowPasswords] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadUser = async () => {
    setLoading(true)
    setLoadError('')
    try {
      const data = await fetchCurrentUser()
      setUser(data)
    } catch (e) {
      setLoadError(e?.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters long')
      return
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirmation do not match')
      return
    }

    setSubmitting(true)
    try {
      const res = await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      setMessage(res?.message || 'Password changed successfully')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err?.message || 'Failed to change password')
    } finally {
      setSubmitting(false)
    }
  }

  const role = user?.role || 'USER'
  const roleTone = roleToneMap[role] || 'bb-status--ok'

  return (
    <div className="bb-main-content">
      <div className="bb-page-header">
        <div>
          <h1 className="bb-page-title">Settings</h1>
          <p className="bb-page-subtitle">View your account details and update your password.</p>
        </div>
      </div>

      {loadError && (
        <div className="bb-card bb-card-body" style={{ borderColor: 'rgba(239, 68, 68, .35)' }}>
          <div className="bb-strong" style={{ color: '#dc2626' }}>{loadError}</div>
        </div>
      )}

      <div className="bb-two-col" style={{ marginTop: 14 }}>
        {/* Profile details */}
        <div className="bb-card">
          <div className="bb-card-header">
            <div>
              <div className="bb-card-title">Profile Details</div>
              <div className="bb-card-sub">Your account information</div>
            </div>
          </div>

          <div className="bb-card-body">
            {loading ? (
              <div className="bb-muted">Loading profile...</div>
            ) : user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label className="bb-label">Full Name</label>
                  <input
                    className="bb-input"
                    value={user.name || ''}
                    readOnly
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="bb-label">Email</label>
                  <input
                    className="bb-input"
                    value={user.email || ''}
                    readOnly
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="bb-label">Role</label>
                  <div>
                    <span className={`bb-status ${roleTone}`}>{role}</span>
                  </div>
                </div>

                <div>
                  <label className="bb-label">Password</label>
                  <input className="bb-input" defaultValue="••••••••••" readOnly />
                  <div className="bb-muted" style={{ marginTop: 6, fontSize: 12 }}>
                    For security reasons, your password is not displayed. Use the form on the right to change it.
                  </div>
                </div>
              </div>
            ) : (
              <div className="bb-muted">Unable to load profile.</div>
            )}
          </div>
        </div>

        {/* Change password */}
        <div className="bb-card">
          <div className="bb-card-header">
            <div>
              <div className="bb-card-title">Change Password</div>
              <div className="bb-card-sub">Update your account password</div>
            </div>
          </div>

          <div className="bb-card-body">
            {message && (
              <div className="bb-card bb-card-body" style={{ marginBottom: 14, borderColor: 'rgba(34, 197, 94, .35)' }}>
                <div className="bb-strong" style={{ color: '#16a34a' }}>{message}</div>
              </div>
            )}
            {error && (
              <div className="bb-card bb-card-body" style={{ marginBottom: 14, borderColor: 'rgba(239, 68, 68, .35)' }}>
                <div className="bb-strong" style={{ color: '#dc2626' }}>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label className="bb-label">Current Password</label>
                  <input
                    className="bb-input"
                    type={showPasswords ? 'text' : 'password'}
                    value={form.currentPassword}
                    onChange={handleChange('currentPassword')}
                    placeholder="Enter current password"
                    required
                    autoComplete="current-password"
                  />
                </div>

                <div>
                  <label className="bb-label">New Password</label>
                  <input
                    className="bb-input"
                    type={showPasswords ? 'text' : 'password'}
                    value={form.newPassword}
                    onChange={handleChange('newPassword')}
                    placeholder="Enter a new password"
                    required
                    minLength={3}
                    autoComplete="new-password"
                  />
                </div>

                <div>
                  <label className="bb-label">Confirm New Password</label>
                  <input
                    className="bb-input"
                    type={showPasswords ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    placeholder="Re-enter"
                    required
                    minLength={3}
                    autoComplete="new-password"
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#334155' }}>
                  <input
                    type="checkbox"
                    checked={showPasswords}
                    onChange={(e) => setShowPasswords(e.target.checked)}
                  />
                  Show passwords
                </label>

                <div>
                  <button className="bb-btn bb-btn--primary" type="submit" disabled={submitting}>
                    {submitting ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
