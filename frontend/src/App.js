import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Medicines from "./pages/Medicines";
import Suppliers from "./pages/Suppliers";
import Inventory from "./pages/Inventory";
import PurchaseOrders from "./pages/PurchaseOrders";
import ExpiryTracking from "./pages/ExpiryTracking";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";
import StockLogs from "./pages/StockLogs";
import Register from "./pages/Register";
import Analytics from "./pages/Analytics";
import OAuthSuccess from "./pages/OAuthSuccess";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/purchaseorders" element={<PurchaseOrders />} />
        <Route path="/expirytracking" element={<ExpiryTracking />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/stocklogs" element={<StockLogs />} />
        <Route path="/register" element={<Register />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
