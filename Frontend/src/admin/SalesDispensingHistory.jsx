import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout.jsx'

import { fetchAdminDispensesHistory } from '../api.js'

export default function SalesDispensingHistory() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchAdminDispensesHistory()
        setRows(Array.isArray(data?.history) ? data.history : [])
      } catch (e) {
        setError(e?.message || 'Failed to load dispense history')
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
            <h1 className="bb-page-title">Sales / Dispensing History</h1>
            <p className="bb-page-subtitle">Dispensed medicines with pharmacist attribution</p>
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
              <div className="bb-card-title">Dispenses</div>
              <div className="bb-card-sub">Sorted by newest first</div>
            </div>
          </div>

          <div className="bb-card-body">
            <div className="bb-table-wrap">
              <table className="bb-table" aria-label="Dispensing history table">
                <thead>
                  <tr>
                    <th>Dispense ID</th>
                    <th>Date</th>
                    <th>Pharmacist</th>
                    <th>Medicine</th>
                    <th>Quantity</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>
                        Loading dispense history...
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>
                        No dispenses found.
                      </td>
                    </tr>
                  ) : (
                    rows.map((r, idx) => (
                      <tr key={`${r.dispenseId}-${r.medicineName}-${idx}`}>
                        <td className="bb-strong">{r.dispenseId}</td>
                        <td>{r.date}</td>
                        <td>{r.pharmacistName}</td>
                        <td className="bb-strong">{r.medicineName}</td>
                        <td>{r.quantityDispensed}</td>
                        <td style={{ maxWidth: 360 }} title={r.remarks || ''}>
                          {r.remarks || ''}
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

