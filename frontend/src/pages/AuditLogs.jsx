import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { FiActivity, FiSearch } from 'react-icons/fi';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    try {
      const res = await API.get('/api/audit-logs');
      setLogs(res.data);
      setFilteredLogs(res.data);
    } catch (err) {
      setError('Failed to fetch system audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearch(query);
    if (!query.trim()) {
      setFilteredLogs(logs);
      return;
    }
    const q = query.toLowerCase();
    const filtered = logs.filter(l => 
      l.username.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      (l.details && l.details.toLowerCase().includes(q))
    );
    setFilteredLogs(filtered);
  };

  return (
    <div className="space-y-6 font-sans text-xs max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">System Audit logs</h1>
        <p className="text-xs text-slate-400 mt-1">Review chronological logs of user logins, database creations, invoice additions and edits.</p>
      </div>

      <div className="flex bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 items-center space-x-3 max-w-md">
        <FiSearch className="text-slate-500" size={18} />
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Filter audit logs by keyword or username..."
          className="bg-transparent border-none text-xs w-full focus:outline-none placeholder-slate-500 text-slate-200"
        />
      </div>

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
        ) : filteredLogs.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs">
            No audit log entries recorded matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-850 border-b border-slate-800 text-slate-400 font-bold">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">User Account</th>
                  <th className="px-6 py-4">Security Action</th>
                  <th className="px-6 py-4">Details / Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 text-slate-300">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850/20">
                    <td className="px-6 py-4 text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-200">{log.username}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-850 border border-slate-800 text-slate-350 text-[10px] font-bold tracking-wide uppercase">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 leading-normal">{log.details}</td>
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

export default AuditLogs;
