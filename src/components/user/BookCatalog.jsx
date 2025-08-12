// src/components/user/BookCatalog.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCartContext } from '../../context/CartContext'
import { useBookContext } from '../../context/BookContext'
import { useMultipleLoading } from '../../hooks/useLoading'
import LoadingSpinner from '../common/LoadingSpinner'
import {
  Search,
  Filter as FilterIcon,
  BookOpen,
  ShoppingCart,
  Star
} from 'lucide-react'
import WishlistButton from '../common/WishlistButton'

export default function BookCatalog() {
  const { books, categories, isLoading, error } = useBookContext()
  const { addToCart } = useCartContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('title')
  const [viewMode, setViewMode] = useState('grid')

  // Enhanced loading management
  const { loadingStates, setLoading, withLoading, isLoading: isActionLoading } = useMultipleLoading()
  const [pageInitialized, setPageInitialized] = useState(false)

  // Initialize page with loading
  useEffect(() => {
    const initializePage = async () => {
      // Simulate page initialization time
      await new Promise(resolve => setTimeout(resolve, 800))
      setPageInitialized(true)
    }

    initializePage()
  }, [])

  // Filter and sort books
  const filteredBooks = books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'author':
          return a.author.localeCompare(b.author)
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        default:
          return 0
      }
    })

  const handleAddToCart = async (book) => {
    if (book.quantity === 0) return

    await withLoading(`cart-${book.id}`, async () => {
      try {
        const result = await addToCart(book.id, 1)

        if (result.success) {
          showNotification(`"${book.title}" added to cart!`, 'success')
        } else {
          showNotification(result.error || 'Failed to add to cart', 'error')
        }
      } catch (error) {
        console.error('Error adding to cart:', error)
        showNotification('Failed to add to cart', 'error')
      }
    }, 600) // Minimum 600ms loading time for cart action
  }

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div')
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-size: 14px;
      font-weight: 500;
      animation: slideInRight 0.3s ease-out;
    `

    document.head.insertAdjacentHTML('beforeend', `
      <style>
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      </style>
    `)

    document.body.appendChild(notification)
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 3000)
  }

  const BookCard = ({ book, isGridView }) => (
    <div className={`book-card ${isGridView ? 'book-card--grid' : 'book-card--list'}`}>
      <div className="book-image">
        <Link to={`/books/${book.id}`}>
          <img
            src={book.image}
            alt={book.title}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/200x300/3b82f6/ffffff?text=Book'
            }}
          />
        </Link>

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

          {!isGridView && (
            <p className="book-description">
              {book.description?.substring(0, 150)}...
            </p>
          )}

          <div className="book-price">
            <span className="price-current">₹{book.price}</span>
          </div>
        </div>

        <div className="book-actions">
          <button
            onClick={() => handleAddToCart(book)}
            className="btn btn--primary"
            disabled={book.quantity === 0 || isActionLoading(`cart-${book.id}`)}
          >
            {isActionLoading(`cart-${book.id}`) ? (
              <>
                <div className="btn-loading-spinner"></div>
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                {book.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  // Show loading during page initialization or data loading
  if (!pageInitialized || isLoading) {
    return (
      <LoadingSpinner
        fullScreen={true}
        text={!pageInitialized ? "Initializing book catalog..." : "Loading books..."}
        size="lg"
        color="primary"
      />
    )
  }

  if (error) {
    return (
      <div className="page">
        <div className="container">
          <div className="error-container-centered">
            <h2>Error Loading Books</h2>
            <p>{error}</p>
            <button
              onClick={() => {
                setPageInitialized(false)
                window.location.reload()
              }}
              className="btn btn--primary"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page__header">
          <h1 className="page__title">Book Catalog</h1>
          <p className="page__subtitle">Discover your next favorite book • {books.length} books available</p>
        </div>

        {/* Filters and Controls */}
        <div className="catalog-controls">
          <div className="controls-left">
            <div className="search-bar">
              <Search className="search-bar__icon" size={20} />
              <input
                type="text"
                placeholder="Search books or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar__input"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-input category-filter"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input sort-filter"
            >
              <option value="title">Sort by Title</option>
              <option value="author">Sort by Author</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>

          <div className="controls-right">
            <div className="view-toggle">
              <button
                onClick={() => setViewMode('grid')}
                className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
              >
                <BookOpen size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
              >
                <FilterIcon size={20} />
              </button>
            </div>

            <div className="results-count">
              {filteredBooks.length} books found
            </div>
          </div>
        </div>

        {/* Results Info */}
        {searchQuery || selectedCategory !== 'all' ? (
          <div className="results-info">
            <p>
              Showing {filteredBooks.length} of {books.length} books
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            </p>
          </div>
        ) : null}

        {/* Books Display */}
        <div className={`books-container ${viewMode === 'grid' ? 'books-grid' : 'books-list'}`}>
          {filteredBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
              isGridView={viewMode === 'grid'}
            />
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="no-results">
            <Search size={48} />
            <h3>No books found</h3>
            <p>
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters to find more books.'
                : 'No books available at the moment.'}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className="btn btn--primary"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        /* Enhanced loading styles */
        .btn-loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Rest of your existing styles... */
        .error-container-centered {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
          color: var(--text-muted);
        }

        .error-container-centered h2 {
          color: var(--color-danger);
          margin-bottom: var(--space-4);
        }

        .catalog-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
          flex-wrap: wrap;
        }

        .controls-left {
          display: flex;
          gap: var(--space-4);
          flex: 1;
          max-width: 800px;
        }

        .controls-right {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        /* Grid and List styles */
        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--space-6);
        }

        .book-card--grid {
          background: var(--bg-primary);
          border: 2px solid var(--color-gray-200);
          border-radius: var(--radius-xl);
          overflow: hidden;
          transition: all var(--transition-base);
          display: flex;
          flex-direction: column;
        }

        .book-card--grid:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
          border-color: var(--color-primary);
        }

        .book-image {
          position: relative;
          height: 250px;
          background: var(--bg-secondary);
        }

        .book-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-base);
        }

        .book-content {
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .book-title a {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .book-title a:hover {
          color: var(--color-primary);
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

        .book-price {
          margin-bottom: var(--space-4);
        }

        .price-current {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
          color: var(--color-secondary);
        }

        .book-actions {
          display: flex;
          gap: var(--space-2);
        }

        .no-results {
          text-align: center;
          padding: var(--space-16);
          color: var(--text-muted);
        }
      `}</style>
    </div>
  )
}