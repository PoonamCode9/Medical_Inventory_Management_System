import { useState, useRef, useEffect } from 'react';
import { useData } from "../../context/DataContext";
import {
    Pill, Boxes, Truck, AlertTriangle, ArrowRight,
    Plus, ChevronDown, Layers, FileText, Clock, TrendingUp, ShoppingCart
} from "lucide-react";
import { Card, CardHeader, Button, StatusBadge } from "../../components/ui";
import { ExpiryWidget } from "../../components/ExpiryWidget";
import {
    StockTrendChart,
    CategoryBarChart,
    StockStatusDonut,
    ExpiryHorizonChart
} from "../../components/Charts";

function formatRupees(amount) {
    return '₹' + Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function AdminDashboard({ onNavigate }) {
    const { medicines, batches, suppliers, categories, purchaseOrders } = useData() || {};
    const [quickMenuOpen, setQuickMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const medList = medicines || [];
    const batchList = batches || [];
    const supList = suppliers || [];
    const catList = categories || [];
    const poList = purchaseOrders || [];

    const totalStock = batchList.reduce((sum, b) => sum + Number(b.quantity || 0), 0);
    const lowStockCount = medList.filter((m) => (m.totalStock || 0) < (m.reorderThreshold || 50)).length;

    const lowStockList = medList.filter((m) =>
        m.status === 'LOW' ||
        m.status === 'LOW_STOCK' ||
        (Number(m.total_stock || m.totalStock || 0) <= 20 && Number(m.total_stock || m.totalStock || 0) > 0)
    );

    const outOfStockList = medList.filter((m) =>
        m.status === 'OUT' ||
        m.status === 'OUT_OF_STOCK' ||
        Number(m.total_stock || m.totalStock || 0) === 0
    );

    const optimalStockCount = Math.max(0, medList.length - lowStockList.length - outOfStockList.length);

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setQuickMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="space-y-6 animate-fade-in relative p-6">
            {/* Header with Quick Actions Menu */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Admin Overview</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Live inventory distribution, stock movement trends, and audit analytics.</p>
                </div>

                <div className="relative" ref={menuRef}>
                    <Button onClick={() => setQuickMenuOpen(!quickMenuOpen)} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Quick Actions <ChevronDown className="h-3.5 w-3.5 ml-0.5" />
                    </Button>

                    {quickMenuOpen && (
                        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 z-50 py-1.5 animate-slide-up">
                            <button
                                onClick={() => { setQuickMenuOpen(false); onNavigate('medicines/new'); }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                            >
                                <Pill className="h-4 w-4 text-blue-500" /> Add Medicine
                            </button>
                            <button
                                onClick={() => { setQuickMenuOpen(false); onNavigate('purchase-orders'); }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                            >
                                <ShoppingCart className="h-4 w-4 text-blue-500" /> Purchase Orders
                            </button>
                            <button
                                onClick={() => { setQuickMenuOpen(false); onNavigate('medicines'); }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                            >
                                <Boxes className="h-4 w-4 text-blue-500" /> View Medicines
                            </button>
                            <button
                                onClick={() => { setQuickMenuOpen(false); onNavigate('inventory'); }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4 text-blue-500" /> Add Inventory
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Primary KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-5 flex flex-col justify-between hover:border-blue-500 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Pill size={20} />
                        </div>
                        <Button variant="secondary" onClick={() => onNavigate('medicines')} className="text-xs h-7 px-2.5">
                            View All <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Medicines</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{medList.length}</p>
                    </div>
                </Card>

                <Card className="p-5 flex flex-col justify-between hover:border-blue-500 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Boxes size={20} />
                        </div>
                        <Button variant="secondary" onClick={() => onNavigate('inventory')} className="text-xs h-7 px-2.5">
                            View All <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Inventory Batches</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{batchList.length}</p>
                    </div>
                </Card>

                <Card className="p-5 flex flex-col justify-between hover:border-blue-500 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Truck size={20} />
                        </div>
                        <Button variant="secondary" onClick={() => onNavigate('suppliers')} className="text-xs h-7 px-2.5">
                            View All <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Suppliers</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{supList.length}</p>
                    </div>
                </Card>

                <Card className="p-5 flex flex-col justify-between hover:border-rose-500 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
                            <AlertTriangle size={20} />
                        </div>
                        <Button variant="secondary" onClick={() => onNavigate('notifications')} className="text-xs h-7 px-2.5">
                            View All <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Low Stock Alerts</p>
                        <p className="text-2xl font-bold text-rose-600 mt-1">{lowStockCount}</p>
                    </div>
                </Card>
            </div>

            {/* Secondary Metric Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                        <TrendingUp size={22} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-medium">Total Stock Units</p>
                        <p className="text-xl font-bold text-slate-800 dark:text-white mt-0.5">{totalStock.toLocaleString()}</p>
                    </div>
                </Card>

                <Card className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center shrink-0">
                        <Layers size={22} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-medium">Active Categories</p>
                        <p className="text-xl font-bold text-slate-800 dark:text-white mt-0.5">{catList.length}</p>
                    </div>
                </Card>

                <Card className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shrink-0">
                        <FileText size={22} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-medium">Purchase Orders</p>
                        <p className="text-xl font-bold text-slate-800 dark:text-white mt-0.5">{poList.length}</p>
                    </div>
                </Card>

                <Card className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center shrink-0">
                        <Clock size={22} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-medium">System Status</p>
                        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Operational</p>
                    </div>
                </Card>
            </div>

            {/* Visual Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <CardHeader
                        title="Stock In vs Stock Out Trends"
                        subtitle="Monthly volume flow across distribution channels"
                    />
                    <StockTrendChart />
                </Card>

                <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <CardHeader
                        title="Stock Health & Status Breakdown"
                        subtitle="Proportion of optimal, low, and out-of-stock SKUs"
                    />
                    <StockStatusDonut
                        optimal={optimalStockCount}
                        low={lowStockList.length}
                        out={outOfStockList.length}
                    />
                </Card>

                <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <CardHeader
                        title="Catalog Distribution by Category"
                        subtitle="Active medicine allocations per category"
                    />
                    <CategoryBarChart categories={catList} medicines={medList} />
                </Card>

                <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <CardHeader
                        title="Expiry Horizon Risk Analysis"
                        subtitle="Batch vulnerability categorised by remaining shelf life"
                    />
                    <ExpiryHorizonChart batches={batchList} />
                </Card>
            </div>

            {/* Expiry Tracking Widget */}
            <ExpiryWidget onNavigate={onNavigate} />

            {/* Quick Preview Table */}
            <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                    <CardHeader title="Medicines Overview" subtitle="Quick view of registered medicines in the system" />
                    <Button variant="secondary" onClick={() => onNavigate('medicines')} className="text-xs h-8">
                        View All <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs uppercase tracking-wide">
                            <th className="text-left font-medium px-4 py-2.5">Medicine Name</th>
                            <th className="text-left font-medium px-4 py-2.5">Category</th>
                            <th className="text-right font-medium px-4 py-2.5">Price</th>
                            <th className="text-left font-medium px-4 py-2.5">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {medList.slice(0, 5).map((m) => (
                            <tr
                                key={m.id}
                                onClick={() => onNavigate(`medicines/${m.id}`)}
                                className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer"
                            >
                                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{m.medicineName || m.medicine_name}</td>
                                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{m.categoryName || 'General'}</td>
                                <td className="px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-300">{formatRupees(m.price)}</td>
                                <td className="px-4 py-3"><StatusBadge status={m.status || 'IN_STOCK'} /></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {medList.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-6">No medicines found in catalog.</p>
                )}
            </Card>
        </div>
    );
}