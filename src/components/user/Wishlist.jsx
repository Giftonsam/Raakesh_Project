// src/components/user/Wishlist.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2, Eye, Star } from 'lucide-react'
import { useWishlist } from '../../context/WishlistContext'
import WishlistButton from '../common/WishlistButton'

export default function Wishlist() {
  const { wishlistItems, isLoading, clearWishlist } = useWishlist()

  const handleAddToCart = async (bookId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))

      const book = wishlistItems.find(b => b.id === bookId)

      // Show success notification
      const notification = document.createElement('div')
      notification.textContent = `"${book?.title}" added to cart!`
      notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--color-primary);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-size: 14px;
                font-weight: 500;
                max-width: 300px;
            `
      document.body.appendChild(notification)
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 3000)

    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      await clearWishlist()
    }
  }

  if (isLoading && wishlistItems.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner spinner--lg"></div>
            <p>Loading your wishlist...</p>
          </div>
        </div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className="page__header">
            <h1 className="page__title">My Wishlist</h1>
            <p className="page__subtitle">Your favorite books saved for later</p>
          </div>

          <div className="empty-wishlist">
            <div className="empty-animation">
              <Heart size={80} />
            </div>
            <h2>Your wishlist is empty</h2>
            <p>Start adding books you love to keep track of them!</p>
            <div className="empty-actions">
              <Link to="/books" className="btn btn--primary btn--lg">
                Browse Books
              </Link>
            </div>
          </div>
        </div>

        <style>{`
                    .loading-container {
                        text-align: center;
                        padding: var(--space-16);
                        color: var(--text-muted);
                    }

                    .empty-wishlist {
                        text-align: center;
                        padding: var(--space-16);
                        color: var(--text-muted);
                    }

                    .empty-animation {
                        opacity: 0.3;
                        margin-bottom: var(--space-6);
                        animation: pulse 2s ease-in-out infinite;
                        color: #e91e63;
                    }

                    .empty-wishlist h2 {
                        font-size: var(--font-size-2xl);
                        margin: var(--space-6) 0 var(--space-4);
                        color: var(--text-secondary);
                    }

                    .empty-actions {
                        margin-top: var(--space-8);
                    }

                    @keyframes pulse {
                        0%, 100% { transform: scale(1); opacity: 0.3; }
                        50% { transform: scale(1.05); opacity: 0.5; }
                    }
                `}</style>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page__header">
          <h1 className="page__title">My Wishlist</h1>
          <p className="page__subtitle">{wishlistItems.length} books in your wishlist</p>
        </div>

        {/* Wishlist Actions */}
        <div className="wishlist-actions">
          <div className="wishlist-info">
            <p>You have {wishlistItems.length} book{wishlistItems.length !== 1 ? 's' : ''} in your wishlist</p>
          </div>
          <div className="action-buttons">
            {wishlistItems.length > 0 && (
              <button
                onClick={handleClearWishlist}
                className="btn btn--outline btn--sm"
                disabled={isLoading}
              >
                <Trash2 size={16} />
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="wishlist-grid">
          {wishlistItems.map(book => (
            <div key={book.id} className="wishlist-card">
              <div className="book-image">
                <img
                  src={book.image}
                  alt={book.title}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x300/3b82f6/ffffff?text=Book'
                  }}
                />

                {/* Wishlist Button */}
                <WishlistButton
                  bookId={book.id}
                  className="card-style"
                  size={16}
                />
              </div>

              <div className="book-content">
                <div className="book-info">
                  <h3 className="book-title">
                    <Link to={`/books/${book.id}`}>
                      {book.title}
                    </Link>
                  </h3>
                  <p className="book-author">by {book.author}</p>

                  {book.rating && (
                    <div className="book-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < Math.floor(book.rating) ? 'star-filled' : 'star-empty'}
                          />
                        ))}
                      </div>
                      <span className="rating-text">({book.rating})</span>
                    </div>
                  )}

                  <div className="book-price">
                    {book.discountedPrice && book.discountedPrice < book.price ? (
                      <>
                        <span className="price-current">₹{book.discountedPrice}</span>
                        <span className="price-original">₹{book.price}</span>
                        <span className="price-discount">
                          {Math.round(((book.price - book.discountedPrice) / book.price) * 100)}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="price-current">₹{book.price}</span>
                    )}
                  </div>
                </div>

                <div className="book-actions">
                  <button
                    onClick={() => handleAddToCart(book.id)}
                    className="btn btn--primary btn--sm"
                    disabled={book.stock === 0}
                  >
                    <ShoppingCart size={16} />
                    {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>

                  <Link
                    to={`/books/${book.id}`}
                    className="btn btn--outline btn--sm"
                  >
                    <Eye size={16} />
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
                .wishlist-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--space-6);
                    padding: var(--space-4);
                    background: var(--bg-secondary);
                    border-radius: var(--radius-lg);
                    flex-wrap: wrap;
                    gap: var(--space-4);
                }

                .wishlist-info p {
                    margin: 0;
                    color: var(--text-secondary);
                    font-size: var(--font-size-sm);
                }

                .action-buttons {
                    display: flex;
                    gap: var(--space-2);
                }

                .wishlist-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: var(--space-6);
                }

                .wishlist-card {
                    background: var(--bg-primary);
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-xl);
                    overflow: hidden;
                    transition: all var(--transition-base);
                    display: flex;
                    height: 200px;
                }

                .wishlist-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-xl);
                    border-color: var(--color-primary);
                }

                .book-image {
                    position: relative;
                    width: 140px;
                    flex-shrink: 0;
                    background: var(--bg-secondary);
                }

                .book-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .book-content {
                    padding: var(--space-4);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    flex: 1;
                }

                .book-info {
                    flex: 1;
                }

                .book-title {
                    margin-bottom: var(--space-2);
                }

                .book-title a {
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                    text-decoration: none;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    transition: color var(--transition-fast);
                }

                .book-title a:hover {
                    color: var(--color-primary);
                }

                .book-author {
                    color: var(--text-secondary);
                    font-size: var(--font-size-sm);
                    margin-bottom: var(--space-3);
                }

                .book-rating {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    margin-bottom: var(--space-3);
                }

                .stars {
                    display: flex;
                    gap: var(--space-1);
                }

                .star-filled {
                    color: #fbbf24;
                    fill: currentColor;
                }

                .star-empty {
                    color: var(--color-gray-300);
                }

                .rating-text {
                    font-size: var(--font-size-sm);
                    color: var(--text-muted);
                }

                .book-price {
                    margin-bottom: var(--space-4);
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    flex-wrap: wrap;
                }

                .price-current {
                    font-size: var(--font-size-lg);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-secondary);
                }

                .price-original {
                    font-size: var(--font-size-sm);
                    color: var(--text-muted);
                    text-decoration: line-through;
                }

                .price-discount {
                    background: var(--color-secondary);
                    color: white;
                    font-size: var(--font-size-xs);
                    font-weight: var(--font-weight-semibold);
                    padding: var(--space-1) var(--space-2);
                    border-radius: var(--radius-base);
                }

                .book-actions {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-2);
                }

                @media (max-width: 768px) {
                    .wishlist-grid {
                        grid-template-columns: 1fr;
                    }

                    .wishlist-card {
                        height: auto;
                        flex-direction: column;
                    }

                    .book-image {
                        width: 100%;
                        height: 200px;
                    }

                    .book-actions {
                        flex-direction: row;
                    }

                    .book-actions .btn {
                        flex: 1;
                    }

                    .wishlist-actions {
                        flex-direction: column;
                        align-items: stretch;
                        text-align: center;
                    }
                }
            `}</style>
    </div>
  )
}