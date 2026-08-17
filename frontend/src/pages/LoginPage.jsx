import { useState } from 'react';
import {
    Plus, Mail, Lock, Eye, EyeOff, ArrowRight,
    ShieldCheck, Boxes, BarChart3, Clock, User, AlertCircle
} from 'lucide-react';

// Standard password regex: min 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{}|;:,.<>])[A-Za-z\d@$!%*?&#^()_+\-=[\]{}|;:,.<>]{8,}$/;

export function LoginPage({ onLoginSuccess }) {
    const [mode, setMode] = useState('login');
    const [selectedRole, setSelectedRole] = useState('pharmacist');

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const registerRoles = [
        { id: 'pharmacist', label: 'Pharmacist', desc: 'Inventory & orders' },
        { id: 'staff', label: 'Staff', desc: 'Stock updates' },
    ];

    async function handleSubmit(e) {
        if (e) e.preventDefault();
        setError('');

        // --- 1. REGISTRATION VALIDATION ---
        if (mode === 'register') {
            if (!PASSWORD_REGEX.test(password)) {
                setError(
                    'Password must be at least 8 characters long and contain a combination of uppercase letters, lowercase letters, numbers, and special characters.'
                );
                return;
            }
        }

        setLoading(true);

        try {
            if (mode === 'login') {
                // --- 2. LOGIN REQUEST ---
                const response = await fetch('http://localhost:8080/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: username || email, password }),
                });

                if (!response.ok) {
                    // Specific warning for wrong credentials
                    throw new Error('Please enter right credentials. Invalid username or password.');
                }

                const data = await response.json();

                // Save session info to localStorage
                const resolvedRole = data.role || data.authority || 'ROLE_STAFF';
                let cleanRole = resolvedRole.replace('ROLE_', '').toLowerCase();

                const loggedInName = data.username || data.name || (username && !username.includes('@') ? username : cleanRole);
                const loggedInEmail = data.email || (data.user && data.user.email) || (username && username.includes('@') ? username : (email || `${cleanRole}@medistock.com`));
                const userId = data.id || (data.user && data.user.id) || '';

                localStorage.setItem('token', data.token);
                localStorage.setItem('role', cleanRole);
                localStorage.setItem('username', loggedInName);
                localStorage.setItem('email', loggedInEmail);
                if (userId) localStorage.setItem('userId', String(userId));

                if (onLoginSuccess) onLoginSuccess(data);
                else window.location.href = '/dashboard';

            } else {
                // --- 3. REGISTRATION REQUEST ---
                const response = await fetch('http://localhost:8080/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: username || email.split('@')[0],
                        email,
                        password,
                        role: `ROLE_${selectedRole.toUpperCase()}`
                    }),
                });

                const responseText = await response.text();

                if (!response.ok) {
                    throw new Error(responseText || 'Registration failed. Please verify your details.');
                }

                alert('Account registered successfully! Please sign in with your credentials.');
                setMode('login');
                setPassword('');
            }
        } catch (err) {
            setError(err.message || 'Network error: Is Spring Boot running?');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans">
            {/* Left Branding Panel */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-900 relative overflow-hidden flex-col justify-between p-12 text-white">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />

                <div className="relative flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                        <Plus className="h-6 w-6 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">MediStock</span>
                </div>

                <div className="relative space-y-8">
                    <div>
                        <h1 className="text-4xl font-bold leading-tight tracking-tight">
                            Medical Inventory,
                            <br />
                            Perfectly Managed.
                        </h1>
                        <p className="text-blue-100 mt-4 text-lg max-w-md">
                            Track medicines, monitor expiry, manage suppliers, and generate reports — all synced with your secure database.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 max-w-md">
                        {[
                            { icon: Boxes, label: 'Inventory Tracking' },
                            { icon: Clock, label: 'Expiry Alerts' },
                            { icon: BarChart3, label: 'Analytics' },
                        ].map((f, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/10 backdrop-blur">
                                <f.icon className="h-5 w-5" />
                                <span className="text-xs text-blue-100 text-center">{f.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative flex items-center gap-2 text-sm text-blue-100">
                    <ShieldCheck className="h-4 w-4" />
                    PostgreSQL Database Connected · Secure JWT Auth
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-sm">
                    <div className="flex lg:hidden items-center gap-2.5 mb-8 justify-center">
                        <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center">
                            <Plus className="h-5 w-5 text-white" strokeWidth={3} />
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">MediStock</span>
                    </div>

                    <div className="flex gap-1 p-1 bg-slate-200 dark:bg-slate-800 rounded-lg mb-6">
                        <button
                            type="button"
                            onClick={() => { setMode('login'); setError(''); }}
                            className={`flex-1 h-9 rounded-md text-sm font-medium transition-colors ${
                                mode === 'login'
                                    ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400'
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMode('register'); setSelectedRole('pharmacist'); setError(''); }}
                            className={`flex-1 h-9 rounded-md text-sm font-medium transition-colors ${
                                mode === 'register'
                                    ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400'
                            }`}
                        >
                            Register
                        </button>
                    </div>

                    {mode === 'register' && (
                        <div className="mb-4">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                                Register role:
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {registerRoles.map((r) => (
                                    <button
                                        key={r.id}
                                        type="button"
                                        onClick={() => { setSelectedRole(r.id); setError(''); }}
                                        className={`flex flex-col items-center gap-1 p-3 rounded-lg border text-center transition-all ${
                                            selectedRole === r.id
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <span className="text-sm font-semibold">{r.label}</span>
                                        <span className="text-[10px] text-slate-400">{r.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Username {mode === 'register' ? 'or Email' : ''}
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
                                    className="w-full pl-9 pr-3 py-2 border rounded-lg bg-transparent text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                            </div>
                        </div>

                        {mode === 'register' && (
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Email address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@medistock.io"
                                        className="w-full pl-9 pr-3 py-2 border rounded-lg bg-transparent text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-9 py-2 border rounded-lg bg-transparent text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {mode === 'register' && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Must be at least 8 characters with uppercase, lowercase, number, and special character.
                                </p>
                            )}
                        </div>

                        {error && (
                            <div className="text-xs px-3 py-2.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2 animate-fade-in">
                                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 shadow-sm disabled:opacity-50 transition-all active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {mode === 'login' ? ' Signing in...' : ' Saving to database...'}
                                </>
                            ) : (
                                <>
                                    {mode === 'login' ? 'Sign In' : 'Register & Save User'}
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}