import { useState, useEffect } from 'react'
import './App.css'
import LoginHelp from './components/LoginHelp'
import Dashboard from './components/Dashboard'
// Base URL for the backend API
const API_BASE = 'http://localhost:8080/api/auth';

/**
 * Utility function to decode a JWT token and extract the payload.
 */
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
  const [view, setView] = useState(initialAuth.view); // 'login' | 'register' | 'dashboard'
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'STAFF',
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess('Registered successfully! You can now log in.');
      setView('login');
      // Clear password field but keep username for convenience
      setFormData((prev) => ({ ...prev, password: '', name: '' }));
    } catch (err) {
      setError(err.message);
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
        headers: {
          'Content-Type': 'application/json',
        },
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
    } catch (err) {
      setError(err.message);
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
      // Hitting a dummy secured URL to demonstrate passing the JWT bearer token
      const response = await fetch('http://localhost:8080/api/test/secured', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
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

  const getRoleIcon = (role) => {
    switch (role) {
      case 'ADMIN': return '🩺';
      case 'PHARMACIST': return '💊';
      case 'STAFF': return '📋';
      default: return '👤';
    }
  };

  const renderDashboard = () => {
    if (!user) return null;
    return <Dashboard user={user} onLogout={handleLogout} />;
  };

  return (
    <>

      {view === 'dashboard' && user ? (
        renderDashboard()
      ) : (
        <div className="auth-card">
          <div className="portal-header">
            <div className="portal-title-row">
              <div>
                <h1 className="portal-logo">OM Medical</h1>
                <p className="portal-subtitle">Advanced Clinical Portal & Management System</p>
              </div>
            </div>
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}
          {success && <div className="alert alert-success">✅ {success}</div>}

          {view !== 'dashboard' && (
            <div className="auth-tabs">
              <button
                type="button"
                className={`tab-btn ${view === 'login' ? 'active' : ''}`}
                onClick={() => { setView('login'); setError(''); setSuccess(''); }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`tab-btn ${view === 'register' ? 'active' : ''}`}
                onClick={() => { setView('register'); setError(''); setSuccess(''); }}
              >
                Register
              </button>
            </div>
          )}

          {view === 'login' && (
            <form onSubmit={handleLoginSubmit}>
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
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <div className="spinner"></div> : 'Sign In to Portal'}
              </button>
              <LoginHelp/>
            </form>
          )}

          {view === 'register' && (
            <form onSubmit={handleRegisterSubmit}>
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
                />
              </div>

              <div className="form-group">
                <label className="form-label">System Role</label>
                <div className="roles-grid">
                  <div
                    className={`role-select-card ${formData.role === 'STAFF' ? 'selected' : ''}`}
                    onClick={() => selectRole('STAFF')}
                  >
                    <span className="role-icon">📋</span>
                    <span className="role-name">Staff</span>
                  </div>
                  <div
                    className={`role-select-card ${formData.role === 'PHARMACIST' ? 'selected' : ''}`}
                    onClick={() => selectRole('PHARMACIST')}
                  >
                    <span className="role-icon">💊</span>
                    <span className="role-name">Pharmacist</span>
                  </div>
                  <div
                    className={`role-select-card ${formData.role === 'ADMIN' ? 'selected' : ''}`}
                    onClick={() => selectRole('ADMIN')}
                  >
                    <span className="role-icon">🩺</span>
                    <span className="role-name">Admin</span>
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <div className="spinner"></div> : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}

export default App;
