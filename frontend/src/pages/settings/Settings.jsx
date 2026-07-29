import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Settings() {
  const { user } = useContext(AuthContext);
  const roleName = user?.role || '';

  if (!roleName.includes('ADMIN')) {
    return (
      <div className="flex flex-col justify-center items-center py-20 text-center font-sans space-y-2">
        <span className="text-5xl mb-2">🚫</span>
        <h3 className="text-sm font-bold text-gray-800">Access Restricted</h3>
        <p className="text-xs text-gray-450 leading-relaxed max-w-sm">Only system administrators are authorized to configure settings parameters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl font-sans">
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">System Settings</h1>
        <p className="text-xs text-gray-500">Configure global parameters, backup schedules, database connection settings, and system parameters.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-[10px] p-6 shadow-sm space-y-6 text-xs text-gray-700">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Database Connection parameters</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block font-semibold mb-1">Database Dialect</span>
              <input type="text" disabled className="w-full bg-slate-50 border border-gray-200 rounded-card p-2 text-xs text-gray-450" value="PostgreSQL" />
            </div>
            <div>
              <span className="block font-semibold mb-1">Host Endpoint</span>
              <input type="text" disabled className="w-full bg-slate-50 border border-gray-200 rounded-card p-2 text-xs text-gray-450" value="localhost:5432 / medistock_db" />
            </div>
          </div>
        </div>

        <hr className="border-gray-150" />

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Security & Auth configurations</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block font-semibold mb-1">JWT Lifetime (Expiration)</span>
              <input type="text" disabled className="w-full bg-slate-50 border border-gray-200 rounded-card p-2 text-xs text-gray-450" value="24 Hours (86,400,000 ms)" />
            </div>
            <div>
              <span className="block font-semibold mb-1">Algorithm Encryption</span>
              <input type="text" disabled className="w-full bg-slate-50 border border-gray-200 rounded-card p-2 text-xs text-gray-450" value="HMAC-SHA256" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
