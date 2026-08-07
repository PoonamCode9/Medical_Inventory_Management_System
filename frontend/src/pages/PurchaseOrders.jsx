import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  getPurchaseOrders, createPurchaseOrder, updatePurchaseOrderStatus, deletePurchaseOrder, getSuppliers
} from '../services/api';
import {
  ShoppingCart, Plus, Edit2, Trash2, X, Loader2, CheckCircle2,
  Clock, XCircle, Truck, RefreshCw, ChevronLeft, ChevronRight
} from 'lucide-react';

/* ── Status Badge Component ───────────────────────────────────── */
const StatusBadge = ({ status }) => {
  switch (status) {
    case 'RECEIVED':
      return <span className="badge text-emerald-400 bg-emerald-500/10 border-emerald-500/25"><CheckCircle2 className="w-3 h-3 mr-1" /> Received</span>;
    case 'PENDING':
      return <span className="badge text-amber-400 bg-amber-500/10 border-amber-500/25"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
    case 'CANCELLED':
      return <span className="badge text-rose-400 bg-rose-500/10 border-rose-500/25"><XCircle className="w-3 h-3 mr-1" /> Cancelled</span>;
    default:
      return null;
  }
};

/* ── Create PO Modal ──────────────────────────────────────────── */
const CreatePOModal = ({ isOpen, onClose, onSubmit, suppliers }) => {
  const [supplierId, setSupplierId] = useState('');
  const [items, setItems] = useState([{ medicineName: '', quantity: 1, unitPrice: 0 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSupplierId(suppliers.length > 0 ? suppliers[0].id : '');
      setItems([{ medicineName: '', quantity: 1, unitPrice: 0 }]);
      setError('');
    }
  }, [isOpen, suppliers]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { medicineName: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supplierId) { setError('Please select a supplier'); return; }
    if (items.some(i => !i.medicineName.trim())) { setError('All items must have a medicine name'); return; }
    
    setLoading(true);
    setError('');
    try {
      await onSubmit({ supplierId: parseInt(supplierId), items });
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
            className="glass-card rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-700/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/70">
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Create Purchase Order</h2>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form id="po-form" onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <div>
                  <label className={labelClass}>Supplier</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Truck className="w-4 h-4" /></span>
                    <select
                      value={supplierId}
                      onChange={(e) => setSupplierId(e.target.value)}
                      className={`${inputClass} pl-10`}
                      required
                    >
                      <option value="" disabled>Select a Supplier</option>
                      {suppliers.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className={labelClass}>Order Items</label>
                    <button type="button" onClick={addItem} className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 bg-sky-500/10 px-2 py-1 rounded-lg">
                      <Plus className="w-3 h-3" /> Add Item
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Medicine Name"
                            value={item.medicineName}
                            onChange={(e) => handleItemChange(idx, 'medicineName', e.target.value)}
                            className={inputClass}
                            required
                          />
                        </div>
                        <div className="w-24">
                          <input
                            type="number"
                            min="1"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 0)}
                            className={inputClass}
                            required
                          />
                        </div>
                        <div className="w-32">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Unit Price"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className={inputClass}
                            required
                          />
                        </div>
                        {items.length > 1 && (
                          <button type="button" onClick={() => removeItem(idx)} className="mt-2.5 text-rose-400 hover:text-rose-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-right text-sm font-bold text-sky-400">
                    Total: ${items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2)}
                  </div>
                </div>
              </form>
            </div>

            <div className="p-4 border-t border-slate-800/70 bg-slate-900/50 flex justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-300 hover:bg-slate-800/80 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                form="po-form"
                type="submit"
                disabled={loading}
                className="btn-primary px-5 py-2 text-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Order'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ── Main Page ────────────────────────────────────────────────── */
const PurchaseOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [addModal, setAddModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  const canWrite = ['ADMIN', 'PHARMACIST'].includes(user?.role);
  const canDelete = user?.role === 'ADMIN';

  const loadData = async (pageNum = 0) => {
    setLoading(true);
    try {
      const [ordersRes, suppRes] = await Promise.all([
        getPurchaseOrders(pageNum, 10),
        getSuppliers()
      ]);
      setOrders(ordersRes.data.content || []);
      setTotalPages(ordersRes.data.totalPages || 0);
      setSuppliers(suppRes.data || []);
      setPage(pageNum);
    } catch (err) {
      console.error('Failed to load purchase orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(0); }, []);

  const handleCreate = async (data) => {
    await createPurchaseOrder(data);
    loadData(0);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updatePurchaseOrderStatus(id, newStatus);
      loadData(page);
    } catch (err) {
      alert(err.response?.data || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePurchaseOrder(deleteId);
      setDeleteId(null);
      loadData(page);
    } catch (err) {
      alert(err.response?.data || 'Failed to delete order');
      setDeleteId(null);
    }
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8 max-w-screen-xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>Purchase Orders</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Manage supplier orders and restock inventory.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => loadData(page)} className="btn-ghost p-2.5 rounded-xl text-slate-400 hover:text-white" title="Refresh">
              <RefreshCw className="w-5 h-5" />
            </button>
            {canWrite && (
              <button onClick={() => setAddModal(true)} className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" /> New Order
              </button>
            )}
          </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-xs uppercase tracking-wider text-slate-400 bg-slate-900/50 border-b border-slate-800/70">
                <tr>
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Supplier</th>
                  <th className="px-6 py-4 font-semibold">Items</th>
                  <th className="px-6 py-4 font-semibold text-right">Total</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-6 py-4"><div className="h-4 bg-slate-800/50 rounded animate-pulse w-3/4" /></td>
                      ))}
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                      <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-20" />
                      <p>No purchase orders found.</p>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium">#{order.id}</td>
                      <td className="px-6 py-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-indigo-400" />
                        {order.supplierName}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {order.items?.length || 0} items
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-sky-400">
                        ${order.totalAmount?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {canWrite && order.status === 'PENDING' && (
                            <>
                              <button onClick={() => handleStatusChange(order.id, 'RECEIVED')} className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors" title="Mark Received">
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleStatusChange(order.id, 'CANCELLED')} className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors" title="Cancel Order">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {canDelete && order.status !== 'RECEIVED' && (
                            <button onClick={() => setDeleteId(order.id)} className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800/70 bg-slate-900/30">
              <span className="text-xs text-slate-400">Page {page + 1} of {totalPages}</span>
              <div className="flex gap-1">
                <button
                  disabled={page === 0}
                  onClick={() => loadData(page - 1)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page === totalPages - 1}
                  onClick={() => loadData(page + 1)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreatePOModal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        onSubmit={handleCreate}
        suppliers={suppliers}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Purchase Order"
        message="Are you sure you want to delete this purchase order? This action cannot be undone."
      />
    </Layout>
  );
};

export default PurchaseOrders;
