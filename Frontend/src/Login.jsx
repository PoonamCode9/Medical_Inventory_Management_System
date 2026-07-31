import React from 'react'
import { useState } from 'react'
import './login.css'

export default function login() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [message, setMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setMessage(isLogin ? 'Login successful. Welcome back!' : 'Account created successfully!')
  }

  const toggleMode = () => {
    setIsLogin((prev) => !prev)
    setMessage('')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-panel">
          <p className="brand">MediStock</p>
          <h1>{isLogin ? 'Welcome back' : 'Create your account'}</h1>
          <p className="subtitle">
            Manage medicine
            inventory, track stock availability, monitor expiry dates, maintain supplier records,
            and generate inventory analytics from one secure dashboard.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
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
            )}

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

            {!isLogin && (
              <label>
                <span>Confirm password</span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                />
              </label>
            )}

            <button type="submit" className="primary-btn">
              {isLogin ? 'Log in' : 'Register'}
            </button>
          </form>

          {message && <p className={`status-message ${message.includes('success') ? 'success' : 'error'}`}>{message}</p>}

          <p className="toggle-text">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button type="button" onClick={toggleMode}>
              {isLogin ? 'Register' : 'Log in'}
            </button>
          </p>
        </div>

        <div className="auth-visual">
          <div className="visual-badge">Secure • Fast • Reliable</div>
          <h2>Inventory access made simple & efficient
          </h2>
          <ul>
            <li>Manage medicine
              inventory</li>
            <li>Maintain supplier records</li>
            <li>Generate inventory analytics</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
