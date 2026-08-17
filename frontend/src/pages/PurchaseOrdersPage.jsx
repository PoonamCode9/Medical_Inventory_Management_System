import React, { useState } from 'react';
import {
    ShoppingCart, Plus, Search, CheckCircle2, Clock,
    XCircle, ArrowLeft, Trash2, AlertTriangle, FileText,
    Check, X, Pill, Truck, Filter, Eye
} from 'lucide-react';
import { Card, CardHeader, Button, Input, Select, StatusBadge, EmptyState, KpiCard } from '../components/ui';
import { useData } from '../context/DataContext';

function formatRupees(amount) {
    return '₹' + Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function PurchaseOrdersPage({ onNavigate, role, view, poId }) {
    const currentRole = (role || localStorage.getItem('role') || 'admin').toLowerCase().replace('role_', '');

    if (view === 'form' || view === 'new') {
        return <PurchaseOrderForm role={currentRole} onNavigate={onNavigate} />;
    }
    if ((view === 'detail' || Boolean(poId)) && poId !== 'new') {
        return <PurchaseOrderDetail role={currentRole} id={poId} onNavigate={onNavigate} />;
    }
    return <PurchaseOrderList role={currentRole} onNavigate={onNavigate} />;
}

/* ---------- 1. ORDER LIST VIEW ---------- */
function PurchaseOrderList({ role, onNavigate }) {
    const {
        purchaseOrders = [],
        suppliers = [],
        medicines = [],
        deletePurchaseOrder,
        updatePurchaseOrderStatus
    } = useData() || {};

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [confirmDelete, setConfirmDelete] = useState(null);

    const isStaff = role === 'staff';
    const list = purchaseOrders || [];

    // Filter by Search Query & Status Tab
    const filtered = list.filter((po) => {
        const matchesSearch =
            (po.poNumber || '').toLowerCase().includes(search.toLowerCase()) ||
            (po.supplierName || '').toLowerCase().includes(search.toLowerCase()) ||
            (po.medicineName || '').toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || (po.status || 'PENDING').toUpperCase() === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Metric Calculations
    const totalCount = list.length;
    const pendingCount = list.filter(p => (p.status || '').toUpperCase() === 'PENDING').length;
    const approvedCount = list.filter(p => (p.status || '').toUpperCase() === 'APPROVED').length;
    const fulfilledCount = list.filter(p => (p.status || '').toUpperCase() === 'FULFILLED').length;
    const totalSpend = list.reduce((sum, p) => sum + Number(p.totalAmount || p.total || 0), 0);

    const handleDelete = async (id) => {
        if (deletePurchaseOrder) {
            await deletePurchaseOrder(id);
        }
        setConfirmDelete(null);
    };

    return (
        <div className="space-y-6 animate-fade-in p-2 sm:p-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                        <ShoppingCart className="h-7 w-7 text-blue-600 dark:text-blue-400" /> Purchase Orders
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Procure stock batches from verified pharmaceutical distributors.
                    </p>
                </div>
                {!isStaff && (
                    <Button
                        onClick={() => onNavigate('purchase-orders/new')}
                        className="flex items-center gap-2 active:scale-[0.98] transition-transform"
                    >
                        <Plus className="h-4 w-4" /> Create Purchase Order
                    </Button>
                )}
            </div>

            {/* KPI Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total POs</span>
                        <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                            <FileText size={16} />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{totalCount}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatRupees(totalSpend)} cumulative</p>
                </Card>

                <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Pending Review</span>
                        <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
                            <Clock size={16} />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-amber-600 mt-2">{pendingCount}</p>
                    <p className="text-xs text-slate-400 mt-1">Awaiting approval</p>
                </Card>

                <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-sky-500 uppercase tracking-wider">In Transit</span>
                        <div className="h-8 w-8 rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-600 flex items-center justify-center">
                            <Truck size={16} />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-sky-600 mt-2">{approvedCount}</p>
                    <p className="text-xs text-slate-400 mt-1">Dispatched to facility</p>
                </Card>

                <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Fulfilled</span>
                        <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 size={16} />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-emerald-600 mt-2">{fulfilledCount}</p>
                    <p className="text-xs text-slate-400 mt-1">Stock credited to inventory</p>
                </Card>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by PO reference, medicine, or supplier name..."
                        className="w-full h-10 pl-9 pr-4 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1 text-xs font-semibold overflow-x-auto">
                    {['ALL', 'PENDING', 'APPROVED', 'FULFILLED', 'CANCELLED'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setStatusFilter(tab)}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                                statusFilter === tab
                                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            {tab.charAt(0) + tab.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Data Table */}
            <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs uppercase tracking-wide bg-slate-50/50 dark:bg-slate-900/50">
                            <th className="text-left font-medium px-5 py-3">PO Reference</th>
                            <th className="text-left font-medium px-5 py-3">Supplier</th>
                            <th className="text-left font-medium px-5 py-3">Medicine Item</th>
                            <th className="text-left font-medium px-5 py-3">Order Date</th>
                            <th className="text-right font-medium px-5 py-3">Units</th>
                            <th className="text-right font-medium px-5 py-3">Amount</th>
                            <th className="text-left font-medium px-5 py-3">Status</th>
                            {!isStaff && <th className="text-right font-medium px-5 py-3">Actions</th>}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {filtered.map((po) => {
                            const poId = po.id;
                            const status = (po.status || 'PENDING').toUpperCase();
                            const medName = po.medicineName || po.medicine_name || 'General Order Batch';

                            return (
                                <tr key={poId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                    <td
                                        className="px-5 py-3.5 font-mono font-medium text-blue-600 dark:text-blue-400 cursor-pointer"
                                        onClick={() => onNavigate(`purchase-orders/${poId}`)}
                                    >
                                        {po.poNumber}
                                    </td>
                                    <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2">
                                            <Truck className="h-4 w-4 text-slate-400 shrink-0" />
                                            <span className="truncate">{po.supplierName}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                                        <div className="flex items-center gap-1.5">
                                            <Pill className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                            <span>{medName}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs">
                                        {po.orderDate}
                                    </td>
                                    <td className="px-5 py-3.5 text-right font-semibold text-slate-800 dark:text-slate-200">
                                        {po.itemCount}
                                    </td>
                                    <td className="px-5 py-3.5 text-right font-bold text-slate-900 dark:text-white">
                                        {formatRupees(po.totalAmount || po.total)}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <StatusBadge status={status} />
                                    </td>
                                    {!isStaff && (
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {status === 'PENDING' && (
                                                    <button
                                                        onClick={() => updatePurchaseOrderStatus(poId, 'APPROVED')}
                                                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 hover:bg-sky-100 transition-colors"
                                                        title="Approve Order"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                {status === 'APPROVED' && (
                                                    <button
                                                        onClick={() => updatePurchaseOrderStatus(poId, 'FULFILLED')}
                                                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                                        title="Receive & Stock In"
                                                    >
                                                        Receive
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => onNavigate(`purchase-orders/${poId}`)}
                                                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDelete(po)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                                                    title="Delete Record"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <EmptyState
                        icon={<ShoppingCart className="h-8 w-8 text-slate-400" />}
                        title="No purchase orders found"
                        description="Try adjusting your filter criteria or create a new order."
                    />
                )}
            </Card>

            {/* Delete Modal */}
            {confirmDelete && !isStaff && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setConfirmDelete(null)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6 border border-slate-200 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Delete Order?</h3>
                                <p className="text-xs text-slate-500 mt-0.5">This action will remove the record permanently.</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">
                            Are you sure you want to delete <span className="font-semibold">{confirmDelete.poNumber}</span>?
                        </p>
                        <div className="flex gap-2 justify-end">
                            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                            <Button variant="destructive" onClick={() => handleDelete(confirmDelete.id)}>
                                <Trash2 className="h-4 w-4" /> Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ---------- 2. ORDER DETAIL VIEW ---------- */
function PurchaseOrderDetail({ role, id, onNavigate }) {
    const { purchaseOrders = [], updatePurchaseOrderStatus, deletePurchaseOrder } = useData() || {};
    const isStaff = role === 'staff';
    const po = purchaseOrders.find((p) => Number(p.id) === Number(id));

    if (!po) {
        return (
            <EmptyState
                icon={<ShoppingCart className="h-8 w-8 text-slate-400" />}
                title="Purchase order not found"
                description="This purchase order record might have been removed."
                action={<Button onClick={() => onNavigate('purchase-orders')}>Back to orders</Button>}
            />
        );
    }

    const status = (po.status || 'PENDING').toUpperCase();

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto p-4">
            <button
                onClick={() => onNavigate('purchase-orders')}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" /> Back to orders
            </button>

            <div className="flex items-start justify-between">
                <div>
                    <span className="font-mono text-xs uppercase px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-semibold">
                        {po.poNumber}
                    </span>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-2">
                        Purchase Order Summary
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Supplier: <span className="font-semibold text-slate-800 dark:text-slate-200">{po.supplierName}</span> · Date: {po.orderDate}
                    </p>
                </div>
                <StatusBadge status={status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <KpiCard label="Units Ordered" value={po.itemCount} icon={<Pill size={20} />} />
                <KpiCard label="Total Amount" value={formatRupees(po.totalAmount || po.total)} icon={<FileText size={20} />} />
                <KpiCard label="Order Status" value={status} icon={<Clock size={20} />} />
            </div>

            {!isStaff && (
                <div className="flex flex-wrap gap-2 pt-4 justify-end border-t border-slate-200 dark:border-slate-800">
                    {status === 'PENDING' && (
                        <Button onClick={() => updatePurchaseOrderStatus(po.id, 'APPROVED')} className="flex items-center gap-2">
                            <Check className="h-4 w-4" /> Approve PO
                        </Button>
                    )}
                    {status === 'APPROVED' && (
                        <Button onClick={() => updatePurchaseOrderStatus(po.id, 'FULFILLED')} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                            <CheckCircle2 className="h-4 w-4" /> Receive & Stock In
                        </Button>
                    )}
                    {status !== 'CANCELLED' && status !== 'FULFILLED' && (
                        <Button variant="secondary" onClick={() => updatePurchaseOrderStatus(po.id, 'CANCELLED')} className="flex items-center gap-2">
                            <X className="h-4 w-4" /> Cancel Order
                        </Button>
                    )}
                    <Button variant="destructive" onClick={async () => { await deletePurchaseOrder(po.id); onNavigate('purchase-orders'); }} className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4" /> Delete PO
                    </Button>
                </div>
            )}
        </div>
    );
}

/* ---------- 3. ORDER CREATION FORM ---------- */
function PurchaseOrderForm({ role, onNavigate }) {
    if (role === 'staff') {
        return (
            <div className="space-y-4 animate-fade-in max-w-lg mx-auto py-12 text-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Access Denied</h2>
                <p className="text-sm text-slate-500">Staff accounts are not authorized to create purchase orders.</p>
                <Button onClick={() => onNavigate('purchase-orders')}>Back to orders</Button>
            </div>
        );
    }

    const { suppliers = [], medicines = [], createPurchaseOrder } = useData() || {};
    const [form, setForm] = useState({
        supplier_id: suppliers[0]?.id || '',
        medicine_id: medicines[0]?.id || '',
        item_count: '100',
        total_amount: '5000.00',
        order_date: new Date().toISOString().split('T')[0],
    });
    const [submitting, setSubmitting] = useState(false);

    // Auto-calculate total price when medicine and quantity change
    const handleMedicineChange = (e) => {
        const mId = e.target.value;
        const selectedMed = medicines.find(m => Number(m.id) === Number(mId));
        const price = Number(selectedMed?.price || 50);
        const qty = Number(form.item_count || 1);

        setForm(prev => ({
            ...prev,
            medicine_id: mId,
            total_amount: (price * qty).toFixed(2)
        }));
    };

    const handleQtyChange = (e) => {
        const qty = Number(e.target.value || 0);
        const selectedMed = medicines.find(m => Number(m.id) === Number(form.medicine_id));
        const price = Number(selectedMed?.price || 50);

        setForm(prev => ({
            ...prev,
            item_count: e.target.value,
            total_amount: (price * qty).toFixed(2)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const success = await createPurchaseOrder(form);
        setSubmitting(false);

        if (success) {
            onNavigate('purchase-orders');
        } else {
            alert('Failed to save purchase order. Please check backend connection.');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-xl mx-auto py-4">
            <button
                onClick={() => onNavigate('purchase-orders')}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" /> Back to orders
            </button>

            <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Create Purchase Order
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Order replenishment units from registered distributors.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="p-6 space-y-4 shadow-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <Select
                        label="Supplier"
                        value={form.supplier_id}
                        onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}
                    >
                        {suppliers.map((s) => (
                            <option key={s.id} value={s.id}>{s.supplierName || s.supplier_name}</option>
                        ))}
                    </Select>

                    <Select
                        label="Medicine Item"
                        value={form.medicine_id}
                        onChange={handleMedicineChange}
                    >
                        {medicines.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.medicineName || m.medicine_name} — (₹{Number(m.price || 0).toFixed(2)}/unit)
                            </option>
                        ))}
                    </Select>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Quantity (Units)"
                            type="number"
                            min="1"
                            required
                            value={form.item_count}
                            onChange={handleQtyChange}
                        />
                        <Input
                            label="Total Amount (₹)"
                            type="number"
                            step="0.01"
                            required
                            value={form.total_amount}
                            onChange={(e) => setForm({ ...form, total_amount: e.target.value })}
                        />
                    </div>

                    <Input
                        label="Order Date"
                        type="date"
                        value={form.order_date}
                        onChange={(e) => setForm({ ...form, order_date: e.target.value })}
                    />

                    <div className="flex gap-2 pt-3 justify-end">
                        <Button type="button" variant="secondary" onClick={() => onNavigate('purchase-orders')}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Creating...' : 'Submit Order'}
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}