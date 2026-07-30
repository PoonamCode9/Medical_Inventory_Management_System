import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('expired') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-teal-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl relative z-10">
        <div>
          <div className="mx-auto h-12 w-12 rounded-2xl bg-teal-500 flex items-center justify-center shadow-xl shadow-teal-500/20">
            <span className="text-white font-extrabold text-2xl">M</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            MediStock Portal
          </h2>
          <p className="mt-2 text-center text-xs text-slate-400">
            Log in to manage medical inventory, billing and reports
          </p>
        </div>

        {sessionExpired && (
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3.5 text-xs text-amber-400 leading-relaxed">
            Your login session expired. Please log in again to continue.
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-400 leading-relaxed">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-xs font-semibold text-slate-400 mb-1.5">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-teal-500 text-sm rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
                placeholder="admin@medistock.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-400 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-teal-500 text-sm rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-3 text-sm font-bold text-white hover:from-teal-500 hover:to-teal-400 transition-all duration-300 shadow-lg shadow-teal-600/15 focus:outline-none disabled:bg-slate-800 disabled:text-slate-500 disabled:from-slate-800 disabled:to-slate-800 disabled:shadow-none"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-teal-400 hover:text-teal-350 font-bold transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
