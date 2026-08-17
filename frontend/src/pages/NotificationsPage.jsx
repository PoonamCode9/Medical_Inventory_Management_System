import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
    Bell,
    AlertTriangle,
    Clock,
    Info,
    CheckCheck,
    ArrowLeft,
    ShieldAlert
} from 'lucide-react';
import { Card, Button } from '../components/ui';

export function NotificationsPage({ onNavigate }) {
    const {
        notifications = [],
        medicines = [],
        batches = [],
        markNotificationAsRead,
        markAllNotificationsAsRead
    } = useData() || {};

    const [filterType, setFilterType] = useState('ALL');

    // Merge database notifications with live real-time stock/expiry checks
    const activeNotifications = notifications.length > 0 ? notifications : [
        ...medicines.filter(m => Number(m.totalStock || m.total_stock || 0) <= 20).map((m, idx) => ({
            id: `low-${m.id || idx}`,
            notificationType: 'LOW_STOCK',
            title: 'Low Stock Alert',
            message: `${m.medicineName || m.medicine_name || 'Medicine'} is running low (${m.totalStock || m.total_stock || 0} units left).`,
            isRead: false,
            createdAt: 'Today'
        })),
        ...batches.filter(b => {
            const dateStr = b.expiryDate || b.expiry_date;
            if (!dateStr) return false;
            const expiry = new Date(dateStr);
            const diffDays = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));
            return diffDays <= 30 && diffDays >= 0;
        }).map((b, idx) => ({
            id: `exp-${b.id || idx}`,
            notificationType: 'EXPIRY',
            title: 'Near Expiry Alert',
            message: `Batch ${b.batchNumber || b.batch_number} (${b.medicineName || b.medicine_name || 'Medicine'}) expires in ≤30 days.`,
            isRead: false,
            createdAt: 'Action required'
        }))
    ];

    const unreadCount = activeNotifications.filter(n => !n.isRead && !n.is_read).length;

    const filtered = activeNotifications.filter(n => {
        const type = (n.notificationType || n.notification_type || '').toUpperCase();
        const isUnread = !n.isRead && !n.is_read;

        if (filterType === 'UNREAD') return isUnread;
        if (filterType === 'LOW_STOCK') return type.includes('LOW');
        if (filterType === 'EXPIRY') return type.includes('EXPIR');
        return true;
    });

    const getIcon = (type) => {
        const t = (type || '').toUpperCase();
        if (t.includes('EXPIR')) {
            return (
                <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 shrink-0">
                    <Clock className="h-5 w-5" />
                </div>
            );
        }
        if (t.includes('LOW')) {
            return (
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 shrink-0">
                    <AlertTriangle className="h-5 w-5" />
                </div>
            );
        }
        return (
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shrink-0">
                <Info className="h-5 w-5" />
            </div>
        );
    };

    const activeRole = (localStorage.getItem('role') || 'staff').toLowerCase().replace('role_', '');
    const isAdmin = activeRole === 'admin';

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in text-slate-800 dark:text-slate-100">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                        <Bell className="h-7 w-7 text-blue-600 dark:text-blue-400" /> Notifications & Alerts
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        System warnings for inventory stock levels, near-expiry batches, and procurement updates.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {unreadCount > 0 && isAdmin && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={markAllNotificationsAsRead}
                            className="flex items-center gap-1.5 text-xs"
                        >
                            <CheckCheck className="h-4 w-4" /> Mark All as Read
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate('dashboard')}
                        className="flex items-center gap-1.5 text-xs"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                {[
                    { id: 'ALL', label: `All Alerts (${activeNotifications.length})` },
                    { id: 'UNREAD', label: `Unread (${unreadCount})` },
                    { id: 'LOW_STOCK', label: 'Low Stock' },
                    { id: 'EXPIRY', label: 'Expiry Alerts' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilterType(tab.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                            filterType === tab.id
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Notifications List Card */}
            <Card className="divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                {filtered.length === 0 ? (
                    <div className="py-12 text-center">
                        <ShieldAlert className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No notifications found.</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">All inventory parameters are running smoothly.</p>
                    </div>
                ) : (
                    filtered.map((item) => {
                        const isUnread = !item.isRead && !item.is_read;
                        return (
                            <div
                                key={item.id}
                                className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                                    isUnread
                                        ? 'bg-blue-50/40 dark:bg-blue-950/20'
                                        : 'bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                                }`}
                            >
                                <div className="flex items-start gap-3.5">
                                    {getIcon(item.notificationType || item.notification_type)}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                                {item.title || (item.notificationType || item.notification_type || 'System Alert').replace('_', ' ')}
                                            </h4>
                                            {isUnread && (
                                                <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                                            {item.message}
                                        </p>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1 block">
                                            {item.createdAt || item.created_at || 'Recent'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    {isUnread && (
                                        <button
                                            onClick={() => markNotificationAsRead && markNotificationAsRead(item.id)}
                                            title="Mark as read"
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <CheckCheck className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </Card>
        </div>
    );
}