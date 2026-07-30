import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  FiPackage, FiUsers, FiLayers, FiTruck, 
  FiDollarSign, FiAlertTriangle, FiClock, FiActivity,
  FiPlus, FiTrendingUp, FiShoppingBag
} from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      const res = await API.get('/api/dashboard');
      setData(res.data);
    } catch (err) {
      setError('Failed to fetch dashboard data. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl text-red-400 text-sm">
        {error}
      </div>
    );
  }

  // Define widgets depending on role
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isPharmacist = user?.role === 'ROLE_PHARMACIST';
  const isStaff = user?.role === 'ROLE_STAFF';

  // Format INR helper
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val || 0);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Title block */}
      <div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">
          {isAdmin ? 'System Administration' : isPharmacist ? 'Pharmacist Console' : 'Inventory Management'} Dashboard
        </h1>
        <p className="text-xs text-slate-400 mt-1">Real-time inventory metrics, transactional analytics and system health.</p>
      </div>

      {/* Grid widgets */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Admin Widgets */}
        {isAdmin && (
          <>
            <WidgetCard title="Inventory Value (Cost)" val={formatCurrency(data.inventoryValue)} icon={FiPackage} color="teal" />
            <WidgetCard title="Today's Revenue" val={formatCurrency(data.todayRevenue)} icon={FiTrendingUp} color="emerald" />
            <WidgetCard title="Monthly Net Profit" val={formatCurrency(data.netProfit)} icon={FiDollarSign} color={data.netProfit >= 0 ? 'emerald' : 'rose'} />
            <WidgetCard title="Low Stock Alerts" val={`${data.lowStockCount} Items`} icon={FiAlertTriangle} color={data.lowStockCount > 0 ? 'amber' : 'slate'} path="/medicines" />
            
            <WidgetCard title="Monthly Revenue" val={formatCurrency(data.monthlyRevenue)} icon={FiTrendingUp} color="teal" />
            <WidgetCard title="Monthly Expenses" val={formatCurrency(data.monthlyExpenses)} icon={FiShoppingBag} color="indigo" />
            <WidgetCard title="Expiring Batches (90d)" val={`${data.expiringCount} Batches`} icon={FiClock} color={data.expiringCount > 0 ? 'rose' : 'slate'} path="/reports" />
            <WidgetCard title="Total Staff Users" val={`${data.totalUsers} Active`} icon={FiUsers} color="slate" path="/users" />
          </>
        )}

        {/* Pharmacist Widgets */}
        {isPharmacist && (
          <>
            <WidgetCard title="Today's Sales" val={formatCurrency(data.todaySales)} icon={FiTrendingUp} color="teal" />
            <WidgetCard title="Medicines Issued (Today)" val={`${data.medicinesIssued} Units`} icon={FiPackage} color="emerald" />
            <WidgetCard title="Low Stock Items" val={`${data.lowStockCount} Alerts`} icon={FiAlertTriangle} color={data.lowStockCount > 0 ? 'amber' : 'slate'} path="/medicines" />
            <WidgetCard title="Expiring Batches (90d)" val={`${data.expiringCount} Batches`} icon={FiClock} color={data.expiringCount > 0 ? 'rose' : 'slate'} />
          </>
        )}

        {/* Staff Widgets */}
        {isStaff && (
          <>
            <WidgetCard title="Total Medicines" val={data.totalMedicines} icon={FiPackage} color="teal" path="/medicines" />
            <WidgetCard title="Low Stock Medicines" val={data.lowStockCount} icon={FiAlertTriangle} color={data.lowStockCount > 0 ? 'amber' : 'slate'} path="/medicines" />
            <WidgetCard title="Expiring Batches (90d)" val={data.expiringCount} icon={FiClock} color={data.expiringCount > 0 ? 'rose' : 'slate'} />
            <WidgetCard title="Total Categories" val={data.totalCategories} icon={FiLayers} color="slate" />
          </>
        )}
      </div>

      {/* Main Content Grid: Chart & Recent activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Custom visual chart and Shortcuts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Custom Mini Analytics Bar Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
            <h3 className="font-bold text-sm text-slate-200 mb-6 flex items-center"><FiActivity className="text-teal-400 mr-2" /> Monthly Overview Comparison</h3>
            
            {isAdmin ? (
              <div className="space-y-4">
                <ProgressBarLabel label="Sales Revenue" amount={data.monthlyRevenue} max={Math.max(data.monthlyRevenue, data.monthlyExpenses) || 1} color="from-teal-500 to-teal-400" />
                <ProgressBarLabel label="Purchase Expenses" amount={data.monthlyExpenses} max={Math.max(data.monthlyRevenue, data.monthlyExpenses) || 1} color="from-indigo-600 to-indigo-500" />
                
                <div className="pt-6 border-t border-slate-800 flex justify-between items-center text-xs">
                  <div className="text-slate-400">Net Profit margin this month:</div>
                  <div className={`font-bold text-sm ${data.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {data.netProfit >= 0 ? '+' : ''}{formatCurrency(data.netProfit)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 leading-relaxed py-6 text-center">
                Visual analytics and P&L logs are restricted to Administrators and Pharmacist profiles.
              </div>
            )}
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="font-bold text-sm text-slate-200 mb-4">Quick Shortcuts</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* Sales Invoice */}
              {(isAdmin || isPharmacist) && (
                <Link to="/sales" className="flex flex-col items-center justify-center p-4 bg-slate-850/30 hover:bg-teal-900/10 border border-slate-800/80 hover:border-teal-500/20 rounded-2xl transition-all duration-200 text-center group">
                  <FiPlus size={20} className="text-teal-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold text-slate-200">Billing Invoices</span>
                </Link>
              )}
              {/* Stock In */}
              {(isAdmin || isPharmacist) && (
                <Link to="/purchases" className="flex flex-col items-center justify-center p-4 bg-slate-850/30 hover:bg-indigo-900/10 border border-slate-800/80 hover:border-indigo-500/20 rounded-2xl transition-all duration-200 text-center group">
                  <FiPlus size={20} className="text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold text-slate-200">Order Purchases</span>
                </Link>
              )}
              {/* Add Medicine */}
              {(isAdmin || isPharmacist || isStaff) && (
                <Link to="/medicines" className="flex flex-col items-center justify-center p-4 bg-slate-850/30 hover:bg-emerald-900/10 border border-slate-800/80 hover:border-emerald-500/20 rounded-2xl transition-all duration-200 text-center group">
                  <FiPlus size={20} className="text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold text-slate-200">Manage Medicine</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Recent activity logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-[400px] flex flex-col">
          <h3 className="font-bold text-sm text-slate-200 mb-4 flex items-center">
            <FiActivity className="text-teal-400 mr-2" /> Recent Audit Activity
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
            {data.recentActivities && data.recentActivities.length > 0 ? (
              data.recentActivities.map((act, index) => (
                <div key={index} className="text-[11px] leading-relaxed text-slate-400 border-b border-slate-850/60 pb-2.5 last:border-0">
                  {act}
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 text-center py-12">
                No system activity logs found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const WidgetCard = ({ title, val, icon: Icon, color, path }) => {
  const CardContent = () => (
    <div className="bg-slate-900 hover:bg-slate-850/50 border border-slate-800/80 hover:border-slate-700/60 rounded-3xl p-6 flex items-center justify-between transition-all duration-200">
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{title}</p>
        <p className="text-xl font-black text-slate-100 tracking-tight">{val}</p>
      </div>
      <div className={`p-3 rounded-2xl ${
        color === 'teal' ? 'bg-teal-500/10 text-teal-400' :
        color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' :
        color === 'rose' ? 'bg-rose-500/10 text-rose-400' :
        color === 'amber' ? 'bg-amber-500/10 text-amber-400' :
        color === 'indigo' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-400'
      }`}>
        <Icon size={20} />
      </div>
    </div>
  );

  return path ? (
    <Link to={path} className="block transition-transform hover:-translate-y-0.5 duration-200">
      <CardContent />
    </Link>
  ) : (
    <CardContent />
  );
};

const ProgressBarLabel = ({ label, amount, max, color }) => {
  const percentage = Math.min((amount / max) * 100, 100);
  
  return (
    <div className="space-y-2 text-xs">
      <div className="flex justify-between font-semibold">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-200">
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)}
        </span>
      </div>
      <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-850">
        <div 
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
