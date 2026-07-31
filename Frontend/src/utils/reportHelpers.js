/**
 * Shared helpers for building report data tables.
 */

/**
 * Format a date string for reports
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

/**
 * Compute report counts for the report cards.
 * Returns an object mapping report keys to their record counts.
 */
export function computeReportCounts(data) {
  const counts = {}

  // Current Stock
  if (Array.isArray(data.medicines)) {
    counts.currentStock = data.medicines.length
    counts.lowStock = data.medicines.filter(m => (m.quantity ?? 0) <= 10).length
    const today = new Date()
    const thirtyDays = new Date(today)
    thirtyDays.setDate(thirtyDays.getDate() + 30)
    counts.expiringStock = data.medicines.filter(m => {
      if (!m.expiryDate) return false
      const exp = new Date(m.expiryDate)
      return exp <= thirtyDays
    }).length

    // Category-wise summary count
    counts.categoryWise = new Set(data.medicines.map(m => m.category).filter(Boolean)).size

    // Inventory valuation
    counts.inventoryValuation = data.medicines.length
  }

  // Dispense History
  if (Array.isArray(data.dispenseHistory?.history)) {
    counts.dispenseHistory = data.dispenseHistory.history.length
  }

  // Purchase Orders
  if (Array.isArray(data.purchaseOrders)) {
    counts.purchaseHistory = data.purchaseOrders.length
  }

  // Users
  if (Array.isArray(data.users)) {
    counts.userList = data.users.length
  }

  // Suppliers
  if (Array.isArray(data.suppliers)) {
    counts.supplierList = data.suppliers.length
  }

  // Tasks
  if (Array.isArray(data.tasks)) {
    counts.staffTasks = data.tasks.length
  }

  // Stock Movements
  if (Array.isArray(data.stockMovements)) {
    counts.stockMovements = data.stockMovements.length
  }

  return counts
}

/**
 * List of all report definitions for Admin
 */
export const ADMIN_REPORTS = [
  { key: 'currentStock', label: 'Current Stock', icon: '📦', roles: ['admin', 'pharmacist'] },
  { key: 'lowStock', label: 'Low Stock', icon: '⚠️', roles: ['admin', 'pharmacist'] },
  { key: 'expiringStock', label: 'Expiring Stocks', icon: '⏳', roles: ['admin', 'pharmacist'] },
  { key: 'dispenseHistory', label: 'Dispense History', icon: '💊', roles: ['admin', 'pharmacist'] },
  { key: 'categoryWise', label: 'Category-wise Stock', icon: '📂', roles: ['admin', 'pharmacist'] },
  { key: 'inventoryValuation', label: 'Inventory Valuation', icon: '💰', roles: ['admin'] },
  { key: 'purchaseHistory', label: 'Purchase History', icon: '📋', roles: ['admin'] },
  { key: 'userList', label: 'User List', icon: '👥', roles: ['admin'] },
  { key: 'supplierList', label: 'Supplier List', icon: '🏢', roles: ['admin'] },
  { key: 'staffTasks', label: 'Staff Tasks', icon: '📌', roles: ['admin'] },
  { key: 'stockMovements', label: 'Stock Movements', icon: '🔄', roles: ['admin'] },
]

/**
 * Get reports visible for a specific role
 */
export function getReportsForRole(role) {
  return ADMIN_REPORTS.filter(r => r.roles.includes(role))
}

