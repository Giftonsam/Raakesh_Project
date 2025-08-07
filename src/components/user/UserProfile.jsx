import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useCartContext } from '../../context/CartContext'
import {
    User,
    Edit,
    Save,
    X,
    Mail,
    Phone,
    MapPin,
    Package,
    AlertCircle,
    CheckCircle
} from 'lucide-react'

export default function UserProfile() {
    const { user, updateProfile } = useAuth()
    const { orders } = useCartContext()

    const [isEditing, setIsEditing] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [updateMessage, setUpdateMessage] = useState('')
    const [formData, setFormData] = useState({
        firstname: user?.firstname || '',
        lastname: user?.lastname || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || ''
    })

    const userOrders = orders.filter(order => order.userId === user?.id)
    const recentOrders = userOrders.slice(0, 3)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleEdit = () => {
        setIsEditing(true)
        setUpdateMessage('')
    }

    const handleCancel = () => {
        setIsEditing(false)
        setFormData({
            firstname: user?.firstname || '',
            lastname: user?.lastname || '',
            email: user?.email || '',
            phone: user?.phone || '',
            address: user?.address || ''
        })
        setUpdateMessage('')
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setIsUpdating(true)

        const result = await updateProfile(formData)

        if (result.success) {
            setIsEditing(false)
            setUpdateMessage('Profile updated successfully!')
            setTimeout(() => setUpdateMessage(''), 3000)
        }

        setIsUpdating(false)
    }

    const getOrderStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning'
            case 'processing': return 'info'
            case 'shipped': return 'primary'
            case 'delivered': return 'success'
            case 'cancelled': return 'danger'
            default: return 'primary'
        }
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page__header">
                    <h1 className="page__title">My Profile</h1>
                    <p className="page__subtitle">Manage your account information</p>
                </div>

                {updateMessage && (
                    <div className="alert alert--success">
                        <CheckCircle size={20} />
                        {updateMessage}
                    </div>
                )}

                <div className="profile-layout">
                    {/* Profile Information */}
                    <div className="profile-section">
                        <div className="card">
                            <div className="card__header">
                                <h2 className="section-title">Personal Information</h2>
                                {!isEditing ? (
                                    <button onClick={handleEdit} className="btn btn--outline btn--sm">
                                        <Edit size={16} />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="edit-actions">
                                        <button
                                            onClick={handleCancel}
                                            className="btn btn--outline btn--sm"
                                            disabled={isUpdating}
                                        >
                                            <X size={16} />
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="card__body">
                                {!isEditing ? (
                                    <div className="profile-info">
                                        <div className="profile-avatar">
                                            <User size={48} />
                                        </div>
                                        <div className="profile-details">
                                            <h3 className="profile-name">
                                                {user?.firstname} {user?.lastname}
                                            </h3>
                                            <div className="profile-contact">
                                                <div className="contact-item">
                                                    <Mail size={16} />
                                                    <span>{user?.email}</span>
                                                </div>
                                                <div className="contact-item">
                                                    <Phone size={16} />
                                                    <span>{user?.phone}</span>
                                                </div>
                                                <div className="contact-item">
                                                    <MapPin size={16} />
                                                    <span>{user?.address}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSave} className="profile-form">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="firstname" className="form-label">First Name</label>
                                                <input
                                                    type="text"
                                                    id="firstname"
                                                    name="firstname"
                                                    value={formData.firstname}
                                                    onChange={handleChange}
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="lastname" className="form-label">Last Name</label>
                                                <input
                                                    type="text"
                                                    id="lastname"
                                                    name="lastname"
                                                    value={formData.lastname}
                                                    onChange={handleChange}
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="form-input"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="phone" className="form-label">Phone</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="form-input"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="address" className="form-label">Address</label>
                                            <textarea
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="form-input"
                                                rows="3"
                                                required
                                            />
                                        </div>

                                        <div className="form-actions">
                                            <button
                                                type="submit"
                                                disabled={isUpdating}
                                                className="btn btn--primary"
                                            >
                                                {isUpdating ? (
                                                    <>
                                                        <div className="spinner spinner--sm"></div>
                                                        Updating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save size={16} />
                                                        Save Changes
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order History Summary */}
                    <div className="profile-section">
                        <div className="card">
                            <div className="card__header">
                                <h2 className="section-title">Recent Orders</h2>
                                {userOrders.length > 3 && (
                                    <Link to="/orders" className="section-link">
                                        View All Orders
                                    </Link>
                                )}
                            </div>

                            <div className="card__body">
                                {recentOrders.length > 0 ? (
                                    <div className="orders-list">
                                        {recentOrders.map(order => (
                                            <div key={order.id} className="order-item">
                                                <div className="order-header">
                                                    <span className="order-id">Order #{order.id}</span>
                                                    <span className={`badge badge--${getOrderStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="order-details">
                                                    <span className="order-date">
                                                        {new Date(order.orderDate).toLocaleDateString()}
                                                    </span>
                                                    <span className="order-total">
                                                        ₹{order.totalAmount.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="order-items-count">
                                                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-orders">
                                        <Package size={32} />
                                        <p>No orders yet</p>
                                        <Link to="/books" className="btn btn--primary btn--sm">
                                            Start Shopping
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Account Statistics */}
                    <div className="profile-section">
                        <div className="card">
                            <div className="card__header">
                                <h2 className="section-title">Account Statistics</h2>
                            </div>
                            <div className="card__body">
                                <div className="stats-list">
                                    <div className="stat-item">
                                        <span className="stat-label">Total Orders:</span>
                                        <span className="stat-value">{userOrders.length}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Total Spent:</span>
                                        <span className="stat-value">
                                            ₹{userOrders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Member Since:</span>
                                        <span className="stat-value">
                                            {new Date().getFullYear() - 1} {/* Placeholder */}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .profile-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--space-8);
          align-items: start;
        }

        .profile-section {
          margin-bottom: var(--space-6);
        }

        .section-title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          margin: 0;
        }

        .section-link {
          color: var(--color-primary);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
        }

        .section-link:hover {
          color: var(--color-primary-dark);
          text-decoration: underline;
        }

        .edit-actions {
          display: flex;
          gap: var(--space-2);
        }

        .profile-info {
          display: flex;
          gap: var(--space-6);
          align-items: start;
        }

        .profile-avatar {
          background: var(--color-primary-light);
          color: var(--color-primary-dark);
          padding: var(--space-4);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-details {
          flex: 1;
        }

        .profile-name {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          margin-bottom: var(--space-4);
          color: var(--text-primary);
        }

        .profile-contact {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          color: var(--text-secondary);
        }

        .profile-form {
          max-width: 500px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        .form-actions {
          margin-top: var(--space-6);
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .order-item {
          padding: var(--space-4);
          border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-lg);
          transition: all var(--transition-fast);
        }

        .order-item:hover {
          background: var(--bg-secondary);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-2);
        }

        .order-id {
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
        }

        .order-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-1);
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }

        .order-total {
          font-weight: var(--font-weight-semibold);
          color: var(--color-secondary);
        }

        .order-items-count {
          font-size: var(--font-size-xs);
          color: var(--text-muted);
        }

        .no-orders {
          text-align: center;
          padding: var(--space-8);
          color: var(--text-muted);
        }

        .no-orders p {
          margin: var(--space-4) 0 var(--space-6);
        }

        .stats-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-3) 0;
          border-bottom: 1px solid var(--color-gray-200);
        }

        .stat-item:last-child {
          border-bottom: none;
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .stat-value {
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
        }

        @media (max-width: 1024px) {
          .profile-layout {
            grid-template-columns: 1fr;
            gap: var(--space-6);
          }
        }

        @media (max-width: 768px) {
          .profile-info {
            flex-direction: column;
            text-align: center;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .order-header,
          .order-details {
            flex-direction: column;
            gap: var(--space-2);
            align-items: start;
          }
        }

        @media (max-width: 480px) {
          .profile-info {
            gap: var(--space-4);
          }

          .contact-item {
            flex-direction: column;
            gap: var(--space-2);
            text-align: center;
          }
        }
      `}</style>
        </div>
    )
}