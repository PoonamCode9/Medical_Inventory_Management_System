const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8091/api'
const AUTH_BASE_URL = `${API_BASE_URL}/auth`

function getAuthToken() {
  return localStorage.getItem('authToken')
}

function buildAuthHeaders(options = {}) {
  return {
    ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
    ...options,
  }
}

async function requestPost(baseUrl, path, payload, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...buildAuthHeaders(options.headers || {}),
    },
    body: JSON.stringify(payload),
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const errorMsg = data.message || data.error || data.detail || `Request failed (${response.status})`
    throw new Error(errorMsg)
  }

  return data
}

async function requestJson(method, url, payload, options = {}) {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...buildAuthHeaders(options.headers || {}),
    },
    body: payload === undefined ? undefined : JSON.stringify(payload),
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    // Try multiple Spring Boot error field names
    const errorMsg = data.message || data.error || data.detail || `Request failed (${response.status})`
    throw new Error(errorMsg)
  }

  return data
}

export function loginUser(payload) {
  return requestPost(AUTH_BASE_URL, '/login', payload).then((data) => {
    if (data.token) {
      localStorage.setItem('authToken', data.token)
    }
    return data
  })
}

export function registerUser(payload) {
  return requestPost(AUTH_BASE_URL, '/register', payload)
}

export function logoutUser() {
  localStorage.removeItem('authToken')
}

// Admin
export function fetchAdminUsers() {
  return requestJson('GET', `${API_BASE_URL}/admin/users`)
}

export function createAdminUser(payload) {
  return requestJson('POST', `${API_BASE_URL}/admin/users`, payload)
}

export function deleteAdminUser(id) {
  return requestJson('DELETE', `${API_BASE_URL}/admin/users/${id}`)
}

export function fetchAdminSuppliers() {
  return requestJson('GET', `${API_BASE_URL}/admin/suppliers`)
}

export function createAdminSupplier(payload) {
  return requestJson('POST', `${API_BASE_URL}/admin/suppliers`, payload)
}

export function deleteAdminSupplier(id) {
  return requestJson('DELETE', `${API_BASE_URL}/admin/suppliers/${id}`)
}

// Medicines (Stock Overview)
export function fetchAdminMedicines() {
  return requestJson('GET', `${API_BASE_URL}/admin/medicines`)
}

export function createAdminMedicine(payload) {
  return requestJson('POST', `${API_BASE_URL}/admin/medicines`, payload)
}

export function updateAdminMedicine(id, payload) {
  return requestJson('PUT', `${API_BASE_URL}/admin/medicines/${id}`, payload)
}

export function deleteAdminMedicine(id) {
  return requestJson('DELETE', `${API_BASE_URL}/admin/medicines/${id}`)
}

// Medicine ↔ Suppliers junction
export function fetchSuppliersForMedicine(medicineId) {
  return requestJson('GET', `${API_BASE_URL}/admin/medicines/${medicineId}/suppliers`)
}

export function setSuppliersForMedicine(medicineId, supplierIds) {
  return requestJson(
    'POST',
    `${API_BASE_URL}/admin/medicines/${medicineId}/suppliers`,
    { supplierIds }
  )
}

// Alerts
export function fetchAdminAlerts(params = {}) {
  const qs = new URLSearchParams(params).toString()
  const url = `${API_BASE_URL}/admin/alerts${qs ? `?${qs}` : ''}`

  return requestJson('GET', url)
}

// Dashboard KPI - Admin
export function fetchAdminDashboardKpi() {
  return requestJson('GET', `${API_BASE_URL}/admin/dashboard/kpi`)
}

// Dashboard Charts - Admin
export function fetchAdminDashboardCharts() {
  return requestJson('GET', `${API_BASE_URL}/admin/dashboard/charts`)
}

// Dashboard KPI - Pharmacist
export function fetchPharmacistDashboardKpi() {
  return requestJson('GET', `${API_BASE_URL}/pharmacist/dashboard/kpi`)
}

