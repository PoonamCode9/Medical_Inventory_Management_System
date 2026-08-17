import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation,
    useNavigate,
    useParams
} from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { LoginPage } from './pages/LoginPage';
import { AppLayout } from './components/AppLayout';
import { DataProvider, useData } from './context/DataContext';
import { DashboardPage } from './pages/dashboard';
import { MedicinePage } from './pages/MedicinePage';
import { SupplierPage } from './pages/SupplierPage';
import { InventoryPage } from './pages/InventoryPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { ExpiryPage } from './pages/ExpiryPage';
import { StockLogsPage } from './pages/StockLogsPage';
import { PurchaseOrdersPage } from './pages/PurchaseOrdersPage';
import { DispensePage } from './pages/DispensePage';
import { UsersPage } from './pages/UsersPage';
import { SettingsPage } from './pages/SettingsPage';
import { Button } from './components/ui';

export default function App() {
    return (
        <DataProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </DataProvider>
    );
}

/* =========================================================
   PROTECTED ROUTE GUARD (WITH ROLE-BASED ACCESS CONTROL)
   ========================================================= */
function ProtectedRoute({ allowedRoles, children }) {
    const { profile } = useData() || {};
    const token = localStorage.getItem('token');
    const rawRole = profile?.role || localStorage.getItem('role') || 'staff';
    const cleanRole = rawRole.toLowerCase().replace('role_', '');
    const navigate = useNavigate();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(cleanRole)) {
        return (
            <div className="p-8 max-w-lg mx-auto text-center space-y-4 my-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm animate-fade-in">
                <div className="h-16 w-16 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-900/50">
                    <AlertTriangle className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">403 - Access Denied</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Your current role (<span className="font-semibold text-rose-600 uppercase">{cleanRole}</span>) does not have authorization to view this module.
                </p>
                <div className="pt-2">
                    <Button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 mx-auto">
                        <ArrowLeft className="h-4 w-4" /> Return to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return children;
}

/* =========================================================
   LAYOUT WRAPPER (BINDS APPLAYOUT AND AUTH STATE)
   ========================================================= */
function LayoutWrapper({ children }) {
    const { isDarkMode, toggleTheme, profile, logout } = useData() || {};
    const navigate = useNavigate();
    const location = useLocation();

    const rawRole = (profile?.role || localStorage.getItem('role') || 'staff').toLowerCase().replace('role_', '');
    const normalizedRole = rawRole.includes('admin')
        ? 'admin'
        : rawRole.includes('pharmacist')
            ? 'pharmacist'
            : 'staff';

    const handleLogout = () => {
        if (logout) logout();
        else {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            localStorage.removeItem('userId');
        }
        navigate('/login', { replace: true });
    };

    return (
        <AppLayout
            role={normalizedRole}
            currentPath={location.pathname.replace(/^\//, '')}
            onNavigate={(path) => navigate(path.startsWith('/') ? path : `/${path}`)}
            dark={isDarkMode}
            onToggleTheme={toggleTheme}
            onLogout={handleLogout}
        >
            {children}
        </AppLayout>
    );
}

/* =========================================================
   DYNAMIC ROUTE WRAPPERS WITH PARAMETER PARSING
   ========================================================= */
function MedicineRouteWrapper({ role }) {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    let view = 'list';
    let medId = id;
    if (location.pathname.endsWith('/new')) {
        view = 'form';
        medId = 'new';
    } else if (location.pathname.includes('/edit/')) {
        view = 'form';
    } else if (id) {
        view = 'detail';
    }

    return <MedicinePage role={role} view={view} medicineId={medId} onNavigate={(path) => navigate(path.startsWith('/') ? path : `/${path}`)} />;
}

function SupplierRouteWrapper({ role }) {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    let view = 'list';
    let supId = id;
    if (location.pathname.endsWith('/new')) {
        view = 'form';
        supId = 'new';
    } else if (location.pathname.includes('/edit/')) {
        view = 'form';
    } else if (id) {
        view = 'detail';
    }

    return <SupplierPage role={role} view={view} supplierId={supId} onNavigate={(path) => navigate(path.startsWith('/') ? path : `/${path}`)} />;
}

function InventoryRouteWrapper({ role }) {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    let view = 'list';
    let bId = id;
    if (location.pathname.endsWith('/new')) {
        view = 'form';
        bId = 'new';
    } else if (location.pathname.includes('/edit/')) {
        view = 'form';
    } else if (id) {
        view = 'detail';
    }

    return <InventoryPage role={role} view={view} batchId={bId} onNavigate={(path) => navigate(path.startsWith('/') ? path : `/${path}`)} />;
}

/* =========================================================
   APPLICATION ROUTER CONFIGURATION
   ========================================================= */
function AppRoutes() {
    const navigate = useNavigate();
    const { profile, login } = useData() || {};

    const rawRole = (profile?.role || localStorage.getItem('role') || 'staff').toLowerCase().replace('role_', '');
    const normalizedRole = rawRole.includes('admin')
        ? 'admin'
        : rawRole.includes('pharmacist')
            ? 'pharmacist'
            : 'staff';

    return (
        <Routes>
            {/* Public Login Route */}
            <Route
                path="/login"
                element={
                    <LoginPage
                        onLoginSuccess={(data) => {
                            if (login && data) login(data);
                            navigate('/dashboard', { replace: true });
                        }}
                    />
                }
            />

            {/* Base Route */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Navigate to="/dashboard" replace />
                    </ProtectedRoute>
                }
            />

            {/* 1. Dashboard */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <LayoutWrapper>
                            <DashboardPage role={normalizedRole} onNavigate={(path) => navigate(path.startsWith('/') ? path : `/${path}`)} />
                        </LayoutWrapper>
                    </ProtectedRoute>
                }
            />

            {/* 2. Medicines Catalog */}
            <Route
                path="/medicines"
                element={
                    <ProtectedRoute>
                        <LayoutWrapper>
                            <MedicineRouteWrapper role={normalizedRole} />
                        </LayoutWrapper>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/medicines/new"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <LayoutWrapper>
                            <MedicineRouteWrapper role={normalizedRole} />
                        </LayoutWrapper>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/medicines/edit/:id"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <LayoutWrapper>
                            <MedicineRouteWrapper role={normalizedRole} />
                        </LayoutWrapper>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/medicines/:id"
                element={
                    <ProtectedRoute>
                        <LayoutWrapper>
                            <MedicineRouteWrapper role={normalizedRole} />
                        </LayoutWrapper>
                    </ProtectedRoute>
                }
            />

            {/* 3. Suppliers (Admin & Pharmacist) */}
            <Route
                path="/suppliers"
                element={
                    <ProtectedRoute allowedRoles={['admin', 'pharmacist']}>
                        <LayoutWrapper>
                            <SupplierRouteWrapper role={normalizedRole} />
                        </LayoutWrapper>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/suppliers/new"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <LayoutWrapper>
                            <SupplierRouteWrapper role={normalizedRole} />
                        </LayoutWrapper>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/suppliers/edit/:id"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <LayoutWrapper>
                            <SupplierRouteWrapper role={normalizedRole} />
                        </LayoutWrapper>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/suppliers/:id"
                element={
                    <ProtectedRoute allowedRoles={['admin', 'pharmacist']}>
                        <LayoutWrapper>
                            <SupplierRouteWrapper role={normalizedRole} />
                        </LayoutWrapper>
                    </ProtectedRoute>
                }
            />

            {/* 4. Purchase Orders (Admin Only) */}
            <Route
                path="/purchase-orders"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <LayoutWrapper>
                            <PurchaseOrdersPage onNavigate={(path) => navigate(path.startsWith('/') ? path : `/${path}`)} />
                        </LayoutWrapper>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/purchase-orders/new"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <LayoutWrapper>
                            <PurchaseOrdersPage onNavigate={(path) => navigate(path.startsWith('/') ? path : `/${path}`)} />
                        </LayoutWrapper>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/purchase-orders/:id"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <LayoutWrapper>
                            <PurchaseOrdersPage onNavigate={(path) => navigate(path.startsWith('/') ? path : `/${path}`)} />
                        </LayoutWrapper>
                    </ProtectedRoute>
                }
            />

            {/* 5. Inventory Batches */}
            <Route
                path="/inventory"
                element={
                    <ProtectedRoute>
                        <LayoutWrapper>
                            <InventoryRouteWrapper role={normalizedRole} />
                        </LayoutWrapper>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/inventory/new"
                element={
                    <ProtectedRoute allowedRoles={['admin', 'pharmacist']}>
                        <LayoutWrapper>
                            <InventoryRouteWrapper role={normalizedRole} />
                        </LayoutWrapper>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/inventory/edit/:id"
                element={
                    <ProtectedRoute allowedRoles={['admin', 'pharmacist']}>
                        <LayoutWrapper>
                            <InventoryRouteWrapper role={normalizedRole} />
                        </LayoutWrapper>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/inventory/:id"
                element={
                    <ProtectedRoute>
                        <LayoutWrapper>
                            <InventoryRouteWrapper role={normalizedRole} />
                        </LayoutWrapper>
                    </ProtectedRoute>
                }
            />

            {/* 6. Expiry Tracking */}
            <Route
                path="/expiry"
                element={
                    <ProtectedRoute allowedRoles={['admin', 'pharmacist']}>
                        <LayoutWrapper>
                            <ExpiryPage onNavigate={(path) => navigate(path.startsWith('/') ? path : `/${path}`)} />
                        </LayoutWrapper>
                    </ProtectedRoute>
                }
            />
            <Route path="/expiry-tracking" element={<Navigate to="/expiry" replace />} />

            {/* 7. Dispense & POS */}
            <Route
                path="/dispense"
                element={
                    <ProtectedRoute>
                        <LayoutWrapper>
                            <DispensePage onNavigate={(path) => navigate(path.startsWith('/') ? path : `/${path}`)} />
                        </LayoutWrapper>
                    </ProtectedRoute>
                }
            />
            <Route path="/sales" element={<Navigate to="/dispense" replace />} />

            {/* 8. Stock Logs */}
            <Route
                path="/stock-logs"
                element={
                    <ProtectedRoute allowedRoles={['admin', 'pharmacist']}>
                        <LayoutWrapper>
                            <StockLogsPage onNavigate={(path) => navigate(path.startsWith('/') ? path : `/${path}`)} />
                        </LayoutWrapper>
                    </ProtectedRoute>
                }
            />

            {/* 9. Notifications */}
            <Route
                path="/notifications"
                element={
                    <ProtectedRoute>
                        <LayoutWrapper>
                            <NotificationsPage onNavigate={(path) => navigate(path.startsWith('/') ? path : `/${path}`)} />
                        </LayoutWrapper>
                    </ProtectedRoute>
                }
            />

            {/* 10. Reports (Admin Only) */}
            <Route
                path="/reports"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <LayoutWrapper>
                            <ReportsPage onNavigate={(path) => navigate(path.startsWith('/') ? path : `/${path}`)} />
                        </LayoutWrapper>
                    </ProtectedRoute>
                }
            />

            {/* 11. User Management (Admin Only) */}
            <Route
                path="/users"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <LayoutWrapper>
                            <UsersPage onNavigate={(path) => navigate(path.startsWith('/') ? path : `/${path}`)} />
                        </LayoutWrapper>
                    </ProtectedRoute>
                }
            />

            {/* 12. Settings & Profile */}
            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <LayoutWrapper>
                            <SettingsPage onNavigate={(path) => navigate(path.startsWith('/') ? path : `/${path}`)} />
                        </LayoutWrapper>
                    </ProtectedRoute>
                }
            />
            <Route path="/profile" element={<Navigate to="/settings" replace />} />

            {/* Catch-All */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}