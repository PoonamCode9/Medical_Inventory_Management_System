import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { fetchAdminSuppliers, fetchAdminMedicines, createPharmacistPurchaseOrder } from '../api'
import PharmacistLayout from './PharmacistLayout.jsx'

function fmt(n) {
  const x = Number(n)
  if (Number.isNaN(x)) return '\u20b90.00'
  return '\u20b9' + x.toFixed(2)
}

export default function CreatePurchaseOrder() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [suppliers, setSuppliers] = useState([])
  const [medicines, setMedicines] = useState([])
  const [formError, setFormError] = useState('')
  const [orderForm, setOrderForm] = useState({ supplierId: '', requiredDate: '', specialInstructions: '' })
  const [items, setItems] = useState([{ medicineId: '', quantity: '', unitPrice: '' }])

  const refresh = async () => {
    setLoading(true)
    setError('')
    try {
      const [sup, meds] = await Promise.all([fetchAdminSuppliers(), fetchAdminMedicines()])
      setSuppliers(Array.isArray(sup) ? sup : [])
      setMedicines(Array.isArray(meds) ? meds : [])
    } catch (e) {
      setError(e?.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  const selectedSupplierId = orderForm.supplierId ? Number(orderForm.supplierId) : null

  const allowedMedicines = useMemo(() => {
    if (!selectedSupplierId) return medicines
    return medicines.filter((m) => {
      const supIds = Array.isArray(m.suppliers) ? m.suppliers.map((s) => s.id) : []
      return supIds.includes(selectedSupplierId)
    })
  }, [medicines, selectedSupplierId])

  const grandTotal = useMemo(() => {
    return items.reduce((sum, it) => {
      const q = Number(it.quantity || 0)
      const p = Number(it.unitPrice || 0)
      if (Number.isNaN(q) || Number.isNaN(p)) return sum
      return sum + q * p
    }, 0)
  }, [items])

  const duplicateMedicineGuard = useMemo(() => {
    const seen = new Set()
    const dups = new Set()
    for (const it of items) {
      const mid = it.medicineId ? Number(it.medicineId) : null
      if (!mid) continue
      if (seen.has(mid)) dups.add(mid)
      seen.add(mid)
    }
    return dups
  }, [items])

  const addRow = () => {
    setItems((prev) => [...prev, { medicineId: '', quantity: '', unitPrice: '' }])
  }

  const removeRow = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  const setRow = (idx, patch) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)))
  }

  const recalcUnitPriceDefault = (medicineId) => {
    const med = medicines.find((m) => Number(m.id) === Number(medicineId))
    return med && med.price != null ? String(med.price) : ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!orderForm.supplierId) { setFormError('Supplier must be selected'); return }
    if (!orderForm.requiredDate) { setFormError('Required Date is required'); return }
    if (!items || items.length === 0) { setFormError('At least one medicine is required'); return }

    const mids = []
    for (const it of items) {
      if (!it.medicineId) { setFormError('Medicine is required for each row'); return }
      mids.push(Number(it.medicineId))
      const q = Number(it.quantity)
      const p = Number(it.unitPrice)
      if (!Number.isFinite(q) || q <= 0) { setFormError('Quantity must be greater than zero'); return }
      if (!Number.isFinite(p) || p < 0) { setFormError('Unit Price cannot be negative'); return }
    }

    if (new Set(mids).size !== mids.length) { setFormError('Duplicate medicines are not allowed'); return }

    const payload = {
      supplierId: Number(orderForm.supplierId),
      requiredDate: orderForm.requiredDate,
      specialInstructions: orderForm.specialInstructions || null,
      items: items.map((it) => ({
        medicineId: Number(it.medicineId),
        quantity: Number(it.quantity),
        unitPrice: Number(it.unitPrice),
      })),
    }

    try {
      await createPharmacistPurchaseOrder(payload)
      toast.success('Purchase Order created successfully')
      setItems([{ medicineId: '', quantity: '', unitPrice: '' }])
      setOrderForm({ supplierId: '', requiredDate: '', specialInstructions: '' })
    } catch (err) {
      const message = err?.message || 'Failed to create purchase order'
      setFormError(message)
      toast.error(message)
    }
  }

  if (loading) {
    return (
      <PharmacistLayout>
      <div className="bb-main-content" style={{ padding: 20 }}>
        Loading...
      </div>
      </PharmacistLayout>
    )
  }

  const inputStyle = { padding: '10px 12px', borderRadius: 14, border: '1px solid rgba(148,163,184,.22)' }
  const labelStyle = { fontWeight: 1000, fontSize: 12, color: '#334155' }
  const colStyle = { display: 'flex', flexDirection: 'column', gap: 6 }
  const cellStyle = { padding: '8px 10px', borderRadius: 12, border: '1px solid rgba(148,163,184,.22)', width: '100%' }

  return (
    <PharmacistLayout>
    <div className="bb-main-content">
      <div className="bb-page-header">
        <div>
          <h1 className="bb-page-title">Create Purchase Order</h1>
          <p className="bb-page-subtitle">Pharmacist creates purchase orders for suppliers</p>
        </div>
        </div>

      {error ? (
        <div className="bb-card bb-card-body" style={{ borderColor: 'rgba(239, 68, 68, .35)' }}>
          <div className="bb-strong" style={{ color: '#dc2626' }}>{error}</div>
        </div>
      ) : null}

      <div className="bb-card bb-card-body" style={{ marginTop: 12 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={colStyle}>
              <span style={labelStyle}>Supplier</span>
              <select value={orderForm.supplierId} onChange={(e) => setOrderForm((f) => ({ ...f, supplierId: e.target.value }))} required style={inputStyle}>
                <option value="">Select supplier</option>
                {suppliers.map((sup) => (<option key={sup.id} value={sup.id}>{sup.name}</option>))}
              </select>
            </label>
            <label style={colStyle}>
              <span style={labelStyle}>Required Date</span>
              <input type="date" value={orderForm.requiredDate} onChange={(e) => setOrderForm((f) => ({ ...f, requiredDate: e.target.value }))} required style={inputStyle} />
            </label>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={colStyle}>
              <span style={labelStyle}>Special Instructions (Optional)</span>
              <textarea value={orderForm.specialInstructions} onChange={(e) => setOrderForm((f) => ({ ...f, specialInstructions: e.target.value }))} rows={3} placeholder="Any notes for the supplier" style={inputStyle} />
            </label>
          </div>

          <div style={{ marginTop: 16 }}>
            <div className="bb-strong" style={{ marginBottom: 10 }}>Medicines</div>

            {formError ? (
              <div className="bb-strong" style={{ color: '#dc2626', marginBottom: 12 }}>{formError}</div>
            ) : null}

            <div className="bb-table-wrap">
              <table className="bb-table" aria-label="Purchase order items">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th style={{ width: 120 }}>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => {
                    const q = Number(it.quantity || 0)
                    const p = Number(it.unitPrice || 0)
                    const rowTotal = Number.isFinite(q) && Number.isFinite(p) ? q * p : 0
                    const isDup = it.medicineId && duplicateMedicineGuard.has(Number(it.medicineId))
                    return (
                      <tr key={idx}>
                        <td>
                          <select value={it.medicineId} onChange={(e) => { const mid = e.target.value; setRow(idx, { medicineId: mid, unitPrice: recalcUnitPriceDefault(mid) }) }} required style={cellStyle}>
                            <option value="">Select medicine</option>
                            {allowedMedicines.map((m) => (<option key={m.id} value={m.id}>{m.name}</option>))}
                          </select>
                          {isDup ? (<div style={{ color: '#dc2626', fontWeight: 900, marginTop: 4 }}>Duplicate</div>) : null}
                        </td>
                        <td>
                          <input type="number" min={0} value={it.quantity} onChange={(e) => setRow(idx, { quantity: e.target.value })} required style={cellStyle} />
                        </td>
                        <td>
                          <input type="number" step="0.01" min={0} value={it.unitPrice} onChange={(e) => setRow(idx, { unitPrice: e.target.value })} required style={cellStyle} />
                        </td>
                        <td style={{ fontWeight: 1000 }}>{fmt(rowTotal)}</td>
                        <td>
                          <button type="button" className="bb-link-btn bb-link-btn--danger" onClick={() => removeRow(idx)} disabled={items.length === 1}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <button type="button" className="bb-btn" onClick={addRow}>+ Add Medicine</button>
              <div style={{ fontWeight: 1000 }}>Grand Total: <span>{fmt(grandTotal)}</span></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
            <button type="submit" className="bb-btn bb-btn--primary" disabled={!items.length}>
              Create Purchase Order
            </button>
          </div>
        </div>
        </form>
      </div>
    </div>
    </PharmacistLayout>
  )
}
