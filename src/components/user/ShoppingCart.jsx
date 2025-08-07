import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartContext } from '../../context/CartContext'
import { useBookContext } from '../../context/BookContext'
import {
    // ShoppingCart,
    Plus,
    Minus,
    Trash2,
    CreditCard,
    ArrowLeft,
    CheckCircle
} from 'lucide-react'

export default function ShoppingCart() {
    const {
        items,
        updateCartItem,
        removeFromCart,
        clearCart,
        createOrder,
        getCartTotal,
        isLoading
    } = useCartContext()

    const { getBookById } = useBookContext()
    const navigate = useNavigate()

    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const [orderSuccess, setOrderSuccess] = useState(false)
    const [orderId, setOrderId] = useState(null)

    // Get cart items with book details
    const cartItemsWithBooks = items.map(item => ({
        ...item,
        book: getBookById(item.bookId)
    })).filter(item => item.book) // Filter out items where book might be deleted

    const cartTotal = cartItemsWithBooks.reduce((total, item) => {
        return total + (item.book.price * item.quantity)
    }, 0)

    const handleQuantityChange = async (bookId, newQuantity) => {
        if (newQuantity <= 0) {
            await removeFromCart(bookId)
        } else {
            await updateCartItem(bookId, newQuantity)
        }
    }

    const handleCheckout = async () => {
        setIsCheckingOut(true)

        const orderData = {
            shippingAddress: null, // Will use user's default address
            paymentMethod: 'card'
        }

        const result = await createOrder(orderData)

        if (result.success) {
            setOrderId(result.orderId)
            setOrderSuccess(true)
        }

        setIsCheckingOut(false)
    }

    if (orderSuccess) {
        return (
            <div className="page">
                <div className="container">
                    <div className="success-page">
                        <div className="success-icon">
                            <CheckCircle size={64} />
                        </div>
                        <h1 className="success-title">Order Placed Successfully!</h1>
                        <p className="success-message">
                            Your order #{orderId} has been placed and will be processed shortly.
                        </p>

                        <div className="success-actions">
                            <Link to="/orders" className="btn btn--primary">
                                View Order History
                            </Link>
                            <Link to="/books" className="btn btn--outline">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>

                <style jsx>{`
          .success-page {
            text-align: center;
            padding: var(--space-16);
            max-width: 500px;
            margin: 0 auto;
          }

          .success-icon {
            color: var(--color-success);
            margin-bottom: var(--space-6);
          }

          .success-title {
            font-size: var(--font-size-3xl);
            font-weight: var(--font-weight-bold);
            margin-bottom: var(--space-4);
            color: var(--text-primary);
          }

          .success-message {
            color: var(--text-secondary);
            margin-bottom: var(--space-8);
            font-size: var(--font-size-lg);
          }

          .success-actions {
            display: flex;
            gap: var(--space-4);
            justify-content: center;
            flex-wrap: wrap;
          }
        `}</style>
            </div>
        )
    }

    if (cartItemsWithBooks.length === 0) {
        return (
            <div className="page">
                <div className="container">
                    <div className="page__header">
                        <h1 className="page__title">Shopping Cart</h1>
                    </div>

                    <div className="empty-cart">
                        <ShoppingCart size={64} />
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added any books to your cart yet.</p>
                        <Link to="/books" className="btn btn--primary">
                            <ArrowLeft size={18} />
                            Continue Shopping
                        </Link>
                    </div>
                </div>

                <style jsx>{`
          .empty-cart {
            text-align: center;
            padding: var(--space-16);
            color: var(--text-muted);
          }

          .empty-cart h2 {
            margin: var(--space-6) 0 var(--space-4);
            color: var(--text-secondary);
          }

          .empty-cart p {
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
                    <h1 className="page__title">Shopping Cart</h1>
                    <p className="page__subtitle">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
                </div>

                <div className="cart-layout">
                    <div className="cart-items">
                        {cartItemsWithBooks.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item__image">
                                    <img
                                        src={item.book.image}
                                        alt={item.book.title}
                                    />
                                </div>

                                <div className="cart-item__details">
                                    <h3 className="cart-item__title">
                                        <Link to={`/books/${item.book.id}`}>
                                            {item.book.title}
                                        </Link>
                                    </h3>
                                    <p className="cart-item__author">by {item.book.author}</p>
                                    <span className="badge badge--primary">{item.book.category}</span>

                                    <div className="cart-item__price">
                                        ₹{item.book.price.toLocaleString()} each
                                    </div>
                                </div>

                                <div className="cart-item__quantity">
                                    <label className="quantity-label">Quantity:</label>
                                    <div className="quantity-controls">
                                        <button
                                            onClick={() => handleQuantityChange(item.bookId, item.quantity - 1)}
                                            className="quantity-btn"
                                            disabled={isLoading}
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
                                        <p className="stock-warning">Max stock: {item.book.quantity}</p>
                                    )}
                                </div>

                                <div className="cart-item__total">
                                    <div className="item-total">
                                        ₹{(item.book.price * item.quantity).toLocaleString()}
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.bookId)}
                                        className="remove-btn"
                                        title="Remove from cart"
                                        disabled={isLoading}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="cart-actions">
                            <button
                                onClick={clearCart}
                                className="btn btn--outline"
                                disabled={isLoading}
                            >
                                Clear Cart
                            </button>
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
                                    <span>Subtotal:</span>
                                    <span>₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping:</span>
                                    <span className="text-success">Free</span>
                                </div>
                                <div className="summary-row">
                                    <span>Tax:</span>
                                    <span>₹{Math.round(cartTotal * 0.18).toLocaleString()}</span>
                                </div>
                                <hr className="summary-divider" />
                                <div className="summary-row summary-total">
                                    <span>Total:</span>
                                    <span>₹{Math.round(cartTotal * 1.18).toLocaleString()}</span>
                                </div>
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
                                        Proceed to Checkout
                                    </>
                                )}
                            </button>

                            <div className="checkout-security">
                                <p className="security-text">
                                    🔒 Secure checkout with 256-bit SSL encryption
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: var(--space-8);
          align-items: start;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .cart-item {
          background: var(--bg-primary);
          border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          display: grid;
          grid-template-columns: auto 1fr auto auto;
          gap: var(--space-6);
          align-items: start;
          transition: all var(--transition-base);
        }

        .cart-item:hover {
          box-shadow: var(--shadow-md);
        }

        .cart-item__image img {
          width: 80px;
          height: 112px;
          object-fit: cover;
          border-radius: var(--radius-lg);
        }

        .cart-item__details {
          min-width: 0; /* Allows text truncation */
        }

        .cart-item__title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--space-2);
          line-height: var(--line-height-tight);
        }

        .cart-item__title a {
          color: var(--text-primary);
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .cart-item__title a:hover {
          color: var(--color-primary);
        }

        .cart-item__author {
          color: var(--text-secondary);
          margin-bottom: var(--space-3);
          font-size: var(--font-size-sm);
        }

        .cart-item__price {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          margin-top: var(--space-2);
        }

        .cart-item__quantity {
          text-align: center;
        }

        .quantity-label {
          display: block;
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-2);
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          border: 1px solid var(--color-gray-300);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .quantity-btn {
          background: var(--bg-secondary);
          border: none;
          padding: var(--space-2);
          color: var(--text-primary);
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .quantity-btn:hover:not(:disabled) {
          background: var(--color-primary);
          color: var(--text-white);
        }

        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-value {
          padding: var(--space-2) var(--space-4);
          background: var(--bg-primary);
          border-left: 1px solid var(--color-gray-300);
          border-right: 1px solid var(--color-gray-300);
          font-weight: var(--font-weight-medium);
          min-width: 50px;
          text-align: center;
        }

        .stock-warning {
          font-size: var(--font-size-xs);
          color: var(--color-danger);
          margin-top: var(--space-1);
          margin-bottom: 0;
        }

        .cart-item__total {
          text-align: right;
        }

        .item-total {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
          color: var(--color-secondary);
          margin-bottom: var(--space-3);
        }

        .remove-btn {
          background: none;
          border: 1px solid var(--color-danger);
          color: var(--color-danger);
          padding: var(--space-2);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .remove-btn:hover:not(:disabled) {
          background: var(--color-danger);
          color: var(--text-white);
        }

        .remove-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .cart-actions {
          display: flex;
          gap: var(--space-4);
          justify-content: space-between;
          padding: var(--space-6);
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
        }

        .cart-summary {
          position: sticky;
          top: calc(80px + var(--space-6));
        }

        .cart-summary__card {
          background: var(--bg-primary);
          border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          box-shadow: var(--shadow-sm);
        }

        .cart-summary__title {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--space-6);
          text-align: center;
        }

        .cart-summary__details {
          margin-bottom: var(--space-6);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-3) 0;
          font-size: var(--font-size-base);
        }

        .summary-total {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
        }

        .summary-divider {
          border: none;
          border-top: 1px solid var(--color-gray-200);
          margin: var(--space-4) 0;
        }

        .checkout-btn {
          width: 100%;
          padding: var(--space-4);
          font-size: var(--font-size-lg);
          margin-bottom: var(--space-4);
        }

        .checkout-security {
          text-align: center;
        }

        .security-text {
          font-size: var(--font-size-xs);
          color: var(--text-muted);
          margin: 0;
        }

        @media (max-width: 1024px) {
          .cart-layout {
            grid-template-columns: 1fr;
            gap: var(--space-6);
          }

          .cart-summary {
            position: static;
            order: -1;
          }
        }

        @media (max-width: 768px) {
          .cart-item {
            grid-template-columns: auto 1fr;
            gap: var(--space-4);
          }

          .cart-item__quantity,
          .cart-item__total {
            grid-column: 1 / -1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: var(--space-4);
            padding-top: var(--space-4);
            border-top: 1px solid var(--color-gray-200);
          }

          .cart-item__quantity {
            border-top: none;
            margin-top: 0;
            padding-top: 0;
          }

          .cart-actions {
            flex-direction: column;
            gap: var(--space-3);
          }
        }

        @media (max-width: 480px) {
          .cart-item {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .cart-item__image {
            margin: 0 auto;
          }

          .cart-item__image img {
            width: 100px;
            height: 140px;
          }
        }
      `}</style>
        </div>
    )
}