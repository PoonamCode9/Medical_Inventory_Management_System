import { useEffect, useMemo, useState } from 'react'
import AdminLayout from './AdminLayout.jsx'
import {
  createAdminMedicine,
  fetchAdminMedicines,
  updateAdminMedicine,
  deleteAdminMedicine,
  fetchAdminSuppliers,
  fetchSuppliersForMedicine,
} from '../api.js'

function formatMoney(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '₹0.00'
  return `₹${n.toFixed(2)}`
}

function toISODateString(value) {
  if (!value) return ''
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  try {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return ''
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  } catch {
    return ''
  }
}

function downloadCsv(filename, rows, headers) {
  const escape = (v) => {
    if (v === null || v === undefined) return ''
    const s = String(v)
    if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`
    return s
  }

  const csv = [headers.join(',')]
    .concat(rows.map((r) => headers.map((h) => escape(r[h])).join(',')))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function MedicinesManagement() {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState({
    name: '',
    category: '',
    expiryDate: '',
    quantity: '',
  })

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

  const filteredMedicines = useMemo(() => {
    const nameQ = (filters.name || '').trim().toLowerCase()
    const categoryQ = (filters.category || '').trim().toLowerCase()
    const expiryQ = toISODateString(filters.expiryDate)
    const qtyQ = filters.quantity === '' ? '' : Number(filters.quantity)

    return medicines.filter((m) => {
      const nameOk = !nameQ || String(m.name ?? '').toLowerCase().includes(nameQ)
      const categoryOk = !categoryQ || String(m.category ?? '').toLowerCase().includes(categoryQ)
      const expiryOk = !expiryQ || toISODateString(m.expiryDate) === expiryQ
      const qtyOk = qtyQ === '' || Number(m.quantity) === qtyQ
      return nameOk && categoryOk && expiryOk && qtyOk
    })
  }, [medicines, filters])

  const handleExport = () => {
    const headers = ['name', 'category', 'quantity', 'expiryDate', 'price']
    const rows = filteredMedicines.map((m) => ({
      name: m.name,
      category: m.category,
      quantity: m.quantity,
      expiryDate: toISODateString(m.expiryDate),
      price: m.price,
    }))

    downloadCsv('medicines_export.csv', rows, headers)
  }

  // Suppliers list for multi-select
  const [suppliers, setSuppliers] = useState([])
  const [loadingSuppliers, setLoadingSuppliers] = useState(false)

  const loadSuppliers = async () => {
    setLoadingSuppliers(true)
    setError('')
    try {
      const data = await fetchAdminSuppliers()
      setSuppliers(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e?.message || 'Failed to load suppliers')
    } finally {
      setLoadingSuppliers(false)
    }
  }

  const ensureSuppliersLoaded = async () => {
    if (!suppliers || suppliers.length === 0) {
      await loadSuppliers()
    }
  }

  // Add/Edit modals
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editId, setEditId] = useState(null)

  const [form, setForm] = useState({
    name: '',
    batchNumber: '',
    category: '',
    quantity: '',
    expiryDate: '',
    price: '',
  })
  const [formError, setFormError] = useState('')

  const [selectedSupplierIds, setSelectedSupplierIds] = useState([])
  const [loadingSelectedSupplierIds, setLoadingSelectedSupplierIds] = useState(false)

  const openAddModal = async () => {
    setFormError('')
    setForm({ name: '', batchNumber: '', category: '', quantity: '', expiryDate: '', price: '' })
    setSelectedSupplierIds([])
    setIsAddOpen(true)
    await ensureSuppliersLoaded()
  }

  const closeAddModal = () => {
    setIsAddOpen(false)
    setFormError('')
    setSelectedSupplierIds([])
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
      supplierIds: selectedSupplierIds,
    }

    try {
      await createAdminMedicine(payload)
      closeAddModal()
      await refresh()
    } catch (err) {
      setFormError(err?.message || 'Failed to add medicine')
    }
  }

  const openEditModal = async (medicine) => {
    if (!medicine?.id) return

    setFormError('')
    setEditId(medicine.id)
    setForm({
      name: medicine.name ?? '',
      batchNumber: medicine.batchNumber ?? '',
      category: medicine.category ?? '',
      quantity: medicine.quantity ?? 0,
      expiryDate: toISODateString(medicine.expiryDate),
      price: medicine.price ?? '',
    })
    setIsEditOpen(true)

    setLoadingSelectedSupplierIds(true)
    try {
      await ensureSuppliersLoaded()
      const ids = await fetchSuppliersForMedicine(medicine.id)
      setSelectedSupplierIds(Array.isArray(ids) ? ids : [])
    } catch (e) {
      setFormError(e?.message || 'Failed to load medicine suppliers')
      setSelectedSupplierIds([])
    } finally {
      setLoadingSelectedSupplierIds(false)
    }
  }

  const closeEditModal = () => {
    setIsEditOpen(false)
    setEditId(null)
    setFormError('')
    setSelectedSupplierIds([])
    setLoadingSelectedSupplierIds(false)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!editId) return

    const payload = {
      name: form.name,
      batchNumber: form.batchNumber,
      category: form.category,
      quantity: Number(form.quantity),
      expiryDate: form.expiryDate,
      price: Number(form.price),
      supplierIds: selectedSupplierIds,
    }

    try {
      await updateAdminMedicine(editId, payload)
      closeEditModal()
      await refresh()
    } catch (err) {
      setFormError(err?.message || 'Failed to update medicine')
    }
  }

  const selectedSupplierIdsToOptions = (idList) => {
    const set = new Set((idList || []).map((x) => Number(x)))
    return selectedSupplierIds.length === 0 ? set : set
  }

  const supplierNamesForDisplay = (m) => {
    if (Array.isArray(m?.suppliers) && m.suppliers.length > 0) {
      return m.suppliers.map((s) => s?.name).filter(Boolean).join(', ')
    }
    return ''
  }

  return (
    <AdminLayout>
      <div className="bb-main-content">
        <div className="bb-page-header">
          <div>
            <h1 className="bb-page-title">Medicines</h1>
            <p className="bb-page-subtitle">Search and filter medicines stored in the medicines table.</p>
          </div>

          <div className="bb-page-actions">
            <button type="button" className="bb-btn bb-btn--primary" onClick={openAddModal}>
              + Add Medicine
            </button>
            <button type="button" className="bb-btn bb-btn--ghost">Import Excel</button>
            <button type="button" className="bb-btn bb-btn--ghost" onClick={handleExport}>
              Export Data
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bb-card bb-card-body bb-filters">
          <div className="bb-filter-grid">
            <label className="bb-field">
              <span className="bb-label">Medicine Name</span>
              <input
                type="text"
                className="bb-input"
                placeholder="Search by medicine name"
                value={filters.name}
                onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
              />
            </label>

            <label className="bb-field">
              <span className="bb-label">Category</span>
              <input
                type="text"
                className="bb-input"
                placeholder="Search by category"
                value={filters.category}
                onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
              />
            </label>

            <label className="bb-field">
              <span className="bb-label">Expiry Date</span>
              <input
                type="date"
                className="bb-input"
                value={filters.expiryDate}
                onChange={(e) => setFilters((f) => ({ ...f, expiryDate: e.target.value }))}
              />
            </label>

            <label className="bb-field">
              <span className="bb-label">Quantity</span>
              <input
                type="number"
                className="bb-input"
                min={0}
                value={filters.quantity}
                onChange={(e) => setFilters((f) => ({ ...f, quantity: e.target.value }))}
                placeholder="Exact quantity"
              />
            </label>
          </div>
        </div>

        {error && (
          <div className="bb-card bb-card-body" style={{ borderColor: 'rgba(239, 68, 68, .35)', marginTop: 12 }}>
            <div className="bb-strong" style={{ color: '#dc2626' }}>{error}</div>
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
            <div className="bb-card" style={{ width: 'min(860px, 100%)' }}>
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

                    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: '1 / -1' }}>
                      <span style={{ fontWeight: 1000, fontSize: 12, color: '#334155' }}>Suppliers (multi-select)</span>
                      <select
                        multiple
                        value={selectedSupplierIds.map(String)}
                        onChange={(e) => {
                          const opts = Array.from(e.target.selectedOptions).map((o) => Number(o.value))
                          setSelectedSupplierIds(opts)
                        }}
                        style={{ padding: '10px 12px', borderRadius: 14, border: '1px solid rgba(148,163,184,.22)', minHeight: 110 }}
                      >
                        {suppliers.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      {loadingSuppliers && <div style={{ color: '#64748b', fontWeight: 900 }}>Loading suppliers...</div>}
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

        <div className="bb-card" style={{ marginTop: 14 }}>
          <div className="bb-table-wrap">
            <table className="bb-table" aria-label="Medicines table">
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Expiry Date</th>
                  <th>Price per unit</th>
                  <th>Suppliers</th>
                  <th style={{ width: 180 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>
                      Loading medicines...
                    </td>
                  </tr>
                ) : filteredMedicines.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>
                      No medicines match the filters.
                    </td>
                  </tr>
                ) : (
                  filteredMedicines.map((m) => (
                    <tr key={m.id ?? m.batchNumber}>
                      <td className="bb-strong">{m.name}</td>
                      <td>
                        <span className="bb-pill">{m.category}</span>
                      </td>
                      <td>{m.quantity}</td>
                      <td>{toISODateString(m.expiryDate)}</td>
                      <td>{formatMoney(m.price)}</td>
                      <td style={{ whiteSpace: 'normal' }}>
                        {supplierNamesForDisplay(m) || <span style={{ color: '#94a3b8', fontWeight: 900 }}>—</span>}
                      </td>
                      <td>
                        <div className="bb-table-actions">
                          <button
                            type="button"
                            className="bb-link-btn"
                            onClick={() => openEditModal(m)}
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
                                .catch((e) => setError(e?.message || 'Failed to delete medicine'))
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

        {isEditOpen && (
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
              if (e.target === e.currentTarget) closeEditModal()
            }}
          >
            <div className="bb-card" style={{ width: 'min(860px, 100%)' }}>
              <div className="bb-card-header" style={{ alignItems: 'center' }}>
                <div>
                  <div className="bb-card-title">Edit Medicine</div>
                  <div className="bb-card-sub">Update medicine/batch details + suppliers</div>
                </div>
                <button type="button" className="bb-link-btn" onClick={closeEditModal}>
                  ✕ Close
                </button>
              </div>

              <div className="bb-card-body">
                {formError && (
                  <div className="bb-strong" style={{ color: '#dc2626', marginBottom: 12 }}>
                    {formError}
                  </div>
                )}

                {loadingSelectedSupplierIds && (
                  <div className="bb-strong" style={{ color: '#64748b', marginBottom: 12 }}>
                    Loading suppliers linked to this medicine...
                  </div>
                )}

                <form onSubmit={handleEditSubmit}>
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

                    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: '1 / -1' }}>
                      <span style={{ fontWeight: 1000, fontSize: 12, color: '#334155' }}>Suppliers (multi-select)</span>
                      <select
                        multiple
                        value={selectedSupplierIds.map(String)}
                        onChange={(e) => {
                          const opts = Array.from(e.target.selectedOptions).map((o) => Number(o.value))
                          setSelectedSupplierIds(opts)
                        }}
                        disabled={loadingSelectedSupplierIds}
                        style={{ padding: '10px 12px', borderRadius: 14, border: '1px solid rgba(148,163,184,.22)', minHeight: 110 }}
                      >
                        {suppliers.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
                    <button type="button" className="bb-btn" onClick={closeEditModal}>
                      Cancel
                    </button>
                    <button type="submit" className="bb-btn bb-btn--primary" disabled={loadingSelectedSupplierIds}>
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

