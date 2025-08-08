// src/components/user/BookCatalog.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCartContext } from '../../context/CartContext'
import { useBookContext } from '../../context/BookContext'
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Filter as FilterIcon,
  BookOpen,
  X,
  Save,
  Upload,
  Tag,
  ChevronDown,
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
  const [isAddingToCart, setIsAddingToCart] = useState({})

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

    setIsAddingToCart(prev => ({ ...prev, [book.id]: true }))

    try {
      const result = await addToCart(book.id, 1)

      if (result.success) {
        // Show success notification
        showNotification(`"${book.title}" added to cart!`, 'success')
      } else {
        showNotification(result.error || 'Failed to add to cart', 'error')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      showNotification('Failed to add to cart', 'error')
    } finally {
      setIsAddingToCart(prev => ({ ...prev, [book.id]: false }))
    }
  }

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div')
    notification.textContent = message
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--color-secondary)' : 'var(--color-danger)'};
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
            disabled={book.quantity === 0 || isAddingToCart[book.id]}
          >
            {isAddingToCart[book.id] ? (
              <>
                <div className="spinner spinner--sm"></div>
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

  if (isLoading) {
    return (
      <div className="page">
        <div className="container">
          <div className="loading-container-centered">
            <div className="spinner spinner--lg"></div>
            <p>Loading books...</p>
          </div>
        </div>
      </div>
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
              onClick={() => window.location.reload()}
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
                .loading-container-centered {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 60vh;
                    text-align: center;
                    color: var(--text-muted);
                }

                .loading-container-centered p {
                    margin-top: var(--space-4);
                    font-size: var(--font-size-lg);
                }

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

                .error-container-centered p {
                    margin-bottom: var(--space-6);
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

                .category-filter,
                .sort-filter {
                    min-width: 150px;
                }

                .results-info {
                    margin-bottom: var(--space-4);
                    padding: var(--space-3);
                    background: var(--bg-secondary);
                    border-radius: var(--radius-lg);
                    color: var(--text-secondary);
                    font-size: var(--font-size-sm);
                }

                .view-toggle {
                    display: flex;
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                }

                .view-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: var(--space-2) var(--space-3);
                    border: none;
                    background: var(--bg-secondary);
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all var(--transition-fast);
                }

                .view-button:hover {
                    background: var(--color-primary-light);
                    color: var(--color-primary);
                }

                .view-button.active {
                    background: var(--color-primary);
                    color: white;
                }

                .results-count {
                    font-size: var(--font-size-sm);
                    color: var(--text-muted);
                    white-space: nowrap;
                }

                /* Grid View */
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

                .book-card--grid .book-image {
                    position: relative;
                    height: 250px;
                    background: var(--bg-secondary);
                }

                .book-card--grid .book-content {
                    padding: var(--space-4);
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }

                /* List View */
                .books-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4);
                }

                .book-card--list {
                    background: var(--bg-primary);
                    border: 2px solid var(--color-gray-200);
                    border-radius: var(--radius-xl);
                    overflow: hidden;
                    transition: all var(--transition-base);
                    display: flex;
                    height: 200px;
                }

                .book-card--list:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-lg);
                    border-color: var(--color-primary);
                }

                .book-card--list .book-image {
                    position: relative;
                    width: 140px;
                    flex-shrink: 0;
                    background: var(--bg-secondary);
                }

                .book-card--list .book-content {
                    padding: var(--space-4);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    flex: 1;
                }

                /* Common Book Card Styles */
                .book-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform var(--transition-base);
                }

                .book-card:hover .book-image img {
                    transform: scale(1.02);
                }

                .book-info {
                    flex: 1;
                    margin-bottom: var(--space-4);
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

                .book-description {
                    color: var(--text-secondary);
                    font-size: var(--font-size-sm);
                    line-height: 1.5;
                    margin-bottom: var(--space-3);
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

                .book-actions {
                    display: flex;
                    gap: var(--space-2);
                }

                .book-card--grid .book-actions {
                    flex-direction: column;
                }

                .book-card--list .book-actions {
                    flex-direction: row;
                    align-items: center;
                }

                .no-results {
                    text-align: center;
                    padding: var(--space-16);
                    color: var(--text-muted);
                }

                .no-results h3 {
                    margin: var(--space-4) 0 var(--space-2);
                    color: var(--text-secondary);
                }

                @media (max-width: 1024px) {
                    .catalog-controls {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .controls-left {
                        max-width: 100%;
                        flex-wrap: wrap;
                    }

                    .controls-right {
                        justify-content: space-between;
                    }

                    .books-grid {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    }
                }

                @media (max-width: 768px) {
                    .controls-left {
                        flex-direction: column;
                        gap: var(--space-3);
                    }

                    .books-grid {
                        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                        gap: var(--space-4);
                    }

                    .book-card--list {
                        height: auto;
                        flex-direction: column;
                    }

                    .book-card--list .book-image {
                        width: 100%;
                        height: 200px;
                    }

                    .book-card--list .book-actions {
                        flex-direction: column;
                    }

                    .view-toggle {
                        order: -1;
                        width: 100%;
                        justify-content: center;
                    }

                    .view-button {
                        flex: 1;
                        justify-content: center;
                    }
                }

                @media (max-width: 480px) {
                    .books-grid {
                        grid-template-columns: 1fr;
                    }

                    .book-actions .btn {
                        width: 100%;
                    }
                }
            `}</style>
    </div>
  )
}