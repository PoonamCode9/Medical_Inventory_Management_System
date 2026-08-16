import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Tooltip } from 'react-tooltip';
import Swal from 'sweetalert2';
import { API_BASE as API } from '../config';

const token = () => localStorage.getItem('om_token');
const auth = () => ({ Authorization: `Bearer ${token()}` });
const jsonHeaders = () => ({ 'Content-Type': 'application/json', ...auth() });

const ROLE_COLORS = {
  ADMIN: 'bg-violet-100 text-violet-700 border-violet-200',
  PHARMACIST: 'bg-sky-100 text-sky-700 border-sky-200',
  STAFF: 'bg-slate-100 text-slate-600 border-slate-200',
};

const CAT_COLORS = {
  ANTIBIOTIC: 'bg-rose-50 text-rose-700 border-rose-200',
  PAINKILLER: 'bg-amber-50 text-amber-700 border-amber-200',
  ANTIVIRAL: 'bg-purple-50 text-purple-700 border-purple-200',
  ANTIFUNGAL: 'bg-pink-50 text-pink-700 border-pink-200',
  VITAMIN_SUPPLEMENT: 'bg-lime-50 text-lime-700 border-lime-200',
  CARDIOVASCULAR: 'bg-red-50 text-red-700 border-red-200',
  DIABETES: 'bg-orange-50 text-orange-700 border-orange-200',
  RESPIRATORY: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  DERMATOLOGICAL: 'bg-teal-50 text-teal-700 border-teal-200',
  OTHER: 'bg-slate-50 text-slate-600 border-slate-200',
};

const CAT_LABELS = {
  ANTIBIOTIC: 'Antibiotic',
  PAINKILLER: 'Painkiller',
  ANTIVIRAL: 'Antiviral',
  ANTIFUNGAL: 'Antifungal',
  VITAMIN_SUPPLEMENT: 'Vitamin / Supplement',
  CARDIOVASCULAR: 'Cardiovascular',
  DIABETES: 'Diabetes',
  RESPIRATORY: 'Respiratory',
  DERMATOLOGICAL: 'Dermatological',
  OTHER: 'Other',
};

const ROLE_GRADIENTS = {
  ADMIN: 'from-violet-500 to-purple-600',
  PHARMACIST: 'from-sky-500 to-indigo-600',
  STAFF: 'from-slate-500 to-slate-700',
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const s = String(dateStr);
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) {
    const [, y, mo, d] = m;
    return `${d}-${mo}-${y}`;
  }
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}-${mm}-${d.getFullYear()}`;
};

function Spinner({ color = 'border-slate-300' }) {
  return (
    <div className="flex justify-center py-16">
      <div className={`animate-spin rounded-full h-8 w-8 border-2 ${color} border-t-transparent`} />
    </div>
  );
}

function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-12 text-center">
      <span className="text-4xl">{icon}</span>
      <p className="mt-3 text-sm font-semibold text-slate-700">{title}</p>
      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
    </div>
  );
}

function FormInput({ label, tooltip, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</label>}
      <input
        className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition"
        data-tooltip-id="dash-tooltip"
        data-tooltip-content={tooltip}
        {...props}
      />
    </div>
  );
}

function FormSelect({ label, tooltip, children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</label>}
      <select
        className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition"
        data-tooltip-id="dash-tooltip"
        data-tooltip-content={tooltip}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

function Badge({ color, children }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${color}`}>
      {children}
    </span>
  );
}

