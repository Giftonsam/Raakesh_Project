import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useBookContext } from '../../context/BookContext'
import { useCartContext } from '../../context/CartContext'
import {
    Search,
    Filter,
    Grid,
    List,
    ShoppingCart,
    Heart,
    Star,
    BookOpen,
    SortAsc
} from 'lucide-react'

export default function BookCatalog() {
    const {
        filteredBooks,
        categories,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        isLoading
    } = useBookContext()

    const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useCartContext()

    const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
    const [showFilters, setShowFilters] = useState(false)

    const handleAddToCart = async (bookId) => {
        const result = await addToCart(bookId, 1)
        if (result.success) {
            // Show success notification (you can implement toast notifications)
            console.log('Book added to cart!')
        }
    }

    const handleWishlistToggle = async (bookId) => {
        if (isInWishlist(bookId)) {
            await removeFromWishlist(bookId)
        } else {
            await addToWishlist(bookId)
        }
    }

    const sortOptions = [
        { value: 'title', label: 'Title A-Z' },
        { value: 'author', label: 'Author A-Z' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'rating', label: 'Highest Rated' }
    ]

    return (
        <div className="page">
            <div className="container">
                <div className="page__header">
                    <h1 className="page__title">Book Catalog</h1>
                    <p className="page__subtitle">Discover your next great read</p>
                </div>

                {/* Search and Filter Controls */}
                <div className="catalog-controls">
                    <div className="catalog-controls__left">
                        <div className="search-bar">
                            <Search className="search-bar__icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search books, authors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-bar__input"
                            />
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`btn btn--outline filter-toggle ${showFilters ? 'filter-toggle--active' : ''}`}
                        >
                            <Filter size={18} />
                            Filters
                        </button>
                    </div>

                    <div className="catalog-controls__right">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="form-input sort-select"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <div className="view-toggle">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`view-toggle__btn ${viewMode === 'grid' ? 'view-toggle__btn--active' : ''}`}
                                title="Grid view"
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`view-toggle__btn ${viewMode === 'list' ? 'view-toggle__btn--active' : ''}`}
                                title="List view"
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="filter-panel">
                        <h3 className="filter-panel__title">Categories</h3>
                        <div className="filter-categories">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`category-btn ${selectedCategory === category.id ? 'category-btn--active' : ''}`}
                                >
                                    {category.name}
                                    <span className="category-count">({category.count})</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Results Info */}
                <div className="results-info">
                    <p className="results-count">
                        {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
                    </p>
                </div>

                {/* Books Display */}
                {isLoading ? (
                    <div className="loading-container">
                        <div className="spinner spinner--lg"></div>
                        <p>Loading books...</p>
                    </div>
                ) : filteredBooks.length > 0 ? (
                    <div className={`books-container books-container--${viewMode}`}>
                        {filteredBooks.map(book => (
                            <div key={book.id} className={`book-item book-item--${viewMode}`}>
                                <div className="book-item__image-container">
                                    <img
                                        src={book.image}
                                        alt={book.title}
                                        className="book-item__image"
                                    />
                                    <button
                                        onClick={() => handleWishlistToggle(book.id)}
                                        className={`wishlist-btn ${isInWishlist(book.id) ? 'wishlist-btn--active' : ''}`}
                                        title={isInWishlist(book.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                                    >
                                        <Heart size={18} />
                                    </button>
                                </div>

                                <div className="book-item__content">
                                    <div className="book-item__category">
                                        <span className="badge badge--primary">{book.category}</span>
                                    </div>

                                    <h3 className="book-item__title">
                                        <Link to={`/books/${book.id}`}>{book.title}</Link>
                                    </h3>

                                    <p className="book-item__author">by {book.author}</p>

                                    {book.rating && (
                                        <div className="book-item__rating">
                                            <Star size={14} fill="currentColor" />
                                            <span>{book.rating}</span>
                                            <span className="text-muted">({book.reviews} reviews)</span>
                                        </div>
                                    )}

                                    {viewMode === 'list' && book.description && (
                                        <p className="book-item__description">
                                            {book.description.substring(0, 120)}...
                                        </p>
                                    )}

                                    <div className="book-item__footer">
                                        <div className="book-item__price">₹{book.price.toLocaleString()}</div>
                                        <div className="book-item__stock">
                                            {book.quantity > 0 ? (
                                                <span className="stock-available">{book.quantity} in stock</span>
                                            ) : (
                                                <span className="stock-unavailable">Out of stock</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="book-item__actions">
                                        <button
                                            onClick={() => handleAddToCart(book.id)}
                                            disabled={book.quantity === 0}
                                            className="btn btn--primary"
                                        >
                                            <ShoppingCart size={18} />
                                            Add to Cart
                                        </button>
                                        <Link
                                            to={`/books/${book.id}`}
                                            className="btn btn--outline"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <BookOpen size={64} />
                        <h3>No Books Found</h3>
                        <p>
                            {searchQuery
                                ? `No books match your search for "${searchQuery}"`
                                : selectedCategory !== 'all'
                                    ? 'No books found in this category'
                                    : 'No books available at the moment'
                            }
                        </p>
                        {(searchQuery || selectedCategory !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setSelectedCategory('all')
                                }}
                                className="btn btn--primary mt-4"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            <style>{`
        .catalog-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
          flex-wrap: wrap;
        }

        .catalog-controls__left {
          display: flex;
          gap: var(--space-4);
          flex: 1;
          max-width: 500px;
        }

        .catalog-controls__right {
          display: flex;
          gap: var(--space-3);
          align-items: center;
        }

        .filter-toggle {
          white-space: nowrap;
        }

        .filter-toggle--active {
          background: var(--color-primary);
          color: var(--text-white);
          border-color: var(--color-primary);
        }

        .sort-select {
          min-width: 150px;
        }

        .view-toggle {
          display: flex;
          border: 1px solid var(--color-gray-300);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .view-toggle__btn {
          padding: var(--space-2) var(--space-3);
          border: none;
          background: var(--bg-primary);
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .view-toggle__btn:hover {
          background: var(--color-gray-100);
          color: var(--text-primary);
        }

        .view-toggle__btn--active {
          background: var(--color-primary);
          color: var(--text-white);
        }

        .filter-panel {
          background: var(--bg-secondary);
          border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          margin-bottom: var(--space-6);
        }

        .filter-panel__title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--space-4);
        }

        .filter-categories {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .category-btn {
          padding: var(--space-2) var(--space-4);
          border: 1px solid var(--color-gray-300);
          border-radius: var(--radius-full);
          background: var(--bg-primary);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
          font-size: var(--font-size-sm);
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .category-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .category-btn--active {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: var(--text-white);
        }

        .category-count {
          font-size: var(--font-size-xs);
          opacity: 0.8;
        }

        .results-info {
          margin-bottom: var(--space-6);
        }

        .results-count {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          margin: 0;
        }

        .books-container--grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--space-6);
        }

        .books-container--list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .book-item--grid {
          background: var(--bg-primary);
          border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          transition: all var(--transition-base);
          position: relative;
          overflow: hidden;
        }

        .book-item--grid::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--gradient-primary);
          transform: scaleX(0);
          transition: transform var(--transition-base);
        }

        .book-item--grid:hover::before {
          transform: scaleX(1);
        }

        .book-item--grid:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
        }

        .book-item--list {
          background: var(--bg-primary);
          border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: var(--space-6);
          align-items: start;
          transition: all var(--transition-base);
        }

        .book-item--list:hover {
          box-shadow: var(--shadow-md);
          transform: translateX(4px);
        }

        .book-item__image-container {
          position: relative;
        }

        .book-item__image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-4);
        }

        .book-item--list .book-item__image {
          width: 120px;
          height: 160px;
          margin-bottom: 0;
        }

        .wishlist-btn {
          position: absolute;
          top: var(--space-2);
          right: var(--space-2);
          background: var(--bg-primary);
          border: 1px solid var(--color-gray-300);
          border-radius: var(--radius-full);
          padding: var(--space-2);
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-sm);
        }

        .wishlist-btn:hover {
          border-color: var(--color-danger);
          color: var(--color-danger);
          transform: scale(1.1);
        }

        .wishlist-btn--active {
          background: var(--color-danger);
          border-color: var(--color-danger);
          color: var(--text-white);
        }

        .book-item__content {
          flex: 1;
        }

        .book-item__category {
          margin-bottom: var(--space-2);
        }

        .book-item__title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--space-2);
          line-height: var(--line-height-tight);
        }

        .book-item__title a {
          color: var(--text-primary);
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .book-item__title a:hover {
          color: var(--color-primary);
        }

        .book-item__author {
          color: var(--text-secondary);
          margin-bottom: var(--space-3);
          font-size: var(--font-size-sm);
        }

        .book-item__rating {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          margin-bottom: var(--space-3);
          color: var(--color-accent);
          font-size: var(--font-size-sm);
        }

        .book-item__description {
          color: var(--text-secondary);
          margin-bottom: var(--space-4);
          line-height: var(--line-height-relaxed);
        }

        .book-item__footer {
          margin-bottom: var(--space-4);
        }

        .book-item__price {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-secondary);
          margin-bottom: var(--space-2);
        }

        .book-item__stock {
          font-size: var(--font-size-sm);
        }

        .stock-available {
          color: var(--color-success);
        }

        .stock-unavailable {
          color: var(--color-danger);
          font-weight: var(--font-weight-medium);
        }

        .book-item__actions {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
        }

        .book-item--list .book-item__actions {
          flex-direction: column;
          align-self: center;
          min-width: 150px;
        }

        .loading-container {
          text-align: center;
          padding: var(--space-16);
          color: var(--text-muted);
        }

        .empty-state {
          text-align: center;
          padding: var(--space-16);
          color: var(--text-muted);
        }

        .empty-state h3 {
          margin: var(--space-4) 0 var(--space-2);
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .catalog-controls {
            flex-direction: column;
            align-items: stretch;
            gap: var(--space-4);
          }

          .catalog-controls__left,
          .catalog-controls__right {
            width: 100%;
            justify-content: space-between;
          }

          .catalog-controls__right {
            display: flex;
            gap: var(--space-3);
          }

          .sort-select {
            flex: 1;
          }

          .books-container--grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }

          .book-item--list {
            grid-template-columns: auto 1fr;
            gap: var(--space-4);
          }

          .book-item--list .book-item__actions {
            grid-column: 1 / -1;
            flex-direction: row;
            justify-content: center;
            margin-top: var(--space-4);
            min-width: auto;
          }
        }

        @media (max-width: 640px) {
          .catalog-controls__left {
            flex-direction: column;
            gap: var(--space-3);
          }

          .books-container--grid {
            grid-template-columns: 1fr;
          }

          .book-item--list {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .book-item--list .book-item__image {
            width: 100px;
            height: 140px;
            margin: 0 auto;
          }
        }
      `}</style>
        </div>
    )
}