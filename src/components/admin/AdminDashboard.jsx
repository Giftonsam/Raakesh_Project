import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
    BookOpen,
    Package,
    Users,
    TrendingUp,
    ShoppingCart,
    Star,
    AlertTriangle,
    IndianRupee,
    Eye,
    Plus
} from 'lucide-react'

// Sample books data (same as BookManagement and BookCatalog)
const sampleBooks = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Fiction",
        price: 299,
        quantity: 25,
        stock: 25,
        rating: 4.2,
        reviews: 156,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop"
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        category: "Fiction",
        price: 349,
        quantity: 18,
        stock: 18,
        rating: 4.5,
        reviews: 203,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop"
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        category: "Science Fiction",
        price: 279,
        quantity: 32,
        stock: 32,
        rating: 4.4,
        reviews: 189,
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop"
    },
    {
        id: 4,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        category: "Romance",
        price: 259,
        quantity: 22,
        stock: 22,
        rating: 4.3,
        reviews: 167,
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop"
    },
    {
        id: 5,
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        category: "Fiction",
        price: 319,
        quantity: 15,
        stock: 15,
        rating: 3.8,
        reviews: 134,
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop"
    },
    {
        id: 6,
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        category: "Fantasy",
        price: 399,
        quantity: 45,
        stock: 45,
        rating: 4.7,
        reviews: 312,
        image: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop"
    },
    {
        id: 7,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        category: "Fantasy",
        price: 599,
        quantity: 28,
        stock: 28,
        rating: 4.6,
        reviews: 245,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop"
    },
    {
        id: 8,
        title: "Dune",
        author: "Frank Herbert",
        category: "Science Fiction",
        price: 449,
        quantity: 20,
        stock: 20,
        rating: 4.1,
        reviews: 178,
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop"
    },
    {
        id: 9,
        title: "The Alchemist",
        author: "Paulo Coelho",
        category: "Philosophy",
        price: 229,
        quantity: 35,
        stock: 35,
        rating: 4.0,
        reviews: 145,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop"
    },
    {
        id: 10,
        title: "Steve Jobs",
        author: "Walter Isaacson",
        category: "Biography",
        price: 499,
        quantity: 12,
        stock: 12,
        rating: 4.4,
        reviews: 198,
        image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=600&fit=crop"
    },
    {
        id: 11,
        title: "Sapiens",
        author: "Yuval Noah Harari",
        category: "History",
        price: 379,
        quantity: 3, // Low stock for demo
        stock: 3,
        rating: 4.3,
        reviews: 256,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop"
    },
    {
        id: 12,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        category: "Finance",
        price: 329,
        quantity: 2, // Low stock for demo
        stock: 2,
        rating: 4.2,
        reviews: 187,
        image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=600&fit=crop"
    }
]

// Sample orders data
const sampleOrders = [
    {
        id: 1001,
        userId: 2,
        customerName: "John Doe",
        totalAmount: 1147,
        status: "delivered",
        orderDate: "2024-12-08T10:30:00Z",
        items: [
            { bookId: 6, quantity: 1 }, // Harry Potter
            { bookId: 7, quantity: 1 }, // LOTR
            { bookId: 9, quantity: 1 }  // Alchemist
        ]
    },
    {
        id: 1002,
        userId: 3,
        customerName: "Jane Smith",
        totalAmount: 628,
        status: "shipped",
        orderDate: "2024-12-07T14:20:00Z",
        items: [
            { bookId: 3, quantity: 1 }, // 1984
            { bookId: 4, quantity: 1 }  // Pride and Prejudice
        ]
    },
    {
        id: 1003,
        userId: 4,
        customerName: "Mike Johnson",
        totalAmount: 499,
        status: "processing",
        orderDate: "2024-12-07T09:15:00Z",
        items: [
            { bookId: 10, quantity: 1 } // Steve Jobs
        ]
    },
    {
        id: 1004,
        userId: 5,
        customerName: "Sarah Wilson",
        totalAmount: 948,
        status: "pending",
        orderDate: "2024-12-06T16:45:00Z",
        items: [
            { bookId: 2, quantity: 1 }, // To Kill a Mockingbird
            { bookId: 7, quantity: 1 }  // LOTR
        ]
    },
    {
        id: 1005,
        userId: 6,
        customerName: "David Brown",
        totalAmount: 708,
        status: "delivered",
        orderDate: "2024-12-05T11:20:00Z",
        items: [
            { bookId: 11, quantity: 1 }, // Sapiens
            { bookId: 12, quantity: 1 }  // Psychology of Money
        ]
    },
    {
        id: 1006,
        userId: 7,
        customerName: "Emma Davis",
        totalAmount: 318,
        status: "cancelled",
        orderDate: "2024-12-04T13:30:00Z",
        items: [
            { bookId: 5, quantity: 1 } // Catcher in the Rye
        ]
    }
]

