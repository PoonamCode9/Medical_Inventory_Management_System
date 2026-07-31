import { useEffect, useState } from 'react'
import SupplierLayout from './SupplierLayout.jsx'
import { fetchSupplierPurchaseOrders, fetchSupplierPurchaseOrderDetails, acceptSupplierPurchaseOrder, declineSupplierPurchaseOrder } from '../api'

function statusTone(overall) {
  const s = (overall || '').toLowerCase()
  if (s.includes('cancel')) return 'bb-badge bb-badge--danger'
  if (s.includes('complete')) return 'bb-badge bb-badge--success'
  if (s.includes('await')) return 'bb-badge bb-badge--blue'
  return 'bb-badge'
}

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(15,23,42,.5)', zIndex: 999,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: 20,
}

const modalStyle = {
  background: '#fff', borderRadius: 20, maxWidth: 800, width: '100%',
  maxHeight: '90vh', overflowY: 'auto', padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,.15)',
}

function fmt(n) {
  const x = Number(n)
  if (Number.isNaN(x)) return '\u20b90.00'
  return '\u20b9' + x.toFixed(2)
}

export default function SupplierPurchaseOrders() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])
  const [detailsPo, setDetailsPo] = useState(null)
  const [details, setDetails] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [actionType, setActionType] = useState(null) // 'accept' or 'decline'
  const [remarks, setRemarks] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState('')

  const refresh = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchSupplierPurchaseOrders()
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

  const openDetails = async (poNumber) => {
    setDetailsPo(poNumber)
    setDetails(null)
    setDetailsLoading(true)
    try {
      const data = await fetchSupplierPurchaseOrderDetails(poNumber)
      setDetails(data)
    } catch (e) {
      setDetails(null)
      setError(e?.message || 'Failed to load details')
    } finally {
      setDetailsLoading(false)
    }
  }

  const closeDetails = () => { setDetailsPo(null); setDetails(null) }

  const openAction = (type) => {
    setActionType(type)
    setRemarks('')
    setActionError('')
  }

  const closeAction = () => { setActionType(null); setRemarks(''); setActionError('') }

  const handleAction = async () => {
    if (!detailsPo || !actionType) return
    setActionLoading(true)
    setActionError('')
    try {
      if (actionType === 'accept') {
        await acceptSupplierPurchaseOrder(detailsPo, remarks || null)
      } else {
        await declineSupplierPurchaseOrder(detailsPo, remarks || null)
      }
      closeAction()
      closeDetails()
      refresh()
    } catch (e) {
      setActionError(e?.message || `Failed to ${actionType}`)
    } finally {
      setActionLoading(false)
    }
  }

  const isPendingSupplier = details && details.overallStatus === 'Pending Supplier'

  return (
    <SupplierLayout>
      <div className="bb-main-content">
        <div className="bb-page-header">
          <div>
            <h1 className="bb-page-title">Purchase Orders</h1>
            <p className="bb-page-subtitle">Review and respond to assigned purchase orders</p>
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
              <table className="bb-table" aria-label="Supplier purchase orders">
                <thead>
                  <tr>
                    <th>PO Number</th>
                    <th>Pharmacist</th>
                    <th>Order Date</th>
                    <th>Grand Total</th>
                    <th>Overall Status</th>
                    <th style={{ width: 140 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>
                        Loading...
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>
                        No purchase orders.
                      </td>
                    </tr>
                  ) : (
                    rows.map((po) => (
                      <tr key={po.poNumber}>
                        <td className="bb-strong">{po.poNumber}</td>
                        <td>{po.pharmacistName}</td>
                        <td>{po.orderDate}</td>
                        <td style={{ fontWeight: 1000 }}>{po.grandTotal}</td>
                        <td>
                          <span className={statusTone(po.overallStatus)}>{po.overallStatus}</span>
                        </td>
                        <td>
                          <button className="bb-link-btn" type="button" onClick={() => openDetails(po.poNumber)}>
                            View Details
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

        {/* Details Modal */}
        {detailsPo && (
          <div style={overlayStyle} onClick={closeDetails}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ margin: 0 }}>{detailsPo}</h2>
                <button className="bb-link-btn" type="button" onClick={closeDetails}>Close</button>
              </div>

              {detailsLoading && <p style={{ color: '#64748b' }}>Loading details...</p>}

              {details && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
                    <div><strong>Supplier:</strong> {details.supplierName}</div>
                    <div><strong>Created By:</strong> {details.createdByName}</div>
                    <div><strong>Required Date:</strong> {details.requiredDateDisplay || '-'}</div>
                    <div><strong>Overall Status:</strong> <span className={statusTone(details.overallStatus)}>{details.overallStatus}</span></div>
                  </div>

                  <h3 style={{ marginBottom: 10 }}>Medicines Ordered</h3>
                  <div className="bb-table-wrap" style={{ marginBottom: 16 }}>
                    <table className="bb-table" aria-label="Purchase order items">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Medicine</th>
                          <th>Quantity Ordered</th>
                          <th>Unit Price</th>
                          <th>Expected Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {details.items && details.items.length > 0 ? (
                          details.items.map((item, idx) => (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td style={{ fontWeight: 1000 }}>{item.medicineName}</td>
                              <td>{item.quantityOrdered}</td>
                              <td>{fmt(item.unitPrice)}</td>
                              <td style={{ fontWeight: 1000 }}>{fmt(item.expectedTotal)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={5} style={{ color: '#64748b' }}>No items found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {isPendingSupplier && (
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: '1px solid rgba(148,163,184,.22)', paddingTop: 16 }}>
                      <button className="bb-btn bb-btn--primary" type="button" onClick={() => openAction('accept')}>
                        Accept & Supply
                      </button>
                      <button className="bb-btn bb-btn--danger" type="button" onClick={() => openAction('decline')}>
                        Decline
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Accept/Decline Remarks Modal */}
        {actionType && (
          <div style={overlayStyle} onClick={closeAction}>
            <div style={{ ...modalStyle, maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ margin: '0 0 16px' }}>{actionType === 'accept' ? 'Accept & Supply' : 'Decline'} Purchase Order</h2>
              <p style={{ margin: '0 0 12px', color: '#475569' }}>{detailsPo}</p>

              {actionError && (
                <div style={{ color: '#dc2626', fontWeight: 900, marginBottom: 12 }}>{actionError}</div>
              )}

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
                <span style={{ fontWeight: 1000, fontSize: 12, color: '#334155' }}>Remarks (Optional)</span>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={4}
                  placeholder={actionType === 'accept' ? 'Estimated delivery notes...' : 'Reason for declining...'}
                  style={{ padding: '10px 12px', borderRadius: 14, border: '1px solid rgba(148,163,184,.22)' }}
                />
              </label>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button className="bb-btn" type="button" onClick={closeAction} disabled={actionLoading}>Cancel</button>
                <button
                  className={actionType === 'accept' ? 'bb-btn bb-btn--primary' : 'bb-btn bb-btn--danger'}
                  type="button"
                  onClick={handleAction}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Processing...' : `Yes, ${actionType === 'accept' ? 'Accept' : 'Decline'}`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SupplierLayout>
  )
}

