import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Package } from 'lucide-react';
import { getCategories, getSuppliers } from '../services/api';

const MedicineModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    name: '',
    batchNumber: '',
    quantity: '',
    manufacturingDate: '',
    expiryDate: '',
    price: '',
    categoryId: '',
    supplierId: '',
  });

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Load categories and suppliers
      Promise.all([getCategories(), getSuppliers()])
        .then(([catRes, supRes]) => {
          setCategories(catRes.data);
          setSuppliers(supRes.data);
        })
        .catch(() => {});

      if (initialData) {
        setForm({
          name: initialData.name || '',
          batchNumber: initialData.batchNumber || '',
          quantity: initialData.quantity ?? '',
          manufacturingDate: initialData.manufacturingDate || '',
          expiryDate: initialData.expiryDate || '',
          price: initialData.price ?? '',
          categoryId: initialData.categoryId ?? '',
          supplierId: initialData.supplierId ?? '',
        });
      } else {
        setForm({
          name: '', batchNumber: '', quantity: '',
          manufacturingDate: '', expiryDate: '', price: '',
          categoryId: '', supplierId: '',
        });
      }
      setError('');
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        quantity: parseInt(form.quantity, 10),
        price: parseFloat(form.price),
        categoryId: form.categoryId ? parseInt(form.categoryId, 10) : null,
        supplierId: form.supplierId ? parseInt(form.supplierId, 10) : null,
      };
      await onSubmit(payload);
      onClose();
    } catch (err) {
      const data = err.response?.data;
      const errorMsg = typeof data === 'string' ? data : (data?.message || err.message || 'An error occurred');
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'glass-input w-full px-3 py-2.5 rounded-xl text-sm outline-none';
  const labelClass = 'block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25 }}
            className="glass-card rounded-2xl w-full max-w-lg border border-slate-700/60 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/70">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-500/15 flex items-center justify-center border border-sky-500/25">
                  <Package className="w-4 h-4 text-sky-400" />
                </div>
                <h2 className="font-bold text-slate-100 text-base">
                  {isEdit ? 'Edit Medicine' : 'Add New Medicine'}
                </h2>
              </div>
              <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {error && (
                <div className="text-red-400 bg-red-950/20 border border-red-500/30 p-3 rounded-xl text-xs">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelClass}>Medicine Name</label>
                  <input
                    name="name" value={form.name} onChange={handleChange}
                    placeholder="e.g. Paracetamol 500mg" required className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Batch Number</label>
                  <input
                    name="batchNumber" value={form.batchNumber} onChange={handleChange}
                    placeholder="BT-2024-001" required className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Quantity</label>
                  <input
                    type="number" name="quantity" value={form.quantity} onChange={handleChange}
                    placeholder="0" min="0" required className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Price (₹)</label>
                  <input
                    type="number" name="price" value={form.price} onChange={handleChange}
                    placeholder="0.00" min="0" step="0.01" required className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Manufacturing Date</label>
                  <input
                    type="date" name="manufacturingDate" value={form.manufacturingDate}
                    onChange={handleChange} required className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Expiry Date</label>
                  <input
                    type="date" name="expiryDate" value={form.expiryDate}
                    onChange={handleChange} required className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Category</label>
                  <select name="categoryId" value={form.categoryId} onChange={handleChange} className={inputClass}>
                    <option value="">None</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Supplier</label>
                  <select name="supplierId" value={form.supplierId} onChange={handleChange} className={inputClass}>
                    <option value="">None</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-slate-800/70">
              <button
                type="button" onClick={onClose}
                className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all"
              >
                Cancel
              </button>
              <button
                form="medicine-form" type="submit"
                disabled={loading}
                onClick={handleSubmit}
                className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isEdit ? 'Save Changes' : 'Add Medicine'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MedicineModal;
