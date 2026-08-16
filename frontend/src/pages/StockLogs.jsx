import React, { useEffect, useState } from 'react';
import API from '../api/Api';
import toast from 'react-hot-toast';
import { Search, Filter, History, RotateCcw, AlertCircle } from 'lucide-react';

const StockLogs = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStockLogs();
  }, []);

  const fetchStockLogs = async () => {
    try {
      setLoading(true);
      const res = await API.get('/stock-logs');
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to fetch stock logs:', err);
      toast.error(
        err.response?.data?.message ||
          (typeof err.response?.data === 'string' ? err.response?.data : '') ||
          'Failed to fetch stock logs.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action) => {
    const baseClasses = "text-[11px] font-bold px-2.5 py-1 rounded-full border inline-flex items-center gap-1.5 tracking-wide";
    
    switch (action) {
      case 'ADDED':
        return (
          <span className={`${baseClasses} bg-emerald-50 text-emerald-700 border-emerald-200/80`}>
            ADDED
          </span>
        );
      case 'PURCHASE_RECEIVED':
        return (
          <span className={`${baseClasses} bg-teal-50 text-teal-700 border-teal-200/80`}>
            PURCHASE_RECEIVED
          </span>
        );
      case 'SOLD':
        return (
          <span className={`${baseClasses} bg-blue-50 text-blue-700 border-blue-200/80`}>
            SOLD
          </span>
        );
      case 'ADJUSTED':
        return (
          <span className={`${baseClasses} bg-purple-50 text-purple-700 border-purple-200/80`}>
            ADJUSTED
          </span>
        );
      case 'REMOVED_EXPIRED':
        return (
          <span className={`${baseClasses} bg-rose-50 text-rose-700 border-rose-200/80`}>
            REMOVED_EXPIRED
          </span>
        );
      case 'REMOVED_DAMAGED':
        return (
          <span className={`${baseClasses} bg-amber-50 text-amber-800 border-amber-200/80`}>
            REMOVED_DAMAGED
          </span>
        );
      case 'DELETED':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800 border-red-200`}>
            DELETED
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-slate-100 text-slate-700 border-slate-200`}>
            {action}
          </span>
        );
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.medicineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.batchNo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = selectedAction === 'ALL' || log.action === selectedAction;

    return matchesSearch && matchesAction;
  });

  return (
    <div className="w-full pb-10 min-h-screen bg-slate-50/60 font-sans antialiased">
      <div className="mx-6 mt-6 mb-6 bg-gradient-to-r from-white via-white to-indigo-50/40 p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-500/20 ring-4 ring-indigo-50">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Stock Audit Logs
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time inventory movement logbook and audit trail
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchStockLogs}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 font-medium px-4 py-2 rounded-xl text-xs shadow-xs transition active:scale-98 cursor-pointer"
        >
          <RotateCcw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="px-6 space-y-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-2.5 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search medicine or batch..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="p-2 bg-slate-100 text-slate-500 rounded-lg">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <select
              className="w-full sm:w-auto border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white cursor-pointer font-medium"
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
            >
              <option value="ALL">All Actions</option>
              <option value="ADDED">Added (+)</option>
              <option value="PURCHASE_RECEIVED">Purchase Received (+)</option>
              <option value="SOLD">Sold (-)</option>
              <option value="ADJUSTED">Adjusted</option>
              <option value="REMOVED_EXPIRED">Removed Expired (-)</option>
              <option value="REMOVED_DAMAGED">Removed Damaged (-)</option>
              <option value="DELETED">Deleted (-)</option>
            </select>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span>Loading audit logs...</span>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
              <AlertCircle className="w-8 h-8 text-slate-300" />
              <span>No stock logs found.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Medicine</th>
                    <th className="px-5 py-3.5">Batch No</th>
                    <th className="px-5 py-3.5">Action</th>
                    <th className="px-5 py-3.5 text-center">Change</th>
                    <th className="px-5 py-3.5 text-center">Stock (Before → After)</th>
                    <th className="px-5 py-3.5">Remarks</th>
                    <th className="px-5 py-3.5">Date & Time</th>
                    <th className="px-5 py-3.5">Performed By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.map((log, index) => (
                    <tr
                      key={log.logId || index}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-semibold text-slate-900">
                        {log.medicineName === "Deleted Medicine" ? (
                          <span className="text-slate-400 italic text-xs font-normal">
                            [Deleted Medicine]
                          </span>
                        ) : (
                          <span>{log.medicineName}</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-[11px] bg-slate-100 border border-slate-200/60 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                          {log.batchNo || 'N/A'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">{getActionBadge(log.action)}</td>
                      <td
                        className={`px-5 py-3.5 text-center font-bold text-xs ${
                          log.quantityChanged > 0
                            ? 'text-emerald-600'
                            : log.quantityChanged < 0
                            ? 'text-rose-600'
                            : 'text-slate-600'
                        }`}
                      >
                        {log.quantityChanged > 0 ? `+${log.quantityChanged}` : log.quantityChanged}
                      </td>
                      <td className="px-5 py-3.5 text-center text-xs font-mono">
                        <span className="text-slate-500">{log.quantityBefore ?? 0}</span>
                        <span className="mx-1.5 text-slate-300">→</span>
                        <span className="font-bold text-slate-800">{log.quantityAfter ?? 0}</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs max-w-xs truncate">
                        {log.remarks || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(log.logDate).toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-700 font-medium">
                        {log.performedBy || 'System'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockLogs;