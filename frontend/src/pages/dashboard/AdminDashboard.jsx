import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import InventoryAnalytics from '../../components/analytics/InventoryAnalytics';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');

  // Stats variables from dashboard summary API
  const [medicinesCount, setMedicinesCount] = useState(0);
  const [inventoryValue, setInventoryValue] = useState(0);
  const [suppliersCount, setSuppliersCount] = useState(0);
  const [usersCount, setUsersCount] = useState(1);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [goodStockCount, setGoodStockCount] = useState(0);
  const [expiringSoonCount, setExpiringSoonCount] = useState(0);
  const [purchaseOrdersCount, setPurchaseOrdersCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [expiredMedicinesCount, setExpiredMedicinesCount] = useState(0);

  // Category distribution
  const [categoryMetrics, setCategoryMetrics] = useState([]);

  // Recent logs
  const [activities, setActivities] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [summaryRes, logsRes, lowStockRes] = await Promise.all([
        api.get('/api/dashboard/summary'),
        api.get('/api/inventory/logs').catch(() => null),
        api.get('/api/inventory/low-stock').catch(() => null)
      ]);

      if (summaryRes.data && summaryRes.data.success) {
        const d = summaryRes.data.data;
        setMedicinesCount(d.totalMedicines || 0);
        setInventoryValue(d.inventoryValue || 0);
        setSuppliersCount(d.suppliers || 0);
        setUsersCount(d.users || 1);
        setLowStockCount(d.lowStock || 0);
        setOutOfStockCount(d.outOfStock || 0);
        setGoodStockCount(d.goodStock || 0);
        setExpiringSoonCount(d.expiringMedicines || 0);
        setPurchaseOrdersCount(d.purchaseOrders || 0);
        setCategoriesCount(d.totalCategories || 0);
        setExpiredMedicinesCount(d.expiredMedicines || 0);
        setCategoryMetrics(d.categoryMetrics || []);
      }

      if (logsRes && logsRes.data && Array.isArray(logsRes.data.data)) {
        const sorted = logsRes.data.data
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 5)
          .map(log => ({
            id: log.stockLogId,
            action: log.action,
            detail: `${log.medicine?.medicineName || 'Product'} (Previous: ${log.oldQuantity} -> Current: ${log.newQuantity})`,
            time: log.updatedAt ? new Date(log.updatedAt).toLocaleTimeString() : 'Just now'
          }));
        setActivities(sorted);
      }

      if (lowStockRes && lowStockRes.data && Array.isArray(lowStockRes.data.data)) {
        setLowStockItems(lowStockRes.data.data.slice(0, 5));
      }
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const handleWriteSuccess = () => {
      fetchDashboardData();
    };
    window.addEventListener('api-write-success', handleWriteSuccess);
    return () => {
      window.removeEventListener('api-write-success', handleWriteSuccess);
    };
  }, []);

  const handleAction = (action) => {
    switch (action) {
      case 'CREATE_USER':
        navigate('/user-management');
        break;
      case 'ADD_MEDICINE':
        navigate('/medicines');
        break;
      case 'ADD_SUPPLIER':
        navigate('/suppliers');
        break;
      case 'GENERATE_REPORT':
        navigate('/reports');
        break;
      default:
        break;
    }
  };

  const renderCategoryDistribution = () => {
    if (categoryMetrics.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center py-10 text-center h-full">
          <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" />
          </svg>
          <p className="text-xs text-gray-400 font-bold">No inventory metrics loaded.</p>
          <button 
            onClick={() => navigate('/medicines')} 
            className="mt-2 text-[10px] font-bold text-teal-700 hover:text-teal-800 bg-teal-50 border border-teal-200 py-1 px-2.5 rounded-[8px] cursor-pointer"
          >
            + Register Medicine
          </button>
        </div>
      );
    }

    const maxVal = Math.max(...categoryMetrics.map(c => c.count), 1);

    return (
      <div className="space-y-4 w-full max-h-56 overflow-y-auto pr-1">
        {categoryMetrics.map((c) => {
          const pct = (c.count / maxVal) * 100;
          return (
            <div key={c.name} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-gray-700">
                <span>{c.name}</span>
                <span className="font-mono text-gray-400">{c.count} items</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
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
          <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2" />
          </svg>
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
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-2.5 bg-gray-100 rounded w-1/3"></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">System Admin Console</h1>
          <p className="text-xs text-gray-500">Real-time status analysis of live database counts, procurement lists, and warnings.</p>
        </div>
        {activeTab === 'overview' && (
          <button 
            onClick={fetchDashboardData}
            className="py-1.5 px-3 border border-gray-300 hover:bg-slate-100 text-gray-700 text-xs font-bold rounded-card cursor-pointer flex items-center gap-1.5"
            title="Reload Dashboard metrics"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18" />
            </svg>
            Sync
          </button>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-4 font-bold text-xs border-b-2 cursor-pointer transition-colors ${
            activeTab === 'overview'
              ? 'border-teal-700 text-teal-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Console Overview
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-2 px-4 font-bold text-xs border-b-2 cursor-pointer transition-colors ${
            activeTab === 'analytics'
              ? 'border-teal-700 text-teal-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Inventory Analytics
        </button>
      </div>

      {activeTab === 'analytics' ? (
        <InventoryAnalytics />
      ) : (
        <>
          {/* Row 1: KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            {/* Total Medicines */}
            <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Medicines</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-2xl font-bold text-gray-800">{medicinesCount}</span>
              </div>
              <span className="text-[10px] text-teal-700 hover:underline mt-1 font-semibold cursor-pointer" onClick={() => navigate('/medicines')}>
                View Catalog &rarr;
              </span>
            </div>

            {/* Inventory Value */}
            <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Inventory Value</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-2xl font-bold text-gray-800">₹{inventoryValue.toLocaleString('en-IN')}</span>
              </div>
              <span className="text-[10px] text-gray-450 mt-1">Total valuation cost</span>
            </div>

            {/* Total Categories */}
            <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Categories</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-2xl font-bold text-gray-800">{categoriesCount}</span>
              </div>
              <span className="text-[10px] text-teal-700 hover:underline mt-1 font-semibold cursor-pointer" onClick={() => navigate('/categories')}>
                Manage categories &rarr;
              </span>
            </div>

            {/* Suppliers */}
            <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Suppliers</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-2xl font-bold text-gray-800">{suppliersCount}</span>
              </div>
              <span className="text-[10px] text-teal-700 hover:underline mt-1 font-semibold cursor-pointer" onClick={() => navigate('/suppliers')}>
                Affiliated labs &rarr;
              </span>
            </div>

            {/* Users */}
            <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">System Users</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-2xl font-bold text-gray-800">{usersCount}</span>
              </div>
              <span className="text-[10px] text-teal-700 hover:underline mt-1 font-semibold cursor-pointer" onClick={() => navigate('/user-management')}>
                User directory &rarr;
              </span>
            </div>

            {/* Low Stock */}
            <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col justify-between border-l-4 border-l-red-600">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Low Stock Alerts</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-2xl font-bold text-red-650">{lowStockCount}</span>
              </div>
              <span className="text-[10px] text-teal-700 hover:underline mt-1 font-semibold cursor-pointer" onClick={() => navigate('/inventory')}>
                Manage stock &rarr;
              </span>
            </div>

            {/* Expired Medicines */}
            <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col justify-between border-l-4 border-l-red-600">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Expired Medicines</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-2xl font-bold text-red-655">{expiredMedicinesCount}</span>
              </div>
              <span className="text-[10px] text-teal-700 hover:underline mt-1 font-semibold cursor-pointer" onClick={() => navigate('/expiry')}>
                Review expired &rarr;
              </span>
            </div>

            {/* Expiring Soon */}
            <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col justify-between border-l-4 border-l-amber-500">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Expiring Soon</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-2xl font-bold text-amber-600">{expiringSoonCount}</span>
              </div>
              <span className="text-[10px] text-teal-700 hover:underline mt-1 font-semibold cursor-pointer" onClick={() => navigate('/expiry')}>
                Review dates &rarr;
              </span>
            </div>

            {/* Purchase Orders */}
            <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Purchase Orders</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-2xl font-bold text-gray-800">{purchaseOrdersCount}</span>
              </div>
              <span className="text-[10px] text-teal-700 hover:underline mt-1 font-semibold cursor-pointer" onClick={() => navigate('/purchase-orders')}>
                Active orders &rarr;
              </span>
            </div>
          </>
        )}
      </div>

      {/* Row 2: Live Charts Visualization (Category distribution & Stock Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
        {/* Category distribution chart */}
        <div className="bg-white border border-gray-200 p-5 rounded-[10px] shadow-sm flex flex-col justify-between min-h-[280px]">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              Category Product Distribution
            </h3>
            {loading ? (
              <div className="space-y-3">
                <div className="h-6 bg-slate-100 rounded w-full animate-pulse"></div>
                <div className="h-6 bg-slate-100 rounded w-full animate-pulse"></div>
              </div>
            ) : (
              renderCategoryDistribution()
            )}
          </div>
        </div>

        {/* Stock Level distribution gauge */}
        <div className="bg-white border border-gray-200 p-5 rounded-[10px] shadow-sm flex flex-col justify-between min-h-[280px]">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              Inventory Buffer Status Gauge
            </h3>
            {loading ? (
              <div className="space-y-3">
                <div className="h-8 bg-slate-100 rounded w-full animate-pulse"></div>
                <div className="h-10 bg-slate-100 rounded w-full animate-pulse"></div>
              </div>
            ) : (
              renderStockLevelsGauge()
            )}
          </div>
        </div>
      </div>

      {/* Row 3: System Logs, Low Stock & Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 font-sans">
        {/* Recent logs */}
        <div className="bg-white border border-gray-200 p-5 rounded-[10px] shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">System Movement Logs</h3>
            {loading ? (
              <div className="space-y-4">
                <div className="h-6 bg-gray-150 rounded w-full animate-pulse"></div>
                <div className="h-6 bg-gray-100 rounded w-full animate-pulse"></div>
              </div>
            ) : activities.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="pb-2">Event</th>
                      <th className="pb-2">Details</th>
                      <th className="pb-2">Log Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((act) => (
                      <tr key={act.id} className="border-b border-gray-100">
                        <td className="py-2.5 font-bold text-gray-850">
                          <span className={`px-2 py-0.5 rounded-[5px] text-[10px] font-bold ${
                            act.action === 'STOCK_IN' || act.action === 'CREATE' ? 'bg-teal-50 text-teal-800 border border-teal-100' :
                            act.action === 'STOCK_OUT' ? 'bg-red-50 text-red-755 border border-red-100' : 'bg-slate-50 text-slate-700'
                          }`}>
                            {act.action}
                          </span>
                        </td>
                        <td className="py-2.5 text-gray-500 font-medium">{act.detail}</td>
                        <td className="py-2.5 text-gray-400 font-mono">{act.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center py-10 text-center">
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-full text-slate-355 mb-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h4 className="text-xs font-bold text-gray-700">No activity logs found.</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Logs will automatically accumulate as records are added.</p>
              </div>
            )}
          </div>
        </div>

        {/* Critical Low Stock */}
        <div className="bg-white border border-gray-200 p-5 rounded-[10px] shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Critical Low Stock</h3>
            {loading ? (
              <div className="space-y-4">
                <div className="h-6 bg-gray-150 rounded w-full animate-pulse"></div>
                <div className="h-6 bg-gray-100 rounded w-full animate-pulse"></div>
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
                <div className="p-3 bg-teal-50 border border-teal-150 rounded-full text-teal-700 mb-3 animate-pulse">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h4 className="text-xs font-bold text-gray-700">All stocks optimal</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">No stock lines are currently below minimum thresholds.</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions panel */}
        <div className="bg-white border border-gray-200 p-5 rounded-[10px] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Quick Administrator Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleAction('CREATE_USER')}
                className="flex items-center justify-between p-3 border border-gray-200 hover:border-teal-600 text-gray-700 hover:text-teal-700 rounded-[10px] text-xs font-semibold transition-all text-left bg-slate-50 hover:bg-white cursor-pointer"
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2.5 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Create User Account</span>
                </div>
                <span className="text-[10px] text-gray-400">Admin</span>
              </button>

              <button
                onClick={() => handleAction('ADD_MEDICINE')}
                className="flex items-center justify-between p-3 border border-gray-200 hover:border-teal-600 text-gray-700 hover:text-teal-700 rounded-[10px] text-xs font-semibold transition-all text-left bg-slate-50 hover:bg-white cursor-pointer"
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2.5 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0h-3m-9-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Add Medicine Stock</span>
                </div>
                <span className="text-[10px] text-gray-400">Catalog</span>
              </button>

              <button
                onClick={() => handleAction('ADD_SUPPLIER')}
                className="flex items-center justify-between p-3 border border-gray-200 hover:border-teal-600 text-gray-700 hover:text-teal-700 rounded-[10px] text-xs font-semibold transition-all text-left bg-slate-50 hover:bg-white cursor-pointer"
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2.5 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857" />
                  </svg>
                  <span>Add New Supplier</span>
                </div>
                <span className="text-[10px] text-gray-400">Procure</span>
              </button>

              <button
                onClick={() => handleAction('GENERATE_REPORT')}
                className="flex items-center justify-between p-3 border border-gray-200 hover:border-teal-600 text-gray-700 hover:text-teal-700 rounded-[10px] text-xs font-semibold transition-all text-left bg-slate-50 hover:bg-white cursor-pointer"
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2.5 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Generate Operations Report</span>
                </div>
                <span className="text-[10px] text-gray-400">Export</span>
              </button>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 text-[10px] text-gray-400 text-center font-medium leading-relaxed">
            All system console entries are cryptographically audit-trailed.
          </div>
        </div>
      </div>
    </>
  )}
</div>

  );
}
