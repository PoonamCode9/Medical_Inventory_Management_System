import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function StockLogs() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  
  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [filterMedicine, setFilterMedicine] = useState('');
  const [filterOperator, setFilterOperator] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/inventory/logs');
      if (response.data && Array.isArray(response.data.data)) {
        // Sort newest logs first
        const sorted = response.data.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setLogs(sorted);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.warn('GET /api/inventory/logs failed:', err);
      setLogs([]);
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  };

  useEffect(() => {
    fetchLogs();

    const handleWriteSuccess = () => {
      fetchLogs();
    };

    window.addEventListener('api-write-success', handleWriteSuccess);
    return () => {
      window.removeEventListener('api-write-success', handleWriteSuccess);
    };
  }, []);

  const filteredLogs = logs.filter((log) => {
    const medName = log.medicine?.medicineName || '';
    const batchNum = log.medicine?.batchNumber || '';
    const operatorEmail = log.user?.email || 'System';

    // Global Search (Medicine Name, Batch Number, Operator)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSearch = medName.toLowerCase().includes(term) ||
                            batchNum.toLowerCase().includes(term) ||
                            operatorEmail.toLowerCase().includes(term);
      if (!matchesSearch) return false;
    }

    // Event Type Filter
    if (filterAction !== 'ALL' && log.action !== filterAction) {
      return false;
    }

    // Specific Medicine Filter
    if (filterMedicine && !medName.toLowerCase().includes(filterMedicine.toLowerCase())) {
      return false;
    }

    // Specific Operator Filter
    if (filterOperator && !operatorEmail.toLowerCase().includes(filterOperator.toLowerCase())) {
      return false;
    }

    // Date Filter
    if (filterDate && log.updatedAt) {
      const logDateStr = new Date(log.updatedAt).toISOString().split('T')[0];
      if (logDateStr !== filterDate) return false;
    }

    return true;
  });

  const getActionBadge = (action) => {
    switch (action) {
      case 'STOCK_IN':
      case 'RESTOCKED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">STOCK IN</span>;
      case 'STOCK_OUT':
      case 'DISPENSED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">STOCK OUT</span>;
      case 'CREATE':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">CREATED</span>;
      case 'DELETE':
      case 'EXPIRED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">REMOVED</span>;
      case 'BUFFER_INCREASE':
      case 'BUFFER_DECREASE':
      case 'ADJUST':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">ADJUSTED</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">{action}</span>;
    }
  };

  const TableRowSkeleton = () => (
    <tr className="animate-pulse border-b border-gray-150">
      <td className="p-3.5"><div className="h-3.5 bg-gray-250 rounded w-1/3"></div></td>
      <td className="p-3.5"><div className="h-3.5 bg-gray-200 rounded w-2/3"></div></td>
      <td className="p-3.5"><div className="h-3 bg-gray-100 rounded w-1/2"></div></td>
      <td className="p-3.5"><div className="h-4 bg-gray-200 rounded w-1/3"></div></td>
      <td className="p-3.5"><div className="h-3 bg-gray-100 rounded w-1/4"></div></td>
      <td className="p-3.5"><div className="h-3 bg-gray-100 rounded w-1/2"></div></td>
      <td className="p-3.5 text-right"><div className="h-3 bg-gray-150 rounded w-1/3 ml-auto"></div></td>
    </tr>
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Stock Movement Audit Logs</h1>
          <p className="text-xs text-gray-500">Auditable record of all pharmaceutical receipts, dispensations, adjustments, and catalog updates.</p>
        </div>
        <button
          onClick={fetchLogs}
          className="py-1.5 px-3 border border-gray-300 hover:bg-slate-100 text-gray-700 text-xs font-bold rounded-card cursor-pointer transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Logs
        </button>
      </div>

      {/* Search & Multi-Filter Bar */}
      <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {/* Quick Search */}
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Global Search</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-white border border-gray-300 p-2 pl-8 text-xs rounded-card focus:outline-none focus:border-teal-700 font-medium"
                placeholder="Search Medicine Name, Batch No, or Operator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Event Action Filter */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Event Type</label>
            <select
              className="w-full bg-white border border-gray-300 p-2 text-xs rounded-card focus:outline-none focus:border-teal-700 font-medium"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
            >
              <option value="ALL">All Event Types</option>
              <option value="STOCK_IN">Stock In</option>
              <option value="STOCK_OUT">Stock Out</option>
              <option value="ADJUST">Stock Adjusted</option>
              <option value="CREATE">Medicine Created</option>
              <option value="DELETE">Medicine Deleted</option>
            </select>
          </div>

          {/* Operator Filter */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Operator Email</label>
            <input
              type="text"
              className="w-full bg-white border border-gray-300 p-2 text-xs rounded-card focus:outline-none focus:border-teal-700 font-medium"
              placeholder="e.g. admin@medistock.com"
              value={filterOperator}
              onChange={(e) => setFilterOperator(e.target.value)}
            />
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Log Date</label>
            <input
              type="date"
              className="w-full bg-white border border-gray-300 p-2 text-xs rounded-card focus:outline-none focus:border-teal-700 font-medium"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Logs Audit Table */}
      <div className="bg-white border border-gray-200 rounded-[10px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-slate-50 text-gray-500">
                <th className="p-3.5 font-bold">Log ID</th>
                <th className="p-3.5 font-bold">Medicine Product</th>
                <th className="p-3.5 font-bold">Batch No.</th>
                <th className="p-3.5 font-bold">Event Action</th>
                <th className="p-3.5 font-bold">Prev &rarr; New Qty</th>
                <th className="p-3.5 font-bold">Qty Delta</th>
                <th className="p-3.5 font-bold">Transaction Reason</th>
                <th className="p-3.5 font-bold">Audited Operator</th>
                <th className="p-3.5 text-right font-bold">Log Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {loading ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const oldQ = log.oldQuantity != null ? log.oldQuantity : 0;
                  const newQ = log.newQuantity != null ? log.newQuantity : 0;
                  const diff = newQ - oldQ;
                  const medName = log.medicine?.medicineName || 'Catalog Product';
                  const batchNo = log.medicine?.batchNumber || 'N/A';
                  const operator = log.user?.email || 'System';
                  const dateObj = log.updatedAt ? new Date(log.updatedAt) : null;
                  const dateStr = dateObj ? dateObj.toLocaleDateString() : '';
                  const timeStr = dateObj ? dateObj.toLocaleTimeString() : '';

                  return (
                    <tr key={log.stockLogId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 font-semibold text-gray-400 font-mono">#{log.stockLogId}</td>
                      <td className="p-3.5 font-bold text-gray-900">{medName}</td>
                      <td className="p-3.5 text-gray-500 font-mono text-[11px]">{batchNo}</td>
                      <td className="p-3.5">{getActionBadge(log.action)}</td>
                      <td className="p-3.5 font-semibold text-gray-700 font-mono">
                        {oldQ} &rarr; <span className="font-bold text-gray-900">{newQ}</span>
                      </td>
                      <td className={`p-3.5 font-bold font-mono ${diff < 0 ? 'text-red-600' : diff > 0 ? 'text-teal-700' : 'text-gray-500'}`}>
                        {diff > 0 ? `+${diff}` : diff}
                      </td>
                      <td className="p-3.5 text-gray-600 font-medium max-w-xs truncate" title={log.reason || 'Routine transaction'}>
                        {log.reason || 'Routine transaction'}
                      </td>
                      <td className="p-3.5 text-gray-700 font-semibold">{operator}</td>
                      <td className="p-3.5 text-right text-gray-400 font-mono text-[10px]">
                        <div>{dateStr}</div>
                        <div className="text-gray-500 font-bold">{timeStr}</div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-16 text-gray-400 bg-slate-50/20">
                    <div className="flex flex-col justify-center items-center">
                      <div className="p-3 bg-slate-50 border border-slate-150 rounded-full text-slate-400 mb-3">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                        </svg>
                      </div>
                      <h4 className="text-xs font-bold text-gray-700">No matching stock logs found.</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Audit history matches zero records for selected filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
