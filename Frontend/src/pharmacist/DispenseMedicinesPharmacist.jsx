import { useEffect, useMemo, useState } from 'react'
import PharmacistLayout from './PharmacistLayout.jsx'
import { fetchAdminMedicines } from '../api.js'

function formatDateTime(d) {
  if (!d) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function DispenseMedicinesPharmacist() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [medicines, setMedicines] = useState([])
  const [stockLoad, setStockLoad] = useState(true)
  const [stockError, setStockError] = useState('')

  const [selectedMedicineId, setSelectedMedicineId] = useState(null)
  const [medicineQuery, setMedicineQuery] = useState('')
  const [quantity, setQuantity] = useState(1)

  const [items, setItems] = useState([]) // { medicineId, name, available, quantity }
  const [remarks, setRemarks] = useState('')

  const nowStr = useMemo(() => formatDateTime(new Date()), [])

  const refreshMedicines = async () => {
    setStockLoad(true)
    setStockError('')
    try {
      const data = await fetchAdminMedicines()
      setMedicines(Array.isArray(data) ? data : [])
    } catch (e) {
      setStockError(e?.message || 'Failed to load medicines')
    } finally {
      setStockLoad(false)
    }
  }

  useEffect(() => {
    refreshMedicines()
  }, [])

  const medicineOptions = useMemo(() => {
    const q = medicineQuery.trim().toLowerCase()
    if (!q) return medicines
    return medicines.filter((m) => (m?.name || '').toLowerCase().includes(q))
  }, [medicines, medicineQuery])

  const selectedMedicine = useMemo(() => {
    if (!selectedMedicineId) return null
    return medicines.find((m) => m.id === selectedMedicineId) || null
  }, [medicines, selectedMedicineId])

  const selectedAvailable = useMemo(() => {
    if (!selectedMedicine) return 0
    return Number(selectedMedicine.quantity ?? 0)
  }, [selectedMedicine])

  const addMedicine = () => {
    setError('')
    setSuccess('')

    if (!selectedMedicine) {
      setError('Select a medicine first')
      return
    }

    const q = Number(quantity)
    if (!Number.isFinite(q) || q <= 0) {
      setError('Quantity must be greater than 0')
      return
    }

    if (q > selectedAvailable) {
      setError(`Quantity cannot exceed available stock (${selectedAvailable})`)
      return
    }

    if (items.some((it) => it.medicineId === selectedMedicine.id)) {
      setError('Same medicine cannot be added multiple times in the same transaction')
      return
    }

    setItems((prev) => [
      ...prev,
      {
        medicineId: selectedMedicine.id,
        name: selectedMedicine.name,
        available: selectedAvailable,
        quantity: q,
      },
    ])

    setQuantity(1)
    setSelectedMedicineId(null)
    setMedicineQuery('')
  }

  const payload = useMemo(() => {
    return {
      remarks: remarks || '',
      items: items.map((it) => ({ medicineId: it.medicineId, quantity: it.quantity })),
    }
  }, [items, remarks])

  const dispense = async () => {
    setError('')
    setSuccess('')

    if (items.length === 0) {
      setError('Add at least one medicine before dispensing')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('http://localhost:8091/api/pharmacist/dispense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || 'Dispense failed')

      setSuccess(`Dispense successful (ID: ${data.dispenseId ?? '-'})`)
      setItems([])
      setRemarks('')
      await refreshMedicines()
    } catch (e) {
      setError(e?.message || 'Dispense failed')
    } finally {
      setLoading(false)
    }
  }

  // Frontend requirement: pharmacist should not select themselves manually.
  // We auto-display name; backend still uses authenticated user id.
  const dispensedByName = localStorage.getItem('authUserName') || 'Pharmacist'

  return (
    <PharmacistLayout>
      <div className="bb-main-content">
        <div className="bb-page-header">
          <div>
            <h1 className="bb-page-title">Dispense Medicines</h1>
            <p className="bb-page-subtitle">Create dispensing transaction and reduce stock atomically</p>
          </div>
        </div>

        {stockError && (
          <div className="bb-card bb-card-body" style={{ borderColor: 'rgba(239, 68, 68, .35)' }}>
            <div className="bb-strong" style={{ color: '#dc2626' }}>
              {stockError}
            </div>
          </div>
        )}

        <div className="bb-two-col" style={{ marginTop: 14 }}>
          <div className="bb-card">
            <div className="bb-card-header">
              <div>
                <div className="bb-card-title">Transaction</div>
                <div className="bb-card-sub">Current timestamp and dispensing details</div>
              </div>
            </div>

            <div className="bb-card-body">
              <div className="bb-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div>
                  <label className="bb-label">Dispense date</label>
                  <input className="bb-input" value={nowStr} readOnly />
                </div>
                <div>
                  <label className="bb-label">Dispensed by</label>
                  <input className="bb-input" value={dispensedByName} readOnly />
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <label className="bb-label">Search medicine</label>
                <input
                  className="bb-input"
                  value={medicineQuery}
                  onChange={(e) => setMedicineQuery(e.target.value)}
                  placeholder="Type medicine name..."
                  disabled={stockLoad}
                />

                <div style={{ marginTop: 10 }}>
                  <select
                    className="bb-select"
                    value={selectedMedicineId ?? ''}
                    onChange={(e) => setSelectedMedicineId(e.target.value ? Number(e.target.value) : null)}
                    disabled={stockLoad}
                  >
                    <option value="">Select medicine</option>
                    {medicineOptions.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} (Stock: {m.quantity ?? 0})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bb-form-grid" style={{ marginTop: 14, gridTemplateColumns: '1fr 1fr' }}>
                <div>
                  <label className="bb-label">Available stock</label>
                  <input className="bb-input" value={selectedAvailable} readOnly />
                </div>
                <div>
                  <label className="bb-label">Quantity</label>
                  <input
                    className="bb-input"
                    type="number"
                    min={1}
                    step={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    disabled={!selectedMedicine}
                  />
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <button className="bb-btn bb-btn--primary" type="button" onClick={addMedicine} disabled={stockLoad || !selectedMedicine}>
                  Add Medicine
                </button>
              </div>

              <div style={{ marginTop: 18 }}>
                <label className="bb-label">Optional remarks</label>
                <textarea
                  className="bb-textarea"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Any notes for this dispense..."
                  rows={3}
                />
              </div>

              {error && (
                <div className="bb-card bb-card-body" style={{ marginTop: 14, borderColor: 'rgba(239, 68, 68, .35)' }}>
                  <div className="bb-strong" style={{ color: '#dc2626' }}>{error}</div>
                </div>
              )}
              {success && (
                <div className="bb-card bb-card-body" style={{ marginTop: 14, borderColor: 'rgba(34, 197, 94, .35)' }}>
                  <div className="bb-strong" style={{ color: '#16a34a' }}>{success}</div>
                </div>
              )}

              <div style={{ marginTop: 18 }}>
                <button className="bb-btn bb-btn--success" type="button" onClick={dispense} disabled={loading || items.length === 0}>
                  {loading ? 'Dispensing...' : 'Dispense'}
                </button>
              </div>
            </div>
          </div>

          <div className="bb-card">
            <div className="bb-card-header">
              <div>
                <div className="bb-card-title">Selected medicines</div>
                <div className="bb-card-sub">Review items before dispensing</div>
              </div>
            </div>

            <div className="bb-card-body">
              <div className="bb-table-wrap">
                <table className="bb-table" aria-label="Dispense items table">
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Available</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={3} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>
                          No medicines selected.
                        </td>
                      </tr>
                    ) : (
                      items.map((it) => (
                        <tr key={it.medicineId}>
                          <td className="bb-strong">{it.name}</td>
                          <td>{it.available}</td>
                          <td>
                            <input
                              className="bb-input"
                              type="number"
                              min={1}
                              step={1}
                              value={it.quantity}
                              onChange={(e) => {
                                const nextQty = Number(e.target.value)
                                setItems((prev) => prev.map((p) => {
                                  if (p.medicineId !== it.medicineId) return p
                                  if (!Number.isFinite(nextQty) || nextQty <= 0) return p
                                  if (nextQty > p.available) return p
                                  return { ...p, quantity: nextQty }
                                }))
                              }}
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {items.length > 0 && (
                <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
                  <button className="bb-btn bb-btn--ghost" type="button" onClick={() => setItems([])}>
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PharmacistLayout>
  )
}

