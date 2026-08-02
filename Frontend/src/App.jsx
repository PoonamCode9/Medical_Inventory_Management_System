import { BrowserRouter, Routes, Route } from "react-router-dom";
import PharmacistAddMedicine from "./pages/PharmacistAddMedicine";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import AddMedicine from "./pages/AddMedicine";
import Medicines from "./pages/Medicines";
import AddSupplier from "./pages/AddSupplier";
import Suppliers from "./pages/Suppliers";
import EditSupplier from "./pages/EditSupplier";
import AddUser from "./pages/AddUser";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import StockReport from "./pages/StockReport";
import ExpiryReport from "./pages/ExpiryReport";
import SupplierReport from "./pages/SupplierReport";
import Notifications from "./pages/Notifications";
import StaffDashboard from "./pages/StaffDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/add-supplier" element={<AddSupplier />} />
<Route path="/suppliers" element={<Suppliers />} />
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/pharmacist-dashboard" element={<PharmacistDashboard />} />
        <Route path="/add-medicine" element={<AddMedicine />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/add-supplier" element={<AddSupplier />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/stock-report" element={<StockReport />} />
        <Route
    path="/pharmacist-add-medicine"
    element={<PharmacistAddMedicine />}
/>
        <Route 
path="/edit-supplier/:id" 
element={<EditSupplier />} 
/>
<Route path="/reports" element={<Reports />} />
<Route
    path="/users"
    element={<Users />}
/>
<Route 
path="/staff-dashboard" 
element={<StaffDashboard />} 
/>
<Route
    path="/add-user"
    element={<AddUser />}
/>
<Route
    path="/notifications"
    element={<Notifications />}
/>
<Route path="/expiry-report" element={<ExpiryReport />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;