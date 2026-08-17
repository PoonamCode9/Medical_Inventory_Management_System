import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
    ClipboardList,
    Search,
    ArrowLeft,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    AlertOctagon,
    Filter,
    Calendar
} from 'lucide-react';
import { Card, CardHeader, Badge, Button } from '../components/ui';

export function StockLogsPage({ onNavigate }) {
    const { stockLogs = [], batches = [], medicines = [] } = useData() || {};
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('ALL');

    // Combine any database stock logs with computed batch logs
    const allLogs = stockLogs.length > 0 ? stockLogs : batches.map((b, idx) => {
        const med = medicines.find(m => Number(m.id) === Number(b.medicineId || b.medicine_id || b.medicine?.id));
        return {
            id: b.id || idx + 1,
            batchNumber: b.batchNumber || b.batch_number || `BATCH-00${idx + 1}`,
            medicineName: b.medicineName || b.medicine_name || med?.medicineName || med?.medicine_name || 'Pharmaceutical Item',
            movementType: Number(b.quantity) === 0 ? 'OUT_OF_STOCK' : 'ADDED',
            quantityChanged: Number(b.quantity || 0),
            logDate: b.manufacturingDate || b.manufacturing_date || new Date().toISOString().split('T')[0],
            notes: 'Initial Batch Registration'
        };
    });

    // Filtering logic
    const filteredLogs = allLogs.filter(log => {
        const matchesSearch =
            (log.medicineName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (log.batchNumber || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = typeFilter === 'ALL' || (log.movementType || '').toUpperCase() === typeFilter.toUpperCase();

        return matchesSearch && matchesType;
    });

    // Metric Calculations
    const totalMovements = allLogs.length;
    const addedUnits = allLogs
        .filter(l => ['ADDED', 'RESTOCK', 'BATCH_UPDATE'].includes((l.movementType || '').toUpperCase()))
        .reduce((sum, l) => sum + Math.abs(Number(l.quantityChanged || 0)), 0);
    const removedUnits = allLogs
        .filter(l => ['REMOVED', 'SOLD', 'DISPENSED', 'EXPIRED', 'OUT_OF_STOCK'].includes((l.movementType || '').toUpperCase()))
        .reduce((sum, l) => sum + Math.abs(Number(l.quantityChanged || 0)), 0);

    const getMovementBadge = (type) => {
        const t = (type || '').toUpperCase();
        if (t === 'ADDED' || t === 'RESTOCK') {
            return (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
                    <ArrowUpRight className="h-3.5 w-3.5" /> Stock Added
                </span>
            );
        }
        if (t === 'SOLD' || t === 'DISPENSED') {
            return (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                    <ArrowDownRight className="h-3.5 w-3.5" /> Dispensed / Sold
                </span>
            );
        }
        if (t === 'EXPIRED' || t === 'OUT_OF_STOCK') {
            return (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
                    <AlertOctagon className="h-3.5 w-3.5" /> {t.replace('_', ' ')}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <RefreshCw className="h-3.5 w-3.5" /> Batch Update
            </span>
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-ink-900 dark:text-white tracking-tight flex items-center gap-2.5">
                        <ClipboardList className="h-7 w-7 text-primary-600" /> Stock Movement Logs
                    </h1>
                    <p className="text-sm text-ink-500 mt-1">
                        Complete chronological audit trail of medicine inventory additions, dispensations, and adjustments.
                    </p>
                </div>
                <Button variant="outline" onClick={() => onNavigate('dashboard')} className="flex items-center gap-1.5 self-start md:self-auto">
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Button>
            </div>

            {/* KPI Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">Total Log Entries</span>
                        <p className="text-2xl font-bold text-ink-900 dark:text-white mt-1">{totalMovements}</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center">
                        <ClipboardList className="h-5 w-5" />
                    </div>
                </div>

                <div className="p-5 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Total Stock Inflow</span>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">+{addedUnits} Units</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                        <ArrowUpRight className="h-5 w-5" />
                    </div>
                </div>

                <div className="p-5 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">Total Stock Outflow</span>
                        <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">-{removedUnits} Units</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
                        <ArrowDownRight className="h-5 w-5" />
                    </div>
                </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-ink-900 p-4 rounded-xl border border-ink-200 dark:border-ink-800">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                    <input
                        type="text"
                        placeholder="Search by medicine or batch #..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-ink-50 dark:bg-ink-800 border border-transparent rounded-lg text-ink-800 dark:text-ink-100 placeholder-ink-400 focus:outline-none focus:bg-white dark:focus:bg-ink-900 focus:border-primary-500"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-ink-400" />
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-3 py-2 text-sm border rounded-lg bg-white dark:bg-ink-800 dark:border-ink-700 dark:text-white focus:outline-none focus:border-primary-500"
                    >
                        <option value="ALL">All Movement Types</option>
                        <option value="ADDED">Stock Added</option>
                        <option value="SOLD">Dispensed / Sold</option>
                        <option value="OUT_OF_STOCK">Out of Stock</option>
                        <option value="EXPIRED">Expired</option>
                    </select>
                </div>
            </div>

            {/* Logs Audit Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-ink-50/50 dark:bg-ink-800/40 text-ink-500 dark:text-ink-400 text-xs uppercase tracking-wider border-b border-ink-200 dark:border-ink-800">
                        <tr>
                            <th className="px-5 py-3.5 font-medium">Log Date</th>
                            <th className="px-5 py-3.5 font-medium">Medicine Details</th>
                            <th className="px-5 py-3.5 font-medium">Batch Number</th>
                            <th className="px-5 py-3.5 font-medium">Movement Type</th>
                            <th className="px-5 py-3.5 font-medium text-right">Quantity Changed</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-ink-100 dark:divide-ink-800/60">
                        {filteredLogs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-10 text-center text-ink-400">
                                    No stock logs matching your criteria.
                                </td>
                            </tr>
                        ) : (
                            filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-ink-50/50 dark:hover:bg-ink-800/30 transition-colors">
                                    <td className="px-5 py-4 whitespace-nowrap text-xs text-ink-500 dark:text-ink-400 font-mono flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {log.logDate || 'Today'}
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-ink-900 dark:text-white">
                                            {log.medicineName}
                                        </p>
                                    </td>
                                    <td className="px-5 py-4">
                                            <span className="font-mono text-xs text-ink-600 dark:text-ink-300 px-2 py-0.5 bg-ink-100 dark:bg-ink-800 rounded">
                                                {log.batchNumber}
                                            </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        {getMovementBadge(log.movementType)}
                                    </td>
                                    <td className="px-5 py-4 text-right font-bold text-ink-800 dark:text-ink-200">
                                        {['REMOVED', 'SOLD', 'DISPENSED', 'EXPIRED'].includes((log.movementType || '').toUpperCase()) ? '-' : '+'}
                                        {log.quantityChanged} units
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}