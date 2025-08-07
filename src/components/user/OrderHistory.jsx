import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCartContext } from '../../context/CartContext'
import { useBookContext } from '../../context/BookContext'
import { useAuth } from '../../hooks/useAuth'
import {
    Package,
    Calendar,
    DollarSign,
    Eye,
    ArrowLeft,
    Clock,
    Truck,
    CheckCircle,
    XCircle,
    X
} from 'lucide-react'

export default function OrderHistory() {
    const { orders } = useCartContext()
    const { getBookById } = useBookContext()
    const { user } = useAuth()

    const [selectedOrder, setSelectedOrder] = useState(null)
    const [statusFilter, setStatusFilter] = useState('all')

    const userOrders = orders.filter(order => order.userId === user?.id)

    const filteredOrders = statusFilter === 'all'
        ? userOrders
        : userOrders.filter(order => order.status === statusFilter)

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={16} />
            case 'processing': return <Package size={16} />
            case 'shipped': return <Truck size={16} />
            case 'delivered': return <CheckCircle size={16} />
            case 'cancelled': return <XCircle size={16} />
            default: return <Package size={16} />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning'
            case 'processing': return 'info'
            case 'shipped': return 'primary'
            case 'delivered': return 'success'
            case 'cancelled': return 'danger'
            default: return 'primary'
        }
    }

    const handleViewOrder = (order) => {
        setSelectedOrder(order)
    }

    const closeOrderModal = () => {
        setSelectedOrder(null)
    }

    if (userOrders.length === 0) {
        return (
            <div className="page">
                <div className="container">
                    <div className="page__header">
                        <h1 className="page__title">Order History</h1>
                        <p className="page__subtitle">Track your book purchases</p>
                    </div>

                    <div className="empty-orders">
                        <Package size={64} />
                        <h2>No Orders Yet</h2>
                        <p>You haven't placed any orders yet. Start shopping to see your order history here!</p>
                        <Link to="/books" className="btn btn--primary">
                            <ArrowLeft size={18} />
                            Start Shopping
                        </Link>
                    </div>
                </div>

                <style jsx>{`
          .empty-orders {
            text-align: center;
            padding: var(--space-16);
            color: var(--text-muted);
          }

          .empty-orders h2 {
            margin: var(--space-6) 0 var(--space-4);
            color: var(--text-secondary);
          }

          .empty-orders p {
            margin-bottom: var(--space-8);
            font-size: var(--font-size-lg);
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
                    <p className="page__subtitle">
                        {userOrders.length} {userOrders.length === 1 ? 'order' : 'orders'} placed
                    </p>
                </div>

                {/* Filter Controls */}
                <div className="orders-controls">
                    <div className="status-filters">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`filter-btn ${statusFilter === 'all' ? 'filter-btn--active' : ''}`}
                        >
                            All Orders ({userOrders.length})
                        </button>
                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => {
                            const count = userOrders.filter(order => order.status === status).length
                            return count > 0 ? (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`filter-btn ${statusFilter === status ? 'filter-btn--active' : ''}`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                                </button>
                            ) : null
                        })}
                    </div>
                </div>

                {/* Orders List */}
                <div className="orders-list">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-card__header">
                                <div className="order-info">
                                    <h3 className="order-id">Order #{order.id}</h3>
                                    <div className="order-meta">
                                        <span className="order-date">
                                            <Calendar size={14} />
                                            {new Date(order.orderDate).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                        <span className="order-total">
                                            <DollarSign size={14} />
                                            ₹{order.totalAmount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="order-status">
                                    <span className={`badge badge--${getStatusColor(order.status)} order-status-badge`}>
                                        {getStatusIcon(order.status)}
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                    <button
                                        onClick={() => handleViewOrder(order)}
                                        className="btn btn--outline btn--sm"
                                    >
                                        <Eye size={16} />
                                        View Details
                                    </button>
                                </div>
                            </div>

                            <div className="order-card__body">
                                <div className="order-items-summary">
                                    <span className="items-count">
                                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                    </span>
                                    <div className="order-books">
                                        {order.items.slice(0, 3).map(item => {
                                            const book = getBookById(item.bookId)
                                            return book ? (
                                                <img
                                                    key={item.id}
                                                    src={book.image}
                                                    alt={book.title}
                                                    className="order-book-thumb"
                                                    title={book.title}
                                                />
                                            ) : null
                                        })}
                                        {order.items.length > 3 && (
                                            <div className="more-books">+{order.items.length - 3}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Details Modal */}
                {selectedOrder && (
                    <div className="modal-overlay" onClick={closeOrderModal}>
                        <div className="modal modal--large" onClick={(e) => e.stopPropagation()}>
                            <div className="modal__header">
                                <h3 className="modal__title">Order Details - #{selectedOrder.id}</h3>
                                <button onClick={closeOrderModal} className="modal__close">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="modal__body">
                                <div className="order-details-grid">
                                    <div className="order-summary">
                                        <h4>Order Summary</h4>
                                        <div className="summary-item">
                                            <span>Order Date:</span>
                                            <span>{new Date(selectedOrder.orderDate).toLocaleString()}</span>
                                        </div>
                                        <div className="summary-item">
                                            <span>Status:</span>
                                            <span className={`badge badge--${getStatusColor(selectedOrder.status)}`}>
                                                {getStatusIcon(selectedOrder.status)}
                                                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="summary-item">
                                            <span>Payment Method:</span>
                                            <span>{selectedOrder.paymentMethod || 'Card'}</span>
                                        </div>
                                        <div className="summary-item">
                                            <span>Shipping Address:</span>
                                            <span>{selectedOrder.shippingAddress || user.address}</span>
                                        </div>
                                        <hr />
                                        <div className="summary-item summary-total">
                                            <span>Total Amount:</span>
                                            <span>₹{selectedOrder.totalAmount.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="order-items-detail">
                                        <h4>Items Ordered</h4>
                                        <div className="ordered-items">
                                            {selectedOrder.items.map(item => {
                                                const book = getBookById(item.bookId)
                                                return book ? (
                                                    <div key={item.id} className="ordered-item">
                                                        <img src={book.image} alt={book.title} className="ordered-item__image" />
                                                        <div className="ordered-item__details">
                                                            <h5 className="ordered-item__title">{book.title}</h5>
                                                            <p className="ordered-item__author">{book.author}</p>
                                                            <div className="ordered-item__meta">
                                                                <span>Qty: {item.quantity}</span>
                                                                <span>₹{(book.price * item.quantity).toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : null
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .orders-controls {
          margin-bottom: var(--space-6);
        }

        .status-filters {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: var(--space-2) var(--space-4);
          border: 1px solid var(--color-gray-300);
          border-radius: var(--radius-full);
          background: var(--bg-primary);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
          font-size: var(--font-size-sm);
          white-space: nowrap;
        }

        .filter-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .filter-btn--active {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: var(--text-white);
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .order-card {
          background: var(--bg-primary);
          border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-xl);
          transition: all var(--transition-base);
          overflow: hidden;
        }

        .order-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-1px);
        }

        .order-card__header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          padding: var(--space-6);
          border-bottom: 1px solid var(--color-gray-200);
        }

        .order-info {
          flex: 1;
        }

        .order-id {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
          margin-bottom: var(--space-2);
        }

        .order-meta {
          display: flex;
          gap: var(--space-4);
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }

        .order-meta span {
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }

        .order-status {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          align-items: flex-end;
        }

        .order-status-badge {
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }

        .order-card__body {
          padding: var(--space-6);
        }

        .order-items-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .items-count {
          font-weight: var(--font-weight-medium);
          color: var(--text-secondary);
        }

        .order-books {
          display: flex;
          gap: var(--space-2);
          align-items: center;
        }

        .order-book-thumb {
          width: 32px;
          height: 44px;
          object-fit: cover;
          border-radius: var(--radius-base);
          border: 1px solid var(--color-gray-200);
        }

        .more-books {
          background: var(--color-gray-200);
          color: var(--text-secondary);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-base);
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-medium);
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

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-2) 0;
          font-size: var(--font-size-sm);
        }

        .summary-item:not(:last-child) {
          border-bottom: 1px solid var(--color-gray-200);
        }

        .summary-total {
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-base);
          color: var(--text-primary);
          margin-top: var(--space-2);
        }

        .ordered-items {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .ordered-item {
          display: flex;
          gap: var(--space-3);
          padding: var(--space-3);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
        }

        .ordered-item__image {
          width: 50px;
          height: 70px;
          object-fit: cover;
          border-radius: var(--radius-base);
        }

        .ordered-item__details {
          flex: 1;
        }

        .ordered-item__title {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-medium);
          margin-bottom: var(--space-1);
          color: var(--text-primary);
        }

        .ordered-item__author {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          margin-bottom: var(--space-2);
        }

        .ordered-item__meta {
          display: flex;
          justify-content: space-between;
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }

        .ordered-item__meta span:last-child {
          font-weight: var(--font-weight-semibold);
          color: var(--color-secondary);
        }

        @media (max-width: 1024px) {
          .order-details-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .order-card__header {
            flex-direction: column;
            gap: var(--space-4);
            align-items: stretch;
          }

          .order-status {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .order-items-summary {
            flex-direction: column;
            gap: var(--space-3);
            align-items: stretch;
          }

          .order-books {
            justify-content: center;
          }

          .status-filters {
            flex-direction: column;
          }

          .filter-btn {
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .order-meta {
            flex-direction: column;
            gap: var(--space-2);
          }

          .ordered-item {
            flex-direction: column;
            text-align: center;
          }

          .ordered-item__image {
            align-self: center;
          }

          .ordered-item__meta {
            justify-content: center;
            gap: var(--space-4);
          }
        }
      `}</style>
        </div>
    )
}