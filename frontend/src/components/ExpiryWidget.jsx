import React from 'react';
import { useData } from '../context/DataContext';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { Badge, Button } from './ui';

export function ExpiryWidget({ onNavigate }) {
    const { batches = [] } = useData();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const filterDays = 30;

    const filteredBatches = batches.filter(b => {
        const dateStr = b.expiryDate || b.expiry_date;
        if (!dateStr) return false;
        const expiry = new Date(dateStr);
        expiry.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        return diffDays <= filterDays && diffDays >= 0;
    });

    return (
        <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600">
                        <ShieldAlert className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-ink-900 dark:text-white">Expiry Tracking</h3>
                        <p className="text-xs text-ink-500">Monitoring inventory batches nearing expiration (≤ {filterDays} days)</p>
                    </div>
                </div>
                {onNavigate && (
                    <Button variant="outline" size="sm" onClick={() => onNavigate('expiry-tracking')}>
                        View All
                    </Button>
                )}
            </div>

            {filteredBatches.length === 0 ? (
                <p className="text-sm text-ink-400 py-6 text-center">No batches expiring within the next {filterDays} days.</p>
            ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {filteredBatches.map((b, idx) => {
                        const expiryStr = b.expiryDate || b.expiry_date;
                        const expiry = new Date(expiryStr);
                        const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
                        const medicineName = b.medicineName || b.medicine_name || b.medicine?.medicineName || 'Pharmaceutical Item';
                        const batchNum = b.batchNumber || b.batch_number || 'N/A';

                        return (
                            <div key={b.id || idx} className="p-3 bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-lg flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-sm text-ink-900 dark:text-white">{medicineName}</p>
                                    <p className="text-xs text-ink-500 font-mono mt-0.5">Batch: {batchNum} • Qty: {b.quantity} units</p>
                                </div>
                                <div className="text-right flex items-center gap-2">
                                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                                        <AlertTriangle className="h-3.5 w-3.5" /> {expiryStr}
                                    </span>
                                    <Badge color="error">{diffDays}d left</Badge>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}