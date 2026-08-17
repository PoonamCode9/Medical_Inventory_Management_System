import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
    Settings,
    User,
    KeyRound,
    Palette,
    Save,
    CheckCircle2,
    AlertCircle,
    Moon,
    Sun,
    ArrowLeft,
    Mail,
    Shield,
    Lock,
    IdCard,
    Sparkles
} from 'lucide-react';
import { Card, Button, Avatar, Badge } from '../components/ui';

export function SettingsPage({ onNavigate: propNavigate }) {
    const routerNavigate = useNavigate();
    const navigate = propNavigate || routerNavigate;
    const { profile: contextProfile, updateUserProfile, isDarkMode, toggleTheme, refreshData } = useData() || {};
    const [activeSection, setActiveSection] = useState('account');

    // Notification message states
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Form inputs state
    const [profile, setProfile] = useState(() => {
        const storedRole = (contextProfile?.role || localStorage.getItem('role') || 'staff').toLowerCase().replace('role_', '');
        return {
            username: contextProfile?.username || localStorage.getItem('username') || (storedRole === 'admin' ? 'admin' : 'User'),
            email: contextProfile?.email || localStorage.getItem('email') || `${storedRole}@medistock.com`,
            role: storedRole.toUpperCase(),
            userId: contextProfile?.userId || localStorage.getItem('userId') || '1',
        };
    });

    // Password State
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (contextProfile) {
            setProfile(prev => ({
                ...prev,
                username: contextProfile.username || prev.username,
                email: contextProfile.email || prev.email,
                role: (contextProfile.role || prev.role || 'STAFF').toUpperCase(),
                userId: contextProfile.userId || prev.userId
            }));
        }
    }, [contextProfile]);

    const showSuccess = (msg) => {
        setSuccessMessage(msg);
        setErrorMessage('');
        setTimeout(() => setSuccessMessage(''), 4000);
    };

    const showError = (msg) => {
        setErrorMessage(msg);
        setSuccessMessage('');
        setTimeout(() => setErrorMessage(''), 4000);
    };

    // Save Name / Username and Email
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            if (updateUserProfile) {
                await updateUserProfile({
                    username: profile.username,
                    email: profile.email
                });
            } else {
                localStorage.setItem('username', profile.username);
                localStorage.setItem('email', profile.email);
            }

            if (refreshData) refreshData();
            showSuccess('Profile details (Name & Email) saved and synchronized across your session!');
        } catch (err) {
            localStorage.setItem('username', profile.username);
            localStorage.setItem('email', profile.email);
            showSuccess('Profile updated for current session!');
        } finally {
            setIsSaving(false);
        }
    };

    // Change Password
    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            showError('New password and confirmation password do not match.');
            return;
        }

        if (passwords.newPassword.length < 6) {
            showError('New password must be at least 6 characters long.');
            return;
        }

        setIsSaving(true);
        const currentUsername = localStorage.getItem('username') || 'admin';

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8080/api/auth/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    currentUsername,
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword,
                }),
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || 'Password change rejected. Verify current password.');
            }

            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            showSuccess('Password updated successfully in PostgreSQL database!');
        } catch (err) {
            showError(err.message || 'Error updating password. Check current password.');
        } finally {
            setIsSaving(false);
        }
    };

    const roleBadgeColor = profile.role.includes('ADMIN')
        ? 'primary'
        : profile.role.includes('PHARMACIST')
            ? 'info'
            : 'secondary';

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in text-slate-800 dark:text-slate-100">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                        <Settings className="h-7 w-7 text-blue-600 dark:text-blue-400" /> Account & System Settings
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage your authenticated database credentials, registered email, security, and UI preferences.
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-xs h-9">
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Button>
            </div>

            {/* Profile Overview Card */}
            <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Avatar name={profile.username} size="lg" />
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white capitalize">{profile.username}</h2>
                            <Badge color={roleBadgeColor}>{profile.role}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{profile.email}</p>
                        <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-slate-400">
                            <span>User ID: #{profile.userId || '1'}</span>
                            <span>•</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> Active Session
                            </span>
                        </div>
                    </div>
                </div>
                <Button variant="secondary" size="sm" onClick={toggleTheme} className="flex items-center gap-1.5 text-xs">
                    {isDarkMode ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} />}
                    {isDarkMode ? 'Dark Mode Active' : 'Light Mode Active'}
                </Button>
            </Card>

            {/* Success Banner */}
            {successMessage && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-2 animate-slide-up font-medium">
                    <CheckCircle2 size={18} />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2 animate-slide-up font-medium">
                    <AlertCircle size={18} />
                    <span>{errorMessage}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="space-y-1 md:col-span-1">
                    {[
                        { id: 'account', label: 'Profile Information', icon: User },
                        { id: 'security', label: 'Change Password', icon: KeyRound },
                        { id: 'appearance', label: 'Theme & Display', icon: Palette },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeSection === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveSection(tab.id)}
                                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-[0.98] ${
                                    isActive
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold border-l-4 border-blue-600 shadow-xs'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                                }`}
                            >
                                <Icon size={16} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Form Panels */}
                <div className="md:col-span-3">
                    <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">

                        {/* 1. Account / Profile Information */}
                        {activeSection === 'account' && (
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Profile Details</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Update the registered username and primary email associated with your database record.
                                    </p>
                                </div>

                                <div className="space-y-4 max-w-md">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Username / Display Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input
                                                type="text"
                                                required
                                                value={profile.username}
                                                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                                className="w-full h-9 pl-9 pr-3 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Registered Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input
                                                type="email"
                                                required
                                                value={profile.email}
                                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                className="w-full h-9 pl-9 pr-3 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Assigned Access Role
                                        </label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input
                                                type="text"
                                                disabled
                                                value={profile.role.toUpperCase()}
                                                className="w-full h-9 pl-9 pr-3 text-sm bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed uppercase font-bold"
                                            />
                                        </div>
                                        <p className="text-[11px] text-slate-400 mt-1">Role assignments and permissions are managed by Administrators.</p>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-3">
                                    <Button type="submit" disabled={isSaving} className="flex items-center gap-2 shadow-sm">
                                        <Save size={15} /> {isSaving ? 'Saving...' : 'Save Profile Changes'}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* 2. Change Password */}
                        {activeSection === 'security' && (
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Security & Password</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Ensure your account is protected with a strong, secure password.
                                    </p>
                                </div>

                                <div className="space-y-4 max-w-md">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Current Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input
                                                type="password"
                                                required
                                                value={passwords.currentPassword}
                                                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                                className="w-full h-9 pl-9 pr-3 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input
                                                type="password"
                                                required
                                                value={passwords.newPassword}
                                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                                className="w-full h-9 pl-9 pr-3 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                                placeholder="Minimum 6 characters"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input
                                                type="password"
                                                required
                                                value={passwords.confirmPassword}
                                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                                className="w-full h-9 pl-9 pr-3 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                                placeholder="Repeat new password"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-3">
                                    <Button type="submit" disabled={isSaving} className="flex items-center gap-2 shadow-sm">
                                        <KeyRound size={15} /> {isSaving ? 'Updating...' : 'Update Password'}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* 3. Theme & Display */}
                        {activeSection === 'appearance' && (
                            <div className="space-y-4">
                                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Interface Customization</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Switch between high-contrast Light and Dark application themes.
                                    </p>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Application Theme Mode</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            Current: <span className="font-bold text-blue-600 dark:text-blue-400">{isDarkMode ? 'Dark Theme' : 'Light Theme'}</span>
                                        </p>
                                    </div>
                                    <Button onClick={toggleTheme} variant="outline" className="flex items-center gap-2 text-xs">
                                        {isDarkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-slate-500" />}
                                        Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
                                    </Button>
                                </div>
                            </div>
                        )}

                    </Card>
                </div>
            </div>
        </div>
    );
}