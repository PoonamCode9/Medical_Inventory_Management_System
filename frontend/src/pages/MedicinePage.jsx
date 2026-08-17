import { useState } from 'react';
import { Plus, Search, ArrowLeft, Pill, Trash2, Pencil, Save, X, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, Button, Input, Select, StatusBadge, EmptyState, KpiCard } from '../components/ui';
import { useData } from '../context/DataContext';

function formatRupees(amount) {
    return '₹' + Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function MedicinePage({ role, view, medicineId, onNavigate }) {
    const currentRole = (role || localStorage.getItem('role') || 'admin').toLowerCase();

    if (view === 'form') return <MedicineForm role={currentRole} onNavigate={onNavigate} medicineId={medicineId} />;
    if (view === 'detail' && medicineId) return <MedicineDetail role={currentRole} id={medicineId} onNavigate={onNavigate} />;
    return <MedicineList role={currentRole} onNavigate={onNavigate} />;
}

/* ---------- LIST ---------- */
function MedicineList({ role, onNavigate }) {
    const { medicines, categories, deleteMedicine } = useData();
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('all');
    const [confirmDelete, setConfirmDelete] = useState(null);

    const isAdmin = role === 'admin';
    const isPharmacist = role === 'pharmacist';

    const medList = medicines || [];
    const catList = categories || [];

    let filtered = medList;
    if (search) {
        filtered = filtered.filter((m) => {
            const name = m.medicineName || m.medicine_name || '';
            return name.toLowerCase().includes(search.toLowerCase());
        });
    }
    if (filterCat !== 'all') {
        filtered = filtered.filter((m) => {
            const catName = m.categoryName || m.category_name || m.category?.name || '';
            return catName === filterCat;
        });
    }

    const handleDelete = async (id) => {
        await deleteMedicine(id);
        setConfirmDelete(null);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-ink-900 dark:text-white tracking-tight">Medicines</h1>
                    <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">{medList.length} medicines in catalog</p>
                </div>
                <div className="flex items-center gap-2">
                    {isPharmacist && (
                        <Button variant="secondary" onClick={() => onNavigate('inventory')} className="text-xs">
                            <Plus className="h-4 w-4" /> Add Stock Batch
                        </Button>
                    )}
                    {isAdmin && (
                        <Button onClick={() => onNavigate('medicines/new')}>
                            <Plus className="h-4 w-4" /> Add Medicine
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name..." className="input-base pl-9" />
                </div>
                <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="input-base sm:w-48 cursor-pointer">
                    <option value="all">All categories</option>
                    {catList.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b border-ink-200 dark:border-ink-800 text-ink-500 dark:text-ink-400 text-xs uppercase tracking-wide">
                            <th className="text-left font-medium px-5 py-2.5">Medicine</th>
                            <th className="text-left font-medium px-5 py-2.5">Category</th>
                            <th className="text-left font-medium px-5 py-2.5">Supplier</th>
                            <th className="text-right font-medium px-5 py-2.5">Price</th>
                            <th className="text-right font-medium px-5 py-2.5">Stock</th>
                            <th className="text-left font-medium px-5 py-2.5">Status</th>
                            {isAdmin && <th className="text-right font-medium px-5 py-2.5">Actions</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map((m) => {
                            const mId = m.id;
                            const mName = m.medicineName || m.medicine_name || 'N/A';
                            const cName = m.categoryName || m.category_name || m.category?.name || 'N/A';
                            const sName = m.supplierName || m.supplier_name || m.supplier?.supplierName || 'N/A';
                            const price = m.price || 0;
                            const stock = m.totalStock !== undefined ? m.totalStock : (m.total_stock !== undefined ? m.total_stock : 0);
                            const status = m.status || 'IN_STOCK';

                            return (
                                <tr key={mId} className="border-b border-ink-100 dark:border-ink-800/50 hover:bg-ink-50 dark:hover:bg-ink-800/30">
                                    <td className="px-5 py-3 font-medium text-ink-800 dark:text-ink-200 cursor-pointer" onClick={() => onNavigate(`medicines/${mId}`)}>{mName}</td>
                                    <td className="px-5 py-3 text-ink-500 dark:text-ink-400 cursor-pointer" onClick={() => onNavigate(`medicines/${mId}`)}>{cName}</td>
                                    <td className="px-5 py-3 text-ink-500 dark:text-ink-400 cursor-pointer" onClick={() => onNavigate(`medicines/${mId}`)}>{sName}</td>
                                    <td className="px-5 py-3 text-right font-medium text-ink-700 dark:text-ink-300 cursor-pointer" onClick={() => onNavigate(`medicines/${mId}`)}>{formatRupees(price)}</td>
                                    <td className="px-5 py-3 text-right font-semibold text-ink-800 dark:text-ink-100 cursor-pointer" onClick={() => onNavigate(`medicines/${mId}`)}>{stock}</td>
                                    <td className="px-5 py-3 cursor-pointer" onClick={() => onNavigate(`medicines/${mId}`)}><StatusBadge status={status} /></td>
                                    {isAdmin && (
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => onNavigate(`medicines/edit/${mId}`)} className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-ink-700 dark:hover:text-ink-200 transition-colors">
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => setConfirmDelete(m)} className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-ink-400 hover:bg-error-bg hover:text-error transition-colors">
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
                {filtered.length === 0 && <EmptyState icon={<Pill className="h-7 w-7" />} title="No medicines found" description="Try adjusting your search or filter." />}
            </Card>

            {confirmDelete && isAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setConfirmDelete(null)}>
                    <div className="bg-white dark:bg-ink-900 rounded-xl shadow-xl max-w-sm w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-error-bg flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-error" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-ink-800 dark:text-ink-100">Delete medicine?</h3>
                                <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">This will also remove all its inventory batches.</p>
                            </div>
                        </div>
                        <p className="text-sm text-ink-600 dark:text-ink-300 mb-5">Are you sure you want to delete <span className="font-semibold">{confirmDelete.medicineName || confirmDelete.medicine_name}</span>? This cannot be undone.</p>
                        <div className="flex gap-2 justify-end">
                            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                            <Button variant="destructive" onClick={() => handleDelete(confirmDelete.id)}><Trash2 className="h-4 w-4" /> Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ---------- DETAIL ---------- */
function MedicineDetail({ role, id, onNavigate }) {
    const { medicines, batches, deleteMedicine } = useData();
    const [confirmDelete, setConfirmDelete] = useState(false);

    const isAdmin = role === 'admin';
    const medList = medicines || [];
    const med = medList.find((m) => Number(m.id) === Number(id));

    if (!med) return <EmptyState icon={<Pill className="h-7 w-7" />} title="Medicine not found" description="This medicine may have been removed." action={<Button onClick={() => onNavigate('medicines')}>Back to list</Button>} />;

    const batchList = batches || [];
    const medBatches = batchList.filter((b) => Number(b.medicineId || b.medicine_id) === Number(id));

    const mName = med.medicineName || med.medicine_name || 'N/A';
    const cName = med.categoryName || med.category_name || med.category?.name || 'N/A';
    const sName = med.supplierName || med.supplier_name || med.supplier?.supplierName || 'N/A';
    const price = med.price || 0;
    const totalStock = med.totalStock !== undefined ? med.totalStock : (med.total_stock !== undefined ? med.total_stock : 0);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <button onClick={() => onNavigate('medicines')} className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink-800 dark:hover:text-ink-200">
                    <ArrowLeft className="h-4 w-4" /> Back to medicines
                </button>
                {isAdmin && (
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" onClick={() => onNavigate(`medicines/edit/${id}`)}>
                            <Pencil className="h-4 w-4" /> Edit
                        </Button>
                        <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
                            <Trash2 className="h-4 w-4" /> Delete
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                        <Pill className="h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-ink-900 dark:text-white tracking-tight">{mName}</h1>
                        <p className="text-sm text-ink-500 dark:text-ink-400 mt-0.5">{cName} · {formatRupees(price)}/unit</p>
                    </div>
                </div>
                <StatusBadge status={med.status || 'IN_STOCK'} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <KpiCard label="Total Stock" value={totalStock} icon={<Pill size={20} />} />
                <KpiCard label="Active Batches" value={medBatches.length} icon={<Pill size={20} />} />
                <KpiCard label="Supplier" value={sName} icon={<Pill size={20} />} />
            </div>

            <Card>
                <CardHeader title="Inventory Batches" subtitle="All batches for this medicine" />
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b border-ink-200 dark:border-ink-800 text-ink-500 dark:text-ink-400 text-xs uppercase tracking-wide">
                            <th className="text-left font-medium px-5 py-2.5">Batch #</th>
                            <th className="text-right font-medium px-5 py-2.5">Qty</th>
                            <th className="text-left font-medium px-5 py-2.5">Mfg Date</th>
                            <th className="text-left font-medium px-5 py-2.5">Expiry</th>
                            <th className="text-left font-medium px-5 py-2.5">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {medBatches.map((b) => (
                            <tr key={b.id} className="border-b border-ink-100 dark:border-ink-800/50 hover:bg-ink-50 dark:hover:bg-ink-800/30 cursor-pointer"
                                onClick={() => onNavigate(`inventory/${b.id}`)}>
                                <td className="px-5 py-3 font-mono font-medium text-ink-800 dark:text-ink-200">{b.batchNumber || b.batch_number}</td>
                                <td className="px-5 py-3 text-right font-semibold text-ink-800 dark:text-ink-100">{b.quantity}</td>
                                <td className="px-5 py-3 text-ink-500 dark:text-ink-400">{b.manufacturingDate || b.manufacturing_date || 'N/A'}</td>
                                <td className="px-5 py-3 text-ink-500 dark:text-ink-400">{b.expiryDate || b.expiry_date}</td>
                                <td className="px-5 py-3"><StatusBadge status={b.stockStatus || b.stock_status || 'IN_STOCK'} /></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {medBatches.length === 0 && <EmptyState icon={<Pill className="h-7 w-7" />} title="No batches" description="No inventory batches added for this medicine." />}
            </Card>

            {confirmDelete && isAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setConfirmDelete(false)}>
                    <div className="bg-white dark:bg-ink-900 rounded-xl shadow-xl max-w-sm w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-error-bg flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-error" />
                            </div>
                            <h3 className="text-sm font-semibold text-ink-800 dark:text-ink-100">Delete medicine?</h3>
                        </div>
                        <p className="text-sm text-ink-600 dark:text-ink-300 mb-5">This will permanently delete <span className="font-semibold">{mName}</span> and all its batches.</p>
                        <div className="flex gap-2 justify-end">
                            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={async () => { await deleteMedicine(id); onNavigate('medicines'); }}><Trash2 className="h-4 w-4" /> Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ---------- FORM (Add & Edit) ---------- */
function MedicineForm({ role, onNavigate, medicineId }) {
    if (role !== 'admin') {
        return (
            <div className="space-y-4 animate-fade-in max-w-lg mx-auto py-12 text-center">
                <h2 className="text-xl font-bold text-ink-900 dark:text-white">Access Denied</h2>
                <p className="text-sm text-ink-500">Only Administrators have permission to add or edit master medicine catalog items.</p>
                <Button onClick={() => onNavigate('medicines')}>Back to medicines</Button>
            </div>
        );
    }

    const { medicines = [], categories = [], suppliers = [], addMedicine, updateMedicine } = useData();
    const editing = Boolean(medicineId && medicineId !== 'new' && medicineId !== 'edit');
    const existing = editing ? medicines.find((m) => Number(m.id) === Number(medicineId)) : null;

    const [form, setForm] = useState({
        medicine_name: existing?.medicineName || existing?.medicine_name || '',
        category_id: existing?.categoryId || existing?.category_id || categories[0]?.id || '',
        supplier_id: existing?.supplierId || existing?.supplier_id || suppliers[0]?.id || '',
        price: existing?.price !== undefined ? String(existing.price) : '',
        reorder_threshold: existing?.reorderThreshold || existing?.reorder_threshold || '50',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (field) => (e) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const validate = () => {
        const errs = {};
        if (!form.medicine_name.trim()) errs.medicine_name = 'Medicine name is required';
        if (!form.price || isNaN(form.price) || parseFloat(form.price) < 0) errs.price = 'Enter a valid price';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate() || submitting) return;

        setSubmitting(true);
        let success = false;
        if (editing) {
            success = await updateMedicine(medicineId, form);
        } else {
            success = await addMedicine(form);
        }
        setSubmitting(false);

        if (success) {
            onNavigate('medicines');
        } else {
            alert('Could not save medicine. Ensure Spring Boot is running.');
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-6 animate-fade-in py-4">
            <button onClick={() => onNavigate('medicines')} className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink-800 dark:hover:text-ink-200">
                <ArrowLeft className="h-4 w-4" /> Back to medicines
            </button>
            <div className="text-center">
                <h1 className="text-2xl font-bold text-ink-900 dark:text-white tracking-tight">{editing ? 'Edit Medicine' : 'Add New Medicine'}</h1>
                <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">Fill in the details below to update catalog information.</p>
            </div>
            <form onSubmit={handleSubmit}>
                <Card className="p-6 space-y-4 shadow-lg border border-ink-200 dark:border-ink-800">
                    <Input label="Medicine Name" placeholder="e.g. Paracetamol 500mg (Crocin)" value={form.medicine_name} onChange={handleChange('medicine_name')} error={errors.medicine_name} />
                    <div className="grid grid-cols-2 gap-4">
                        <Select label="Category" value={form.category_id} onChange={handleChange('category_id')}>
                            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </Select>
                        <Select label="Supplier" value={form.supplier_id} onChange={handleChange('supplier_id')}>
                            {suppliers.map((s) => <option key={s.id} value={s.id}>{s.supplierName || s.supplier_name || s.name}</option>)}
                        </Select>
                    </div>
                    <Input label="Price per unit (₹)" type="number" step="0.01" placeholder="0.00" value={form.price} onChange={handleChange('price')} error={errors.price} />
                    <Input label="Reorder Threshold" type="number" placeholder="50" hint="Alert when stock drops below this number" value={form.reorder_threshold} onChange={handleChange('reorder_threshold')} error={errors.reorder_threshold} />
                    <div className="flex gap-2 pt-2 justify-end">
                        <Button type="button" variant="secondary" onClick={() => onNavigate('medicines')}><X className="h-4 w-4" /> Cancel</Button>
                        <Button type="submit" disabled={submitting}>
                            <Save className="h-4 w-4" /> {submitting ? 'Saving...' : (editing ? 'Update' : 'Save')} Medicine
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}