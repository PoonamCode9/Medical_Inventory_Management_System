import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { Toaster } from "react-hot-toast";

import "./App.css";


/* =========================================================
   HOME
========================================================= */

import Home from "./pages/Home";


/* =========================================================
   AUTH
========================================================= */

import Login from "./pages/Login";
import Register from "./pages/Register";

import GoogleCallback from "./pages/GoogleCallback";


/* =========================================================
   ADMIN
========================================================= */

import AdminLayout from "./layouts/AdminLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";

import AddSupplier from "./pages/admin/AddSupplier";
import ViewSuppliers from "./pages/admin/ViewSuppliers";

import AddMedicine from "./pages/admin/medicines/AddMedicine";
import ViewMedicines from "./pages/admin/medicines/ViewMedicines";
import EditMedicine from "./pages/admin/medicines/EditMedicine";
import UpdateStock from "./pages/admin/medicines/UpdateStock";

import ManageUsers from "./pages/admin/ManageUsers";

import Reports from "./pages/admin/Reports";

import Settings from "./pages/admin/Settings";

import NotificationPage from "./pages/admin/NotificationPage";


/* =========================================================
   STAFF
========================================================= */

import StaffLayout from "./layouts/StaffLayout";

import StaffDashboard from "./pages/StaffDashboard";

import ViewStock from "./pages/pharmacist/ViewStock";


/* =========================================================
   PHARMACIST
========================================================= */

import PharmacistLayout from "./layouts/PharmacistLayout";

import PharmacistDashboard from "./pages/PharmacistDashboard";

import SellMedicine from "./pages/pharmacist/SellMedicine";

import ExpiryCheck from "./pages/pharmacist/ExpiryCheck";

import SalesHistory from "./pages/pharmacist/SalesHistory";


/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({
    children,
    allowedRoles
}) {

    const token =
        localStorage.getItem("token");

    const role =
        localStorage.getItem("role");


    /* -----------------------------------------
       NOT LOGGED IN
    ----------------------------------------- */

    if (!token) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    /* -----------------------------------------
       WRONG ROLE
    ----------------------------------------- */

    if (!allowedRoles.includes(role)) {

        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );

    }


    return children;
}


/* =========================================================
   UNAUTHORIZED PAGE
========================================================= */

function Unauthorized() {

    return (

        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fef2f2",
                padding: "30px"
            }}
        >

            <div
                style={{
                    background: "#ffffff",
                    padding: "50px",
                    borderRadius: "25px",
                    boxShadow:
                        "0 20px 50px rgba(0,0,0,0.12)",
                    textAlign: "center",
                    maxWidth: "500px",
                    width: "100%"
                }}
            >

                <div
                    style={{
                        fontSize: "70px",
                        marginBottom: "10px"
                    }}
                >
                    🔒
                </div>


                <h1
                    style={{
                        fontSize: "38px",
                        fontWeight: "800",
                        color: "#dc2626",
                        marginBottom: "15px"
                    }}
                >
                    Access Denied
                </h1>


                <p
                    style={{
                        color: "#64748b",
                        fontSize: "16px",
                        lineHeight: "1.6",
                        marginBottom: "30px"
                    }}
                >
                    You don't have permission to access
                    this page.
                </p>


                <button
                    onClick={() =>
                        window.history.back()
                    }
                    style={{
                        border: "none",
                        padding: "13px 28px",
                        borderRadius: "12px",
                        background: "#2563eb",
                        color: "#ffffff",
                        fontSize: "15px",
                        fontWeight: "600",
                        cursor: "pointer"
                    }}
                >
                    Go Back
                </button>

            </div>

        </div>

    );
}


/* =========================================================
   404 PAGE
========================================================= */

function NotFound() {

    return (

        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#f8fafc"
            }}
        >

            <h1
                style={{
                    fontSize: "110px",
                    fontWeight: "900",
                    color: "#2563eb",
                    margin: 0
                }}
            >
                404
            </h1>


            <h2
                style={{
                    color: "#1e293b",
                    marginTop: "10px"
                }}
            >
                Page Not Found
            </h2>


            <p
                style={{
                    color: "#64748b"
                }}
            >
                The page you are looking for does not exist.
            </p>


            <button
                onClick={() =>
                    window.location.href = "/"
                }
                style={{
                    marginTop: "20px",
                    border: "none",
                    padding: "13px 28px",
                    borderRadius: "12px",
                    background: "#2563eb",
                    color: "#ffffff",
                    fontWeight: "600",
                    cursor: "pointer"
                }}
            >
                Go To Home
            </button>

        </div>

    );
}


/* =========================================================
   APP
========================================================= */

