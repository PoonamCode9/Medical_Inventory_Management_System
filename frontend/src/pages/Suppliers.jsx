import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import ConfirmDialog from '../components/ConfirmDialog';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../services/api';
import {
  Truck, Plus, Edit2, Trash2, X, Loader2, RefreshCw, AlertTriangle,
  Phone, Mail, MapPin
} from 'lucide-react';

const SupplierFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [form, setForm] = useState({ name: '', contactNumber: '', email: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: initialData?.name || '',
        contactNumber: initialData?.contactNumber || '',
        email: initialData?.email || '',
        address: initialData?.address || '',
      });
      setError('');
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSubmit(form);
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
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.2 }}
            className="glass-card rounded-2xl w-full max-w-md border border-slate-700/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/70">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center border border-emerald-500/25">
                  <Truck className="w-4 h-4 text-emerald-400" />
                </div>
                <h2 className="font-bold text-slate-100">{initialData ? 'Edit Supplier' : 'New Supplier'}</h2>
              </div>
              <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {error && (
                <div className="text-red-400 bg-red-950/20 border border-red-500/30 p-3 rounded-xl text-xs">{error}</div>
              )}
              <div>
                <label className={labelClass}>Supplier Name *</label>
                <input name="name" value={form.name} onChange={handleChange}
                  placeholder="e.g. MediPharm Ltd." required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Contact Number *</label>
                <input name="contactNumber" value={form.contactNumber} onChange={handleChange}
                  placeholder="+91 9876543210" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="contact@supplier.com" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Address *</label>
                <textarea name="address" value={form.address} onChange={handleChange}
                  placeholder="123, Industrial Area, City, State" rows={2}
                  required className={`${inputClass} resize-none`} />
              </div>
            </form>

            <div className="flex gap-3 px-6 py-4 border-t border-slate-800/70">
              <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {initialData ? 'Save Changes' : 'Add Supplier'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Suppliers = () => {
  const { user } = useAuth();
  const canWrite = user?.role === 'ADMIN' || user?.role === 'PHARMACIST';
  const canDelete = user?.role === 'ADMIN';

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formModal, setFormModal] = useState({ open: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [error, setError] = useState('');

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await getSuppliers();
      setSuppliers(res.data);
    } catch { setSuppliers([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const handleSubmit = async (data) => {
    if (formModal.data) {
      await updateSupplier(formModal.data.id, data);
    } else {
      await createSupplier(data);
    }
    fetchSuppliers();
  };

  const handleDelete = async () => {
    try {
      await deleteSupplier(deleteDialog.id);
      setDeleteDialog(null);
      fetchSuppliers();
    } catch (err) {
      setError(err.response?.data || 'Delete failed');
      setDeleteDialog(null);
    }
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center border border-emerald-500/25">
                <Truck className="w-5 h-5 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">Suppliers</h1>
            </div>
            <p className="text-sm text-slate-400 ml-12">{suppliers.length} supplier{suppliers.length !== 1 ? 's' : ''} registered</p>
          </div>
          {canWrite && (
            <button onClick={() => setFormModal({ open: true, data: null })}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-sm font-semibold shadow-lg transition-all">
              <Plus className="w-4 h-4" />
              Add Supplier
            </button>
          )}
        </motion.div>

        {error && (
          <div className="mb-4 text-red-400 bg-red-950/20 border border-red-500/30 p-3 rounded-xl text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
            <button onClick={() => setError('')} className="ml-auto text-xs text-slate-500 hover:text-slate-300">Dismiss</button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-500 gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> Loading...
          </div>
        ) : suppliers.length === 0 ? (
          <div className="glass-card rounded-2xl border border-slate-800/60 p-16 text-center">
            <Truck className="w-10 h-10 mx-auto mb-3 text-slate-600" />
            <p className="text-slate-500">No suppliers yet</p>
            {canWrite && (
              <button onClick={() => setFormModal({ open: true, data: null })}
                className="mt-3 text-emerald-400 text-xs hover:text-emerald-300">
                + Register first supplier
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suppliers.map((sup, i) => (
              <motion.div key={sup.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl p-5 border border-slate-800/60 hover:border-emerald-500/20 transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
                      <Truck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h3 className="font-bold text-slate-200">{sup.name}</h3>
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    {canWrite && (
                      <button onClick={() => setFormModal({ open: true, data: sup })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 transition-all">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {canDelete && (
                      <button onClick={() => setDeleteDialog(sup)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 ml-10">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Phone className="w-3 h-3 text-slate-600 flex-shrink-0" />
                    {sup.contactNumber}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Mail className="w-3 h-3 text-slate-600 flex-shrink-0" />
                    {sup.email}
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-400">
                    <MapPin className="w-3 h-3 text-slate-600 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{sup.address}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <SupplierFormModal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, data: null })}
        onSubmit={handleSubmit}
        initialData={formModal.data}
      />
      <ConfirmDialog
        isOpen={!!deleteDialog}
        title="Delete Supplier"
        message={`Delete supplier "${deleteDialog?.name}"? Medicines linked to this supplier will lose their association.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog(null)}
      />
    </Layout>
  );
};

export default Suppliers;
