import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";


/* ================= ADMIN ================= */

import AdminDashboard from "../pages/admin/AdminDashboard";
import Medicines from "../pages/admin/Medicines";
import Suppliers from "../pages/admin/Suppliers";
import Users from "../pages/admin/Users";
import Reports from "../pages/admin/Reports";
import Notifications from "../pages/admin/Notifications";
import AdminPurchaseOrders from "../pages/admin/PurchaseOrders";
import Sales from "../pages/admin/Sales";


/* ================= STAFF ================= */

import StaffDashboard from "../pages/staff/StaffDashboard";
import StaffMedicines from "../pages/staff/Medicines";
import StaffNotifications from "../pages/staff/Notifications";


/* ================= PHARMACIST ================= */

import PharmacistDashboard from "../pages/pharmacist/PharmacistDashboard";
import PharmacistMedicines from "../pages/pharmacist/Medicines";
import PharmacistSuppliers from "../pages/pharmacist/Suppliers";
import PurchaseOrders from "../pages/pharmacist/PurchaseOrders";
import PharmacistNotifications from "../pages/pharmacist/Notifications";


/* ================= SHARED PAGES ================= */

import InventoryList from "../pages/inventory/InventoryList";


function AppRouter() {

    return (

        <BrowserRouter>

            <Routes>


                {/* ================= PUBLIC ================= */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* ================= ADMIN ================= */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute
                            allowedRoles={["ADMIN"]}
                        >
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        index
                        element={
                            <Navigate
                                to="dashboard"
                                replace
                            />
                        }
                    />

                    <Route
                        path="dashboard"
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="medicines"
                        element={<Medicines />}
                    />

                    <Route
                        path="suppliers"
                        element={<Suppliers />}
                    />

                    <Route
                        path="inventory"
                        element={<InventoryList />}
                    />

                    <Route
                        path="sales"
                        element={<Sales />}
                    />

                    <Route
                        path="purchase-orders"
                        element={<AdminPurchaseOrders />}
                    />

                    <Route
                        path="users"
                        element={<Users />}
                    />

                    <Route
                        path="reports"
                        element={<Reports />}
                    />

                    <Route
                        path="notifications"
                        element={<Notifications />}
                    />

                </Route>


                {/* ================= PHARMACIST ================= */}

                <Route
                    path="/pharmacist"
                    element={
                        <ProtectedRoute
                            allowedRoles={["PHARMACIST"]}
                        >
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        index
                        element={
                            <Navigate
                                to="dashboard"
                                replace
                            />
                        }
                    />

                    <Route
                        path="dashboard"
                        element={<PharmacistDashboard />}
                    />

                    <Route
                        path="medicines"
                        element={<PharmacistMedicines />}
                    />

                    <Route
                        path="suppliers"
                        element={<PharmacistSuppliers />}
                    />

                    <Route
                        path="inventory"
                        element={<InventoryList />}
                    />

                    <Route
                        path="sales"
                        element={<Sales />}
                    />

                    <Route
                        path="purchase-orders"
                        element={<PurchaseOrders />}
                    />

                    <Route
                        path="notifications"
                        element={<PharmacistNotifications />}
                    />

                </Route>


                {/* ================= STAFF ================= */}

                <Route
                    path="/staff"
                    element={
                        <ProtectedRoute
                            allowedRoles={["STAFF"]}
                        >
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        index
                        element={
                            <Navigate
                                to="dashboard"
                                replace
                            />
                        }
                    />

                    <Route
                        path="dashboard"
                        element={<StaffDashboard />}
                    />

                    <Route
                        path="medicines"
                        element={<StaffMedicines />}
                    />

                    <Route
                        path="inventory"
                        element={<InventoryList />}
                    />

                    <Route
                        path="sales"
                        element={<Sales />}
                    />

                    <Route
                        path="notifications"
                        element={<StaffNotifications />}
                    />

                </Route>


                {/* ================= UNKNOWN ROUTES ================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}

export default AppRouter;