import AdminLayout from './AdminLayout.jsx'
import { useEffect, useState } from 'react'
import { fetchAdminPurchaseOrderStatusHistory } from '../api'

export default function PurchaseOrderTimeline() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchAdminPurchaseOrderStatusHistory()
        setRows(Array.isArray(data) ? data : [])
      } catch (e) {
        setError(e?.message || 'Failed to load timeline')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <AdminLayout>
      <div className="bb-main-content">
        <div className="bb-page-header">
          <div>
            <h1 className="bb-page-title">Purchase Order Status Timeline</h1>
            <p className="bb-page-subtitle">All status changes ordered by time</p>
          </div>
        </div>

        {error && (
          <div className="bb-card bb-card-body" style={{ borderColor: 'rgba(239, 68, 68, .35)' }}>
            <div className="bb-strong" style={{ color: '#dc2626' }}>{error}</div>
          </div>
        )}

        <div className="bb-card bb-card--tight" style={{ marginTop: 14 }}>
          <div className="bb-card-body">
            <div className="bb-table-wrap">
              <table className="bb-table" aria-label="Status timeline">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>User</th>
                    <th>Date & Time</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>Loading...</td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>No history yet.</td>
                    </tr>
                  ) : (
                    rows.map((r, idx) => (
                      <tr key={r.changedAt || idx}>
                        <td className="bb-strong">{r.status}</td>
                        <td>{r.userName}</td>
                        <td>{r.changedAt}</td>
                        <td>{r.remarks || '-'}</td>
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

