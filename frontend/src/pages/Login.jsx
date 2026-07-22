import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  PackageOpen,
  User as UserIcon,
  ShieldCheck,
  AlertCircle,
  Loader2,
  LockKeyhole,
  ArrowRight,
} from 'lucide-react';

const InputField = ({ label, icon: Icon, ...props }) => (
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

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    const res = await login(username, password);
    if (res.success) {
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1200);
    } else {
      setError(res.message || 'Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-grid" style={{ color: 'var(--text-primary)' }}>

      {/* ── Left Panel ──────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #020c1c 0%, #060f28 50%, #04091a 100%)' }}>

        {/* Ambient glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />

        {/* Brand */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
              <PackageOpen className="w-5 h-5 text-sky-400" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">MediStock</span>
          </div>
        </motion.div>

        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative z-10"
        >
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Medical Inventory<br />
            <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Made Intelligent
            </span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            A unified platform for tracking medicines, managing stock levels, and staying ahead of expiry dates — all in one secure workspace.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {['Inventory Tracking', 'Role-Based Access', 'Expiry Alerts', 'Supplier Management'].map(f => (
              <span key={f} className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', color: '#7dd3fc' }}>
                {f}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="text-xs text-slate-600 relative z-10"
        >
          © 2026 MediStock Platform · Secure Medical Inventory Management
        </motion.p>
      </div>

      {/* ── Right Panel (form) ──────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16 relative overflow-hidden">

        {/* Mobile ambient glow */}
        <div className="lg:hidden absolute top-0 left-0 w-64 h-64 rounded-full pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle, #0ea5e9, transparent 70%)', transform: 'translate(-40%, -40%)' }} />

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-[420px] relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
              <PackageOpen className="w-5 h-5 text-sky-400" />
            </div>
            <span className="text-lg font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>MediStock</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight mb-1.5" style={{ color: 'var(--text-primary)' }}>
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Sign in to your MediStock workspace
            </p>
          </div>

          {/* Alert messages */}
          <AnimatePresence mode="wait">
            {(error || success) && (
              <motion.div
                key={error ? 'error' : 'success'}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 overflow-hidden"
              >
                <div
                  className="flex items-start gap-3 p-3.5 rounded-xl text-xs border"
                  style={
                    error
                      ? { background: 'rgba(239,68,68,0.07)', borderColor: 'rgba(239,68,68,0.22)', color: '#f87171' }
                      : { background: 'rgba(52,211,153,0.07)', borderColor: 'rgba(52,211,153,0.22)', color: '#34d399' }
                  }
                >
                  {error
                    ? <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    : <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  }
                  <span className="leading-relaxed">{error || success}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Username" icon={UserIcon}
              type="text" required value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_username" autoComplete="username"
            />

            <InputField
              label="Password" icon={LockKeyhole}
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />

            <div className="pt-2">
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <><span>Sign into MediStock</span><ArrowRight className="w-4 h-4" /></>
                }
              </button>
            </div>
          </form>

          {/* Info note */}
          <p className="mt-6 text-center text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Access is managed by your system administrator.<br />
            Contact your admin if you need an account.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
