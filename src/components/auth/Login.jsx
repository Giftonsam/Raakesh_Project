import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { BookOpen, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login, error, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    clearError()
  }, [clearError])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const result = await login(formData)

    if (result.success) {
      navigate(from, { replace: true })
    }

    setIsSubmitting(false)
  }

  const fillDemoCredentials = (type) => {
    if (type === 'admin') {
      setFormData({ username: 'admin', password: 'admin' })
    } else {
      setFormData({ username: 'shashi', password: 'shashi' })
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <BookOpen size={40} />
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your BookStore account</p>
          </div>

          {error && (
            <div className="alert alert--error">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Enter your username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input password-input"
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn--primary auth-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <div className="spinner spinner--sm"></div>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="auth-demo">
            <p className="auth-demo-title">Demo Accounts:</p>
            <div className="auth-demo-buttons">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="btn btn--outline btn--sm"
              >
                Admin Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('user')}
                className="btn btn--outline btn--sm"
              >
                User Demo
              </button>
            </div>
          </div>

          <div className="auth-links">
            <Link to="/auth/forgot-password" className="auth-link">
              Forgot your password?
            </Link>
            <div className="auth-signup">
              <span>Don't have an account? </span>
              <Link to="/auth/register" className="auth-link auth-link--primary">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FIXED: Removed jsx attribute from style tag */}
      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          padding: var(--space-4);
        }

        .auth-container {
          width: 100%;
          max-width: 400px;
        }

        .auth-card {
          background: var(--bg-primary);
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-xl);
          padding: var(--space-8);
          animation: slideInUp 0.5s ease-out;
        }

        .auth-header {
          text-align: center;
          margin-bottom: var(--space-8);
        }

        .auth-logo {
          display: flex;
          justify-content: center;
          margin-bottom: var(--space-4);
          color: var(--color-primary);
        }

        .auth-title {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
          margin-bottom: var(--space-2);
        }

        .auth-subtitle {
          color: var(--text-secondary);
          margin: 0;
        }

        .auth-form {
          margin-bottom: var(--space-6);
        }

        .password-input-container {
          position: relative;
        }

        .password-input {
          padding-right: var(--space-12);
        }

        .password-toggle {
          position: absolute;
          right: var(--space-3);
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: var(--space-1);
          border-radius: var(--radius-base);
          transition: all var(--transition-fast);
        }

        .password-toggle:hover {
          color: var(--text-primary);
          background: var(--color-gray-100);
        }

        .auth-submit-btn {
          width: 100%;
          margin-top: var(--space-4);
        }

        .auth-demo {
          text-align: center;
          padding: var(--space-4);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-6);
        }

        .auth-demo-title {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-3);
        }

        .auth-demo-buttons {
          display: flex;
          gap: var(--space-3);
          justify-content: center;
        }

        .auth-links {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .auth-link {
          color: var(--color-primary);
          font-size: var(--font-size-sm);
          transition: color var(--transition-fast);
        }

        .auth-link:hover {
          color: var(--color-primary-dark);
          text-decoration: underline;
        }

        .auth-link--primary {
          font-weight: var(--font-weight-semibold);
        }

        .auth-signup {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: var(--space-6);
          }

          .auth-demo-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}