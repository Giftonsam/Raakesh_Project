// src/components/user/Wishlist.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { Heart, ShoppingCart, Trash2, Eye, Package } from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'

const Wishlist = () => {
  const { user } = useAuth()
  const { wishlistItems, removeFromWishlist, clearWishlist, isLoading: wishlistLoading } = useWishlist()
  const { addToCart, loading: cartLoading } = useCart()
  const [removingItems, setRemovingItems] = useState(new Set())
  const [addingToCart, setAddingToCart] = useState(new Set())

  const handleRemoveFromWishlist = async (bookId) => {
    setRemovingItems(prev => new Set(prev).add(bookId))
    try {
      await removeFromWishlist(bookId)
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(bookId)
        return newSet
      })
    }
  }

  const handleAddToCart = async (book) => {
    setAddingToCart(prev => new Set(prev).add(book.id))
    try {
      await addToCart(book, 1)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev)
        newSet.delete(book.id)
        return newSet
      })
    }
  }

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      try {
        await clearWishlist()
      } catch (error) {
        console.error('Failed to clear wishlist:', error)
      }
    }
  }

  const handleAddAllToCart = async () => {
    const promises = wishlistItems.map(item => addToCart(item, 1))
    try {
      await Promise.all(promises)
    } catch (error) {
      console.error('Some items failed to add to cart:', error)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (wishlistLoading && wishlistItems.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="wishlist-page">
        <div className="container">
          {/* Header */}
          <div className="wishlist-header">
            <div className="wishlist-header__content">
              <div className="wishlist-header__info">
                <Heart className="wishlist-header__icon" size={32} />
                <div>
                  <h1 className="wishlist-header__title">My Wishlist</h1>
                  <p className="wishlist-header__subtitle">
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
                  </p>
                </div>
              </div>

              {wishlistItems.length > 0 && (
                <div className="wishlist-header__actions">
                  <button
                    onClick={handleAddAllToCart}
                    disabled={cartLoading}
                    className="btn btn--primary"
                  >
                    <ShoppingCart size={18} />
                    Add All to Cart
                  </button>
                  <button
                    onClick={handleClearWishlist}
                    disabled={wishlistLoading}
                    className="btn btn--danger btn--outline"
                  >
                    <Trash2 size={18} />
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Wishlist Content */}
          {wishlistItems.length === 0 ? (
            <div className="wishlist-empty">
              <div className="empty-state">
                <Heart className="empty-state__icon" size={64} />
                <h2 className="empty-state__title">Your wishlist is empty</h2>
                <p className="empty-state__description">
                  Save books you're interested in to your wishlist and come back to them later.
                </p>
                <Link to="/books" className="btn btn--primary btn--lg">
                  <Package size={20} />
                  Browse Books
                </Link>
              </div>
            </div>
          ) : (
            <div className="wishlist-grid">
              {wishlistItems.map((item) => (
                <div key={item.id} className="wishlist-item">
                  <div className="wishlist-item__content">
                    {/* Image */}
                    <div className="wishlist-item__image">
                      <Link to={`/books/${item.id}`}>
                        <img
                          src={item.image || '/placeholder-book.jpg'}
                          alt={item.title}
                          loading="lazy"
                        />
                      </Link>
                    </div>

                    {/* Details */}
                    <div className="wishlist-item__details">
                      <div className="wishlist-item__header">
                        <Link
                          to={`/books/${item.id}`}
                          className="wishlist-item__title"
                        >
                          {item.title}
                        </Link>
                        <p className="wishlist-item__author">by {item.author}</p>
                        <div className="wishlist-item__meta">
                          <span className="wishlist-item__category">{item.category}</span>
                          {/* Removed the addedAt date since it's not available in the context */}
                        </div>
                      </div>

                      <div className="wishlist-item__price">
                        <span className="price">{formatPrice(item.price)}</span>
                      </div>

                      <div className="wishlist-item__actions">
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={addingToCart.has(item.id)}
                          className="btn btn--primary btn--sm"
                        >
                          <ShoppingCart size={16} />
                          {addingToCart.has(item.id) ? 'Adding...' : 'Add to Cart'}
                        </button>

                        <Link
                          to={`/books/${item.id}`}
                          className="btn btn--secondary btn--sm"
                        >
                          <Eye size={16} />
                          View
                        </Link>

                        <button
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          disabled={removingItems.has(item.id)}
                          className="btn btn--danger btn--outline btn--sm"
                          title="Remove from wishlist"
                        >
                          <Trash2 size={16} />
                          {removingItems.has(item.id) ? 'Removing...' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        :root {
          --space-1: 0.25rem;
          --space-2: 0.5rem;
          --space-3: 0.75rem;
          --space-4: 1rem;
          --space-6: 1.5rem;
          --space-8: 2rem;
          --font-size-xs: 0.75rem;
          --font-size-sm: 0.875rem;
          --font-size-lg: 1.125rem;
          --font-size-xl: 1.25rem;
          --font-size-2xl: 1.5rem;
          --font-size-3xl: 1.875rem;
          --font-weight-medium: 500;
          --font-weight-semibold: 600;
          --font-weight-bold: 700;
          --radius-sm: 0.25rem;
          --radius-md: 0.375rem;
          --radius-lg: 0.5rem;
          --radius-xl: 0.75rem;
          --radius-full: 9999px;
          --bg-primary: #ffffff;
          --bg-secondary: #f8fafc;
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --text-muted: #9ca3af;
          --color-primary: #3b82f6;
          --color-primary-light: #dbeafe;
          --color-gray-200: #e5e7eb;
          --color-gray-400: #9ca3af;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 500;
          border: 1px solid transparent;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          background: none;
        }

        .btn--primary {
          background-color: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .btn--primary:hover:not(:disabled) {
          background-color: #2563eb;
          border-color: #2563eb;
        }

        .btn--secondary {
          background-color: #6b7280;
          color: white;
          border-color: #6b7280;
        }

        .btn--secondary:hover:not(:disabled) {
          background-color: #4b5563;
          border-color: #4b5563;
        }

        .btn--danger {
          background-color: #ef4444;
          color: white;
          border-color: #ef4444;
        }

        .btn--danger:hover:not(:disabled) {
          background-color: #dc2626;
          border-color: #dc2626;
        }

        .btn--outline {
          background-color: transparent;
        }

        .btn--outline.btn--danger {
          color: #ef4444;
          border-color: #ef4444;
        }

        .btn--lg {
          padding: 1rem 2rem;
          font-size: 1.125rem;
        }

        .wishlist-page {
          min-height: calc(100vh - 200px);
          padding: var(--space-6) 0;
          background: var(--bg-secondary);
        }

        .wishlist-header {
          margin-bottom: var(--space-8);
          padding: var(--space-6);
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          border: 1px solid var(--color-gray-200);
        }

        .wishlist-header__content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
        }

        .wishlist-header__info {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .wishlist-header__icon {
          color: #e91e63;
          flex-shrink: 0;
        }

        .wishlist-header__title {
          font-size: var(--font-size-3xl);
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
          margin: 0;
          line-height: 1.2;
        }

        .wishlist-header__subtitle {
          font-size: var(--font-size-lg);
          color: var(--text-secondary);
          margin: var(--space-1) 0 0;
        }

        .wishlist-header__actions {
          display: flex;
          gap: var(--space-3);
          align-items: center;
        }

        .wishlist-empty {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }

        .empty-state {
          text-align: center;
          max-width: 400px;
        }

        .empty-state__icon {
          color: var(--color-gray-400);
          margin-bottom: var(--space-4);
        }

        .empty-state__title {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
          margin: 0 0 var(--space-2);
        }

        .empty-state__description {
          font-size: var(--font-size-lg);
          color: var(--text-secondary);
          margin: 0 0 var(--space-6);
          line-height: 1.6;
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--space-6);
        }

        .wishlist-item {
          background: var(--bg-primary);
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--color-gray-200);
          transition: all 0.3s ease;
        }

        .wishlist-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border-color: var(--color-primary-light);
        }

        .wishlist-item__content {
          display: flex;
          padding: var(--space-4);
          gap: var(--space-4);
        }

        .wishlist-item__image {
          flex-shrink: 0;
          width: 80px;
          height: 120px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--bg-secondary);
        }

        .wishlist-item__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .wishlist-item:hover .wishlist-item__image img {
          transform: scale(1.05);
        }

        .wishlist-item__details {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .wishlist-item__header {
          margin-bottom: var(--space-3);
        }

        .wishlist-item__title {
          display: block;
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
          text-decoration: none;
          margin-bottom: var(--space-1);
          line-height: 1.4;
          transition: color 0.3s ease;
        }

        .wishlist-item__title:hover {
          color: var(--color-primary);
        }

        .wishlist-item__author {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          margin: 0 0 var(--space-2);
          font-style: italic;
        }

        .wishlist-item__meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          align-items: center;
        }

        .wishlist-item__category {
          padding: var(--space-1) var(--space-2);
          background: var(--color-primary-light);
          color: var(--color-primary);
          font-size: var(--font-size-xs);
          border-radius: var(--radius-full);
          font-weight: var(--font-weight-medium);
        }

        .wishlist-item__price {
          margin: var(--space-2) 0;
        }

        .price {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-primary);
        }

        .wishlist-item__actions {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
        }

        .btn--sm {
          padding: var(--space-2) var(--space-3);
          font-size: var(--font-size-sm);
          height: auto;
          min-height: 32px;
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .wishlist-page {
            padding: var(--space-4) 0;
          }

          .wishlist-header {
            padding: var(--space-4);
            margin-bottom: var(--space-6);
          }

          .wishlist-header__content {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-4);
          }

          .wishlist-header__actions {
            width: 100%;
            justify-content: stretch;
          }

          .wishlist-header__actions .btn {
            flex: 1;
          }

          .wishlist-grid {
            grid-template-columns: 1fr;
            gap: var(--space-4);
          }

          .wishlist-item__content {
            flex-direction: column;
            text-align: center;
          }

          .wishlist-item__image {
            width: 120px;
            height: 180px;
            align-self: center;
          }

          .wishlist-item__actions {
            justify-content: center;
          }

          .wishlist-item__actions .btn {
            flex: 1;
            min-width: 0;
          }

          .empty-state {
            padding: 0 var(--space-4);
          }
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          pointer-events: none;
        }

        .btn:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }

        .wishlist-item__title:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
          border-radius: var(--radius-sm);
        }
      `}</style>
    </>
  )
}

export default Wishlist