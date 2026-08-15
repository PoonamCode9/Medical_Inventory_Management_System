import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import Swal from 'sweetalert2'
import { Tooltip } from 'react-tooltip'
import './App.css'
import LoginHelp from './components/LoginHelp'
import Dashboard from './components/Dashboard'

const API_BASE = 'http://localhost:8080/api/auth';

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    return {
      ...decoded,
      sub: decoded.sub || decoded.username || decoded.name || '',
      role: decoded.role || decoded.roles || decoded.authority || '',
    };
  } catch (e) {
    return null;
  }
};

const pageVariants = {
  initial: { opacity: 0, y: 30, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -30, scale: 0.96, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 14 } },
};

function App() {
  const getInitialAuthState = () => {
    if (typeof window === 'undefined') {
      return { token: '', user: null, view: 'login' };
    }
    const savedToken = localStorage.getItem('om_token');
    if (!savedToken) {
      return { token: '', user: null, view: 'login' };
    }
    const decoded = parseJwt(savedToken);
    if (decoded && decoded.exp * 1000 > Date.now()) {
      return { token: savedToken, user: decoded, view: 'dashboard' };
    }
    localStorage.removeItem('om_token');
    return { token: '', user: null, view: 'login' };
  };

  const initialAuth = getInitialAuthState();
  const [view, setView] = useState(initialAuth.view);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'STAFF',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState(initialAuth.token);
  const [user, setUser] = useState(initialAuth.user);
  const [testResult, setTestResult] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const selectRole = (role) => {
    setFormData({
      ...formData,
      role: role,
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      Swal.fire({ icon: 'success', title: 'Registered!', text: 'You can now log in.', timer: 2000, showConfirmButton: false })
      setView('login');
      setFormData((prev) => ({ ...prev, password: '', name: '' }));
    } catch (err) {
      setError(err.message);
      Swal.fire({ icon: 'error', title: 'Registration Failed', text: err.message })
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }
      const jwtToken = data.token;
      localStorage.setItem('om_token', jwtToken);
      setToken(jwtToken);
      const decoded = parseJwt(jwtToken);
      setUser(decoded);
      setView('dashboard');
      setError('');
      Swal.fire({ icon: 'success', title: 'Welcome back!', timer: 1500, showConfirmButton: false })
    } catch (err) {
      setError(err.message);
      Swal.fire({ icon: 'error', title: 'Login Failed', text: err.message })
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('om_token');
    setToken('');
    setUser(null);
    setTestResult(null);
    setView('login');
    setFormData({
      name: '',
      username: '',
      password: '',
      role: 'STAFF',
    });
  };

  const testSecureApi = async () => {
    setTestResult('Testing...');
    try {
      const response = await fetch('http://localhost:8080/api/test/secured', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.status === 403) {
        setTestResult({
          status: 403,
          message: 'Access Denied: The test endpoint is secured but not mapped in backend yet, or role lacks permissions.',
        });
        return;
      }
      const data = await response.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({
        error: err.message,
        tip: 'If you get a connection error, verify that the backend is running on port 8080.'
      });
    }
  };

  const renderDashboard = () => {
    if (!user) return null;
    return <Dashboard user={user} onLogout={handleLogout} />;
  };

  return (
    <>
      <Tooltip id="form-tooltip" place="top" className="!text-xs !font-medium !rounded-lg !px-3 !py-1.5" />
      <AnimatePresence mode="wait">
      {view === 'dashboard' && user ? (
        <motion.div key="dashboard" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          {renderDashboard()}
        </motion.div>
      ) : (
        <motion.div
          key="auth"
          className="auth-card"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          layout
        >
          <div className="portal-header">
            <div className="portal-title-row">
              <div className="flex items-center gap-3">
                <motion.img
                  src="/icon.png"
                  alt="OM Medical"
                  className="h-10 w-10 rounded-lg"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                />
                <div>
                  <motion.h1
                    className="portal-logo"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 100 }}
                  >
                    OM Medical
                  </motion.h1>
                  <motion.p
                    className="portal-subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    Advanced Clinical Portal & Management System
                  </motion.p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            className="auth-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="auth-form-panel" variants={itemVariants}>
              {error && (
                <motion.div
                  className="alert alert-error"
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  layout
                >
                  ⚠️ {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  className="alert alert-success"
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  layout
                >
                  ✅ {success}
                </motion.div>
              )}

              <motion.div
                className="auth-tabs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                layout
              >
                <motion.button
                  type="button"
                  className={`tab-btn ${view === 'login' ? 'active' : ''}`}
                  onClick={() => { setView('login'); setError(''); setSuccess(''); }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  layout
                >
                  Sign In
                </motion.button>
                <motion.button
                  type="button"
                  className={`tab-btn ${view === 'register' ? 'active' : ''}`}
                  onClick={() => { setView('register'); setError(''); setSuccess(''); }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  layout
                >
                  Register
                </motion.button>
              </motion.div>

          {view === 'login' && (
            <motion.form
              key="login-form"
              onSubmit={handleLoginSubmit}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ type: 'spring', stiffness: 120, damping: 15 }}
            >
              <div className="form-group">
                <label className="form-label" htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-input"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. drsmith"
                  required
                  data-tooltip-id="form-tooltip"
                  data-tooltip-content="Enter your username to sign in"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  data-tooltip-id="form-tooltip"
                  data-tooltip-content="Enter your account password"
                />
              </div>

              <motion.button
                type="submit"
                className="submit-btn"
                disabled={loading}
                whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,86,179,0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                    <span className="flex items-center gap-2">
                    <span className="spinner" />
                    Signing In...
                  </span>
                ) : 'Sign In to Portal'}
              </motion.button>
              <LoginHelp/>
            </motion.form>
          )}

          {view === 'register' && (
            <motion.form
              key="register-form"
              onSubmit={handleRegisterSubmit}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ type: 'spring', stiffness: 120, damping: 15 }}
            >
              <div className="form-group">
                <label className="form-label" htmlFor="name">Display Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Dr. John Smith"
                  required
                  data-tooltip-id="form-tooltip"
                  data-tooltip-content="Your full display name shown in the system"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-username">Username</label>
                <input
                  type="text"
                  id="reg-username"
                  name="username"
                  className="form-input"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. drsmith"
                  required
                  data-tooltip-id="form-tooltip"
                  data-tooltip-content="Choose a unique username for login"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">Password</label>
                <input
                  type="password"
                  id="reg-password"
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  data-tooltip-id="form-tooltip"
                  data-tooltip-content="Create a strong password for your account"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">Email</label>
                <input
                  type="email"
                  id="reg-email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. drsmith@hospital.com"
                  data-tooltip-id="form-tooltip"
                  data-tooltip-content="You'll receive medicine expiry reports here (required for ADMIN & STAFF)"
                />
              </div>

              <div className="form-group">
                <label className="form-label">System Role</label>
                <div className="roles-grid">
                  {['STAFF', 'PHARMACIST', 'ADMIN'].map((role) => (
                    <motion.div
                      key={role}
                      className={`role-select-card ${formData.role === role ? 'selected' : ''}`}
                      onClick={() => selectRole(role)}
                      whileHover={{ scale: 1.04, borderColor: '#0056b3' }}
                      whileTap={{ scale: 0.96 }}
                      layout
                      data-tooltip-id="form-tooltip"
                      data-tooltip-content={
                        role === 'STAFF' ? 'Staff members can view inventory and medicines' :
                        role === 'PHARMACIST' ? 'Pharmacists can manage medicines and transactions' :
                        'Admins have full system access and user management'
                      }
                    >
                      <span className="role-icon">
                        {role === 'STAFF' ? '📋' : role === 'PHARMACIST' ? '💊' : '🩺'}
                      </span>
                      <span className="role-name">{role.charAt(0) + role.slice(1).toLowerCase()}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.button
                type="submit"
                className="submit-btn"
                disabled={loading}
                whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,86,179,0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                    <span className="flex items-center gap-2">
                    <span className="spinner" />
                    Creating Account...
                  </span>
                ) : 'Create Account'}
              </motion.button>
            </motion.form>
          )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}

export default App;
