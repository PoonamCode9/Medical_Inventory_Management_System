// src/config/nav.js
export const navConfig = [
    { to: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', roles: ['admin', 'pharmacist', 'staff'] },
    { to: 'medicines', label: 'Medicines', icon: 'Pill', roles: ['admin', 'pharmacist', 'staff'] },
    { to: 'suppliers', label: 'Suppliers', icon: 'Truck', roles: ['admin', 'pharmacist'] },
    { to: 'purchase-orders', label: 'Purchase Orders', icon: 'ShoppingCart', roles: ['admin'] }, // Admin only
    { to: 'inventory', label: 'Inventory Batches', icon: 'Boxes', roles: ['admin', 'pharmacist', 'staff'] },
    { to: 'expiry-tracking', label: 'Expiry Tracker', icon: 'Clock', roles: ['admin', 'pharmacist'] },
    { to: 'dispense', label: 'Dispense & Sales', icon: 'Receipt', roles: ['admin', 'pharmacist', 'staff'] },
    { to: 'stock-logs', label: 'Stock Logs', icon: 'ClipboardList', roles: ['admin', 'pharmacist'] },
    { to: 'notifications', label: 'Notifications', icon: 'Bell', roles: ['admin', 'pharmacist', 'staff'] },
    { to: 'reports', label: 'Reports', icon: 'FileBarChart', roles: ['admin'] },
    { to: 'users', label: 'Users', icon: 'Users', roles: ['admin'] },
    { to: 'settings', label: 'Settings', icon: 'Settings', roles: ['admin', 'pharmacist', 'staff'] },
];

export function filterNavByRole(role) {
    const cleanRole = (role || 'staff').toLowerCase().replace('role_', '');
    return navConfig.filter((item) => item.roles.includes(cleanRole));
}