import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
    Receipt,
    Search,
    Plus,
    Minus,
    Trash2,
    CheckCircle2,
    ArrowLeft,
    CreditCard,
    Banknote,
    QrCode,
    User,
    AlertCircle,
    PackageCheck,
    History,
    Calendar,
    Eye,
    Printer,
    X,
    Pill,
    TrendingUp
} from 'lucide-react';
import { Card, CardHeader, Badge, Button, KpiCard } from '../components/ui';

function formatRupees(amount) {
    return '₹' + Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function DispensePage({ onNavigate }) {
    const {
        medicines = [],
        batches = [],
        sales = [],
        refreshData,
        processSale
    } = useData() || {};

    const [activeTab, setActiveTab] = useState('checkout'); // 'checkout' | 'history'
    const [searchTerm, setSearchTerm] = useState('');
    const [historySearch, setHistorySearch] = useState('');
    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [isSuccess, setIsSuccess] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [selectedHistorySale, setSelectedHistorySale] = useState(null);

    // Available in-stock medicines
    const availableMedicines = medicines.filter(m => {
        const name = (m.medicineName || m.medicine_name || '').toLowerCase();
        const matchesSearch = name.includes(searchTerm.toLowerCase());
        const stock = Number(m.totalStock !== undefined ? m.totalStock : (m.total_stock || 0));
        return matchesSearch && stock > 0;
    });

    const handleAddToCart = (med) => {
        setCart(prev => {
            const exists = prev.find(item => item.id === med.id);
            const currentStock = Number(med.totalStock !== undefined ? med.totalStock : (med.total_stock || 100));

            if (exists) {
                if (exists.quantity >= currentStock) {
                    alert(`Cannot add more. Available stock for ${med.medicineName || med.medicine_name}: ${currentStock}`);
                    return prev;
                }
                return prev.map(item =>
                    item.id === med.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prev, {
                id: med.id,
                medicineId: med.id,
                name: med.medicineName || med.medicine_name,
                category: med.categoryName || med.category_name || 'General',
                price: Number(med.price || 0),
                quantity: 1,
                maxStock: currentStock
            }];
        });
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                if (newQty <= 0) return null;
                if (newQty > item.maxStock) {
                    alert(`Maximum stock available is ${item.maxStock}`);
                    return item;
                }
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(Boolean));
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    // Billing calculations
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gstAmount = subtotal * 0.05; // 5% GST on medical sales
    const grandTotal = subtotal + gstAmount;

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (cart.length === 0 || submitting) return;

        setSubmitting(true);
        const billNumber = `BILL-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
        const customer = customerName.trim() || 'Walk-in Customer';

        const salePayload = {
            billNumber,
            customerName: customer,
            paymentMethod,
            subtotal,
            gstAmount,
            grandTotal,
            saleDate: new Date().toISOString().split('T')[0],
            items: cart.map(item => ({
                medicineId: item.medicineId || item.id,
                medicineName: item.name,
                quantity: item.quantity,
                unitPrice: item.price,
                totalPrice: item.quantity * item.price
            }))
        };

        if (processSale) {
            await processSale(salePayload);
        }

        const invoice = {
            billNo: billNumber,
            customer,
            date: new Date().toISOString().split('T')[0],
            paymentMethod,
            items: [...cart],
            subtotal,
            gstAmount,
            grandTotal
        };

        setInvoiceData(invoice);
        setIsSuccess(true);
        setCart([]);
        setCustomerName('');
        setSubmitting(false);
    };

    // History filtering
    const filteredSales = sales.filter(s => {
        const bill = (s.billNumber || s.bill_number || '').toLowerCase();
        const cust = (s.customerName || s.customer_name || '').toLowerCase();
        const pm = (s.paymentMethod || s.payment_method || '').toLowerCase();
        const query = historySearch.toLowerCase();
        return bill.includes(query) || cust.includes(query) || pm.includes(query);
    });

    const totalSalesRevenue = sales.reduce((sum, s) => sum + Number(s.grandTotal || s.grand_total || s.total || 0), 0);

    const getPaymentBadge = (method) => {
        const m = (method || 'CASH').toUpperCase();
        if (m === 'UPI') return <Badge color="info">UPI Transfer</Badge>;
        if (m === 'CARD') return <Badge color="primary">Debit/Credit Card</Badge>;
        return <Badge color="success">Cash</Badge>;
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in text-slate-800 dark:text-slate-100">
            {/* Header with Navigation and Tab Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                        <Receipt className="h-7 w-7 text-blue-600 dark:text-blue-400" /> Dispense & POS Sales Module
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Process point-of-sale customer checkouts, deduct live inventory, and inspect sales audit records.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => onNavigate('dashboard')} className="flex items-center gap-1.5">
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <button
                    onClick={() => setActiveTab('checkout')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-150 active:scale-95 ${
                        activeTab === 'checkout'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                    <Receipt className="h-4 w-4" /> Point of Sale (POS)
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-150 active:scale-95 ${
                        activeTab === 'history'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                    <History className="h-4 w-4" /> Sales & Dispense History ({sales.length})
                </button>
            </div>

            {/* ----------------- TAB 1: POS CHECKOUT ----------------- */}
            {activeTab === 'checkout' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
                    {/* Left: Medicine Catalog Picker (7 cols) */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
                            <Search className="h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search available medicines by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                            {availableMedicines.length === 0 ? (
                                <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                                    <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No in-stock medicines available</p>
                                    <p className="text-xs text-slate-400 mt-1">Please ensure inventory batches are registered with active stock.</p>
                                </div>
                            ) : (
                                availableMedicines.map((med) => {
                                    const stock = Number(med.totalStock !== undefined ? med.totalStock : (med.total_stock || 0));
                                    return (
                                        <div
                                            key={med.id}
                                            onClick={() => handleAddToCart(med)}
                                            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl shadow-sm cursor-pointer transition-all duration-150 active:scale-[0.98] hover:shadow-md flex flex-col justify-between"
                                        >
                                            <div>
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">
                                                        {med.medicineName || med.medicine_name}
                                                    </h4>
                                                    <Badge color="success">{stock} left</Badge>
                                                </div>
                                                <p className="text-xs text-slate-400 mt-1">{med.categoryName || med.category_name || 'General Pharma'}</p>
                                            </div>
                                            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                                    {formatRupees(med.price)}
                                                </span>
                                                <span className="text-xs font-semibold text-slate-500 inline-flex items-center gap-1 hover:text-blue-600">
                                                    <Plus className="h-3.5 w-3.5" /> Add
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Right: Active Cart & Checkout (5 cols) */}
                    <div className="lg:col-span-5">
                        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
                            <CardHeader
                                title="Current Sale Cart"
                                subtitle={`${cart.length} item(s) selected`}
                            />

                            {/* Cart Item List */}
                            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 custom-scrollbar">
                                {cart.length === 0 ? (
                                    <div className="py-8 text-center text-slate-400 text-xs">
                                        Your cart is empty. Click medicines on the left to add.
                                    </div>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.id} className="py-2.5 flex items-center justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <h5 className="text-xs font-semibold text-slate-900 dark:text-white truncate">{item.name}</h5>
                                                <span className="text-[11px] text-slate-400 font-mono">{formatRupees(item.price)} each</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <span className="text-xs font-bold text-slate-900 dark:text-white w-16 text-right">
                                                {formatRupees(item.price * item.quantity)}
                                            </span>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-1 text-slate-400 hover:text-rose-500"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Customer and Payment Information */}
                            <form onSubmit={handleCheckout} className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                        Customer Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="Walk-in Customer / Patient Name"
                                            className="w-full h-9 pl-9 pr-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                                        Payment Method
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'CASH', label: 'Cash', icon: Banknote },
                                            { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                                            { id: 'CARD', label: 'Card', icon: CreditCard }
                                        ].map(pm => {
                                            const Icon = pm.icon;
                                            return (
                                                <button
                                                    key={pm.id}
                                                    type="button"
                                                    onClick={() => setPaymentMethod(pm.id)}
                                                    className={`py-2 px-2 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-all active:scale-95 ${
                                                        paymentMethod === pm.id
                                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                                                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                    <span>{pm.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Billing Breakdown */}
                                <div className="space-y-1.5 pt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>{formatRupees(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Medical GST (5%)</span>
                                        <span>{formatRupees(gstAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-100 dark:border-slate-800">
                                        <span>Grand Total</span>
                                        <span className="text-blue-600 dark:text-blue-400">{formatRupees(grandTotal)}</span>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={cart.length === 0 || submitting}
                                    className="w-full h-10 flex items-center justify-center gap-2 font-bold"
                                >
                                    <PackageCheck className="h-4 w-4" /> {submitting ? 'Processing Transaction...' : 'Complete Sale & Dispense'}
                                </Button>
                            </form>
                        </Card>
                    </div>
                </div>
            )}

            {/* ----------------- TAB 2: SALES & DISPENSE HISTORY ----------------- */}
            {activeTab === 'history' && (
                <div className="space-y-6 animate-fade-in">
                    {/* Summary Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <KpiCard
                            label="Total Invoices Recorded"
                            value={sales.length}
                            icon={<Receipt className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                        />
                        <KpiCard
                            label="Total Dispensed Revenue"
                            value={formatRupees(totalSalesRevenue)}
                            icon={<TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
                        />
                        <KpiCard
                            label="Active Payment Channels"
                            value="Cash • UPI • Card"
                            icon={<CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
                        />
                    </div>

                    {/* Filter Bar */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by bill number, customer name, or payment method..."
                                value={historySearch}
                                onChange={(e) => setHistorySearch(e.target.value)}
                                className="w-full h-9 pl-9 pr-4 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Sales History Table */}
                    <Card className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50/50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-5 py-3.5 font-medium">Bill Number</th>
                                    <th className="px-5 py-3.5 font-medium">Customer</th>
                                    <th className="px-5 py-3.5 font-medium">Date</th>
                                    <th className="px-5 py-3.5 font-medium">Payment</th>
                                    <th className="px-5 py-3.5 font-medium text-right">Subtotal</th>
                                    <th className="px-5 py-3.5 font-medium text-right">GST (5%)</th>
                                    <th className="px-5 py-3.5 font-medium text-right">Grand Total</th>
                                    <th className="px-5 py-3.5 font-medium text-right">Action</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {filteredSales.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-slate-400">
                                            No sales transactions found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSales.map((sale) => {
                                        const billNo = sale.billNumber || sale.bill_number || `INV-${sale.id}`;
                                        const cust = sale.customerName || sale.customer_name || 'Walk-in Customer';
                                        const date = sale.saleDate || sale.sale_date || (sale.createdAt ? sale.createdAt.split('T')[0] : 'Recent');
                                        const st = Number(sale.subtotal || 0);
                                        const gst = Number(sale.gstAmount || sale.gst_amount || 0);
                                        const gt = Number(sale.grandTotal || sale.grand_total || (st + gst));

                                        return (
                                            <tr key={sale.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-5 py-4 font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                                                    {billNo}
                                                </td>
                                                <td className="px-5 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                                    <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                                                        <User className="h-3.5 w-3.5" />
                                                    </div>
                                                    <span>{cust}</span>
                                                </td>
                                                <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-mono">
                                                    {date}
                                                </td>
                                                <td className="px-5 py-4">
                                                    {getPaymentBadge(sale.paymentMethod || sale.payment_method)}
                                                </td>
                                                <td className="px-5 py-4 text-right font-mono text-slate-600 dark:text-slate-400 text-xs">
                                                    {formatRupees(st)}
                                                </td>
                                                <td className="px-5 py-4 text-right font-mono text-slate-600 dark:text-slate-400 text-xs">
                                                    {formatRupees(gst)}
                                                </td>
                                                <td className="px-5 py-4 text-right font-bold text-slate-900 dark:text-white">
                                                    {formatRupees(gt)}
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <button
                                                        onClick={() => setSelectedHistorySale(sale)}
                                                        className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg active:scale-95 transition-all flex items-center gap-1 ml-auto"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" /> View Receipt
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {/* ----------------- INVOICE / RECEIPT MODAL (POS & HISTORY) ----------------- */}
            {(isSuccess && invoiceData) && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scale-in">
                        <div className="text-center space-y-1">
                            <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Transaction Completed</h2>
                            <p className="text-xs text-slate-500 font-mono">Invoice #{invoiceData.billNo}</p>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-3 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Customer:</span>
                                <span className="font-bold text-slate-900 dark:text-white">{invoiceData.customer}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Payment:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{invoiceData.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Date:</span>
                                <span>{invoiceData.date}</span>
                            </div>

                            <div className="border-t border-slate-200 dark:border-slate-700 pt-2 space-y-1.5">
                                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Items Dispensed:</span>
                                {invoiceData.items.map((it, idx) => (
                                    <div key={idx} className="flex justify-between text-[11px]">
                                        <span>{it.quantity}x {it.name || it.medicineName}</span>
                                        <span className="font-mono">{formatRupees((it.price || it.unitPrice) * it.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-slate-200 dark:border-slate-700 pt-2 space-y-1">
                                <div className="flex justify-between text-slate-400">
                                    <span>Subtotal:</span>
                                    <span>{formatRupees(invoiceData.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>GST (5%):</span>
                                    <span>{formatRupees(invoiceData.gstAmount)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white pt-1">
                                    <span>Grand Total:</span>
                                    <span className="text-blue-600 dark:text-blue-400">{formatRupees(invoiceData.grandTotal)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => window.print()}
                                className="flex-1 flex items-center justify-center gap-1.5"
                            >
                                <Printer className="h-4 w-4" /> Print Receipt
                            </Button>
                            <Button
                                onClick={() => { setIsSuccess(false); setInvoiceData(null); }}
                                className="flex-1 font-bold"
                            >
                                New Sale
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* History Receipt Inspection Modal */}
            {selectedHistorySale && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scale-in">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Dispense Receipt</h3>
                                <p className="text-xs text-blue-600 dark:text-blue-400 font-mono font-bold">
                                    {selectedHistorySale.billNumber || selectedHistorySale.bill_number}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedHistorySale(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-3 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Customer:</span>
                                <span className="font-bold text-slate-900 dark:text-white">
                                    {selectedHistorySale.customerName || selectedHistorySale.customer_name || 'Walk-in Customer'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Payment Channel:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                    {selectedHistorySale.paymentMethod || selectedHistorySale.payment_method}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Date:</span>
                                <span>{selectedHistorySale.saleDate || selectedHistorySale.sale_date}</span>
                            </div>

                            <div className="border-t border-slate-200 dark:border-slate-700 pt-2 space-y-1.5">
                                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Dispensed Products:</span>
                                {selectedHistorySale.items && selectedHistorySale.items.length > 0 ? (
                                    selectedHistorySale.items.map((it, idx) => (
                                        <div key={idx} className="flex justify-between text-[11px]">
                                            <span>{it.quantity}x {it.medicineName || it.name}</span>
                                            <span className="font-mono">{formatRupees(it.totalPrice || (it.quantity * it.unitPrice))}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-[11px] text-slate-400">Standard prescription medicines package</div>
                                )}
                            </div>

                            <div className="border-t border-slate-200 dark:border-slate-700 pt-2 space-y-1">
                                <div className="flex justify-between text-slate-400">
                                    <span>Subtotal:</span>
                                    <span>{formatRupees(selectedHistorySale.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>GST (5%):</span>
                                    <span>{formatRupees(selectedHistorySale.gstAmount || selectedHistorySale.gst_amount)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white pt-1">
                                    <span>Grand Total:</span>
                                    <span className="text-blue-600 dark:text-blue-400">
                                        {formatRupees(selectedHistorySale.grandTotal || selectedHistorySale.grand_total)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2 justify-end">
                            <Button variant="outline" onClick={() => window.print()} className="flex items-center gap-1.5 text-xs">
                                <Printer className="h-4 w-4" /> Print
                            </Button>
                            <Button onClick={() => setSelectedHistorySale(null)} className="text-xs font-bold">
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}