import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
    Search, Bell, Sun, Moon, ChevronDown, LogOut, User,
    Settings as SettingsIcon, Menu, X, Plus, Clock,
    AlertTriangle, Package, FileText, Info,
    LayoutDashboard, Pill, Boxes, Truck, ShoppingCart,
    Receipt, ClipboardList, FileBarChart, Users
} from 'lucide-react';
import { filterNavByRole } from '../config/nav';
import { useData } from '../context/DataContext';
import { Avatar, IconButton, Badge } from './ui';

// Map string icon names to actual Lucide components
const iconMap = {
    LayoutDashboard,
    Pill,
    Truck,
    ShoppingCart,
    Boxes,
    Clock,
    Receipt,
    ClipboardList,
    Bell,
    FileBarChart,
    Users,
    Settings: SettingsIcon,
};

const roleLabels = {
    admin: 'Administrator',
    pharmacist: 'Pharmacist',
    staff: 'Staff',
};

const notifIcons = {
    low_stock: AlertTriangle,
    expiry: Clock,
    po: Package,
    system: Info,
    report: FileText,
};

export function AppLayout({ role, currentPath: propPath, onNavigate: propNavigate, dark, onToggleTheme, onLogout, children }) {
    const location = useLocation();
    const routerNavigate = useNavigate();

    const navigate = propNavigate || routerNavigate;
    const currentPath = propPath || location.pathname.replace(/^\//, '') || 'dashboard';

    const {
        profile,
        notifications = [],
        medicines = [],
        batches = []
    } = useData() || {};

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const activeRole = (profile?.role || (typeof role === 'string' ? role : (localStorage.getItem('role') || 'staff'))).toLowerCase().replace('role_', '');
    const navItems = filterNavByRole(activeRole);

    const userName = profile?.username || localStorage.getItem('username') || (activeRole === 'admin' ? 'admin' : 'User');
    const userEmail = profile?.email || localStorage.getItem('email') || `${userName.toLowerCase()}@medistock.com`;
    const displayRoleLabel = roleLabels[activeRole] || (activeRole.charAt(0).toUpperCase() + activeRole.slice(1));

    // 1. UNIFIED NOTIFICATION LIST GENERATOR
    const allNotifications = useMemo(() => {
        if (notifications && notifications.length > 0) {
            return notifications;
        }

        const dynamic = [];

        // Low stock items (threshold <= 20)
        medicines.forEach((m, idx) => {
            const stock = Number(m.totalStock !== undefined ? m.totalStock : (m.total_stock !== undefined ? m.total_stock : 0));
            if (stock <= 20) {
                dynamic.push({
                    id: `low-${m.id || idx}`,
                    notification_type: 'low_stock',
                    title: 'Low Stock Alert',
                    message: `${m.medicineName || m.medicine_name || 'Medicine'} is running low (${stock} units left).`,
                    is_read: false,
                    created_at: 'Action required'
                });
            }
        });

        // Near-expiry batches (threshold <= 30 days)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        batches.forEach((b, idx) => {
            const dateStr = b.expiryDate || b.expiry_date;
            if (dateStr) {
                const expiry = new Date(dateStr);
                expiry.setHours(0, 0, 0, 0);
                const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
                if (diffDays <= 30 && diffDays >= 0) {
                    dynamic.push({
                        id: `exp-${b.id || idx}`,
                        notification_type: 'expiry',
                        title: 'Batch Near Expiry',
                        message: `Batch ${b.batchNumber || b.batch_number || 'BATCH'} (${b.medicineName || b.medicine_name || 'Medicine'}) expires in ${diffDays} days.`,
                        is_read: false,
                        created_at: 'Expiring soon'
                    });
                }
            }
        });

        return dynamic;
    }, [notifications, medicines, batches]);

    const unreadCount = useMemo(() => {
        return allNotifications.filter((n) => !n.is_read && !n.isRead).length;
    }, [allNotifications]);

    const crumbs = currentPath ? currentPath.split('/').filter(Boolean) : [];

    const handleItemClick = (targetPath) => {
        const cleanTarget = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;
        navigate(cleanTarget);
        setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex text-slate-900 dark:text-slate-100 font-sans">
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Left Sidebar */}
            <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
                z-40 flex flex-col justify-between transition-transform duration-200 shrink-0 select-none shadow-sm
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

                <div className="flex flex-col flex-1 min-h-0">
                    {/* Brand Header */}
                    <div className="h-16 flex items-center gap-2.5 px-5 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
                        <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                            <Plus className="h-5 w-5 text-white" strokeWidth={3} />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                                MediStock
                            </h1>
                            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Inventory Platform
                            </p>
                        </div>
                        <button className="ml-auto lg:hidden text-slate-400 hover:text-slate-600" onClick={() => setSidebarOpen(false)}>
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5 custom-scrollbar">
                        {navItems.map((item) => {
                            const IconComponent = iconMap[item.icon] || Boxes;
                            const itemKey = item.path || item.to.replace(/^\//, '');
                            const isActive = currentPath === itemKey || currentPath.startsWith(itemKey + '/') || location.pathname === item.to;
                            const isNotif = itemKey === 'notifications' || item.label === 'Notifications';

                            return (
                                <button
                                    key={item.to}
                                    onClick={() => handleItemClick(item.to)}
                                    className={`w-full flex items-center gap-3 px-3 h-10 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-[0.98]
                                        ${isActive
                                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50 shadow-xs'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'}`}
                                >
                                    <IconComponent className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} size={18} />
                                    <span className="truncate">{item.label}</span>

                                    {/* Sidebar Notification Badge */}
                                    {isNotif && unreadCount > 0 && (
                                        <span className="ml-auto bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full font-bold leading-none shadow-xs">
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Section: Profile + Logout */}
                <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-1 bg-slate-50/50 dark:bg-slate-900/50">
                    <button
                        onClick={() => handleItemClick('/settings')}
                        className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 hover:shadow-xs transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                        <Avatar name={userName} size="sm" />
                        <div className="text-left min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate capitalize">{userName}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{displayRoleLabel}</p>
                        </div>
                    </button>

                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2.5 px-3 h-9 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                        <LogOut className="h-4 w-4 shrink-0" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header Topbar */}
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 px-4 lg:px-6 sticky top-0 z-20 shadow-xs">
                    <button className="lg:hidden text-slate-500 hover:text-slate-800" onClick={() => setSidebarOpen(true)}>
                        <Menu className="h-5 w-5" />
                    </button>

                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            placeholder="Search medicines, inventory, orders..."
                            className="w-full h-9 pl-9 pr-12 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg
                                text-slate-800 dark:text-slate-100 placeholder-slate-400
                                focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
                    </div>

                    <div className="flex items-center gap-1.5 ml-auto">
                        <IconButton onClick={onToggleTheme} aria-label="Toggle theme">
                            {dark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
                        </IconButton>

                        {/* Topbar Notification Bell */}
                        <div className="relative">
                            <IconButton
                                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                                aria-label="Notifications"
                                className="relative"
                            >
                                <Bell size={18} className="text-slate-600 dark:text-slate-300" />

                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm animate-pulse">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                            </IconButton>

                            {notifOpen && (
                                <NotifPanel
                                    notificationList={allNotifications}
                                    unreadCount={unreadCount}
                                    onClose={() => setNotifOpen(false)}
                                    onViewAll={() => { handleItemClick('/notifications'); setNotifOpen(false); }}
                                />
                            )}
                        </div>

                        {/* Topbar User Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                                className="flex items-center gap-2 h-9 pl-1.5 pr-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <Avatar name={userName} size="sm" />
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                            </button>
                            {profileOpen && (
                                <ProfileMenu
                                    name={userName}
                                    email={userEmail}
                                    role={displayRoleLabel}
                                    onProfile={() => { handleItemClick('/settings'); setProfileOpen(false); }}
                                    onSettings={() => { handleItemClick('/settings'); setProfileOpen(false); }}
                                    onLogout={onLogout}
                                    onClose={() => setProfileOpen(false)}
                                />
                            )}
                        </div>
                    </div>
                </header>

                {/* Breadcrumb Bar */}
                <div className="h-10 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 lg:px-6">
                    <nav className="flex items-center gap-1.5 text-xs">
                        <button onClick={() => handleItemClick('/dashboard')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium">Home</button>
                        {crumbs.map((crumb, i) => (
                            <span key={i} className="flex items-center gap-1.5">
                                <span className="text-slate-300 dark:text-slate-700">/</span>
                                <span className={i === crumbs.length - 1 ? 'text-slate-800 dark:text-slate-200 font-bold capitalize' : 'text-slate-400 capitalize'}>
                                    {crumb.replace(/-/g, ' ')}
                                </span>
                            </span>
                        ))}
                    </nav>
                </div>

                {/* Page Content Viewport */}
                <main className="flex-1 p-4 lg:p-6 max-w-[1600px] w-full mx-auto">{children}</main>
            </div>
        </div>
    );
}

function NotifPanel({ notificationList, unreadCount, onClose, onViewAll }) {
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) onClose();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [onClose]);

    const latestNotifications = notificationList.slice(0, 4);

    return (
        <div
            ref={ref}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 animate-slide-up overflow-hidden"
        >
            <div className="flex items-center justify-between px-4 h-12 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Notifications</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                    {unreadCount} new
                </span>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 custom-scrollbar">
                {latestNotifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                        No notifications or alerts at this time.
                    </div>
                ) : (
                    latestNotifications.map((n) => {
                        const typeKey = (n.notification_type || n.notificationType || '').toLowerCase();
                        const Icon = notifIcons[typeKey] ?? (typeKey.includes('expir') ? Clock : AlertTriangle);
                        const isUnread = !n.is_read && !n.isRead;

                        return (
                            <div
                                key={n.id}
                                onClick={onViewAll}
                                className={`flex gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                                    isUnread ? 'bg-blue-50/40 dark:bg-blue-950/20' : 'bg-white dark:bg-slate-900'
                                }`}
                            >
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                                    typeKey.includes('expir')
                                        ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                                        : 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                                }`}>
                                    <Icon size={16} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                                        {n.title || (typeKey.includes('expir') ? 'Expiry Alert' : 'Stock Alert')}
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                                        {n.message}
                                    </p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1">
                                        {n.created_at || n.createdAt || 'Recent'}
                                    </p>
                                </div>
                                {isUnread && (
                                    <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            <button
                onClick={onViewAll}
                className="w-full h-11 text-xs font-bold text-blue-600 dark:text-blue-400 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5"
            >
                View all notifications →
            </button>
        </div>
    );
}

function ProfileMenu({ name, email, role, onProfile, onSettings, onLogout, onClose }) {
    const ref = useRef(null);
    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [onClose]);

    const roleBadgeColor = role.toLowerCase().includes('admin')
        ? 'primary'
        : role.toLowerCase().includes('pharmacist')
            ? 'info'
            : 'secondary';

    return (
        <div ref={ref} className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 z-50 animate-slide-up overflow-hidden">
            <div className="px-4 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-850">
                <div className="flex items-center gap-3">
                    <Avatar name={name} size="md" />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold text-slate-900 dark:text-white capitalize truncate">{name}</p>
                            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" title="Online" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-mono mt-0.5">{email}</p>
                    </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                    <Badge color={roleBadgeColor}>{role}</Badge>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/50">
                        Authenticated
                    </span>
                </div>
            </div>
            <div className="p-2 space-y-0.5">
                <button onClick={onProfile} className="w-full flex items-center gap-2.5 px-3 h-9 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" /> My Profile Details
                </button>
                <button onClick={onSettings} className="w-full flex items-center gap-2.5 px-3 h-9 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors">
                    <SettingsIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Account & Security Settings
                </button>
            </div>
            <div className="p-2 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-3 h-9 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors">
                    <LogOut className="h-4 w-4" /> Sign out of MediStock
                </button>
            </div>
        </div>
    );
}