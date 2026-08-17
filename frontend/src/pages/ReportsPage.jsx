import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
    FileBarChart,
    Download,
    FileText,
    Printer,
    ArrowLeft,
    TrendingUp,
    AlertTriangle,
    Boxes,
    Truck,
    Calendar,
    Eye,
    X,
    CheckCircle2
} from 'lucide-react';
import { Card, CardHeader, Badge, Button } from '../components/ui';

function formatRupees(amount) {
    return '₹' + Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ReportsPage({ onNavigate }) {
    const { medicines = [], batches = [], suppliers = [] } = useData() || {};
    const [downloading, setDownloading] = useState('');
    const [previewReport, setPreviewReport] = useState(null);

    // KPI computations
    const totalInventoryValue = medicines.reduce((sum, m) => {
        const qty = Number(m.totalStock !== undefined ? m.totalStock : (m.total_stock || 0));
        const price = Number(m.price || 0);
        return sum + (qty * price);
    }, 0);

    const lowStockCount = medicines.filter(m => Number(m.totalStock !== undefined ? m.totalStock : (m.total_stock || 0)) <= 20).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiringBatches = batches.filter(b => {
        const d = b.expiryDate || b.expiry_date;
        if (!d) return false;
        const diff = Math.ceil((new Date(d) - today) / (1000 * 60 * 60 * 24));
        return diff <= 30 && diff >= 0;
    });

    // CSV Exporter (Backend call with client-side fallback)
    const handleExportCSV = async (endpoint, fallbackFilename, fallbackDataGenerator) => {
        setDownloading(endpoint);
        const token = localStorage.getItem('token') || localStorage.getItem('jwt');

        try {
            const response = await fetch(`http://localhost:8080/api/reports/export/${endpoint}`, {
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${fallbackFilename}_${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setDownloading('');
                return;
            }
        } catch (e) {
            console.warn("Backend export endpoint offline, using browser CSV generator.");
        }

        // Client-side fallback
        const csvContent = fallbackDataGenerator();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fallbackFilename}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setDownloading('');
    };

    // Client-side CSV generators
    const generateInventoryCSV = () => {
        let rows = ["Medicine Name,Category,Price (INR),Stock Quantity,Estimated Valuation (INR)\n"];
        medicines.forEach(m => {
            const stock = m.totalStock || m.total_stock || 0;
            rows.push(`"${m.medicineName || m.medicine_name}","${m.categoryName || 'General'}",${m.price || 0},${stock},${(m.price || 0) * stock}\n`);
        });
        return rows.join('');
    };

    const generateExpiryCSV = () => {
        let rows = ["Medicine Name,Batch Number,Quantity,Expiry Date\n"];
        expiringBatches.forEach(b => {
            rows.push(`"${b.medicineName || b.medicine_name || 'Item'}","${b.batchNumber || b.batch_number}",${b.quantity},"${b.expiryDate || b.expiry_date}"\n`);
        });
        return rows.join('');
    };

    const generateSupplierCSV = () => {
        let rows = ["Supplier Name,Email,Contact Number,Rating\n"];
        suppliers.forEach(s => {
            rows.push(`"${s.supplierName || s.supplier_name}","${s.email || ''}","${s.contactNumber || s.contact_number || ''}",${s.performanceRating || 5}\n`);
        });
        return rows.join('');
    };

    // Trigger PDF Export / Print
    const handleExportPDF = (report) => {
        setPreviewReport(report);
        setTimeout(() => {
            window.print();
        }, 300);
    };

    const reportCards = [
        {
            id: 'inventory',
            title: 'Inventory Valuation Report',
            description: 'Comprehensive analysis of current on-hand stock quantities, unit prices, and total asset worth.',
            endpoint: 'inventory-csv',
            filename: 'inventory_valuation_report',
            generator: generateInventoryCSV,
            icon: Boxes,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50',
            type: 'inventory'
        },
        {
            id: 'expiry',
            title: 'Expiry & Quality Audit Report',
            description: 'Audit log of medicines nearing expiration (≤ 30 days) and expired batches requiring disposal.',
            endpoint: 'expiry-csv',
            filename: 'expiry_audit_report',
            generator: generateExpiryCSV,
            icon: AlertTriangle,
            color: 'text-rose-600 dark:text-rose-400',
            bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50',
            type: 'expiry'
        },
        {
            id: 'suppliers',
            title: 'Supplier Performance Report',
            description: 'Procurement metrics, distributor directories, fulfillment status, and active supply lines.',
            endpoint: 'supplier-csv',
            filename: 'supplier_report',
            generator: generateSupplierCSV,
            icon: Truck,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50',
            type: 'suppliers'
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in text-slate-800 dark:text-slate-100">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                        <FileBarChart className="h-7 w-7 text-blue-600 dark:text-blue-400" /> Analytics & Reports
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        View interactive audits, print PDF summaries, or export CSV spreadsheets.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => window.print()} className="flex items-center gap-1.5 text-xs">
                        <Printer className="h-4 w-4" /> Print Page
                    </Button>
                    <Button variant="outline" onClick={() => onNavigate('dashboard')} className="flex items-center gap-1.5 text-xs">
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Button>
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Stock Value</span>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatRupees(totalInventoryValue)}</p>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 block">Across {medicines.length} registered products</span>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5" />
                    </div>
                </div>

                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-rose-500">Expiring Soon (≤30d)</span>
                        <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{expiringBatches.length} Batches</p>
                        <span className="text-xs text-slate-500 mt-0.5 block">Requires immediate audit</span>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                </div>

                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">Low Stock SKUs</span>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{lowStockCount} Items</p>
                        <span className="text-xs text-slate-500 mt-0.5 block">Below safe threshold</span>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Boxes className="h-5 w-5" />
                    </div>
                </div>
            </div>

            {/* Available Report Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reportCards.map((r) => (
                    <Card key={r.id} className="p-5 flex flex-col justify-between hover:border-blue-500 transition-colors bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${r.bg} ${r.color}`}>
                                    <r.icon className="h-6 w-6" />
                                </div>
                                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> Updated Today
                                </span>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">{r.title}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                    {r.description}
                                </p>
                            </div>
                        </div>

                        {/* Three Action Buttons: View, PDF, CSV */}
                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setPreviewReport(r)}
                                className="flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <Eye className="h-3.5 w-3.5" /> View
                            </button>

                            <button
                                onClick={() => handleExportPDF(r)}
                                className="flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 transition-colors"
                            >
                                <FileText className="h-3.5 w-3.5" /> PDF
                            </button>

                            <button
                                onClick={() => handleExportCSV(r.endpoint, r.filename, r.generator)}
                                disabled={downloading === r.endpoint}
                                className="flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm disabled:opacity-50"
                            >
                                <Download className="h-3.5 w-3.5" /> {downloading === r.endpoint ? '...' : 'CSV'}
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* In-Browser Preview Table */}
            <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CardHeader
                    title="Live Inventory Valuation Table"
                    subtitle="Real-time summary of stock levels and current capital allocation"
                />
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-4 py-3 font-medium">Medicine Name</th>
                            <th className="px-4 py-3 font-medium">Category</th>
                            <th className="px-4 py-3 font-medium text-right">Unit Price</th>
                            <th className="px-4 py-3 font-medium text-right">On-Hand Stock</th>
                            <th className="px-4 py-3 font-medium text-right">Total Valuation</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {medicines.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-slate-400">No inventory records to display.</td>
                            </tr>
                        ) : (
                            medicines.slice(0, 8).map((m) => {
                                const stock = Number(m.totalStock !== undefined ? m.totalStock : (m.total_stock || 0));
                                const price = Number(m.price || 0);
                                return (
                                    <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                                            {m.medicineName || m.medicine_name}
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">
                                            {m.categoryName || m.category_name || 'General'}
                                        </td>
                                        <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300 font-mono text-xs">
                                            {formatRupees(price)}
                                        </td>
                                        <td className="px-4 py-3 text-right font-medium text-slate-900 dark:text-white">
                                            {stock} units
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold text-blue-600 dark:text-blue-400">
                                            {formatRupees(stock * price)}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Interactive View & Print Modal */}
            {previewReport && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 animate-slide-up max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{previewReport.title}</h3>
                                <p className="text-xs text-slate-500">Generated on {new Date().toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => setPreviewReport(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Body Data */}
                        <div className="overflow-y-auto flex-1 custom-scrollbar">
                            {previewReport.type === 'inventory' && (
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800">
                                    <tr>
                                        <th className="p-2.5">Medicine</th>
                                        <th className="p-2.5">Category</th>
                                        <th className="p-2.5 text-right">Price</th>
                                        <th className="p-2.5 text-right">Stock</th>
                                        <th className="p-2.5 text-right">Total</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {medicines.map(m => {
                                        const stock = m.totalStock || m.total_stock || 0;
                                        return (
                                            <tr key={m.id}>
                                                <td className="p-2.5 font-medium">{m.medicineName || m.medicine_name}</td>
                                                <td className="p-2.5">{m.categoryName || 'General'}</td>
                                                <td className="p-2.5 text-right">{formatRupees(m.price)}</td>
                                                <td className="p-2.5 text-right">{stock}</td>
                                                <td className="p-2.5 text-right font-bold">{formatRupees((m.price || 0) * stock)}</td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            )}

                            {previewReport.type === 'expiry' && (
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800">
                                    <tr>
                                        <th className="p-2.5">Medicine</th>
                                        <th className="p-2.5">Batch</th>
                                        <th className="p-2.5 text-right">Quantity</th>
                                        <th className="p-2.5 text-right">Expiry Date</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {expiringBatches.map((b, i) => (
                                        <tr key={i}>
                                            <td className="p-2.5 font-medium">{b.medicineName || b.medicine_name || 'Item'}</td>
                                            <td className="p-2.5 font-mono">{b.batchNumber || b.batch_number}</td>
                                            <td className="p-2.5 text-right">{b.quantity}</td>
                                            <td className="p-2.5 text-right font-bold text-rose-600">{b.expiryDate || b.expiry_date}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}

                            {previewReport.type === 'suppliers' && (
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800">
                                    <tr>
                                        <th className="p-2.5">Supplier Name</th>
                                        <th className="p-2.5">Contact</th>
                                        <th className="p-2.5">Email</th>
                                        <th className="p-2.5 text-right">Rating</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {suppliers.map((s, i) => (
                                        <tr key={i}>
                                            <td className="p-2.5 font-medium">{s.supplierName || s.supplier_name}</td>
                                            <td className="p-2.5">{s.contactNumber || s.contact_number || '-'}</td>
                                            <td className="p-2.5">{s.email || '-'}</td>
                                            <td className="p-2.5 text-right font-bold">★ {s.performanceRating || 5.0}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 shrink-0">
                            <Button variant="outline" onClick={() => setPreviewReport(null)}>
                                Close
                            </Button>
                            <Button onClick={() => window.print()} className="flex items-center gap-1.5">
                                <Printer className="h-4 w-4" /> Print / Save as PDF
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}