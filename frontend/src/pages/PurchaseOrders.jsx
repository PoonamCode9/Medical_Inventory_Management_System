import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  getPurchaseOrders, createPurchaseOrder, updatePurchaseOrderStatus,
  deletePurchaseOrder, getSuppliers,
} from '../services/api';
import {
  ShoppingCart, Plus, Trash2, X, Loader2, CheckCircle2,
  Clock, XCircle, Truck, RefreshCw, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, Package, DollarSign,
  AlertCircle, Hash, Search, Filter,
} from 'lucide-react';

/* ── helpers ──────────────────────────────────────────────────── */
function formatCurrency(val) {
  if (val == null) return '—';
  if (val >= 1_000_000) return `₹${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000)     return `₹${(val / 1_000).toFixed(1)}K`;
  return `₹${val.toFixed(2)}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/* ── STATUS CONFIG ────────────────────────────────────────────── */
const STATUS = {
  PENDING: {
    label: 'Pending',
    icon: Clock,
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
    dot: 'bg-amber-400',
    glow: 'rgba(245,158,11,0.15)',
    bar: '#f59e0b',
  },
  RECEIVED: {
    label: 'Received',
    icon: CheckCircle2,
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/25',
    dot: 'bg-emerald-400',
    glow: 'rgba(52,211,153,0.12)',
    bar: '#34d399',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: XCircle,
    text: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/25',
    dot: 'bg-rose-400',
    glow: 'rgba(251,113,133,0.12)',
    bar: '#fb7185',
  },
};

const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.PENDING;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${s.text} ${s.bg} ${s.border}`}>
      <Icon className="w-3 h-3" />
      {s.label}
    </span>
  );
};

/* ── STAT CARD ────────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, value, label, sublabel, color, glow, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35 }}
    className="glass-card rounded-2xl p-5 relative overflow-hidden"
    style={{ border: '1px solid var(--border-subtle)' }}
  >
    <div className="absolute inset-0 pointer-events-none"
      style={{ background: `radial-gradient(circle at top right, ${glow}, transparent 65%)` }} />
    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${color}`}>
      <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
    </div>
    <p className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
      {value ?? '—'}
    </p>
    <p className="text-[13px] font-semibold mt-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
    {sublabel && <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{sublabel}</p>}
  </motion.div>
);

