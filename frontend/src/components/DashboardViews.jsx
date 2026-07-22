import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const API = 'http://localhost:8080';
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

function FormInput({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</label>}
      <input
        className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition"
        {...props}
      />
    </div>
  );
}

function FormSelect({ label, children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</label>}
      <select
        className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition"
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

/* ───────────────────────────── USERS ───────────────────────────── */

export function UsersView() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', username: '', password: '', role: 'STAFF' });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const loadUsers = () => {
    if (!token()) return;
    setLoading(true);
    fetch(`${API}/api/admin/users`, { headers: auth() })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(loadUsers, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!token()) return;
    const url = editingId ? `${API}/api/admin/users/${editingId}` : `${API}/api/admin/users`;
    const payload = { ...form };
    if (editingId && !payload.password.trim()) delete payload.password;
    const res = await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: jsonHeaders(), body: JSON.stringify(payload) });
    if (res.ok) { setForm({ name: '', username: '', password: '', role: 'STAFF' }); setEditingId(null); loadUsers(); }
  };

  const handleEdit = (u) => { setEditingId(u.id); setForm({ name: u.name, username: u.username, password: '', role: u.role }); };
  const cancelEdit = () => { setEditingId(null); setForm({ name: '', username: '', password: '', role: 'STAFF' }); };
  const handleDelete = async (id) => {
    if (!token() || !window.confirm('Delete this user?')) return;
    if ((await fetch(`${API}/api/admin/users/${id}`, { method: 'DELETE', headers: auth() })).ok) loadUsers();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">User Management</h3>
        <p className="text-sm text-slate-500 mt-1">Create, update and manage user accounts and role assignments.</p>
      </div>

      <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <FormInput label="Full Name" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <FormInput label="Username" placeholder="johndoe" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <FormInput label={editingId ? 'Password (blank = keep)' : 'Password'} type="password" placeholder="••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editingId} />
          <FormSelect label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="STAFF">Staff</option>
            <option value="PHARMACIST">Pharmacist</option>
            <option value="ADMIN">Admin</option>
          </FormSelect>
        </div>
        <div className="mt-4 flex gap-2">
          <button type="submit" className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 active:bg-slate-950 transition shadow-sm">
            {editingId ? 'Update User' : 'Add User'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? <Spinner /> : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Username</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-5 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr><td colSpan="4"><EmptyState icon="👤" title="No users yet" subtitle="Add your first user above." /></td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{u.name}</td>
                  <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{u.username}</td>
                  <td className="px-5 py-3.5"><Badge color={ROLE_COLORS[u.role] || ROLE_COLORS.STAFF}>{u.role}</Badge></td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex gap-1.5 justify-end">
                      <ActionBtn onClick={() => handleEdit(u)}>Edit</ActionBtn>
                      <ActionBtn onClick={() => handleDelete(u.id)} color="rose">Delete</ActionBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────────── MEDICINES ───────────────────────────── */

export function MedicinesView({ role = 'ADMIN' }) {
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', category: '' });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const loadMedicines = () => {
    if (!token()) { setLoading(false); return; }
    const ep = role === 'PHARMACIST' ? `${API}/api/pharmacy/medicines` : `${API}/api/admin/medicines`;
    setLoading(true);
    fetch(ep, { headers: auth() })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setMedicines)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(loadMedicines, [role]);

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!token()) return;
    const payload = { ...form };
    if (!payload.category) payload.category = null;
    const url = editingId ? `${API}/api/admin/medicines/${editingId}` : `${API}/api/admin/medicines`;
    const res = await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: jsonHeaders(), body: JSON.stringify(payload) });
    if (res.ok) { setForm({ name: '', description: '', category: '' }); setEditingId(null); loadMedicines(); }
    else { const txt = await res.text(); setErrorMsg(txt || 'Failed to save medicine.'); }
  };

  const handleEdit = (m) => { setEditingId(m.id); setForm({ name: m.name, description: m.description || '', category: m.category || '' }); };
  const cancelEdit = () => { setEditingId(null); setForm({ name: '', description: '', category: '' }); };
  const handleDelete = async (id) => {
    if (!token() || !window.confirm('Delete this medicine?')) return;
    if ((await fetch(`${API}/api/admin/medicines/${id}`, { method: 'DELETE', headers: auth() })).ok) loadMedicines();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Medicine Catalog</h3>
        <p className="text-sm text-slate-500 mt-1">{role === 'PHARMACIST' ? 'Browse available medicines and clinical details.' : 'Define formulas, descriptions and therapeutic categories.'}</p>
      </div>

      {errorMsg && <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm font-semibold text-rose-700">{errorMsg}</div>}

      {(role === 'ADMIN' || role === 'PHARMACIST') && (
        <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput label="Medicine Name" placeholder="e.g. Paracetamol 500mg" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <FormSelect label="Therapeutic Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
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
        </form>
      )}

      {loading ? <Spinner color="border-emerald-300" /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {medicines.length === 0 ? (
            <div className="md:col-span-2"><EmptyState icon="💊" title="No medicines in catalog" subtitle="Define your first medicine formula above." /></div>
          ) : medicines.map((m) => (
            <div key={m.id} className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between hover:shadow-md transition group">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-bold text-slate-900 text-lg leading-tight">{m.name}</h4>
                  <Badge color={CAT_COLORS[m.category] || CAT_COLORS.OTHER}>{CAT_LABELS[m.category] || m.category || 'N/A'}</Badge>
                </div>
                {m.description && (
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3 border-t border-slate-50 pt-3">{m.description}</p>
                )}
              </div>
              {(role === 'ADMIN' || role === 'PHARMACIST') && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition">
                  <ActionBtn onClick={() => handleEdit(m)}>Edit</ActionBtn>
                  <ActionBtn onClick={() => handleDelete(m.id)} color="rose">Delete</ActionBtn>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────────── INVENTORY ───────────────────────────── */

const CHART_COLORS = ['#6366f1','#f59e0b','#10b981','#ef4444','#8b5cf6','#06b6d4','#f97316','#ec4899','#14b8a6','#eab308'];

export function InventoryView({ role = 'ADMIN' }) {
  const [items, setItems] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stock');

  const loadData = async () => {
    if (!token()) { setLoading(false); return; }
    setLoading(true);
    try {
      const ep = role === 'PHARMACIST' ? `${API}/api/pharmacy/inventory` : `${API}/api/admin/inventory`;
      const [invRes, movRes] = await Promise.all([
        fetch(ep, { headers: auth() }),
        fetch(`${API}/api/admin/sales`, { headers: auth() }),
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

  const stockByMedicine = useMemo(() => {
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

  const totalStock = useMemo(() => items.reduce((s, i) => s + i.available_qty, 0), [items]);

  const handlePrint = () => {
    const w = window.open('', '_blank');
    const today = new Date().toLocaleDateString();
    let html = `<html><head><title>OM Medical - Stock Report</title>
      <style>body{font-family:system-ui,sans-serif;color:#1e293b;padding:40px}h1{margin-bottom:5px}.date{color:#64748b;font-size:14px;margin-bottom:30px}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #e2e8f0;padding:10px;text-align:left;font-size:13px}th{background:#f8fafc;font-weight:600;color:#475569}.badge{padding:3px 8px;border-radius:9999px;font-size:11px;font-weight:bold}.in{background:#dcfce7;color:#15803d}.out{background:#fee2e2;color:#b91c1c}</style>
      </head><body><h1>OM Medical Inventory Report</h1><div class="date">Generated ${today}</div>`;
    if (activeTab === 'stock') {
      html += `<h2>Stock by Medicine</h2><table><thead><tr><th>Medicine</th><th>Total Qty</th><th>Batches</th></tr></thead><tbody>${stockByMedicine.map(s => `<tr><td><b>${s.name}</b></td><td>${s.totalQty}</td><td>${s.batches.length}</td></tr>`).join('')}</tbody></table>`;
      html += `<h2>Batch Details</h2><table><thead><tr><th>Medicine</th><th>Batch</th><th>Qty</th><th>Supplier</th><th>Mfg</th><th>Exp</th></tr></thead><tbody>${items.map(i => `<tr><td><b>${i.medicine?.name || '—'}</b></td><td>${i.batch || '—'}</td><td>${i.available_qty}</td><td>${i.supplier || '—'}</td><td>${i.manufacturing_date || '—'}</td><td>${i.expiration_date || '—'}</td></tr>`).join('')}</tbody></table>`;
    } else {
      html += `<table><thead><tr><th>Date</th><th>Type</th><th>Medicine</th><th>Batch</th><th>Qty</th><th>Amount</th><th>Supplier</th></tr></thead><tbody>${movements.map(m => `<tr><td>${m.date || '—'}</td><td><span class="badge ${m.type === 'PURCHASE' ? 'in' : 'out'}">${m.type}</span></td><td><b>${m.medicine?.name || '—'}</b></td><td>${m.batch || '—'}</td><td>${m.quantity}</td><td>$${m.amount?.toFixed(2)}</td><td>${m.supplier?.name || '—'}</td></tr>`).join('')}</tbody></table>`;
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
        <button onClick={handlePrint} className="self-start sm:self-auto rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white px-4 py-2.5 text-sm font-bold flex items-center gap-2 shadow-sm transition">
          🖨️ Print Report
        </button>
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
                <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500 font-medium">Total Medicines</p><p className="text-2xl font-black text-slate-900 mt-1">{stockByMedicine.length}</p></div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500 font-medium">Total Units</p><p className="text-2xl font-black text-slate-900 mt-1">{totalStock}</p></div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500 font-medium">Total Batches</p><p className="text-2xl font-black text-slate-900 mt-1">{items.length}</p></div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500 font-medium">Low Stock Items</p><p className="text-2xl font-black text-amber-600 mt-1">{items.filter(i => i.available_qty < 15).length}</p></div>
              </div>

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
                        <Tooltip />
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
                        <Tooltip />
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
                    <div key={s.name} className="rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-md transition">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-bold text-slate-900 text-lg">{s.name}</h4>
                        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold border ${
                          s.totalQty === 0 ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          s.totalQty < 15 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>{s.totalQty} units</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">{s.batches.length} batch{s.batches.length > 1 ? 'es' : ''}</p>
                      <div className="mt-3 space-y-1.5">
                        {s.batches.map(b => {
                          const exp = b.expiration_date && new Date(b.expiration_date);
                          const expired = exp && exp < new Date();
                          return (
                            <div key={b.id} className="flex items-center justify-between text-xs border-t border-slate-50 pt-1.5">
                              <span className="font-mono text-slate-500">{b.batch}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-700">{b.available_qty}</span>
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
                  <tr><td colSpan="7"><EmptyState icon="📋" title="No transactions yet" subtitle="Register your first purchase or sale above." /></td></tr>
                ) : movements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{m.date || '—'}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <Badge color={m.type === 'PURCHASE' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}>{m.type}</Badge>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-800 whitespace-nowrap">{m.medicine?.name}</td>
                    <td className="px-5 py-3.5 font-mono text-slate-600 whitespace-nowrap">{m.batch || '—'}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-700 whitespace-nowrap">{m.quantity}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">${m.amount?.toFixed(2)}</td>
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{m.supplier?.name || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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

  const loadSuppliers = () => {
    if (!token()) return;
    setLoading(true);
    const ep = role === 'PHARMACIST' ? `${API}/api/pharmacy/suppliers` : `${API}/api/admin/suppliers`;
    fetch(ep, { headers: auth() })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setSuppliers)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(loadSuppliers, [role]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!token()) return;
    const url = editingId ? `${API}/api/admin/suppliers/${editingId}` : `${API}/api/admin/suppliers`;
    const res = await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: jsonHeaders(), body: JSON.stringify({ ...form, contact: Number(form.contact) }) });
    if (res.ok) { setForm({ name: '', address: '', joinedfrom: '', contact: '', email: '' }); setEditingId(null); loadSuppliers(); }
  };

  const handleEdit = (s) => { setEditingId(s.id); setForm({ name: s.name, address: s.address, joinedfrom: s.joinedfrom || '', contact: s.contact || '', email: s.email }); };
  const cancelEdit = () => { setEditingId(null); setForm({ name: '', address: '', joinedfrom: '', contact: '', email: '' }); };
  const handleDelete = async (id) => {
    if (!token() || !window.confirm('Delete this supplier?')) return;
    if ((await fetch(`${API}/api/admin/suppliers/${id}`, { method: 'DELETE', headers: auth() })).ok) loadSuppliers();
  };

  const canManage = role === 'ADMIN' || role === 'PHARMACIST';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Suppliers</h3>
        <p className="text-sm text-slate-500 mt-1">Manage vendor contacts and partnership details.</p>
      </div>

      {canManage && (
        <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput label="Company Name" placeholder="Acme Pharma Ltd." value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <FormInput label="Email" type="email" placeholder="vendor@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <FormInput label="Address" placeholder="123 Medical District" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            <FormInput label="Partner Since" type="date" value={form.joinedfrom} onChange={(e) => setForm({ ...form, joinedfrom: e.target.value })} required />
            <FormInput label="Phone / Contact" type="number" placeholder="+1 555 0123" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} required />
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
        </form>
      )}

      {loading ? <Spinner color="border-violet-300" /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {suppliers.length === 0 ? (
            <div className="md:col-span-2"><EmptyState icon="🏭" title="No suppliers yet" subtitle="Add your first vendor partner above." /></div>
          ) : suppliers.map((s) => (
            <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-md transition group">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 font-bold text-sm">
                  {s.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">{s.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{s.email}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{s.address}</p>
                  <p className="text-xs text-slate-400 mt-1">Contact: {s.contact}</p>
                </div>
              </div>
              {canManage && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition">
                  <ActionBtn onClick={() => handleEdit(s)}>Edit</ActionBtn>
                  <ActionBtn onClick={() => handleDelete(s.id)} color="rose">Delete</ActionBtn>
                </div>
              )}
            </div>
          ))}
        </div>
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
    medicineId: '', quantity: 1, amount: 0, date: new Date().toISOString().split('T')[0],
    type: 'PURCHASE', batch: '', supplierId: '', manufacturing_date: '', expiration_date: '',
    newMedicineName: '', newMedicineDescription: '', newMedicineCategory: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadData = async () => {
    if (!token()) { setLoading(false); return; }
    setLoading(true);
    try {
      const [rSales, rMed, rSup, rInv] = await Promise.all([
        fetch(`${API}/api/admin/sales`, { headers: auth() }),
        fetch(`${API}/api/admin/medicines`, { headers: auth() }),
        fetch(`${API}/api/admin/suppliers`, { headers: auth() }),
        fetch(`${API}/api/admin/inventory`, { headers: auth() }),
      ]);
      if (rSales.ok) setRecords(await rSales.json());
      if (rMed.ok) setMedicines(await rMed.json());
      if (rSup.ok) setSuppliers(await rSup.json());
      if (rInv.ok) setInventoryItems(await rInv.json());
    } catch { setErrorMessage('Failed to load data. Is the backend running?'); }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const resetForm = () => {
    setForm({
      medicineId: '', quantity: 1, amount: 0, date: new Date().toISOString().split('T')[0],
      type: 'PURCHASE', batch: '', supplierId: '', manufacturing_date: '', expiration_date: '',
      newMedicineName: '', newMedicineDescription: '', newMedicineCategory: '',
    });
    setEditingId(null); setErrorMessage(''); setSuccessMessage('');
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
        resetForm(); loadData();
      } else {
        let err = await res.text();
        try { const j = JSON.parse(err); err = j.message || j.error || err; } catch {}
        setErrorMessage(err || 'Operation failed. Check form inputs.');
      }
    } catch { setErrorMessage('Network error. Is the backend running?'); }
    setSaving(false);
  };

  const handleEdit = (r) => {
    setEditingId(r.id); setErrorMessage(''); setSuccessMessage('');
    setForm({
      medicineId: r.medicine?.id || '', quantity: r.quantity, amount: r.amount,
      date: r.date || '', type: r.type, batch: r.batch || '',
      supplierId: r.supplier?.id || '', manufacturing_date: r.manufacturing_date || '',
      expiration_date: r.expiration_date || '',
      newMedicineName: '', newMedicineDescription: '', newMedicineCategory: '',
    });
  };

  const handleDelete = async (id) => {
    if (!token() || !window.confirm('Delete this transaction? Stock will be reverted.')) return;
    if ((await fetch(`${API}/api/admin/sales/${id}`, { method: 'DELETE', headers: auth() })).ok) {
      setSuccessMessage('Transaction deleted. Inventory reverted.'); loadData();
    }
  };

  const canManage = role === 'ADMIN' || role === 'PHARMACIST';
  const purchaseCount = records.filter(r => r.type === 'PURCHASE').length;
  const saleCount = records.filter(r => r.type === 'SALE').length;

  const availableBatches = form.medicineId && form.medicineId !== 'new'
    ? inventoryItems.filter(i => i.medicine?.id === Number(form.medicineId) && i.available_qty > 0)
    : [];
  const medicinesWithStock = medicines.filter(m => inventoryItems.some(i => i.medicine?.id === m.id && i.available_qty > 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Sales & Purchase</h3>
          <p className="text-sm text-slate-500 mt-1">Register transactions. Inventory adjusts automatically on save.</p>
        </div>
        <div className="flex gap-2">
          <Badge color="bg-emerald-50 text-emerald-700 border-emerald-200">{saleCount} Sales</Badge>
          <Badge color="bg-blue-50 text-blue-700 border-blue-200">{purchaseCount} Purchases</Badge>
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
        <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Form header strip */}
          <div className={`px-5 py-3 border-b flex items-center justify-between ${form.type === 'PURCHASE' ? 'bg-blue-50/80 border-blue-100' : 'bg-emerald-50/80 border-emerald-100'}`}>
            <h4 className={`text-sm font-bold ${form.type === 'PURCHASE' ? 'text-blue-800' : 'text-emerald-800'}`}>
              {editingId ? 'Edit Transaction' : form.type === 'PURCHASE' ? 'New Purchase Entry' : 'New Sale Entry'}
            </h4>
            {editingId && <button type="button" onClick={resetForm} className="text-xs font-medium text-slate-500 hover:text-slate-800 transition">Cancel Edit</button>}
          </div>

          <div className="p-5 grid gap-4 md:grid-cols-2">
            {/* Type */}
            <FormSelect label="Transaction Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, medicineId: '', batch: '', supplierId: '', newMedicineName: '', newMedicineDescription: '', newMedicineCategory: '' })}>
              <option value="PURCHASE">PURCHASE (Receive Stock)</option>
              <option value="SALE">SALE (Dispense Stock)</option>
            </FormSelect>

            {/* Medicine */}
              <FormSelect label="Medicine" value={form.medicineId} onChange={(e) => setForm({ ...form, medicineId: e.target.value, batch: '' })} required>
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
                <FormInput label="Medicine Name" placeholder="e.g. Ibuprofen 400mg" value={form.newMedicineName} onChange={(e) => setForm({ ...form, newMedicineName: e.target.value })} required />
                <FormSelect label="Category" value={form.newMedicineCategory} onChange={(e) => setForm({ ...form, newMedicineCategory: e.target.value })} required>
                  <option value="">Select Category</option>
                  {Object.entries(CAT_LABELS).map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
                </FormSelect>
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Description / Usage</label>
                  <textarea className="rounded-xl border border-blue-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 h-16 resize-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition" placeholder="Clinical details, dosage, warnings..." value={form.newMedicineDescription} onChange={(e) => setForm({ ...form, newMedicineDescription: e.target.value })} />
                </div>
              </div>
            )}

            {/* Batch */}
            {form.type === 'SALE' ? (
              <FormSelect label="Select Batch (In Stock)" value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} required>
                <option value="">-- Select Batch --</option>
                {availableBatches.length > 0
                  ? availableBatches.map(b => <option key={b.id} value={b.batch}>{b.batch} — Qty: {b.available_qty}</option>)
                  : <option value="" disabled>No batches in stock</option>
                }
              </FormSelect>
            ) : (
              <FormInput label="Batch Code" placeholder="e.g. BATCH-2026A" value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} required />
            )}

            {/* Quantity */}
            <FormInput label="Quantity (Units)" type="number" placeholder="Number of units" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} min="1" required />

            {/* Amount */}
            <FormInput label="Total Amount ($)" type="number" step="0.01" placeholder="Total cost" value={form.amount} onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} min="0" required />

            {/* Date */}
            <FormInput label="Transaction Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />

            {/* Purchase-only */}
            {form.type === 'PURCHASE' && (
              <>
                <FormSelect label="Supplier (Vendor)" value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })}>
                  <option value="">-- Select Supplier --</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </FormSelect>
                <FormInput label="Manufacturing Date" type="date" value={form.manufacturing_date} onChange={(e) => setForm({ ...form, manufacturing_date: e.target.value })} />
                <FormInput label="Expiration Date" type="date" value={form.expiration_date} onChange={(e) => setForm({ ...form, expiration_date: e.target.value })} />
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
        </form>
      )}

      {/* Records */}
      {loading ? <Spinner color="border-violet-300" /> : (
        <div>
          <h4 className="text-sm font-bold text-slate-700 mb-3">Transaction History ({records.length})</h4>
          {records.length === 0 ? (
            <EmptyState icon="🧾" title="No transactions yet" subtitle="Register your first purchase or sale above." />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {records.map((r) => (
                <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-md transition group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{r.medicine?.name || 'Unknown'}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Batch: {r.batch || '—'}</p>
                    </div>
                    <Badge color={r.type === 'SALE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}>{r.type}</Badge>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-50 space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-slate-400">Quantity</span><span className="font-bold text-slate-700">{r.quantity} units</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Amount</span><span className="font-black text-slate-900">${r.amount?.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Date</span><span className="font-semibold text-slate-600">{r.date || '—'}</span></div>
                    {r.supplier && <div className="flex justify-between border-t border-dashed border-slate-100 pt-1.5"><span className="text-slate-400">Vendor</span><span className="font-semibold text-slate-600">{r.supplier.name}</span></div>}
                  </div>
                  {canManage && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition">
                      <ActionBtn onClick={() => handleEdit(r)}>Edit</ActionBtn>
                      <ActionBtn onClick={() => handleDelete(r.id)} color="rose">Delete</ActionBtn>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
