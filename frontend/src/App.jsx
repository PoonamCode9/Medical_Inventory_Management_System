import { BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Register from "./pages/Register"
import Unauthorized from "./pages/Unauthorized";
import Users from "./pages/users/Users";
import DashboardLayout from "./layouts/DashboardLayout";
import Medicines from "./pages/medicines/Medicines";
import Suppliers from "./pages/suppliers/Suppliers";
import Inventory from "./pages/inventory/Inventory";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import AddMedicine from "./pages/medicines/AddMedicine";
import EditMedicine from "./pages/medicines/EditMedicine";
import AddSupplier from "./pages/suppliers/AddSupplier";
import EditSupplier from "./pages/suppliers/EditSupplier";
import AddInventory from "./pages/inventory/AddInventory";
import EditInventory from "./pages/inventory/EditInventory";
import ExpiryTracker from "./pages/ExpiryTracker";
import StockLogs from "./pages/StockLogs";
import DispenseSale from "./pages/DispenseSale";
import PurchaseOrders from "./pages/PurchaseOrders";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login/>}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/unauthorized" element={<Unauthorized />}></Route>

        <Route 
        path="/dashboard" 
        element={<ProtectedRoute allowedRoles={["Admin", "Pharmacist", "Staff"]}><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<ProtectedRoute allowedRoles={["Admin"]}><Users /></ProtectedRoute>} />
          <Route path="medicines" >
            <Route index  element={<ProtectedRoute allowedRoles={["Admin", "Pharmacist", "Staff"]}><Medicines />
            </ProtectedRoute>}></Route>
            <Route path="add" element={<ProtectedRoute allowedRoles={["Admin", "Pharmacist"]}><AddMedicine /></ProtectedRoute>}></Route>
            <Route path="edit/:id" element={<ProtectedRoute allowedRoles={["Admin", "Pharmacist"]}><EditMedicine /></ProtectedRoute>}></Route>
          </Route>
          <Route path="suppliers" >
            <Route index element={<ProtectedRoute allowedRoles={["Admin", "Pharmacist", "Staff"]}><Suppliers /></ProtectedRoute>} ></Route>
            <Route path="add" element={<ProtectedRoute allowedRoles={["Admin", "Pharmacist"]}><AddSupplier /></ProtectedRoute>}></Route>
            <Route path="edit/:id" element={<ProtectedRoute allowedRoles={["Admin", "Pharmacist"]}><EditSupplier /></ProtectedRoute>}></Route>
          </Route>
          <Route path="inventory" >
              <Route index element={<ProtectedRoute allowedRoles={["Admin", "Pharmacist", "Staff"]}><Inventory /></ProtectedRoute>}></Route>
              <Route path="add" element={<ProtectedRoute allowedRoles={["Admin", "Pharmacist"]}><AddInventory /></ProtectedRoute>}></Route>
              <Route path="edit/:id" element={<ProtectedRoute allowedRoles={["Admin", "Pharmacist"]}><EditInventory /></ProtectedRoute>}></Route>
          </Route>
          <Route path="reports" element={<ProtectedRoute allowedRoles={["Admin", "Pharmacist"]}><Reports /></ProtectedRoute>} />
          <Route path="notifications" element={<ProtectedRoute allowedRoles={["Admin", "Pharmacist", "Staff"]}><Notifications /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute allowedRoles={["Admin"]}><Settings /></ProtectedRoute>} />
          <Route path="expiry-tracker" element={<ProtectedRoute allowedRoles={["Admin", "Pharmacist", "Staff"]}><ExpiryTracker /></ProtectedRoute>} />
          <Route path="stock-logs" element={<ProtectedRoute allowedRoles={["Admin", "Pharmacist", "Staff"]}><StockLogs /></ProtectedRoute>} />
          <Route path="sales" element={<ProtectedRoute allowedRoles={["Admin", "Pharmacist", "Staff"]}><DispenseSale /></ProtectedRoute>} />
          <Route path="purchase-orders" element={<ProtectedRoute allowedRoles={["Admin", "Pharmacist"]}><PurchaseOrders /></ProtectedRoute>} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
 