/* ── TABS ─────────────────────────────────────────────────────── */
const TABS = [
  { key: 'ALL',       label: 'All Orders' },
  { key: 'PENDING',   label: 'Pending' },
  { key: 'RECEIVED',  label: 'Received' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

/* ── CREATE PO MODAL ──────────────────────────────────────────── */
const CreatePOModal = ({ isOpen, onClose, onSubmit, suppliers }) => {
  const [supplierId, setSupplierId] = useState('');
  const [items, setItems] = useState([{ medicineName: '', quantity: 1, unitPrice: 0 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSupplierId(suppliers.length > 0 ? String(suppliers[0].id) : '');
      setItems([{ medicineName: '', quantity: 1, unitPrice: 0 }]);
      setError('');
    }
  }, [isOpen, suppliers]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem    = () => setItems([...items, { medicineName: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));

  const total = items.reduce((s, item) => s + (item.quantity * item.unitPrice), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supplierId) { setError('Please select a supplier'); return; }
    if (items.some((i) => !i.medicineName.trim())) { setError('All items must have a medicine name'); return; }
    setLoading(true);
    setError('');
    try {
      await onSubmit({ supplierId: parseInt(supplierId), items });
      onClose();
    } catch (err) {
      const data = err.response?.data;
      setError(typeof data === 'string' ? data : (data?.message || err.message || 'An error occurred'));
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
          style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ duration: 0.22 }}
            className="glass-card rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
            style={{ border: '1px solid var(--border-default)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>Create Purchase Order</h2>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Add a new order for stock replenishment</p>
                </div>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <form id="po-form" onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="flex items-center gap-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                {/* Supplier select */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: 'var(--text-muted)' }}>Supplier</label>
                  <div className="relative">
                    <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <select
                      value={supplierId}
                      onChange={(e) => setSupplierId(e.target.value)}
                      className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
                      required
                    >
                      <option value="" disabled>Select a Supplier</option>
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}>Order Items</label>
                    <button type="button" onClick={addItem}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
                      style={{ color: '#38bdf8', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(56,189,248,0.15)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(56,189,248,0.08)'; }}
                    >
                      <Plus className="w-3 h-3" /> Add Item
                    </button>
                  </div>

                  {/* Column headers */}
                  <div className="grid grid-cols-[1fr_80px_100px_32px] gap-2 px-1 mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Medicine</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-center" style={{ color: 'var(--text-muted)' }}>Qty</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-center" style={{ color: 'var(--text-muted)' }}>Unit Price (₹)</span>
                    <span />
                  </div>

                  <div className="space-y-2">
                    {items.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-[1fr_80px_100px_32px] gap-2 items-center p-3 rounded-xl"
                        style={{ background: 'var(--border-subtle)', border: '1px solid var(--border-default)' }}
                      >
                        <input
                          type="text"
                          placeholder="Medicine name…"
                          value={item.medicineName}
                          onChange={(e) => handleItemChange(idx, 'medicineName', e.target.value)}
                          className="glass-input w-full px-3 py-2 rounded-lg text-sm outline-none"
                          required
                        />
                        <input
                          type="number" min="1"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 1)}
                          className="glass-input w-full px-2 py-2 rounded-lg text-sm text-center outline-none"
                          required
                        />
                        <input
                          type="number" min="0" step="0.01"
                          placeholder="0.00"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="glass-input w-full px-2 py-2 rounded-lg text-sm text-center outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          disabled={items.length === 1}
                          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-20"
                          style={{ color: 'var(--text-muted)' }}
                          onMouseEnter={(e) => { if (items.length > 1) { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; } }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Running total */}
                  <div className="flex items-center justify-between mt-4 pt-3"
                    style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {items.length} item{items.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-sm font-bold" style={{ color: '#38bdf8' }}>
                      Total: ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 rounded-b-2xl"
              style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--border-subtle)' }}>
              <button type="button" onClick={onClose} disabled={loading} className="btn-ghost px-4 py-2 text-sm">
                Cancel
              </button>
              <button form="po-form" type="submit" disabled={loading} className="btn-primary px-5 py-2 text-sm flex items-center gap-2">
                {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Creating…</> : <><Plus className="w-3.5 h-3.5" /> Create Order</>}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ── ORDER CARD ───────────────────────────────────────────────── */
const OrderCard = ({ order, canWrite, canDelete, onStatusChange, onDelete, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const s = STATUS[order.status] || STATUS.PENDING;
  const Icon = s.icon;

  const handleStatus = async (newStatus) => {
    setStatusLoading(true);
    await onStatusChange(order.id, newStatus);
    setStatusLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="glass-card rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        border: `1px solid var(--border-subtle)`,
        background: order.status === 'PENDING' ? `radial-gradient(circle at top right, ${s.glow}, transparent 60%)` : undefined,
      }}
    >
      {/* Top accent bar */}
      <div className="h-0.5 w-full" style={{ background: s.bar, opacity: 0.6 }} />

      {/* Main row */}
      <div className="flex items-center gap-4 px-5 py-4">

        {/* Order ID */}
        <div className="flex-shrink-0 text-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-[11px]"
            style={{ background: 'var(--border-subtle)', color: 'var(--text-muted)', border: '1px solid var(--border-default)' }}>
            #{order.id}
          </div>
        </div>

        {/* Supplier + Date */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#818cf8' }} />
            <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
              {order.supplierName || '—'}
            </p>
          </div>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {formatDate(order.orderDate)} · {timeAgo(order.orderDate)}
          </p>
        </div>

        {/* Items count */}
        <div className="flex-shrink-0 text-center hidden sm:block">
          <p className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>
            {order.items?.length ?? 0}
          </p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>items</p>
        </div>

        {/* Amount */}
        <div className="flex-shrink-0 text-right hidden md:block">
          <p className="text-base font-extrabold" style={{ color: '#38bdf8' }}>
            ₹{order.totalAmount?.toFixed(2) ?? '0.00'}
          </p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>total</p>
        </div>

        {/* Status badge */}
        <div className="flex-shrink-0">
          <StatusBadge status={order.status} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {canWrite && order.status === 'PENDING' && (
            <>
              <button
                onClick={() => handleStatus('RECEIVED')}
                disabled={statusLoading}
                title="Mark as Received"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                style={{ color: '#34d399', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(52,211,153,0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(52,211,153,0.08)'; }}
              >
                {statusLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                <span className="hidden lg:inline">Receive</span>
              </button>
              <button
                onClick={() => handleStatus('CANCELLED')}
                disabled={statusLoading}
                title="Cancel Order"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                style={{ color: '#fb7185', background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.2)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(251,113,133,0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(251,113,133,0.08)'; }}
              >
                <XCircle className="w-3 h-3" />
                <span className="hidden lg:inline">Cancel</span>
              </button>
            </>
          )}
          {canDelete && order.status !== 'RECEIVED' && (
            <button
              onClick={() => onDelete(order.id)}
              title="Delete"
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Expand toggle */}
          {(order.items?.length ?? 0) > 0 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--border-subtle)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Expanded line items */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ borderTop: '1px solid var(--border-subtle)', overflow: 'hidden' }}
          >
            <div className="px-5 py-3" style={{ background: 'var(--border-subtle)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-3"
                style={{ color: 'var(--text-muted)' }}>Line Items</p>
              <div className="space-y-2">
                {order.items?.map((item, i) => (
                  <motion.div
                    key={item.id ?? i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
                  >
                    <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)' }}>
                      <Package className="w-3 h-3 text-sky-400" />
                    </div>
                    <p className="flex-1 text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {item.medicineName}
                    </p>
                    <span className="text-xs px-2 py-0.5 rounded-lg flex-shrink-0"
                      style={{ background: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                      ×{item.quantity}
                    </span>
                    <span className="text-xs font-semibold flex-shrink-0" style={{ color: '#38bdf8' }}>
                      ₹{item.unitPrice?.toFixed(2) ?? '0.00'}
                    </span>
                    <span className="text-xs font-bold flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
                      = ₹{((item.quantity ?? 0) * (item.unitPrice ?? 0)).toFixed(2)}
                    </span>
                  </motion.div>
                ))}
              </div>
              {/* Item total */}
              <div className="flex justify-end mt-3 pt-2" style={{ borderTop: '1px solid var(--border-default)' }}>
                <span className="text-sm font-bold" style={{ color: '#38bdf8' }}>
                  Order Total: ₹{order.totalAmount?.toFixed(2) ?? '0.00'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ── MAIN PAGE ────────────────────────────────────────────────── */
const PurchaseOrders = () => {
  const { user } = useAuth();

  const [orders,      setOrders]      = useState([]);
  const [suppliers,   setSuppliers]   = useState([]);
  const [page,        setPage]        = useState(0);
  const [totalPages,  setTotalPages]  = useState(0);
  const [totalItems,  setTotalItems]  = useState(0);
  const [loading,     setLoading]     = useState(true);
  const [activeTab,   setActiveTab]   = useState('ALL');
  const [addModal,    setAddModal]    = useState(false);
  const [deleteId,    setDeleteId]    = useState(null);
  const [searchQuery,     setSearchQuery]     = useState('');
  const [supplierFilter,  setSupplierFilter]  = useState('ALL');

  const canWrite  = ['ADMIN', 'PHARMACIST'].includes(user?.role);
  const canDelete = user?.role === 'ADMIN';

  const loadData = useCallback(async (pageNum = 0) => {
    setLoading(true);
    try {
      const [ordersRes, suppRes] = await Promise.all([
        getPurchaseOrders(pageNum, 10),
        getSuppliers(),
      ]);
      setOrders(ordersRes.data.content || []);
      setTotalPages(ordersRes.data.totalPages || 0);
      setTotalItems(ordersRes.data.totalElements || 0);
      setSuppliers(suppRes.data || []);
      setPage(pageNum);
    } catch (err) {
      console.error('Failed to load purchase orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(0); }, [loadData]);

  /* ── Derived stats ──────────────────────────────────────────── */
  const allOrders = orders;
  const pending    = allOrders.filter((o) => o.status === 'PENDING').length;
  const received   = allOrders.filter((o) => o.status === 'RECEIVED').length;
  const totalSpend = allOrders.filter((o) => o.status === 'RECEIVED')
    .reduce((s, o) => s + (o.totalAmount ?? 0), 0);

  const q = searchQuery.trim().toLowerCase();

  const filtered = allOrders.filter((o) => {
    const matchesTab      = activeTab === 'ALL' || o.status === activeTab;
    const matchesSupplier = supplierFilter === 'ALL' || String(o.supplierId) === supplierFilter;
    const matchesSearch   = !q
      || String(o.id).includes(q)
      || (o.supplierName || '').toLowerCase().includes(q)
      || (o.items || []).some((item) => (item.medicineName || '').toLowerCase().includes(q));
    return matchesTab && matchesSupplier && matchesSearch;
  });

  /* ── Handlers ───────────────────────────────────────────────── */
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

  const tabCount = (key) => {
    // Count against supplier+search filtered set only
    const base = allOrders.filter((o) => {
      const matchesSupplier = supplierFilter === 'ALL' || String(o.supplierId) === supplierFilter;
      const matchesSearch   = !q
        || String(o.id).includes(q)
        || (o.supplierName || '').toLowerCase().includes(q)
        || (o.items || []).some((item) => (item.medicineName || '').toLowerCase().includes(q));
      return matchesSupplier && matchesSearch;
    });
    if (key === 'ALL') return base.length;
    return base.filter((o) => o.status === key).length;
  };

  const hasFilters = searchQuery.trim() || supplierFilter !== 'ALL';

  const clearFilters = () => {
    setSearchQuery('');
    setSupplierFilter('ALL');
    setActiveTab('ALL');
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8 max-w-screen-xl mx-auto">

        {/* ── Header ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Purchase Orders
              </h1>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {loading ? 'Loading…' : `${totalItems} total orders`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadData(page)}
              className="btn-ghost p-2.5 rounded-xl"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </button>
            {canWrite && (
              <button
                onClick={() => setAddModal(true)}
                className="btn-primary px-4 py-2.5 text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Order
              </button>
            )}
          </div>
        </motion.div>

        {/* ── Stat Cards ────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Hash}
            value={loading ? '…' : totalItems}
            label="Total Orders"
            sublabel="All time"
            color="bg-sky-500/10 border-sky-500/20 text-sky-400"
            glow="rgba(14,165,233,0.15)"
            delay={0}
          />
          <StatCard
            icon={Clock}
            value={loading ? '…' : pending}
            label="Pending"
            sublabel="Awaiting receipt"
            color="bg-amber-500/10 border-amber-500/20 text-amber-400"
            glow="rgba(245,158,11,0.15)"
            delay={0.06}
          />
          <StatCard
            icon={CheckCircle2}
            value={loading ? '…' : received}
            label="Received"
            sublabel="This page"
            color="bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            glow="rgba(52,211,153,0.15)"
            delay={0.12}
          />
          <StatCard
            icon={DollarSign}
            value={loading ? '…' : formatCurrency(totalSpend)}
            label="Total Spend"
            sublabel="Received orders"
            color="bg-purple-500/10 border-purple-500/20 text-purple-400"
            glow="rgba(168,85,247,0.15)"
            delay={0.18}
          />
        </div>

        {/* ── Search & Supplier Filter Bar ──────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-4"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by order ID, supplier or medicine…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Supplier filter */}
          <div className="relative sm:w-56">
            <Truck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: 'var(--text-muted)' }} />
            <select
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none appearance-none"
            >
              <option value="ALL">All Suppliers</option>
              {suppliers.map((s) => (
                <option key={s.id} value={String(s.id)}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Clear filters chip */}
          {hasFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold flex-shrink-0 transition-all"
              style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
            >
              <X className="w-3 h-3" />
              Clear filters
            </motion.button>
          )}
        </motion.div>

        {/* ── Status Filter Tabs ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="flex items-center gap-1 mb-5 p-1 rounded-2xl overflow-x-auto"
          style={{ background: 'var(--border-subtle)', border: '1px solid var(--border-default)' }}
        >
          {TABS.map((tab) => {
            const count    = tabCount(tab.key);
            const isActive = activeTab === tab.key;
            const s        = STATUS[tab.key];
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12.5px] font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
                style={{
                  background: isActive ? 'var(--bg-elevated)' : 'transparent',
                  color: isActive ? (s ? s.bar : 'var(--text-primary)') : 'var(--text-muted)',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  border: isActive ? '1px solid var(--border-default)' : '1px solid transparent',
                }}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className="min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
                    style={{
                      background: isActive && s ? `${s.bar}22` : 'var(--border-default)',
                      color: isActive && s ? s.bar : 'var(--text-muted)',
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* ── Order List ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.16 }}
          className="space-y-3"
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 animate-pulse"
                style={{ border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: 'var(--border-subtle)' }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-1/3 rounded-lg" style={{ background: 'var(--border-subtle)' }} />
                    <div className="h-3 w-1/5 rounded-lg" style={{ background: 'var(--border-subtle)' }} />
                  </div>
                  <div className="h-6 w-20 rounded-full" style={{ background: 'var(--border-subtle)' }} />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl flex flex-col items-center justify-center py-20 gap-4"
              style={{ border: '1px solid var(--border-subtle)' }}
            >
              <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                <ShoppingCart className="w-7 h-7 text-sky-400" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {activeTab === 'ALL' ? 'No purchase orders yet' : `No ${activeTab.toLowerCase()} orders`}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {activeTab === 'ALL' && canWrite ? 'Click "New Order" to get started.' : 'Check back later.'}
                </p>
              </div>
              {activeTab === 'ALL' && canWrite && (
                <button
                  onClick={() => setAddModal(true)}
                  className="btn-primary px-4 py-2 text-sm flex items-center gap-2 mt-2"
                >
                  <Plus className="w-4 h-4" /> Create First Order
                </button>
              )}
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {filtered.map((order, i) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  index={i}
                  canWrite={canWrite}
                  canDelete={canDelete}
                  onStatusChange={handleStatusChange}
                  onDelete={setDeleteId}
                />
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {/* ── Pagination ────────────────────────────────────── */}
        {!loading && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mt-6 px-2"
          >
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Page {page + 1} of {totalPages} · {totalItems} orders
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 0}
                onClick={() => loadData(page - 1)}
                className="btn-ghost p-2 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
                return (
                  <button key={p} onClick={() => loadData(p)}
                    className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all ${
                      p === page
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : 'btn-ghost p-0'
                    }`}>
                    {p + 1}
                  </button>
                );
              })}
              <button
                disabled={page === totalPages - 1}
                onClick={() => loadData(page + 1)}
                className="btn-ghost p-2 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

      </div>

      {/* ── Modals ──────────────────────────────────────────── */}
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
        message="Are you sure you want to permanently delete this purchase order? This action cannot be undone."
      />
    </Layout>
  );
};

export default PurchaseOrders;
