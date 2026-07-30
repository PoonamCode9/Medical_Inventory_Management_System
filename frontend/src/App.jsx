import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Medicines from './pages/Medicines';
import Categories from './pages/Categories';
import Suppliers from './pages/Suppliers';
import Purchases from './pages/Purchases';
import Sales from './pages/Sales';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Users from './pages/Users';
import AuditLogs from './pages/AuditLogs';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Layout Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PHARMACIST', 'ROLE_STAFF']}>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/medicines" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PHARMACIST', 'ROLE_STAFF']}>
                <Layout>
                  <Medicines />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/categories" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PHARMACIST', 'ROLE_STAFF']}>
                <Layout>
                  <Categories />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/suppliers" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PHARMACIST', 'ROLE_STAFF']}>
                <Layout>
                  <Suppliers />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/purchases" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PHARMACIST']}>
                <Layout>
                  <Purchases />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sales" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PHARMACIST']}>
                <Layout>
                  <Sales />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PHARMACIST']}>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <Layout>
                  <Users />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/audit-logs" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <Layout>
                  <AuditLogs />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PHARMACIST', 'ROLE_STAFF']}>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