function ActionBtn({ onClick, color = 'slate', children }) {
  const styles = {
    slate: 'border-slate-200 text-slate-600 hover:bg-slate-50',
    rose: 'border-rose-200 text-rose-600 hover:bg-rose-50',
    violet: 'border-violet-200 text-violet-600 hover:bg-violet-50',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${styles[color]}`}
    >
      {children}
    </button>
  );
}

function SearchInput({ value, onChange, placeholder = 'Search...', tooltip = 'Search through records...' }) {
  return (
    <div className="relative">
      <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        data-tooltip-id="dash-tooltip"
        data-tooltip-content={tooltip}
        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition"
      />
    </div>
  );
}

/* ───────────────────────────── USERS ───────────────────────────── */

export function UsersView() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', username: '', password: '', role: 'STAFF', email: '' });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadUsers = (q) => {
    if (!token()) return;
    setLoading(true);
    const url = q ? `${API}/api/admin/users/search?q=${encodeURIComponent(q)}` : `${API}/api/admin/users`;
    fetch(url, { headers: auth() })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => loadUsers(searchQuery.trim() || null), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!token()) return;
    const url = editingId ? `${API}/api/admin/users/${editingId}` : `${API}/api/admin/users`;
    const payload = { ...form };
    if (editingId && !payload.password.trim()) delete payload.password;
    const res = await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: jsonHeaders(), body: JSON.stringify(payload) });
    if (res.ok) { setForm({ name: '', username: '', password: '', role: 'STAFF', email: '' }); setEditingId(null); setShowForm(false); loadUsers(searchQuery.trim() || null); }
  };

  const handleEdit = (u) => { setEditingId(u.id); setShowForm(true); setForm({ name: u.name, username: u.username, password: '', role: u.role, email: u.email || '' }); };
  const cancelEdit = () => { setEditingId(null); setShowForm(false); setForm({ name: '', username: '', password: '', role: 'STAFF', email: '' }); };
  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: 'Delete this user?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#e11d48', confirmButtonText: 'Delete' });
    if (!result.isConfirmed || !token()) return;
    if ((await fetch(`${API}/api/admin/users/${id}`, { method: 'DELETE', headers: auth() })).ok) {
      loadUsers(searchQuery.trim() || null);
      Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">User Management</h3>
          <p className="text-sm text-slate-500 mt-1">Create, update and manage user accounts and role assignments.</p>
        </div>
        <button
          onClick={() => {
            if (showForm && !editingId) setShowForm(false);
            else { setEditingId(null); setForm({ name: '', username: '', password: '', role: 'STAFF', email: '' }); setShowForm(true); }
          }}
          className="self-start sm:self-auto rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-4 py-2.5 text-sm font-bold flex items-center gap-2 shadow-sm transition"
        >
          <span className="text-base leading-none">{showForm && !editingId ? '✕' : '＋'}</span>
          {showForm && !editingId ? 'Close' : 'Add User'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
        <motion.form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput label="Full Name" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required tooltip="User's full display name" />
            <FormInput label="Username" placeholder="johndoe" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required tooltip="Unique login username" />
            <FormInput label={editingId ? 'Password (blank = keep)' : 'Password'} type="password" placeholder="••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editingId} tooltip="Set a secure password for the user" />
            <FormInput label="Email" type="email" placeholder="johndoe@hospital.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} tooltip="Receives medicine expiry reports (required for ADMIN & STAFF)" />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FormSelect label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} tooltip="Assign a system role to define permissions">
              <option value="STAFF">Staff</option>
              <option value="PHARMACIST">Pharmacist</option>
              <option value="ADMIN">Admin</option>
            </FormSelect>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 active:bg-indigo-800 transition shadow-sm">
              {editingId ? 'Update User' : 'Add User'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
                Cancel
              </button>
            )}
          </div>
        </motion.form>
        )}
      </AnimatePresence>

      <SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name or username..." />

      {loading ? <Spinner /> : (
        <motion.div className="grid gap-7 md:grid-cols-2" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} initial="hidden" animate="visible">
          {users.length === 0 ? (
            <div className="md:col-span-2"><EmptyState icon="👤" title={searchQuery ? 'No matching users' : 'No users yet'} subtitle={searchQuery ? 'Try a different search term.' : 'Click "Add User" to create your first account.'} /></div>
          ) : users.map((u, i) => (
            <motion.div
              key={u.id}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition group flex flex-col"
              variants={{ hidden: { opacity: 0, y: 20, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 14 } } }}
              whileHover={{ y: -4, boxShadow: '0 8px 25px -8px rgba(0,0,0,0.1)' }}
              layout
            >
              <div className="flex items-center gap-3 px-5 pt-5">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${ROLE_GRADIENTS[u.role] || ROLE_GRADIENTS.STAFF} text-white font-bold text-lg shadow-sm`}>
                  {u.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-900 text-lg leading-tight truncate">{u.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono truncate">@{u.username}</p>
                </div>
                <Badge color={ROLE_COLORS[u.role] || ROLE_COLORS.STAFF}>{u.role}</Badge>
              </div>
              <div className="mx-5 mt-3 border-t border-slate-100 pt-3 pb-1 space-y-1.5 text-sm">
                <p className="flex items-center gap-2 text-slate-600"><span className="w-4 shrink-0">✉️</span><span className="min-w-0 break-words">{u.email || 'No email set'}</span></p>

              </div>
              <div className="mt-auto px-5 pb-5 pt-3 flex gap-2 justify-end">
                <ActionBtn onClick={() => handleEdit(u)}>Edit</ActionBtn>
                <ActionBtn onClick={() => handleDelete(u.id)} color="rose">Delete</ActionBtn>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

/* ───────────────────────────── MEDICINES ───────────────────────────── */

export function MedicinesView({ role = 'ADMIN' }) {
  const [medicines, setMedicines] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', category: '' });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadMedicines = (q) => {
    if (!token()) { setLoading(false); return; }
    const base = role === 'PHARMACIST' ? `${API}/api/pharmacy` : `${API}/api/admin`;
    const url = q ? `${base}/medicines/search?q=${encodeURIComponent(q)}` : `${base}/medicines`;
    setLoading(true);
    Promise.all([
      fetch(url, { headers: auth() }),
      fetch(`${base}/inventory`, { headers: auth() }),
    ])
      .then(async ([mRes, iRes]) => {
        if (mRes.ok) setMedicines(await mRes.json());
        if (iRes.ok) setInventoryItems(await iRes.json());
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => loadMedicines(searchQuery.trim() || null), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, role]);

  const today = new Date(); today.setHours(0, 0, 0, 0);

  const nonExpiredInventory = useMemo(() =>
    inventoryItems.filter(i => !i.expiration_date || new Date(i.expiration_date + 'T00:00:00') >= today),
  [inventoryItems]);

  const activeMedicines = useMemo(() => {
    const expiredMedIds = new Set();
    const medBatches = {};
    inventoryItems.forEach(i => {
      const id = i.medicine?.id;
      if (!id) return;
      if (!medBatches[id]) medBatches[id] = { hasExpired: false, hasActive: false };
      if (i.expiration_date && new Date(i.expiration_date + 'T00:00:00') < today) {
        medBatches[id].hasExpired = true;
      } else {
        medBatches[id].hasActive = true;
      }
    });
    Object.entries(medBatches).forEach(([id, b]) => {
      if (b.hasExpired && !b.hasActive) expiredMedIds.add(Number(id));
    });
    return medicines.filter(m => !expiredMedIds.has(m.id));
  }, [medicines, inventoryItems]);

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!token()) return;
    const payload = { ...form };
    if (!payload.category) payload.category = null;
    const url = editingId ? `${API}/api/admin/medicines/${editingId}` : `${API}/api/admin/medicines`;
    const res = await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: jsonHeaders(), body: JSON.stringify(payload) });
    if (res.ok) { setForm({ name: '', description: '', category: '' }); setEditingId(null); setShowForm(false); loadMedicines(searchQuery.trim() || null); }
    else { const txt = await res.text(); setErrorMsg(txt || 'Failed to save medicine.'); }
  };

  const handleEdit = (m) => { setEditingId(m.id); setShowForm(true); setForm({ name: m.name, description: m.description || '', category: m.category || '' }); };
  const cancelEdit = () => { setEditingId(null); setShowForm(false); setForm({ name: '', description: '', category: '' }); };
  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: 'Delete this medicine?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#e11d48', confirmButtonText: 'Delete' });
    if (!result.isConfirmed || !token()) return;
    if ((await fetch(`${API}/api/admin/medicines/${id}`, { method: 'DELETE', headers: auth() })).ok) {
      loadMedicines(searchQuery.trim() || null);
      Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false });
    }
  };

  const stockByMedicine = useMemo(() => {
    const map = {};
    nonExpiredInventory.forEach(i => {
      const id = i.medicine?.id;
      if (!map[id]) map[id] = { qty: 0, batches: 0 };
      map[id].qty += i.available_qty || 0;
      map[id].batches += 1;
    });
    return map;
  }, [nonExpiredInventory]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Medicine Catalog</h3>
          <p className="text-sm text-slate-500 mt-1">{role === 'PHARMACIST' ? 'Browse available medicines and clinical details.' : 'Define formulas, descriptions and therapeutic categories.'}</p>
        </div>
        {(role === 'ADMIN' || role === 'PHARMACIST') && (
          <button
            onClick={() => {
              if (showForm && !editingId) setShowForm(false);
              else { setEditingId(null); setForm({ name: '', description: '', category: '' }); setErrorMsg(''); setShowForm(true); }
            }}
            className="self-start sm:self-auto rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-4 py-2.5 text-sm font-bold flex items-center gap-2 shadow-sm transition"
          >
            <span className="text-base leading-none">{showForm && !editingId ? '✕' : '＋'}</span>
            {showForm && !editingId ? 'Close' : 'Add Medicine'}
          </button>
        )}
      </div>

      {errorMsg && <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm font-semibold text-rose-700">{errorMsg}</div>}

      {(role === 'ADMIN' || role === 'PHARMACIST') && (
        <AnimatePresence>
          {showForm && (
        <motion.form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput label="Medicine Name" placeholder="e.g. Paracetamol 500mg" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required tooltip="Official name of the medicine" />
            <FormSelect label="Therapeutic Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required tooltip="Select the therapeutic classification">
              <option value="">Select category</option>
              {Object.entries(CAT_LABELS).map(([val, lbl]) => (
                <option key={val} value={val}>{lbl}</option>
              ))}
            </FormSelect>
            <div className="md:col-span-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Clinical Description / Formula Details</label>
                <textarea
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition h-24 resize-none"
                  placeholder="Write usage, strength, or warnings here..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  data-tooltip-id="dash-tooltip"
                  data-tooltip-content="Clinical description, formula details, or usage instructions"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 active:bg-emerald-800 transition shadow-sm">
              {editingId ? 'Update Formula' : 'Save Formula'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
                Cancel
              </button>
            )}
          </div>
        </motion.form>
          )}
        </AnimatePresence>
      )}

      <SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name or description..." />

      {loading ? <Spinner color="border-emerald-300" /> : (
        <motion.div className="grid gap-4 md:grid-cols-2" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} initial="hidden" animate="visible">
          {activeMedicines.length === 0 ? (
            <div className="md:col-span-2"><EmptyState icon="💊" title={searchQuery ? 'No matching medicines' : 'No medicines in catalog'} subtitle={searchQuery ? 'Try a different search term.' : 'Click "Add Medicine" to define your first formula.'} /></div>
          ) : activeMedicines.map((m, i) => {
            const stock = stockByMedicine[m.id] || { qty: 0, batches: 0 };
            return (
            <motion.div
              key={m.id}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition group flex flex-col"
              variants={{ hidden: { opacity: 0, y: 20, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 14 } } }}
              whileHover={{ y: -4, boxShadow: '0 8px 25px -8px rgba(0,0,0,0.1)' }}
              layout
            >
              <div className="px-5 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-bold text-slate-900 text-lg leading-tight">{m.name}</h4>
                  <Badge color={CAT_COLORS[m.category] || CAT_COLORS.OTHER}>{CAT_LABELS[m.category] || m.category || 'N/A'}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold border ${
                    stock.qty === 0 ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    stock.qty < 15 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>{stock.qty} units in stock</span>
                  <span className="text-xs text-slate-400">{stock.batches} batch{stock.batches !== 1 ? 'es' : ''}</span>
                </div>
              </div>
              {m.description && (
                <p className="mx-5 mt-3 text-sm text-left text-slate-600 leading-relaxed line-clamp-3 border-t border-slate-100 py-3"><b>{m.description}</b></p>
              )}
              {(role === 'ADMIN' || role === 'PHARMACIST') && (
                <div className="mt-auto px-5 pb-5 pt-3 flex gap-2 justify-end">
                  <ActionBtn onClick={() => handleEdit(m)}>Edit</ActionBtn>
                  <ActionBtn onClick={() => handleDelete(m.id)} color="rose">Delete</ActionBtn>
                </div>
              )}
            </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

/* ───────────────────────────── INVENTORY ───────────────────────────── */

const CHART_COLORS = ['#6366f1','#f59e0b','#10b981','#ef4444','#8b5cf6','#06b6d4','#f97316','#ec4899','#14b8a6','#eab308'];

export function InventoryView({ role = 'ADMIN', onNavigate }) {
  const [items, setItems] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stock');
  const [stockSearch, setStockSearch] = useState('');
  const [movementSearch, setMovementSearch] = useState('');

  const loadData = async (stockQ, movQ) => {
    if (!token()) { setLoading(false); return; }
    setLoading(true);
    try {
      const base = role === 'PHARMACIST' ? `${API}/api/pharmacy` : `${API}/api/admin`;
      const invUrl = stockQ ? `${base}/inventory/search?q=${encodeURIComponent(stockQ)}` : `${base}/inventory`;
      const movUrl = movQ ? `${API}/api/admin/sales/search?q=${encodeURIComponent(movQ)}` : `${API}/api/admin/sales`;
      const [invRes, movRes] = await Promise.all([
        fetch(invUrl, { headers: auth() }),
        fetch(movUrl, { headers: auth() }),
      ]);
      if (invRes.ok) setItems(await invRes.json());
      if (movRes.ok) {
        const d = await movRes.json();
        d.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMovements(d);
      }
    } catch (e) { console.error('Inventory load error:', e); }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [role]);

  useEffect(() => {
    const timer = setTimeout(() => loadData(stockSearch.trim() || null, movementSearch.trim() || null), 300);
    return () => clearTimeout(timer);
  }, [stockSearch, movementSearch, role]);

  const nonExpiredItems = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return items.filter(i => !i.expiration_date || new Date(i.expiration_date + 'T00:00:00') >= today);
  }, [items]);

  const stockByMedicine = useMemo(() => {
    const map = {};
    nonExpiredItems.forEach(i => {
      const name = i.medicine?.name || 'Unknown';
      if (!map[name]) map[name] = { name, totalQty: 0, batches: [] };
      map[name].totalQty += i.available_qty;
      map[name].batches.push(i);
    });
    return Object.values(map).sort((a, b) => b.totalQty - a.totalQty);
  }, [nonExpiredItems]);

  const allStockByMedicine = useMemo(() => {
    const map = {};
    items.forEach(i => {
      const name = i.medicine?.name || 'Unknown';
      if (!map[name]) map[name] = { name, totalQty: 0, batches: [] };
      map[name].totalQty += i.available_qty;
      map[name].batches.push(i);
    });
    return Object.values(map).sort((a, b) => b.totalQty - a.totalQty);
  }, [items]);

  const pieData = useMemo(() =>
    stockByMedicine.map(s => ({ name: s.name, value: s.totalQty })),
  [stockByMedicine]);

  const barData = useMemo(() =>
    stockByMedicine.slice(0, 10).map(s => ({ name: s.name.length > 15 ? s.name.slice(0, 12) + '…' : s.name, quantity: s.totalQty })),
  [stockByMedicine]);

  const totalStock = useMemo(() => nonExpiredItems.reduce((s, i) => s + i.available_qty, 0), [nonExpiredItems]);

  const handlePrint = () => {
    const w = window.open('', '_blank');
    const today = new Date().toLocaleDateString();
    const now = new Date();
    const getExpiryStatus = (expStr) => {
      if (!expStr) return { label: 'N/A', color: '#64748b', bg: '#f1f5f9' };
      const exp = new Date(expStr + 'T00:00:00');
      const diff = Math.round((exp - now) / 86400000);
      if (diff < 0) return { label: 'EXPIRED', color: '#fff', bg: '#dc2626' };
      if (diff < 10) return { label: `${diff}d left`, color: '#fff', bg: '#ef4444' };
      if (diff <= 30) return { label: `${diff}d left`, color: '#000', bg: '#fbbf24' };
      return { label: `${diff}d left`, color: '#fff', bg: '#16a34a' };
    };

    let html = `<html><head><title>OM Medical - Inventory Report</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1e293b; padding: 40px; }
        h1 { font-size: 24px; color: #0f172a; }
        h2 { font-size: 18px; color: #0f172a; margin-top: 30px; margin-bottom: 10px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; }
        h3 { font-size: 15px; color: #334155; margin-top: 20px; margin-bottom: 8px; }
        .date { color: #64748b; font-size: 13px; margin-bottom: 25px; }
        .summary { display: flex; gap: 20px; margin-bottom: 30px; flex-wrap: wrap; }
        .summary-box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 20px; min-width: 140px; }
        .summary-box .label { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; }
        .summary-box .value { font-size: 26px; font-weight: 800; color: #0f172a; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; font-size: 12px; }
        th, td { border: 1px solid #e2e8f0; padding: 8px 10px; text-align: left; }
        th { background: #f8fafc; font-weight: 700; color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; }
        .exp-badge { padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; display: inline-block; }
        .medicine-header { background: #f1f5f9; font-weight: 700; color: #0f172a; }
        @media print { body { padding: 20px; } }
      </style>
      </head><body>
      <h1>OM Medical — Inventory Report</h1>
      <div class="date">Generated on ${today} &nbsp;|&nbsp; Total Medicines: ${allStockByMedicine.length} &nbsp;|&nbsp; Total Batches: ${items.length}</div>`;

    if (activeTab === 'stock') {
      const totalCount = items.length;
      const totalUnits = items.reduce((s, i) => s + i.available_qty, 0);
      const expiredCount = items.filter(i => i.expiration_date && new Date(i.expiration_date + 'T00:00:00') < now).length;
      const criticalCount = items.filter(i => { if (!i.expiration_date) return false; const d = Math.round((new Date(i.expiration_date+'T00:00:00') - now) / 86400000); return d >= 0 && d < 10; }).length;
      const warningCount = items.filter(i => { if (!i.expiration_date) return false; const d = Math.round((new Date(i.expiration_date+'T00:00:00') - now) / 86400000); return d >= 10 && d <= 30; }).length;
      const safeCount = items.filter(i => { if (!i.expiration_date) return true; const d = Math.round((new Date(i.expiration_date+'T00:00:00') - now) / 86400000); return d > 30; }).length;

      html += `<div class="summary">
        <div class="summary-box"><div class="label">Total Medicines</div><div class="value">${allStockByMedicine.length}</div></div>
        <div class="summary-box"><div class="label">Total Units</div><div class="value">${totalUnits}</div></div>
        <div class="summary-box"><div class="label">Total Batches</div><div class="value">${totalCount}</div></div>
        <div class="summary-box" style="border-color:#dc2626"><div class="label" style="color:#dc2626">Expired</div><div class="value" style="color:#dc2626">${expiredCount}</div></div>
        <div class="summary-box" style="border-color:#ef4444"><div class="label" style="color:#ef4444">Critical (&lt;10d)</div><div class="value" style="color:#ef4444">${criticalCount}</div></div>
        <div class="summary-box" style="border-color:#f59e0b"><div class="label" style="color:#f59e0b">Warning (&lt;30d)</div><div class="value" style="color:#f59e0b">${warningCount}</div></div>
        <div class="summary-box" style="border-color:#16a34a"><div class="label" style="color:#16a34a">Safe</div><div class="value" style="color:#16a34a">${safeCount}</div></div>
      </div>`;

      html += `<h2>Batch-Wise Stock Details</h2>`;
      allStockByMedicine.forEach(med => {
        html += `<h3>${med.name} &nbsp; <span style="font-weight:400;color:#64748b;font-size:13px">(${med.totalQty} units · ${med.batches.length} batch${med.batches.length > 1 ? 'es' : ''})</span></h3>`;
        html += `<table><thead><tr><th>Batch</th><th>Qty</th><th>Supplier</th><th>Mfg Date</th><th>Exp Date</th><th>Days Left</th><th>Status</th></tr></thead><tbody>`;
        med.batches.forEach(b => {
          const s = getExpiryStatus(b.expiration_date);
          const daysText = b.expiration_date
            ? (() => { const d = Math.round((new Date(b.expiration_date+'T00:00:00') - now) / 86400000); return d < 0 ? 'EXPIRED' : `${d} days`; })()
            : '—';
          html += `<tr>
            <td style="font-family:monospace;font-weight:600">${b.batch || '—'}</td>
            <td style="font-weight:700">${b.available_qty}</td>
            <td>${b.supplier || '—'}</td>
            <td>${formatDate(b.manufacturing_date)}</td>
            <td>${formatDate(b.expiration_date)}</td>
            <td style="font-weight:600">${daysText}</td>
            <td><span class="exp-badge" style="background:${s.bg};color:${s.color}">${s.label}</span></td>
          </tr>`;
        });
        html += `</tbody></table>`;
      });

    } else {
      html += `<h2>Transaction Log</h2>`;
      html += `<table><thead><tr><th>Date</th><th>Type</th><th>Medicine</th><th>Batch</th><th>Qty</th><th>Amount</th><th>Supplier</th></tr></thead><tbody>`;
      movements.forEach(m => {
        const typeColor = m.type === 'PURCHASE' ? '#16a34a' : '#dc2626';
        const typeBg = m.type === 'PURCHASE' ? '#dcfce7' : '#fee2e2';
        html += `<tr>
          <td>${formatDate(m.date)}</td>
          <td><span class="exp-badge" style="background:${typeBg};color:${typeColor}">${m.type}</span></td>
          <td style="font-weight:700">${m.medicine?.name || '—'}</td>
          <td style="font-family:monospace">${m.batch || '—'}</td>
          <td style="font-weight:700">${m.quantity}</td>
          <td style="font-weight:700">₹{m.amount?.toFixed(2)}</td>
          <td>${m.supplier?.name || '—'}</td>
        </tr>`;
      });
      html += `</tbody></table>`;
    }

    html += '</body></html>';
    w.document.write(html);
    w.document.close();
    w.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Stock & Transactions</h3>
          <p className="text-sm text-slate-500 mt-1">Medicine-wise stock overview with auto‑updating charts.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button onClick={handlePrint} className="self-start sm:self-auto rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white px-4 py-2.5 text-sm font-bold flex items-center gap-2 shadow-sm transition">
            🖨️ Print Report
          </button>
          <button onClick={() => onNavigate && onNavigate('sales')} className="self-start sm:self-auto rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white px-4 py-2.5 text-sm font-bold flex items-center gap-2 shadow-sm transition">
            <span className="text-base leading-none">＋</span> Add Stock
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-6">
        {['stock', 'movements'].map((t) => (
          <button key={t} onClick={() => setActiveTab(t)} className={`pb-3 text-sm font-bold border-b-2 transition ${activeTab === t ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            {t === 'stock' ? '📦 Stock Overview' : '🔄 Movement Logs'}
          </button>
        ))}
      </div>

      {loading ? <Spinner color="border-amber-300" /> : activeTab === 'stock' ? (
        <div className="space-y-6">
          {stockByMedicine.length === 0 ? (
            <EmptyState icon="📦" title="No stock entries yet" subtitle="Stock appears when you register purchase transactions." />
          ) : (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 border-l-4 border-l-slate-700">
                  <p className="text-xs text-slate-500 font-medium">Total Medicines</p>
                  <p className="text-2xl font-black text-slate-900 mt-1 leading-none">{stockByMedicine.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 border-l-4 border-l-emerald-500">
                  <p className="text-xs text-slate-500 font-medium">Total Units</p>
                  <p className="text-2xl font-black text-slate-900 mt-1 leading-none">{totalStock}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 border-l-4 border-l-amber-500">
                  <p className="text-xs text-slate-500 font-medium">Total Batches</p>
                  <p className="text-2xl font-black text-slate-900 mt-1 leading-none">{nonExpiredItems.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 border-l-4 border-l-rose-500">
                  <p className="text-xs text-slate-500 font-medium">Low Stock Items</p>
                  <p className="text-2xl font-black text-amber-600 mt-1 leading-none">{nonExpiredItems.filter(i => i.available_qty < 15).length}</p>
                </div>
              </div>

              <SearchInput value={stockSearch} onChange={(e) => setStockSearch(e.target.value)} placeholder="Search stock by medicine, batch or supplier..." />

              {/* Charts row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h4 className="text-sm font-bold text-slate-700 mb-3">Stock Distribution</h4>
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                          {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : <EmptyState icon="📊" title="No data" subtitle="" />}
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h4 className="text-sm font-bold text-slate-700 mb-3">Stock Quantities (Top 10)</h4>
                  {barData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={barData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={50} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <RechartsTooltip />
                        <Bar dataKey="quantity" radius={[4, 4, 0, 0]}>
                          {barData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <EmptyState icon="📊" title="No data" subtitle="" />}
                </div>
              </div>

              {/* Medicine cards */}
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-3">Medicine‑wise Stock ({stockByMedicine.length})</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  {stockByMedicine.map((s) => (
                    <div key={s.name} className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition hover:shadow-md">
                      <div className="px-5 pt-5">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-bold text-slate-900 text-lg leading-tight">{s.name}</h4>
                          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold border ${
                            s.totalQty === 0 ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            s.totalQty < 15 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>{s.totalQty} units</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{s.batches.length} batch{s.batches.length > 1 ? 'es' : ''}</p>
                      </div>
                      <div className="text-left mx-5 mt-3 border-t border-slate-100 pt-3 pb-5 space-y-2">
                        {s.batches.map(b => {
                          const exp = b.expiration_date && new Date(b.expiration_date);
                          const expired = exp && exp < new Date();
                          return (
                            <div key={b.id} className="flex items-center justify-between gap-3 text-xs">
                              <div className="min-w-0">
                                <p className="font-mono text-slate-600 font-semibold truncate">{b.batch || '—'}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">Mfg {formatDate(b.manufacturing_date)} · Exp {formatDate(b.expiration_date)}</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="rounded-lg bg-slate-50 border border-slate-200 px-2 py-1 font-bold text-slate-700">{b.available_qty} in stock</span>
                                {expired && <span className="rounded bg-rose-100 text-rose-700 px-1.5 py-0.5 font-bold text-[10px]">EXPIRED</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <SearchInput value={movementSearch} onChange={(e) => setMovementSearch(e.target.value)} placeholder="Search movements by medicine, batch or type..." />
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-slate-100">
              <thead>
                <tr className="bg-slate-50/80">
                  {['Date', 'Type', 'Medicine', 'Batch', 'Qty', 'Amount', 'Supplier'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {movements.length === 0 ? (
                  <tr><td colSpan="7"><EmptyState icon="📋" title={movementSearch ? 'No matching movements' : 'No transactions yet'} subtitle={movementSearch ? 'Try a different search term.' : 'Click "Add Stock" to register a purchase.'} /></td></tr>
                ) : movements.map((m, i) => (
                  <motion.tr key={m.id} className="hover:bg-slate-50/50 transition" custom={i} variants={{hidden: {opacity:0}, visible:{opacity:1}}} initial="hidden" animate="visible" whileHover={{ scale: 1.01 }}>
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{formatDate(m.date)}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <Badge color={m.type === 'PURCHASE' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}>{m.type}</Badge>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-800 whitespace-nowrap">{m.medicine?.name}</td>
                    <td className="px-5 py-3.5 font-mono text-slate-600 whitespace-nowrap">{m.batch || '—'}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-700 whitespace-nowrap">{m.quantity}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">₹{m.amount?.toFixed(2)}</td>
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{m.supplier?.name || '—'}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </motion.div>
      )}
    </div>
  );
}

/* ───────────────────────────── SUPPLIERS ───────────────────────────── */

export function SuppliersView({ role = 'ADMIN' }) {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ name: '', address: '', joinedfrom: '', contact: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadSuppliers = (q) => {
    if (!token()) return;
    setLoading(true);
    const base = role === 'PHARMACIST' ? `${API}/api/pharmacy` : `${API}/api/admin`;
    const url = q ? `${base}/suppliers/search?q=${encodeURIComponent(q)}` : `${base}/suppliers`;
    fetch(url, { headers: auth() })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setSuppliers)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => loadSuppliers(searchQuery.trim() || null), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, role]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!token()) return;
    const url = editingId ? `${API}/api/admin/suppliers/${editingId}` : `${API}/api/admin/suppliers`;
    const res = await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: jsonHeaders(), body: JSON.stringify({ ...form, contact: Number(form.contact) }) });
    if (res.ok) { setForm({ name: '', address: '', joinedfrom: '', contact: '', email: '' }); setEditingId(null); setShowForm(false); loadSuppliers(searchQuery.trim() || null); }
  };

  const handleEdit = (s) => { setEditingId(s.id); setShowForm(true); setForm({ name: s.name, address: s.address, joinedfrom: s.joinedfrom || '', contact: s.contact || '', email: s.email }); };
  const cancelEdit = () => { setEditingId(null); setShowForm(false); setForm({ name: '', address: '', joinedfrom: '', contact: '', email: '' }); };
  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: 'Delete this supplier?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#e11d48', confirmButtonText: 'Delete' });
    if (!result.isConfirmed || !token()) return;
    if ((await fetch(`${API}/api/admin/suppliers/${id}`, { method: 'DELETE', headers: auth() })).ok) {
      loadSuppliers(searchQuery.trim() || null);
      Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false });
    }
  };

  const canManage = role === 'ADMIN' || role === 'PHARMACIST';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Suppliers</h3>
          <p className="text-sm text-slate-500 mt-1">Manage vendor contacts and partnership details.</p>
        </div>
        {canManage && (
          <button
            onClick={() => {
              if (showForm && !editingId) setShowForm(false);
              else { setEditingId(null); setForm({ name: '', address: '', joinedfrom: '', contact: '', email: '' }); setShowForm(true); }
            }}
            className="self-start sm:self-auto rounded-xl bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white px-4 py-2.5 text-sm font-bold flex items-center gap-2 shadow-sm transition"
          >
            <span className="text-base leading-none">{showForm && !editingId ? '✕' : '＋'}</span>
            {showForm && !editingId ? 'Close' : 'Add Supplier'}
          </button>
        )}
      </div>

      {canManage && (
        <AnimatePresence>
          {showForm && (
        <motion.form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput label="Company Name" placeholder="Acme Pharma Ltd." value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required tooltip="Legal business name of the supplier" />
            <FormInput label="Email" type="email" placeholder="vendor@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required tooltip="Supplier's primary email address" />
            <FormInput label="Address" placeholder="123 Medical District" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required tooltip="Physical or mailing address" />
            <FormInput label="Partner Since" type="date" value={form.joinedfrom} onChange={(e) => setForm({ ...form, joinedfrom: e.target.value })} required tooltip="Date when partnership began" />
            <FormInput label="Phone / Contact" type="number" placeholder="+1 555 0123" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} required tooltip="Primary contact phone number" />
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-700 active:bg-violet-800 transition shadow-sm">
              {editingId ? 'Update Supplier' : 'Add Supplier'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
                Cancel
              </button>
            )}
          </div>
        </motion.form>
          )}
        </AnimatePresence>
      )}

      <SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name, address or email..." />

      {loading ? <Spinner color="border-violet-300" /> : (
        <motion.div className="grid gap-4 md:grid-cols-2" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} initial="hidden" animate="visible">
          {suppliers.length === 0 ? (
            <div className="md:col-span-2"><EmptyState icon="🏭" title={searchQuery ? 'No matching suppliers' : 'No suppliers yet'} subtitle={searchQuery ? 'Try a different search term.' : 'Click "Add Supplier" to add your first vendor.'} /></div>
          ) : suppliers.map((s, i) => (
            <motion.div
              key={s.id}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition group flex flex-col"
              variants={{ hidden: { opacity: 0, y: 20, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 14 } } }}
              whileHover={{ y: -4, boxShadow: '0 8px 25px -8px rgba(0,0,0,0.1)' }}
              layout
            >
              <div className="px-5 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-bold text-slate-900 text-lg leading-tight">{s.name}</h4>
                  <Badge color="bg-violet-50 text-violet-700 border-violet-200">Partner</Badge>
                </div>
                <p className="text-left text-xs text-violet-600 font-semibold mt-0.5 truncate">{s.email}</p>
              </div>
              <div className="mx-5 mt-3 border-t border-slate-100 pt-3 space-y-1.5 text-sm">
                <p className="flex items-start gap-2 text-slate-600"><span className="w-4 shrink-0">📍</span><span className="min-w-0 break-words">{s.address || '—'}</span></p>
                <p className="flex items-center gap-2 text-slate-600"><span className="w-4 shrink-0">📞</span>{s.contact || '—'}</p>
                <p className="flex items-center gap-2 text-slate-600"><span className="w-4 shrink-0">🗓️</span>Partner since <b className="text-slate-800">{formatDate(s.joinedfrom)}</b></p>
              </div>
              {canManage && (
                <div className="mt-auto px-5 pb-5 pt-3 flex gap-2 justify-end">
                  <ActionBtn onClick={() => handleEdit(s)}>Edit</ActionBtn>
                  <ActionBtn onClick={() => handleDelete(s.id)} color="rose">Delete</ActionBtn>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

/* ───────────────────────────── SALES & PURCHASES ───────────────────────────── */

export function SalesView({ role = 'ADMIN' }) {
  const [records, setRecords] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [form, setForm] = useState({
    medicineId: '', quantity: '', amount: '', date: new Date().toISOString().split('T')[0],
    type: 'PURCHASE', batch: '', supplierId: '', manufacturing_date: '', expiration_date: '',
    newMedicineName: '', newMedicineDescription: '', newMedicineCategory: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [purchaseLedger, setPurchaseLedger] = useState([]);

  const loadData = async (q) => {
    if (!token()) { setLoading(false); return; }
    setLoading(true);
    try {
      const salesUrl = q ? `${API}/api/admin/sales/search?q=${encodeURIComponent(q)}` : `${API}/api/admin/sales`;
      const [rSales, rMed, rSup, rInv] = await Promise.all([
        fetch(salesUrl, { headers: auth() }),
        fetch(`${API}/api/admin/medicines`, { headers: auth() }),
        fetch(`${API}/api/admin/suppliers`, { headers: auth() }),
        fetch(`${API}/api/admin/inventory`, { headers: auth() }),
      ]);
      if (rSales.ok) {
        const salesJson = await rSales.json();
        setRecords(salesJson);
        if (!q) setPurchaseLedger(salesJson);
      }
      if (rMed.ok) setMedicines(await rMed.json());
      if (rSup.ok) setSuppliers(await rSup.json());
      if (rInv.ok) setInventoryItems(await rInv.json());
    } catch { setErrorMessage('Failed to load data. Is the backend running?'); }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadData(searchQuery.trim() || null), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const resetForm = () => {
    setForm({
      medicineId: '', quantity: '', amount: '', date: new Date().toISOString().split('T')[0],
      type: 'PURCHASE', batch: '', supplierId: '', manufacturing_date: '', expiration_date: '',
      newMedicineName: '', newMedicineDescription: '', newMedicineCategory: '',
    });
    setEditingId(null); setShowForm(false); setErrorMessage(''); setSuccessMessage('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage(''); setSuccessMessage(''); setSaving(true);
    if (!token()) { setSaving(false); return; }

    const url = editingId ? `${API}/api/admin/sales/${editingId}` : `${API}/api/admin/sales`;
    const payload = {
      quantity: Number(form.quantity) || 1,
      amount: parseFloat(form.amount) || 0,
      date: form.date || new Date().toISOString().split('T')[0],
      type: form.type,
      batch: form.batch,
    };

    if (form.medicineId === 'new') {
      payload.medicineId = null;
      payload.newMedicineName = form.newMedicineName;
      payload.newMedicineDescription = form.newMedicineDescription || '';
      payload.newMedicineCategory = form.newMedicineCategory || null;
    } else {
      payload.medicineId = Number(form.medicineId) || null;
    }

    if (form.type === 'PURCHASE') {
      payload.supplierId = form.supplierId ? Number(form.supplierId) : null;
      payload.manufacturing_date = form.manufacturing_date || null;
      payload.expiration_date = form.expiration_date || null;
    }

    try {
      const res = await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: jsonHeaders(), body: JSON.stringify(payload) });
      if (res.ok) {
        setSuccessMessage(editingId ? 'Transaction updated.' : 'Transaction registered. Inventory updated.');
        resetForm(); loadData(searchQuery.trim() || null);
      } else {
        let err = await res.text();
        try { const j = JSON.parse(err); err = j.message || j.error || err; } catch {}
        setErrorMessage(err || 'Operation failed. Check form inputs.');
      }
    } catch { setErrorMessage('Network error. Is the backend running?'); }
    setSaving(false);
  };

  const handleEdit = (r) => {
    setEditingId(r.id); setShowForm(true); setErrorMessage(''); setSuccessMessage('');
    setForm({
      medicineId: r.medicine?.id || '', quantity: r.quantity, amount: r.amount,
      date: r.date || '', type: r.type, batch: r.batch || '',
      supplierId: r.supplier?.id || '', manufacturing_date: r.manufacturing_date || '',
      expiration_date: r.expiration_date || '',
      newMedicineName: '', newMedicineDescription: '', newMedicineCategory: '',
    });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: 'Delete this transaction?', text: 'Stock will be reverted.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#e11d48', confirmButtonText: 'Delete' });
    if (!result.isConfirmed || !token()) return;
    if ((await fetch(`${API}/api/admin/sales/${id}`, { method: 'DELETE', headers: auth() })).ok) {
      setSuccessMessage('Transaction deleted. Inventory reverted.'); loadData(searchQuery.trim() || null);
      Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false });
    }
  };

  const canManage = role === 'ADMIN' || role === 'PHARMACIST';
  const purchaseCount = records.filter(r => r.type === 'PURCHASE').length;
  const saleCount = records.filter(r => r.type === 'SALE').length;

  const availableBatches = form.medicineId && form.medicineId !== 'new'
    ? inventoryItems.filter(i => i.medicine?.id === Number(form.medicineId) && i.available_qty > 0 && !(i.expiration_date && new Date(i.expiration_date) < new Date()))
    : [];
  const medicinesWithStock = medicines.filter(m => inventoryItems.some(i => i.medicine?.id === m.id && i.available_qty > 0));
  const selectedBatch = form.type === 'SALE' && form.batch
    ? availableBatches.find(b => b.batch === form.batch) || null
    : null;
  const quantityTooHigh = selectedBatch && Number(form.quantity) > selectedBatch.available_qty;

  // Latest purchase of this medicine+batch gives the unit cost → estimated profit.
  const purchaseCostPerUnit = selectedBatch
    ? (() => {
        const buys = purchaseLedger.filter(r => r.type === 'PURCHASE' && r.medicine?.id === Number(form.medicineId) && r.batch === form.batch);
        if (buys.length === 0) return null;
        const last = buys.reduce((a, b) => ((b.date || '') > (a.date || '') ? b : a));
        return last && last.quantity > 0 ? last.amount / last.quantity : null;
      })()
    : null;
  const estProfit = form.type === 'SALE' && selectedBatch && purchaseCostPerUnit != null
    ? Math.round(((Number(form.amount) || 0) - purchaseCostPerUnit * (Number(form.quantity) || 0)) * 100) / 100
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Sales & Purchase</h3>
          <p className="text-sm text-slate-500 mt-1">Register transactions. Inventory adjusts automatically on save.</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex gap-2">
            <Badge color="bg-emerald-50 text-emerald-700 border-emerald-200">{saleCount} Sales</Badge>
            <Badge color="bg-blue-50 text-blue-700 border-blue-200">{purchaseCount} Purchases</Badge>
          </div>
          {canManage && (
            <button
              onClick={() => {
                if (showForm && !editingId) setShowForm(false);
                else { setEditingId(null); setForm({ medicineId: '', quantity: '', amount: '', date: new Date().toISOString().split('T')[0], type: 'PURCHASE', batch: '', supplierId: '', manufacturing_date: '', expiration_date: '', newMedicineName: '', newMedicineDescription: '', newMedicineCategory: '' }); setErrorMessage(''); setSuccessMessage(''); setShowForm(true); }
              }}
              className="rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white px-4 py-2.5 text-sm font-bold flex items-center gap-2 shadow-sm transition"
            >
              <span className="text-base leading-none">{showForm && !editingId ? '✕' : '＋'}</span>
              {showForm && !editingId ? 'Close' : 'Add Transaction'}
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-sm font-semibold text-rose-700">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-sm font-semibold text-emerald-700">{successMessage}</div>
      )}

      {/* Form */}
      {canManage && (
        <AnimatePresence>
          {showForm && (
        <motion.form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
          {/* Form header strip */}
          <div className={`px-5 py-3 border-b flex items-center justify-between ${form.type === 'PURCHASE' ? 'bg-blue-50/80 border-blue-100' : 'bg-emerald-50/80 border-emerald-100'}`}>
            <h4 className={`text-sm font-bold ${form.type === 'PURCHASE' ? 'text-blue-800' : 'text-emerald-800'}`}>
              {editingId ? 'Edit Transaction' : form.type === 'PURCHASE' ? 'New Purchase Entry' : 'New Sale Entry'}
            </h4>
            {editingId && <button type="button" onClick={resetForm} className="text-xs font-medium text-slate-500 hover:text-slate-800 transition">Cancel Edit</button>}
          </div>

          <div className="p-5 grid gap-4 md:grid-cols-2">
            {/* Type */}
            <FormSelect label="Transaction Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, medicineId: '', batch: '', supplierId: '', newMedicineName: '', newMedicineDescription: '', newMedicineCategory: '' })} tooltip="Choose Purchase to receive stock or Sale to dispense">
              <option value="PURCHASE">PURCHASE (Receive Stock)</option>
              <option value="SALE">SALE (Dispense Stock)</option>
            </FormSelect>

            {/* Medicine */}
              <FormSelect label="Medicine" value={form.medicineId} onChange={(e) => setForm({ ...form, medicineId: e.target.value, batch: '' })} required tooltip="Select an existing medicine or add a new one">
                  <option value="">-- Select Medicine --</option>
                  {form.type === 'PURCHASE' && <option value="new" className="text-blue-600 font-bold">+ Add New Medicine (Inline)</option>}
                  {medicines.map(m => {
                    const inStock = inventoryItems.some(i => i.medicine?.id === m.id && i.available_qty > 0);
                    return <option key={m.id} value={m.id} disabled={form.type === 'SALE' && !inStock}>{m.name} ({m.category || 'N/A'}){form.type === 'SALE' && !inStock ? ' — out of stock' : ''}</option>;
                  })}
                </FormSelect>

            {/* Inline new medicine */}
            {form.medicineId === 'new' && form.type === 'PURCHASE' && (
              <div className="md:col-span-2 border border-dashed border-blue-200 bg-blue-50/40 rounded-2xl p-4 grid gap-3 md:grid-cols-2">
                <div className="md:col-span-2 text-sm font-bold text-blue-800 border-b border-blue-100 pb-2">Define New Medicine</div>
                <FormInput label="Medicine Name" placeholder="e.g. Ibuprofen 400mg" value={form.newMedicineName} onChange={(e) => setForm({ ...form, newMedicineName: e.target.value })} required tooltip="Name of the new medicine to add" />
                <FormSelect label="Category" value={form.newMedicineCategory} onChange={(e) => setForm({ ...form, newMedicineCategory: e.target.value })} required tooltip="Therapeutic category for the new medicine">
                  <option value="">Select Category</option>
                  {Object.entries(CAT_LABELS).map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
                </FormSelect>
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Description / Usage</label>
                  <textarea className="rounded-xl border border-blue-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 h-16 resize-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition" placeholder="Clinical details, dosage, warnings..." value={form.newMedicineDescription} onChange={(e) => setForm({ ...form, newMedicineDescription: e.target.value })} data-tooltip-id="dash-tooltip" data-tooltip-content="Clinical details, dosage instructions, or warnings" />
                </div>
              </div>
            )}

            {/* Batch */}
            {form.type === 'SALE' ? (
              <FormSelect label="Select Batch (In Stock)" value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} required tooltip="Choose which batch to dispense from">
                <option value="">-- Select Batch --</option>
                {availableBatches.length > 0
                  ? availableBatches.map(b => <option key={b.id} value={b.batch}>{b.batch} — Qty: {b.available_qty}</option>)
                  : <option value="" disabled>No batches in stock</option>
                }
              </FormSelect>
            ) : (
              <FormInput label="Batch Code" placeholder="e.g. BATCH-2026A" value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} required tooltip="Unique batch identifier for this purchase" />
            )}

            {/* Quantity + remaining (sales) */}
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <FormInput label="Quantity (Units)" type="number" placeholder="Number of units" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} min="1" required tooltip="Number of units being purchased or sold" />
              </div>
              {selectedBatch && (
                <div className="flex-1 flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Remaining in batch</span>
                  <div className={`rounded-xl border px-3.5 py-2.5 text-sm font-black transition ${quantityTooHigh ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                    {selectedBatch.available_qty} units{quantityTooHigh ? ' · insufficient!' : ''}
                  </div>
                </div>
              )}
            </div>

            {/* Amount + estimated profit (sales) */}
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <FormInput label="Total Amount (₹)" type="number" step="0.01" placeholder="Total cost" value={form.amount} onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} min="0" required tooltip="Total monetary value of the transaction" />
              </div>
              {estProfit !== null && (
                <div className="flex-1 flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Estimated Profit</span>
                  <div className={`rounded-xl border px-3.5 py-2.5 text-sm font-black transition ${estProfit >= 0 ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-300 bg-rose-50 text-rose-700'}`}>
                    {estProfit >= 0 ? `+₹${estProfit.toFixed(2)}` : `Loss ₹${Math.abs(estProfit).toFixed(2)}`}
                  </div>
                </div>
              )}
            </div>

            {/* Date */}
            <FormInput label="Transaction Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required tooltip="Date when the transaction took place" />

            {/* Purchase-only */}
            {form.type === 'PURCHASE' && (
              <>
                <FormSelect label="Supplier (Vendor)" value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} tooltip="Select the vendor this purchase is from">
                  <option value="">-- Select Supplier --</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </FormSelect>
                <FormInput label="Manufacturing Date" type="date" value={form.manufacturing_date} onChange={(e) => setForm({ ...form, manufacturing_date: e.target.value })} tooltip="Date the batch was manufactured" />
                <FormInput label="Expiration Date" type="date" value={form.expiration_date} onChange={(e) => setForm({ ...form, expiration_date: e.target.value })} tooltip="Expiration date of this batch" />
              </>
            )}

            {/* Submit */}
            <div className="md:col-span-2 pt-3 border-t border-slate-100">
              <button
                type="submit"
                disabled={saving}
                className={`w-full rounded-xl px-5 py-3 text-sm font-bold text-white shadow-sm transition disabled:opacity-50 ${
                  form.type === 'PURCHASE'
                    ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                    : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
                }`}
              >
                {saving ? 'Saving...' : editingId ? 'Update Transaction' : form.type === 'PURCHASE' ? 'Register Purchase' : 'Register Sale'}
              </button>
            </div>
          </div>
        </motion.form>
          )}
        </AnimatePresence>
      )}

      {/* Records */}
      <SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by medicine, batch or type..." />

      {loading ? <Spinner color="border-violet-300" /> : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h4 className="text-sm font-bold text-slate-700 mb-3">Transaction History ({records.length})</h4>
          {records.length === 0 ? (
            <EmptyState icon="🧾" title={searchQuery ? 'No matching transactions' : 'No transactions yet'} subtitle={searchQuery ? 'Try a different search term.' : 'Click "Add Transaction" to register a purchase or sale.'} />
          ) : (
            <motion.div className="grid gap-3 md:grid-cols-2" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} initial="hidden" animate="visible">
              {records.map((r, i) => (
                <motion.div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-md transition group" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} whileHover={{ y: -2 }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{r.medicine?.name || 'Unknown'}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Batch: {r.batch || '—'}</p>
                    </div>
                    <Badge color={r.type === 'SALE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}>{r.type}</Badge>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-50 space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-slate-400">Quantity</span><span className="font-bold text-slate-700">{r.quantity} units</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Amount</span><span className="font-black text-slate-900">₹{r.amount?.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Transaction Date</span><span className="font-semibold text-slate-600">{formatDate(r.date)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Expiration Date</span><span className="font-semibold text-slate-600">{formatDate(r.expiration_date)}</span></div>
                    {r.supplier && <div className="flex justify-between border-t border-dashed border-slate-100 pt-1.5"><span className="text-slate-400">Vendor</span><span className="font-semibold text-slate-600">{r.supplier.name}</span></div>}
                  </div>
                  {canManage && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition">
                      <ActionBtn onClick={() => handleEdit(r)}>Edit</ActionBtn>
                      <ActionBtn onClick={() => handleDelete(r.id)} color="rose">Delete</ActionBtn>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

/* ───────────────────────────── EXPIRY ───────────────────────────── */

const STATUS_META = {
  expired:  { label: 'Expired',     dot: 'bg-rose-600',        badge: 'bg-rose-100 text-rose-700 border-rose-200' },
  critical: { label: 'Critical',    dot: 'bg-red-500',         badge: 'bg-red-50 text-red-700 border-red-200' },
  warning:  { label: 'Warning',     dot: 'bg-amber-500',       badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  safe:     { label: 'Safe',        dot: 'bg-emerald-500',     badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const exp = new Date(dateStr + 'T00:00:00');
  return Math.round((exp - today) / 86400000);
};

const itemStatus = (item) => {
  const d = daysUntil(item.expiration_date);
  if (d === null) return 'safe';
  if (d < 0) return 'expired';
  if (d < 10) return 'critical';
  if (d <= 30) return 'warning';
  return 'safe';
};

export function ExpiryView({ role = 'ADMIN' }) {
  const [summary, setSummary] = useState({ expired: 0, critical: 0, warning: 0, safe: 0, atRiskUnits: 0 });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = () => {
    if (!token()) { setLoading(false); return; }
    setLoading(true);
    const base = role === 'PHARMACIST' ? `${API}/api/pharmacy` : `${API}/api/admin`;
    fetch(`${base}/expiry?days=30`, { headers: auth() })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => {
        setSummary(data);
        setItems(data.items || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [role]);

  const enriched = useMemo(() =>
    items.map((i) => {
      const status = itemStatus(i);
      const d = daysUntil(i.expiration_date);
      return { ...i, status, daysLeft: d };
    }),
  [items]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return enriched.filter((i) => {
      if (filter !== 'all' && i.status !== filter) return false;
      if (q) {
        const hay = `${i.medicine?.name || ''} ${i.medicine_name || ''} ${i.batch || ''} ${i.supplier || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [enriched, filter, searchQuery]);

  const handleSendReport = async () => {
    const confirm = await Swal.fire({
      title: 'Send expiry report?',
      text: 'Email report will be sent to all ADMIN, PHARMACIST and STAFF users.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Send Report',
      confirmButtonColor: '#0f172a',
      cancelButtonText: 'Cancel',
    });
    if (!confirm.isConfirmed || !token()) return;
    setSending(true);
    try {
      const res = await fetch(`${API}/api/admin/expiry/send-report`, { method: 'POST', headers: auth() });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Report sent!', text: `Emailed ${data.recipients ?? 0} recipient(s) · Critical ${data.criticalCount ?? 0} · Warning ${data.warningCount ?? 0}`, timer: 3000, showConfirmButton: false });
      } else {
        Swal.fire({ icon: 'error', title: 'Failed to send', text: data.message || data || 'Check SMTP settings in application.properties.' });
      }
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Failed to send', text: 'Check the SMTP configuration and try again.' });
    } finally {
      setSending(false);
    }
  };

  const cards = [
    { key: 'expired', title: 'Expired', value: summary.expired, accent: 'text-rose-600', bg: 'bg-rose-50 border-rose-200', icon: '⛔' },
    { key: 'critical', title: 'Critical < 10 days', value: summary.critical, accent: 'text-red-600', bg: 'bg-red-50 border-red-200', icon: '🔴' },
    { key: 'warning', title: 'Warning < 30 days', value: summary.warning, accent: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', icon: '🟡' },
    { key: 'atRiskUnits', title: 'At-Risk Units', value: summary.atRiskUnits, accent: 'text-slate-900', bg: 'bg-slate-100 border-slate-200', icon: '⚠️' },
  ];

  const tabs = [
    { key: 'all', label: `All (${items.length})` },
    { key: 'expired', label: `Expired (${summary.expired})` },
    { key: 'critical', label: `Critical (${summary.critical})` },
    { key: 'warning', label: `Warning (${summary.warning})` },
    { key: 'safe', label: `Safe (${summary.safe})` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Medicine Expiry Tracking</h3>
          <p className="text-sm text-slate-500 mt-1">Monitor stock expiring soon across all batches.</p>
        </div>
        <button
          onClick={handleSendReport}
          disabled={sending}
          className="self-start sm:self-auto rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white px-4 py-2.5 text-sm font-bold flex items-center gap-2 shadow-sm transition disabled:opacity-50"
        >
          {sending ? <span className="animate-spin inline-block">⏳</span> : '📧'} Send Expiry Report
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <motion.div key={c.key} className={`rounded-2xl border p-4 ${c.bg}`} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 200, damping: 16 }}>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 font-medium">{c.title}</p>
              <span>{c.icon}</span>
            </div>
            <p className={`text-2xl font-black mt-1 ${c.accent}`}>{c.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex border-b border-slate-200 gap-5 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setFilter(t.key)} className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition ${filter === t.key ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="sm:w-72">
          <SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search medicine, batch, supplier..." />
        </div>
      </div>

      {loading ? <Spinner color="border-rose-300" /> : filtered.length === 0 ? (
        <EmptyState icon="🗓️" title={searchQuery || filter !== 'all' ? 'No matching items' : 'No inventory with expiry dates'} subtitle={searchQuery || filter !== 'all' ? 'Try a different search or filter.' : 'Add stock via purchase transactions to track expiry.'} />
      ) : (
        <motion.div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Medicine</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Batch</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Qty</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Supplier</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Expiry Date</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Days Left</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((i) => {
                const meta = STATUS_META[i.status];
                return (
                  <tr key={i.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{i.medicine?.name || i.medicine_name || 'Unknown'}</td>
                    <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{i.batch || '—'}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">{i.available_qty}</td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">{i.supplier || '—'}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">{formatDate(i.expiration_date)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 font-bold ${i.daysLeft === null ? 'text-slate-700' : i.daysLeft < 0 ? 'text-rose-700' : i.daysLeft < 10 ? 'text-red-600' : i.daysLeft <= 30 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                        {i.daysLeft === null ? '—' : i.daysLeft < 0 ? 'EXPIRED' : `${i.daysLeft} days`}
                      </span>
                    </td>
                    <td className="px-5 py-3.5"><Badge color={meta.badge}>{meta.label}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      )}


    </div>
  );
}
