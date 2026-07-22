import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import {
  UserPlus,
  User as UserIcon,
  Mail,
  LockKeyhole,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Crown,
  Pill,
  Users as UsersIcon,
  CheckCircle2,
} from 'lucide-react';

/* ── Role config ─────────────────────────────────────────────── */
const ROLES = [
  {
    value: 'ADMIN',
    label: 'Admin',
    icon: Crown,
    description: 'Full access — manage users, inventory, categories & suppliers',
    accent: { pill: 'text-purple-400 bg-purple-400/10 border-purple-400/25', ring: 'border-purple-500/50 bg-purple-500/10', glow: 'rgba(168,85,247,0.18)' },
  },
  {
    value: 'PHARMACIST',
    label: 'Pharmacist',
    icon: Pill,
    description: 'Manage medicines & suppliers, read-only on categories',
    accent: { pill: 'text-sky-400 bg-sky-400/10 border-sky-400/25', ring: 'border-sky-500/50 bg-sky-500/10', glow: 'rgba(56,189,248,0.18)' },
  },
  {
    value: 'STAFF',
    label: 'Staff',
    icon: UsersIcon,
    description: 'View dashboard & inventory only — read-only access',
    accent: { pill: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25', ring: 'border-emerald-500/50 bg-emerald-500/10', glow: 'rgba(52,211,153,0.18)' },
  },
];

/* ── Input field component ───────────────────────────────────── */
const Field = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold tracking-widest uppercase"
      style={{ color: 'var(--text-muted)' }}>
      {label}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
        style={{ color: 'var(--text-disabled)' }}>
        <Icon className="w-4 h-4" />
      </span>
      <input
        {...props}
        className="glass-input w-full pl-10 pr-4 py-3 rounded-xl text-sm"
      />
    </div>
  </div>
);

/* ── Main page ───────────────────────────────────────────────── */
const Users = () => {
  const { register, user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  // PHARMACIST can only create STAFF; ADMIN can create any role
  const availableRoles = isAdmin ? ROLES : ROLES.filter(r => r.value === 'STAFF');

  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState(isAdmin ? 'PHARMACIST' : 'STAFF');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);

    const res = await register(username, email, password, role);
    if (res.success) {
      setSuccess(`Account created for "${username}" as ${role}.`);
      setUsername(''); setEmail(''); setPassword('');
      setRole(isAdmin ? 'PHARMACIST' : 'STAFF');
    } else {
      setError(res.message || 'Failed to create user.');
    }
    setLoading(false);
  };

  const selectedRole = ROLES.find(r => r.value === role);

  return (
    <div className="flex h-screen overflow-hidden bg-grid">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 lg:p-8">

        {/* ── Header ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{ background: 'rgba(168,85,247,0.1)', borderColor: 'rgba(168,85,247,0.25)' }}>
              <UserPlus className="w-4 h-4" style={{ color: '#c084fc' }} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                User Management
              </h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {isAdmin
                  ? 'Admin · Create Admin, Pharmacist or Staff accounts'
                  : 'Pharmacist · Create Staff accounts'}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="max-w-2xl">

          {/* ── Alert messages ──────────────────────── */}
          <AnimatePresence mode="wait">
            {(error || success) && (
              <motion.div
                key={error ? 'err' : 'ok'}
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4 rounded-xl text-sm border"
                  style={
                    error
                      ? { background: 'rgba(239,68,68,0.07)', borderColor: 'rgba(239,68,68,0.22)', color: '#f87171' }
                      : { background: 'rgba(52,211,153,0.07)', borderColor: 'rgba(52,211,153,0.25)', color: '#34d399' }
                  }
                >
                  {error
                    ? <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    : <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  }
                  <span>{error || success}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Card ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="glass-card rounded-2xl p-6 lg:p-8"
          >
            <h2 className="text-base font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Create New User
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Username & Email side-by-side on wider screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Username" icon={UserIcon}
                  type="text" required value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="john_doe"
                  autoComplete="off"
                />
                <Field
                  label="Email Address" icon={Mail}
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="john@hospital.org"
                  autoComplete="off"
                />
              </div>

              <Field
                label="Temporary Password" icon={LockKeyhole}
                type="password" required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />

              {/* ── Role Selector ─────────────────────── */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold tracking-widest uppercase"
                  style={{ color: 'var(--text-muted)' }}>
                  System Role
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {availableRoles.map(({ value, label, icon: Icon, description, accent }) => {
                    const isSelected = role === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRole(value)}
                        className="text-left p-4 rounded-xl border transition-all duration-200 relative overflow-hidden"
                        style={
                          isSelected
                            ? { background: accent.ring.replace('bg-', 'rgba(').replace('/10', ',0.1)'), borderColor: accent.ring.includes('purple') ? 'rgba(168,85,247,0.4)' : accent.ring.includes('sky') ? 'rgba(56,189,248,0.4)' : 'rgba(52,211,153,0.4)', boxShadow: `0 0 0 1px ${accent.glow}` }
                            : { background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }
                        }
                      >
                        {isSelected && (
                          <span className="absolute top-2 right-2">
                            <ShieldCheck className="w-3.5 h-3.5" style={{ color: value === 'ADMIN' ? '#c084fc' : value === 'PHARMACIST' ? '#38bdf8' : '#34d399' }} />
                          </span>
                        )}
                        <Icon className="w-4 h-4 mb-2" style={{ color: value === 'ADMIN' ? '#c084fc' : value === 'PHARMACIST' ? '#38bdf8' : '#34d399' }} />
                        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{label}</p>
                        <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Submit ────────────────────────────── */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 gap-2"
                >
                  {loading
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <>
                        <UserPlus className="w-4 h-4" />
                        <span>Create {selectedRole?.label} Account</span>
                      </>
                  }
                </button>
              </div>
            </form>
          </motion.div>

          {/* ── Info banner ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 p-4 rounded-xl text-xs leading-relaxed"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
          >
            {isAdmin ? (
              <><strong style={{ color: 'var(--text-secondary)' }}>🔒 Admin:</strong> You can create accounts with any role.
              New users should sign in with the credentials you set here and change their password after first login.</>
            ) : (
              <><strong style={{ color: 'var(--text-secondary)' }}>💊 Pharmacist:</strong> You can create <strong>Staff</strong> accounts only.
              Contact an Admin if you need to create a Pharmacist or Admin account.</>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Users;
