import { Navigate, Route, Routes } from 'react-router-dom'

import SupplierDashboardHome from './SupplierDashboardHome.jsx'
import SupplierPurchaseOrders from './SupplierPurchaseOrders.jsx'

export default function SupplierRoutes() {
  return (
    <Routes>
      <Route index element={<SupplierDashboardHome />} />
      <Route path="purchase-orders" element={<SupplierPurchaseOrders />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  )
}

