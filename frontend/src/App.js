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
 

      </Routes>
    </BrowserRouter>
  );
}

export default App;