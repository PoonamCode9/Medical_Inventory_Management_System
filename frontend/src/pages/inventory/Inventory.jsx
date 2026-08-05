import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function Inventory() {
  const { user } = useContext(AuthContext);
  const roleName = user?.role || '';
  const canWrite = roleName.includes('ADMIN') || roleName.includes('PHARMACIST');
  const isAdmin = roleName.includes('ADMIN');

  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // States
  const [inventoryList, setInventoryList] = useState([]);
  const [stockLogs, setStockLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'logs'
  const [stockFilter, setStockFilter] = useState('ALL'); // 'ALL', 'LOW', 'OUT'

  // Modals
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false); // Stock In / Out
  const [moveType, setMoveType] = useState('IN'); // 'IN' or 'OUT'

  // Form Fields
  const [selectedMedId, setSelectedMedId] = useState('');
  const [qtyChange, setQtyChange] = useState('');
  const [minStockChange, setMinStockChange] = useState('10');
  const [maxStockChange, setMaxStockChange] = useState('1000');
  const [adjustQty, setAdjustQty] = useState('');
  const [reasonChange, setReasonChange] = useState('');
  const [reasonError, setReasonError] = useState('');

  // Log History Filters
  const [logSearchMedicine, setLogSearchMedicine] = useState('');
  const [logActionType, setLogActionType] = useState('ALL');
  const [logOperator, setLogOperator] = useState('');
  const [logStartDate, setLogStartDate] = useState('');
  const [logEndDate, setLogEndDate] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/inventory');
      if (res.data && Array.isArray(res.data.data)) {
        setInventoryList(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedMedId(res.data.data[0].medicine?.medicineId?.toString() || '');
        }
      }
    } catch (err) {
      console.error(err);
      triggerToast('Unable to fetch inventory catalog.');
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await api.get('/api/inventory/logs');
      if (res.data && Array.isArray(res.data.data)) {
        // Sort logs desc
        const sorted = res.data.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setStockLogs(sorted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
    if (activeTab === 'logs') {
      fetchLogs();
    }

    const handleWriteSuccess = () => {
      console.log('Real-time sync: reloading inventory data');
      fetchInventory();
      if (activeTab === 'logs') {
        fetchLogs();
      }
    };

    window.addEventListener('api-write-success', handleWriteSuccess);
    return () => {
      window.removeEventListener('api-write-success', handleWriteSuccess);
    };
  }, [activeTab]);

  const handleMoveSubmit = async (e) => {
    e.preventDefault();
    setReasonError('');
    const qtyNum = parseInt(qtyChange, 10);
    if (!qtyChange || isNaN(qtyNum) || qtyNum <= 0) {
      triggerToast('Please input a valid transaction quantity greater than zero.');
      return;
    }

    let activeReason = reasonChange.trim();
    if (!activeReason) {
      activeReason = moveType === 'IN' ? 'Stock replenishment transaction' : 'Stock dispensation transaction';
    } else if (activeReason.length < 10) {
      setReasonError('Transaction Reason must be at least 10 characters long.');
      triggerToast('Transaction Reason must be at least 10 characters long.');
      return;
    }

    let medId = selectedMedId;
    if (!medId && inventoryList.length > 0) {
      medId = inventoryList[0].medicine?.medicineId?.toString();
    }
    if (!medId) {
      triggerToast('Please select a valid medicine.');
      return;
    }

    // Client-side Stock Out limit validation
    if (moveType === 'OUT') {
      const selectedItem = inventoryList.find(i => i.medicine?.medicineId?.toString() === medId);
      if (selectedItem && selectedItem.quantity < qtyNum) {
        triggerToast(`Cannot dispense ${qtyNum} units. Available stock is only ${selectedItem.quantity} units.`);
        return;
      }
    }

    setSubmitLoading(true);
    const endpoint = moveType === 'IN' ? '/api/inventory/stock-in' : '/api/inventory/stock-out';
    const payload = {
      medicineId: parseInt(medId, 10),
      quantity: qtyNum,
      reason: activeReason
    };

    try {
      const res = await api.post(endpoint, payload);
      if (res.data && res.data.success) {
        triggerToast(moveType === 'IN' ? 'Stock received and logged successfully.' : 'Stock dispensed and logged successfully.');
        resetForm();
        fetchInventory();
        if (activeTab === 'logs') fetchLogs();
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Transaction rejected by server.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    setReasonError('');
    const adjQtyNum = parseInt(adjustQty, 10);
    const minStockNum = parseInt(minStockChange, 10);
    const maxStockNum = parseInt(maxStockChange, 10);

    if (adjustQty === '' || isNaN(adjQtyNum) || adjQtyNum < 0) {
      triggerToast('Inventory Stock quantity must be greater than or equal to zero.');
      return;
    }
    if (minStockChange === '' || isNaN(minStockNum) || minStockNum <= 0) {
      triggerToast('Minimum Buffer level must be greater than zero.');
      return;
    }
    if (maxStockChange === '' || isNaN(maxStockNum) || maxStockNum <= minStockNum) {
      triggerToast('Maximum Stock limit must always be strictly greater than Minimum Buffer level.');
      return;
    }
    if (adjQtyNum > maxStockNum) {
      triggerToast(`Inventory Quantity (${adjQtyNum}) cannot exceed Maximum Stock limit (${maxStockNum}).`);
      return;
    }

    let activeReason = reasonChange.trim();
    if (!activeReason) {
      activeReason = 'Inventory stock level reconciliation';
    } else if (activeReason.length < 10) {
      setReasonError('Transaction Reason must be at least 10 characters long.');
      triggerToast('Transaction Reason must be at least 10 characters long.');
      return;
    }

    setSubmitLoading(true);
    const payload = {
      medicineId: parseInt(selectedMedId, 10),
      quantity: adjQtyNum,
      minimumStock: minStockNum,
      maximumStock: maxStockNum,
      reason: activeReason
    };

    try {
      const res = await api.post('/api/inventory/adjust', payload);
      if (res.data && res.data.success) {
        triggerToast('Stock levels & threshold configurations updated and logged.');
        resetForm();
        fetchInventory();
        if (activeTab === 'logs') fetchLogs();
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Adjustment rejected by server.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAdjustClick = (item) => {
    setSelectedMedId(item.medicine.medicineId.toString());
    setAdjustQty(item.quantity.toString());
    setMinStockChange((item.minimumStock || 10).toString());
    setMaxStockChange((item.maximumStock || 1000).toString());
    setReasonChange('');
    setShowAdjustModal(true);
  };

  const handleOpenMoveModal = (type) => {
    setMoveType(type);
    setReasonChange('');
    if (inventoryList.length > 0) {
      setSelectedMedId(inventoryList[0].medicine?.medicineId?.toString() || '');
    } else {
      setSelectedMedId('');
    }
    setShowMoveModal(true);
  };

  const resetForm = () => {
    setQtyChange('');
    setAdjustQty('');
    setMinStockChange('10');
    setMaxStockChange('1000');
    setReasonChange('');
    setReasonError('');
    setShowAdjustModal(false);
    setShowMoveModal(false);
  };

  const filteredInventory = inventoryList.filter(item => {
    const minStock = item.minimumStock != null ? item.minimumStock : 10;
    if (stockFilter === 'LOW') {
      return item.quantity <= minStock && item.quantity > 0;
    }
    if (stockFilter === 'OUT') {
      return item.quantity === 0;
    }
    return true;
  });

  const filteredLogs = stockLogs.filter(log => {
    const medName = log.medicine?.medicineName || '';
    if (logSearchMedicine && !medName.toLowerCase().includes(logSearchMedicine.toLowerCase())) {
      return false;
    }
    if (logActionType !== 'ALL' && log.action !== logActionType) {
      return false;
    }
    const email = log.user?.email || 'System';
    if (logOperator && !email.toLowerCase().includes(logOperator.toLowerCase())) {
      return false;
    }
    if (log.updatedAt) {
      const logDate = new Date(log.updatedAt);
      if (logStartDate) {
        const start = new Date(logStartDate);
        start.setHours(0,0,0,0);
        if (logDate < start) return false;
      }
      if (logEndDate) {
        const end = new Date(logEndDate);
        end.setHours(23,59,59,999);
        if (logDate > end) return false;
      }
    }
    return true;
  });

  const TableRowSkeleton = () => (
    <tr className="animate-pulse border-b border-gray-150">
      <td className="p-3"><div className="h-3.5 bg-gray-200 rounded w-2/3"></div></td>
      <td className="p-3"><div className="h-3 bg-gray-100 rounded w-1/3"></div></td>
      <td className="p-3"><div className="h-3.5 bg-gray-150 rounded w-1/2"></div></td>
      <td className="p-3"><div className="h-3.5 bg-gray-150 rounded w-1/4"></div></td>
      <td className="p-3"><div className="h-3 bg-gray-200 rounded w-1/3"></div></td>
      <td className="p-3 text-center"><div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div></td>
    </tr>
  );

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-teal-850 text-white text-xs font-bold py-3 px-5 rounded-[10px] shadow-lg border border-teal-650 z-50">
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Inventory Stock & Movements</h1>
          <p className="text-xs text-gray-500">Dispense supplies, issue stock-in log entries, adjust trigger configurations, and review logs.</p>
        </div>
        {canWrite && (
          <div className="flex space-x-2">
            <button
              onClick={() => handleOpenMoveModal('IN')}
              className="py-2 px-3 border border-[#0F766E] hover:bg-teal-50 text-[#0F766E] font-bold rounded-card text-xs cursor-pointer shadow-sm"
            >
              + Stock In (Add)
            </button>
            <button
              onClick={() => handleOpenMoveModal('OUT')}
              className="py-2 px-3 border border-red-700 text-red-750 hover:bg-red-50 font-bold rounded-card text-xs cursor-pointer shadow-sm"
            >
              - Stock Out (Dispense)
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-2.5 text-xs font-bold cursor-pointer transition-all border-b-2 ${
            activeTab === 'inventory' ? 'border-[#0F766E] text-[#0F766E]' : 'border-transparent text-gray-400 hover:text-gray-650'
          }`}
        >
          Current Stock Matrix
        </button>
        <button
          onClick={() => {
            setActiveTab('logs');
            fetchLogs();
          }}
          className={`pb-2.5 text-xs font-bold cursor-pointer transition-all border-b-2 ${
            activeTab === 'logs' ? 'border-[#0F766E] text-[#0F766E]' : 'border-transparent text-gray-400 hover:text-gray-650'
          }`}
        >
          Transaction Logs & Timeline
        </button>
      </div>

      {activeTab === 'inventory' ? (
        <div className="space-y-4">
          {/* Quick Filters */}
          <div className="flex space-x-2">
            <button
              onClick={() => setStockFilter('ALL')}
              className={`px-3 py-1.5 rounded-card text-xs font-bold border transition-colors cursor-pointer ${
                stockFilter === 'ALL'
                  ? 'bg-teal-800 text-white border-teal-800'
                  : 'bg-white text-gray-500 border-gray-300 hover:bg-slate-50'
              }`}
            >
              All Stocks
            </button>
            <button
              onClick={() => setStockFilter('LOW')}
              className={`px-3 py-1.5 rounded-card text-xs font-bold border transition-colors cursor-pointer ${
                stockFilter === 'LOW'
                  ? 'bg-red-700 text-white border-red-700'
                  : 'bg-white text-red-750 border-gray-300 hover:bg-red-50/20'
              }`}
            >
              Low Stock Warnings
            </button>
            <button
              onClick={() => setStockFilter('OUT')}
              className={`px-3 py-1.5 rounded-card text-xs font-bold border transition-colors cursor-pointer ${
                stockFilter === 'OUT'
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-slate-100'
              }`}
            >
              Out of Stock
            </button>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-[10px] shadow-sm overflow-hidden">
            <div className="overflow-x-auto font-sans">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-slate-50 text-gray-500">
                    <th className="p-3.5 font-bold">Medicine Catalog Item</th>
                    <th className="p-3.5 font-bold">Category</th>
                    <th className="p-3.5 font-bold">Current / Min / Max</th>
                    <th className="p-3.5 font-bold">Stock Status</th>
                    <th className="p-3.5 font-bold">Inventory Value</th>
                    <th className="p-3.5 font-bold">Last Updated</th>
                    <th className="p-3.5 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {loading ? (
                    <>
                      <TableRowSkeleton />
                      <TableRowSkeleton />
                      <TableRowSkeleton />
                    </>
                  ) : filteredInventory.length > 0 ? (
                    filteredInventory.map((item) => {
                      const name = item.medicine?.medicineName || 'Unknown Product';
                      const generic = item.medicine?.genericName || 'None';
                      const catName = item.medicine?.categoryName || 'General';
                      const purchasePrice = item.medicine?.purchasePrice || 0;
                      const totalVal = purchasePrice * item.quantity;
                      
                      const minStock = item.minimumStock != null ? item.minimumStock : 10;
                      let statusBadge = (
                        <span className="inline-flex items-center text-[10px] font-bold text-green-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                          Good Stock
                        </span>
                      );
                      if (item.quantity === 0) {
                        statusBadge = (
                          <span className="inline-flex items-center text-[10px] font-bold text-gray-700 bg-slate-100 px-2 py-0.5 rounded-[5px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5 animate-pulse"></span>
                            Out Of Stock
                          </span>
                        );
                      } else if (item.quantity <= minStock) {
                        statusBadge = (
                          <span className="inline-flex items-center text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-[5px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse"></span>
                            Low Stock
                          </span>
                        );
                      }

                      return (
                        <tr key={item.inventoryId} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3">
                            <div className="font-bold text-gray-800">{name}</div>
                            <div className="text-[10px] text-gray-400 font-medium font-mono">Batch: {item.medicine?.batchNumber}</div>
                          </td>
                          <td className="p-3 text-gray-550 font-semibold">{catName}</td>
                          <td className="p-3 font-bold text-gray-800">
                            {item.quantity} <span className="text-[10px] text-gray-450 font-sans font-medium">/ {minStock} / {item.maximumStock || 1000}</span>
                          </td>
                          <td className="p-3">{statusBadge}</td>
                          <td className="p-3 font-semibold text-gray-800">₹{totalVal.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-gray-400 font-mono text-[10px]">
                            {item.lastUpdated ? new Date(item.lastUpdated).toLocaleString() : 'N/A'}
                          </td>
                          <td className="p-3 text-center">
                            {canWrite && (
                              <button
                                onClick={() => handleAdjustClick(item)}
                                className="px-2.5 py-1 text-xs border border-gray-300 rounded-card font-medium text-gray-600 hover:bg-slate-100 transition-colors cursor-pointer"
                              >
                                Adjust Buffer
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-16 text-gray-400 bg-slate-50/20">
                        <div className="flex flex-col justify-center items-center font-sans">
                          <span className="text-4xl mb-3">📦</span>
                          <h4 className="text-sm font-bold text-gray-700">No inventory data available.</h4>
                          <p className="text-xs text-gray-400 mt-1">There are no records matching your current filter configurations.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Logs History Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 bg-slate-50 border border-gray-200 rounded-[10px] p-4 text-[11px] font-sans">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Search Medicine</label>
              <input
                type="text"
                placeholder="e.g. Paracetamol"
                className="w-full bg-white border border-gray-300 rounded-card p-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30"
                value={logSearchMedicine}
                onChange={(e) => setLogSearchMedicine(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Action Type</label>
              <select
                className="w-full bg-white border border-gray-300 rounded-card p-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30"
                value={logActionType}
                onChange={(e) => setLogActionType(e.target.value)}
              >
                <option value="ALL">All Actions</option>
                <option value="STOCK_IN">Stock In</option>
                <option value="STOCK_OUT">Stock Out</option>
                <option value="ADJUST">Adjusted</option>
                <option value="CREATE">Created</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Operator Email</label>
              <input
                type="text"
                placeholder="e.g. admin"
                className="w-full bg-white border border-gray-300 rounded-card p-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30"
                value={logOperator}
                onChange={(e) => setLogOperator(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Start Date</label>
              <input
                type="date"
                className="w-full bg-white border border-gray-300 rounded-card p-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30"
                value={logStartDate}
                onChange={(e) => setLogStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">End Date</label>
              <input
                type="date"
                className="w-full bg-white border border-gray-300 rounded-card p-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30"
                value={logEndDate}
                onChange={(e) => setLogEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-[10px] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-slate-50 text-gray-500">
                    <th className="p-3.5 font-bold">Transaction Time</th>
                    <th className="p-3.5 font-bold">Medicine Product</th>
                    <th className="p-3.5 font-bold">Action / Movement</th>
                    <th className="p-3.5 font-bold">Previous Stock</th>
                    <th className="p-3.5 font-bold">Resulting Stock</th>
                    <th className="p-3.5 font-bold">Reason / Details</th>
                    <th className="p-3.5 font-bold">Operator Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {logsLoading ? (
                    <>
                      <TableRowSkeleton />
                      <TableRowSkeleton />
                    </>
                  ) : filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => {
                      let actionBadge = (
                        <span className="text-[10px] font-bold py-0.5 px-2 bg-blue-50 text-blue-800 rounded-[5px]">
                          Created
                        </span>
                      );
                      if (log.action === 'STOCK_IN') {
                        actionBadge = (
                          <span className="text-[10px] font-bold py-0.5 px-2 bg-teal-50 text-teal-850 rounded-[5px]">
                            Stock In
                          </span>
                        );
                      } else if (log.action === 'STOCK_OUT') {
                        actionBadge = (
                          <span className="text-[10px] font-bold py-0.5 px-2 bg-red-50 text-red-750 rounded-[5px]">
                            Stock Out
                          </span>
                        );
                      } else if (log.action === 'ADJUST') {
                        actionBadge = (
                          <span className="text-[10px] font-bold py-0.5 px-2 bg-amber-50 text-amber-800 rounded-[5px]">
                            Adjusted
                          </span>
                        );
                      }

                      return (
                        <tr key={log.stockLogId} className="hover:bg-slate-50/50 transition-colors font-mono">
                          <td className="p-3 text-[10px] text-gray-400">
                            {log.updatedAt ? new Date(log.updatedAt).toLocaleString() : 'N/A'}
                          </td>
                          <td className="p-3 font-sans font-bold text-gray-800">
                            {log.medicine?.medicineName}
                          </td>
                          <td className="p-3 font-sans">{actionBadge}</td>
                          <td className="p-3 text-gray-450 font-medium">{log.oldQuantity}</td>
                          <td className="p-3 text-gray-800 font-bold">{log.newQuantity}</td>
                          <td className="p-3 font-sans text-gray-500 font-medium">{log.reason || 'N/A'}</td>
                          <td className="p-3 font-sans text-gray-500 font-medium">{log.user?.email || 'System'}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-16 text-gray-400 bg-slate-50/20">
                        <div className="flex flex-col justify-center items-center font-sans">
                          <span className="text-4xl mb-3">📋</span>
                          <h4 className="text-sm font-bold text-gray-700">No stock movement logs recorded.</h4>
                          <p className="text-xs text-gray-400 mt-1">Audited inventory restocks or dispenses will compile here.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: STOCK IN / OUT MOVEMENT */}
      {showMoveModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-[10px] border border-gray-200 shadow-xl w-full max-w-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-gray-200 px-5 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-900">
                {moveType === 'IN' ? 'Stock In Receipt Entry' : 'Stock Out Dispensing Entry'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 font-bold">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleMoveSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Select Medicine *</label>
                <select
                  className="w-full bg-white border border-gray-300 rounded-card p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30"
                  value={selectedMedId}
                  onChange={(e) => setSelectedMedId(e.target.value)}
                >
                  {inventoryList.map((item) => (
                    <option key={item.inventoryId} value={item.medicine?.medicineId}>
                      {item.medicine?.medicineName} ({item.medicine?.batchNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Transaction Quantity *</label>
                <input
                  type="number"
                  required
                  className="w-full bg-white border border-gray-300 rounded-card p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30"
                  placeholder="Enter positive integer"
                  value={qtyChange}
                  onChange={(e) => setQtyChange(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Transaction Reason / Description *</label>
                <input
                  type="text"
                  required
                  className={`w-full bg-white border rounded-card p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30 ${
                    reasonError ? 'border-red-500 bg-red-50/10' : 'border-gray-300'
                  }`}
                  placeholder="Mandatory (min 10 characters, e.g., Stock received from supplier shipment)"
                  value={reasonChange}
                  onChange={(e) => {
                    setReasonChange(e.target.value);
                    setReasonError('');
                  }}
                />
                {reasonError ? (
                  <p className="text-[9px] text-red-500 font-bold mt-1">{reasonError}</p>
                ) : (
                  <p className="text-[9px] text-gray-400 mt-1">Audit log requires at least 10 characters description.</p>
                )}
              </div>

              <div className="pt-3 border-t border-gray-150 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={resetForm}
                  className="py-2 px-4 border border-gray-300 hover:bg-slate-100 text-gray-700 text-xs font-bold rounded-card cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="py-2 px-4 bg-[#0F766E] hover:bg-teal-800 text-white text-xs font-bold rounded-card cursor-pointer shadow-sm"
                >
                  Commit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADJUST STOCK & BUFFER LIMITS */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-[10px] border border-gray-200 shadow-xl w-full max-w-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-gray-200 px-5 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-900">Adjust Stock Levels & Thresholds</h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 font-bold">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 font-sans">Total Physical Quantity *</label>
                <input
                  type="number"
                  required
                  className="w-full bg-white border border-gray-300 rounded-card p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 font-sans">Minimum Buffer Level *</label>
                <input
                  type="number"
                  required
                  className="w-full bg-white border border-gray-300 rounded-card p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30"
                  value={minStockChange}
                  onChange={(e) => setMinStockChange(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 font-sans">Maximum Stock Limit *</label>
                <input
                  type="number"
                  required
                  className="w-full bg-white border border-gray-300 rounded-card p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30"
                  value={maxStockChange}
                  onChange={(e) => setMaxStockChange(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 font-sans">Adjustment Reason / Details *</label>
                <input
                  type="text"
                  required
                  className={`w-full bg-white border rounded-card p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-700/30 ${
                    reasonError ? 'border-red-500 bg-red-50/10' : 'border-gray-300'
                  }`}
                  placeholder="Mandatory (min 10 characters, e.g., Monthly inventory stock reconciliation)"
                  value={reasonChange}
                  onChange={(e) => {
                    setReasonChange(e.target.value);
                    setReasonError('');
                  }}
                />
                {reasonError ? (
                  <p className="text-[9px] text-red-500 font-bold mt-1">{reasonError}</p>
                ) : (
                  <p className="text-[9px] text-gray-400 mt-1">Audit log requires at least 10 characters description.</p>
                )}
              </div>

              <div className="pt-3 border-t border-gray-150 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={resetForm}
                  className="py-2 px-4 border border-gray-300 hover:bg-slate-100 text-gray-700 text-xs font-bold rounded-card cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="py-2 px-4 bg-[#0F766E] hover:bg-teal-800 text-white text-xs font-bold rounded-card cursor-pointer shadow-sm"
                >
                  Save Adjustments
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
