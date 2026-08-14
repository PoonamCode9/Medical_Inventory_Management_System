import React, { useEffect, useState } from 'react';
import API from '../api/Api';
import { Search, Filter, History } from 'lucide-react';

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
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action) => {
    switch (action) {
      case 'PURCHASE':
        return <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-emerald-200">PURCHASE</span>;
      case 'SALE':
        return <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-200">SALE</span>;
      case 'ADJUSTMENT':
        return <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-purple-200">ADJUSTMENT</span>;
      case 'EXPIRED':
        return <span className="bg-red-50 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-red-200">EXPIRED</span>;
      case 'DAMAGED':
        return <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-amber-200">DAMAGED</span>;
      case 'DELETE':
        return <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-gray-200">DELETED</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-md">{action}</span>;
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.medicineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.batchNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.remarks?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = selectedAction === 'ALL' || log.action === selectedAction;

    return matchesSearch && matchesAction;
  });

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-600" /> Stock Audit Logs
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Real-time inventory movement logbook</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search medicine, batch, or remark..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="text-gray-400 w-4 h-4" />
          <select
            className="border border-gray-300 text-gray-700 text-sm rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
          >
            <option value="ALL">All Actions</option>
            <option value="PURCHASE">Purchase (+)</option>
            <option value="SALE">Sale (-)</option>
            <option value="ADJUSTMENT">Adjustment</option>
            <option value="EXPIRED">Expired</option>
            <option value="DAMAGED">Damaged</option>
            <option value="DELETE">Deleted</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 text-sm">Loading audit logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No stock logs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">Medicine</th>
                  <th className="px-4 py-3">Batch No</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3 text-center">Change</th>
                  <th className="px-4 py-3 text-center">Stock (Before → After)</th>
                  <th className="px-4 py-3 text-center">Remarks</th>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Performed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.map((log, index) => (
                  <tr key={log.logId || index} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      {log.medicineName === "Deleted Medicine" ? (
                        <span className="text-gray-600 font-semibold italic text-xs">
                          [Deleted Medicine]
                        </span>
                      ) : (
                        <span className="text-gray-600 font-semibold">{log.medicineName}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                        {log.batchNo}
                      </span>
                    </td>
                    <td className="px-4 py-3">{getActionBadge(log.action)}</td>
                    <td className={`px-4 py-3 text-center font-bold ${
                      log.quantityChanged > 0 ? 'text-emerald-600' : log.quantityChanged < 0 ? 'text-red-500' : 'text-gray-600'
                    }`}>
                      {log.quantityChanged > 0 ? `+${log.quantityChanged}` : log.quantityChanged}
                    </td>
                    <td className="px-4 py-3 text-center text-xs font-mono text-gray-600">
                      <span>{log.quantityBefore ?? 0}</span>
                      <span className="mx-1 text-gray-400">→</span>
                      <span className="font-bold text-gray-800">{log.quantityAfter ?? 0}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-xs">{log.remarks || 'N/A'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(log.logDate).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{log.performedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockLogs;