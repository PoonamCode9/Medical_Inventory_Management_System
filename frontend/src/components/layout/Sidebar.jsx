import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function Sidebar({ onClose }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Collapsible sections state
  const [openSections, setOpenSections] = useState({
    Dashboard: true,
    Inventory: true,
    Suppliers: true,
    Orders: true,
    Monitoring: true,
    Administration: true,
  });

  const toggleSection = (sectionName) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
    navigate('/login');
  };

  // Role standardizer
  const role = user?.role ? user.role.toUpperCase() : 'ROLE_VIEWER';
  const isAdmin = role === 'ROLE_ADMIN' || role === 'ADMIN';
  const isPharmacist = role === 'ROLE_PHARMACIST' || role === 'PHARMACIST';

  // Navigation schema grouped by collapsible sections
  const getNavSections = () => {
    const sections = [];

    // 1. Dashboard
    sections.push({
      title: 'Dashboard',
      items: [
        { name: 'Console Summary', path: '/', icon: 'dashboard' }
      ]
    });

    // 2. Inventory Group
    const inventoryItems = [];
    inventoryItems.push({ name: 'Medicines', path: '/medicines', icon: 'medicines' });
    if (isAdmin) {
      inventoryItems.push({ name: 'Categories', path: '/categories', icon: 'categories' });
    }
    inventoryItems.push({ name: 'Inventory', path: '/inventory', icon: 'inventory' });
    
    sections.push({
      title: 'Inventory',
      items: inventoryItems
    });

    // 3. Suppliers Group
    if (isAdmin) {
      sections.push({
        title: 'Suppliers',
        items: [
          { name: 'Suppliers Registry', path: '/suppliers', icon: 'suppliers' }
        ]
      });
    }

    // 4. Orders Group
    const orderItems = [];
    if (isAdmin || isPharmacist) {
      orderItems.push({ name: 'Purchase Orders', path: '/purchase-orders', icon: 'purchaseOrders' });
    }
    if (orderItems.length > 0) {
      sections.push({
        title: 'Orders',
        items: orderItems
      });
    }

    // 5. Monitoring Group
    const monitorItems = [];
    monitorItems.push({ name: 'Expiry', path: '/expiry', icon: 'expiry' });
    monitorItems.push({ name: 'Notifications', path: '/notifications', icon: 'notifications' });
    if (isAdmin || isPharmacist) {
      monitorItems.push({ name: 'Stock Logs', path: '/stock-logs', icon: 'inventory' });
    }
    sections.push({
      title: 'Monitoring',
      items: monitorItems
    });

    // 6. Administration Group
    const adminItems = [];
    if (isAdmin) {
      adminItems.push({ name: 'Users', path: '/user-management', icon: 'userManagement' });
    }
    adminItems.push({ name: 'Reports', path: '/reports', icon: 'reports' });
    if (isAdmin || isPharmacist) {
      adminItems.push({ name: 'Advanced Analytics', path: '/analytics', icon: 'analytics' });
    }
    if (isAdmin) {
      adminItems.push({ name: 'Settings', path: '/settings', icon: 'settings' });
    }
    sections.push({
      title: 'Administration',
      items: adminItems
    });

    return sections;
  };

  // Render inline SVGs for clean look
  const renderIcon = (type) => {
    switch (type) {
      case 'dashboard':
        return (
          <svg className="w-4 h-4 mr-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
          </svg>
        );
      case 'medicines':
        return (
          <svg className="w-4 h-4 mr-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        );
      case 'categories':
        return (
          <svg className="w-4 h-4 mr-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" />
          </svg>
        );
      case 'inventory':
        return (
          <svg className="w-4 h-4 mr-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'suppliers':
        return (
          <svg className="w-4 h-4 mr-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'purchaseOrders':
        return (
          <svg className="w-4 h-4 mr-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'expiry':
        return (
          <svg className="w-4 h-4 mr-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'notifications':
        return (
          <svg className="w-4 h-4 mr-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
      case 'reports':
        return (
          <svg className="w-4 h-4 mr-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'userManagement':
        return (
          <svg className="w-4 h-4 mr-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        );
      case 'settings':
        return (
          <svg className="w-4 h-4 mr-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        );
      case 'analytics':
        return (
          <svg className="w-4 h-4 mr-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 mr-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        );
    }
  };

  return (
    <aside className="w-64 bg-[#334155] text-slate-200 flex flex-col justify-between border-r border-slate-600 h-full">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-600/50">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span className="font-bold text-base tracking-wider text-white">MediStock</span>
          </div>

          {/* Close button for mobile screen widths */}
          <button 
            onClick={onClose}
            className="lg:hidden p-1 text-slate-400 hover:text-white rounded-md cursor-pointer focus:outline-none"
            title="Close Menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 p-3.5 space-y-3">
          {getNavSections().map((section) => (
            <div key={section.title} className="space-y-1">
              <button 
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 tracking-wider px-3.5 py-1.5 hover:text-white rounded-[6px] hover:bg-slate-700/30 transition-all text-left cursor-pointer"
              >
                <span>{section.title}</span>
                <svg className={`w-2.5 h-2.5 text-slate-450 transition-transform ${openSections[section.title] ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {openSections[section.title] && (
                <div className="space-y-0.5 animate-fade-in pl-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.name + item.path}
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center px-3 py-1.5 text-xs font-semibold rounded-[10px] tracking-wide transition-all ${
                          isActive
                            ? 'bg-[#0F766E] text-white shadow-sm'
                            : 'text-slate-300 hover:bg-[#475569] hover:text-white'
                        }`}
                      >
                        {renderIcon(item.icon)}
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Logout button at the Bottom */}
      <div className="p-3 border-t border-slate-600/50">
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-4 py-2 text-xs font-semibold rounded-[10px] text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all cursor-pointer focus:outline-none"
        >
          <svg className="w-4 h-4 mr-3 text-red-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
