import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { FiUsers, FiTrash2, FiUserCheck, FiUserX, FiCheckCircle } from 'react-icons/fi';

const Users = () => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await API.get('/api/users');
      setUsersList(res.data);
    } catch (err) {
      setError('Failed to fetch user accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (id) => {
    try {
      await API.put(`/api/users/${id}/toggle-status`);
      setSuccess('User status updated successfully');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const changeRole = async (id, newRole) => {
    try {
      await API.put(`/api/users/${id}/role`, null, {
        params: { roleName: newRole }
      });
      setSuccess('User role changed successfully');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update user role');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    try {
      await API.delete(`/api/users/${id}`);
      setSuccess('User account removed');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  return (
    <div className="space-y-6 font-sans text-xs max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">User Accounts Registry</h1>
        <p className="text-xs text-slate-400 mt-1">Audit team member credentials, modify system access roles, and disable accounts.</p>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-xl">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : usersList.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs">
            No users registered in the database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-850 border-b border-slate-800 text-slate-400 font-bold">
                  <th className="px-6 py-4">Employee Name</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4 text-center">System Authorization Role</th>
                  <th className="px-6 py-4 text-center">Login Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 text-slate-300">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-850/20">
                    <td className="px-6 py-4 font-semibold text-slate-100">{u.firstName} {u.lastName}</td>
                    <td className="px-6 py-4 text-slate-400">{u.email}</td>
                    <td className="px-6 py-4">{u.phone || 'N/A'}</td>
                    <td className="px-6 py-4 text-center">
                      <select
                        value={u.roleName}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        className="bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-lg px-2.5 py-1 text-[11px] text-slate-200 focus:outline-none"
                      >
                        <option value="ROLE_ADMIN">Administrator</option>
                        <option value="ROLE_PHARMACIST">Pharmacist Staff</option>
                        <option value="ROLE_STAFF">Inventory Staff</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded font-bold text-[9px] ${u.enabled ? 'bg-emerald-500/10 text-emerald-450 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {u.enabled ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center flex justify-center space-x-3.5">
                      <button 
                        onClick={() => toggleStatus(u.id)} 
                        className={`p-1.5 rounded-lg bg-slate-850 ${u.enabled ? 'text-slate-400 hover:text-amber-400' : 'text-slate-400 hover:text-emerald-400'}`}
                        title={u.enabled ? "Disable Account" : "Enable Account"}
                      >
                        {u.enabled ? <FiUserX size={13} /> : <FiUserCheck size={13} />}
                      </button>
                      <button 
                        onClick={() => handleDelete(u.id)} 
                        className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-850 rounded-lg"
                        title="Delete User"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
