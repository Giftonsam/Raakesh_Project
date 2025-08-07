import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { BookOpen, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        address: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [validationErrors, setValidationErrors] = useState({})

    const { register, error, clearError } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        clearError()
    }, [clearError])

    const validateForm = () => {
        const errors = {}

        if (!formData.username || formData.username.length < 3) {
            errors.username = 'Username must be at least 3 characters long'
        }

        if (!formData.password || formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters long'
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match'
        }

        if (!formData.firstname) {
            errors.firstname = 'First name is required'
        }

        if (!formData.lastname) {
            errors.lastname = 'Last name is required'
        }

        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email address'
        }

        if (!formData.phone || !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            errors.phone = 'Please enter a valid 10-digit phone number'
        }

        if (!formData.address) {
            errors.address = 'Address is required'
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear specific field error when user starts typing
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: undefined
            }))
        }
        clearError()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        const { confirmPassword, ...registrationData } = formData
        const result = await register(registrationData)

        if (result.success) {
            navigate('/')
        }

        setIsSubmitting(false)
    }

    return (
        <div className="auth-page">
            <div className="auth-container auth-container--wide">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <BookOpen size={40} />
                        </div>
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">Join BookStore and start your reading journey</p>
                    </div>

                    {error && (
                        <div className="alert alert--error">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstname" className="form-label">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    id="firstname"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    className={`form-input ${validationErrors.firstname ? 'form-input--error' : ''}`}
                                    required
                                    placeholder="Enter your first name"
                                />
                                {validationErrors.firstname && (
                                    <div className="form-error">{validationErrors.firstname}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastname" className="form-label">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    id="lastname"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    className={`form-input ${validationErrors.lastname ? 'form-input--error' : ''}`}
                                    required
                                    placeholder="Enter your last name"
                                />
                                {validationErrors.lastname && (
                                    <div className="form-error">{validationErrors.lastname}</div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="username" className="form-label">
                                Username *
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`form-input ${validationErrors.username ? 'form-input--error' : ''}`}
                                required
                                placeholder="Choose a username"
                            />
                            {validationErrors.username && (
                                <div className="form-error">{validationErrors.username}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`form-input ${validationErrors.email ? 'form-input--error' : ''}`}
                                required
                                placeholder="Enter your email"
                            />
                            {validationErrors.email && (
                                <div className="form-error">{validationErrors.email}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`form-input ${validationErrors.phone ? 'form-input--error' : ''}`}
                                required
                                placeholder="Enter your phone number"
                            />
                            {validationErrors.phone && (
                                <div className="form-error">{validationErrors.phone}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="address" className="form-label">
                                Address *
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className={`form-input ${validationErrors.address ? 'form-input--error' : ''}`}
                                required
                                placeholder="Enter your full address"
                                rows="3"
                            />
                            {validationErrors.address && (
                                <div className="form-error">{validationErrors.address}</div>
                            )}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">
                                    Password *
                                </label>
                                <div className="password-input-container">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`form-input password-input ${validationErrors.password ? 'form-input--error' : ''}`}
                                        required
                                        placeholder="Create a password"
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
                                {validationErrors.password && (
                                    <div className="form-error">{validationErrors.password}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword" className="form-label">
                                    Confirm Password *
                                </label>
                                <div className="password-input-container">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`form-input password-input ${validationErrors.confirmPassword ? 'form-input--error' : ''}`}
                                        required
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="password-toggle"
                                        aria-label="Toggle confirm password visibility"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {validationErrors.confirmPassword && (
                                    <div className="form-error">{validationErrors.confirmPassword}</div>
                                )}
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
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="auth-links">
                        <div className="auth-signup">
                            <span>Already have an account? </span>
                            <Link to="/auth/login" className="auth-link auth-link--primary">
                                Sign in
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
          background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-dark) 100%);
          padding: var(--space-4);
        }

        .auth-container--wide {
          max-width: 500px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
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
          color: var(--color-secondary);
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

        .auth-links {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .auth-link {
          color: var(--color-secondary);
          font-size: var(--font-size-sm);
          transition: color var(--transition-fast);
        }

        .auth-link:hover {
          color: var(--color-secondary-dark);
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