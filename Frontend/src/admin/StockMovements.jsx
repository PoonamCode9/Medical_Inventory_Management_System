import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout.jsx'

import { fetchAdminStockMovements } from '../api.js'

export default function StockMovements() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchAdminStockMovements()
        setRows(Array.isArray(data) ? data : [])
      } catch (e) {
        setError(e?.message || 'Failed to load stock movements')
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])

  return (
    <AdminLayout>
      <div className="bb-main-content">
        <div className="bb-page-header">
          <div>
            <h1 className="bb-page-title">Stock Movements</h1>
            <p className="bb-page-subtitle">
              History of all stock changes — IN from purchases/manual additions, OUT from dispensing
            </p>
          </div>
          <div className="bb-page-actions">
            <button
              className="bb-btn bb-btn--primary"
              type="button"
              onClick={() => {
                setLoading(true)
                setError('')
                fetchAdminStockMovements()
                  .then((data) => setRows(Array.isArray(data) ? data : []))
                  .catch((e) => setError(e?.message || 'Failed to refresh'))
                  .finally(() => setLoading(false))
              }}
              disabled={loading}
            >
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
              <div className="bb-card-title">All Movements</div>
              <div className="bb-card-sub">Newest first &middot; IN = stock received &middot; OUT = stock dispensed</div>
            </div>
          </div>

          <div className="bb-card-body">
            <div className="bb-table-wrap">
              <table className="bb-table" aria-label="Stock movements table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Medicine</th>
                    <th>Batch</th>
                    <th>Quantity</th>
                    <th>Reference</th>
                    <th>Performed By</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>
                        Loading stock movements...
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>
                        No stock movements found.
                      </td>
                    </tr>
                  ) : (
                    rows.map((r, idx) => (
                      <tr key={`${r.id}-${idx}`}>
                        <td>{r.date}</td>
                        <td>
                          {r.type === 'IN' ? (
                            <span className="bb-status bb-status--ok">IN</span>
                          ) : (
                            <span className="bb-status bb-status--danger">OUT</span>
                          )}
                        </td>
                        <td className="bb-strong">{r.medicineName}</td>
                        <td>{r.batchNumber || '—'}</td>
                        <td style={{ fontWeight: 1000 }}>{r.quantity}</td>
                        <td>{r.reference || '—'}</td>
                        <td>{r.performedBy || '—'}</td>
                        <td style={{ maxWidth: 300 }} title={r.remarks || ''}>
                          {r.remarks || '—'}
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

