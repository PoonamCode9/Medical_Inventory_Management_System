import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
    Users, Plus, Mail, Search, Trash2, Pencil,
    CheckCircle2, XCircle, Shield, Key, X, AlertTriangle
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';

export function UsersPage() {
    const {
        users = [],
        addUser,
        updateUser,
        deleteUser,
        refreshData
    } = useData() || {};

    const [search, setSearch] = useState('');
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalUser, setEditModalUser] = useState(null);
    const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);

    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        role: 'ROLE_PHARMACIST',
        password: '',
        status: 'ACTIVE'
    });

    const [submitting, setSubmitting] = useState(false);

    const filteredUsers = users.filter(u =>
        (u.username || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (typeof u.role === 'object' ? u.role?.name : u.role || '').toLowerCase().includes(search.toLowerCase())
    );

    const getRoleBadge = (roleObj) => {
        const rawRole = typeof roleObj === 'object' ? roleObj?.name : roleObj;
        const clean = (rawRole || 'staff').toLowerCase().replace('role_', '');
        if (clean === 'admin') return <Badge color="primary">Administrator</Badge>;
        if (clean === 'pharmacist') return <Badge color="info">Pharmacist</Badge>;
        return <Badge color="secondary">Staff Member</Badge>;
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            if (addUser) {
                await addUser(newUser);
            }
            setCreateModalOpen(false);
            setNewUser({ username: '', email: '', role: 'ROLE_PHARMACIST', password: '', status: 'ACTIVE' });
        } catch (err) {
            console.error('Failed to create user:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!editModalUser) return;
        try {
            setSubmitting(true);
            if (updateUser) {
                await updateUser(editModalUser.id, {
                    username: editModalUser.username,
                    email: editModalUser.email,
                    role: typeof editModalUser.role === 'object' ? editModalUser.role?.name : editModalUser.role,
                    status: editModalUser.status,
                    ...(editModalUser.newPassword ? { password: editModalUser.newPassword } : {})
                });
            }
            setEditModalUser(null);
        } catch (err) {
            console.error('Failed to update user:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            if (deleteUser) {
                await deleteUser(id);
            }
            setDeleteConfirmUser(null);
        } catch (err) {
            console.error('Failed to delete user:', err);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in text-slate-800 dark:text-slate-100">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                        <Users className="h-7 w-7 text-blue-600 dark:text-blue-400" /> User Management & RBAC
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Administrator portal to manage user authentication credentials, permissions, and roles in PostgreSQL.
                    </p>
                </div>
                <Button onClick={() => setCreateModalOpen(true)} className="flex items-center gap-2 font-semibold">
                    <Plus className="h-4 w-4" /> Add New User
                </Button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search users by name, email, or role..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-9 pl-9 pr-4 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Users Data Table */}
            <Card className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs uppercase tracking-wide bg-slate-50/50 dark:bg-slate-900/50">
                            <th className="px-5 py-3">User Profile</th>
                            <th className="px-5 py-3">Email Address</th>
                            <th className="px-5 py-3">Assigned Role</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-12 text-slate-400">
                                    No registered database users found.
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                                            {(u.username || 'U').substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-slate-900 dark:text-white capitalize">{u.username}</span>
                                            <span className="block text-[10px] text-slate-400 font-mono">ID: #{u.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 font-mono text-xs">
                                        <span className="flex items-center gap-1.5">
                                            <Mail size={13} className="text-slate-400" /> {u.email || `${u.username}@medistock.com`}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        {getRoleBadge(u.role || u.role_name || u.roleName)}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                            (u.status || 'ACTIVE') === 'ACTIVE'
                                                ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                                                : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {(u.status || 'ACTIVE') === 'ACTIVE' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                            {u.status || 'ACTIVE'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right space-x-1.5">
                                        <button
                                            onClick={() => setEditModalUser({
                                                ...u,
                                                role: typeof u.role === 'object' ? u.role?.name : (u.role || 'ROLE_STAFF'),
                                                newPassword: ''
                                            })}
                                            title="Edit user credentials"
                                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <Pencil size={15} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirmUser(u)}
                                            title="Delete user"
                                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Modal: Create User */}
            {createModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <form onSubmit={handleCreateUser} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl animate-scale-in">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Plus className="h-5 w-5 text-blue-600" /> Register Database User
                            </h2>
                            <button type="button" onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Username</label>
                                <input
                                    type="text"
                                    required
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                                    placeholder="e.g. pharmacist_alex"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                                    placeholder="alex@medistock.com"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Role</label>
                                    <select
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                        className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="ROLE_PHARMACIST">Pharmacist</option>
                                        <option value="ROLE_STAFF">Staff</option>
                                        <option value="ROLE_ADMIN">Administrator</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Status</label>
                                    <select
                                        value={newUser.status}
                                        onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                                        className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="INACTIVE">INACTIVE</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? 'Saving...' : 'Register User'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Modal: Edit User */}
            {editModalUser && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <form onSubmit={handleUpdateUser} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl animate-scale-in">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Pencil className="h-5 w-5 text-blue-600" /> Edit User #{editModalUser.id}
                            </h2>
                            <button type="button" onClick={() => setEditModalUser(null)} className="text-slate-400 hover:text-slate-600">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Username</label>
                                <input
                                    type="text"
                                    required
                                    value={editModalUser.username || ''}
                                    onChange={(e) => setEditModalUser({ ...editModalUser, username: e.target.value })}
                                    className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={editModalUser.email || ''}
                                    onChange={(e) => setEditModalUser({ ...editModalUser, email: e.target.value })}
                                    className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Change Password (optional)</label>
                                <input
                                    type="password"
                                    value={editModalUser.newPassword || ''}
                                    onChange={(e) => setEditModalUser({ ...editModalUser, newPassword: e.target.value })}
                                    placeholder="Leave blank to keep existing password"
                                    className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Role</label>
                                    <select
                                        value={typeof editModalUser.role === 'object' ? editModalUser.role?.name : editModalUser.role}
                                        onChange={(e) => setEditModalUser({ ...editModalUser, role: e.target.value })}
                                        className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="ROLE_PHARMACIST">Pharmacist</option>
                                        <option value="ROLE_STAFF">Staff</option>
                                        <option value="ROLE_ADMIN">Administrator</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Status</label>
                                    <select
                                        value={editModalUser.status || 'ACTIVE'}
                                        onChange={(e) => setEditModalUser({ ...editModalUser, status: e.target.value })}
                                        className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="INACTIVE">INACTIVE</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <Button type="button" variant="outline" onClick={() => setEditModalUser(null)}>Cancel</Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? 'Updating...' : 'Update User'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Modal: Delete User Confirmation */}
            {deleteConfirmUser && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-sm w-full p-6 space-y-4 shadow-xl animate-scale-in">
                        <div className="flex items-center gap-3 text-rose-600">
                            <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center shrink-0">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Delete User Account</h3>
                                <p className="text-xs text-slate-500">This action is permanent and cannot be undone.</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Are you sure you want to remove user <strong className="text-slate-900 dark:text-white font-bold">{deleteConfirmUser.username}</strong> from PostgreSQL?
                        </p>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" onClick={() => setDeleteConfirmUser(null)}>Cancel</Button>
                            <Button variant="destructive" onClick={() => handleDeleteUser(deleteConfirmUser.id)}>
                                Confirm Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}