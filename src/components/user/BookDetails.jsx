import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useBookContext } from '../../context/BookContext'
import { useCartContext } from '../../context/CartContext'
import {
    ArrowLeft,
    ShoppingCart,
    Heart,
    Star,
    Plus,
    Minus,
    Package,
    CheckCircle,
    AlertCircle
} from 'lucide-react'

export default function BookDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getBookById } = useBookContext()
    const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCartContext()

    const [quantity, setQuantity] = useState(1)
    const [isAddingToCart, setIsAddingToCart] = useState(false)
    const [showMessage, setShowMessage] = useState('')

    const book = getBookById(id)

    if (!book) {
        return (
            <div className="page">
                <div className="container">
                    <div className="error-state">
                        <AlertCircle size={48} />
                        <h2>Book Not Found</h2>
                        <p>The book you're looking for doesn't exist or has been removed.</p>
                        <Link to="/books" className="btn btn--primary">
                            <ArrowLeft size={18} />
                            Back to Catalog
                        </Link>
                    </div>
                </div>

                <style>{`
          .error-state {
            text-align: center;
            padding: var(--space-16);
            color: var(--text-muted);
          }

          .error-state h2 {
            margin: var(--space-4) 0 var(--space-2);
            color: var(--text-secondary);
          }

          .error-state p {
            margin-bottom: var(--space-6);
          }
        `}</style>
            </div>
        )
    }

    const handleQuantityChange = (delta) => {
        const newQuantity = quantity + delta
        if (newQuantity >= 1 && newQuantity <= book.quantity) {
            setQuantity(newQuantity)
        }
    }

    const handleAddToCart = async () => {
        setIsAddingToCart(true)
        const result = await addToCart(book.id, quantity)

        if (result.success) {
            setShowMessage('Added to cart successfully!')
            setTimeout(() => setShowMessage(''), 3000)
        }

        setIsAddingToCart(false)
    }

    const handleWishlistToggle = async () => {
        if (isInWishlist(book.id)) {
            await removeFromWishlist(book.id)
            setShowMessage('Removed from wishlist')
        } else {
            await addToWishlist(book.id)
            setShowMessage('Added to wishlist!')
        }
        setTimeout(() => setShowMessage(''), 3000)
    }

    const renderStars = (rating) => {
        const stars = []
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 !== 0

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} size={16} fill="currentColor" />)
        }

        if (hasHalfStar) {
            stars.push(<Star key="half" size={16} fill="currentColor" style={{ opacity: 0.5 }} />)
        }

        const emptyStars = 5 - Math.ceil(rating)
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} size={16} />)
        }

        return stars
    }

    return (
        <div className="page">
            <div className="container">
                {/* Back Navigation */}
                <div className="back-nav">
                    <button onClick={() => navigate(-1)} className="btn btn--outline">
                        <ArrowLeft size={18} />
                        Back
                    </button>
                </div>

                {showMessage && (
                    <div className="alert alert--success">
                        <CheckCircle size={20} />
                        {showMessage}
                    </div>
                )}

                <div className="book-details">
                    <div className="book-details__image">
                        <img src={book.image} alt={book.title} />
                    </div>

                    <div className="book-details__content">
                        <div className="book-details__header">
                            <span className="badge badge--primary">{book.category}</span>
                            <h1 className="book-details__title">{book.title}</h1>
                            <p className="book-details__author">by {book.author}</p>

                            {book.rating && (
                                <div className="book-details__rating">
                                    <div className="rating-stars">
                                        {renderStars(book.rating)}
                                    </div>
                                    <span className="rating-text">
                                        {book.rating} ({book.reviews} reviews)
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="book-details__info">
                            <div className="book-details__price">₹{book.price.toLocaleString()}</div>
                            <div className="book-details__stock">
                                {book.quantity > 0 ? (
                                    <span className="stock-available">
                                        <Package size={16} />
                                        {book.quantity} in stock
                                    </span>
                                ) : (
                                    <span className="stock-unavailable">
                                        <AlertCircle size={16} />
                                        Out of stock
                                    </span>
                                )}
                            </div>
                        </div>

                        {book.description && (
                            <div className="book-details__description">
                                <h3>Description</h3>
                                <p>{book.description}</p>
                            </div>
                        )}

                        <div className="book-details__meta">
                            <div className="meta-item">
                                <span className="meta-label">ISBN/Barcode:</span>
                                <span className="meta-value">{book.barcode}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Category:</span>
                                <span className="meta-value">{book.category}</span>
                            </div>
                        </div>

                        {book.quantity > 0 && (
                            <div className="book-details__purchase">
                                <div className="quantity-section">
                                    <label className="quantity-label">Quantity:</label>
                                    <div className="quantity-controls">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            disabled={quantity <= 1}
                                            className="quantity-btn"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="quantity-value">{quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            disabled={quantity >= book.quantity}
                                            className="quantity-btn"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="purchase-actions">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={isAddingToCart}
                                        className="btn btn--primary purchase-btn"
                                    >
                                        {isAddingToCart ? (
                                            <>
                                                <div className="spinner spinner--sm"></div>
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart size={18} />
                                                Add to Cart
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={handleWishlistToggle}
                                        className={`btn btn--outline wishlist-toggle ${isInWishlist(book.id) ? 'wishlist-toggle--active' : ''}`}
                                    >
                                        <Heart size={18} />
                                        {isInWishlist(book.id) ? 'In Wishlist' : 'Add to Wishlist'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Books Section */}
                <div className="related-section">
                    <h2 className="section-title">More Books in {book.category}</h2>
                    <div className="related-books">
                        {/* This would be populated with related books */}
                        <div className="related-placeholder">
                            <p>Related books will be displayed here when more books are added to this category.</p>
                            <Link to="/categories" className="btn btn--outline">
                                Browse Categories
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .back-nav {
          margin-bottom: var(--space-6);
        }

        .book-details {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: var(--space-8);
          margin-bottom: var(--space-12);
        }

        .book-details__image img {
          width: 100%;
          height: auto;
          max-height: 400px;
          object-fit: cover;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
        }

        .book-details__content {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .book-details__header {
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--color-gray-200);
        }

        .book-details__title {
          font-size: var(--font-size-3xl);
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
          margin: var(--space-3) 0 var(--space-2);
          line-height: var(--line-height-tight);
        }

        .book-details__author {
          font-size: var(--font-size-lg);
          color: var(--text-secondary);
          margin-bottom: var(--space-4);
        }

        .book-details__rating {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .rating-stars {
          display: flex;
          gap: var(--space-1);
          color: var(--color-accent);
        }

        .rating-text {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .book-details__info {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .book-details__price {
          font-size: var(--font-size-4xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-secondary);
        }

        .book-details__stock {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--font-size-base);
        }

        .stock-available {
          color: var(--color-success);
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .stock-unavailable {
          color: var(--color-danger);
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .book-details__description h3 {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--space-3);
          color: var(--text-primary);
        }

        .book-details__description p {
          color: var(--text-secondary);
          line-height: var(--line-height-relaxed);
          margin: 0;
        }

        .book-details__meta {
          background: var(--bg-secondary);
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .meta-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .meta-label {
          font-weight: var(--font-weight-medium);
          color: var(--text-secondary);
        }

        .meta-value {
          color: var(--text-primary);
        }

        .book-details__purchase {
          background: var(--bg-primary);
          border: 2px solid var(--color-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
        }

        .quantity-section {
          margin-bottom: var(--space-4);
        }

        .quantity-label {
          display: block;
          font-weight: var(--font-weight-medium);
          margin-bottom: var(--space-2);
          color: var(--text-primary);
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          border: 1px solid var(--color-gray-300);
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
          padding: var(--space-3) var(--space-6);
          background: var(--bg-primary);
          border-left: 1px solid var(--color-gray-300);
          border-right: 1px solid var(--color-gray-300);
          font-weight: var(--font-weight-medium);
          min-width: 60px;
          text-align: center;
        }

        .purchase-actions {
          display: flex;
          gap: var(--space-3);
        }

        .purchase-btn {
          flex: 1;
          padding: var(--space-4);
          font-size: var(--font-size-lg);
        }

        .wishlist-toggle {
          padding: var(--space-4);
          white-space: nowrap;
        }

        .wishlist-toggle--active {
          background: var(--color-danger-light);
          border-color: var(--color-danger);
          color: var(--color-danger);
        }

        .related-section {
          border-top: 1px solid var(--color-gray-200);
          padding-top: var(--space-8);
        }

        .section-title {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--space-6);
          color: var(--text-primary);
        }

        .related-placeholder {
          text-align: center;
          padding: var(--space-8);
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          color: var(--text-muted);
        }

        .related-placeholder p {
          margin-bottom: var(--space-4);
        }

        @media (max-width: 768px) {
          .book-details {
            grid-template-columns: 1fr;
            gap: var(--space-6);
          }

          .book-details__image {
            text-align: center;
          }

          .book-details__image img {
            max-width: 250px;
          }

          .purchase-actions {
            flex-direction: column;
          }

          .wishlist-toggle {
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .book-details__title {
            font-size: var(--font-size-2xl);
          }

          .book-details__price {
            font-size: var(--font-size-3xl);
          }

          .quantity-controls {
            width: 100%;
            justify-content: center;
          }

          .quantity-value {
            flex: 1;
          }
        }
      `}</style>
        </div>
    )
}