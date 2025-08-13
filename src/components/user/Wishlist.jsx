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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price)
  }

  if (wishlistLoading && wishlistItems.length === 0) {
    return (
      <LoadingSpinner
        fullScreen={true}
        text="Loading your wishlist..."
        size="lg"
        color="primary"
      />
    )
  }

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="page__header">
          <div className="wishlist-header__content">
            <div className="wishlist-header__info">
              <Heart className="wishlist-header__icon" size={32} />
              <div>
                <h1 className="page__title">My Wishlist</h1>
                <p className="page__subtitle">
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
                        src={item.image || 'https://via.placeholder.com/300x400/e2e8f0/64748b?text=No+Image'}
                        alt={item.title}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x400/e2e8f0/64748b?text=No+Image'
                        }}
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

      <style>{`
        /* Header styling matching BookCatalog */
        .wishlist-header__content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4, 1.5rem);
          flex-wrap: wrap;
        }

        .wishlist-header__info {
          display: flex;
          align-items: center;
          gap: var(--space-4, 1.5rem);
        }

        .wishlist-header__icon {
          color: #e91e63;
          flex-shrink: 0;
        }

        .wishlist-header__actions {
          display: flex;
          gap: var(--space-3, 1rem);
          align-items: center;
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

        .btn--danger {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: none;
        }

        .btn--danger:hover:not(:disabled) {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          transform: translateY(-2px);
        }

        .btn--outline {
          background-color: transparent;
        }

        .btn--outline.btn--danger {
          color: var(--color-danger, #ef4444);
          border: 1px solid var(--color-danger, #ef4444);
          background: transparent;
        }

        .btn--outline.btn--danger:hover:not(:disabled) {
          background: var(--color-danger, #ef4444);
          color: white;
        }

        .btn--lg {
          padding: 1rem 2rem;
          font-size: 1rem;
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

        /* Empty state */
        .wishlist-empty {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
          padding: var(--space-16, 4rem);
        }

        .empty-state {
          text-align: center;
          max-width: 400px;
        }

        .empty-state__icon {
          color: var(--color-gray-400, #9ca3af);
          margin-bottom: var(--space-6, 1.5rem);
        }

        .empty-state__title {
          font-size: 1.875rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
          margin: 0 0 var(--space-4, 1rem);
        }

        .empty-state__description {
          font-size: 1.125rem;
          color: var(--text-muted, #6b7280);
          margin: 0 0 var(--space-8, 2rem);
          line-height: 1.6;
        }

        /* Wishlist grid */
        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: var(--space-6, 1.5rem);
        }

        .wishlist-item {
          background: var(--bg-primary, #ffffff);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--color-gray-200, #e5e7eb);
          transition: all 0.3s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .wishlist-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border-color: var(--color-primary, #3b82f6);
        }

        .wishlist-item__content {
          display: flex;
          padding: var(--space-6, 1.5rem);
          gap: var(--space-4, 1rem);
        }

        .wishlist-item__image {
          flex-shrink: 0;
          width: 100px;
          height: 140px;
          border-radius: 8px;
          overflow: hidden;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
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
          margin-bottom: var(--space-4, 1rem);
        }

        .wishlist-item__title {
          display: block;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
          text-decoration: none;
          margin-bottom: var(--space-2, 0.5rem);
          line-height: 1.4;
          transition: color 0.3s ease;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .wishlist-item__title:hover {
          color: var(--color-primary, #3b82f6);
        }

        .wishlist-item__author {
          font-size: 0.875rem;
          color: var(--text-muted, #6b7280);
          margin: 0 0 var(--space-3, 0.75rem);
          font-weight: 500;
        }

        .wishlist-item__meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2, 0.5rem);
          align-items: center;
        }

        .wishlist-item__category {
          padding: 0.25rem 0.75rem;
          background: var(--color-primary-light, rgba(59, 130, 246, 0.1));
          color: var(--color-primary, #3b82f6);
          font-size: 0.75rem;
          border-radius: 50px;
          font-weight: 500;
        }

        .wishlist-item__price {
          margin: var(--space-3, 0.75rem) 0;
        }

        .price {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-secondary, #059669);
        }

        .wishlist-item__actions {
          display: flex;
          gap: var(--space-2, 0.5rem);
          flex-wrap: wrap;
        }

        /* Dark mode overrides */
        :global([data-theme="dark"]) .btn--secondary {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        :global([data-theme="dark"]) .btn--secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(102, 126, 234, 0.5);
          color: white;
        }

        :global([data-theme="dark"]) .btn--outline.btn--danger {
          color: #ef4444;
          border-color: #ef4444;
        }

        :global([data-theme="dark"]) .wishlist-item__category {
          background: rgba(102, 126, 234, 0.2);
          color: rgba(102, 126, 234, 0.9);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .wishlist-header__content {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-4, 1rem);
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
            gap: var(--space-4, 1rem);
          }

          .wishlist-item__content {
            flex-direction: column;
            text-align: center;
          }

          .wishlist-item__image {
            width: 120px;
            height: 160px;
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
            padding: 0 var(--space-4, 1rem);
          }
        }

        @media (max-width: 480px) {
          .wishlist-item__actions {
            flex-direction: column;
          }

          .wishlist-item__actions .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default Wishlist