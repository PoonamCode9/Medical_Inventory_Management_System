import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NotificationContext } from '../../context/NotificationContext';
import { AuthContext } from '../../context/AuthContext';

export default function NotificationDrawer({ isOpen, onClose }) {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearReadNotifications 
  } = useContext(NotificationContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const isAdmin = user?.role === 'ADMIN';

  if (!isOpen) return null;

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

  // Function to return severity color class
  const getSeverityStyle = (type, priority) => {
    const isCritical = 
      type === 'OUT_OF_STOCK' || 
      type === 'EXPIRED' || 
      type === 'CRITICAL' || 
      priority === 'HIGH';
    const isWarning = 
      type === 'LOW_STOCK' || 
      type === 'WARNING';
    const isSuccess = 
      type === 'SUCCESS';

    if (isCritical) {
      return {
        badgeBg: 'bg-red-50 text-red-700 border-red-200',
        borderLeft: 'border-l-4 border-l-red-600',
        iconColor: 'text-red-600',
      };
    }
    if (isWarning) {
      return {
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
        borderLeft: 'border-l-4 border-l-amber-500',
        iconColor: 'text-amber-500',
      };
    }
    if (isSuccess) {
      return {
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        borderLeft: 'border-l-4 border-l-emerald-600',
        iconColor: 'text-emerald-600',
      };
    }
    return {
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
      borderLeft: 'border-l-4 border-l-blue-600',
      iconColor: 'text-blue-600',
    };
  };

  const handleNotificationClick = (module) => {
    onClose();
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

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-[9990] transition-opacity duration-300 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[9991] flex flex-col h-full transform transition-transform duration-300 animate-slide-in">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="font-bold text-gray-900 text-base flex items-center space-x-2">
              <span>System Alerts</span>
              {unreadCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </h3>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">Real-time status updates</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-4 py-2 bg-white border-b border-gray-100 flex justify-between items-center text-[11px] font-semibold text-gray-500">
          <button 
            onClick={() => markAllAsRead(user?.email)}
            className="hover:text-teal-700 transition-colors flex items-center space-x-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Mark all read</span>
          </button>

          <button 
            onClick={clearReadNotifications}
            className="hover:text-red-700 transition-colors flex items-center space-x-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear read</span>
          </button>
        </div>

        {/* Drawer Body - Scrollable Notifications */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <p className="text-xs font-bold text-gray-500">No active alerts</p>
              <p className="text-[10px] text-gray-400 mt-1 max-w-[200px]">You will receive notification alerts when system events occur.</p>
            </div>
          ) : (
            notifications.map((n) => {
              const styles = getSeverityStyle(n.type, n.priority);
              return (
                <div 
                  key={n.notificationId}
                  className={`bg-white rounded-[10px] shadow-sm border border-gray-100 p-3 relative transition-all hover:shadow-md ${styles.borderLeft} ${!n.isRead ? 'bg-teal-50/10' : ''}`}
                >
                  <div 
                    onClick={() => handleNotificationClick(n.relatedModule)}
                    className="flex items-start space-x-2.5 cursor-pointer hover:opacity-85"
                    title="Navigate to related module"
                  >
                    {/* Icon based on read status / type */}
                    <div className={`mt-0.5 ${styles.iconColor}`}>
                      {!n.isRead ? (
                        <span className="flex h-2.5 w-2.5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                        </span>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 pr-6">
                      <div className="flex items-center space-x-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-gray-900 leading-tight">
                          {n.title}
                        </span>
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border uppercase leading-none ${styles.badgeBg}`}>
                          {n.type}
                        </span>
                      </div>
                      
                      <p className="text-[10px] text-gray-600 mt-1 leading-normal font-medium">
                        {n.message}
                      </p>

                      <div className="flex items-center space-x-2 mt-2 text-[9px] text-gray-400 font-bold">
                        <span className="bg-slate-100 text-slate-600 px-1 py-0.5 rounded border border-slate-200 uppercase tracking-wide text-[7px]">{n.relatedModule}</span>
                        <span>•</span>
                        <span>{getRelativeTime(n.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Column (Mark Read / Delete) */}
                  <div className="absolute right-2.5 top-2.5 flex items-center space-x-1">
                    {!n.isRead && (
                      <button 
                        onClick={() => markAsRead(n.notificationId)}
                        className="text-gray-400 hover:text-teal-600 p-1 rounded transition-colors"
                        title="Mark read"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                    
                    {isAdmin && (
                      <button 
                        onClick={() => deleteNotification(n.notificationId)}
                        className="text-gray-300 hover:text-red-600 p-1 rounded transition-colors"
                        title="Delete alert"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <Link
            to="/notifications"
            onClick={onClose}
            className="w-full py-2 bg-teal-800 hover:bg-teal-900 text-white text-[11px] font-extrabold rounded-[8px] flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
          >
            <span>View Full Notification Hub</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}
