import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useBookContext } from '../../context/BookContext'
import { useCartContext } from '../../context/CartContext'
import {
    BookOpen,
    Package,
    Users,
    TrendingUp,
    ShoppingCart,
    Star,
    AlertTriangle,
    DollarSign,
    Eye,
    Plus
} from 'lucide-react'

export default function AdminDashboard() {
    const { user } = useAuth()
    const { books } = useBookContext()
    const { orders } = useCartContext()
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalOrders: 0,
        totalRevenue: 0,
        lowStockBooks: 0,
        recentOrders: [],
        topBooks: []
    })

    useEffect(() => {
        // Calculate dashboard statistics
        const lowStockThreshold = 5
        const lowStockBooks = books.filter(book => book.quantity <= lowStockThreshold).length
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
        const recentOrders = orders.slice(0, 5) // Get 5 most recent orders
        const topBooks = books
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 5)

        setStats({
            totalBooks: books.length,
            totalOrders: orders.length,
            totalRevenue,
            lowStockBooks,
            recentOrders,
            topBooks
        })
    }, [books, orders])

    // Handle image errors with fallback
    const handleImageError = (e) => {
        e.target.style.display = 'none'
        const placeholder = e.target.nextElementSibling
        if (placeholder) {
            placeholder.style.display = 'flex'
        }
    }

    // Create a reliable fallback image URL or use CSS placeholder
    const getBookImage = (book) => {
        // If book has a valid image URL, use it; otherwise return null to show placeholder
        if (book.image && book.image.startsWith('http') && !book.image.includes('via.placeholder.com')) {
            return book.image
        }
        return null // Will show CSS placeholder instead
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page__header">
                    <h1 className="page__title">Admin Dashboard</h1>
                    <p className="page__subtitle">
                        Welcome back, {user.firstname}! Here's what's happening in your store.
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card__icon">
                            <BookOpen size={24} />
                        </div>
                        <div className="stat-card__value">{stats.totalBooks}</div>
                        <div className="stat-card__label">Total Books</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card__icon">
                            <Package size={24} />
                        </div>
                        <div className="stat-card__value">{stats.totalOrders}</div>
                        <div className="stat-card__label">Total Orders</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card__icon">
                            <DollarSign size={24} />
                        </div>
                        <div className="stat-card__value">₹{stats.totalRevenue.toLocaleString()}</div>
                        <div className="stat-card__label">Total Revenue</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card__icon" style={{ background: stats.lowStockBooks > 0 ? 'var(--color-danger-light)' : 'var(--color-success)' }}>
                            <AlertTriangle size={24} style={{ color: stats.lowStockBooks > 0 ? 'var(--color-danger)' : 'var(--color-success)' }} />
                        </div>
                        <div className="stat-card__value" style={{ color: stats.lowStockBooks > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                            {stats.lowStockBooks}
                        </div>
                        <div className="stat-card__label">Low Stock Items</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="dashboard-section">
                    <h2 className="section-title">Quick Actions</h2>
                    <div className="quick-actions">
                        <Link to="/admin/books" className="quick-action">
                            <Plus size={20} />
                            Add New Book
                        </Link>
                        <Link to="/admin/orders" className="quick-action">
                            <Eye size={20} />
                            View Orders
                        </Link>
                        <Link to="/admin/stock" className="quick-action">
                            <Package size={20} />
                            Manage Stock
                        </Link>
                        <Link to="/admin/users" className="quick-action">
                            <Users size={20} />
                            User Management
                        </Link>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">Recent Orders</h2>
                        <Link to="/admin/orders" className="section-link">
                            View All Orders
                        </Link>
                    </div>

                    {stats.recentOrders.length > 0 ? (
                        <div className="card">
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentOrders.map(order => (
                                            <tr key={order.id}>
                                                <td>#{order.id}</td>
                                                <td>User {order.userId}</td>
                                                <td>₹{order.totalAmount.toLocaleString()}</td>
                                                <td>
                                                    <span className={`badge badge--${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                                <td>
                                                    <Link
                                                        to={`/admin/orders/${order.id}`}
                                                        className="btn btn--outline btn--sm"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <Package size={48} />
                            <h3>No Orders Yet</h3>
                            <p>Orders will appear here when customers start purchasing books.</p>
                        </div>
                    )}
                </div>

                {/* Top Rated Books */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">Top Rated Books</h2>
                        <Link to="/admin/books" className="section-link">
                            Manage Books
                        </Link>
                    </div>

                    <div className="top-books-grid">
                        {stats.topBooks.map(book => (
                            <div key={book.id} className="top-book-card">
                                <div className="book-image-container">
                                    {getBookImage(book) ? (
                                        <>
                                            <img
                                                src={getBookImage(book)}
                                                alt={book.title}
                                                className="top-book-card__image"
                                                onError={handleImageError}
                                            />
                                            <div className="book-placeholder" style={{ display: 'none' }}>
                                                <BookOpen size={20} />
                                                <span>{book.title.slice(0, 10)}...</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="book-placeholder">
                                            <BookOpen size={20} />
                                            <span>{book.title.slice(0, 10)}...</span>
                                        </div>
                                    )}
                                </div>
                                <div className="top-book-card__content">
                                    <h4 className="top-book-card__title">{book.title}</h4>
                                    <p className="top-book-card__author">{book.author}</p>
                                    <div className="top-book-card__rating">
                                        <Star size={16} fill="currentColor" />
                                        <span>{book.rating || 0}</span>
                                        <span className="text-muted">({book.reviews || 0} reviews)</span>
                                    </div>
                                    <div className="top-book-card__price">₹{book.price}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FIXED: Removed jsx attribute */}
            <style>{`
        .dashboard-section {
          margin-bottom: var(--space-12);
        }

        .section-title {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
          margin: 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-6);
        }

        .section-link {
          color: var(--color-primary);
          font-weight: var(--font-weight-medium);
          font-size: var(--font-size-sm);
          transition: color var(--transition-fast);
        }

        .section-link:hover {
          color: var(--color-primary-dark);
          text-decoration: underline;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-4);
        }

        .quick-action {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-6);
          background: var(--bg-primary);
          border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-xl);
          color: var(--text-primary);
          font-weight: var(--font-weight-medium);
          transition: all var(--transition-base);
          text-decoration: none;
        }

        .quick-action:hover {
          background: var(--color-primary);
          color: var(--text-white);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          text-decoration: none;
        }

        .table-container {
          overflow-x: auto;
        }

        .empty-state {
          text-align: center;
          padding: var(--space-16);
          color: var(--text-muted);
        }

        .empty-state h3 {
          margin: var(--space-4) 0 var(--space-2);
          color: var(--text-secondary);
        }

        .top-books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--space-6);
        }

        .top-book-card {
          background: var(--bg-primary);
          border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-xl);
          padding: var(--space-4);
          transition: all var(--transition-base);
        }

        .top-book-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .book-image-container {
          position: relative;
          float: left;
          margin-right: var(--space-4);
          margin-bottom: var(--space-2);
        }

        .top-book-card__image {
          width: 60px;
          height: 80px;
          object-fit: cover;
          border-radius: var(--radius-lg);
        }

        .book-placeholder {
          width: 60px;
          height: 80px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-bold);
          text-align: center;
          gap: var(--space-1);
        }

        .top-book-card__content {
          overflow: hidden;
        }

        .top-book-card__title {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--space-1);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .top-book-card__author {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          margin-bottom: var(--space-2);
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .top-book-card__rating {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          margin-bottom: var(--space-2);
          color: var(--color-accent);
          font-size: var(--font-size-sm);
        }

        .top-book-card__price {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
          color: var(--color-secondary);
        }

        @media (max-width: 768px) {
          .quick-actions {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-2);
          }

          .top-books-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    )
}

function getStatusColor(status) {
    switch (status) {
        case 'pending': return 'warning'
        case 'processing': return 'info'
        case 'shipped': return 'primary'
        case 'delivered': return 'success'
        case 'cancelled': return 'danger'
        default: return 'primary'
    }
}