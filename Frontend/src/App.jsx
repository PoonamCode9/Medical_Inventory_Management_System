import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import LoginPage from './LoginPage.jsx'
import RegisterPage from './RegisterPage.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import PharmacistDashboard from './PharmacistDashboard.jsx'
import StaffDashboard from './StaffDashboard.jsx'
import SupplierDashboard from './SupplierDashboard.jsx'

import UsersRoles from './admin/UsersRoles.jsx'
import Suppliers from './admin/Suppliers.jsx'
import StockOverview from './admin/StockOverview.jsx'
import Alerts from './admin/Alerts.jsx'
import Dispensing from './admin/SalesDispensingHistory.jsx'
import PurchaseOrders from './admin/PurchaseOrders.jsx'
import AdminRoutes from './admin/AdminRoutes.jsx'
import Tasks from './admin/Tasks.jsx'
import AdminNotifications from './admin/AdminNotifications.jsx'
import StockMovements from './admin/StockMovements.jsx'
import Reports from './admin/Reports.jsx'

// Admin UI routes are mounted by AdminDashboard itself

import InventoryStockOverviewPharmacist from './pharmacist/InventoryStockOverviewPharmacist.jsx'
import PharmacistAlerts from './pharmacist/AlertsPharmacist.jsx'
import DispenseMedicinesPharmacist from './pharmacist/DispenseMedicinesPharmacist.jsx'
import CreatePurchaseOrder from './pharmacist/CreatePurchaseOrder.jsx'
import TasksPharmacist from './pharmacist/TasksPharmacist.jsx'
import PharmacistNotifications from './pharmacist/PharmacistNotifications.jsx'
import PharmacistReports from "./pharmacist/ReportsPharmacist.jsx"
import PharmacistSettings from "./pharmacist/Settings.jsx"

import PurchaseOrderTimeline from './admin/PurchaseOrderTimeline.jsx'
import AdminSettings from './admin/Settings.jsx'


<Route path="/admin/*" element={<AdminRoutes />} />

import ReceiveInventory from './staff/ReceiveInventory.jsx'
import StaffInventoryStockOverview from './staff/StaffInventoryStockOverview.jsx'
import StaffAlerts from './staff/StaffAlerts.jsx'
import StaffTasks from './staff/StaffTasks.jsx'
import StaffNotifications from './staff/StaffNotifications.jsx'
import Settings from './staff/Settings.jsx'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />

        {/* Alias route for direct navigation */}
        <Route path="/admin/medicines" element={<Navigate to="/admin/dashboard/medicines" replace />} />

        <Route path="/supplier/dashboard/*" element={<SupplierDashboard />} />

        <Route path="/pharmacist/dashboard" element={<PharmacistDashboard />} />

        <Route path="/staff/dashboard" element={<StaffDashboard />} />

        <Route path="/admin/users" element={<UsersRoles />} />
        {/* <Route path="/admin/dashboard/users" element={<AdminDashboard />} /> */}
        <Route path="/admin/suppliers" element={<Suppliers />} />
        <Route path="/admin/inventory/overview" element={<StockOverview />} />
        <Route path="/admin/alerts" element={<Alerts />} />
        <Route path="/admin/Dispensing" element={<Dispensing />} />
      <Route path="/admin/Purchases/Orders" element={<PurchaseOrders />} />
        <Route path="/admin/purchases/received" element={<PurchaseOrderTimeline />} />
        <Route path="/admin/tasks" element={<Tasks />} />
        <Route path="/admin/notifications" element={<AdminNotifications />} />
        <Route path="/admin/inventory/movements" element={<StockMovements />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/settings" element={<AdminSettings />} />

        {/* role-based default */}
        <Route path="/dashboard" element={<Navigate to="/login" replace />} />


        <Route path="/pharmacist/inventory" element={<InventoryStockOverviewPharmacist />} />
        <Route path="/pharmacist/alerts" element={<PharmacistAlerts />} />
        <Route path="/pharmacist/dispensing" element={<DispenseMedicinesPharmacist />} />
        <Route path="/pharmacist/purchase-requests" element={<CreatePurchaseOrder />} />
        <Route path="/pharmacist/tasks" element={<TasksPharmacist />} />
        <Route path="/pharmacist/notifications" element={<PharmacistNotifications />} />
        <Route path="/pharmacist/reports" element={<PharmacistReports />} />
        <Route path="/pharmacist/settings" element={<PharmacistSettings />} />



        <Route path="/staff/dashboard/receive-inventory" element={<ReceiveInventory />} />
        <Route path="/staff/dashboard/inventory" element={<StaffInventoryStockOverview />} />
        <Route path="/staff/dashboard/alerts" element={<StaffAlerts />} />
        <Route path="/staff/dashboard/tasks" element={<StaffTasks />} />
        <Route path="/staff/dashboard/notifications" element={<StaffNotifications />} />
        <Route path="/staff/dashboard/settings" element={<Settings />} />

      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </Router>
  )
}

export default App
