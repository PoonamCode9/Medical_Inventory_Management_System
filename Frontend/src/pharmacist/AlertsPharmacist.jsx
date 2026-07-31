import { useEffect, useMemo, useState } from 'react'
import PharmacistLayout from './PharmacistLayout.jsx'
import AlertsTableCard from '../admin/components/AlertsTableCard.jsx'
import { fetchAdminAlerts } from '../api.js'

function formatDays(days) {
  if (days === null || days === undefined) return '—'
  const n = Number(days)
  if (Number.isNaN(n)) return '—'
  if (n < 0) return `${Math.abs(n)}d overdue`
  if (n === 0) return 'Expires today'
  return `In ${n}d`
}

export default function AlertsPharmacist() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState({ expireSoon: [], lowStock: [] })

  const refresh = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetchAdminAlerts()
      setData({
        expireSoon: Array.isArray(res?.expireSoon) ? res.expireSoon : [],
        lowStock: Array.isArray(res?.lowStock) ? res.lowStock : [],
      })
    } catch (e) {
      setError(e?.message || 'Failed to load alerts')
      setData({ expireSoon: [], lowStock: [] })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const expireRows = useMemo(() => {
    return (data.expireSoon || []).map((r) => {
      const days = r?.daysToExpiry
      const qty = r?.quantity
      const isCritical = typeof days === 'number' && days <= 7
      const status = isCritical ? 'Critical - expiring' : 'Warning - expiring'

      return [
        r?.medicineName ?? '—',
        r?.batchNumber ?? '—',
        r?.category ?? '—',
        typeof days === 'number' ? formatDays(days) : '—',
        status,
        qty !== undefined && qty !== null ? qty : '',
      ]
    })
  }, [data.expireSoon])

  const lowStockRows = useMemo(() => {
    return (data.lowStock || []).map((r) => {
      const qty = Number(r?.quantity ?? 0)
      const isCritical = qty <= 5
      const status = isCritical ? 'Critical - low stock' : 'Warning - low stock'

      return [
        r?.medicineName ?? '—',
        r?.batchNumber ?? '—',
        r?.category ?? '—',
        qty,
        formatDays(null),
        status,
      ]
    })
  }, [data.lowStock])

  return (
    <PharmacistLayout>
      <div className="bb-main-content">
        <div className="bb-page-header">
          <div>
            <h1 className="bb-page-title">Alerts</h1>
            <p className="bb-page-subtitle">Expiring medicines & purchase alerts for low stock</p>
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignItems: 'start' }}>
          <div>
            <AlertsTableCard
              title="Expiring Soon"
              viewAllLabel="View All"
              columns={['Medicine', 'Batch', 'Category', 'Expiry', 'Priority', 'Qty']}
              rows={loading ? [['Loading...', '', '', '', '', '']] : expireRows}
            />
          </div>

          <div>
            <AlertsTableCard
              title="Low Stock (Purchase)"
              viewAllLabel="View All"
              columns={['Medicine', 'Batch', 'Category', 'Quantity', 'Expiry', 'Priority']}
              rows={loading ? [['Loading...', '', '', '', '', '']] : lowStockRows}
            />
          </div>
        </div>
      </div>
    </PharmacistLayout>
  )
}