// Dashboard Charts - Pharmacist
export function fetchPharmacistDashboardCharts() {
  return requestJson('GET', `${API_BASE_URL}/pharmacist/dashboard/charts`)
}

// Dispenses history
export function fetchAdminDispensesHistory() {
  return requestJson('GET', `${API_BASE_URL}/admin/dispenses/history`)
}

// Stock Movements
export function fetchAdminStockMovements() {
  return requestJson('GET', `${API_BASE_URL}/admin/stock-movements`)
}

// Purchase Orders (PO) - Admin
export function fetchAdminPurchaseOrders() {
  return requestJson('GET', `${API_BASE_URL}/admin/purchase-orders`)
}

export function fetchAdminPurchaseOrderDetails(poNumber) {
  return requestJson('GET', `${API_BASE_URL}/admin/purchase-orders/${encodeURIComponent(poNumber)}`)
}

export function approveAdminPurchaseOrder(poNumber, remarks) {
  return requestJson(
    'POST',
    `${API_BASE_URL}/admin/purchase-orders/${encodeURIComponent(poNumber)}/approve`,
    { remarks }
  )
}

export function rejectAdminPurchaseOrder(poNumber, remarks) {
  return requestJson(
    'POST',
    `${API_BASE_URL}/admin/purchase-orders/${encodeURIComponent(poNumber)}/reject`,
    { remarks }
  )
}

export function fetchAdminPurchaseOrderStatusHistory() {
  return requestJson('GET', `${API_BASE_URL}/admin/purchase-order-status-history`)
}

// Purchase Orders - Pharmacist
export function createPharmacistPurchaseOrder(payload) {
  return requestJson('POST', `${API_BASE_URL}/pharmacist/purchase-orders`, payload)
}

// Purchase Orders - Staff
export function fetchStaffAwaitingReceipt() {
  return requestJson('GET', `${API_BASE_URL}/staff/purchase-orders/awaiting-receipt`)
}

export function confirmGoodsReceipt(poNumber, payload = {}) {
  return requestJson(
    'POST',
    `${API_BASE_URL}/staff/purchase-orders/${encodeURIComponent(poNumber)}/confirm-receipt`,
    payload
  )
}

// ─── Tasks (Admin) ────────────────────────────────────
export function fetchAdminTasks(params = {}) {
  const qs = new URLSearchParams(params).toString()
  const url = `${API_BASE_URL}/admin/tasks${qs ? `?${qs}` : ''}`
  return requestJson('GET', url)
}

export function fetchAdminTask(id) {
  return requestJson('GET', `${API_BASE_URL}/admin/tasks/${id}`)
}

export function createAdminTask(payload) {
  return requestJson('POST', `${API_BASE_URL}/admin/tasks`, payload)
}

export function updateAdminTask(id, payload) {
  return requestJson('PUT', `${API_BASE_URL}/admin/tasks/${id}`, payload)
}

export function deleteAdminTask(id) {
  return requestJson('DELETE', `${API_BASE_URL}/admin/tasks/${id}`)
}

export function fetchStaffUsers() {
  return requestJson('GET', `${API_BASE_URL}/admin/users/staff`)
}

// ─── Tasks (Pharmacist) ──────────────────────────────
export function fetchPharmacistTasks(params = {}) {
  const qs = new URLSearchParams(params).toString()
  const url = `${API_BASE_URL}/pharmacist/tasks${qs ? `?${qs}` : ''}`
  return requestJson('GET', url)
}

export function fetchPharmacistTask(id) {
  return requestJson('GET', `${API_BASE_URL}/pharmacist/tasks/${id}`)
}

export function createPharmacistTask(payload) {
  return requestJson('POST', `${API_BASE_URL}/pharmacist/tasks`, payload)
}

export function updatePharmacistTask(id, payload) {
  return requestJson('PUT', `${API_BASE_URL}/pharmacist/tasks/${id}`, payload)
}

export function deletePharmacistTask(id) {
  return requestJson('DELETE', `${API_BASE_URL}/pharmacist/tasks/${id}`)
}

