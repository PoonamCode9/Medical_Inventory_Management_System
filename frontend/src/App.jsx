import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Categories from './pages/Categories';
import Suppliers from './pages/Suppliers';
import Users from './pages/Users';
import Reports from './pages/Reports';
import PurchaseOrders from './pages/PurchaseOrders';
import Notifications from './pages/Notifications';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Role-based guard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route Wrapper (Redirects logged-in users away from Login page)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
          {/* Public */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Protected — all authenticated users */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            }
          />

          {/* ADMIN + PHARMACIST */}
          <Route
            path="/suppliers"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'PHARMACIST']}>
                <Suppliers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchase-orders"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'PHARMACIST']}>
                <PurchaseOrders />
              </ProtectedRoute>
            }
          />

          {/* ADMIN only */}
          <Route
            path="/categories"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'PHARMACIST']}>
                <Users />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
