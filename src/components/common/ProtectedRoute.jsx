import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute({ children, requiredUserType }) {
    const { user, isLoading } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return (
            <div className="flex--center" style={{ minHeight: '50vh' }}>
                <div className="spinner"></div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />
    }

    if (requiredUserType && user.usertype !== requiredUserType) {
        // Redirect based on user type
        const redirectPath = user.usertype === 1 ? '/admin' : '/books'
        return <Navigate to={redirectPath} replace />
    }

    return children
}