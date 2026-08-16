import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from './ProtectedRoute';

// Import Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import Medicines from '../pages/medicines/Medicines';
import Inventory from '../pages/inventory/Inventory';
import Suppliers from '../pages/suppliers/Suppliers';
import PurchaseOrders from '../pages/purchaseOrders/PurchaseOrders';
import ExpiryTracker from '../pages/expiry/ExpiryTracker';
import Reports from '../pages/reports/Reports';
import Notifications from '../pages/notifications/Notifications';
import Profile from '../pages/profile/Profile';
import Settings from '../pages/settings/Settings';
import UserManagement from '../pages/userManagement/UserManagement';
import StockLogs from '../pages/stockLogs/StockLogs';
import Categories from '../pages/categories/Categories';
import AddEditMedicine from '../pages/medicines/AddEditMedicine';
import AddEditSupplier from '../pages/suppliers/AddEditSupplier';
import AddEditPurchaseOrder from '../pages/purchaseOrders/AddEditPurchaseOrder';
import AdvancedAnalytics from '../pages/analytics/AdvancedAnalytics';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Layout Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="medicines" element={<Medicines />} />
        <Route path="medicines/new" element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PHARMACIST']}>
            <AddEditMedicine />
          </ProtectedRoute>
        } />
        <Route path="medicines/:id/edit" element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PHARMACIST']}>
            <AddEditMedicine />
          </ProtectedRoute>
        } />
        <Route path="inventory" element={<Inventory />} />
        
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="suppliers/new" element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AddEditSupplier />
          </ProtectedRoute>
        } />
        <Route path="suppliers/:id/edit" element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AddEditSupplier />
          </ProtectedRoute>
        } />
        
        <Route path="categories" element={<Categories />} />
        
        <Route path="purchase-orders" element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PHARMACIST']}>
            <PurchaseOrders />
          </ProtectedRoute>
        } />
        <Route path="purchase-orders/new" element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PHARMACIST']}>
            <AddEditPurchaseOrder />
          </ProtectedRoute>
        } />
        
        <Route path="expiry" element={<ExpiryTracker />} />
        <Route path="reports" element={<Reports />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
        
        <Route path="settings" element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="user-management" element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <UserManagement />
          </ProtectedRoute>
        } />
        
        <Route path="stock-logs" element={<StockLogs />} />
        <Route path="analytics" element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PHARMACIST']}>
            <AdvancedAnalytics />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}

