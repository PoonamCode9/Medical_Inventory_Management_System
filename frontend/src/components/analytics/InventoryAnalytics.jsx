import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { NotificationContext } from '../../context/NotificationContext';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';

const CHART_COLORS = ['#0F766E', '#0D9488', '#14B8A6', '#2DD4BF', '#99F6E4', '#CCFBF1'];
const EXPIRES_COLORS = ['#DC2626', '#F59E0B', '#10B981'];
const STATUS_COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#EF4444'];

export default function InventoryAnalytics() {
  const { triggerToast } = useContext(NotificationContext);

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Filters State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [stockStatus, setStockStatus] = useState('ALL');
  const [expiryStatus, setExpiryStatus] = useState('ALL');

  // Load Categories & Suppliers once
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const [catsRes, suppsRes] = await Promise.all([
          api.get('/api/categories').catch(() => ({ data: { data: [] } })),
          api.get('/api/suppliers').catch(() => ({ data: { data: [] } }))
        ]);
        setCategories(catsRes.data.data || []);
        setSuppliers(suppsRes.data.data || []);
      } catch (err) {
        console.error('Error loading analytics filters:', err);
      }
    };
    loadFilterData();
  }, []);

  // Fetch Analytics on filter change
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (categoryId) params.categoryId = categoryId;
      if (supplierId) params.supplierId = supplierId;
      if (stockStatus !== 'ALL') params.stockStatus = stockStatus;
      if (expiryStatus !== 'ALL') params.expiryStatus = expiryStatus;

      const res = await api.get('/api/analytics/dashboard', { params });
      if (res.data && res.data.success) {
        setAnalytics(res.data.analytics);
      } else {
        triggerToast('Failed to retrieve analytics payload.', 'DANGER');
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      triggerToast('Error connecting to Analytics Service.', 'DANGER');
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [startDate, endDate, categoryId, supplierId, stockStatus, expiryStatus]);

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setCategoryId('');
    setSupplierId('');
    setStockStatus('ALL');
    setExpiryStatus('ALL');
  };

  const renderCard = (title, value, subtitle, colorClass = 'text-gray-800', borderLeft = '') => {
    return (
      <div className={`bg-white border border-gray-200 p-5 rounded-[12px] shadow-sm flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5 ${borderLeft}`}>
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1">{title}</span>
        <div className="flex items-baseline space-x-1.5 mt-1">
          <span className={`text-2xl font-bold ${colorClass}`}>{value}</span>
        </div>
        <span className="text-[10px] text-gray-400 mt-2 font-medium">{subtitle}</span>
      </div>
    );
  };

  const CardSkeleton = () => (
    <div className="bg-white border border-gray-200 p-5 rounded-[12px] shadow-sm flex flex-col justify-between animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-2 bg-gray-100 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Dynamic Filter Panel */}
      <div className="bg-white border border-gray-200 p-5 rounded-[12px] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Search & Analytics Filters</h2>
          <button
            onClick={handleResetFilters}
            className="text-[10px] font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 py-1.5 px-3 rounded-[8px] border border-teal-200 cursor-pointer transition-colors"
          >
            Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 font-sans text-xs">
          {/* Start Date */}
          <div className="flex flex-col space-y-1">
            <label className="font-semibold text-gray-600">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-[8px] p-2 focus:ring-1 focus:ring-teal-500 focus:outline-none bg-slate-50 font-medium text-gray-700"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col space-y-1">
            <label className="font-semibold text-gray-600">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-[8px] p-2 focus:ring-1 focus:ring-teal-500 focus:outline-none bg-slate-50 font-medium text-gray-700"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col space-y-1">
            <label className="font-semibold text-gray-600">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="border border-gray-300 rounded-[8px] p-2 focus:ring-1 focus:ring-teal-500 focus:outline-none bg-slate-50 font-medium text-gray-700"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Supplier */}
          <div className="flex flex-col space-y-1">
            <label className="font-semibold text-gray-600">Supplier</label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="border border-gray-300 rounded-[8px] p-2 focus:ring-1 focus:ring-teal-500 focus:outline-none bg-slate-50 font-medium text-gray-700"
            >
              <option value="">All Suppliers</option>
              {suppliers.map((s) => (
                <option key={s.supplierId} value={s.supplierId}>
                  {s.supplierName}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Status */}
          <div className="flex flex-col space-y-1">
            <label className="font-semibold text-gray-600">Stock Status</label>
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              className="border border-gray-300 rounded-[8px] p-2 focus:ring-1 focus:ring-teal-500 focus:outline-none bg-slate-50 font-medium text-gray-700"
            >
              <option value="ALL">All Levels</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
              <option value="NORMAL">Normal / Good</option>
            </select>
          </div>

          {/* Expiry Status */}
          <div className="flex flex-col space-y-1">
            <label className="font-semibold text-gray-600">Expiry Status</label>
            <select
              value={expiryStatus}
              onChange={(e) => setExpiryStatus(e.target.value)}
              className="border border-gray-300 rounded-[8px] p-2 focus:ring-1 focus:ring-teal-500 focus:outline-none bg-slate-50 font-medium text-gray-700"
            >
              <option value="ALL">All Expiries</option>
              <option value="EXPIRING_SOON">Expiring Soon (60d)</option>
              <option value="EXPIRED">Expired</option>
              <option value="VALID">Safe / Non-expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {loading || !analytics ? (
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
            {renderCard('Total Medicines', analytics.totalMedicines, 'Unique medicines', 'text-slate-800')}
            {renderCard('Suppliers Count', analytics.totalSuppliers, 'Distinct manufacturers')}
            {renderCard('Categories Count', analytics.totalCategories, 'Distinct therapeutic classes')}
            {renderCard('Inventory Value', `₹${analytics.totalInventoryValue.toLocaleString('en-IN')}`, 'Current valuation cost', 'text-teal-700')}
            {renderCard('Total Quantity', analytics.totalInventoryQuantity, 'Total inventory item count')}
            {renderCard('Low Stock', analytics.lowStockMedicines, 'Items near threshold', 'text-red-500', 'border-l-4 border-l-red-500')}
            {renderCard('Out Of Stock', analytics.outOfStockMedicines, 'Items depleted (0 units)', 'text-red-650', 'border-l-4 border-l-red-650')}
            {renderCard('Expiring Soon', analytics.expiringSoonMedicines, 'Expiring in 60 days', 'text-amber-500', 'border-l-4 border-l-amber-500')}
            {renderCard('Expired Medicines', analytics.expiredMedicines, 'Passed expiration dates', 'text-red-750', 'border-l-4 border-l-red-750')}
            {renderCard('Growth (30d)', `${analytics.inventoryGrowthPercentage.toFixed(1)}%`, 'Stock replenishment trend', analytics.inventoryGrowthPercentage >= 0 ? 'text-teal-600' : 'text-rose-500')}
          </>
        )}
      </div>

      {/* Advanced Charts Grid */}
      {!loading && analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Inventory by Category */}
          <div className="bg-white border border-gray-200 p-5 rounded-[12px] shadow-sm flex flex-col justify-between min-h-[350px]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Inventory by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.inventoryByCategory || []}
                      dataKey="quantity"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={80}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {(analytics.inventoryByCategory || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} units`, 'Quantity']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Chart 2: Purchase Orders by Status */}
          <div className="bg-white border border-gray-200 p-5 rounded-[12px] shadow-sm flex flex-col justify-between min-h-[350px]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Purchase Orders Status</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.purchaseOrdersByStatus || []}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {(analytics.purchaseOrdersByStatus || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Chart 3: Monthly Stock Movement */}
          <div className="bg-white border border-gray-200 p-5 rounded-[12px] shadow-sm flex flex-col justify-between min-h-[350px]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Monthly Stock Movement</h3>
              <div className="h-64 font-sans text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.monthlyStockMovementChart || []} margin={{ left: -20, right: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} />
                    <YAxis tickLine={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="stockIn" name="Stock In" fill="#0F766E" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="stockOut" name="Stock Out" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Chart 4: Expiry Status */}
          <div className="bg-white border border-gray-200 p-5 rounded-[12px] shadow-sm flex flex-col justify-between min-h-[350px]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Medicine Expiration Status</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.expiryStatus || []}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {(analytics.expiryStatus || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={EXPIRES_COLORS[index % EXPIRES_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} lines`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Chart 5: Supplier Contribution */}
          <div className="bg-white border border-gray-200 p-5 rounded-[12px] shadow-sm flex flex-col justify-between min-h-[350px]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Supplier Product Contribution (Top 10)</h3>
              <div className="h-64 font-sans text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={analytics.supplierContribution || []}
                    margin={{ left: 20, right: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tickLine={false} />
                    <YAxis dataKey="name" type="category" tickLine={false} width={100} />
                    <Tooltip />
                    <Bar dataKey="value" name="Medicines Supplied" fill="#0D9488" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Chart 6: Weekly Inventory Trend */}
          <div className="bg-white border border-gray-200 p-5 rounded-[12px] shadow-sm flex flex-col justify-between min-h-[350px]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Weekly Inventory Quantity Trend</h3>
              <div className="h-64 font-sans text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.weeklyInventoryTrend || []} margin={{ left: -10, right: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tickFormatter={(str) => str.substring(5)} tickLine={false} />
                    <YAxis tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="quantity" name="Inventory Qty" stroke="#0F766E" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Row 3: Transaction logs & Notification Analytics */}
      {!loading && analytics && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent stock movements */}
          <div className="bg-white border border-gray-200 p-5 rounded-[12px] shadow-sm min-h-[300px]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Filtered Stock Movements</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-medium text-gray-700">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider text-[10px]">
                    <th className="py-2 text-left">Medicine</th>
                    <th className="py-2 text-left">Action</th>
                    <th className="py-2 text-left">Qty Shift</th>
                    <th className="py-2 text-left">Reason</th>
                    <th className="py-2 text-left">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-sans">
                  {analytics.recentStockTransactions.length > 0 ? (
                    analytics.recentStockTransactions.map((log) => {
                      const qtyDiff = log.newQuantity - log.oldQuantity;
                      const absDiff = Math.abs(qtyDiff);
                      return (
                        <tr key={log.stockLogId} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 font-semibold text-gray-800">{log.medicine?.medicineName}</td>
                          <td className="py-2.5">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                              log.action === 'STOCK_IN' ? 'bg-teal-50 text-teal-700' :
                              log.action === 'STOCK_OUT' ? 'bg-rose-50 text-rose-600' :
                              'bg-indigo-50 text-indigo-700'
                            }`}>
                              {log.action}
                            </span>
                          </td>
                          <td className="py-2.5 font-bold">
                            {qtyDiff >= 0 ? '+' : '-'}{absDiff}
                          </td>
                          <td className="py-2.5 text-gray-500 max-w-[150px] truncate" title={log.reason}>
                            {log.reason || 'N/A'}
                          </td>
                          <td className="py-2.5 text-gray-400 font-medium">
                            {new Date(log.updatedAt).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-400 font-bold">
                        No movement logs matched.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Supplier Metrics & Notification Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Top suppliers stats */}
            <div className="bg-white border border-gray-200 p-5 rounded-[12px] shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Supplier Leaderboard</h3>
              
              <div className="space-y-3 font-sans text-xs">
                <div>
                  <span className="block text-[10px] text-gray-450 font-bold uppercase">Largest Catalog Supplier</span>
                  <span className="text-sm font-bold text-gray-800">
                    {analytics.supplierHighestMedicines?.supplierName || 'None'}
                  </span>
                  <span className="block text-[10px] text-teal-600 font-medium">
                    {analytics.supplierHighestMedicines ? 'Most diverse medicinal items' : 'No suppliers registered'}
                  </span>
                </div>

                <div className="border-t border-gray-150 pt-3">
                  <span className="block text-[10px] text-gray-450 font-bold uppercase">Highest PO Frequency</span>
                  <span className="text-sm font-bold text-gray-800">
                    {analytics.supplierHighestPurchases?.supplierName || 'None'}
                  </span>
                  <span className="block text-[10px] text-teal-600 font-medium">
                    {analytics.supplierHighestPurchases ? 'Most frequent procurement partner' : 'No purchases processed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Notification logs count */}
            <div className="bg-white border border-gray-200 p-5 rounded-[12px] shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Alerts System Load</h3>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-50 border border-gray-200 p-3 rounded-[8px]">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase">Unread</span>
                  <span className="block text-lg font-extrabold text-red-500">{analytics.unreadNotifications}</span>
                </div>
                <div className="bg-slate-50 border border-gray-200 p-3 rounded-[8px]">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase">Total Logged</span>
                  <span className="block text-lg font-extrabold text-slate-700">{analytics.totalNotifications}</span>
                </div>
                <div className="bg-slate-50 border border-gray-200 p-3 rounded-[8px]">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase">Alerts Today</span>
                  <span className="block text-lg font-extrabold text-amber-500">{analytics.notificationsToday}</span>
                </div>
                <div className="bg-slate-50 border border-gray-200 p-3 rounded-[8px]">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase">This Week</span>
                  <span className="block text-lg font-extrabold text-blue-500">{analytics.notificationsThisWeek}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
