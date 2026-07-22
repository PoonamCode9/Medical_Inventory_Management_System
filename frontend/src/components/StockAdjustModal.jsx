import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const StockAdjustModal = ({ isOpen, onClose, onSubmit, medicine }) => {
  const [movementType, setMovementType] = useState('IN');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMovementType('IN');
      setQuantity('');
      setReason('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quantity || parseInt(quantity, 10) < 1) {
      setError('Quantity must be at least 1');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSubmit({
        medicineId: medicine.id,
        movementType,
        quantity: parseInt(quantity, 10),
        reason: reason || null,
      });
      onClose();
    } catch (err) {
      const data = err.response?.data;
      const errorMsg = typeof data === 'string' ? data : (data?.message || err.message || 'Failed to adjust stock');
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && medicine && (
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
            className="glass-card rounded-2xl w-full max-w-sm border border-slate-700/60"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/70">
              <div>
                <h2 className="font-bold text-slate-100 text-base">Adjust Stock</h2>
                <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[220px]">{medicine.name}</p>
              </div>
              <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {error && (
                <div className="text-red-400 bg-red-950/20 border border-red-500/30 p-3 rounded-xl text-xs">
                  {error}
                </div>
              )}

              {/* Current stock badge */}
              <div className="flex items-center justify-between bg-slate-900/50 rounded-xl px-4 py-3 border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Current Stock</span>
                <span className={`text-lg font-extrabold ${medicine.quantity <= 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {medicine.quantity} units
                </span>
              </div>

              {/* Movement type toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Movement Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['IN', 'OUT'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setMovementType(type)}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                        movementType === type
                          ? type === 'IN'
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                            : 'bg-red-500/15 border-red-500/40 text-red-400'
                          : 'border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {type === 'IN'
                        ? <ArrowUpCircle className="w-4 h-4" />
                        : <ArrowDownCircle className="w-4 h-4" />
                      }
                      Stock {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  min="1"
                  required
                  className="glass-input w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Reason <span className="text-slate-600 normal-case font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. New shipment received"
                  className="glass-input w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                />
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
                onClick={handleSubmit}
                disabled={loading}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 ${
                  movementType === 'IN'
                    ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                }`}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Confirm {movementType}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StockAdjustModal;
