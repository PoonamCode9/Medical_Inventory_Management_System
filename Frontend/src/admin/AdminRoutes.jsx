import { Navigate, Route, Routes } from 'react-router-dom'

import DashboardHome from './DashboardHome.jsx'
import MedicinesManagement from './MedicinesManagement.jsx'
import Placeholder from './Placeholder.jsx'
import UsersRoles from './UsersRoles.jsx'
import Suppliers from './Suppliers.jsx'
import StockOverview from './StockOverview.jsx'
import PurchaseOrders from './PurchaseOrders.jsx'
import PurchaseOrderTimeline from './PurchaseOrderTimeline.jsx'
import Alerts from './Alerts.jsx'
import SalesDispensingHistory from './SalesDispensingHistory.jsx'
import StockMovements from './StockMovements.jsx'
import Tasks from './Tasks.jsx'
import AdminNotifications from './AdminNotifications.jsx'
import Reports from './Reports.jsx'
import Settings from './Settings.jsx'

// currently placeholder for received page in Admin sidebar
import ReceiveInventoryAdminPlaceholder from './Placeholder.jsx'

export default function AdminRoutes() {
  return (
    <Routes>
      {/* module landing (mounted under /admin/dashboard) */}
      <Route path="/" element={<Navigate to="dashboard" replace />} />

      {/* Dashboard */}
      <Route index element={<DashboardHome />} />

      {/* Medicines */}
      <Route path="medicines" element={<MedicinesManagement />} />
      <Route path="medicines/all" element={<MedicinesManagement />} />
      <Route path="medicines/categories" element={<MedicinesManagement />} />
      <Route path="medicines/manufacturers" element={<MedicinesManagement />} />

      {/* Inventory */}
      <Route path="inventory/overview" element={<StockOverview />} />
      <Route path="inventory/movements" element={<StockMovements />} />
      <Route path="purchases/received" element={<PurchaseOrderTimeline />} />
      <Route path="inventory/adjustments" element={<Placeholder title="Adjustments" />} />
      <Route path="inventory/audits" element={<Placeholder title="Audit Logs" />} />

      {/* Purchases */}
      <Route path="purchases/orders" element={<PurchaseOrders />} />
      <Route path="purchases/received" element={<ReceiveInventoryAdminPlaceholder />} />
      <Route path="purchases/vendors" element={<Placeholder title="Vendors" />} />

      {/* Sales / Dispensing */}
      <Route path="dispensing" element={<SalesDispensingHistory />} />

      {/* Suppliers */}
      <Route path="suppliers" element={<Suppliers />} />

      {/* Users & Roles */}
      <Route path="users" element={<UsersRoles />} />

      {/* Reports */}
      <Route path="reports" element={<Reports />} />

      {/* Tasks */}
      <Route path="tasks" element={<Tasks />} />

      {/* Notifications */}
      <Route path="notifications" element={<AdminNotifications />} />

      {/* Alerts */}
      <Route path="alerts" element={<Alerts />} />
      <Route path="*alerts" element={<Alerts />} />

      {/* Settings */}
      <Route path="settings" element={<Settings />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  )
}

