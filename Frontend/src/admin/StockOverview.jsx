import { useEffect, useMemo, useState } from 'react'
import AdminLayout from './AdminLayout.jsx'
import { createAdminMedicine, fetchAdminMedicines, updateAdminMedicine, deleteAdminMedicine } from '../api.js'

function formatMoney(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '₹0.00'
  return `₹${n.toFixed(2)}`
}

export default function StockOverview() {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    batchNumber: '',
    category: '',
    quantity: '',
    expiryDate: '',
    price: '',
  })
  const [formError, setFormError] = useState('')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editId, setEditId] = useState(null)


  const refresh = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchAdminMedicines()
      setMedicines(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e?.message || 'Failed to load medicines')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const openAddModal = () => {
    setFormError('')
    setForm({ name: '', batchNumber: '', category: '', quantity: '', expiryDate: '', price: '' })
    setIsAddOpen(true)
  }

  const closeAddModal = () => {
    setIsAddOpen(false)
    setFormError('')
    setIsEditOpen(false)
    setEditId(null)
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const payload = {
      name: form.name,
      batchNumber: form.batchNumber,
      category: form.category,
      quantity: Number(form.quantity),
      expiryDate: form.expiryDate,
      price: Number(form.price),
    }

    try {
      // If user clicked Edit, update existing batch by id
      if (isEditOpen && editId) {
        await updateAdminMedicine(editId, payload)
        setIsEditOpen(false)
        setEditId(null)
        closeAddModal()
        await refresh()
        return
      }

      await createAdminMedicine(payload)
      closeAddModal()
      await refresh()
    } catch (err) {
      setFormError(
        err?.message || (isEditOpen ? 'Failed to update medicine' : 'Failed to add medicine')
      )
    }
  }

  const computedRows = useMemo(() => {
    return medicines.map((m) => {
      const qty = Number(m.quantity ?? 0)
      const price = Number(m.price ?? 0)
      return {
        ...m,
        _qty: qty,
        _price: price,
        _stockValue: qty * price,
      }
    })
  }, [medicines])

  return (
    <AdminLayout>
      <div className="bb-main-content">
        <div className="bb-page-header">
          <div>
            <h1 className="bb-page-title">Stock Overview</h1>
            <p className="bb-page-subtitle">Batch-wise stock, expiry, and inventory value</p>
          </div>

          <div className="bb-page-actions">
            <button className="bb-btn bb-btn--primary" type="button" onClick={openAddModal} disabled={loading}>
              + Add Medicine
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
            <div className="bb-card" style={{ width: 'min(760px, 100%)' }}>
              <div className="bb-card-header" style={{ alignItems: 'center' }}>
                <div>
                  <div className="bb-card-title">Add Medicine</div>
                  <div className="bb-card-sub">Insert medicine/batch details into medicines table</div>
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
                      <span style={{ fontWeight: 1000, fontSize: 12, color: '#334155' }}>Medicine Name</span>
                      <input
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        required
                        style={{ padding: '10px 12px', borderRadius: 14, border: '1px solid rgba(148,163,184,.22)' }}
                      />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span style={{ fontWeight: 1000, fontSize: 12, color: '#334155' }}>Batch Number</span>
                      <input
                        value={form.batchNumber}
                        onChange={(e) => setForm((f) => ({ ...f, batchNumber: e.target.value }))}
                        required
                        style={{ padding: '10px 12px', borderRadius: 14, border: '1px solid rgba(148,163,184,.22)' }}
                      />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span style={{ fontWeight: 1000, fontSize: 12, color: '#334155' }}>Category</span>
                      <input
                        value={form.category}
                        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                        required
                        style={{ padding: '10px 12px', borderRadius: 14, border: '1px solid rgba(148,163,184,.22)' }}
                      />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span style={{ fontWeight: 1000, fontSize: 12, color: '#334155' }}>Quantity</span>
                      <input
                        type="number"
                        value={form.quantity}
                        onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                        required
                        min={0}
                        style={{ padding: '10px 12px', borderRadius: 14, border: '1px solid rgba(148,163,184,.22)' }}
                      />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span style={{ fontWeight: 1000, fontSize: 12, color: '#334155' }}>Expiry Date</span>
                      <input
                        type="date"
                        value={form.expiryDate}
                        onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))}
                        required
                        style={{ padding: '10px 12px', borderRadius: 14, border: '1px solid rgba(148,163,184,.22)' }}
                      />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span style={{ fontWeight: 1000, fontSize: 12, color: '#334155' }}>Price / Unit</span>
                      <input
                        type="number"
                        step="0.01"
                        value={form.price}
                        onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                        required
                        min={0}
                        style={{ padding: '10px 12px', borderRadius: 14, border: '1px solid rgba(148,163,184,.22)' }}
                      />
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
                    <button type="button" className="bb-btn" onClick={closeAddModal}>
                      Cancel
                    </button>
                    <button type="submit" className="bb-btn bb-btn--primary">
                      Save Medicine
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
              <div className="bb-card-title">Medicine Stock</div>
              <div className="bb-card-sub">Value = quantity × price per unit</div>
            </div>
          </div>

          <div className="bb-card-body">
            <div className="bb-table-wrap">
              <table className="bb-table" aria-label="Stock overview table">
                <thead>
                  <tr>
                    <th>Medicine Name</th>
                    <th>Batch Number</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Expiry Date</th>
                    <th>Price / Unit</th>
                    <th>Stock Value</th>
                    <th style={{ width: 170 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>
                        Loading stock...
                      </td>
                    </tr>
                  ) : computedRows.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>
                        No medicines found.
                      </td>
                    </tr>
                  ) : (
                    computedRows.map((m) => (
                      <tr key={m.id ?? m.batchNumber}>
                        <td className="bb-strong">{m.name}</td>
                        <td>{m.batchNumber}</td>
                        <td>
                          <span className="bb-pill">{m.category}</span>
                        </td>
                        <td>{m._qty}</td>
                        <td>{m.expiryDate}</td>
                        <td>{formatMoney(m._price)}</td>
                      <td style={{ fontWeight: 1000 }}>{formatMoney(m._stockValue)}</td>
                      <td>
                        <div className="bb-table-actions">
                          <button
                            type="button"
                            className="bb-link-btn"
                            onClick={() => {
                              if (!m?.id) return
                              setFormError('')
                              // For stock overview we do quick inline edit using the add form as edit modal
                              // (reuse modal UI)
                              setForm({
                                name: m.name ?? '',
                                batchNumber: m.batchNumber ?? '',
                                category: m.category ?? '',
                                quantity: m.quantity ?? 0,
                                expiryDate: m.expiryDate ?? '',
                                price: m.price ?? '',
                              })
                              // Open modal in edit mode
                              setIsAddOpen(true)
                              setEditId(m.id)
                              setIsEditOpen(true)
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="bb-link-btn bb-link-btn--danger"
                            onClick={() => {
                              if (!m?.id) return
                              const ok = window.confirm(`Delete "${m.name}"? This cannot be undone.`)
                              if (!ok) return
                              deleteAdminMedicine(m.id)
                                .then(() => refresh())
                                .catch((e) => setFormError(e?.message || 'Failed to delete medicine'))
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

