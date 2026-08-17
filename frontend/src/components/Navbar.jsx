import React, { useState, useRef, useEffect } from 'react';
import {
    Search, Bell, Sun, Moon, ChevronDown, LogOut, User,
    Settings as SettingsIcon, Menu, Clock, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { Avatar, IconButton, Badge } from './ui';

export function Navbar({
    userName = 'Administrator',
    userEmail = 'admin@medistock.com',
    role = 'Administrator',
    unreadCount = 0,
    dark = false,
    onToggleTheme,
    onNavigate,
    onLogout,
    onOpenSidebar,
    notificationList = []
}) {
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const profileRef = useRef(null);
    const notifRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const roleBadgeColor = role.toLowerCase().includes('admin')
        ? 'primary'
        : role.toLowerCase().includes('pharmacist')
            ? 'info'
            : 'secondary';

    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 px-4 lg:px-6 sticky top-0 z-30 shadow-sm">
            {onOpenSidebar && (
                <button className="lg:hidden text-slate-500 hover:text-slate-800 dark:hover:text-slate-200" onClick={onOpenSidebar}>
                    <Menu className="h-5 w-5" />
                </button>
            )}

            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    placeholder="Search medicines, batches, suppliers..."
                    className="w-full h-9 pl-9 pr-12 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg
                        text-slate-800 dark:text-slate-100 placeholder-slate-400
                        focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
                <IconButton onClick={onToggleTheme} aria-label="Toggle theme">
                    {dark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
                </IconButton>

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <IconButton
                        onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                        aria-label="Notifications"
                        className="relative"
                    >
                        <Bell size={18} className="text-slate-600 dark:text-slate-300" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm animate-pulse">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </IconButton>

                    {notifOpen && (
                        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 animate-slide-up overflow-hidden">
                            <div className="flex items-center justify-between px-4 h-12 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Notifications</h3>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                                    {unreadCount} new
                                </span>
                            </div>
                            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 custom-scrollbar">
                                {notificationList.length === 0 ? (
                                    <div className="py-8 text-center text-xs text-slate-400">No new alerts.</div>
                                ) : (
                                    notificationList.slice(0, 4).map((n) => (
                                        <div
                                            key={n.id}
                                            onClick={() => { if (onNavigate) onNavigate('notifications'); setNotifOpen(false); }}
                                            className="flex gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                                        >
                                            <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center shrink-0">
                                                <AlertTriangle size={16} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{n.title}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <button
                                onClick={() => { if (onNavigate) onNavigate('notifications'); setNotifOpen(false); }}
                                className="w-full h-11 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-t border-slate-200 dark:border-slate-800 flex items-center justify-center"
                            >
                                View all notifications →
                            </button>
                        </div>
                    )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                        className="flex items-center gap-2.5 h-10 pl-1.5 pr-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                    >
                        <Avatar name={userName} size="sm" />
                        <div className="hidden sm:block text-left">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-none capitalize truncate max-w-[120px]">{userName}</p>
                            <span className="text-[10px] text-slate-400 font-medium">{role}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 animate-slide-up overflow-hidden">
                            <div className="px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                                <div className="flex items-center gap-3">
                                    <Avatar name={userName} size="md" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white capitalize truncate">{userName}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userEmail}</p>
                                    </div>
                                </div>
                                <div className="mt-2.5">
                                    <Badge color={roleBadgeColor}>{role}</Badge>
                                </div>
                            </div>
                            <div className="p-1.5">
                                <button
                                    onClick={() => { if (onNavigate) onNavigate('settings'); setProfileOpen(false); }}
                                    className="w-full flex items-center gap-2.5 px-3 h-9 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <User className="h-4 w-4 text-slate-400" /> My Profile
                                </button>
                                <button
                                    onClick={() => { if (onNavigate) onNavigate('settings'); setProfileOpen(false); }}
                                    className="w-full flex items-center gap-2.5 px-3 h-9 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <SettingsIcon className="h-4 w-4 text-slate-400" /> Account Settings
                                </button>
                            </div>
                            <div className="p-1.5 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    onClick={() => { if (onLogout) onLogout(); setProfileOpen(false); }}
                                    className="w-full flex items-center gap-2.5 px-3 h-9 rounded-lg text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" /> Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
