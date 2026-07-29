import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import NotificationDrawer from './NotificationDrawer';

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    const r = role ? role.toUpperCase() : 'VIEWER';
    if (r.includes('ADMIN')) {
      return (
        <span className="px-2.5 py-1 text-[10px] md:text-xs font-semibold rounded-full bg-teal-50 text-teal-700 border border-teal-200">
          System Admin
        </span>
      );
    } else if (r.includes('PHARMACIST')) {
      return (
        <span className="px-2.5 py-1 text-[10px] md:text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Pharmacist
        </span>
      );
    } else {
      return (
        <span className="px-2.5 py-1 text-[10px] md:text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          Staff Operator
        </span>
      );
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3.5 flex items-center justify-between shadow-sm z-30">
      <div className="flex items-center space-x-3">
        {/* Hamburger Menu trigger for Mobile */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 text-gray-500 hover:text-teal-750 hover:bg-slate-100 rounded-md focus:outline-none cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h2 className="text-xs md:text-sm font-semibold text-gray-700 truncate">
          Enterprise Medical Network Control Console
        </h2>
      </div>

      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Role Badge */}
        {user && getRoleBadge(user.role)}

        {/* User Info */}
        {user && (
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-gray-900">{user.email}</span>
            <span className="text-[10px] text-gray-400 font-medium">Session Active</span>
          </div>
        )}

        {/* Quick logout & Profile links */}
        <div className="flex items-center space-x-3 border-l border-gray-200 pl-3 md:pl-4">
          {/* Notifications Link with Badge */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="text-gray-500 hover:text-teal-700 transition-colors p-1.5 relative block cursor-pointer focus:outline-none"
            title="System Notifications"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-red-600 text-white text-[8px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <Link
            to="/profile"
            className="text-gray-500 hover:text-teal-700 transition-colors p-1.5"
            title="User Profile"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Link>

          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 transition-colors p-1.5 cursor-pointer"
            title="Log Out"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
      <NotificationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </header>
  );
}
