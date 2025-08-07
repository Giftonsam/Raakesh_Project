import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import {
    BookOpen,
    ShoppingCart,
    Heart,
    User,
    Menu,
    X,
    LogOut,
    Settings,
    Package,
    Users,
    BarChart3
} from 'lucide-react'

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { user, logout, isAdmin, isUser } = useAuth()
    const { getCartItemCount } = useCart()
    const location = useLocation()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/auth/login')
        setIsMobileMenuOpen(false)
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    const isActivePath = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/')
    }

    if (!user) {
        return (
            <nav className="navbar">
                <div className="container navbar__container">
                    <Link to="/" className="navbar__brand">
                        <BookOpen size={24} style={{ marginRight: '8px' }} />
                        BookStore
                    </Link>
                    <div className="navbar__nav">
                        <Link
                            to="/auth/login"
                            className={`navbar__link ${isActivePath('/auth/login') ? 'navbar__link--active' : ''}`}
                        >
                            Login
                        </Link>
                        <Link
                            to="/auth/register"
                            className="btn btn--primary btn--sm"
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </nav>
        )
    }

    return (
        <nav className="navbar">
            <div className="container navbar__container">
                <Link to="/" className="navbar__brand" onClick={closeMobileMenu}>
                    <BookOpen size={24} style={{ marginRight: '8px' }} />
                    BookStore
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    className="navbar__mobile-toggle"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Navigation Links */}
                <div className={`navbar__nav ${isMobileMenuOpen ? 'navbar__nav--open' : ''}`}>
                    {isAdmin ? (
                        // Admin Navigation
                        <>
                            <Link
                                to="/admin"
                                className={`navbar__link ${isActivePath('/admin') && location.pathname === '/admin' ? 'navbar__link--active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                <BarChart3 size={18} />
                                Dashboard
                            </Link>
                            <Link
                                to="/admin/books"
                                className={`navbar__link ${isActivePath('/admin/books') ? 'navbar__link--active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                <BookOpen size={18} />
                                Books
                            </Link>
                            <Link
                                to="/admin/orders"
                                className={`navbar__link ${isActivePath('/admin/orders') ? 'navbar__link--active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                <Package size={18} />
                                Orders
                            </Link>
                            <Link
                                to="/admin/stock"
                                className={`navbar__link ${isActivePath('/admin/stock') ? 'navbar__link--active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                <Settings size={18} />
                                Stock
                            </Link>
                            <Link
                                to="/admin/users"
                                className={`navbar__link ${isActivePath('/admin/users') ? 'navbar__link--active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                <Users size={18} />
                                Users
                            </Link>
                        </>
                    ) : (
                        // User Navigation
                        <>
                            <Link
                                to="/books"
                                className={`navbar__link ${isActivePath('/books') ? 'navbar__link--active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                <BookOpen size={18} />
                                Books
                            </Link>
                            <Link
                                to="/categories"
                                className={`navbar__link ${isActivePath('/categories') ? 'navbar__link--active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                Categories
                            </Link>
                            <Link
                                to="/wishlist"
                                className={`navbar__link ${isActivePath('/wishlist') ? 'navbar__link--active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                <Heart size={18} />
                                Wishlist
                            </Link>
                            <Link
                                to="/cart"
                                className={`navbar__link navbar__cart ${isActivePath('/cart') ? 'navbar__link--active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                <ShoppingCart size={18} />
                                Cart
                                {getCartItemCount() > 0 && (
                                    <span className="navbar__cart-badge">
                                        {getCartItemCount()}
                                    </span>
                                )}
                            </Link>
                        </>
                    )}

                    {/* User Menu */}
                    <div className="navbar__user">
                        <div className="flex flex--gap-2" style={{ alignItems: 'center' }}>
                            <span className="text-sm text-secondary">
                                {user.firstname} {user.lastname}
                            </span>
                            {!isAdmin && (
                                <Link
                                    to="/profile"
                                    className={`navbar__link ${isActivePath('/profile') ? 'navbar__link--active' : ''}`}
                                    onClick={closeMobileMenu}
                                >
                                    <User size={18} />
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="navbar__link"
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}