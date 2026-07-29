import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', { email, password });
      
      if (response.data && response.data.success) {
        const token = response.data.data.token;
        login(token);
        navigate('/');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError('Failed to connect to the server. Please check if the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left side: Professional Healthcare Inventory Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-slate-100 flex-col justify-between p-12 relative overflow-hidden border-r border-slate-800">
        {/* Subtle background nodes */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-900/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-900/10 blur-3xl pointer-events-none"></div>

        {/* Top Text / Logo Area */}
        <div className="z-10 flex items-center space-x-3">
          <svg className="w-8 h-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <span className="font-bold text-xl tracking-tight text-white">MediStock Enterprise</span>
        </div>

        {/* Main SVG Illustration: Detailed Pharmacy Inventory Shelf & Healthcare Items */}
        <div className="z-10 my-auto flex justify-center">
          <svg className="w-full max-w-md h-auto" viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Shelf Cabinet Frame */}
            <rect x="20" y="20" width="360" height="280" rx="6" fill="#1E293B" stroke="#334155" strokeWidth="6" />
            
            {/* Shelves Dividers */}
            <line x1="20" y1="110" x2="380" y2="110" stroke="#334155" strokeWidth="6" />
            <line x1="20" y1="200" x2="380" y2="200" stroke="#334155" strokeWidth="6" />
            <line x1="200" y1="20" x2="200" y2="290" stroke="#334155" strokeWidth="4" />

            {/* SHELF 1 - LEFT: Medicine Bottles (Syrup, Pills) */}
            <rect x="40" y="50" width="22" height="45" rx="3" fill="#0F766E" />
            <rect x="46" y="42" width="10" height="8" rx="1" fill="#D1D5DB" />
            <rect x="42" y="60" width="18" height="15" fill="#FFFFFF" />
            <line x1="45" y1="65" x2="57" y2="65" stroke="#9CA3AF" strokeWidth="2" />
            
            <rect x="70" y="45" width="26" height="50" rx="3" fill="#F59E0B" />
            <rect x="78" y="37" width="10" height="8" rx="1" fill="#374151" />
            <rect x="72" y="58" width="22" height="18" fill="#FFFFFF" />
            <rect x="76" y="62" width="14" height="10" fill="#DC2626" opacity="0.8" />
            
            <rect x="105" y="60" width="18" height="35" rx="2" fill="#E2E8F0" />
            <rect x="109" y="54" width="10" height="6" rx="1" fill="#4B5563" />
            <rect x="107" y="68" width="14" height="12" fill="#16A34A" />

            {/* SHELF 1 - RIGHT: Boxed stock and barcodes */}
            <rect x="220" y="40" width="65" height="55" rx="4" fill="#334155" stroke="#475569" strokeWidth="2" />
            <rect x="226" y="48" width="30" height="8" fill="#0F766E" />
            
            <rect x="226" y="75" width="2" height="12" fill="#9CA3AF" />
            <rect x="230" y="75" width="4" height="12" fill="#9CA3AF" />
            <rect x="236" y="75" width="1" height="12" fill="#9CA3AF" />
            <rect x="239" y="75" width="3" height="12" fill="#9CA3AF" />
            <text x="226" y="93" fill="#9CA3AF" fontSize="6" fontFamily="monospace">BATCH-8821</text>
            
            <rect x="300" y="55" width="55" height="40" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            <rect x="306" y="63" width="20" height="6" fill="#DC2626" />
            <rect x="306" y="80" width="3" height="8" fill="#6B7280" />
            <rect x="311" y="80" width="1" height="8" fill="#6B7280" />
            <rect x="314" y="80" width="4" height="8" fill="#6B7280" />

            {/* SHELF 2 - LEFT: Stacked containers with Expiry Trackers */}
            <rect x="35" y="140" width="45" height="45" rx="3" fill="#0F766E" opacity="0.9" />
            <rect x="42" y="148" width="31" height="8" fill="#FFFFFF" />
            <text x="44" y="154" fill="#0F766E" fontSize="6" fontWeight="bold">TEMP OK</text>
            <circle cx="70" cy="172" r="5" fill="#16A34A" />
            
            <rect x="90" y="130" width="45" height="55" rx="3" fill="#334155" stroke="#475569" strokeWidth="2" />
            <rect x="97" y="138" width="31" height="8" fill="#FFFFFF" />
            <text x="99" y="144" fill="#DC2626" fontSize="6" fontWeight="bold">EXPIRING</text>
            <circle cx="125" cy="172" r="5" fill="#F59E0B" />

            {/* SHELF 2 - RIGHT: Heavy Ampoules & Tubes */}
            <rect x="220" y="130" width="12" height="55" rx="2" fill="#E2E8F0" />
            <rect x="223" y="122" width="6" height="8" rx="1" fill="#9CA3AF" />
            <rect x="220" y="145" width="12" height="10" fill="#2563EB" />
            
            <rect x="238" y="130" width="12" height="55" rx="2" fill="#E2E8F0" />
            <rect x="241" y="122" width="6" height="8" rx="1" fill="#9CA3AF" />
            <rect x="238" y="145" width="12" height="10" fill="#2563EB" />

            <rect x="285" y="135" width="75" height="50" rx="4" fill="#1E293B" stroke="#0F766E" strokeWidth="2" />
            <line x1="285" y1="150" x2="360" y2="150" stroke="#0F766E" strokeWidth="1.5" />
            <text x="292" y="146" fill="#0F766E" fontSize="8" fontWeight="bold">SECURE LOGS</text>

            {/* SHELF 3 - LEFT & RIGHT: Grid Scan, Inventory Labels */}
            <rect x="35" y="220" width="145" height="55" rx="4" fill="#020617" stroke="#1E293B" strokeWidth="2" />
            <path d="M 45 250 L 80 235 L 120 255 L 160 230" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" />
            <circle cx="80" cy="235" r="3" fill="#0F766E" />
            <text x="45" y="270" fill="#0F766E" fontSize="7" fontFamily="monospace">MONITORING: STABLE</text>

            <rect x="220" y="215" width="65" height="65" rx="3" fill="#334155" />
            <circle cx="252" cy="247" r="16" stroke="#475569" strokeWidth="3" />
            <line x1="252" y1="231" x2="252" y2="263" stroke="#475569" strokeWidth="2" />

            <rect x="300" y="215" width="65" height="65" rx="3" fill="#334155" />
            <rect x="308" y="225" width="49" height="10" fill="#1E293B" />
            <rect x="308" y="240" width="49" height="10" fill="#1E293B" />
          </svg>
        </div>

        {/* Footer info inside sidebar */}
        <div className="z-10 text-slate-400 text-xs flex justify-between items-center">
          <span>MediStock v1.5.0</span>
          <span>Enterprise Secure Portal</span>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-card shadow-sm">
          {/* Logo and Brand */}
          <div className="mb-8">
            <div className="flex items-center space-x-2.5 text-teal-700 mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span className="font-extrabold text-2xl tracking-tight">MediStock</span>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
            <p className="text-sm text-gray-500 mt-1">Medical Inventory Management System</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-card text-sm mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 tracking-wider mb-1.5" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-card text-gray-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all text-sm"
                placeholder="Enter your system email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 tracking-wider mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-card text-gray-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all text-sm"
                placeholder="Enter your security password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-teal-700 focus:ring-teal-700/20 h-4 w-4"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember Me</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Please contact the system administrator to reset your password."); }} className="text-sm font-semibold text-teal-700 hover:text-teal-900 transition-colors">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#0F766E] hover:bg-teal-800 text-white font-semibold rounded-card transition-all focus:outline-none focus:ring-2 focus:ring-teal-700/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer text-sm shadow-sm"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400 font-medium">Or Sign In With</span>
            </div>
          </div>

          {/* Google OAuth button (Disabled) */}
          <button
            type="button"
            disabled
            className="w-full py-2.5 px-4 bg-gray-50 border border-gray-200 text-gray-400 font-semibold rounded-card flex flex-col items-center justify-center text-xs cursor-not-allowed opacity-75"
          >
            <div className="flex items-center gap-2 mb-0.5">
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.706 0 3.265.614 4.478 1.628l2.42-2.42C17.433 1.62 14.996 1 12.24 1 6.64 1 2.24 5.4 2.24 11s4.4 10 10 10c5.8 0 9.8-4.08 9.8-9.8 0-.66-.06-1.285-.18-1.916H12.24z" />
              </svg>
              <span>Continue with Google</span>
            </div>
            <span className="text-[9px] text-gray-400 font-normal">OAuth2 Integration Coming Soon</span>
          </button>
        </div>
      </div>
    </div>
  );
}


