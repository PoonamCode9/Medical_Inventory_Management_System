import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import ChatbotWidget from './ChatbotWidget';
import { 
  FiGrid, FiPackage, FiFolder, FiTruck, FiShoppingCart, 
  FiTrendingUp, FiFileText, FiUsers, FiActivity, 
  FiBell, FiLogOut, FiMenu, FiX, FiCheckCircle
} from 'react-icons/fi';

const Layout = ({ children }) => {
  const { user, logout, hasRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/api/notifications/unread');
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await API.put(`/api/notifications/${id}/read`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.put('/api/notifications/read-all');
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: FiGrid, roles: ['ROLE_ADMIN', 'ROLE_PHARMACIST', 'ROLE_STAFP', 'ROLE_STAFF'] },
    { name: 'Medicines', path: '/medicines', icon: FiPackage, roles: ['ROLE_ADMIN', 'ROLE_PHARMACIST', 'ROLE_STAFF'] },
    { name: 'Categories', path: '/categories', icon: FiFolder, roles: ['ROLE_ADMIN', 'ROLE_PHARMACIST', 'ROLE_STAFF'] },
    { name: 'Suppliers', path: '/suppliers', icon: FiTruck, roles: ['ROLE_ADMIN', 'ROLE_PHARMACIST', 'ROLE_STAFF'] },
    { name: 'Stock In (Purchases)', path: '/purchases', icon: FiShoppingCart, roles: ['ROLE_ADMIN', 'ROLE_PHARMACIST'] },
    { name: 'Billing & Sales', path: '/sales', icon: FiTrendingUp, roles: ['ROLE_ADMIN', 'ROLE_PHARMACIST'] },
    { name: 'Reports', path: '/reports', icon: FiFileText, roles: ['ROLE_ADMIN', 'ROLE_PHARMACIST'] },
    { name: 'User Management', path: '/users', icon: FiUsers, roles: ['ROLE_ADMIN'] },
    { name: 'Audit Logs', path: '/audit-logs', icon: FiActivity, roles: ['ROLE_ADMIN'] }
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 transform md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-teal-900/40 to-slate-900">
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 rounded-lg bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">MediStock</h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Enterprise Edition</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-white md:hidden" onClick={() => setSidebarOpen(false)}>
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="px-4 py-6 space-y-1 overflow-y-auto h-[calc(100vh-70px)]">
          {menuItems.map((item) => {
            if (item.roles && !item.roles.includes(user?.role)) return null;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-600/10 font-medium' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}
              >
                <item.icon size={18} className={active ? 'text-white' : 'text-slate-400'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Panel */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 relative z-20">
          <div className="flex items-center space-x-4">
            <button className="text-slate-400 hover:text-white md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <FiMenu size={22} />
            </button>
            <div className="hidden md:flex flex-col">
              <h2 className="text-sm font-semibold text-slate-400">Welcome back,</h2>
              <h1 className="text-base font-bold text-slate-100">{user?.firstName} {user?.lastName}</h1>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)} 
                className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
              >
                <FiBell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-slate-900 animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden ring-1 ring-black ring-opacity-5">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-800/60 border-b border-slate-800">
                    <span className="font-semibold text-sm">Notifications ({notifications.length})</span>
                    {notifications.length > 0 && (
                      <button onClick={markAllAsRead} className="text-xs text-teal-400 hover:text-teal-300 font-medium">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-850">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-slate-500 text-sm">
                        No new stock or expiry alerts!
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="p-3.5 flex items-start justify-between hover:bg-slate-850/50 transition-colors">
                          <div className="pr-3 text-xs leading-relaxed text-slate-300">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${n.type === 'LOW_STOCK' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                            {n.message}
                          </div>
                          <button onClick={() => markAsRead(n.id)} className="text-slate-500 hover:text-emerald-400 p-0.5 rounded-lg">
                            <FiCheckCircle size={15} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-800">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs text-slate-400 font-medium">{user?.role === 'ROLE_ADMIN' ? 'Administrator' : user?.role === 'ROLE_PHARMACIST' ? 'Pharmacist' : 'Staff'}</span>
                <span className="text-xs text-slate-500">{user?.email}</span>
              </div>
              <button 
                onClick={logout} 
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/80 rounded-xl transition-colors"
                title="Logout"
              >
                <FiLogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-950 p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Floating AI Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
};

export default Layout;
