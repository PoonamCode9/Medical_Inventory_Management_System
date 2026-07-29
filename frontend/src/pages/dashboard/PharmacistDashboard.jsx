import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { NotificationContext } from '../../context/NotificationContext';

export default function PharmacistDashboard() {
  const { triggerToast } = useContext(NotificationContext);
  const [loading, setLoading] = useState(true);

  // States
  const [availableCount, setAvailableCount] = useState(0);
  const [todaysInventory, setTodaysInventory] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [goodStockCount, setGoodStockCount] = useState(0);
  const [expiringSoonCount, setExpiringSoonCount] = useState(0);

  const [categoryMetrics, setCategoryMetrics] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  // Counter commands modal
  const [activeAction, setActiveAction] = useState(null);
  const [formQty, setFormQty] = useState('');
  const [formMedId, setFormMedId] = useState('');

  const fetchPharmacistData = async () => {
    setLoading(true);
    try {
      const [summaryRes, medsRes, logsRes, lowStockRes] = await Promise.all([
        api.get('/api/dashboard/summary'),
        api.get('/api/medicines').catch(() => null),
        api.get('/api/inventory/logs').catch(() => null),
        api.get('/api/inventory/low-stock').catch(() => null)
      ]);

      if (summaryRes.data && summaryRes.data.success) {
        const d = summaryRes.data.data;
        setAvailableCount(d.totalMedicines || 0);
        setLowStockCount(d.lowStock || 0);
        setOutOfStockCount(d.outOfStock || 0);
        setGoodStockCount(d.goodStock || 0);
        setExpiringSoonCount(d.expiringMedicines || 0);
        setCategoryMetrics(d.categoryMetrics || []);
      }

      if (medsRes && medsRes.data && Array.isArray(medsRes.data.data)) {
        setMedicines(medsRes.data.data);
        if (medsRes.data.data.length > 0) {
          setFormMedId(medsRes.data.data[0].medicineId.toString());
        }
        
        // Sum total quantities in stock
        const totalQty = medsRes.data.data.reduce((sum, item) => sum + (item.quantity || 0), 0);
        setTodaysInventory(totalQty);
      }

      if (logsRes && logsRes.data && Array.isArray(logsRes.data.data)) {
        const sorted = logsRes.data.data
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 5)
          .map(log => ({
            id: log.stockLogId,
            medicineName: log.medicine?.medicineName || 'Product',
            batch: log.medicine?.batchNumber || 'N/A',
            action: log.action,
            quantity: log.newQuantity - log.oldQuantity,
            user: log.user?.email || 'System',
            timestamp: log.updatedAt ? new Date(log.updatedAt).toLocaleTimeString() : 'Just now'
          }));
        setRecentLogs(sorted);
      }

      if (lowStockRes && lowStockRes.data && Array.isArray(lowStockRes.data.data)) {
        setLowStockItems(lowStockRes.data.data.slice(0, 5));
      }
    } catch (err) {
      console.error('Error loading pharmacist metrics:', err);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    fetchPharmacistData();
  }, []);

  useEffect(() => {
    const handleWriteSuccess = () => {
      fetchPharmacistData();
    };
    window.addEventListener('api-write-success', handleWriteSuccess);
    return () => {
      window.removeEventListener('api-write-success', handleWriteSuccess);
    };
  }, []);

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (!formQty || parseInt(formQty, 10) <= 0) {
      triggerToast('Please input a valid quantity.', 'WARNING');
      return;
    }

    const qtyVal = parseInt(formQty, 10);
    const medIdVal = parseInt(formMedId, 10);

    const endpoint = activeAction === 'RECEIVE' ? '/api/inventory/stock-in' : '/api/inventory/stock-out';
    const payload = {
      medicineId: medIdVal,
      quantity: qtyVal
    };

    try {
      const res = await api.post(endpoint, payload);
      if (res.data && res.data.success) {
        triggerToast(activeAction === 'RECEIVE' ? 'Stock received successfully.' : 'Stock issued successfully.', 'SUCCESS');
        setActiveAction(null);
        setFormQty('');
        fetchPharmacistData();
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Transaction rejected.', 'DANGER');
    }
  };

  const renderCategoryDistribution = () => {
    if (categoryMetrics.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center py-10 text-center h-full">
          <p className="text-xs text-gray-400 font-bold">No inventory metrics loaded.</p>
        </div>
      );
    }

    const maxVal = Math.max(...categoryMetrics.map(c => c.count), 1);

    return (
      <div className="space-y-3.5 w-full max-h-56 overflow-y-auto pr-1">
        {categoryMetrics.map((c) => {
          const pct = (c.count / maxVal) * 100;
          return (
            <div key={c.name} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-gray-700">
                <span>{c.name}</span>
                <span className="font-mono text-gray-400">{c.count} items</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#0F766E] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderStockLevelsGauge = () => {
    const total = goodStockCount + lowStockCount + outOfStockCount;
    if (total === 0) {
      return (
        <div className="flex flex-col justify-center items-center py-10 text-center h-full">
          <p className="text-xs text-gray-400 font-bold">No active stock lines mapped.</p>
        </div>
      );
    }

    const goodPct = (goodStockCount / total) * 100;
    const lowPct = (lowStockCount / total) * 100;
    const outPct = (outOfStockCount / total) * 100;

    return (
      <div className="space-y-5 w-full font-sans">
        <div className="flex w-full bg-slate-150 h-5 rounded-full overflow-hidden border border-slate-200 shadow-inner">
          {goodStockCount > 0 && (
            <div className="bg-teal-700 h-full flex items-center justify-center text-[9px] font-extrabold text-white" style={{ width: `${goodPct}%` }} title="Good Stock">
              {Math.round(goodPct)}%
            </div>
          )}
          {lowStockCount > 0 && (
            <div className="bg-amber-500 h-full flex items-center justify-center text-[9px] font-extrabold text-white" style={{ width: `${lowPct}%` }} title="Low Stock">
              {Math.round(lowPct)}%
            </div>
          )}
          {outOfStockCount > 0 && (
            <div className="bg-red-600 h-full flex items-center justify-center text-[9px] font-extrabold text-white" style={{ width: `${outPct}%` }} title="Out of Stock">
              {Math.round(outPct)}%
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-teal-50 border border-teal-150 p-2.5 rounded-[10px]">
            <span className="block text-[10px] font-bold text-teal-850 uppercase">Optimal</span>
            <span className="block text-base font-extrabold text-teal-700">{goodStockCount}</span>
          </div>
          <div className="bg-amber-50 border border-amber-150 p-2.5 rounded-[10px]">
            <span className="block text-[10px] font-bold text-amber-850 uppercase">Low Stock</span>
            <span className="block text-base font-extrabold text-amber-600">{lowStockCount}</span>
          </div>
          <div className="bg-red-50 border border-red-150 p-2.5 rounded-[10px]">
            <span className="block text-[10px] font-bold text-red-850 uppercase">Out / Zero</span>
            <span className="block text-base font-extrabold text-red-650">{outOfStockCount}</span>
          </div>
        </div>
      </div>
    );
  };

  const CardSkeleton = () => (
    <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col justify-between animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-2.5 bg-gray-100 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Pharmacist Dispensation & Inventory Console</h1>
          <p className="text-xs text-gray-500">Log dispensations, review local stock levels, and issue medicines.</p>
        </div>
        <button 
          onClick={fetchPharmacistData}
          className="py-1.5 px-3 border border-gray-300 hover:bg-slate-100 text-gray-700 text-xs font-bold rounded-card cursor-pointer flex items-center gap-1.5"
          title="Sync stats"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18" />
          </svg>
          Sync
        </button>
      </div>

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            {/* Available Medicines */}
            <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Available Medicines</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-2xl font-bold text-gray-800">{availableCount}</span>
              </div>
              <span className="text-[10px] text-gray-400 mt-1">Ready for pharmacy handout</span>
            </div>

            {/* Total Quantity */}
            <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Shelf Stock</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-2xl font-bold text-gray-800">{todaysInventory}</span>
              </div>
              <span className="text-[10px] text-gray-400 mt-1">Aggregated physical units</span>
            </div>

            {/* Low Stock */}
            <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col justify-between border-l-4 border-l-red-600">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Low Stock Warnings</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-2xl font-bold text-red-650">{lowStockCount}</span>
              </div>
              <span className="text-[10px] text-gray-400 mt-1">Below local buffer level</span>
            </div>

            {/* Expiring Soon */}
            <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col justify-between border-l-4 border-l-amber-500">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Near-Expiry Batches</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-2xl font-bold text-amber-600">{expiringSoonCount}</span>
              </div>
              <span className="text-[10px] text-gray-400 mt-1">FIFO Dispensation</span>
            </div>
          </>
        )}
      </div>

      {/* Row 2: Charts (Category & Status distribution) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
        <div className="bg-white border border-gray-200 p-5 rounded-[10px] shadow-sm flex flex-col justify-between min-h-[260px]">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Category Distribution</h3>
            {loading ? (
              <div className="h-6 bg-slate-100 rounded w-full animate-pulse"></div>
            ) : (
              renderCategoryDistribution()
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-[10px] shadow-sm flex flex-col justify-between min-h-[260px]">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Inventory Stock Gauge</h3>
            {loading ? (
              <div className="h-6 bg-slate-100 rounded w-full animate-pulse"></div>
            ) : (
              renderStockLevelsGauge()
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Counter Logs, Low Stock & Commands */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        {/* Table logs */}
        <div className="bg-white border border-gray-200 p-5 rounded-[10px] shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-4">Recent Pharmacy Counter Logs</h3>
            
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-gray-150 rounded w-full"></div>
                <div className="h-6 bg-gray-100 rounded w-full"></div>
              </div>
            ) : recentLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="pb-2">Medicine</th>
                      <th className="pb-2">Batch</th>
                      <th className="pb-2">Action</th>
                      <th className="pb-2">Qty Change</th>
                      <th className="pb-2 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {recentLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 font-bold text-gray-855">{log.medicineName}</td>
                        <td className="py-2.5 text-gray-500 font-mono text-[11px]">{log.batch}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded-[5px] text-[9px] font-bold ${
                            log.action === 'STOCK_IN' || log.action === 'CREATE' ? 'bg-green-50 text-green-755 border border-green-100' :
                            log.action === 'STOCK_OUT' ? 'bg-red-50 text-red-755 border border-red-100' : 'bg-slate-50 text-slate-700'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className={`py-2.5 font-bold ${log.quantity < 0 ? 'text-red-650' : 'text-green-650'}`}>
                          {log.quantity > 0 ? `+${log.quantity}` : log.quantity}
                        </td>
                        <td className="py-2.5 text-right text-gray-400 font-mono">{log.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center py-10 text-center">
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-full text-slate-355 mb-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
                  </svg>
                </div>
                <h4 className="text-xs font-bold text-gray-700">No logs found.</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Logs will appear as stock changes are submitted.</p>
              </div>
            )}
          </div>
        </div>

        {/* Critical Low Stock */}
        <div className="bg-white border border-gray-200 p-5 rounded-[10px] shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-4">Critical Low Stock</h3>
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-gray-150 rounded w-full"></div>
                <div className="h-6 bg-gray-100 rounded w-full"></div>
              </div>
            ) : lowStockItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="pb-2">Medicine Name</th>
                      <th className="pb-2 text-center">Qty / Min</th>
                      <th className="pb-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockItems.map((item) => {
                      const qty = item.quantity;
                      const min = item.minimumStock != null ? item.minimumStock : 10;
                      const isOut = qty === 0;
                      return (
                        <tr key={item.inventoryId} className="border-b border-gray-100">
                          <td className="py-2.5 font-bold text-gray-800">{item.medicine?.medicineName || 'Product'}</td>
                          <td className="py-2.5 text-center font-mono text-gray-650">{qty} / {min}</td>
                          <td className="py-2.5 text-center">
                            <span className={`px-2 py-0.5 rounded-[5px] text-[10px] font-bold ${
                              isOut ? 'bg-red-50 text-red-700 border border-red-100 animate-pulse' : 'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}>
                              {isOut ? 'Out of Stock' : 'Low Stock'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center py-10 text-center">
                <div className="p-3 bg-teal-50 border border-teal-155 rounded-full text-teal-700 mb-3 animate-pulse">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h4 className="text-xs font-bold text-gray-700">All stocks optimal</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">No stock lines are currently below minimum thresholds.</p>
              </div>
            )}
          </div>
        </div>

        {/* Commands card */}
        <div className="bg-white border border-gray-200 p-5 rounded-[10px] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-750 mb-4 border-b border-slate-100 pb-2">Counter Commands</h3>
            
            {activeAction ? (
              <form onSubmit={handleActionSubmit} className="space-y-4 border border-teal-100 p-4 rounded-[10px] bg-teal-50/20 animate-fade-in text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-teal-850 uppercase tracking-wider">
                    {activeAction === 'RECEIVE' ? 'Receive Shelf Stock' : 'Dispense Medicines'}
                  </span>
                  <button type="button" onClick={() => setActiveAction(null)} className="text-[10px] text-gray-400 hover:text-gray-650 font-bold cursor-pointer">
                    Cancel
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Select Medicine</label>
                  <select
                    className="w-full bg-white border border-gray-250 p-2 text-xs rounded-card focus:outline-none focus:border-teal-700 font-semibold"
                    value={formMedId}
                    onChange={(e) => setFormMedId(e.target.value)}
                  >
                    {medicines.map((m) => (
                      <option key={m.medicineId} value={m.medicineId}>
                        {m.medicineName} ({m.batchNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full bg-white border border-gray-250 p-2 text-xs rounded-card focus:outline-none focus:border-teal-700 font-semibold"
                    placeholder="Enter units"
                    value={formQty}
                    onChange={(e) => setFormQty(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-card text-xs cursor-pointer shadow-sm"
                >
                  Commit Log
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setActiveAction('RECEIVE')}
                  className="flex items-center p-3 border border-gray-200 hover:border-teal-650 text-gray-700 hover:text-teal-700 rounded-[10px] text-xs font-semibold transition-all text-left bg-slate-50 hover:bg-white cursor-pointer"
                >
                  <svg className="w-4.5 h-4.5 mr-2.5 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Receive Stock (Quick In)</span>
                </button>

                <button
                  onClick={() => setActiveAction('ISSUE')}
                  className="flex items-center p-3 border border-gray-200 hover:border-teal-650 text-gray-700 hover:text-teal-700 rounded-[10px] text-xs font-semibold transition-all text-left bg-slate-50 hover:bg-white cursor-pointer"
                >
                  <svg className="w-4.5 h-4.5 mr-2.5 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Dispense Stock (Quick Out)</span>
                </button>
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 text-[10px] text-gray-400 text-center font-medium leading-relaxed">
            Note: All stock changes log the authenticated pharmacist's credentials for audit compliance.
          </div>
        </div>
      </div>
    </div>
  );
}
