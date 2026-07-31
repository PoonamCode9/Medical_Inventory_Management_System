import { useEffect, useMemo, useState } from 'react'
import StaffLayout from './StaffLayout.jsx'
import { fetchAdminMedicines } from '../api.js'

function formatMoney(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '₹0.00'
  return `₹${n.toFixed(2)}`
}

export default function StaffInventoryStockOverview() {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
    <StaffLayout>
      <div className="bb-main-content">
        <div className="bb-page-header">
          <div>
            <h1 className="bb-page-title">Stock Overview</h1>
            <p className="bb-page-subtitle">Batch-wise stock, expiry, and inventory value</p>
          </div>

          <div className="bb-page-actions">
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
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>
                        Loading stock...
                      </td>
                    </tr>
                  ) : computedRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>
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
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  )
}

