import { Navigate, Route, Routes } from 'react-router-dom'

import StaffDashboardHome from './StaffDashboardHome.jsx'
import PlaceholderStaffPage from './PlaceholderStaffPage.jsx'
import ReceiveInventory from './ReceiveInventory.jsx'
import StaffInventoryStockOverview from './StaffInventoryStockOverview.jsx'
import StaffAlerts from './StaffAlerts.jsx'
import StaffTasks from './StaffTasks.jsx'
import StaffNotifications from './StaffNotifications.jsx'
import Settings from './Settings.jsx'


export default function StaffRoutes() {
  return (
    <Routes>
      <Route index element={<StaffDashboardHome />} />

      <Route path="inventory" element={<StaffInventoryStockOverview />} />
      <Route
        path="receive-inventory"
        element={<ReceiveInventory />}
      />

      <Route
        path="stock-adjust"
        element={<PlaceholderStaffPage title="Stock Adjust" />}
      />
      <Route path="tasks" element={<StaffTasks />} />
      <Route path="returns" element={<PlaceholderStaffPage title="Returns" />} />
      <Route path="notifications" element={<StaffNotifications />} />
      <Route path="alerts" element={<StaffAlerts />} />
      <Route path="settings" element={<Settings />} />

      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  )
}

