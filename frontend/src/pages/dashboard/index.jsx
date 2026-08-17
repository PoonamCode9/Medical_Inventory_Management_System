import { AdminDashboard } from './AdminDashboard';
import { PharmacistDashboard } from './PharmacistDashboard';
import { StaffDashboard } from './StaffDashboard';

export function DashboardPage({ role, onNavigate }) {
    switch (role) {
        case 'admin':
            return <AdminDashboard onNavigate={onNavigate} />;
        case 'pharmacist':
            return <PharmacistDashboard onNavigate={onNavigate} />;
        case 'staff':
        default:
            return <StaffDashboard onNavigate={onNavigate} />;
    }
}