import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function StockLogs() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  // Load stock logs on mount (ready for Spring Boot API integration)
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/stock-logs'); // hypothetical stock-logs endpoint
        if (response && Array.isArray(response.data)) {
          setLogs(response.data);
        } else {
          setLogs([]);
        }
      } catch (err) {
        console.warn('GET /api/stock-logs failed, showing empty logs state:', err);
        setLogs([]);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = (log.medicineName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (log.batch || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (log.user || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterAction === 'ALL') {
      return matchesSearch;
    }
    return matchesSearch && log.action === filterAction;
  });

  const getActionBadge = (action) => {
    switch (action) {
      case 'RESTOCKED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">RESTOCKED</span>;
      case 'DISPENSED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">DISPENSED</span>;
      case 'EXPIRED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">EXPIRED</span>;
      case 'DAMAGED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">DAMAGED</span>;
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
    <div className="space-y-6">
      {/* Top Banner */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Stock Adjustment & Transaction Logs</h1>
        <p className="text-xs text-gray-500">Auditable history of all pharmaceutical additions, dispensations, and shelf adjustments.</p>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            className="w-full bg-white border border-gray-300 p-2 pl-8 text-xs rounded-card focus:outline-none focus:border-teal-700"
            placeholder="Search by Medicine, Batch, or Operator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Action Filter */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-semibold text-gray-500 uppercase">Filter Action:</span>
          <select
            className="bg-white border border-gray-300 p-2 text-xs rounded-card focus:outline-none focus:border-teal-700"
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
          >
            <option value="ALL">All Event Types</option>
            <option value="RESTOCKED">Restocked Only</option>
            <option value="DISPENSED">Dispensed Only</option>
            <option value="EXPIRED">Expired Only</option>
            <option value="DAMAGED">Damaged Only</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-gray-200 rounded-[10px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-slate-50 text-gray-500">
                <th className="p-4 font-bold">Log ID</th>
                <th className="p-4 font-bold">Medicine Name</th>
                <th className="p-4 font-bold">Batch No.</th>
                <th className="p-4 font-bold">Event Action</th>
                <th className="p-4 font-bold">Quantity Delta</th>
                <th className="p-4 font-bold">Audited Operator</th>
                <th className="p-4 text-right font-bold">Log Time</th>
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
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-semibold text-gray-400 font-mono">#{log.id}</td>
                    <td className="p-4 font-bold text-gray-800">{log.medicineName}</td>
                    <td className="p-4 text-gray-500 font-mono text-[11px]">{log.batch}</td>
                    <td className="p-4">{getActionBadge(log.action)}</td>
                    <td className={`p-4 font-bold ${log.quantity < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {log.quantity > 0 ? `+${log.quantity}` : log.quantity}
                    </td>
                    <td className="p-4 text-gray-600 font-semibold">{log.user}</td>
                    <td className="p-4 text-right text-gray-400 font-mono">{log.timestamp}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-400 bg-slate-50/20">
                    <div className="flex flex-col justify-center items-center py-5">
                      <div className="p-3 bg-slate-50 border border-slate-150 rounded-full text-slate-400 mb-3">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                        </svg>
                      </div>
                      <h4 className="text-xs font-bold text-gray-700">No stock logs found.</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Audit history is currently empty.</p>
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
