import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function ExpiryTracker() {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL', 'EXPIRED', 'CRITICAL', 'EXPIRING_SOON', 'SAFE'
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchExpiryAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/expiry/alerts');
      if (res.data && Array.isArray(res.data.data)) {
        setAlerts(res.data.data);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Unable to fetch active expiry warning alerts.');
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    fetchExpiryAlerts();

    const handleWriteSuccess = () => {
      console.log('Real-time sync: reloading expiry warning alerts');
      fetchExpiryAlerts();
    };

    window.addEventListener('api-write-success', handleWriteSuccess);
    return () => {
      window.removeEventListener('api-write-success', handleWriteSuccess);
    };
  }, []);

  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  // Compute card metrics dynamically from alerts list
  const totalCount = alerts.length;
  const expiredCount = alerts.filter(a => a.status === 'Expired').length;
  const criticalCount = alerts.filter(a => a.status === 'Critical').length;
  const expiringSoonCount = alerts.filter(a => a.status === 'Expiring Soon').length;
  const safeCount = alerts.filter(a => a.status === 'Safe').length;

  // Filter alerts based on search query and active tab filter
  const filteredAlerts = alerts.filter(alert => {
    // Search filter
    const matchesSearch = 
      (alert.medicineName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (alert.batchNumber?.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Status category filter
    if (activeFilter === 'EXPIRED') return alert.status === 'Expired';
    if (activeFilter === 'CRITICAL') return alert.status === 'Critical';
    if (activeFilter === 'EXPIRING_SOON') return alert.status === 'Expiring Soon';
    if (activeFilter === 'SAFE') return alert.status === 'Safe';

    return true;
  });

  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    const dateA = a.expiryDate ? new Date(a.expiryDate).getTime() : 0;
    const dateB = b.expiryDate ? new Date(b.expiryDate).getTime() : 0;
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const TableRowSkeleton = () => (
    <tr className="animate-pulse border-b border-gray-150">
      <td className="p-3.5"><div className="h-3.5 bg-gray-200 rounded w-2/3"></div></td>
      <td className="p-3.5"><div className="h-3.5 bg-gray-150 rounded w-1/3"></div></td>
      <td className="p-3.5"><div className="h-3 bg-gray-100 rounded w-1/2"></div></td>
      <td className="p-3.5"><div className="h-3.5 bg-gray-150 rounded w-1/4"></div></td>
      <td className="p-3.5 text-center"><div className="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div></td>
    </tr>
  );

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-teal-850 text-white text-xs font-bold py-3 px-5 rounded-[10px] shadow-lg border border-teal-650 z-50">
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Expiry Management Console</h1>
          <p className="text-xs text-gray-500">
            Monitor product lifespans, detect critical timelines, and filter batches by expiration threshold categories.
          </p>
        </div>
        <button
          onClick={fetchExpiryAlerts}
          className="py-1.5 px-3 border border-gray-300 hover:bg-slate-100 text-gray-700 text-xs font-bold rounded-card cursor-pointer flex items-center gap-1.5 align-self-start sm:align-self-auto"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18" />
          </svg>
          Sync Data
        </button>
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col justify-between cursor-pointer hover:border-slate-400 transition-all" onClick={() => setActiveFilter('ALL')}>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Medicines</span>
          <span className="text-2xl font-bold text-gray-800 mt-2">{totalCount}</span>
          <span className="text-[9px] text-gray-500 mt-1 font-semibold">All tracked products</span>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col justify-between border-l-4 border-l-red-600 cursor-pointer hover:border-slate-400 transition-all" onClick={() => setActiveFilter('EXPIRED')}>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Expired</span>
          <span className="text-2xl font-bold text-red-650 mt-2">{expiredCount}</span>
          <span className="text-[9px] text-red-600 mt-1 font-semibold">Require disposal</span>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col justify-between border-l-4 border-l-orange-500 cursor-pointer hover:border-slate-400 transition-all" onClick={() => setActiveFilter('CRITICAL')}>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Critical (≤ 30 Days)</span>
          <span className="text-2xl font-bold text-orange-600 mt-2">{criticalCount}</span>
          <span className="text-[9px] text-orange-600 mt-1 font-semibold">Immediate attention</span>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col justify-between border-l-4 border-l-amber-500 cursor-pointer hover:border-slate-400 transition-all" onClick={() => setActiveFilter('EXPIRING_SOON')}>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Expiring Soon (≤ 60 Days)</span>
          <span className="text-2xl font-bold text-amber-600 mt-2">{expiringSoonCount}</span>
          <span className="text-[9px] text-amber-500 mt-1 font-semibold">Short-dated shelf-life</span>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col justify-between border-l-4 border-l-green-600 cursor-pointer hover:border-slate-400 transition-all" onClick={() => setActiveFilter('SAFE')}>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Safe (&gt; 60 Days)</span>
          <span className="text-2xl font-bold text-green-700 mt-2">{safeCount}</span>
          <span className="text-[9px] text-green-600 mt-1 font-semibold">Optimal shelf lifespans</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {['ALL', 'EXPIRED', 'CRITICAL', 'EXPIRING_SOON', 'SAFE'].map(filt => {
            const label = filt === 'ALL' ? 'All' 
                        : filt === 'EXPIRED' ? 'Expired' 
                        : filt === 'CRITICAL' ? 'Critical' 
                        : filt === 'EXPIRING_SOON' ? 'Expiring Soon' 
                        : 'Safe';
            return (
              <button
                key={filt}
                onClick={() => setActiveFilter(filt)}
                className={`py-1.5 px-3 text-xs font-bold rounded-[8px] transition-all cursor-pointer ${
                  activeFilter === filt
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-slate-50 text-gray-600 hover:bg-slate-100 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search medicine or batch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-gray-300 rounded-[8px] text-xs font-semibold focus:bg-white focus:border-teal-700 focus:outline-none transition-all placeholder-gray-400 text-gray-700"
          />
        </div>
      </div>

      {/* Grid Table */}
      <div className="bg-white border border-gray-200 rounded-[10px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-slate-50 text-gray-500 font-bold uppercase text-[9px] tracking-wider text-left">
                <th className="p-3.5">Medicine Product Name</th>
                <th className="p-3.5">Batch Reference</th>
                <th 
                  className="p-3.5 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Expiration Date</span>
                    <span className="text-[10px] text-teal-650">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                  </div>
                </th>
                <th className="p-3.5">Days Remaining</th>
                <th className="p-3.5 text-center">Warning Level Alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {loading ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : sortedAlerts.length > 0 ? (
                sortedAlerts.map((alert, idx) => {
                  let alertBadge = 'text-green-700 bg-green-50 border border-green-200';
                  if (alert.status === 'Expired') {
                    alertBadge = 'text-red-700 bg-red-50 border border-red-200 animate-pulse';
                  } else if (alert.status === 'Critical') {
                    alertBadge = 'text-orange-750 bg-orange-50 border border-orange-200 font-bold';
                  } else if (alert.status === 'Expiring Soon') {
                    alertBadge = 'text-amber-700 bg-amber-50 border border-amber-200';
                  }

                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 font-bold text-gray-800">{alert.medicineName}</td>
                      <td className="p-3.5 font-mono text-gray-500">{alert.batchNumber}</td>
                      <td className="p-3.5 font-mono text-gray-600">
                        {alert.expiryDate ? new Date(alert.expiryDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-3.5 font-mono font-semibold">
                        {alert.daysRemaining < 0 ? (
                          <span className="text-red-600 font-bold">Expired ({Math.abs(alert.daysRemaining)} days ago)</span>
                        ) : alert.daysRemaining === 0 ? (
                          <span className="text-red-600 font-bold">Expires Today</span>
                        ) : (
                          <span className="text-gray-700">{alert.daysRemaining} Days</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`inline-flex px-2.5 py-0.5 text-[9px] font-bold rounded-[5px] uppercase ${alertBadge}`}>
                          {alert.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-16 text-gray-400 bg-slate-50/20">
                    <div className="flex flex-col justify-center items-center">
                      <div className="p-3 bg-slate-50 border border-slate-150 rounded-full text-slate-400 mb-3">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-bold text-gray-700">No records found.</h4>
                      <p className="text-xs text-gray-400 mt-0.5">No medicine matches the selected filters and search query.</p>
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
