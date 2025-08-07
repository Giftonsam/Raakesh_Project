// src/components/user/OrderHistory.jsx
import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCartContext } from '../../context/CartContext'
import { useBookContext } from '../../context/BookContext'
import { useAuth } from '../../hooks/useAuth'
import {
    Package,
    Clock,
    Truck,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    Download,
    Filter,
    Calendar,
    DollarSign,
    Star,
    Search,
    ArrowLeft,
    RefreshCw
} from 'lucide-react'

export default function OrderHistory() {
    const { orders, isLoading } = useCartContext()
    const { getBookById } = useBookContext()
    const { user } = useAuth()

    const [statusFilter, setStatusFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [dateFilter, setDateFilter] = useState('all')
    const [selectedOrder, setSelectedOrder] = useState(null)

    // Filter orders for current user
    const userOrders = useMemo(() => {
        if (!orders || !Array.isArray(orders) || !user?.id) {
            return []
        }
        return orders.filter(order => order.userId === user.id)
    }, [orders, user])

    // Apply filters
    const filteredOrders = useMemo(() => {
        let filtered = [...userOrders]

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(order => 
                order.id.toString().includes(query) ||
                order.status.toLowerCase().includes(query)
            )
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter)
        }

        // Date filter
        if (dateFilter !== 'all') {
            const now = new Date()
            const filterDate = new Date()

            switch (dateFilter) {
                case 'week':
                    filterDate.setDate(now.getDate() - 7)
                    break
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1)
                    break
                case '3months':
                    filterDate.setMonth(now.getMonth() - 3)
                    break
                default:
                    filterDate.setFullYear(1970)
            }

            filtered = filtered.filter(order => new Date(order.orderDate) >= filterDate)
        }

        // Sort by date (newest first)
        return filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    }, [userOrders, statusFilter, searchQuery, dateFilter])

    // Order statistics
    const orderStats = useMemo(() => {
        return {
            total: userOrders.length,
            pending: userOrders.filter(order => order.status === 'pending').length,
            delivered: userOrders.filter(order => order.status === 'delivered').length,
            totalSpent: userOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
        }
    }, [userOrders])

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={16} />
            case 'processing': return <Package size={16} />
            case 'shipped': return <Truck size={16} />
            case 'delivered': return <CheckCircle size={16} />
            case 'cancelled': return <XCircle size={16} />
            default: return <AlertCircle size={16} />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning'
            case 'processing': return 'info'
            case 'shipped': return 'primary'
            case 'delivered': return 'success'
            case 'cancelled': return 'danger'
            default: return 'secondary'
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Order Received'
            case 'processing': return 'Being Prepared'
            case 'shipped': return 'On the Way'
            case 'delivered': return 'Delivered'
            case 'cancelled': return 'Cancelled'
            default: return status
        }
    }

    const handleOrderDetails = (order) => {
        setSelectedOrder(order)
    }

    const downloadInvoice = (orderId) => {
        // Mock invoice download
        const invoice = `Invoice for Order #${orderId}\nThank you for your purchase!`
        const blob = new Blob([invoice], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invoice-${orderId}.txt`
        a.click()
        window.URL.revokeObjectURL(url)
    }

    const reorderItems = async (order) => {
        // Mock reorder functionality
        console.log('Reordering items from order:', order.id)
        alert('Items added to cart for reordering!')
    }

    if (isLoading) {
        return (
            <div className="page">
                <div className="container">
                    <div className="loading-container">
                        <div className="spinner spinner--lg"></div>
                        <p>Loading your orders...</p>
                    </div>
                </div>

                <style jsx>{`
                    .loading-container {
                        text-align: center;
                        padding: var(--space-16);
                        color: var(--text-muted);
                    }
                `}</style>
            </div>
        )
    }

    if (userOrders.length === 0) {
        return (
            <div className="page">
                <div className="container">
                    <div className="page__header">
                        <h1 className="page__title">Order History</h1>
                        <p className="page__subtitle">Track your purchases and order status</p>
                    </div>

                    <div className="empty-orders">
                        <div className="empty-orders-animation">
                            <Package size={120} />
                        </div>
                        <h2>No Orders Yet</h2>
                        <p>When you place your first order, it will appear here. Start exploring our amazing book collection!</p>
                        
                        <div className="empty-suggestions">
                            <Link to="/books" className="btn btn--primary btn--lg">
                                <ArrowLeft size={20} />
                                Start Shopping
                            </Link>
                            <Link to="/categories" className="btn btn--outline btn--lg">
                                Browse Categories
                            </Link>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .empty-orders {
                        text-align: center;
                        padding: var(--space-16);
                        color: var(--text-muted);
                    }

                    .empty-orders-animation {
                        opacity: 0.3;
                        animation: float 3s ease-in-out infinite;
                        margin-bottom: var(--space-8);
                    }

                    .empty-orders h2 {
                        font-size: var(--font-size-2xl);
                        margin: var(--space-6) 0 var(--space-4);
                        color: var(--text-secondary);
                    }

                    .empty-suggestions {
                        display: flex;
                        gap: var(--space-4);
                        justify-content: center;
                        flex-wrap: wrap;
                        margin-top: var(--space-8);
                    }

                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }
                `}</style>
            </div>
        )
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page__header">
                    <h1 className="page__title">Order History</h1>
                    <p className="page__subtitle">Track your purchases and order status</p>
                </div>

                {/* Order Statistics */}
                <div className="order-stats">
                    <div className="stat-card">
                        <div className="stat-icon stat-icon--primary">
                            <Package size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{orderStats.total}</div>
                            <div className="stat-label">Total Orders</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon stat-icon--warning">
                            <Clock size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{orderStats.pending}</div>
                            <div className="stat-label">Pending</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon stat-icon--success">
                            <CheckCircle size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{orderStats.delivered}</div>
                            <div className="stat-label">Delivered</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon stat-icon--secondary">
                            <DollarSign size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">₹{orderStats.totalSpent.toLocaleString()}</div>
                            <div className="stat-label">Total Spent</div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="order-filters">
                    <div className="filter-group">
                        <div className="search-bar">
                            <Search className="search-bar__icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-bar__input"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="form-input filter-select"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="form-input filter-select"
                        >
                            <option value="all">All Time</option>
                            <option value="week">Last Week</option>
                            <option value="month">Last Month</option>
                            <option value="3months">Last 3 Months</option>
                        </select>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn--outline"
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                </div>

                {/* Orders List */}
                <div className="orders-list">
                    {filteredOrders.map(order => {
                        const orderItems = order.items?.map(item => ({
                            ...item,
                            book: getBookById(item.bookId)
                        })).filter(item => item.book) || []

                        return (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div className="order-info">
                                        <h3 className="order-id">Order #{order.id}</h3>
                                        <div className="order-meta">
                                            <span className="order-date">
                                                <Calendar size={14} />
                                                {new Date(order.orderDate).toLocaleDateString()}
                                            </span>
                                            <span className="order-total">
                                                <DollarSign size={14} />
                                                ₹{(order.totalAmount || 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="order-status">
                                        <span className={`status-badge status-badge--${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {getStatusText(order.status)}
                                        </span>
                                    </div>
                                </div>

                                <div className="order-content">
                                    <div className="order-items">
                                        <h4>Items ({orderItems.length})</h4>
                                        <div className="items-preview">
                                            {orderItems.slice(0, 3).map(item => (
                                                <div key={item.bookId} className="item-preview">
                                                    <img
                                                        src={item.book.image}
                                                        alt={item.book.title}
                                                        className="item-image"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/60x80/3b82f6/ffffff?text=Book'
                                                        }}
                                                    />
                                                    <div className="item-details">
                                                        <div className="item-title">{item.book.title}</div>
                                                        <div className="item-quantity">Qty: {item.quantity}</div>
                                                    </div>
                                                </div>
                                            ))}
                                            {orderItems.length > 3 && (
                                                <div className="more-items">
                                                    +{orderItems.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="order-actions">
                                        <button
                                            onClick={() => handleOrderDetails(order)}
                                            className="btn btn--outline btn--sm"
                                        >
                                            <Eye size={16} />
                                            View Details
                                        </button>
                                        
                                        <button
                                            onClick={() => downloadInvoice(order.id)}
                                            className="btn btn--outline btn--sm"
                                        >
                                            <Download size={16} />
                                            Invoice
                                        </button>

                                        {order.status === 'delivered' && (
                                            <>
                                                <button
                                                    onClick={() => reorderItems(order)}
                                                    className="btn btn--primary btn--sm"
                                                >
                                                    <RefreshCw size={16} />
                                                    Reorder
                                                </button>
                                                
                                                <Link 
                                                    to="/feedback" 
                                                    className="btn btn--secondary btn--sm"
                                                >
                                                    <Star size={16} />
                                                    Review
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Order Progress Bar */}
                                <div className="order-progress">
                                    <div className="progress-steps">
                                        <div className={`progress-step ${['pending', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'active' : ''}`}>
                                            <Clock size={16} />
                                            <span>Ordered</span>
                                        </div>
                                        <div className={`progress-step ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'active' : ''}`}>
                                            <Package size={16} />
                                            <span>Processing</span>
                                        </div>
                                        <div className={`progress-step ${['shipped', 'delivered'].includes(order.status) ? 'active' : ''}`}>
                                            <Truck size={16} />
                                            <span>Shipped</span>
                                        </div>
                                        <div className={`progress-step ${order.status === 'delivered' ? 'active' : ''}`}>
                                            <CheckCircle size={16} />
                                            <span>Delivered</span>
                                        </div>
                                    </div>
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill"
                                            style={{
                                                width: order.status === 'pending' ? '25%' :
                                                       order.status === 'processing' ? '50%' :
                                                       order.status === 'shipped' ? '75%' :
                                                       order.status === 'delivered' ? '100%' : '0%'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {filteredOrders.length === 0 && (
                    <div className="no-results">
                        <AlertCircle size={48} />
                        <h3>No orders found</h3>
                        <p>Try adjusting your filters to see more results.</p>
                        <button
                            onClick={() => {
                                setStatusFilter('all')
                                setDateFilter('all')
                                setSearchQuery('')
                            }}
                            className="btn btn--primary"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Order Details Modal */}
                {selectedOrder && (
                    <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                        <div className="modal modal--large" onClick={(e) => e.stopPropagation()}>
                            <div className="modal__header">
                                <h3 className="modal__title">Order #{selectedOrder.id} Details</h3>
                                <button 
                                    onClick={() => setSelectedOrder(null)}
                                    className="modal__close"
                                >
                                    ×
                                </button>
                            </div>
                            
                            <div className="modal__body">
                                <div className="order-details-grid">
                                    <div className="order-summary">
                                        <h4>Order Summary</h4>
                                        <div className="summary-info">
                                            <div className="info-row">
                                                <span>Order Date:</span>
                                                <span>{new Date(selectedOrder.orderDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="info-row">
                                                <span>Status:</span>
                                                <span className={`badge badge--${getStatusColor(selectedOrder.status)}`}>
                                                    {getStatusText(selectedOrder.status)}
                                                </span>
                                            </div>
                                            <div className="info-row">
                                                <span>Payment Method:</span>
                                                <span>{selectedOrder.paymentMethod || 'Credit Card'}</span>
                                            </div>
                                            <div className="info-row">
                                                <span>Shipping Address:</span>
                                                <span>{selectedOrder.shippingAddress || user?.address || 'Default Address'}</span>
                                            </div>
                                            <div className="info-row total-row">
                                                <span>Total Amount:</span>
                                                <span>₹{(selectedOrder.totalAmount || 0).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="order-items-detail">
                                        <h4>Items Ordered</h4>
                                        <div className="items-list">
                                            {selectedOrder.items?.map(item => {
                                                const book = getBookById(item.bookId)
                                                if (!book) return null
                                                
                                                return (
                                                    <div key={item.bookId} className="item-detail">
                                                        <img
                                                            src={book.image}
                                                            alt={book.title}
                                                            className="item-detail-image"
                                                            onError={(e) => {
                                                                e.target.src = 'https://via.placeholder.com/80x120/3b82f6/ffffff?text=Book'
                                                            }}
                                                        />
                                                        <div className="item-detail-info">
                                                            <h5>{book.title}</h5>
                                                            <p>by {book.author}</p>
                                                            <div className="item-pricing">
                                                                <span>Qty: {item.quantity}</span>
                                                                <span>₹{book.price.toLocaleString()} each</span>
                                                                <span className="item-total">₹{(book.price * item.quantity).toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }) || []}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="modal__footer">
                                <button 
                                    onClick={() => downloadInvoice(selectedOrder.id)}
                                    className="btn btn--outline"
                                >
                                    <Download size={16} />
                                    Download Invoice
                                </button>
                                <button 
                                    onClick={() => setSelectedOrder(null)}
                                    className="btn btn--primary"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .order-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: var(--space-4);
                    margin-bottom: var(--space-8);
                }

                .stat-card {
                    background: var(--bg-primary);
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-xl);
                    padding: var(--space-6);
                    display: flex;
                    align-items: center;
                    gap: var(--space-4);
                    transition: all var(--transition-base);
                }

                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-lg);
                }

                .stat-icon {
                    padding: var(--space-3);
                    border-radius: var(--radius-lg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .stat-icon--primary { 
                    background: var(--color-primary-light);
                    color: var(--color-primary-dark);
                }

                .stat-icon--warning { 
                    background: rgba(245, 158, 11, 0.2);
                    color: var(--color-accent-dark);
                }

                .stat-icon--success { 
                    background: var(--color-secondary-light);
                    color: var(--color-secondary-dark);
                }

                .stat-icon--secondary { 
                    background: var(--color-secondary-light);
                    color: var(--color-secondary-dark);
                }

                .stat-value {
                    font-size: var(--font-size-2xl);
                    font-weight: var(--font-weight-bold);
                    color: var(--text-primary);
                }

                .stat-label {
                    color: var(--text-secondary);
                    font-size: var(--font-size-sm);
                }

                .order-filters {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: var(--space-4);
                    margin-bottom: var(--space-6);
                    flex-wrap: wrap;
                }

                .filter-group {
                    display: flex;
                    gap: var(--space-4);
                    flex: 1;
                    max-width: 600px;
                }

                .filter-select {
                    min-width: 120px;
                }

                .orders-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-6);
                }

                .order-card {
                    background: var(--bg-primary);
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-2xl);
                    padding: var(--space-6);
                    transition: all var(--transition-base);
                }

                .order-card:hover {
                    border-color: var(--color-primary);
                    box-shadow: var(--shadow-xl);
                    transform: translateY(-2px);
                }

                .order-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: start;
                    margin-bottom: var(--space-4);
                    padding-bottom: var(--space-4);
                    border-bottom: 1px solid var(--color-gray-200);
                }

                .order-id {
                    font-size: var(--font-size-xl);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-primary);
                    margin-bottom: var(--space-2);
                }

                .order-meta {
                    display: flex;
                    gap: var(--space-4);
                    align-items: center;
                    flex-wrap: wrap;
                }

                .order-date,
                .order-total {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    color: var(--text-secondary);
                    font-size: var(--font-size-sm);
                }

                .order-total {
                    font-weight: var(--font-weight-semibold);
                    color: var(--color-secondary);
                }

                .status-badge {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    padding: var(--space-2) var(--space-4);
                    border-radius: var(--radius-full);
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-semibold);
                }

                .status-badge--pending {
                    background: rgba(245, 158, 11, 0.2);
                    color: var(--color-accent-dark);
                }

                .status-badge--processing {
                    background: rgba(59, 130, 246, 0.2);
                    color: var(--color-primary-dark);
                }

                .status-badge--shipped {
                    background: rgba(147, 51, 234, 0.2);
                    color: #7c3aed;
                }

                .status-badge--delivered {
                    background: var(--color-secondary-light);
                    color: var(--color-secondary-dark);
                }

                .status-badge--cancelled {
                    background: var(--color-danger-light);
                    color: var(--color-danger-dark);
                }

                .order-content {
                    display: grid;
                    grid-template-columns: 1fr auto;
                    gap: var(--space-6);
                    align-items: start;
                    margin-bottom: var(--space-4);
                }

                .order-items h4 {
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-semibold);
                    margin-bottom: var(--space-3);
                    color: var(--text-primary);
                }

                .items-preview {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-3);
                }

                .item-preview {
                    display: flex;
                    gap: var(--space-3);
                    align-items: center;
                    padding: var(--space-2);
                    background: var(--bg-secondary);
                    border-radius: var(--radius-lg);
                }

                .item-image {
                    width: 40px;
                    height: 56px;
                    object-fit: cover;
                    border-radius: var(--radius-base);
                }

                .item-title {
                    font-weight: var(--font-weight-medium);
                    font-size: var(--font-size-sm);
                    color: var(--text-primary);
                    margin-bottom: var(--space-1);
                }

                .item-quantity {
                    font-size: var(--font-size-xs);
                    color: var(--text-muted);
                }

                .more-items {
                    text-align: center;
                    color: var(--text-muted);
                    font-size: var(--font-size-sm);
                    padding: var(--space-2);
                    background: var(--bg-secondary);
                    border-radius: var(--radius-lg);
                }

                .order-actions {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-2);
                    min-width: 150px;
                }

                .order-progress {
                    margin-top: var(--space-4);
                    padding-top: var(--space-4);
                    border-top: 1px solid var(--color-gray-200);
                }

                .progress-steps {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: var(--space-3);
                }

                .progress-step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--space-1);
                    color: var(--text-muted);
                    font-size: var(--font-size-xs);
                    transition: color var(--transition-fast);
                }

                .progress-step.active {
                    color: var(--color-primary);
                }

                .progress-bar {
                    height: 4px;
                    background: var(--color-gray-200);
                    border-radius: var(--radius-full);
                    overflow: hidden;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
                    transition: width var(--transition-base);
                }

                .no-results {
                    text-align: center;
                    padding: var(--space-16);
                    color: var(--text-muted);
                }

                .no-results h3 {
                    margin: var(--space-4) 0 var(--space-2);
                    color: var(--text-secondary);
                }

                .modal--large {
                    max-width: 800px;
                }

                .order-details-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-6);
                }

                .order-summary h4,
                .order-items-detail h4 {
                    font-size: var(--font-size-lg);
                    font-weight: var(--font-weight-semibold);
                    margin-bottom: var(--space-4);
                    color: var(--text-primary);
                }

                .summary-info {
                    background: var(--bg-secondary);
                    padding: var(--space-4);
                    border-radius: var(--radius-lg);
                }

                .info-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-2) 0;
                    border-bottom: 1px solid var(--color-gray-200);
                }

                .info-row:last-child {
                    border-bottom: none;
                }

                .total-row {
                    font-weight: var(--font-weight-bold);
                    font-size: var(--font-size-lg);
                    color: var(--text-primary);
                    margin-top: var(--space-2);
                    padding-top: var(--space-3);
                    border-top: 2px solid var(--color-gray-300);
                }

                .items-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4);
                    max-height: 400px;
                    overflow-y: auto;
                }

                .item-detail {
                    display: flex;
                    gap: var(--space-4);
                    padding: var(--space-4);
                    background: var(--bg-secondary);
                    border-radius: var(--radius-lg);
                }

                .item-detail-image {
                    width: 60px;
                    height: 84px;
                    object-fit: cover;
                    border-radius: var(--radius-base);
                }

                .item-detail-info {
                    flex: 1;
                }

                .item-detail-info h5 {
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-semibold);
                    margin-bottom: var(--space-1);
                    color: var(--text-primary);
                }

                .item-detail-info p {
                    color: var(--text-secondary);
                    font-size: var(--font-size-sm);
                    margin-bottom: var(--space-2);
                }

                .item-pricing {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: var(--font-size-sm);
                }

                .item-total {
                    font-weight: var(--font-weight-bold);
                    color: var(--color-secondary);
                }

                @media (max-width: 1024px) {
                    .order-details-grid {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 768px) {
                    .order-filters {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .filter-group {
                        max-width: 100%;
                        flex-direction: column;
                    }

                    .order-header {
                        flex-direction: column;
                        align-items: start;
                        gap: var(--space-3);
                    }

                    .order-content {
                        grid-template-columns: 1fr;
                    }

                    .order-actions {
                        flex-direction: row;
                        flex-wrap: wrap;
                        min-width: auto;
                    }

                    .progress-steps {
                        gap: var(--space-2);
                    }

                    .progress-step span {
                        display: none;
                    }
                }

                @media (max-width: 480px) {
                    .order-stats {
                        grid-template-columns: 1fr;
                    }

                    .stat-card {
                        flex-direction: column;
                        text-align: center;
                    }
                }
            `}</style>
        </div>
    )
}