export default function AdminDashboard() {
    const { user } = useAuth()
    const [books] = useState(sampleBooks)
    const [orders] = useState(sampleOrders)
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
        const totalRevenue = orders
            .filter(order => order.status !== 'cancelled')
            .reduce((sum, order) => sum + order.totalAmount, 0)
        const recentOrders = orders
            .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
            .slice(0, 5)
        const topBooks = books
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 5)

        setStats({
            totalBooks: books.length,
            totalOrders: orders.filter(order => order.status !== 'cancelled').length,
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
        if (book.image && book.image.startsWith('http') && !book.image.includes('via.placeholder.com')) {
            return book.image
        }
        return null
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page__header">
                    <h1 className="page__title">Admin Dashboard</h1>
                    <p className="page__subtitle">
                        Welcome back, {user?.firstname || 'Admin'}! Here's what's happening in your bookstore.
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
                        <div className="stat-card__change">+2 this week</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card__icon">
                            <Package size={24} />
                        </div>
                        <div className="stat-card__value">{stats.totalOrders}</div>
                        <div className="stat-card__label">Total Orders</div>
                        <div className="stat-card__change">+3 this week</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card__icon">
                            <IndianRupee size={24} />
                        </div>
                        <div className="stat-card__value">₹{stats.totalRevenue.toLocaleString()}</div>
                        <div className="stat-card__label">Total Revenue</div>
                        <div className="stat-card__change">+₹1,847 this week</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card__icon" style={{
                            background: stats.lowStockBooks > 0 ? 'var(--color-danger-light)' : 'var(--color-success-light)',
                            color: stats.lowStockBooks > 0 ? 'var(--color-danger-dark)' : 'var(--color-success-dark)'
                        }}>
                            <AlertTriangle size={24} />
                        </div>
                        <div className="stat-card__value" style={{
                            color: stats.lowStockBooks > 0 ? 'var(--color-danger)' : 'var(--color-success)'
                        }}>
                            {stats.lowStockBooks}
                        </div>
                        <div className="stat-card__label">Low Stock Items</div>
                        <div className="stat-card__change" style={{
                            color: stats.lowStockBooks > 0 ? 'var(--color-danger)' : 'var(--color-success)'
                        }}>
                            {stats.lowStockBooks > 0 ? 'Action needed!' : 'All good!'}
                        </div>
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

                <div className="dashboard-grid">
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
                                                    <td>{order.customerName}</td>
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

                        <div className="top-books-list">
                            {stats.topBooks.map((book, index) => (
                                <div key={book.id} className="top-book-item">
                                    <div className="book-rank">#{index + 1}</div>
                                    <div className="book-image-container">
                                        {getBookImage(book) ? (
                                            <>
                                                <img
                                                    src={getBookImage(book)}
                                                    alt={book.title}
                                                    className="book-image"
                                                    onError={handleImageError}
                                                />
                                                <div className="book-placeholder" style={{ display: 'none' }}>
                                                    <BookOpen size={16} />
                                                    <span>{book.title.slice(0, 8)}...</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="book-placeholder">
                                                <BookOpen size={16} />
                                                <span>{book.title.slice(0, 8)}...</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="book-details">
                                        <h4 className="book-title">{book.title}</h4>
                                        <p className="book-author">{book.author}</p>
                                        <div className="book-meta">
                                            <div className="book-rating">
                                                <Star size={14} fill="currentColor" />
                                                <span>{book.rating}</span>
                                                <span className="reviews-count">({book.reviews} reviews)</span>
                                            </div>
                                            <div className="book-stock">
                                                Stock: <span className={book.quantity <= 5 ? 'low-stock' : 'good-stock'}>
                                                    {book.quantity}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="book-price">₹{book.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

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
                    text-decoration: none;
                }

                .section-link:hover {
                    color: var(--color-primary-dark);
                    text-decoration: underline;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: var(--space-6);
                    margin-bottom: var(--space-8);
                }

                .stat-card {
                    background: var(--bg-primary);
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-xl);
                    padding: var(--space-6);
                    transition: all var(--transition-base);
                }

                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-xl);
                    border-color: var(--color-primary);
                }

                .stat-card__icon {
                    width: 48px;
                    height: 48px;
                    background: var(--color-primary-light);
                    color: var(--color-primary-dark);
                    border-radius: var(--radius-lg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: var(--space-4);
                }

                .stat-card__value {
                    font-size: var(--font-size-3xl);
                    font-weight: var(--font-weight-bold);
                    color: var(--text-primary);
                    margin-bottom: var(--space-2);
                }

                .stat-card__label {
                    font-size: var(--font-size-base);
                    color: var(--text-secondary);
                    margin-bottom: var(--space-2);
                }

                .stat-card__change {
                    font-size: var(--font-size-sm);
                    color: var(--color-secondary);
                    font-weight: var(--font-weight-medium);
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
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-xl);
                    color: var(--text-primary);
                    font-weight: var(--font-weight-medium);
                    transition: all var(--transition-base);
                    text-decoration: none;
                }

                .quick-action:hover {
                    background: var(--color-primary);
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-lg);
                    border-color: var(--color-primary);
                    text-decoration: none;
                }

                .dashboard-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: var(--space-8);
                }

                .card {
                    background: var(--bg-primary);
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-xl);
                    overflow: hidden;
                }

                .table-container {
                    overflow-x: auto;
                }

                .table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .table th,
                .table td {
                    padding: var(--space-3);
                    text-align: left;
                    border-bottom: 1px solid var(--color-gray-200);
                }

                .table th {
                    background: var(--bg-secondary);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                    font-size: var(--font-size-sm);
                }

                .table td {
                    font-size: var(--font-size-sm);
                    color: var(--text-secondary);
                }

                .badge {
                    display: inline-flex;
                    align-items: center;
                    padding: var(--space-1) var(--space-2);
                    border-radius: var(--radius-full);
                    font-size: var(--font-size-xs);
                    font-weight: var(--font-weight-semibold);
                    text-transform: capitalize;
                }

                .badge--pending { background: var(--color-accent-light); color: var(--color-accent-dark); }
                .badge--processing { background: var(--color-primary-light); color: var(--color-primary-dark); }
                .badge--shipped { background: rgba(147, 51, 234, 0.2); color: #7c3aed; }
                .badge--delivered { background: var(--color-secondary-light); color: var(--color-secondary-dark); }
                .badge--cancelled { background: var(--color-danger-light); color: var(--color-danger-dark); }

                .empty-state {
                    text-align: center;
                    padding: var(--space-16);
                    color: var(--text-muted);
                }

                .empty-state h3 {
                    margin: var(--space-4) 0 var(--space-2);
                    color: var(--text-secondary);
                }

                .top-books-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4);
                }

                .top-book-item {
                    display: flex;
                    align-items: center;
                    gap: var(--space-4);
                    padding: var(--space-4);
                    background: var(--bg-primary);
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-lg);
                    transition: all var(--transition-base);
                }

                .top-book-item:hover {
                    border-color: var(--color-primary);
                    box-shadow: var(--shadow-base);
                }

                .book-rank {
                    font-size: var(--font-size-lg);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-primary);
                    min-width: 30px;
                    text-align: center;
                }

                .book-image-container {
                    position: relative;
                    flex-shrink: 0;
                }

                .book-image {
                    width: 48px;
                    height: 64px;
                    object-fit: cover;
                    border-radius: var(--radius-base);
                }

                .book-placeholder {
                    width: 48px;
                    height: 64px;
                    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
                    color: white;
                    border-radius: var(--radius-base);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-size: var(--font-size-xs);
                    font-weight: var(--font-weight-bold);
                    text-align: center;
                    gap: var(--space-1);
                }

                .book-details {
                    flex: 1;
                    min-width: 0;
                }

                .book-title {
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-semibold);
                    margin-bottom: var(--space-1);
                    color: var(--text-primary);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .book-author {
                    color: var(--text-secondary);
                    font-size: var(--font-size-sm);
                    margin-bottom: var(--space-2);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .book-meta {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: var(--space-2);
                }

                .book-rating {
                    display: flex;
                    align-items: center;
                    gap: var(--space-1);
                    color: var(--color-accent);
                    font-size: var(--font-size-sm);
                }

                .reviews-count {
                    color: var(--text-muted);
                    font-size: var(--font-size-xs);
                    margin-left: var(--space-1);
                }

                .book-stock {
                    font-size: var(--font-size-xs);
                    color: var(--text-muted);
                }

                .low-stock {
                    color: var(--color-danger);
                    font-weight: var(--font-weight-bold);
                }

                .good-stock {
                    color: var(--color-secondary);
                    font-weight: var(--font-weight-medium);
                }

                .book-price {
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-secondary);
                }

                @media (max-width: 1024px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr;
                    }

                    .stats-grid {
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    }
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

                    .stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .top-book-item {
                        flex-direction: column;
                        align-items: flex-start;
                        text-align: left;
                    }

                    .book-meta {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: var(--space-2);
                    }

                    .demo-stats {
                        flex-direction: column;
                        gap: var(--space-2);
                    }
                }

                @media (max-width: 480px) {
                    .table-container {
                        font-size: var(--font-size-xs);
                    }

                    .top-book-item {
                        gap: var(--space-2);
                        padding: var(--space-3);
                    }

                    .book-image,
                    .book-placeholder {
                        width: 36px;
                        height: 48px;
                    }
                }
            `}</style>
        </div>
    )
}

function getStatusColor(status) {
    switch (status) {
        case 'pending': return 'pending'
        case 'processing': return 'processing'
        case 'shipped': return 'shipped'
        case 'delivered': return 'delivered'
        case 'cancelled': return 'cancelled'
        default: return 'processing'
    }
}