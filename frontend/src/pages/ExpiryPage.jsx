import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ShieldAlert, AlertTriangle, Clock, ArrowLeft, Eye, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, Badge, Button } from '../components/ui';

export function ExpiryPage({ onNavigate }) {
    const { batches = [] } = useData();
    const [filterDays, setFilterDays] = useState(60);
    // 'expiring' = batches expiring within threshold, 'expired' = already expired batches
    const [activeTab, setActiveTab] = useState('expiring');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter for batches expiring within selected days (and not yet expired)
    const filteredExpiring = batches.filter(b => {
        const dateStr = b.expiryDate || b.expiry_date;
        if (!dateStr) return false;
        const expiry = new Date(dateStr);
        expiry.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        return diffDays <= filterDays && diffDays >= 0;
    });

    // Filter for batches that have already expired
    const filteredExpired = batches.filter(b => {
        const dateStr = b.expiryDate || b.expiry_date;
        if (!dateStr) return false;
        const expiry = new Date(dateStr);
        expiry.setHours(0, 0, 0, 0);
        return expiry < today;
    });

    const displayedList = activeTab === 'expiring' ? filteredExpiring : filteredExpired;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-ink-900 dark:text-white tracking-tight">
                        Expiry Tracking & Management
                    </h1>
                    <p className="text-sm text-ink-500 mt-1">
                        Monitor near-expiry batches, expired inventory, and threshold alerts.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={filterDays}
                        onChange={(e) => setFilterDays(Number(e.target.value))}
                        className="px-3 py-2 text-sm border rounded-lg bg-white dark:bg-ink-900 dark:border-ink-800 dark:text-white focus:outline-none focus:border-primary-500"
                    >
                        <option value={7}>Next 7 Days</option>
                        <option value={30}>Next 30 Days</option>
                        <option value={60}>Next 60 Days</option>
                        <option value={90}>Next 90 Days</option>
                    </select>
                    <Button variant="outline" onClick={() => onNavigate('dashboard')} className="flex items-center gap-1.5">
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Button>
                </div>
            </div>

            {/* Interactive Summary Metric Cards with View Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Expiring Batches Card */}
                <div
                    onClick={() => setActiveTab('expiring')}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        activeTab === 'expiring'
                            ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/20 shadow-sm'
                            : 'bg-white dark:bg-ink-900 border-ink-200 dark:border-ink-800 hover:border-rose-300 dark:hover:border-rose-900/50'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                            Expiring Within {filterDays} Days
                        </span>
                        <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600">
                            <Clock className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-3xl font-extrabold text-rose-700 dark:text-rose-400">
                            {filteredExpiring.length} Batches
                        </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-rose-100 dark:border-rose-900/40 flex items-center justify-between">
                        <span className="text-xs text-ink-500">Threshold: ≤ {filterDays} days</span>
                        <button
                            onClick={(e) => { e.stopPropagation(); setActiveTab('expiring'); }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm"
                        >
                            <Eye className="h-3.5 w-3.5" /> View List
                        </button>
                    </div>
                </div>

                {/* 2. Already Expired Batches Card */}
                <div
                    onClick={() => setActiveTab('expired')}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        activeTab === 'expired'
                            ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                            : 'bg-white dark:bg-ink-900 border-ink-200 dark:border-ink-800 hover:border-amber-300 dark:hover:border-amber-900/50'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            Already Expired
                        </span>
                        <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600">
                            <ShieldAlert className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-3xl font-extrabold text-amber-700 dark:text-amber-400">
                            {filteredExpired.length} Batches
                        </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-amber-100 dark:border-amber-900/40 flex items-center justify-between">
                        <span className="text-xs text-ink-500">Requires disposal / return</span>
                        <button
                            onClick={(e) => { e.stopPropagation(); setActiveTab('expired'); }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-sm"
                        >
                            <Eye className="h-3.5 w-3.5" /> View List
                        </button>
                    </div>
                </div>
            </div>

            {/* Dynamic Active Expiry Audit List */}
            <Card className="p-5">
                <CardHeader
                    title={activeTab === 'expiring' ? 'Active Expiry Audit List' : 'Expired Stock Management'}
                    subtitle={
                        activeTab === 'expiring'
                            ? `Batches flagged for expiration threshold ≤ ${filterDays} days`
                            : 'Batches that have passed expiration date and must not be dispensed'
                    }
                />

                <div className="mt-4">
                    {displayedList.length === 0 ? (
                        <div className="py-12 text-center">
                            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                            <p className="text-sm font-medium text-ink-700 dark:text-ink-200">
                                {activeTab === 'expiring'
                                    ? `No batches nearing expiration within ${filterDays} days.`
                                    : 'No expired batches currently recorded in system.'}
                            </p>
                            <p className="text-xs text-ink-400 mt-1">All stock records are within safe operational limits.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {displayedList.map((b, idx) => {
                                const expiryStr = b.expiryDate || b.expiry_date;
                                const expiry = new Date(expiryStr);
                                expiry.setHours(0, 0, 0, 0);
                                const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
                                const isExpired = diffDays < 0;

                                const medicineName = b.medicineName || b.medicine_name || b.medicine?.medicineName || 'Pharmaceutical Item';
                                const batchNum = b.batchNumber || b.batch_number || 'N/A';

                                return (
                                    <div
                                        key={b.id || idx}
                                        className={`flex items-center justify-between p-4 border rounded-xl shadow-sm transition-colors ${
                                            isExpired
                                                ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                                                : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                                                isExpired
                                                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600'
                                                    : 'bg-rose-100 dark:bg-rose-900/40 text-rose-600'
                                            }`}>
                                                {isExpired ? <ShieldAlert className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-ink-900 dark:text-white">
                                                    {medicineName}
                                                </p>
                                                <p className="text-xs text-ink-500 font-mono mt-0.5">
                                                    Batch: {batchNum} • Quantity: {b.quantity} units
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right flex items-center gap-2">
                                            <span className={`text-xs font-bold ${isExpired ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                                {expiryStr}
                                            </span>
                                            <Badge color={isExpired ? 'warning' : 'error'}>
                                                {isExpired ? `${Math.abs(diffDays)}d ago (Expired)` : `${diffDays}d left`}
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}