export function fetchStaffUsersPharmacist() {
  return requestJson('GET', `${API_BASE_URL}/pharmacist/users/staff`)
}

// ─── Tasks (Staff) ──────────────────────────────────
export function fetchStaffTasks(params = {}) {
  const qs = new URLSearchParams(params).toString()
  const url = `${API_BASE_URL}/staff/tasks${qs ? `?${qs}` : ''}`
  return requestJson('GET', url)
}

export function fetchStaffTask(id) {
  return requestJson('GET', `${API_BASE_URL}/staff/tasks/${id}`)
}

export function completeStaffTask(id) {
  return requestJson('PUT', `${API_BASE_URL}/staff/tasks/${id}/complete`)
}

export function fetchStaffTaskCounts() {
  return requestJson('GET', `${API_BASE_URL}/staff/tasks/counts`)
}

// ─── Notifications (Admin) ─────────────────────────────
export function fetchAdminNotifications() {
  return requestJson('GET', `${API_BASE_URL}/admin/notifications`)
}

export function fetchAdminRecentNotifications() {
  return requestJson('GET', `${API_BASE_URL}/admin/notifications/recent`)
}

export function markAdminNotificationRead(id) {
  return requestJson('PUT', `${API_BASE_URL}/admin/notifications/${id}/read`)
}

export function markAdminAllNotificationsRead() {
  return requestJson('PUT', `${API_BASE_URL}/admin/notifications/read-all`)
}

export function fetchAdminUnreadCount() {
  return requestJson('GET', `${API_BASE_URL}/admin/notifications/unread-count`)
}

// ─── Notifications (Pharmacist) ───────────────────────
export function fetchPharmacistNotifications() {
  return requestJson('GET', `${API_BASE_URL}/pharmacist/notifications`)
}

export function fetchPharmacistRecentNotifications() {
  return requestJson('GET', `${API_BASE_URL}/pharmacist/notifications/recent`)
}

export function markPharmacistNotificationRead(id) {
  return requestJson('PUT', `${API_BASE_URL}/pharmacist/notifications/${id}/read`)
}

export function markPharmacistAllNotificationsRead() {
  return requestJson('PUT', `${API_BASE_URL}/pharmacist/notifications/read-all`)
}

export function fetchPharmacistUnreadCount() {
  return requestJson('GET', `${API_BASE_URL}/pharmacist/notifications/unread-count`)
}

// ─── Notifications (Staff) ────────────────────────────
export function fetchStaffNotifications() {
  return requestJson('GET', `${API_BASE_URL}/staff/notifications`)
}

export function fetchStaffRecentNotifications() {
  return requestJson('GET', `${API_BASE_URL}/staff/notifications/recent`)
}

export function markStaffNotificationRead(id) {
  return requestJson('PUT', `${API_BASE_URL}/staff/notifications/${id}/read`)
}

export function markStaffAllNotificationsRead() {
  return requestJson('PUT', `${API_BASE_URL}/staff/notifications/read-all`)
}

export function fetchStaffUnreadCount() {
  return requestJson('GET', `${API_BASE_URL}/staff/notifications/unread-count`)
}

// Purchase Orders - Supplier
export function fetchSupplierPurchaseOrders() {
  return requestJson('GET', `${API_BASE_URL}/supplier/purchase-orders`)
}

export function fetchSupplierPurchaseOrderDetails(poNumber) {
  return requestJson('GET', `${API_BASE_URL}/supplier/purchase-orders/${encodeURIComponent(poNumber)}`)
}

export function acceptSupplierPurchaseOrder(poNumber, remarks) {
  return requestJson(
    'POST',
    `${API_BASE_URL}/supplier/purchase-orders/${encodeURIComponent(poNumber)}/accept`,
    { remarks }
  )
}

export function declineSupplierPurchaseOrder(poNumber, remarks) {
  return requestJson(
    'POST',
    `${API_BASE_URL}/supplier/purchase-orders/${encodeURIComponent(poNumber)}/decline`,
    { remarks }
  )
}
