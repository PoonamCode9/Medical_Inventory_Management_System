import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <InventoryProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </InventoryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
