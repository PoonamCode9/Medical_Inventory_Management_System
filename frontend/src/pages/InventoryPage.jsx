import { useState } from 'react';
import { Plus, Search, ArrowLeft, Boxes, Trash2, Pencil, Save, X, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, Button, Input, Select, StatusBadge, EmptyState, KpiCard } from '../components/ui';
import { useData } from '../context/DataContext';

export function InventoryPage({ role, view, batchId, onNavigate }) {
    const currentRole = (role || localStorage.getItem('role') || 'admin').toLowerCase();

    if (view === 'form') return <InventoryForm role={currentRole} onNavigate={onNavigate} batchId={batchId} />;
    if (view === 'detail' && batchId) return <InventoryDetail role={currentRole} id={batchId} onNavigate={onNavigate} />;
    return <InventoryList role={currentRole} onNavigate={onNavigate} />;
}

/* ---------- LIST ---------- */
function InventoryList({ role, onNavigate }) {
    const { batches, medicines, deleteBatch } = useData();
    const [search, setSearch] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);

    const isStaff = role === 'staff';
    const batchList = batches || [];

    let filtered = batchList;
    if (search) {
        filtered = filtered.filter((b) => {
            const batchNum = b.batchNumber || b.batch_number || '';
            const medName = b.medicineName || b.medicine_name || b.medicine?.medicineName || '';
            const supName = b.supplierName || b.supplier_name || '';
            return batchNum.toLowerCase().includes(search.toLowerCase()) ||
                medName.toLowerCase().includes(search.toLowerCase()) ||
                supName.toLowerCase().includes(search.toLowerCase());
        });
    }

    const handleDelete = async (id) => {
        if (deleteBatch) {
            await deleteBatch(id);
        }
        setConfirmDelete(null);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-ink-900 dark:text-white tracking-tight">Inventory Batches</h1>
                    <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">{batchList.length} total batches in system</p>
                </div>
                {!isStaff && (
                    <Button onClick={() => onNavigate('inventory/new')}>
                        <Plus className="h-4 w-4" /> Add Inventory
                    </Button>
                )}
            </div>

            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by batch number, medicine, or supplier..." className="input-base pl-9" />
                </div>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b border-ink-200 dark:border-ink-800 text-ink-500 dark:text-ink-400 text-xs uppercase tracking-wide">
                            <th className="text-left font-medium px-5 py-2.5">Batch #</th>
                            <th className="text-left font-medium px-5 py-2.5">Medicine</th>
                            <th className="text-left font-medium px-5 py-2.5">Supplier</th>
                            <th className="text-right font-medium px-5 py-2.5">Quantity</th>
                            <th className="text-left font-medium px-5 py-2.5">Mfg Date</th>
                            <th className="text-left font-medium px-5 py-2.5">Expiry Date</th>
                            <th className="text-left font-medium px-5 py-2.5">Status</th>
                            {!isStaff && <th className="text-right font-medium px-5 py-2.5">Actions</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map((b) => {
                            const bId = b.id;
                            const bNum = b.batchNumber || b.batch_number || 'N/A';
                            const mName = b.medicineName || b.medicine_name || b.medicine?.medicineName || 'N/A';
                            const sName = b.supplierName || b.supplier_name || 'N/A';
                            const qty = b.quantity || 0;
                            const mfgDate = b.manufacturingDate || b.manufacturing_date || 'N/A';
                            const expDate = b.expiryDate || b.expiry_date || 'N/A';
                            const status = b.stockStatus || b.stock_status || b.status || 'IN_STOCK';

                            return (
                                <tr key={bId} className="border-b border-ink-100 dark:border-ink-800/50 hover:bg-ink-50 dark:hover:bg-ink-800/30">
                                    <td className="px-5 py-3 font-mono font-medium text-ink-800 dark:text-ink-200 cursor-pointer" onClick={() => onNavigate(`inventory/${bId}`)}>{bNum}</td>
                                    <td className="px-5 py-3 text-ink-800 dark:text-ink-200 cursor-pointer" onClick={() => onNavigate(`inventory/${bId}`)}>{mName}</td>
                                    <td className="px-5 py-3 text-ink-500 dark:text-ink-400 cursor-pointer" onClick={() => onNavigate(`inventory/${bId}`)}>{sName}</td>
                                    <td className="px-5 py-3 text-right font-semibold text-ink-800 dark:text-ink-100 cursor-pointer" onClick={() => onNavigate(`inventory/${bId}`)}>{qty}</td>
                                    <td className="px-5 py-3 text-ink-500 dark:text-ink-400 cursor-pointer" onClick={() => onNavigate(`inventory/${bId}`)}>{mfgDate}</td>
                                    <td className="px-5 py-3 text-ink-500 dark:text-ink-400 cursor-pointer" onClick={() => onNavigate(`inventory/${bId}`)}>{expDate}</td>
                                    <td className="px-5 py-3 cursor-pointer" onClick={() => onNavigate(`inventory/${bId}`)}><StatusBadge status={status} /></td>
                                    {!isStaff && (
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => onNavigate(`inventory/edit/${bId}`)} className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-ink-700 transition-colors">
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => setConfirmDelete(b)} className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-ink-400 hover:bg-error-bg hover:text-error transition-colors">
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
                {filtered.length === 0 && <EmptyState icon={<Boxes className="h-7 w-7" />} title="No batches found" description="Try adjusting your search query." />}
            </Card>

            {confirmDelete && !isStaff && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setConfirmDelete(null)}>
                    <div className="bg-white dark:bg-ink-900 rounded-xl shadow-xl max-w-sm w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-error-bg flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-error" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-ink-800 dark:text-ink-100">Delete batch?</h3>
                                <p className="text-xs text-ink-500 mt-0.5">This action cannot be undone.</p>
                            </div>
                        </div>
                        <p className="text-sm text-ink-600 dark:text-ink-300 mb-5">Are you sure you want to delete batch <span className="font-semibold">{confirmDelete.batchNumber || confirmDelete.batch_number}</span>?</p>
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
function InventoryDetail({ role, id, onNavigate }) {
    const { batches, deleteBatch } = useData();
    const [confirmDelete, setConfirmDelete] = useState(false);

    const isStaff = role === 'staff';
    const batchList = batches || [];
    const batch = batchList.find((b) => Number(b.id) === Number(id));

    if (!batch) return <EmptyState icon={<Boxes className="h-7 w-7" />} title="Batch not found" description="This inventory batch may have been removed." action={<Button onClick={() => onNavigate('inventory')}>Back to inventory</Button>} />;

    const bNum = batch.batchNumber || batch.batch_number || 'N/A';
    const mName = batch.medicineName || batch.medicine_name || batch.medicine?.medicineName || 'N/A';
    const sName = batch.supplierName || batch.supplier_name || 'N/A';
    const qty = batch.quantity || 0;
    const mfgDate = batch.manufacturingDate || batch.manufacturing_date || 'N/A';
    const expDate = batch.expiryDate || batch.expiry_date || 'N/A';
    const status = batch.stockStatus || batch.stock_status || batch.status || 'IN_STOCK';

    return (
        <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
            <button onClick={() => onNavigate('inventory')} className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink-800 dark:hover:text-ink-200">
                <ArrowLeft className="h-4 w-4" /> Back to inventory
            </button>

            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                        <Boxes className="h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-ink-900 dark:text-white tracking-tight">Batch: {bNum}</h1>
                        <p className="text-sm text-ink-500 dark:text-ink-400 mt-0.5">Medicine: {mName} · Supplier: {sName}</p>
                    </div>
                </div>
                <StatusBadge status={status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <KpiCard label="Quantity" value={qty} icon={<Boxes size={20} />} />
                <KpiCard label="Mfg Date" value={mfgDate} icon={<Boxes size={20} />} />
                <KpiCard label="Expiry Date" value={expDate} icon={<Boxes size={20} />} />
            </div>

            {!isStaff && (
                <div className="flex gap-2 justify-end pt-4">
                    <Button variant="secondary" onClick={() => onNavigate(`inventory/edit/${id}`)}><Pencil className="h-4 w-4" /> Edit</Button>
                    <Button variant="destructive" onClick={() => setConfirmDelete(true)}><Trash2 className="h-4 w-4" /> Delete</Button>
                </div>
            )}

            {confirmDelete && !isStaff && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setConfirmDelete(false)}>
                    <div className="bg-white dark:bg-ink-900 rounded-xl shadow-xl max-w-sm w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-error-bg flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-error" />
                            </div>
                            <h3 className="text-sm font-semibold text-ink-800 dark:text-ink-100">Delete batch?</h3>
                        </div>
                        <p className="text-sm text-ink-600 dark:text-ink-300 mb-5">This will permanently delete batch <span className="font-semibold">{bNum}</span>.</p>
                        <div className="flex gap-2 justify-end">
                            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={() => { deleteBatch(id); onNavigate('inventory'); }}><Trash2 className="h-4 w-4" /> Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ---------- FORM (Add + Edit supporting custom medicine name entry & supplier selection) ---------- */
function InventoryForm({ role, onNavigate, batchId }) {
    if (role === 'staff') {
        return (
            <div className="space-y-4 animate-fade-in max-w-lg mx-auto py-12 text-center">
                <h2 className="text-xl font-bold text-ink-900 dark:text-white">Access Denied</h2>
                <p className="text-sm text-ink-500">Staff members do not have permission to add or edit inventory batches.</p>
                <Button onClick={() => onNavigate('inventory')}>Back to inventory</Button>
            </div>
        );
    }

    const { medicines, suppliers, batches, addBatch, updateBatch } = useData();
    const editing = batchId !== undefined && batchId !== 'new' && batchId !== 'edit';
    const batchList = batches || [];
    const medList = medicines || [];
    const supList = suppliers || [];

    const existing = editing ? batchList.find((b) => Number(b.id) === Number(batchId)) : null;

    const [form, setForm] = useState({
        medicine_id: existing?.medicineId || existing?.medicine_id || medList[0]?.id || '',
        custom_medicine_name: existing?.medicineName || existing?.medicine_name || '',
        supplier_id: existing?.supplierId || existing?.supplier_id || supList[0]?.id || '',
        batch_number: existing?.batchNumber || existing?.batch_number || '',
        quantity: existing?.quantity?.toString() || '',
        manufacturing_date: existing?.manufacturingDate || existing?.manufacturing_date || '',
        expiry_date: existing?.expiryDate || existing?.expiry_date || '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (field) => (e) => {
        setForm({ ...form, [field]: e.target.value });
        if (errors[field]) setErrors({ ...errors, [field]: null });
    };

    const validate = () => {
        const errs = {};
        if (!form.medicine_id && !form.custom_medicine_name.trim()) errs.custom_medicine_name = 'Please select a medicine or enter a custom name';
        if (!form.supplier_id) errs.supplier_id = 'Please select a supplier';
        if (!form.batch_number.trim()) errs.batch_number = 'Batch number is required';
        if (!form.quantity || parseInt(form.quantity, 10) < 0) errs.quantity = 'Enter a valid quantity';
        if (!form.manufacturing_date) errs.manufacturing_date = 'Manufacturing date is required';
        if (!form.expiry_date) errs.expiry_date = 'Expiry date is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        if (editing) {
            await updateBatch(batchId, form);
        } else {
            await addBatch(form);
        }
        onNavigate('inventory');
    };

    return (
        <div className="max-w-xl mx-auto space-y-6 animate-fade-in py-4">
            <button onClick={() => onNavigate('inventory')} className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink-800 dark:hover:text-ink-200">
                <ArrowLeft className="h-4 w-4" /> Back to inventory
            </button>
            <div className="text-center">
                <h1 className="text-2xl font-bold text-ink-900 dark:text-white tracking-tight">{editing ? 'Edit Inventory Batch' : 'Add New Inventory Batch'}</h1>
                <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">Record batch quantities, choose supplier, and specify medicine details.</p>
            </div>
            <form onSubmit={handleSubmit}>
                <Card className="p-6 space-y-4 shadow-lg border border-ink-200 dark:border-ink-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select label="Select Existing Medicine" value={form.medicine_id} onChange={handleChange('medicine_id')}>
                            <option value="">-- Choose catalog medicine --</option>
                            {medList.map((m) => (
                                <option key={m.id} value={m.id}>{m.medicineName || m.medicine_name}</option>
                            ))}
                        </Select>
                        <Input
                            label="Or Custom Medicine Name"
                            placeholder="e.g. Special Formulation X"
                            value={form.custom_medicine_name}
                            onChange={handleChange('custom_medicine_name')}
                            error={errors.custom_medicine_name}
                        />
                    </div>

                    <Select label="Supplier Name" value={form.supplier_id} onChange={handleChange('supplier_id')} error={errors.supplier_id}>
                        <option value="">-- Select supplier --</option>
                        {supList.map((s) => (
                            <option key={s.id} value={s.id}>{s.supplierName || s.supplier_name}</option>
                        ))}
                    </Select>

                    <Input label="Batch Number" placeholder="e.g. BATCH-PAR-001" value={form.batch_number} onChange={handleChange('batch_number')} error={errors.batch_number} />
                    <Input label="Quantity" type="number" placeholder="0" value={form.quantity} onChange={handleChange('quantity')} error={errors.quantity} />

                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Manufacturing Date" type="date" value={form.manufacturing_date} onChange={handleChange('manufacturing_date')} error={errors.manufacturing_date} />
                        <Input label="Expiry Date" type="date" value={form.expiry_date} onChange={handleChange('expiry_date')} error={errors.expiry_date} />
                    </div>

                    <div className="flex gap-2 pt-2 justify-end">
                        <Button type="button" variant="secondary" onClick={() => onNavigate('inventory')}><X className="h-4 w-4" /> Cancel</Button>
                        <Button type="submit"><Save className="h-4 w-4" /> {editing ? 'Update' : 'Save'} Batch</Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}