import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout.jsx'
import { fetchAdminPurchaseOrders, fetchAdminPurchaseOrderDetails, approveAdminPurchaseOrder, rejectAdminPurchaseOrder } from '../api'

function formatDateTime(dt) {
  if (!dt) return ''
  const d = new Date(dt)
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function timelineIcon(status) {
  const s = (status || '').toLowerCase()
  if (s.includes('cancel') || s.includes('reject') || s.includes('declin')) return '\u26D4'
  if (s.includes('complete') || s.includes('received')) return '\u2705'
  if (s.includes('accept') || s.includes('approv')) return '\u2705'
  if (s.includes('pend')) return '\u23F3'
  return '\u2022'
}

function timelineColor(status) {
  const s = (status || '').toLowerCase()
  if (s.includes('cancel') || s.includes('reject') || s.includes('declin')) return '#ef4444'
  if (s.includes('complete') || s.includes('received')) return '#22c55e'
  if (s.includes('accept') || s.includes('approv')) return '#22c55e'
  if (s.includes('pend')) return '#f59e0b'
  return '#64748b'
}

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

export default function PurchaseOrders() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])
  const [detailsPo, setDetailsPo] = useState(null)
  const [details, setDetails] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [actionPo, setActionPo] = useState(null)
  const [actionType, setActionType] = useState(null) // 'approve' or 'reject'
  const [remarks, setRemarks] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState('')

  const refresh = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchAdminPurchaseOrders()
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
      const data = await fetchAdminPurchaseOrderDetails(poNumber)
      setDetails(data)
    } catch (e) {
      setDetails(null)
      setError(e?.message || 'Failed to load details')
    } finally {
      setDetailsLoading(false)
    }
  }

  const closeDetails = () => { setDetailsPo(null); setDetails(null) }

  const openAction = (type, poNumber) => {
    setActionType(type)
    setActionPo(poNumber)
    setRemarks('')
    setActionError('')
  }

  const closeAction = () => { setActionType(null); setActionPo(null); setRemarks(''); setActionError('') }

  const handleAction = async () => {
    if (!actionPo || !actionType) return
    setActionLoading(true)
    setActionError('')
    try {
      if (actionType === 'approve') {
        await approveAdminPurchaseOrder(actionPo, remarks || null)
      } else {
        await rejectAdminPurchaseOrder(actionPo, remarks || null)
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

  const showActionButtons = details && details.overallStatus === 'Pending Admin'

  return (
    <AdminLayout>
      <div className="bb-main-content">
        <div className="bb-page-header">
          <div>
            <h1 className="bb-page-title">Purchase Orders</h1>
            <p className="bb-page-subtitle">Review and approve/reject purchase requests</p>
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
              <table className="bb-table" aria-label="Purchase orders">
                <thead>
                  <tr>
                    <th>PO Number</th>
                    <th>Supplier</th>
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
                      <td colSpan={7} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>Loading...</td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>No purchase orders found.</td>
                    </tr>
                  ) : (
                    rows.map((po) => (
                      <tr key={po.poNumber}>
                        <td className="bb-strong">{po.poNumber}</td>
                        <td>{po.supplierName}</td>
                        <td>{po.pharmacistName}</td>
                        <td>{po.orderDate}</td>
                        <td style={{ fontWeight: 1000 }}>{po.grandTotal}</td>
                        <td>
                          <span className={statusTone(po.overallStatus)}>{po.overallStatus}</span>
                        </td>
                        <td>
                          <button className="bb-link-btn" type="button" onClick={() => openDetails(po.poNumber)}>
                            View
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
                    <div><strong>Admin Status:</strong> {details.adminStatus}</div>
                    <div><strong>Supplier Status:</strong> {details.supplierStatus}</div>
                    <div><strong>Receiving Status:</strong> {details.receivingStatus}</div>
                  </div>

                  <h3 style={{ marginBottom: 10 }}>Medicines</h3>
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
                              <td>{item.medicineName}</td>
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

                  {/* Status Timeline */}
                  {details.statusHistory && details.statusHistory.length > 0 && (
                    <>
                      <h3 style={{ marginBottom: 10, marginTop: 4 }}>Status Timeline</h3>
                      <div style={{ marginBottom: 16 }}>
                        {details.statusHistory.map((h, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: 12, paddingBottom: idx < details.statusHistory.length - 1 ? 16 : 0 }}>
                            {/* Timeline line + icon */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, flexShrink: 0 }}>
                              <div style={{
                                width: 24, height: 24, borderRadius: '50%',
                                background: timelineColor(h.status), color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 12, lineHeight: 1, flexShrink: 0,
                              }}>
                                {timelineIcon(h.status)}
                              </div>
                              {idx < details.statusHistory.length - 1 && (
                                <div style={{ width: 2, flex: 1, background: '#e2e8f0', minHeight: 16 }} />
                              )}
                            </div>
                            {/* Content */}
                            <div style={{ flex: 1, paddingTop: 2 }}>
                              <div style={{ fontWeight: 1000, fontSize: 14 }}>{h.status}</div>
                              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                                {h.userName} &middot; {formatDateTime(h.changedAt)}
                              </div>
                              {h.remarks && (
                                <div style={{ fontSize: 13, color: '#475569', marginTop: 4, fontStyle: 'italic', background: '#f8fafc', padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(148,163,184,.15)' }}>
                                  "{h.remarks}"
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {showActionButtons && (
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: '1px solid rgba(148,163,184,.22)', paddingTop: 16 }}>
                      <button className="bb-btn bb-btn--primary" type="button" onClick={() => openAction('approve', detailsPo)}>
                        Approve & Send to Supplier
                      </button>
                      <button className="bb-btn bb-btn--danger" type="button" onClick={() => openAction('reject', detailsPo)}>
                        Reject
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Approve/Reject Remarks Modal */}
        {actionType && actionPo && (
          <div style={overlayStyle} onClick={closeAction}>
            <div style={{ ...modalStyle, maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ margin: '0 0 16px' }}>{actionType === 'approve' ? 'Approve' : 'Reject'} Purchase Order</h2>
              <p style={{ margin: '0 0 12px', color: '#475569' }}>{actionPo}</p>

              {actionError && (
                <div style={{ color: '#dc2626', fontWeight: 900, marginBottom: 12 }}>{actionError}</div>
              )}

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
                <span style={{ fontWeight: 1000, fontSize: 12, color: '#334155' }}>Remarks (Optional)</span>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={4}
                  placeholder={actionType === 'approve' ? 'Approval notes...' : 'Reason for rejection...'}
                  style={{ padding: '10px 12px', borderRadius: 14, border: '1px solid rgba(148,163,184,.22)' }}
                />
              </label>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button className="bb-btn" type="button" onClick={closeAction} disabled={actionLoading}>Cancel</button>
                <button
                  className={actionType === 'approve' ? 'bb-btn bb-btn--primary' : 'bb-btn bb-btn--danger'}
                  type="button"
                  onClick={handleAction}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Processing...' : `Yes, ${actionType === 'approve' ? 'Approve' : 'Reject'}`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

