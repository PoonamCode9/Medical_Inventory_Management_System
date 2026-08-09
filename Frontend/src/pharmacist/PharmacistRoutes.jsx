import { Navigate, Route, Routes } from 'react-router-dom'

import DashboardHomePharmacist from './DashboardHomePharmacist.jsx'
import Placeholder from '../admin/Placeholder.jsx'
import InventoryStockOverviewPharmacist from './InventoryStockOverviewPharmacist.jsx'
import AlertsPharmacist from './AlertsPharmacist.jsx'
import DispenseMedicinesPharmacist from './DispenseMedicinesPharmacist.jsx'
import CreatePurchaseOrder from './CreatePurchaseOrder.jsx'
import TasksPharmacist from './TasksPharmacist.jsx'
import PharmacistNotifications from './PharmacistNotifications.jsx'
import ReportsPharmacist from './ReportsPharmacist.jsx'
import Settings from './Settings.jsx'


export default function PharmacistRoutes() {

  return (
    <Routes>
      {/* module landing (mounted under /pharmacist/dashboard) */}
      <Route path="/" element={<Navigate to="dashboard" replace />} />

      {/* Dashboard */}
      <Route index element={<DashboardHomePharmacist />} />

      {/* Sales / Dispensing */}
      <Route path="dispensing" element={<DispenseMedicinesPharmacist />} />


      {/* Inventory */}
      <Route path="inventory" element={<InventoryStockOverviewPharmacist />} />

      {/* Purchase Request (Purchase Orders) */}
      <Route path="purchase-requests" element={<CreatePurchaseOrder />} />


      {/* Tasks */}
      <Route path="tasks" element={<TasksPharmacist />} />

      {/* Returns */}
      <Route path="returns" element={<Placeholder title="Returns" />} />

      {/* Notifications */}
      <Route path="notifications" element={<PharmacistNotifications />} />

      {/* Reports */}
      <Route path="reports" element={<ReportsPharmacist />} />

      {/* Alerts */}
      <Route path="alerts" element={<AlertsPharmacist />} />

      {/* Settings */}
      <Route path="settings" element={<Settings />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  )
}


