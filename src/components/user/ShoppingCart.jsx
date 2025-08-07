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
  AlertTriangle
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

  // Empty cart component - Fixed UI
  if (!cartItemsWithBooks || cartItemsWithBooks.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className="page__header">
            <h1 className="page__title">Shopping Cart</h1>
          </div>

          <div className="empty-cart">
            <div className="empty-cart-animation">
              <ShoppingBag size={120} />
            </div>
            <h2>Your cart feels lonely!</h2>
            <p>Add some amazing books to make it happy. Browse our collection and discover your next great read.</p>

            <div className="empty-cart-suggestions">
              <h3>Why not try:</h3>
              <div className="suggestions-grid">
                <Link to="/books" className="suggestion-card">
                  <span>📚</span>
                  <span>Browse All Books</span>
                </Link>
                <Link to="/categories" className="suggestion-card">
                  <span>🏷️</span>
                  <span>Explore Categories</span>
                </Link>
                <Link to="/wishlist" className="suggestion-card">
                  <span>❤️</span>
                  <span>Check Wishlist</span>
                </Link>
              </div>
            </div>

            <Link to="/books" className="btn btn--primary btn--lg">
              <ArrowLeft size={20} />
              Start Shopping
            </Link>
          </div>
        </div>

        <style>{`
                    .empty-cart {
                        text-align: center;
                        padding: var(--space-16);
                        color: var(--text-muted);
                    }

                    .empty-cart-animation {
                        opacity: 0.3;
                        animation: float 3s ease-in-out infinite;
                        margin-bottom: var(--space-8);
                    }

                    .empty-cart h2 {
                        font-size: var(--font-size-2xl);
                        margin: var(--space-6) 0 var(--space-4);
                        color: var(--text-secondary);
                    }

                    .suggestions-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                        gap: var(--space-4);
                        max-width: 500px;
                        margin: 0 auto;
                    }

                    .suggestion-card {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: var(--space-2);
                        padding: var(--space-4);
                        background: var(--bg-primary);
                        border: 2px solid var(--color-gray-200);
                        border-radius: var(--radius-xl);
                        text-decoration: none;
                        color: var(--text-primary);
                        transition: all var(--transition-base);
                    }

                    .suggestion-card:hover {
                        border-color: var(--color-primary);
                        transform: translateY(-4px);
                        box-shadow: var(--shadow-lg);
                        text-decoration: none;
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
          <h1 className="page__title">Shopping Cart</h1>
          <p className="page__subtitle">
            {cartItemsWithBooks.length} {cartItemsWithBooks.length === 1 ? 'item' : 'items'} in your cart
          </p>
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

      <style jsx>{`
                .cart-layout {
                    display: grid;
                    grid-template-columns: 1fr 400px;
                    gap: var(--space-8);
                    align-items: start;
                }

                .cart-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--space-6);
                    padding-bottom: var(--space-4);
                    border-bottom: 2px solid var(--color-gray-200);
                }

                .cart-item {
                    background: var(--bg-primary);
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-xl);
                    padding: var(--space-6);
                    display: grid;
                    grid-template-columns: 120px 1fr;
                    gap: var(--space-6);
                    transition: all var(--transition-base);
                    margin-bottom: var(--space-4);
                }

                .cart-item:hover {
                    border-color: var(--color-primary);
                    box-shadow: var(--shadow-lg);
                }

                .cart-item__image img {
                    width: 100%;
                    height: 160px;
                    object-fit: cover;
                    border-radius: var(--radius-lg);
                }

                .item-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: start;
                    margin-bottom: var(--space-2);
                }

                .cart-item__title {
                    font-size: var(--font-size-lg);
                    font-weight: var(--font-weight-semibold);
                    margin: 0;
                    flex: 1;
                }

                .cart-item__author {
                    color: var(--text-secondary);
                    margin-bottom: var(--space-3);
                    font-size: var(--font-size-sm);
                }

                .item-controls {
                    display: grid;
                    grid-template-columns: 1fr auto;
                    gap: var(--space-6);
                    align-items: center;
                    margin-top: var(--space-4);
                    padding-top: var(--space-4);
                    border-top: 1px solid var(--color-gray-200);
                }

                .quantity-controls {
                    display: flex;
                    align-items: center;
                    border: 2px solid var(--color-gray-300);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    width: fit-content;
                }

                .quantity-btn {
                    background: var(--bg-secondary);
                    border: none;
                    padding: var(--space-3);
                    color: var(--text-primary);
                    cursor: pointer;
                    transition: all var(--transition-fast);
                }

                .quantity-btn:hover:not(:disabled) {
                    background: var(--color-primary);
                    color: var(--text-white);
                }

                .quantity-value {
                    padding: var(--space-3) var(--space-4);
                    background: var(--bg-primary);
                    border-left: 2px solid var(--color-gray-300);
                    border-right: 2px solid var(--color-gray-300);
                    font-weight: var(--font-weight-semibold);
                    min-width: 50px;
                    text-align: center;
                }

                .stock-warning {
                    font-size: var(--font-size-xs);
                    color: var(--color-danger);
                    margin-top: var(--space-1);
                    display: flex;
                    align-items: center;
                    gap: var(--space-1);
                }

                .total-price {
                    font-size: var(--font-size-xl);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-secondary);
                }

                .remove-btn {
                    background: none;
                    border: 2px solid var(--color-danger);
                    color: var(--color-danger);
                    padding: var(--space-2);
                    border-radius: var(--radius-lg);
                    cursor: pointer;
                    transition: all var(--transition-fast);
                }

                .remove-btn:hover:not(:disabled) {
                    background: var(--color-danger);
                    color: var(--text-white);
                    transform: scale(1.05);
                }

                .cart-summary__card {
                    background: var(--bg-primary);
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-xl);
                    padding: var(--space-6);
                    box-shadow: var(--shadow-lg);
                    position: sticky;
                    top: calc(80px + var(--space-6));
                }

                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-3) 0;
                }

                .summary-total {
                    font-size: var(--font-size-lg);
                    font-weight: var(--font-weight-bold);
                    background: var(--bg-secondary);
                    padding: var(--space-4);
                    border-radius: var(--radius-lg);
                    margin-top: var(--space-4);
                }

                .promo-section {
                    display: flex;
                    gap: var(--space-2);
                    margin-bottom: var(--space-6);
                }

                .promo-input {
                    flex: 1;
                    padding: var(--space-3);
                    border: 2px solid var(--color-gray-300);
                    border-radius: var(--radius-lg);
                }

                .checkout-btn {
                    width: 100%;
                    padding: var(--space-4);
                    font-size: var(--font-size-lg);
                    margin-bottom: var(--space-6);
                }

                .checkout-features {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-3);
                }

                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    font-size: var(--font-size-sm);
                    color: var(--text-secondary);
                }

                @media (max-width: 1024px) {
                    .cart-layout {
                        grid-template-columns: 1fr;
                    }
                    
                    .cart-summary__card {
                        position: static;
                        order: -1;
                    }
                }

                @media (max-width: 768px) {
                    .cart-item {
                        grid-template-columns: 1fr;
                        text-align: center;
                    }

                    .item-controls {
                        grid-template-columns: 1fr;
                        text-align: center;
                    }
                }
            `}</style>
    </div>
  )
}