// src/components/user/ShoppingCart.jsx
import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartContext } from '../../context/CartContext'
import { useBookContext } from '../../context/BookContext'
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  ArrowLeft,
  CheckCircle,
  Package,
  AlertTriangle,
  Eye,
  Heart
} from 'lucide-react'

export default function ShoppingCart() {
  const {
    items,
    updateCartItem,
    removeFromCart,
    clearCart,
    createOrder,
    isLoading
  } = useCartContext()

  const { getBookById } = useBookContext()
  const navigate = useNavigate()

  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderId, setOrderId] = useState(null)

  // Fixed: Prevent crash when cart is empty or items is undefined
  const cartItemsWithBooks = useMemo(() => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return []
    }

    return items.map(item => {
      const book = getBookById(item.bookId)
      if (!book) {
        console.warn(`Book with id ${item.bookId} not found`)
        return null
      }
      return {
        ...item,
        book
      }
    }).filter(Boolean) // Remove null entries
  }, [items, getBookById])

  // Fixed: Safe cart total calculation
  const cartTotal = useMemo(() => {
    if (!cartItemsWithBooks || cartItemsWithBooks.length === 0) {
      return 0
    }
    return cartItemsWithBooks.reduce((total, item) => {
      return total + (item.book.price * item.quantity)
    }, 0)
  }, [cartItemsWithBooks])

  const tax = Math.round(cartTotal * 0.18)
  const finalTotal = cartTotal + tax

  const handleQuantityChange = async (bookId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(bookId)
    } else {
      await updateCartItem(bookId, newQuantity)
    }
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)

    try {
      const orderData = {
        items: cartItemsWithBooks.map(item => ({
          bookId: item.bookId,
          quantity: item.quantity,
          price: item.book.price
        })),
        totalAmount: finalTotal,
        shippingAddress: null,
        paymentMethod: 'card'
      }

      const result = await createOrder(orderData)

      if (result.success) {
        setOrderId(result.orderId)
        setOrderSuccess(true)
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsCheckingOut(false)
    }
  }

  // Success page component
  if (orderSuccess) {
    return (
      <div className="page">
        <div className="container">
          <div className="success-page">
            <div className="success-animation">
              <div className="success-checkmark">
                <CheckCircle size={80} />
              </div>
            </div>
            <h1 className="success-title">🎉 Order Placed Successfully!</h1>
            <div className="order-summary-card">
              <h3>Order #{orderId}</h3>
              <p>Total Amount: ₹{finalTotal.toLocaleString()}</p>
              <p>Payment Method: Credit Card</p>
              <p className="success-message">
                Thank you for your purchase! Your order has been placed and will be processed shortly.
                You'll receive an email confirmation soon.
              </p>
            </div>

            <div className="success-actions">
              <Link to="/orders" className="btn btn--primary btn--lg">
                <Package size={20} />
                Track Order
              </Link>
              <Link to="/books" className="btn btn--outline btn--lg">
                <ArrowLeft size={20} />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        <style jsx>{`
          .success-page {
            text-align: center;
            padding: var(--space-16);
            max-width: 600px;
            margin: 0 auto;
          }

          .success-animation {
            margin-bottom: var(--space-8);
            animation: bounceIn 0.8s ease-out;
          }

          .success-checkmark {
            color: var(--color-success);
            display: inline-block;
            background: rgba(16, 185, 129, 0.1);
            border-radius: 50%;
            padding: var(--space-6);
          }

          .success-title {
            font-size: var(--font-size-3xl);
            font-weight: var(--font-weight-bold);
            margin-bottom: var(--space-6);
            color: var(--text-primary);
          }

          .order-summary-card {
            background: var(--bg-primary);
            border: 2px solid var(--color-success);
            border-radius: var(--radius-xl);
            padding: var(--space-6);
            margin-bottom: var(--space-8);
            box-shadow: var(--shadow-lg);
          }

          .success-actions {
            display: flex;
            gap: var(--space-4);
            justify-content: center;
            flex-wrap: wrap;
          }

          @keyframes bounceIn {
            0% { opacity: 0; transform: scale(0.3); }
            50% { opacity: 1; transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    )
  }

  // Enhanced Empty cart component
  if (!cartItemsWithBooks || cartItemsWithBooks.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className="page__header">
            <div className="cart-header__content">
              <div className="cart-header__info">
                <ShoppingBag className="cart-header__icon" size={32} />
                <div>
                  <h1 className="page__title">Shopping Cart</h1>
                  <p className="page__subtitle">0 items in your cart</p>
                </div>
              </div>
            </div>
          </div>

          <div className="cart-empty">
            <div className="empty-state">
              <div className="empty-state__background">
                <ShoppingBag className="empty-state__icon" size={80} />
              </div>
              <div className="empty-state__content">
                <h2 className="empty-state__title">Your cart feels lonely!</h2>
                <p className="empty-state__description">
                  Add some amazing books to make it happy. Browse our collection and discover your next great read.
                </p>
                <div className="empty-state__suggestions">
                  <h3 className="suggestions__title">Why not try:</h3>
                  <div className="suggestions__grid">
                    <Link to="/books" className="suggestion-card">
                      <Package className="suggestion-card__icon" size={24} />
                      <span className="suggestion-card__text">Browse All Books</span>
                    </Link>
                    <Link to="/categories" className="suggestion-card">
                      <Eye className="suggestion-card__icon" size={24} />
                      <span className="suggestion-card__text">Explore Categories</span>
                    </Link>
                    <Link to="/wishlist" className="suggestion-card">
                      <Heart className="suggestion-card__icon" size={24} />
                      <span className="suggestion-card__text">Check Wishlist</span>
                    </Link>
                  </div>
                </div>
                <Link to="/books" className="btn btn--primary btn--lg btn--cta">
                  <ArrowLeft size={20} />
                  Start Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          /* Header styling */
          .cart-header__content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--space-4, 1.5rem);
            flex-wrap: wrap;
          }

          .cart-header__info {
            display: flex;
            align-items: center;
            gap: var(--space-4, 1.5rem);
          }

          .cart-header__icon {
            color: #3b82f6;
            flex-shrink: 0;
          }

          /* Button styles */
          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            border: 1px solid transparent;
            border-radius: 0.75rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            background: none;
            white-space: nowrap;
            position: relative;
            overflow: hidden;
          }

          .btn--primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
          }

          .btn--primary:hover:not(:disabled) {
            background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
          }

          .btn--outline {
            color: var(--text-primary, #1f2937);
            border: 1px solid var(--color-gray-300, #d1d5db);
            background: transparent;
          }

          .btn--outline:hover:not(:disabled) {
            background: var(--color-primary, #3b82f6);
            color: white;
            border-color: var(--color-primary, #3b82f6);
          }

          .btn--lg {
            padding: 1.25rem 2.5rem;
            font-size: 1rem;
            border-radius: 1rem;
          }

          .btn--cta {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
            font-weight: 600;
          }

          .btn--cta:hover:not(:disabled) {
            background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(79, 70, 229, 0.5);
          }

          .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            pointer-events: none;
            transform: none;
          }

          /* Enhanced Empty state */
          .cart-empty {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 60vh;
            padding: var(--space-8, 2rem);
          }

          .empty-state {
            text-align: center;
            max-width: 600px;
            width: 100%;
          }

          .empty-state__background {
            position: relative;
            margin-bottom: var(--space-8, 2rem);
            display: flex;
            justify-content: center;
          }

          .empty-state__icon {
            color: var(--color-gray-300, #d1d5db);
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
            animation: float 3s ease-in-out infinite;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          .empty-state__content {
            margin-bottom: var(--space-8, 2rem);
          }

          .empty-state__title {
            font-size: 2.25rem;
            font-weight: 700;
            color: var(--text-primary, #1f2937);
            margin: 0 0 var(--space-4, 1rem);
            line-height: 1.2;
            letter-spacing: -0.025em;
          }

          .empty-state__description {
            font-size: 1.125rem;
            color: var(--text-muted, #6b7280);
            margin: 0 0 var(--space-8, 2rem);
            line-height: 1.6;
            max-width: 480px;
            margin-left: auto;
            margin-right: auto;
          }

          /* Suggestions section */
          .empty-state__suggestions {
            margin-bottom: var(--space-10, 2.5rem);
          }

          .suggestions__title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-primary, #1f2937);
            margin: 0 0 var(--space-6, 1.5rem);
          }

          .suggestions__grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: var(--space-4, 1rem);
            margin-bottom: var(--space-8, 2rem);
          }

          .suggestion-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--space-3, 0.75rem);
            padding: var(--space-6, 1.5rem);
            background: var(--bg-secondary, #f8fafc);
            border: 2px solid var(--color-gray-200, #e5e7eb);
            border-radius: 1rem;
            text-decoration: none;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }

          .suggestion-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .suggestion-card:hover::before {
            opacity: 1;
          }

          .suggestion-card:hover {
            border-color: var(--color-primary, #3b82f6);
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          }

          .suggestion-card__icon {
            color: var(--color-primary, #3b82f6);
            position: relative;
            z-index: 1;
            transition: transform 0.3s ease;
          }

          .suggestion-card:hover .suggestion-card__icon {
            transform: scale(1.1);
          }

          .suggestion-card__text {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text-primary, #1f2937);
            position: relative;
            z-index: 1;
          }

          /* Dark mode styles */
          :global([data-theme="dark"]) .cart-header__icon {
            color: #60a5fa;
          }

          :global([data-theme="dark"]) .btn--outline {
            color: rgba(255, 255, 255, 0.9);
            border-color: rgba(255, 255, 255, 0.2);
          }

          :global([data-theme="dark"]) .btn--outline:hover:not(:disabled) {
            background: rgba(102, 126, 234, 0.8);
            color: white;
            border-color: rgba(102, 126, 234, 0.8);
          }

          :global([data-theme="dark"]) .empty-state__icon {
            color: rgba(255, 255, 255, 0.2);
          }

          :global([data-theme="dark"]) .empty-state__title {
            color: rgba(255, 255, 255, 0.95);
          }

          :global([data-theme="dark"]) .empty-state__description {
            color: rgba(255, 255, 255, 0.7);
          }

          :global([data-theme="dark"]) .suggestions__title {
            color: rgba(255, 255, 255, 0.9);
          }

          :global([data-theme="dark"]) .suggestion-card {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.1);
          }

          :global([data-theme="dark"]) .suggestion-card:hover {
            border-color: rgba(102, 126, 234, 0.5);
            background: rgba(255, 255, 255, 0.08);
          }

          :global([data-theme="dark"]) .suggestion-card__icon {
            color: rgba(102, 126, 234, 0.8);
          }

          :global([data-theme="dark"]) .suggestion-card__text {
            color: rgba(255, 255, 255, 0.9);
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .cart-header__content {
              flex-direction: column;
              align-items: flex-start;
              gap: var(--space-4, 1rem);
            }

            .empty-state {
              padding: 0 var(--space-4, 1rem);
            }

            .empty-state__title {
              font-size: 1.875rem;
            }

            .suggestions__grid {
              grid-template-columns: 1fr;
              gap: var(--space-3, 0.75rem);
            }

            .suggestion-card {
              flex-direction: row;
              text-align: left;
              padding: var(--space-4, 1rem);
            }
          }

          @media (max-width: 480px) {
            .empty-state__title {
              font-size: 1.5rem;
            }

            .empty-state__description {
              font-size: 1rem;
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page__header">
          <div className="cart-header__content">
            <div className="cart-header__info">
              <ShoppingBag className="cart-header__icon" size={32} />
              <div>
                <h1 className="page__title">Shopping Cart</h1>
                <p className="page__subtitle">
                  {cartItemsWithBooks.length} {cartItemsWithBooks.length === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            <div className="cart-header">
              <h2>Your Items</h2>
              <button
                onClick={clearCart}
                className="btn btn--outline btn--sm"
                disabled={isLoading}
              >
                <Trash2 size={16} />
                Clear All
              </button>
            </div>

            {cartItemsWithBooks.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item__image">
                  <img
                    src={item.book.image}
                    alt={item.book.title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/120x160/3b82f6/ffffff?text=Book'
                    }}
                  />
                </div>

                <div className="cart-item__details">
                  <div className="item-header">
                    <h3 className="cart-item__title">
                      <Link to={`/books/${item.book.id}`}>
                        {item.book.title}
                      </Link>
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.bookId)}
                      className="remove-btn"
                      title="Remove from cart"
                      disabled={isLoading}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <p className="cart-item__author">by {item.book.author}</p>
                  <span className="badge badge--primary">{item.book.category}</span>

                  <div className="item-controls">
                    <div className="quantity-section">
                      <label className="quantity-label">Quantity:</label>
                      <div className="quantity-controls">
                        <button
                          onClick={() => handleQuantityChange(item.bookId, item.quantity - 1)}
                          className="quantity-btn"
                          disabled={isLoading || item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.bookId, item.quantity + 1)}
                          className="quantity-btn"
                          disabled={isLoading || item.quantity >= item.book.quantity}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      {item.quantity >= item.book.quantity && (
                        <p className="stock-warning">
                          <AlertTriangle size={14} />
                          Max available: {item.book.quantity}
                        </p>
                      )}
                    </div>

                    <div className="price-section">
                      <div className="unit-price">₹{item.book.price.toLocaleString()} each</div>
                      <div className="total-price">₹{(item.book.price * item.quantity).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="cart-actions">
              <Link to="/books" className="btn btn--secondary">
                <ArrowLeft size={18} />
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="cart-summary">
            <div className="cart-summary__card">
              <h3 className="cart-summary__title">Order Summary</h3>

              <div className="cart-summary__details">
                <div className="summary-row">
                  <span>Subtotal ({cartItemsWithBooks.length} items):</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span className="text-success">Free 🚚</span>
                </div>
                <div className="summary-row">
                  <span>Tax (18%):</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <hr className="summary-divider" />
                <div className="summary-row summary-total">
                  <span>Total:</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="promo-section">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="promo-input"
                />
                <button className="btn btn--outline btn--sm">Apply</button>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || cartItemsWithBooks.length === 0}
                className="btn btn--primary checkout-btn"
              >
                {isCheckingOut ? (
                  <>
                    <div className="spinner spinner--sm"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Secure Checkout
                  </>
                )}
              </button>

              <div className="checkout-features">
                <div className="feature-item">
                  <span>🔒</span>
                  <span>Secure SSL Encryption</span>
                </div>
                <div className="feature-item">
                  <span>📦</span>
                  <span>Free shipping on all orders</span>
                </div>
                <div className="feature-item">
                  <span>🔄</span>
                  <span>Easy returns within 30 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Header styling for cart with items */
        .cart-header__content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4, 1.5rem);
          flex-wrap: wrap;
        }

        .cart-header__info {
          display: flex;
          align-items: center;
          gap: var(--space-4, 1.5rem);
        }

        .cart-header__icon {
          color: #3b82f6;
          flex-shrink: 0;
        }

        /* Button styles */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          border: 1px solid transparent;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          background: none;
          white-space: nowrap;
          position: relative;
          overflow: hidden;
        }

        .btn--primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
        }

        .btn--primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .btn--secondary {
          background: var(--bg-secondary, #f8fafc);
          color: var(--text-primary, #1f2937);
          border: 1px solid var(--color-gray-200, #e5e7eb);
        }

        .btn--secondary:hover:not(:disabled) {
          background: var(--bg-primary, #ffffff);
          border-color: var(--color-primary, #3b82f6);
          color: var(--color-primary, #3b82f6);
        }

        .btn--outline {
          color: var(--text-primary, #1f2937);
          border: 1px solid var(--color-gray-300, #d1d5db);
          background: transparent;
        }

        .btn--outline:hover:not(:disabled) {
          background: var(--color-primary, #3b82f6);
          color: white;
          border-color: var(--color-primary, #3b82f6);
        }

        .btn--sm {
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          height: auto;
          min-height: 32px;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          pointer-events: none;
          transform: none;
        }

        /* Cart layout */
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: var(--space-8, 2rem);
          align-items: start;
        }

        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-6, 1.5rem);
          padding-bottom: var(--space-4, 1rem);
          border-bottom: 2px solid var(--color-gray-200, #e5e7eb);
        }

        .cart-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
        }

        /* Cart items */
        .cart-item {
          background: var(--bg-primary, #ffffff);
          border: 2px solid var(--color-gray-200, #e5e7eb);
          border-radius: 16px;
          padding: var(--space-6, 1.5rem);
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: var(--space-6, 1.5rem);
          transition: all 0.3s ease;
          margin-bottom: var(--space-4, 1rem);
        }

        .cart-item:hover {
          border-color: var(--color-primary, #3b82f6);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .cart-item__image {
          width: 120px;
          height: 160px;
          border-radius: 8px;
          overflow: hidden;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .cart-item__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .cart-item:hover .cart-item__image img {
          transform: scale(1.05);
        }

        .cart-item__details {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-2, 0.5rem);
        }

        .cart-item__title {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0;
          flex: 1;
          margin-right: var(--space-3, 0.75rem);
        }

        .cart-item__title a {
          color: var(--text-primary, #1f2937);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .cart-item__title a:hover {
          color: var(--color-primary, #3b82f6);
        }

        .cart-item__author {
          color: var(--text-secondary, #6b7280);
          margin: 0 0 var(--space-3, 0.75rem);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: 50px;
          margin-bottom: var(--space-4, 1rem);
        }

        .badge--primary {
          background: var(--color-primary-light, rgba(59, 130, 246, 0.1));
          color: var(--color-primary, #3b82f6);
        }

        /* Item controls */
        .item-controls {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: var(--space-6, 1.5rem);
          align-items: center;
          margin-top: var(--space-4, 1rem);
          padding-top: var(--space-4, 1rem);
          border-top: 1px solid var(--color-gray-200, #e5e7eb);
        }

        .quantity-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-2, 0.5rem);
        }

        .quantity-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary, #6b7280);
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          border: 2px solid var(--color-gray-300, #d1d5db);
          border-radius: 8px;
          overflow: hidden;
          width: fit-content;
        }

        .quantity-btn {
          background: var(--bg-secondary, #f8fafc);
          border: none;
          padding: var(--space-3, 0.75rem);
          color: var(--text-primary, #1f2937);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .quantity-btn:hover:not(:disabled) {
          background: var(--color-primary, #3b82f6);
          color: white;
        }

        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-value {
          padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
          background: var(--bg-primary, #ffffff);
          border-left: 2px solid var(--color-gray-300, #d1d5db);
          border-right: 2px solid var(--color-gray-300, #d1d5db);
          font-weight: 600;
          min-width: 50px;
          text-align: center;
          color: var(--text-primary, #1f2937);
        }

        .stock-warning {
          font-size: 0.75rem;
          color: var(--color-danger, #ef4444);
          margin-top: var(--space-1, 0.25rem);
          display: flex;
          align-items: center;
          gap: var(--space-1, 0.25rem);
        }

        .price-section {
          text-align: right;
        }

        .unit-price {
          font-size: 0.875rem;
          color: var(--text-secondary, #6b7280);
          margin-bottom: var(--space-1, 0.25rem);
        }

        .total-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-success, #10b981);
        }

        .remove-btn {
          background: none;
          border: 2px solid var(--color-danger, #ef4444);
          color: var(--color-danger, #ef4444);
          padding: var(--space-2, 0.5rem);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .remove-btn:hover:not(:disabled) {
          background: var(--color-danger, #ef4444);
          color: white;
          transform: scale(1.05);
        }

        .remove-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Cart actions */
        .cart-actions {
          margin-top: var(--space-6, 1.5rem);
          padding-top: var(--space-6, 1.5rem);
          border-top: 2px solid var(--color-gray-200, #e5e7eb);
        }

        /* Cart summary */
        .cart-summary__card {
          background: var(--bg-primary, #ffffff);
          border: 2px solid var(--color-gray-200, #e5e7eb);
          border-radius: 16px;
          padding: var(--space-6, 1.5rem);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: calc(80px + var(--space-6, 1.5rem));
        }

        .cart-summary__title {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 var(--space-6, 1.5rem);
          color: var(--text-primary, #1f2937);
        }

        .cart-summary__details {
          margin-bottom: var(--space-6, 1.5rem);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-3, 0.75rem) 0;
          color: var(--text-primary, #1f2937);
        }

        .summary-row:not(:last-child) {
          border-bottom: 1px solid var(--color-gray-100, #f3f4f6);
        }

        .summary-total {
          font-size: 1.125rem;
          font-weight: 700;
          background: var(--bg-secondary, #f8fafc);
          padding: var(--space-4, 1rem);
          border-radius: 8px;
          margin-top: var(--space-4, 1rem);
          border: none;
        }

        .summary-divider {
          border: none;
          border-top: 2px solid var(--color-gray-200, #e5e7eb);
          margin: var(--space-4, 1rem) 0;
        }

        .text-success {
          color: var(--color-success, #10b981);
          font-weight: 500;
        }

        /* Promo section */
        .promo-section {
          display: flex;
          gap: var(--space-2, 0.5rem);
          margin-bottom: var(--space-6, 1.5rem);
        }

        .promo-input {
          flex: 1;
          padding: var(--space-3, 0.75rem);
          border: 2px solid var(--color-gray-300, #d1d5db);
          border-radius: 8px;
          font-size: 0.875rem;
          transition: border-color 0.3s ease;
          background: var(--bg-primary, #ffffff);
          color: var(--text-primary, #1f2937);
        }

        .promo-input:focus {
          outline: none;
          border-color: var(--color-primary, #3b82f6);
        }

        .promo-input::placeholder {
          color: var(--text-muted, #9ca3af);
        }

        /* Checkout button */
        .checkout-btn {
          width: 100%;
          padding: var(--space-4, 1rem);
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: var(--space-6, 1.5rem);
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;
          color: white;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
          transition: all 0.3s ease;
        }

        .checkout-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        .checkout-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Checkout features */
        .checkout-features {
          display: flex;
          flex-direction: column;
          gap: var(--space-3, 0.75rem);
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: var(--space-3, 0.75rem);
          font-size: 0.875rem;
          color: var(--text-secondary, #6b7280);
        }

        /* Spinner */
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner--sm {
          width: 14px;
          height: 14px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Dark mode styles for cart content */
        :global([data-theme="dark"]) .cart-header__icon {
          color: #60a5fa;
        }

        :global([data-theme="dark"]) .cart-header {
          border-color: rgba(255, 255, 255, 0.1);
        }

        :global([data-theme="dark"]) .cart-header h2 {
          color: rgba(255, 255, 255, 0.95);
        }

        :global([data-theme="dark"]) .cart-item {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        :global([data-theme="dark"]) .cart-item:hover {
          border-color: rgba(102, 126, 234, 0.5);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        :global([data-theme="dark"]) .cart-item__image {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 100%);
        }

        :global([data-theme="dark"]) .cart-item__title a {
          color: rgba(255, 255, 255, 0.95);
        }

        :global([data-theme="dark"]) .cart-item__title a:hover {
          color: rgba(102, 126, 234, 0.8);
        }

        :global([data-theme="dark"]) .cart-item__author {
          color: rgba(255, 255, 255, 0.7);
        }

        :global([data-theme="dark"]) .badge--primary {
          background: rgba(102, 126, 234, 0.2);
          color: rgba(102, 126, 234, 0.9);
        }

        :global([data-theme="dark"]) .item-controls {
          border-color: rgba(255, 255, 255, 0.1);
        }

        :global([data-theme="dark"]) .quantity-label {
          color: rgba(255, 255, 255, 0.7);
        }

        :global([data-theme="dark"]) .quantity-controls {
          border-color: rgba(255, 255, 255, 0.2);
        }

        :global([data-theme="dark"]) .quantity-btn {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
        }

        :global([data-theme="dark"]) .quantity-btn:hover:not(:disabled) {
          background: rgba(102, 126, 234, 0.8);
          color: white;
        }

        :global([data-theme="dark"]) .quantity-value {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.9);
        }

        :global([data-theme="dark"]) .unit-price {
          color: rgba(255, 255, 255, 0.7);
        }

        :global([data-theme="dark"]) .total-price {
          color: #10b981;
        }

        :global([data-theme="dark"]) .remove-btn {
          border-color: #ef4444;
          color: #ef4444;
        }

        :global([data-theme="dark"]) .remove-btn:hover:not(:disabled) {
          background: #ef4444;
          color: white;
        }

        :global([data-theme="dark"]) .btn--secondary {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
          border-color: rgba(255, 255, 255, 0.2);
        }

        :global([data-theme="dark"]) .btn--secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(102, 126, 234, 0.5);
          color: white;
        }

        :global([data-theme="dark"]) .btn--outline {
          color: rgba(255, 255, 255, 0.9);
          border-color: rgba(255, 255, 255, 0.2);
        }

        :global([data-theme="dark"]) .btn--outline:hover:not(:disabled) {
          background: rgba(102, 126, 234, 0.8);
          color: white;
          border-color: rgba(102, 126, 234, 0.8);
        }

        :global([data-theme="dark"]) .cart-actions {
          border-color: rgba(255, 255, 255, 0.1);
        }

        :global([data-theme="dark"]) .cart-summary__card {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        :global([data-theme="dark"]) .cart-summary__title {
          color: rgba(255, 255, 255, 0.95);
        }

        :global([data-theme="dark"]) .summary-row {
          color: rgba(255, 255, 255, 0.9);
        }

        :global([data-theme="dark"]) .summary-row:not(:last-child) {
          border-color: rgba(255, 255, 255, 0.1);
        }

        :global([data-theme="dark"]) .summary-total {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.95);
        }

        :global([data-theme="dark"]) .summary-divider {
          border-color: rgba(255, 255, 255, 0.1);
        }

        :global([data-theme="dark"]) .promo-input {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.9);
        }

        :global([data-theme="dark"]) .promo-input:focus {
          border-color: rgba(102, 126, 234, 0.5);
        }

        :global([data-theme="dark"]) .promo-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        :global([data-theme="dark"]) .feature-item {
          color: rgba(255, 255, 255, 0.7);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .cart-layout {
            grid-template-columns: 1fr;
            gap: var(--space-6, 1.5rem);
          }
          
          .cart-summary__card {
            position: static;
            order: -1;
          }
        }

        @media (max-width: 768px) {
          .cart-header__content {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-4, 1rem);
          }

          .cart-item {
            grid-template-columns: 1fr;
            text-align: center;
            gap: var(--space-4, 1rem);
          }

          .cart-item__image {
            width: 120px;
            height: 160px;
            justify-self: center;
          }

          .item-controls {
            grid-template-columns: 1fr;
            text-align: center;
            gap: var(--space-4, 1rem);
          }

          .item-header {
            flex-direction: column;
            align-items: center;
            gap: var(--space-2, 0.5rem);
          }

          .remove-btn {
            align-self: center;
          }

          .quantity-section {
            align-items: center;
          }

          .price-section {
            text-align: center;
          }

          .promo-section {
            flex-direction: column;
          }

          .checkout-btn {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .cart-item {
            padding: var(--space-4, 1rem);
          }

          .quantity-controls {
            width: 100%;
            justify-content: center;
          }

          .feature-item {
            font-size: 0.75rem;
          }

          .cart-summary__card {
            padding: var(--space-4, 1rem);
          }
        }
      `}</style>
    </div>
  )
}