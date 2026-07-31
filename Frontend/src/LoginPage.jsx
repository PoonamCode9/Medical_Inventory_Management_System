import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'
import { loginUser } from './api.js'
import { getDefaultDashboardPath, getUserRoleFromToken } from './auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await loginUser(formData)
      setMessage(response.message)

      if (response?.success) {
        const redirectPath = getDefaultDashboardPath()
        navigate(redirectPath, { replace: true })
      }
    } catch (error) {
      setMessage(error.message || 'Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = () => {
    // Frontend-only button placeholder for future Google auth integration.
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-panel">
          <p className="brand">MediStock</p>
          <h1>Welcome back</h1>
          <p className="subtitle">
            Manage medicine inventory, track stock availability, monitor expiry dates,
            maintain supplier records, and generate inventory analytics from one secure dashboard.
          </p>

          <div className="social-auth">
            <button type="button" className="social-btn google-btn" onClick={handleGoogleLogin}>
              <span className="social-icon">G</span>
              Log in with Google
            </button>
          </div>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              <span>Email address</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </label>

            <button type="submit" className="primary-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Log in'}
            </button>
          </form>

          {message && <p className={`status-message ${message.includes('success') ? 'success' : 'error'}`}>{message}</p>}

          <p className="toggle-text">
            Don&apos;t have an account?
            <button type="button" onClick={() => navigate('/register')}>
              Register
            </button>
          </p>
        </div>

        <div className="auth-visual">
          <div className="visual-badge">Secure • Fast • Reliable</div>
          <h2>Inventory access made simple & efficient</h2>
          <ul>
            <li>Manage medicine inventory</li>
            <li>Maintain supplier records</li>
            <li>Generate inventory analytics</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