function App() {

    return (

        <GoogleOAuthProvider
            clientId="478953468894-13dgsudp8csff06megqc50cs1sbcr6q4.apps.googleusercontent.com"
        >

            <BrowserRouter>


                {/* =================================================
                   GLOBAL TOAST SYSTEM
                ================================================= */}

                <Toaster
                    position="top-right"
                    reverseOrder={false}

                    toastOptions={{

                        duration: 3000,

                        style: {
                            borderRadius: "14px",
                            background: "#ffffff",
                            color: "#1e293b",
                            padding: "14px 18px",
                            fontSize: "14px",
                            fontWeight: "500",
                            boxShadow:
                                "0 10px 35px rgba(0,0,0,0.15)"
                        },

                        success: {

                            duration: 3000,

                            style: {
                                border:
                                    "1px solid #bbf7d0"
                            }

                        },

                        error: {

                            duration: 4000,

                            style: {
                                border:
                                    "1px solid #fecaca"
                            }

                        }

                    }}
                />


                {/* =================================================
                   ROUTES
                ================================================= */}

                <Routes>


                    {/* =================================================
                       HOME
                    ================================================= */}

                    <Route
                        path="/"
                        element={<Home />}
                    />


                    {/* =================================================
                       LOGIN
                    ================================================= */}

                    <Route
                        path="/login"
                        element={<Login />}
                    />


                    {/* =================================================
                       REGISTER
                    ================================================= */}

                    <Route
                        path="/register"
                        element={<Register />}
                    />


                    {/* =================================================
                       GOOGLE CALLBACK
                    ================================================= */}

                    <Route
                        path="/google/callback"
                        element={<GoogleCallback />}
                    />


                    {/* =================================================
                       ADMIN
                    ================================================= */}

                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "ADMIN"
                                ]}
                            >
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >

                        <Route
                            path="dashboard"
                            element={
                                <AdminDashboard />
                            }
                        />


                        <Route
                            path="add-medicine"
                            element={
                                <AddMedicine />
                            }
                        />


                        <Route
                            path="view-medicines"
                            element={
                                <ViewMedicines />
                            }
                        />


                        <Route
                            path="edit-medicine/:id"
                            element={
                                <EditMedicine />
                            }
                        />


                        <Route
                            path="update-stock"
                            element={
                                <UpdateStock />
                            }
                        />


                        <Route
                            path="add-supplier"
                            element={
                                <AddSupplier />
                            }
                        />


                        <Route
                            path="view-suppliers"
                            element={
                                <ViewSuppliers />
                            }
                        />


                        <Route
                            path="users"
                            element={
                                <ManageUsers />
                            }
                        />


                        <Route
                            path="reports"
                            element={
                                <Reports />
                            }
                        />


                        <Route
                            path="settings"
                            element={
                                <Settings />
                            }
                        />


                        <Route
                            path="notifications"
                            element={
                                <NotificationPage />
                            }
                        />

                    </Route>


                    {/* =================================================
                       STAFF
                    ================================================= */}

                    <Route
                        path="/staff"
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "STAFF"
                                ]}
                            >
                                <StaffLayout />
                            </ProtectedRoute>
                        }
                    >

                        <Route
                            path="dashboard"
                            element={
                                <StaffDashboard />
                            }
                        />


                        {/* VIEW MEDICINES */}

                        <Route
                            path="medicines"
                            element={
                                <ViewMedicines />
                            }
                        />


                        {/* VIEW SUPPLIERS */}

                        <Route
                            path="suppliers"
                            element={
                                <ViewSuppliers />
                            }
                        />


                        {/* VIEW REPORTS */}

                        <Route
                            path="reports"
                            element={
                                <Reports />
                            }
                        />


                        {/* VIEW STOCK */}

                        <Route
                            path="stock"
                            element={
                                <ViewStock />
                            }
                        />


                        {/* NOTIFICATIONS */}

                        <Route
                            path="notifications"
                            element={
                                <NotificationPage />
                            }
                        />

                    </Route>


                    {/* =================================================
                       PHARMACIST
                    ================================================= */}

                    <Route
                        path="/pharmacist"
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "PHARMACIST"
                                ]}
                            >
                                <PharmacistLayout />
                            </ProtectedRoute>
                        }
                    >

                        <Route
                            path="dashboard"
                            element={
                                <PharmacistDashboard />
                            }
                        />


                        {/* SELL MEDICINE */}

                        <Route
                            path="sell"
                            element={
                                <SellMedicine />
                            }
                        />


                        {/* VIEW STOCK */}

                        <Route
                            path="stock"
                            element={
                                <ViewStock />
                            }
                        />


                        {/* EXPIRY CHECK */}

                        <Route
                            path="expiry"
                            element={
                                <ExpiryCheck />
                            }
                        />


                        {/* SALES HISTORY */}

                        <Route
                            path="sales"
                            element={
                                <SalesHistory />
                            }
                        />


                        {/* NOTIFICATIONS */}

                        <Route
                            path="notifications"
                            element={
                                <NotificationPage />
                            }
                        />

                    </Route>


                    {/* =================================================
                       UNAUTHORIZED
                    ================================================= */}

                    <Route
                        path="/unauthorized"
                        element={
                            <Unauthorized />
                        }
                    />


                    {/* =================================================
                       404
                    ================================================= */}

                    <Route
                        path="*"
                        element={
                            <NotFound />
                        }
                    />

                </Routes>

            </BrowserRouter>

        </GoogleOAuthProvider>

    );
}


export default App;