import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [roleName, setRoleName] = useState('ROLE_STAFF');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !firstName || !lastName) {
      setError('Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await register({
        email,
        password,
        firstName,
        lastName,
        phone,
        roleName
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
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

      <div className="w-full max-w-lg space-y-8 bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl relative z-10">
        <div>
          <div className="mx-auto h-12 w-12 rounded-2xl bg-teal-500 flex items-center justify-center shadow-xl shadow-teal-500/20">
            <span className="text-white font-extrabold text-2xl">M</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="mt-2 text-center text-xs text-slate-400">
            Register a new team member to MediStock system
          </p>
        </div>

        {success && (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs text-emerald-400 leading-relaxed text-center font-semibold">
            Registration successful! Redirecting to login...
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-400 leading-relaxed">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-4 text-xs" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-400 mb-1.5">First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 text-xs rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
                placeholder="Rahul"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-400 mb-1.5">Last Name *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 text-xs rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
                placeholder="Sharma"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-400 mb-1.5">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 text-xs rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
                placeholder="rahul@medistock.com"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-400 mb-1.5">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 text-xs rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
                placeholder="9876543210"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-400 mb-1.5">Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 text-xs rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-400 mb-1.5">Confirm Password *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 text-xs rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-400 mb-1.5">System Role *</label>
            <select
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 text-xs rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none transition-all"
            >
              <option value="ROLE_PHARMACIST">Pharmacist (Billing & Medicines)</option>
              <option value="ROLE_STAFF">Staff (Stock adjustments only)</option>
              <option value="ROLE_ADMIN">Administrator (Full Access)</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-3 text-sm font-bold text-white hover:from-teal-500 hover:to-teal-400 transition-all duration-300 shadow-lg shadow-teal-600/15 focus:outline-none disabled:bg-slate-800 disabled:text-slate-500 disabled:from-slate-800 disabled:to-slate-800"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                'Register Team Member'
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-400 hover:text-teal-350 font-bold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
