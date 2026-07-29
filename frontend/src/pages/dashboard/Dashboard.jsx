import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import PharmacistDashboard from './PharmacistDashboard';
import StaffDashboard from './StaffDashboard';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const role = user?.role ? user.role.toUpperCase() : 'VIEWER';

  if (role.includes('ADMIN')) {
    return <AdminDashboard />;
  } else if (role.includes('PHARMACIST')) {
    return <PharmacistDashboard />;
  } else {
    // Default to Staff Dashboard for Viewer / Staff
    return <StaffDashboard />;
  }
}

