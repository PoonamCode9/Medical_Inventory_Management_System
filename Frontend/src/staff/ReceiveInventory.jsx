import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import StaffLayout from './StaffLayout.jsx'
import { fetchStaffAwaitingReceipt, confirmGoodsReceipt } from '../api'

export default function ReceiveInventory() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])
  const [selectedPo, setSelectedPo] = useState(null)
  const [remarks, setRemarks] = useState('')

  const refresh = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchStaffAwaitingReceipt()
      setRows(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e?.message || 'Failed to load purchase orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleConfirm = async () => {
    if (!selectedPo) return
    try {
      await confirmGoodsReceipt(selectedPo, { remarks })
      setRemarks('')
      setSelectedPo(null)
      await refresh()
      toast.success('Goods receipt confirmed')
    } catch (e) {
      const message = e?.message || 'Failed to confirm receipt'
      setError(message)
      toast.error(message)
    }
  }

  return (
    <StaffLayout>
      <div className="bb-main-content">
        <div className="bb-page-header">
          <div>
            <h1 className="bb-page-title">Receive Inventory</h1>
            <p className="bb-page-subtitle">Confirm goods received for approved purchase orders</p>
          </div>
          <div className="bb-page-actions">
            <button className="bb-btn bb-btn--primary" type="button" onClick={refresh} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
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
              <table className="bb-table" aria-label="Awaiting receipt">
                <thead>
                  <tr>
                    <th>PO Number</th>
                    <th>Supplier</th>
                    <th>Order Date</th>
                    <th>Grand Total</th>
                    <th style={{ width: 140 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>Loading...</td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>No pending receipts.</td>
                    </tr>
                  ) : (
                    rows.map((po) => (
                      <tr key={po.poNumber}>
                        <td className="bb-strong">{po.poNumber}</td>
                        <td>{po.supplierName}</td>
                        <td>{po.orderDate}</td>
                        <td style={{ fontWeight: 1000 }}>{po.grandTotal}</td>
                        <td>
                          <button className="bb-link-btn" type="button" onClick={() => setSelectedPo(po.poNumber)}>
                            Open
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {selectedPo && (
          <div className="bb-card bb-card-body" style={{ marginTop: 14 }}>
            <div className="bb-strong">Selected: {selectedPo}</div>
            <div style={{ marginTop: 10 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontWeight: 800, fontSize: 12, color: '#334155' }}>
                Supplier remarks (optional)
                <input value={remarks} onChange={(e) => setRemarks(e.target.value)} style={{ padding: '10px 12px', borderRadius: 14, border: '1px solid rgba(148,163,184,.22)' }} />
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <button className="bb-btn" type="button" onClick={() => setSelectedPo(null)}>Cancel</button>
              <button className="bb-btn bb-btn--primary" type="button" onClick={handleConfirm}>Confirm Goods Received</button>
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  )
}

