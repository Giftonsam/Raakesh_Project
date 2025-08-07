// src/components/user/BookCatalog.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Grid, List, Star, ShoppingCart } from 'lucide-react'
import WishlistButton from '../common/WishlistButton'

// Sample books data for demonstration
const sampleBooks = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0-7432-7356-5",
    category: "Fiction",
    price: 299,
    stock: 25,
    rating: 4.2,
    description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream through the eyes of narrator Nick Carraway.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop"
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0-06-112008-4",
    category: "Fiction",
    price: 349,
    stock: 18,
    rating: 4.5,
    description: "A gripping tale of racial injustice and childhood innocence in the American South, told through the eyes of young Scout Finch.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop"
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    isbn: "978-0-452-28423-4",
    category: "Science Fiction",
    price: 279,
    stock: 32,
    rating: 4.4,
    discountedPrice: 199,
    description: "A dystopian novel about totalitarianism and surveillance in a future society where Big Brother watches everyone.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop"
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "978-0-14-143951-8",
    category: "Romance",
    price: 259,
    stock: 22,
    rating: 4.3,
    description: "A witty and romantic novel about love, class, and social expectations in Regency England, following Elizabeth Bennet and Mr. Darcy.",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop"
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    isbn: "978-0-316-76948-0",
    category: "Fiction",
    price: 319,
    stock: 15,
    rating: 3.8,
    description: "A coming-of-age story following teenager Holden Caulfield as he navigates the complexities of adulthood in New York City.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop"
  },
  {
    id: 6,
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    isbn: "978-0-439-70818-8",
    category: "Fantasy",
    price: 399,
    stock: 45,
    rating: 4.7,
    discountedPrice: 299,
    description: "The first book in the magical Harry Potter series about a young wizard's adventures at Hogwarts School of Witchcraft and Wizardry.",
    image: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop"
  },
  {
    id: 7,
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    isbn: "978-0-544-00341-5",
    category: "Fantasy",
    price: 599,
    stock: 28,
    rating: 4.6,
    description: "An epic fantasy adventure following hobbits Frodo and Sam on their quest to destroy the One Ring and save Middle-earth.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop"
  },
  {
    id: 8,
    title: "Dune",
    author: "Frank Herbert",
    isbn: "978-0-441-17271-9",
    category: "Science Fiction",
    price: 449,
    stock: 20,
    rating: 4.1,
    discountedPrice: 349,
    description: "A science fiction epic set on the desert planet Arrakis, featuring political intrigue, mysticism, and the spice melange.",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop"
  },
  {
    id: 9,
    title: "The Alchemist",
    author: "Paulo Coelho",
    isbn: "978-0-06-231500-7",
    category: "Philosophy",
    price: 229,
    stock: 35,
    rating: 4.0,
    description: "A philosophical novel about a shepherd's journey to find his personal legend and the treasure that awaits him.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop"
  },
  {
    id: 10,
    title: "Steve Jobs",
    author: "Walter Isaacson",
    isbn: "978-1-4516-4853-9",
    category: "Biography",
    price: 499,
    stock: 12,
    rating: 4.4,
    description: "The definitive biography of Apple co-founder Steve Jobs, based on exclusive interviews and unprecedented access.",
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=600&fit=crop"
  },
  {
    id: 11,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    isbn: "978-0-06-231609-7",
    category: "History",
    price: 379,
    stock: 30,
    rating: 4.3,
    description: "A fascinating exploration of human history and our species' journey from hunter-gatherers to global dominance.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop"
  },
  {
    id: 12,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    isbn: "978-0-85285-468-4",
    category: "Finance",
    price: 329,
    stock: 25,
    rating: 4.2,
    discountedPrice: 249,
    description: "Timeless lessons on wealth, greed, and happiness from the perspective of behavioral psychology and personal finance.",
    image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=600&fit=crop"
  }
]

// Sample categories extracted from books
const sampleCategories = [
  { id: 1, name: "Fiction" },
  { id: 2, name: "Science Fiction" },
  { id: 3, name: "Fantasy" },
  { id: 4, name: "Romance" },
  { id: 5, name: "Philosophy" },
  { id: 6, name: "Biography" },
  { id: 7, name: "History" },
  { id: 8, name: "Finance" }
]

export default function BookCatalog() {
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('title')
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    fetchBooks()
    fetchCategories()
    fetchWishlist()
  }, [])

  const fetchBooks = async () => {
    try {
      // Simulate API call with sample data
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate loading time
      setBooks(sampleBooks)
    } catch (error) {
      console.error('Error fetching books:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      // Simulate API call with sample data
      await new Promise(resolve => setTimeout(resolve, 500))
      setCategories(sampleCategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchWishlist = async () => {
    try {
      // Simulate API call - start with some books in wishlist for demo
      await new Promise(resolve => setTimeout(resolve, 300))
      setWishlist([1, 6, 11]) // Pre-add some books to wishlist for demo
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    }
  }

  const handleToggleWishlist = async (bookId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200))

      setWishlist(prev =>
        prev.includes(bookId)
          ? prev.filter(id => id !== bookId)
          : [...prev, bookId]
      )

      // Show feedback to user
      const isAdding = !wishlist.includes(bookId)
      const book = books.find(b => b.id === bookId)
      const message = isAdding
        ? `"${book?.title}" added to wishlist!`
        : `"${book?.title}" removed from wishlist!`

      // You can replace this with a toast notification
      const notification = document.createElement('div')
      notification.textContent = message
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-secondary);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-size: 14px;
      `
      document.body.appendChild(notification)
      setTimeout(() => document.body.removeChild(notification), 3000)

    } catch (error) {
      console.error('Error toggling wishlist:', error)
    }
  }

  const handleAddToCart = async (bookId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))

      const book = books.find(b => b.id === bookId)

      // Show success feedback
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
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-size: 14px;
      `
      document.body.appendChild(notification)
      setTimeout(() => document.body.removeChild(notification), 3000)

    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Error adding book to cart')
    }
  }

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
          return (a.discountedPrice || a.price) - (b.discountedPrice || b.price)
        case 'price-high':
          return (b.discountedPrice || b.price) - (a.discountedPrice || a.price)
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        default:
          return 0
      }
    })

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

        {/* Fixed Wishlist Button */}
        <WishlistButton
          bookId={book.id}
          isInWishlist={wishlist.includes(book.id)}
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

          {!isGridView && (
            <p className="book-description">
              {book.description?.substring(0, 150)}...
            </p>
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
            className="btn btn--primary"
            disabled={book.stock === 0}
          >
            <ShoppingCart size={16} />
            {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner spinner--lg"></div>
            <p>Loading books...</p>
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
                <option key={category.id || category} value={category.name || category}>
                  {category.name || category}
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
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
              >
                <List size={20} />
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
                .loading-container {
                    text-align: center;
                    padding: var(--space-16);
                    color: var(--text-muted);
                }

                .demo-features {
                    display: flex;
                    justify-content: center;
                    gap: var(--space-6);
                    margin-top: var(--space-3);
                    flex-wrap: wrap;
                }

                .demo-feature {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    color: var(--color-primary-dark);
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-medium);
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

                    .demo-features {
                        flex-direction: column;
                        gap: var(--space-2);
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