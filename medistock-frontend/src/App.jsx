import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Medicines from "./pages/Medicines";
import AddMedicine from "./pages/AddMedicine";

import Suppliers from "./pages/Suppliers";
import AddSupplier from "./pages/AddSupplier";

import LowStock from "./pages/LowStock";
import OutOfStock from "./pages/OutOfStock";
import NearExpiry from "./pages/NearExpiry";
import ExpiredMedicines from "./pages/ExpiredMedicines";

import InventoryHistory from "./pages/InventoryHistory";
import PurchaseOrders from "./pages/PurchaseOrders";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* ================= LOGIN ================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* ================= DASHBOARD ================= */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                {/* ================= MEDICINES ================= */}

                <Route
                    path="/medicines"
                    element={
                        <ProtectedRoute>
                            <Medicines />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/add-medicine"
                    element={
                        <ProtectedRoute>
                            <AddMedicine />
                        </ProtectedRoute>
                    }
                />


                {/* ================= SUPPLIERS ================= */}

                <Route
                    path="/suppliers"
                    element={
                        <ProtectedRoute>
                            <Suppliers />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/add-supplier"
                    element={
                        <ProtectedRoute>
                            <AddSupplier />
                        </ProtectedRoute>
                    }
                />


                {/* ================= STOCK ================= */}

                <Route
                    path="/low-stock"
                    element={
                        <ProtectedRoute>
                            <LowStock />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/out-of-stock"
                    element={
                        <ProtectedRoute>
                            <OutOfStock />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/near-expiry"
                    element={
                        <ProtectedRoute>
                            <NearExpiry />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/expired"
                    element={
                        <ProtectedRoute>
                            <ExpiredMedicines />
                        </ProtectedRoute>
                    }
                />


                {/* ================= HISTORY ================= */}

                <Route
                    path="/history"
                    element={
                        <ProtectedRoute>
                            <InventoryHistory />
                        </ProtectedRoute>
                    }
                />


                {/* ================= PURCHASES ================= */}

                <Route
                    path="/purchases"
                    element={
                        <ProtectedRoute>
                            <PurchaseOrders />
                        </ProtectedRoute>
                    }
                />


                {/* ================= DEFAULT ================= */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />


                {/* ================= INVALID URL ================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;