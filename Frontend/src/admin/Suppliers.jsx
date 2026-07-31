import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout.jsx'
import { createAdminSupplier, deleteAdminSupplier, fetchAdminSuppliers } from '../api'


export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    contactNumber: '',
    email: '',
    address: '',
  })
  const [formError, setFormError] = useState('')

  const refresh = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchAdminSuppliers()
      setSuppliers(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e?.message || 'Failed to load suppliers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const openAddModal = () => {
    setFormError('')
    setForm({ name: '', contactNumber: '', email: '', address: '' })
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
      await createAdminSupplier(form)
      closeAddModal()
      await refresh()
    } catch (err) {
      setFormError(err?.message || 'Failed to add supplier')
    }
  }

  return (
    <AdminLayout>
      <div className="bb-main-content">
        <div className="bb-page-header">
          <div>
            <h1 className="bb-page-title">Suppliers</h1>
            <p className="bb-page-subtitle">Manage supplier contact details.</p>
          </div>

          <div className="bb-page-actions">
            <button
              className="bb-btn bb-btn--primary"
              type="button"
              onClick={openAddModal}
              disabled={loading}
            >
              + Add Supplier
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
            <div className="bb-card" style={{ width: 'min(720px, 100%)' }}>
              <div className="bb-card-header" style={{ alignItems: 'center' }}>
                <div>
                  <div className="bb-card-title">Add Supplier</div>
                  <div className="bb-card-sub">Enter supplier details</div>
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
                      <span style={{ fontWeight: 1000, fontSize: 12, color: '#334155' }}>Contact Number</span>
                      <input
                        value={form.contactNumber}
                        onChange={(e) => setForm((f) => ({ ...f, contactNumber: e.target.value }))}
                        required
                        style={{ padding: '10px 12px', borderRadius: 14, border: '1px solid rgba(148,163,184,.22)' }}
                      />
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
                      <span style={{ fontWeight: 1000, fontSize: 12, color: '#334155' }}>Address</span>
                      <textarea
                        value={form.address}
                        onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                        required
                        rows={2}
                        style={{ padding: '10px 12px', borderRadius: 14, border: '1px solid rgba(148,163,184,.22)' }}
                      />
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
                    <button type="button" className="bb-btn" onClick={closeAddModal}>
                      Cancel
                    </button>
                    <button type="submit" className="bb-btn bb-btn--primary">
                      Save Supplier
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="bb-card bb-card--tight" style={{ marginTop: 14 }}>
          <div className="bb-card-header bb-card-header--row">
            <div>
              <div className="bb-card-title">Supplier list</div>
              <div className="bb-card-sub">Name, contact number, email, and address</div>
            </div>
          </div>

          <div className="bb-card-body">
            <div className="bb-table-wrap">
              <table className="bb-table" aria-label="Suppliers table">
                <thead>
                  <tr>
                    <th style={{ width: '22%' }}>Name</th>
                    <th style={{ width: '18%' }}>Contact Number</th>
                    <th style={{ width: '22%' }}>Email</th>
                    <th style={{ width: '38%' }}>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>
                        Loading suppliers...
                      </td>
                    </tr>
                  ) : suppliers.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>
                        No suppliers found.
                      </td>
                    </tr>
                  ) : (
                    suppliers.map((s) => (
                      <tr key={s.id}>
                        <td className="bb-strong">{s.name}</td>
                        <td>{s.contactNumber || s.contact_number}</td>
                        <td>{s.email}</td>
                        <td style={{ whiteSpace: 'normal', maxWidth: 520 }}>{s.address}</td>
                        <td>
                          <div className="bb-table-actions">
                            <button
                              type="button"
                              className="bb-link-btn bb-link-btn--danger"
                              onClick={() => {
                                const ok = window.confirm(`Delete supplier "${s.name}"? This cannot be undone.`)
                                if (!ok) return
                                deleteAdminSupplier(s.id)
                                  .then(() => refresh())
                                  .catch((e) => setError(e?.message || 'Failed to delete supplier'))
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
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

