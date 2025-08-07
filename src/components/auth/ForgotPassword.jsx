import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { BookOpen, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState('')

    const { forgotPassword } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        const result = await forgotPassword(email)

        if (result.success) {
            setIsSuccess(true)
        } else {
            setError(result.error)
        }

        setIsSubmitting(false)
    }

    const handleChange = (e) => {
        setEmail(e.target.value)
        setError('')
    }

    if (isSuccess) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-card">
                        <div className="auth-header">
                            <div className="auth-logo success-logo">
                                <CheckCircle size={40} />
                            </div>
                            <h1 className="auth-title">Check Your Email</h1>
                            <p className="auth-subtitle">
                                We've sent a password reset link to {email}
                            </p>
                        </div>

                        <div className="success-content">
                            <p className="success-message">
                                Please check your email and click the link to reset your password.
                                The link will expire in 24 hours.
                            </p>

                            <div className="success-actions">
                                <Link to="/auth/login" className="btn btn--primary">
                                    <ArrowLeft size={18} />
                                    Back to Login
                                </Link>
                                <button
                                    onClick={() => {
                                        setIsSuccess(false)
                                        setEmail('')
                                    }}
                                    className="btn btn--outline"
                                >
                                    Try Different Email
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx>{`
          .auth-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%);
            padding: var(--space-4);
          }

          .success-logo {
            color: var(--color-success);
          }

          .success-content {
            text-align: center;
          }

          .success-message {
            color: var(--text-secondary);
            margin-bottom: var(--space-6);
            line-height: var(--line-height-relaxed);
          }

          .success-actions {
            display: flex;
            flex-direction: column;
            gap: var(--space-3);
          }

          @media (min-width: 480px) {
            .success-actions {
              flex-direction: row;
              justify-content: center;
            }
          }
        `}</style>
            </div>
        )
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <BookOpen size={40} />
                        </div>
                        <h1 className="auth-title">Forgot Password?</h1>
                        <p className="auth-subtitle">
                            Enter your email address and we'll send you a link to reset your password
                        </p>
                    </div>

                    {error && (
                        <div className="alert alert--error">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                className="form-input"
                                required
                                placeholder="Enter your email address"
                            />
                            <div className="form-help">
                                We'll send reset instructions to this email address
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !email}
                            className="btn btn--primary auth-submit-btn"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="spinner spinner--sm"></div>
                                    Sending Reset Link...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>

                    <div className="auth-links">
                        <Link to="/auth/login" className="auth-link">
                            <ArrowLeft size={16} />
                            Back to Login
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

            <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%);
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
          color: var(--color-accent);
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
          line-height: var(--line-height-relaxed);
        }

        .auth-form {
          margin-bottom: var(--space-6);
        }

        .auth-submit-btn {
          width: 100%;
          margin-top: var(--space-4);
        }

        .auth-links {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .auth-link {
          color: var(--color-accent);
          font-size: var(--font-size-sm);
          transition: color var(--transition-fast);
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          justify-content: center;
        }

        .auth-link:hover {
          color: var(--color-accent-dark);
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
        }
      `}</style>
        </div>
    )
}