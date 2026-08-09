import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import LandingPage from "./pages/LandingPage/LandingPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PharmacistDashboard from "./pages/Pharmacist/PharmacistDashboard";
import StaffDashboard from "./pages/Staff/StaffDashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Users from "./pages/Users/Users";
import Medicines from "./pages/Medicines/Medicines";
import Suppliers from "./pages/Suppliers/Suppliers";
import Reports from "./pages/Reports/Reports";
import Inventory from "./pages/Inventory/Inventory";
import PurchaseOrders from "./pages/PurchaseOrders/PurchaseOrders";
import StockLogs from "./pages/StockLogs/StockLogs";
import Notifications from "./pages/Notifications/Notifications";
import Stock from "./pages/stock/Stock";
import AnalyticsDashboard from "./pages/Analytics/Analyticsdashboard";
import purchaseOrders from "./pages/PurchaseOrders/PurchaseOrders";
import Profile from "./pages/Profile/Profile";
function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />
<Route
    path="/admin"
    element={
        <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/pharmacist"
    element={
        <ProtectedRoute allowedRoles={["Pharmacist"]}>
            <PharmacistDashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/staff"
    element={
        <ProtectedRoute allowedRoles={["Staff"]}>
            <StaffDashboard />
        </ProtectedRoute>
    }
/>
 <Route path="/medicines" element={<ProtectedRoute><Medicines /></ProtectedRoute>} />

<Route path="/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />

<Route path="/purchase-orders" element={<ProtectedRoute><PurchaseOrders /></ProtectedRoute>} />

<Route path="/stock-logs" element={<ProtectedRoute><StockLogs /></ProtectedRoute>} />

<Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />

<Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
<Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
<Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

<Route path="/stock" element={<ProtectedRoute><Stock /></ProtectedRoute>} />
<Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
  <Route path="/purchase-orders" element={<ProtectedRoute><PurchaseOrders /></ProtectedRoute>} />
      </Routes>



{/* <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />

<Route path="/prescriptions" element={<ProtectedRoute><Prescriptions /></ProtectedRoute>} /> */}

    </BrowserRouter>

  );

}

export default App;
