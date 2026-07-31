import { useEffect, useState, useMemo, useCallback } from 'react'
import PharmacistLayout from './PharmacistLayout.jsx'
import { generatePdf } from '../utils/pdfExport.js'
import { formatDate } from '../utils/reportHelpers.js'
import { fetchAdminMedicines, fetchAdminDispensesHistory } from '../api.js'

const PHARMACIST_REPORTS = [
  { key: 'currentStock', label: 'Current Stock', icon: '📦' },
  { key: 'lowStock', label: 'Low Stock', icon: '⚠️' },
  { key: 'expiringStock', label: 'Expiring Stocks', icon: '⏳' },
  { key: 'dispenseHistory', label: 'Dispense History', icon: '💊' },
  { key: 'categoryWise', label: 'Category-wise Stock', icon: '📂' },
  { key: 'inventoryValuation', label: 'Inventory Valuation', icon: '💰' },
]

export default function ReportsPharmacist() {
  const [activeReport, setActiveReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [medicines, setMedicines] = useState([])
  const [dispenseHistory, setDispenseHistory] = useState({ history: [] })

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      setError('')
      try {
        const [meds, dh] = await Promise.allSettled([
          fetchAdminMedicines(),
          fetchAdminDispensesHistory(),
        ])

        if (meds.status === 'fulfilled') setMedicines(Array.isArray(meds.value) ? meds.value : [])
        if (dh.status === 'fulfilled') setDispenseHistory(dh.value || { history: [] })

        if (meds.status === 'rejected') setError('Some data could not be loaded.')
      } catch (e) {
        setError(e?.message || 'Failed to load report data')
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  const counts = useMemo(() => {
    const c = {}
    c.currentStock = medicines.length
    c.lowStock = medicines.filter((m) => (m.quantity ?? 0) <= 10).length
    const today = new Date()
    const thirtyDays = new Date(today)
    thirtyDays.setDate(thirtyDays.getDate() + 30)
    c.expiringStock = medicines.filter((m) => {
      if (!m.expiryDate) return false
      return new Date(m.expiryDate) <= thirtyDays
    }).length
    c.categoryWise = new Set(medicines.map((m) => m.category).filter(Boolean)).size
    c.inventoryValuation = medicines.length
    c.dispenseHistory = dispenseHistory.history?.length ?? 0
    return c
  }, [medicines, dispenseHistory])

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
          return new Date(m.expiryDate) <= thirtyDays
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

      default:
        return null
    }
  }, [activeReport, medicines, dispenseHistory])

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

  return (
    <PharmacistLayout>
      <div className="bb-main-content">
        <div className="bb-page-header">
          <div>
            <h1 className="bb-page-title">Reports</h1>
            <p className="bb-page-subtitle">
              Generate and export reports as PDF — click a report card to preview data
            </p>
          </div>
        </div>

        {error && (
          <div className="bb-card bb-card-body" style={{ borderColor: 'rgba(239, 68, 68, .35)', marginBottom: 14 }}>
            <div className="bb-strong" style={{ color: '#dc2626' }}>{error}</div>
          </div>
        )}

        {/* Report Cards */}
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
            PHARMACIST_REPORTS.map((rep) => {
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

        {/* Data Preview */}
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
                        <td colSpan={tableData.columns.length} style={{ padding: 18, color: '#64748b', fontWeight: 900 }}>
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
    </PharmacistLayout>
  )
}

