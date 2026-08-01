import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Medicines from "./pages/Medicines";
import Suppliers from "./pages/Suppliers";
import AddMedicine from "./pages/AddMedicine";
import AddSupplier from "./pages/AddSupplier";
import LowStock from "./pages/LowStock";
import OutOfStock from "./pages/OutOfStock";
import NearExpiry from "./pages/NearExpiry";
import ExpiredMedicines from "./pages/ExpiredMedicines";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/add-medicine" element={<AddMedicine />} />
        <Route path="/add-supplier" element={<AddSupplier />} />
        <Route path="/low-stock" element={<LowStock />} />
        <Route path="/out-of-stock" element={<OutOfStock />} />
        <Route path="/near-expiry" element={<NearExpiry />} />
        <Route path="/expired" element={<ExpiredMedicines />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;