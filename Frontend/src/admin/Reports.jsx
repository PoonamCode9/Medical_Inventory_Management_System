import { useEffect, useState, useMemo, useCallback } from 'react'
import AdminLayout from './AdminLayout.jsx'
import { generatePdf } from '../utils/pdfExport.js'
import { ADMIN_REPORTS, formatDate } from '../utils/reportHelpers.js'
import {
  fetchAdminMedicines,
  fetchAdminDispensesHistory,
  fetchAdminPurchaseOrders,
  fetchAdminUsers,
  fetchAdminSuppliers,
  fetchAdminTasks,
  fetchAdminStockMovements,
} from '../api.js'

export default function Reports() {
  const [activeReport, setActiveReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Raw data
  const [medicines, setMedicines] = useState([])
  const [dispenseHistory, setDispenseHistory] = useState({ history: [] })
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [users, setUsers] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [tasks, setTasks] = useState([])
  const [stockMovements, setStockMovements] = useState([])

  // Fetch all data on mount
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      setError('')
      try {
        const [meds, dh, pos, usrs, sups, tks, sm] = await Promise.allSettled([
          fetchAdminMedicines(),
          fetchAdminDispensesHistory(),
          fetchAdminPurchaseOrders(),
          fetchAdminUsers(),
          fetchAdminSuppliers(),
          fetchAdminTasks(),
          fetchAdminStockMovements(),
        ])

        if (meds.status === 'fulfilled') setMedicines(Array.isArray(meds.value) ? meds.value : [])
        if (dh.status === 'fulfilled') setDispenseHistory(dh.value || { history: [] })
        if (pos.status === 'fulfilled') setPurchaseOrders(Array.isArray(pos.value) ? pos.value : [])
        if (usrs.status === 'fulfilled') setUsers(Array.isArray(usrs.value) ? usrs.value : [])
        if (sups.status === 'fulfilled') setSuppliers(Array.isArray(sups.value) ? sups.value : [])
        if (tks.status === 'fulfilled') setTasks(Array.isArray(tks.value) ? tks.value : [])
        if (sm.status === 'fulfilled') setStockMovements(Array.isArray(sm.value) ? sm.value : [])

        if (meds.status === 'rejected' || dh.status === 'rejected') {
          setError('Some data could not be loaded. Partial data shown.')
        }
      } catch (e) {
        setError(e?.message || 'Failed to load report data')
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  // Compute counts
  const counts = useMemo(() => {
    const c = {}
    c.currentStock = medicines.length
    c.lowStock = medicines.filter((m) => (m.quantity ?? 0) <= 10).length
    const today = new Date()
    const thirtyDays = new Date(today)
    thirtyDays.setDate(thirtyDays.getDate() + 30)
    c.expiringStock = medicines.filter((m) => {
      if (!m.expiryDate) return false
      const exp = new Date(m.expiryDate)
      return exp <= thirtyDays
    }).length
    c.categoryWise = new Set(medicines.map((m) => m.category).filter(Boolean)).size
    c.inventoryValuation = medicines.length
    c.dispenseHistory = dispenseHistory.history?.length ?? 0
    c.purchaseHistory = purchaseOrders.length
    c.userList = users.length
    c.supplierList = suppliers.length
    c.staffTasks = tasks.length
    c.stockMovements = stockMovements.length
    return c
  }, [medicines, dispenseHistory, purchaseOrders, users, suppliers, tasks, stockMovements])

  // Build table data for selected report
  const tableData = useMemo(() => {
    if (!activeReport) return null

    switch (activeReport) {
      case 'currentStock': {
        const columns = ['#', 'Medicine Name', 'Batch No', 'Category', 'Quantity', 'Price', 'Expiry Date']
        const rows = medicines.map((m, i) => [
          i + 1,
          m.name || '—',
          m.batchNumber || '—',
          m.category || '—',
          m.quantity ?? 0,
          m.price ? `$${Number(m.price).toFixed(2)}` : '—',
          formatDate(m.expiryDate),
        ])
        return { columns, rows, title: 'Current Stock Report', subtitle: `Total items: ${medicines.length}` }
      }

      case 'lowStock': {
        const low = medicines.filter((m) => (m.quantity ?? 0) <= 10)
        const columns = ['#', 'Medicine Name', 'Batch No', 'Category', 'Quantity', 'Price', 'Expiry Date']
        const rows = low.map((m, i) => [
          i + 1,
          m.name || '—',
          m.batchNumber || '—',
          m.category || '—',
          m.quantity ?? 0,
          m.price ? `$${Number(m.price).toFixed(2)}` : '—',
          formatDate(m.expiryDate),
        ])
        return { columns, rows, title: 'Low Stock Report', subtitle: `Items with quantity ≤ 10 | Count: ${low.length}` }
      }

      case 'expiringStock': {
        const today = new Date()
        const thirtyDays = new Date(today)
        thirtyDays.setDate(thirtyDays.getDate() + 30)
        const expiring = medicines.filter((m) => {
          if (!m.expiryDate) return false
          const exp = new Date(m.expiryDate)
          return exp <= thirtyDays
        })
        const columns = ['#', 'Medicine Name', 'Batch No', 'Category', 'Quantity', 'Expiry Date', 'Days Left']
        const rows = expiring.map((m, i) => {
          const exp = new Date(m.expiryDate)
          const daysLeft = Math.ceil((exp - today) / (1000 * 60 * 60 * 24))
          return [
            i + 1,
            m.name || '—',
            m.batchNumber || '—',
            m.category || '—',
            m.quantity ?? 0,
            formatDate(m.expiryDate),
            daysLeft < 0 ? 'Expired' : `${daysLeft} days`,
          ]
        })
        return { columns, rows, title: 'Expiring Stocks Report', subtitle: `Expiring within 30 days | Count: ${expiring.length}` }
      }

      case 'dispenseHistory': {
        const items = dispenseHistory.history || []
        const columns = ['#', 'Date', 'Pharmacist', 'Medicine', 'Qty Dispensed', 'Remarks']
        const rows = items.map((d, i) => [
          i + 1,
          formatDate(d.date),
          d.pharmacistName || '—',
          d.medicineName || '—',
          d.quantityDispensed ?? 0,
          d.remarks || '—',
        ])
        return { columns, rows, title: 'Dispense History Report', subtitle: `Total dispensing records: ${items.length}` }
      }

      case 'categoryWise': {
        const catMap = {}
        medicines.forEach((m) => {
          const cat = m.category || 'Uncategorized'
          if (!catMap[cat]) catMap[cat] = { count: 0, totalQty: 0, totalValue: 0 }
          catMap[cat].count += 1
          catMap[cat].totalQty += m.quantity ?? 0
          catMap[cat].totalValue += (m.quantity ?? 0) * (Number(m.price) || 0)
        })
        const categories = Object.entries(catMap)
        const columns = ['#', 'Category', 'Unique Items', 'Total Quantity', 'Total Value']
        const rows = categories.map(([cat, info], i) => [
          i + 1,
          cat,
          info.count,
          info.totalQty,
          `$${info.totalValue.toFixed(2)}`,
        ])
        return { columns, rows, title: 'Category-wise Stock Summary', subtitle: `${categories.length} categories` }
      }

      case 'inventoryValuation': {
        const columns = ['#', 'Medicine Name', 'Batch No', 'Quantity', 'Unit Price', 'Total Value']
        const rows = medicines.map((m, i) => {
          const totalValue = (m.quantity ?? 0) * (Number(m.price) || 0)
          return [
            i + 1,
            m.name || '—',
            m.batchNumber || '—',
            m.quantity ?? 0,
            m.price ? `$${Number(m.price).toFixed(2)}` : '—',
            `$${totalValue.toFixed(2)}`,
          ]
        })
        const grandTotal = medicines.reduce((sum, m) => sum + (m.quantity ?? 0) * (Number(m.price) || 0), 0)
        return {
          columns,
          rows,
          title: 'Inventory Valuation Report',
          subtitle: `Grand Total: $${grandTotal.toFixed(2)} | Items: ${medicines.length}`,
        }
      }

      case 'purchaseHistory': {
        const columns = ['#', 'PO Number', 'Supplier', 'Order Date', 'Total Amount', 'Status']
        const rows = purchaseOrders.map((po, i) => [
          i + 1,
          po.poNumber || '—',
          po.supplier?.name || '—',
          formatDate(po.orderDate),
          po.grandTotal ? `$${Number(po.grandTotal).toFixed(2)}` : '—',
          po.overallStatus || po.adminStatus || '—',
        ])
        return { columns, rows, title: 'Purchase History Report', subtitle: `Total purchase orders: ${purchaseOrders.length}` }
      }

      case 'userList': {
        const columns = ['#', 'Name', 'Email', 'Role']
        const rows = users.map((u, i) => [i + 1, u.name || '—', u.email || '—', u.role || '—'])
        return { columns, rows, title: 'User List Report', subtitle: `Total users: ${users.length}` }
      }

      case 'supplierList': {
        const columns = ['#', 'Name', 'Contact', 'Email', 'Address']
        const rows = suppliers.map((s, i) => [
          i + 1,
          s.name || '—',
          s.contactNumber || '—',
          s.email || '—',
          s.address || '—',
        ])
        return { columns, rows, title: 'Supplier List Report', subtitle: `Total suppliers: ${suppliers.length}` }
      }

      case 'staffTasks': {
        const columns = ['#', 'Title', 'Assigned To', 'Priority', 'Status', 'Due Date', 'Created']
        const rows = tasks.map((t, i) => [
          i + 1,
          t.title || '—',
          t.assignedToName || '—',
          t.priority || '—',
          t.status || '—',
          formatDate(t.dueDate),
          formatDate(t.createdAt),
        ])
        return { columns, rows, title: 'Staff Tasks Report', subtitle: `Total tasks: ${tasks.length}` }
      }

      case 'stockMovements': {
        const columns = ['#', 'Date', 'Type', 'Medicine', 'Batch', 'Quantity', 'Reference', 'Performed By']
        const rows = stockMovements.map((sm, i) => [
          i + 1,
          sm.date || '—',
          sm.type || '—',
          sm.medicineName || '—',
          sm.batchNumber || '—',
          sm.quantity ?? 0,
          sm.reference || '—',
          sm.performedBy || '—',
        ])
        return { columns, rows, title: 'Stock Movements Report', subtitle: `Total movements: ${stockMovements.length}` }
      }

      default:
        return null
    }
  }, [activeReport, medicines, dispenseHistory, purchaseOrders, users, suppliers, tasks, stockMovements])

  const handleExportPdf = useCallback(() => {
    if (!tableData) return
    generatePdf({
      title: tableData.title,
      subtitle: tableData.subtitle,
      columns: tableData.columns,
      rows: tableData.rows,
      filename: `${activeReport}-report.pdf`,
      orientation: 'landscape',
    })
  }, [tableData, activeReport])

  const handleSelectReport = useCallback((key) => {
    setActiveReport(key)
  }, [])

  const reportDefs = ADMIN_REPORTS

  return (
    <AdminLayout>
      <div className="bb-main-content">
        <div className="bb-page-header">
          <div>
            <h1 className="bb-page-title">Reports</h1>
            <p className="bb-page-subtitle">
              Generate and export comprehensive reports as PDF — click a report card to preview data
            </p>
          </div>
        </div>

        {error && (
          <div className="bb-card bb-card-body" style={{ borderColor: 'rgba(239, 68, 68, .35)', marginBottom: 14 }}>
            <div className="bb-strong" style={{ color: '#dc2626' }}>
              {error}
            </div>
          </div>
        )}

        {/* Report Type Cards Grid */}
        <div
          className="bb-reports-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 12,
            marginBottom: 18,
          }}
        >
          {loading ? (
            <div style={{ gridColumn: '1 / -1', padding: 18, color: '#64748b', fontWeight: 900 }}>
              Loading report data...
            </div>
          ) : (
            reportDefs.map((rep) => {
              const count = counts[rep.key] ?? 0
              const isActive = activeReport === rep.key
              return (
                <button
                  key={rep.key}
                  type="button"
                  onClick={() => handleSelectReport(rep.key)}
                  className="bb-report-card"
                  style={{
                    background: isActive ? 'linear-gradient(180deg, #0b3b6f 0%, #0a2f57 100%)' : '#fff',
                    color: isActive ? '#fff' : '#0f172a',
                    border: isActive ? '2px solid #0b3b6f' : '1px solid rgba(148, 163, 184, .18)',
                    borderRadius: 14,
                    padding: 16,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all .18s ease',
                    boxShadow: isActive
                      ? '0 12px 30px rgba(11, 59, 111, .2)'
                      : '0 10px 28px rgba(2, 6, 23, .06)',
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{rep.icon}</div>
                  <div style={{ fontWeight: 1000, fontSize: 13, marginBottom: 4 }}>{rep.label}</div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 1000,
                      color: isActive ? '#60a5fa' : '#0b3b6f',
                    }}
                  >
                    {count}
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Data Preview Table */}
        {activeReport && tableData ? (
          <div className="bb-card bb-card--tight">
            <div className="bb-card-header bb-card-header--row">
              <div>
                <div className="bb-card-title">{tableData.title}</div>
                <div className="bb-card-sub">{tableData.subtitle}</div>
              </div>
              <div className="bb-page-actions">
                <button type="button" className="bb-btn bb-btn--primary" onClick={handleExportPdf}>
                  📄 Export PDF
                </button>
              </div>
            </div>

            <div className="bb-card-body">
              <div className="bb-table-wrap">
                <table className="bb-table" aria-label={`${tableData.title} table`}>
                  <thead>
                    <tr>
                      {tableData.columns.map((col, i) => (
                        <th key={i}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.rows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={tableData.columns.length}
                          style={{ padding: 18, color: '#64748b', fontWeight: 900 }}
                        >
                          No data available for this report.
                        </td>
                      </tr>
                    ) : (
                      tableData.rows.map((row, idx) => (
                        <tr key={idx}>
                          {row.map((cell, ci) => (
                            <td key={ci}>{cell}</td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : !loading ? (
          <div className="bb-card bb-card-body" style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
            <div style={{ fontWeight: 1000, fontSize: 16, marginBottom: 6 }}>Select a Report</div>
            <div style={{ color: '#64748b', fontWeight: 600 }}>
              Click on any report card above to preview the data, then export as PDF.
            </div>
          </div>
        ) : null}
      </div>
    </AdminLayout>
  )
}

