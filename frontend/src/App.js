import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Suppliers from './pages/Suppliers';
import PharmacistDashboard from './pages/PharmacistDashboard';
import StaffDashboard from './pages/StaffDashboard';
import PurchaseOrders from './pages/PurchaseOrders';
import StockHistory from './pages/StockHistory';
import StaffMedicines from './pages/StaffMedicines';
import StaffStockLevels from './pages/StaffStockLevels';
import StaffExpiry from './pages/StaffExpiry';
import UserManagement from './pages/UserManagement';

function ProtectedRoute({ children, allowedRoles }) {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/*Register Routes*/}
        <Route path="/register" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Register />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/inventory" element={
          <ProtectedRoute allowedRoles={["ADMIN", "PHARMACIST"]}>
            <Inventory />
          </ProtectedRoute>
        } />
        <Route path="/suppliers" element={
          <ProtectedRoute allowedRoles={["ADMIN", "PHARMACIST"]}>
            <Suppliers />
          </ProtectedRoute>
        } />

        {/* Pharmacist Routes */}
        <Route path="/pharmacist-dashboard" element={
          <ProtectedRoute allowedRoles={["PHARMACIST"]}>
            <PharmacistDashboard />
          </ProtectedRoute>
        } />

        {/* Staff Routes */}
        <Route path="/staff-dashboard" element={
          <ProtectedRoute allowedRoles={["STAFF"]}>
            <StaffDashboard />
          </ProtectedRoute>
        } />

        {/*Purchase Order Routes*/}
        <Route path="/purchase-orders" element={
          <ProtectedRoute allowedRoles={["ADMIN", "PHARMACIST"]}>
            <PurchaseOrders />
          </ProtectedRoute>
        } />

        {/*User Management*/}
        <Route path="/user-management" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <UserManagement />
          </ProtectedRoute>
        } />

        <Route path="/stock-history" element={
          <ProtectedRoute allowedRoles={["ADMIN", "PHARMACIST"]}>
            <StockHistory />
          </ProtectedRoute>
        } />

        <Route path="/staff-medicines" element={
          <ProtectedRoute allowedRoles={["STAFF"]}>
            <StaffMedicines />
          </ProtectedRoute>
        } />
        <Route path="/staff-stock-levels" element={
          <ProtectedRoute allowedRoles={["STAFF"]}>
             <StaffStockLevels />
          </ProtectedRoute>
        } />
        <Route path="/staff-expiry" element={
        <ProtectedRoute allowedRoles={["STAFF"]}>
           <StaffExpiry />
        </ProtectedRoute>
        } />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={
          <div style={{
            display: "flex", justifyContent: "center",
            alignItems: "center", minHeight: "100vh",
            fontFamily: "'Segoe UI', sans-serif"
          }}>
            <div style={{ textAlign: "center" }}>
              <h1 style={{ color: "#e94560", fontSize: "50px" }}>🚫</h1>
              <h2 style={{ color: "#1a1a2e" }}>Access Denied!</h2>
              <p style={{ color: "#718096" }}>
                You don't have permission to access this page.
              </p>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
                style={{
                  padding: "12px 25px",
                  background: "#e94560",
                  color: "white", border: "none",
                  borderRadius: "10px", cursor: "pointer"
                }}>
                Go to Login
              </button>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;