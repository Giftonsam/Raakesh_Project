// src/components/user/Wishlist.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2, Eye, Star } from 'lucide-react'
import WishlistButton from '../common/WishlistButton'

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchWishlistItems()
  }, [])

  const fetchWishlistItems = async () => {
    setIsLoading(true)
    try {
      // Replace with your API call
      const response = await fetch('/api/user/wishlist')
      const data = await response.json()
      setWishlistItems(data)
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleWishlist = async (bookId) => {
    try {
      // Replace with your API call
      const response = await fetch('/api/user/wishlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId })
      })

      if (response.ok) {
        // Remove item from wishlist immediately for better UX
        setWishlistItems(prev => prev.filter(item => item.id !== bookId))
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    }
  }

  const handleAddToCart = async (bookId) => {
    try {
      // Replace with your API call
      const response = await fetch('/api/user/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId, quantity: 1 })
      })

      if (response.ok) {
        alert('Book added to cart!')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  if (isLoading) {
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
            <Link to="/books" className="btn btn--primary btn--lg">
              Browse Books
            </Link>
          </div>
        </div>

        <style>{`
                    .empty-wishlist {
                        text-align: center;
                        padding: var(--space-16);
                        color: var(--text-muted);
                    }

                    .empty-animation {
                        opacity: 0.3;
                        margin-bottom: var(--space-6);
                        animation: pulse 2s ease-in-out infinite;
                    }

                    .empty-wishlist h2 {
                        font-size: var(--font-size-2xl);
                        margin: var(--space-6) 0 var(--space-4);
                        color: var(--text-secondary);
                    }

                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
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

                {/* Fixed Wishlist Button */}
                <WishlistButton
                  bookId={book.id}
                  isInWishlist={true}
                  onToggle={handleToggleWishlist}
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
                .loading-container {
                    text-align: center;
                    padding: var(--space-16);
                    color: var(--text-muted);
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
                    margin-left: var(--space-2);
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
                }
            `}</style>
    </div>
  )
}