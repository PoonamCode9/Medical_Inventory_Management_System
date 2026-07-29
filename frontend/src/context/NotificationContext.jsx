import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Trigger Toast Notification
  const triggerToast = useCallback((message, type = 'SUCCESS') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch from PostgreSQL DB
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/notifications');
      if (res.data && res.data.success) {
        const list = res.data.data || [];
        setNotifications(list);
        setUnreadCount(list.filter((n) => !n.isRead).length);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark notification read
  const markAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.notificationId === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking read:', err);
      triggerToast('Unable to update notification status.', 'DANGER');
    }
  };

  // Mark all notifications read
  const markAllAsRead = async () => {
    try {
      await api.put('/api/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      triggerToast('All notifications marked as read.', 'SUCCESS');
    } catch (err) {
      console.error('Error marking all read:', err);
      triggerToast('Unable to update notifications.', 'DANGER');
    }
  };

  // Delete notification (Admin only)
  const deleteNotification = async (id) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications((prev) => {
        const updated = prev.filter((n) => n.notificationId !== id);
        setUnreadCount(updated.filter((n) => !n.isRead).length);
        return updated;
      });
      triggerToast('Notification deleted successfully.', 'SUCCESS');
    } catch (err) {
      console.error('Error deleting notification:', err);
      triggerToast('Unable to delete notification.', 'DANGER');
    }
  };

  // Clear read notifications
  const clearReadNotifications = async () => {
    try {
      await api.delete('/api/notifications/clear-read');
      setNotifications((prev) => {
        const updated = prev.filter((n) => !n.isRead);
        setUnreadCount(updated.filter((n) => !n.isRead).length);
        return updated;
      });
      triggerToast('Read notifications cleared.', 'SUCCESS');
    } catch (err) {
      console.error('Error clearing read notifications:', err);
      triggerToast('Unable to clear notifications.', 'DANGER');
    }
  };

  // Check on load and periodically
  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('token');
    if (token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000); // Poll every 10 seconds for real-time feel
      return () => clearInterval(interval);
    }
  }, [fetchNotifications]);

  // Listen to successful database writes to instantly update notifications
  useEffect(() => {
    const handleWriteSuccess = () => {
      fetchNotifications();
    };
    window.addEventListener('api-write-success', handleWriteSuccess);
    return () => {
      window.removeEventListener('api-write-success', handleWriteSuccess);
    };
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        triggerToast,
        removeToast,
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearReadNotifications,
      }}
    >
      {children}

      {/* Render Toast notifications in consistent stacking container */}
      <div className="fixed bottom-5 right-5 space-y-2 z-[9999] max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto p-4 rounded-[10px] shadow-lg border text-xs font-bold text-white flex items-center justify-between transition-all duration-350 cursor-pointer animate-fade-in hover:opacity-90 ${
              toast.type === 'DANGER'
                ? 'bg-red-700 border-red-600'
                : toast.type === 'WARNING'
                ? 'bg-amber-600 border-amber-500'
                : toast.type === 'INFO'
                ? 'bg-blue-600 border-blue-500'
                : 'bg-teal-800 border-teal-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              {toast.type === 'DANGER' && (
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
              {toast.type === 'WARNING' && (
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
              {toast.type === 'SUCCESS' && (
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {toast.type === 'INFO' && (
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="leading-relaxed">{toast.message}</span>
            </div>
            <button className="ml-4 text-white/70 hover:text-white text-[10px] font-bold focus:outline-none">
              &times;
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
