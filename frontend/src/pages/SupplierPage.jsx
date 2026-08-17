import { useState } from 'react';
import { ArrowLeft, Truck, Plus, Search, Pencil, Save, X, Star, Phone, Mail, MapPin, Trash2, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, Button, Input, PhoneInput, StatusBadge, EmptyState, KpiCard, Badge } from '../components/ui';
import { useData } from '../context/DataContext';

function formatRupees(amount) {
    return '₹' + Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function SupplierPage({ role, view, supplierId, onNavigate }) {
    const currentRole = (role || localStorage.getItem('role') || 'admin').toLowerCase();

    // Check if view is explicitly form or if routing passed an edit action
    if (view === 'form' || view === 'new' || view === 'edit') {
        return <SupplierForm role={currentRole} onNavigate={onNavigate} supplierId={supplierId} />;
    }

    // Detail View: only trigger if supplierId is a valid numerical ID
    if (view === 'detail' && supplierId && !isNaN(supplierId)) {
        return <SupplierDetail role={currentRole} id={supplierId} onNavigate={onNavigate} />;
    }

    return <SupplierList role={currentRole} onNavigate={onNavigate} />;
}

/* ---------- LIST ---------- */
function SupplierList({ role, onNavigate }) {
    const { suppliers = [], deleteSupplier } = useData();
    const [search, setSearch] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);

    const isAdmin = role === 'admin';
    const supplierList = suppliers || [];

    const filtered = search
        ? supplierList.filter((s) => {
            const name = s.supplierName || s.supplier_name || '';
            return name.toLowerCase().includes(search.toLowerCase());
        })
        : supplierList;

    const handleDelete = async (id) => {
        if (deleteSupplier) {
            await deleteSupplier(id);
        }
        setConfirmDelete(null);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-ink-900 dark:text-white tracking-tight">Suppliers</h1>
                    <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">{supplierList.length} suppliers registered</p>
                </div>
                {isAdmin && (
                    <Button onClick={() => onNavigate('suppliers/new')}>
                        <Plus className="h-4 w-4" /> Add Supplier
                    </Button>
                )}
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search suppliers by name..."
                    className="input-base pl-9"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((s) => {
                    const sId = s.id;
                    const sName = s.supplierName || s.supplier_name || 'N/A';
                    const sEmail = s.email || 'N/A';
                    const sPhone = s.contactNumber || s.contact_number || 'N/A';
                    const rating = s.performanceRating !== undefined ? s.performanceRating : (s.performance_rating || 5);
                    const status = s.status || 'ACTIVE';

                    return (
                        <Card key={sId} className="p-5 hover:shadow-card-hover transition-shadow flex flex-col justify-between">
                            <div>
                                <div className="flex items-start justify-between mb-3">
                                    <div
                                        className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 cursor-pointer"
                                        onClick={() => onNavigate(`suppliers/${sId}`)}
                                    >
                                        <Truck className="h-5 w-5" />
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <StatusBadge status={status} />
                                        {isAdmin && (
                                            <div className="flex items-center ml-1">
                                                <button
                                                    onClick={() => onNavigate(`suppliers/edit/${sId}`)}
                                                    className="p-1 text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 rounded"
                                                    title="Edit Supplier"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDelete(s)}
                                                    className="p-1 text-ink-400 hover:text-error rounded"
                                                    title="Delete Supplier"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <h3
                                    className="text-sm font-semibold text-ink-800 dark:text-ink-100 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
                                    onClick={() => onNavigate(`suppliers/${sId}`)}
                                >
                                    {sName}
                                </h3>
                                <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">{sEmail}</p>
                                <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">{sPhone}</p>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-ink-100 dark:border-ink-800">
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                    <span className="text-sm font-medium text-ink-700 dark:text-ink-200">{rating} / 5</span>
                                </div>
                                <Button variant="secondary" onClick={() => onNavigate(`suppliers/${sId}`)} className="text-xs h-7 px-2.5">
                                    Details
                                </Button>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <EmptyState icon={<Truck className="h-7 w-7" />} title="No suppliers found" description="Try adjusting your search query." />
            )}

            {confirmDelete && isAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setConfirmDelete(null)}>
                    <div className="bg-white dark:bg-ink-900 rounded-xl shadow-xl max-w-sm w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-error-bg flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-error" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-ink-800 dark:text-ink-100">Delete supplier?</h3>
                                <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">This action cannot be undone.</p>
                            </div>
                        </div>
                        <p className="text-sm text-ink-600 dark:text-ink-300 mb-5">
                            Are you sure you want to delete <span className="font-semibold">{confirmDelete.supplierName || confirmDelete.supplier_name}</span>?
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

/* ---------- DETAIL ---------- */
function SupplierDetail({ role, id, onNavigate }) {
    const { suppliers = [], purchaseOrders = [], deleteSupplier } = useData();
    const [confirmDelete, setConfirmDelete] = useState(false);

    const isAdmin = role === 'admin';
    const supplierList = suppliers || [];
    const sup = supplierList.find((s) => Number(s.id) === Number(id));

    if (!sup) return <EmptyState icon={<Truck className="h-7 w-7" />} title="Supplier not found" description="This supplier may have been removed." action={<Button onClick={() => onNavigate('suppliers')}>Back to list</Button>} />;

    const sName = sup.supplierName || sup.supplier_name || 'N/A';
    const sEmail = sup.email || 'N/A';
    const sPhone = sup.contactNumber || sup.contact_number || 'N/A';
    const sAddress = sup.address || 'N/A';
    const rating = sup.performanceRating !== undefined ? sup.performanceRating : (sup.performance_rating || 5);
    const status = sup.status || 'ACTIVE';

    const pos = (purchaseOrders || []).filter((po) => Number(po.supplierId || po.supplier_id) === Number(id));
    const totalSpend = pos.reduce((sum, po) => sum + (Number(po.total) || 0), 0);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <button onClick={() => onNavigate('suppliers')} className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink-800 dark:hover:text-ink-200">
                    <ArrowLeft className="h-4 w-4" /> Back to suppliers
                </button>
                {isAdmin && (
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" onClick={() => onNavigate(`suppliers/edit/${id}`)}>
                            <Pencil className="h-4 w-4" /> Edit
                        </Button>
                        <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
                            <Trash2 className="h-4 w-4" /> Delete
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 md:col-span-2 space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                                <Truck className="h-7 w-7" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-ink-900 dark:text-white">{sName}</h1>
                                <p className="text-xs text-ink-500 dark:text-ink-400 font-mono mt-0.5">ID #{id}</p>
                            </div>
                        </div>
                        <StatusBadge status={status} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-ink-100 dark:border-ink-800">
                        <div className="flex items-center gap-2.5 text-sm text-ink-700 dark:text-ink-200">
                            <Phone className="h-4 w-4 text-ink-400 shrink-0" />
                            <span>{sPhone}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-ink-700 dark:text-ink-200">
                            <Mail className="h-4 w-4 text-ink-400 shrink-0" />
                            <span>{sEmail}</span>
                        </div>
                        <div className="flex items-start gap-2.5 text-sm text-ink-700 dark:text-ink-200 sm:col-span-2">
                            <MapPin className="h-4 w-4 text-ink-400 shrink-0 mt-0.5" />
                            <span>{sAddress}</span>
                        </div>
                    </div>
                </Card>

                <div className="space-y-4">
                    <KpiCard label="Performance Rating" value={`${rating} / 5`} icon={<Star className="h-5 w-5 fill-amber-500 text-amber-500" />} />
                    <KpiCard label="Total Spend" value={formatRupees(totalSpend)} icon={<Truck className="h-5 w-5" />} />
                </div>
            </div>

            <Card>
                <CardHeader title="Purchase Orders" subtitle={`${pos.length} orders placed with this supplier`} />
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b border-ink-200 dark:border-ink-800 text-ink-500 dark:text-ink-400 text-xs uppercase tracking-wide">
                            <th className="text-left font-medium px-5 py-2.5">PO Number</th>
                            <th className="text-left font-medium px-5 py-2.5">Date</th>
                            <th className="text-right font-medium px-5 py-2.5">Items</th>
                            <th className="text-right font-medium px-5 py-2.5">Total</th>
                            <th className="text-left font-medium px-5 py-2.5">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pos.map((po) => (
                            <tr
                                key={po.id}
                                className="border-b border-ink-100 dark:border-ink-800/50 hover:bg-ink-50 dark:hover:bg-ink-800/30 cursor-pointer"
                                onClick={() => onNavigate(`purchase-orders/${po.id}`)}
                            >
                                <td className="px-5 py-3 font-mono font-medium text-ink-800 dark:text-ink-200">{po.poNumber || po.po_number}</td>
                                <td className="px-5 py-3 text-ink-500 dark:text-ink-400">{po.orderDate || po.order_date}</td>
                                <td className="px-5 py-3 text-right text-ink-500 dark:text-ink-400">{po.itemCount || po.item_count || 0}</td>
                                <td className="px-5 py-3 text-right font-semibold text-ink-800 dark:text-ink-100">{formatRupees(po.total || 0)}</td>
                                <td className="px-5 py-3"><StatusBadge status={po.status || 'PENDING'} /></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {pos.length === 0 && <EmptyState icon={<Truck className="h-7 w-7" />} title="No purchase orders" description="No orders placed with this supplier yet." />}
            </Card>

            {confirmDelete && isAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setConfirmDelete(false)}>
                    <div className="bg-white dark:bg-ink-900 rounded-xl shadow-xl max-w-sm w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-error-bg flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-error" />
                            </div>
                            <h3 className="text-sm font-semibold text-ink-800 dark:text-ink-100">Delete supplier?</h3>
                        </div>
                        <p className="text-sm text-ink-600 dark:text-ink-300 mb-5">
                            This will permanently delete <span className="font-semibold">{sName}</span>.
                        </p>
                        <div className="flex gap-2 justify-end">
                            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={async () => { await deleteSupplier(id); onNavigate('suppliers'); }}>
                                <Trash2 className="h-4 w-4" /> Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ---------- FORM (Add & Edit) ---------- */
function SupplierForm({ role, onNavigate, supplierId }) {
    if (role !== 'admin') {
        return (
            <div className="space-y-4 animate-fade-in max-w-lg mx-auto py-12 text-center">
                <h2 className="text-xl font-bold text-ink-900 dark:text-white">Access Denied</h2>
                <p className="text-sm text-ink-500">Only Administrators have permission to add or edit suppliers.</p>
                <Button onClick={() => onNavigate('suppliers')}>Back to suppliers</Button>
            </div>
        );
    }

    const { suppliers = [], addSupplier, updateSupplier } = useData();

    // Cleanly extract target supplier ID whether passed as raw number, string, or URL param
    const cleanId = (supplierId && supplierId !== 'new' && supplierId !== 'edit')
        ? String(supplierId).replace('edit/', '').replace('/edit', '')
        : null;

    const editing = Boolean(cleanId && !isNaN(cleanId));
    const supplierList = suppliers || [];
    const existing = editing ? supplierList.find((s) => Number(s.id) === Number(cleanId)) : null;

    const [form, setForm] = useState({
        supplier_name: existing?.supplierName || existing?.supplier_name || '',
        contact_number: existing?.contactNumber || existing?.contact_number || '+91 ',
        email: existing?.email || '',
        address: existing?.address || '',
        performance_rating: existing?.performanceRating !== undefined
            ? String(existing.performanceRating)
            : (existing?.performance_rating !== undefined ? String(existing.performance_rating) : '5'),
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (field) => (e) => {
        const val = typeof e === 'string' ? e : e.target.value;
        setForm(prev => ({ ...prev, [field]: val }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const validate = () => {
        const errs = {};
        if (!form.supplier_name.trim()) errs.supplier_name = 'Supplier name is required';
        if (!form.contact_number.trim()) errs.contact_number = 'Contact number is required';
        if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate() || submitting) return;

        setSubmitting(true);
        let success = false;
        if (editing) {
            success = await updateSupplier(cleanId, form);
        } else {
            success = await addSupplier(form);
        }
        setSubmitting(false);

        if (success) {
            onNavigate('suppliers');
        } else {
            alert('Failed to save supplier. Check backend server connection.');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-2xl mx-auto py-4">
            <button onClick={() => onNavigate('suppliers')} className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink-800 dark:hover:text-ink-200">
                <ArrowLeft className="h-4 w-4" /> Back to suppliers
            </button>
            <div className="text-center">
                <h1 className="text-2xl font-bold text-ink-900 dark:text-white tracking-tight">
                    {editing ? 'Edit Supplier' : 'Add New Supplier'}
                </h1>
                <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">Configure supplier contact & catalog information.</p>
            </div>
            <form onSubmit={handleSubmit}>
                <Card className="p-6 space-y-4 shadow-lg border border-ink-200 dark:border-ink-800">
                    <Input
                        label="Supplier Name"
                        placeholder="e.g. Apollo Pharma Distributors"
                        value={form.supplier_name}
                        onChange={handleChange('supplier_name')}
                        error={errors.supplier_name}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <PhoneInput
                            label="Contact Number"
                            value={form.contact_number}
                            onChange={handleChange('contact_number')}
                            error={errors.contact_number}
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="orders@apollopharma.com"
                            value={form.email}
                            onChange={handleChange('email')}
                            error={errors.email}
                        />
                    </div>
                    <Input
                        label="Physical Address"
                        placeholder="e.g. MIDC Industrial Area, Pune, Maharashtra"
                        value={form.address}
                        onChange={handleChange('address')}
                    />
                    <Input
                        label="Performance Rating (1 - 5)"
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        placeholder="5"
                        value={form.performance_rating}
                        onChange={handleChange('performance_rating')}
                    />
                    <div className="flex gap-2 pt-2 justify-end">
                        <Button type="button" variant="secondary" onClick={() => onNavigate('suppliers')}>
                            <X className="h-4 w-4" /> Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            <Save className="h-4 w-4" /> {submitting ? 'Saving...' : (editing ? 'Update' : 'Save')} Supplier
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}