import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import MedicineList from "./pages/MedicineList";
import AddMedicine from "./pages/AddMedicine";
import AddSupplier from "./pages/AddSupplier";
import ViewSuppliers from "./pages/ViewSuppliers";
import EditMedicine from "./pages/EditMedicine";
import Stock from "./pages/Stock";
import AddPurchaseOrder from "./pages/AddPurchaseOrder";
import ViewPurchaseOrder from "./pages/ViewPurchaseOrder";
import StaffProfile from "./pages/StaffProfile";
import StockLogs from "./pages/StockLogs";
import PharmacistProfile from "./pages/PharmacistProfile";
import StockHistory from "./pages/StockHistory";
import ViewUsers from "./pages/ViewUsers";
import AdminProfile from "./pages/AdminProfile";
import ExpiryTracking from "./pages/ExpiryTracking";
import PharmacistLowStock from "./pages/PharmacistLowStock";
import AdminLowStock from "./pages/AdminLowStock";
import AdminLayout from "./layouts/AdminLayout";
import StaffLayout from "./layouts/StaffLayout";
import PharmacistLayout from "./layouts/PharmacistLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* ADMIN LAYOUT */}
        <Route element={<AdminLayout />}>

          <Route
            path="/admin-dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/medicines"
            element={<MedicineList />}
          />

          <Route
            path="/add-medicine"
            element={<AddMedicine />}
          />

          <Route
            path="/add-supplier"
            element={<AddSupplier />}
          />

          <Route
            path="/view-suppliers"
            element={<ViewSuppliers />}
          />

          <Route
            path="/edit-medicine/:id"
            element={<EditMedicine />}
          />

          <Route
            path="/stock"
            element={<Stock />}
          />

          <Route
            path="/add-purchase-order"
            element={<AddPurchaseOrder />}
          />

          <Route
            path="/view-purchase-orders"
            element={<ViewPurchaseOrder />}
          />

          <Route
            path="/stock-history"
            element={<StockHistory />}
          />

          <Route
            path="/users"
            element={<ViewUsers />}
          />

          <Route
            path="/admin-profile"
            element={<AdminProfile />}
          />
          <Route
            path="/expiry-tracking"
            element={<ExpiryTracking />}
          />
          <Route
            path="/admin-low-stock"
            element={<AdminLowStock />}
          />

        </Route>
        {/* END ADMIN LAYOUT */}


        {/* STAFF */}
        <Route element={<StaffLayout />}>

          <Route
            path="/staff-dashboard"
            element={<StaffDashboard />}
          />

          <Route
            path="/staff-medicines"
            element={<MedicineList />}
          />

          <Route
            path="/staff-purchase-orders"
            element={<ViewPurchaseOrder />}
          />

          <Route
            path="/stock-logs"
            element={<StockLogs />}
          />

          <Route
            path="/staff-profile"
            element={<StaffProfile />}
          />

        </Route>


        {/* PHARMACIST */}
        <Route element={<PharmacistLayout />}>

          <Route
            path="/pharmacist-dashboard"
            element={<PharmacistDashboard />}
          />

          <Route
            path="/pharmacist-medicines"
            element={<MedicineList />}
          />

          <Route
            path="/pharmacist-stock"
            element={<Stock />}
          />

          <Route
            path="/pharmacist-suppliers"
            element={<ViewSuppliers />}
          />

          <Route
            path="/pharmacist-profile"
            element={<PharmacistProfile />}
          />
          <Route
            path="/pharmacist-low-stock"
            element={<PharmacistLowStock />}
          />
          <Route
            path="/pharmacist-expiry-tracking"
            element={<ExpiryTracking />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;