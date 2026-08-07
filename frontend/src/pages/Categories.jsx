import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ConfirmDialog from '../components/ConfirmDialog';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import {
  Tag, Plus, Edit2, Trash2, X, Loader2, RefreshCw, AlertTriangle
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const CategoryFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
      setDescription(initialData?.description || '');
      setError('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Name is required'); return; }
    setLoading(true);
    setError('');
    try {
      await onSubmit({ name: name.trim(), description: description.trim() });
      onClose();
    } catch (err) {
      const data = err.response?.data;
      const errorMsg = typeof data === 'string' ? data : (data?.message || err.message || 'An error occurred');
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

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
            className="glass-card rounded-2xl w-full max-w-sm border border-slate-700/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/70">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/15 flex items-center justify-center border border-indigo-500/25">
                  <Tag className="w-4 h-4 text-indigo-400" />
                </div>
                <h2 className="font-bold text-slate-100">{initialData ? 'Edit Category' : 'New Category'}</h2>
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
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Antibiotics"
                  className="glass-input w-full px-3 py-2.5 rounded-xl text-sm outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description..."
                  rows={3} className="glass-input w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none" />
              </div>
            </form>

            <div className="flex gap-3 px-6 py-4 border-t border-slate-800/70">
              <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {initialData ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Categories = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'ADMIN';

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formModal, setFormModal] = useState({ open: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch { setCategories([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (data) => {
    if (formModal.data) {
      await updateCategory(formModal.data.id, data);
    } else {
      await createCategory(data);
    }
    fetchCategories();
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(deleteDialog.id);
      setDeleteDialog(null);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data || 'Delete failed');
      setDeleteDialog(null);
    }
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center border border-indigo-500/25">
                <Tag className="w-5 h-5 text-indigo-400" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">Categories</h1>
            </div>
            <p className="text-sm text-slate-400 ml-12">{categories.length} categor{categories.length !== 1 ? 'ies' : 'y'} configured</p>
          </div>
          {isAdmin && (
            <button onClick={() => setFormModal({ open: true, data: null })}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-sm font-semibold shadow-lg transition-all">
              <Plus className="w-4 h-4" />
              New Category
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
        ) : categories.length === 0 ? (
          <div className="glass-card rounded-2xl border border-slate-800/60 p-16 text-center">
            <Tag className="w-10 h-10 mx-auto mb-3 text-slate-600" />
            <p className="text-slate-500">No categories yet</p>
            {isAdmin && (
              <button onClick={() => setFormModal({ open: true, data: null })}
                className="mt-3 text-indigo-400 text-xs hover:text-indigo-300">
                + Create your first category
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/inventory?category=${cat.id}`)}
                className="glass-card rounded-2xl p-5 border border-slate-800/60 hover:border-indigo-500/20 transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
                      <h3 className="font-bold text-slate-200 truncate">{cat.name}</h3>
                    </div>
                    <p className="text-xs text-slate-500 ml-4">
                      {cat.description || <span className="italic text-slate-600">No description</span>}
                    </p>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); setFormModal({ open: true, data: cat }); }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 transition-all">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteDialog(cat); }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <CategoryFormModal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, data: null })}
        onSubmit={handleSubmit}
        initialData={formModal.data}
      />
      <ConfirmDialog
        isOpen={!!deleteDialog}
        title="Delete Category"
        message={`Delete category "${deleteDialog?.name}"? Medicines in this category will lose their association.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog(null)}
      />
    </Layout>
  );
};

export default Categories;
