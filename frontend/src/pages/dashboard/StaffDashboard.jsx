import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Boxes, AlertTriangle, Clock,
    Package, ArrowRight
} from 'lucide-react';
import { Card, CardHeader, KpiCard, Badge, Button } from '../../components/ui';
import { useData } from '../../context/DataContext';

export function StaffDashboard({ onNavigate: propNavigate }) {
    const routerNavigate = useNavigate();
    const navigate = propNavigate || routerNavigate;
    const dataContext = useData() || {};

    const medicines = dataContext.medicines || [];
    const inventoryBatches = dataContext.inventoryBatches || dataContext.batches || [];

    const lowStock = medicines.filter((m) =>
        m.status === 'LOW' ||
        m.status === 'OUT' ||
        m.status === 'LOW_STOCK' ||
        m.status === 'OUT_OF_STOCK' ||
        Number(m.total_stock || m.totalStock || 0) <= 20
    );

    const expiringSoon = inventoryBatches.filter((b) => {
        const days = b.days_until_expiry !== undefined ? b.days_until_expiry :
            b.expiryDate ? Math.ceil((new Date(b.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)) : 999;
        return days <= 30;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Staff Operations Dashboard
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Daily stock inventory visibility, dispensary checkout, and alert monitoring
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="primary" onClick={() => navigate('/dispense')} className="shadow-sm text-xs">
                        <Package className="h-4 w-4" /> Start Dispense / Sale
                    </Button>
                </div>
            </div>

            {/* High-Contrast Interactive KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <KpiCard
                    label="Active Medicine Catalog"
                    value={medicines.length}
                    icon={<Boxes size={22} />}
                    badgeColor="primary"
                    onView={() => navigate('/medicines')}
                    actionText="Browse Medicine Catalog →"
                />
                <KpiCard
                    label="Low Stock Warnings"
                    value={lowStock.length}
                    trend="down"
                    icon={<AlertTriangle size={22} />}
                    badgeColor="warning"
                    onView={() => navigate('/medicines')}
                    actionText="Check Low Stock Items →"
                />
                <KpiCard
                    label="Expiring ≤ 30 Days"
                    value={expiringSoon.length}
                    icon={<Clock size={22} />}
                    badgeColor="error"
                    onView={() => navigate('/expiry')}
                    actionText="Open Expiry Alerts →"
                />
            </div>

            {/* Expiring soon + reorder suggestions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader
                        title="Expiring Batches"
                        subtitle="Batches reaching expiry threshold within 30 days"
                        action={
                            <Button variant="ghost" size="sm" onClick={() => navigate('/expiry')}>
                                View all <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                        }
                    />
                    <div className="px-3 pb-3 space-y-1.5">
                        {expiringSoon.length === 0 ? (
                            <p className="text-xs text-slate-400 text-center py-8">No batches expiring within 30 days.</p>
                        ) : (
                            expiringSoon.slice(0, 5).map((b, idx) => {
                                const medName = b.medicine_name || b.medicineName || b.medicine?.medicineName || b.medicine?.medicine_name || 'Medicine';
                                const batchNum = b.batch_number || b.batchNumber || `BATCH-${idx}`;
                                const expDate = b.expiry_date || b.expiryDate || 'N/A';
                                const daysLeft = b.days_until_expiry !== undefined ? b.days_until_expiry : Math.ceil((new Date(expDate) - new Date()) / (1000 * 60 * 60 * 24));

                                return (
                                    <div
                                        key={b.id || batchNum}
                                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                                        onClick={() => navigate('/expiry')}
                                    >
                                        <div className="h-9 w-9 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                                            <Clock className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{medName}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{batchNum} · Exp: {expDate}</p>
                                        </div>
                                        <Badge color="error">{daysLeft}d left</Badge>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </Card>

                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader
                        title="Inventory Levels"
                        subtitle="Items needing replenishment"
                        action={
                            <Button variant="ghost" size="sm" onClick={() => navigate('/medicines')}>
                                View catalog <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                        }
                    />
                    <div className="px-3 pb-3 space-y-1.5">
                        {lowStock.length === 0 ? (
                            <p className="text-xs text-slate-400 text-center py-8">All stock quantities are in good standing.</p>
                        ) : (
                            lowStock.slice(0, 5).map((m) => {
                                const medName = m.medicine_name || m.medicineName || 'Medicine';
                                const stockVal = m.total_stock !== undefined ? m.total_stock : (m.totalStock !== undefined ? m.totalStock : 0);

                                return (
                                    <div
                                        key={m.id}
                                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                                        onClick={() => navigate('/medicines')}
                                    >
                                        <div className="h-9 w-9 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                                            <Package size={18} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{medName}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Low stock count</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{stockVal} units</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}