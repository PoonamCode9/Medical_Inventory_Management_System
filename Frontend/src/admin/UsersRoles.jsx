import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createAdminUser, deleteAdminUser, fetchAdminUsers } from '../api'
import AdminLayout from './AdminLayout.jsx'



export default function UsersRoles() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STAFF' })
  const [formError, setFormError] = useState('')

  const refresh = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchAdminUsers()
      // Backend currently returns entities; we display only non-sensitive fields.
      setUsers(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const rolePillTone = useMemo(() => {
    const map = {
      ADMIN: 'bb-status--ok',
      Admin: 'bb-status--ok',
      STAFF: 'bb-status--warn',
      Staff: 'bb-status--warn',
      PHARMACIST: 'bb-status--warn',
      Pharmacist: 'bb-status--warn',
      SUPPLIER: 'bb-status--ok',
      Supplier: 'bb-status--ok',
    }

    return map
  }, [])

  const handleDelete = async (id, name) => {
    const ok = window.confirm(`Delete user "${name}"? This cannot be undone.`)
    if (!ok) return

    setDeletingId(id)
    try {
      await deleteAdminUser(id)
      await refresh()
    } catch (e) {
      setError(e?.message || 'Failed to delete user')
    } finally {
      setDeletingId(null)
    }
  }

  const openAddModal = () => {
    setFormError('')
    setForm({ name: '', email: '', password: '', role: 'STAFF' })
    setIsAddOpen(true)
  }

  const closeAddModal = () => {
    setIsAddOpen(false)
    setFormError('')
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    try {
      await createAdminUser(form)
      closeAddModal()
      await refresh()
    } catch (err) {
      setFormError(err?.message || 'Failed to add user')
    }
  }

  return (
    <AdminLayout>
    <div className="bb-main-content">
      <div className="bb-page-header">

        <div>
          <h1 className="bb-page-title">User Management</h1>
          <p className="bb-page-subtitle">Manage application users, roles, and access.</p>
        </div>
        <div className="bb-page-actions">
          <button
            className="bb-btn"
            type="button"
            onClick={() => navigate('/admin/dashboard')}
          >
            Go back to Dashboard
          </button>

          <button
            className="bb-btn bb-btn--primary"
            type="button"
            onClick={openAddModal}
            disabled={loading}
          >
            + Add User
          </button>

          <button className="bb-btn bb-btn--primary" type="button" onClick={refresh} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bb-card bb-card-body" style={{ borderColor: 'rgba(239, 68, 68, .35)' }}>
          <div className="bb-strong" style={{ color: '#dc2626' }}>
            {error}
          </div>
        </div>
      )}

      {isAddOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 6, 23, .42)',
            zIndex: 50,
            display: 'grid',
            placeItems: 'center',
            padding: 16,
          }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeAddModal()
          }}
        >
          <div
            className="bb-card"
            style={{ width: 'min(680px, 100%)' }}
          >
            <div className="bb-card-header" style={{ alignItems: 'center' }}>
              <div>
                <div className="bb-card-title">Add User</div>
                <div className="bb-card-sub">Enter user details and assign a role</div>
              </div>
              <button type="button" className="bb-link-btn" onClick={closeAddModal}>
                ✕ Close
              </button>
            </div>

            <div className="bb-card-body">
              {formError && (
                <div className="bb-strong" style={{ color: '#dc2626', marginBottom: 12 }}>
                  {formError}
                </div>
              )}

              <form onSubmit={handleAddSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ fontWeight: 1000, fontSize: 12, color: '#334155' }}>Name</span>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      required
                      style={{ padding: '10px 12px', borderRadius: 14, border: '1px solid rgba(148,163,184,.22)' }}
                    />
                  </label>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ fontWeight: 1000, fontSize: 12, color: '#334155' }}>Role</span>
                    <select
                      value={form.role}
                      onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                      required
                      style={{ padding: '10px 12px', borderRadius: 14, border: '1px solid rgba(148,163,184,.22)' }}
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="STAFF">STAFF</option>
                      <option value="PHARMACIST">PHARMACIST</option>
                      <option value="SUPPLIER">SUPPLIER</option>
                    </select>
                  </label>

                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ fontWeight: 1000, fontSize: 12, color: '#334155' }}>Email</span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      required
                      style={{ padding: '10px 12px', borderRadius: 14, border: '1px solid rgba(148,163,184,.22)' }}
                    />
                  </label>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ fontWeight: 1000, fontSize: 12, color: '#334155' }}>Password</span>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      required
                      style={{ padding: '10px 12px', borderRadius: 14, border: '1px solid rgba(148,163,184,.22)' }}
                    />
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
                  <button type="button" className="bb-btn" onClick={closeAddModal}>
                    Cancel
                  </button>
                  <button type="submit" className="bb-btn bb-btn--primary">
                    Save User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="bb-card bb-card--tight">
        <div className="bb-card-header bb-card-header--row">
          <div>
            <div className="bb-card-title">System access & roles</div>
            <div className="bb-card-sub">Name, role, email, and delete actions</div>
          </div>
        </div>

        <div className="bb-card-body">
          <div className="bb-table-wrap">
            <table className="bb-table" aria-label="Users table">
              <thead>
                <tr>
                  <th style={{ width: '32%' }}>User Name</th>
                  <th style={{ width: '18%' }}>Role</th>
                  <th style={{ width: '30%' }}>Email</th>
                  <th style={{ width: '20%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const role = u?.role || 'USER'
                    const tone = rolePillTone[role] || 'bb-status--ok'
                    return (
                      <tr key={u.id}>
                        <td className="bb-strong">{u.name}</td>
                        <td>
                          <span className={`bb-status ${tone}`}>{role}</span>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <div className="bb-table-actions">
                            <button
                              type="button"
                              className={`bb-link-btn bb-link-btn--danger`}
                              disabled={deletingId === u.id}
                              onClick={() => handleDelete(u.id, u.name)}
                              aria-label={`Delete ${u.name}`}
                            >
                              {deletingId === u.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </AdminLayout>
  )
}

