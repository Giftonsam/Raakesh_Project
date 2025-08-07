import React from 'react'
import { Link } from 'react-router-dom'
import { useCartContext } from '../../context/CartContext'
import { useBookContext } from '../../context/BookContext'
import {
    Heart,
    ShoppingCart,
    Trash2,
    Star,
    ArrowLeft
} from 'lucide-react'

export default function Wishlist() {
    const { wishlist, removeFromWishlist, addToCart } = useCartContext()
    const { getBookById } = useBookContext()

    const wishlistBooks = wishlist.map(bookId => getBookById(bookId)).filter(Boolean)

    const handleRemoveFromWishlist = async (bookId) => {
        await removeFromWishlist(bookId)
    }

    const handleAddToCart = async (bookId) => {
        await addToCart(bookId, 1)
    }

    const handleMoveToCart = async (bookId) => {
        await addToCart(bookId, 1)
        await removeFromWishlist(bookId)
    }

    if (wishlistBooks.length === 0) {
        return (
            <div className="page">
                <div className="container">
                    <div className="page__header">
                        <h1 className="page__title">My Wishlist</h1>
                        <p className="page__subtitle">Save books for later</p>
                    </div>

                    <div className="empty-wishlist">
                        <Heart size={64} />
                        <h2>Your wishlist is empty</h2>
                        <p>Start browsing and add books you'd like to read to your wishlist!</p>
                        <Link to="/books" className="btn btn--primary">
                            <ArrowLeft size={18} />
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

          .empty-wishlist h2 {
            margin: var(--space-6) 0 var(--space-4);
            color: var(--text-secondary);
          }

          .empty-wishlist p {
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
                    <h1 className="page__title">My Wishlist</h1>
                    <p className="page__subtitle">
                        {wishlistBooks.length} {wishlistBooks.length === 1 ? 'book' : 'books'} saved for later
                    </p>
                </div>

                <div className="wishlist-grid">
                    {wishlistBooks.map(book => (
                        <div key={book.id} className="wishlist-item">
                            <div className="wishlist-item__image">
                                <img src={book.image} alt={book.title} />
                                <button
                                    onClick={() => handleRemoveFromWishlist(book.id)}
                                    className="remove-wishlist-btn"
                                    title="Remove from wishlist"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="wishlist-item__content">
                                <span className="badge badge--primary">{book.category}</span>

                                <h3 className="wishlist-item__title">
                                    <Link to={`/books/${book.id}`}>{book.title}</Link>
                                </h3>

                                <p className="wishlist-item__author">by {book.author}</p>

                                {book.rating && (
                                    <div className="wishlist-item__rating">
                                        <Star size={14} fill="currentColor" />
                                        <span>{book.rating}</span>
                                        <span className="text-muted">({book.reviews} reviews)</span>
                                    </div>
                                )}

                                <div className="wishlist-item__price">₹{book.price.toLocaleString()}</div>

                                <div className="wishlist-item__stock">
                                    {book.quantity > 0 ? (
                                        <span className="stock-available">{book.quantity} in stock</span>
                                    ) : (
                                        <span className="stock-unavailable">Out of stock</span>
                                    )}
                                </div>

                                <div className="wishlist-item__actions">
                                    {book.quantity > 0 ? (
                                        <>
                                            <button
                                                onClick={() => handleMoveToCart(book.id)}
                                                className="btn btn--primary"
                                            >
                                                <ShoppingCart size={16} />
                                                Move to Cart
                                            </button>
                                            <button
                                                onClick={() => handleAddToCart(book.id)}
                                                className="btn btn--outline"
                                            >
                                                Add to Cart
                                            </button>
                                        </>
                                    ) : (
                                        <button disabled className="btn btn--outline">
                                            Out of Stock
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="wishlist-actions">
                    <Link to="/books" className="btn btn--secondary">
                        <ArrowLeft size={18} />
                        Continue Shopping
                    </Link>
                    <p className="wishlist-tip">
                        💡 Tip: Books in your wishlist are saved across sessions. You can access them anytime!
                    </p>
                </div>
            </div>

            <style>{`
        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--space-6);
          margin-bottom: var(--space-8);
        }

        .wishlist-item {
          background: var(--bg-primary);
          border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          transition: all var(--transition-base);
          position: relative;
          overflow: hidden;
        }

        .wishlist-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, var(--color-danger) 0%, #ec4899 100%);
          transform: scaleX(0);
          transition: transform var(--transition-base);
        }

        .wishlist-item:hover::before {
          transform: scaleX(1);
        }

        .wishlist-item:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
        }

        .wishlist-item__image {
          position: relative;
          margin-bottom: var(--space-4);
        }

        .wishlist-item__image img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: var(--radius-lg);
        }

        .remove-wishlist-btn {
          position: absolute;
          top: var(--space-2);
          right: var(--space-2);
          background: var(--bg-primary);
          border: 1px solid var(--color-danger);
          border-radius: var(--radius-full);
          padding: var(--space-2);
          color: var(--color-danger);
          cursor: pointer;
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-sm);
        }

        .remove-wishlist-btn:hover {
          background: var(--color-danger);
          color: var(--text-white);
          transform: scale(1.1);
        }

        .wishlist-item__content {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .wishlist-item__title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          line-height: var(--line-height-tight);
          margin: 0;
        }

        .wishlist-item__title a {
          color: var(--text-primary);
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .wishlist-item__title a:hover {
          color: var(--color-primary);
        }

        .wishlist-item__author {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          margin: 0;
        }

        .wishlist-item__rating {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          color: var(--color-accent);
          font-size: var(--font-size-sm);
        }

        .wishlist-item__price {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-secondary);
        }

        .wishlist-item__stock {
          font-size: var(--font-size-sm);
        }

        .stock-available {
          color: var(--color-success);
        }

        .stock-unavailable {
          color: var(--color-danger);
          font-weight: var(--font-weight-medium);
        }

        .wishlist-item__actions {
          display: flex;
          gap: var(--space-2);
          margin-top: var(--space-2);
        }

        .wishlist-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-6);
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          flex-wrap: wrap;
          gap: var(--space-4);
        }

        .wishlist-tip {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          margin: 0;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .wishlist-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }

          .wishlist-item__actions {
            flex-direction: column;
          }

          .wishlist-actions {
            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .wishlist-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    )
}