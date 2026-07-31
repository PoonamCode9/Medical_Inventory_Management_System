import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'
import { registerUser } from './api.js'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  })
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
      const response = await registerUser(formData)
      setMessage(response.message)
    } catch (error) {
      setMessage(error.message || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignup = () => {
    // Frontend-only button placeholder for future Google auth integration.
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-panel">
          <p className="brand">MediStock</p>
          <h1>Create your account</h1>
          <p className="subtitle">
            Manage medicine inventory, track stock availability, monitor expiry dates,
            maintain supplier records, and generate inventory analytics from one secure dashboard.
          </p>

          <div className="social-auth">
            <button type="button" className="social-btn google-btn" onClick={handleGoogleSignup}>
              <span className="social-icon">G</span>
              Continue with Google
            </button>
          </div>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              <span>Full name</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
            </label>

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

            <label>
              <span>Role</span>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select a role</option>
                <option value="Admin">Admin</option>
                <option value="Pharmacist">Pharmacist</option>
                <option value="Staff">Staff</option>
                <option value="Supplier">Supplier</option>
              </select>
            </label>


            <button type="submit" className="primary-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Register'}
            </button>
          </form>

          {message && <p className={`status-message ${message.includes('success') ? 'success' : 'error'}`}>{message}</p>}

          <p className="toggle-text">
            Already have an account?
            <button type="button" onClick={() => navigate('/login')}>
              Log in
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
