import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../../context/NotificationContext';
import { AuthContext } from '../../context/AuthContext';

export default function Notifications() {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    fetchNotifications,
    deleteNotification,
    clearReadNotifications
  } = useContext(NotificationContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const roleName = user?.role || '';
  const canWrite = roleName.includes('ADMIN') || roleName.includes('PHARMACIST');
  const isAdmin = roleName.includes('ADMIN');

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL', 'INFO', 'WARNING', 'DANGER'
  const [readFilter, setReadFilter] = useState('ALL'); // 'ALL', 'UNREAD', 'READ'

  // Format timestamp to relative time string
  const getRelativeTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = 
      (n.title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (n.message?.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (readFilter === 'UNREAD' && n.isRead) return false;
    if (readFilter === 'READ' && !n.isRead) return false;

    if (typeFilter !== 'ALL' && n.type !== typeFilter) return false;

    return true;
  });

  const getSeverityBadge = (type) => {
    switch (type) {
      case 'DANGER':
      case 'EXPIRED':
      case 'CRITICAL':
      case 'OUT_OF_STOCK':
        return (
          <span className="px-2 py-0.5 rounded-[5px] text-[9px] font-bold bg-red-50 text-red-700 border border-red-100">
            Critical
          </span>
        );
      case 'WARNING':
      case 'LOW_STOCK':
      case 'EXPIRY_ALERT':
        return (
          <span className="px-2 py-0.5 rounded-[5px] text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
            Warning
          </span>
        );
      case 'SUCCESS':
        return (
          <span className="px-2 py-0.5 rounded-[5px] text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            Success
          </span>
        );
      case 'INFO':
      default:
        return (
          <span className="px-2 py-0.5 rounded-[5px] text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
            System Info
          </span>
        );
    }
  };

  const handleNotificationClick = (module) => {
    if (!module) return;
    const mod = module.toUpperCase();
    if (mod.includes('MEDICINE')) {
      navigate('/medicines');
    } else if (mod.includes('INVENTORY')) {
      navigate('/inventory');
    } else if (mod.includes('PURCHASE') || mod.includes('ORDER')) {
      navigate('/purchase-orders');
    } else if (mod.includes('EXPIRY')) {
      navigate('/expiry');
    } else if (mod.includes('SUPPLIER')) {
      navigate('/suppliers');
    } else if (mod.includes('REPORT')) {
      navigate('/reports');
    }
  };

  const NotificationSkeleton = () => (
    <div className="p-4 border-b border-gray-150 bg-white flex items-start space-x-3 animate-pulse">
      <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-2"></div>
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-gray-250 rounded w-1/4"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        <div className="h-2.5 bg-gray-100 rounded w-12 mt-1"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">System Notification Hub</h1>
          <p className="text-xs text-gray-500">Track critical storage temperatures, lower stock buffers, and audit registrations.</p>
        </div>
        
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchNotifications}
            className="py-1.5 px-3 border border-gray-300 hover:bg-slate-100 text-gray-700 text-xs font-bold rounded-card cursor-pointer flex items-center gap-1.5"
            title="Refresh Notification Database"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18" />
            </svg>
            Sync
          </button>

          {canWrite && notifications.length > unreadCount && (
            <button
              onClick={clearReadNotifications}
              className="py-1.5 px-3 border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold rounded-card cursor-pointer shadow-sm flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Clear Read</span>
            </button>
          )}
          
          {canWrite && unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead(user?.email)}
              className="py-1.5 px-3 bg-[#0F766E] hover:bg-teal-800 text-white text-xs font-bold rounded-card cursor-pointer shadow-sm"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Tabs, Filter & Search Row */}
      <div className="bg-white border border-gray-200 p-4 rounded-[10px] shadow-sm space-y-4 md:space-y-0 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Read status filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] uppercase font-bold text-gray-400 font-sans">Read:</span>
            <select
              value={readFilter}
              onChange={(e) => setReadFilter(e.target.value)}
              className="bg-slate-50 border border-gray-300 rounded-[8px] py-1 px-2.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-teal-700"
            >
              <option value="ALL">All ({notifications.length})</option>
              <option value="UNREAD">Unread ({unreadCount})</option>
              <option value="READ">Read ({notifications.length - unreadCount})</option>
            </select>
          </div>

          {/* Type filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] uppercase font-bold text-gray-400 font-sans">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 border border-gray-300 rounded-[8px] py-1 px-2.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-teal-700"
            >
              <option value="ALL">All Types</option>
              <option value="INFO">System Info</option>
              <option value="WARNING">Warnings</option>
              <option value="DANGER">Critical Alerts</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search alerts or messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-gray-300 rounded-[8px] text-xs font-semibold focus:bg-white focus:border-teal-700 focus:outline-none transition-all placeholder-gray-400 text-gray-700"
          />
        </div>
      </div>

      {/* Main List Box */}
      <div className="bg-white border border-gray-200 rounded-[10px] shadow-sm overflow-hidden divide-y divide-gray-150">
        {loading ? (
          <>
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </>
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => {
            return (
              <div
                key={notif.notificationId}
                className={`p-4 flex items-start space-x-3.5 transition-all ${
                  notif.isRead ? 'bg-white opacity-85' : 'bg-teal-50/20'
                }`}
              >
                {/* Status Dot indicator */}
                <div className="mt-2.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    notif.isRead 
                      ? 'bg-slate-300' 
                      : notif.type === 'DANGER' || notif.type === 'EXPIRED' || notif.type === 'OUT_OF_STOCK'
                      ? 'bg-red-500 animate-ping' 
                      : 'bg-teal-650'
                  }`} />
                </div>

                {/* Content details */}
                <div 
                  onClick={() => handleNotificationClick(notif.relatedModule)}
                  className="flex-1 min-w-0 cursor-pointer hover:opacity-80"
                  title="Navigate to related module"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className={`text-xs font-bold truncate ${
                      notif.isRead ? 'text-gray-600' : 'text-gray-900'
                    }`}>
                      {notif.title}
                    </h3>
                    {getSeverityBadge(notif.type)}
                  </div>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    {notif.message}
                  </p>
                  
                  <div className="flex items-center space-x-2 mt-2 text-[9px] text-gray-400 font-bold">
                    <span className="bg-slate-100 text-slate-600 px-1 py-0.5 rounded border border-slate-200 uppercase tracking-wide text-[7px]">{notif.relatedModule}</span>
                    <span>•</span>
                    <span>{getRelativeTime(notif.createdAt)}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {canWrite && !notif.isRead && (
                    <button
                      onClick={() => markAsRead(notif.notificationId)}
                      className="py-1 px-2 border border-gray-200 hover:border-teal-700 text-gray-500 hover:text-teal-750 font-bold rounded-[6px] text-[10px] cursor-pointer bg-white transition-colors"
                    >
                      Mark read
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => deleteNotification(notif.notificationId)}
                      className="py-1 px-2 border border-red-200 hover:border-red-650 text-red-500 hover:text-red-700 font-bold rounded-[6px] text-[10px] cursor-pointer bg-white transition-colors"
                      title="Delete Notification"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col justify-center items-center py-16 text-center bg-slate-50/20">
            <div className="p-3 bg-slate-50 border border-slate-150 rounded-full text-slate-400 mb-3.5">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-xs font-bold text-gray-500">No warnings or logs found.</p>
            <p className="text-[10px] text-gray-400 mt-1 max-w-xs leading-normal">Your system catalog and stock lines are fully balanced with target buffer thresholds.</p>
          </div>
        )}
      </div>
    </div>
  );
}
