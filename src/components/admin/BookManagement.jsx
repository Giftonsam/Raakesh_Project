import React, { useState } from 'react'
import { useBookContext } from '../../context/BookContext'
import {
    Plus,
    Edit,
    Trash2,
    Search,
    Filter,
    BookOpen,
    AlertCircle,
    X
} from 'lucide-react'

export default function BookManagement() {
    const {
        books,
        addBook,
        updateBook,
        deleteBook,
        isLoading,
        error,
        clearError
    } = useBookContext()

    const [showModal, setShowModal] = useState(false)
    const [editingBook, setEditingBook] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [formData, setFormData] = useState({
        barcode: '',
        title: '',
        author: '',
        price: '',
        quantity: '',
        category: 'Programming',
        description: '',
        image: ''
    })

    const categories = ['Programming', 'Web Development', 'Software Engineering', 'Computer Science', 'Technology']

    const filteredBooks = books.filter(book => {
        const matchesSearch = searchQuery === '' ||
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.barcode.includes(searchQuery)

        const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory

        return matchesSearch && matchesCategory
    })

    const handleOpenModal = (book = null) => {
        if (book) {
            setEditingBook(book)
            setFormData({
                barcode: book.barcode,
                title: book.title,
                author: book.author,
                price: book.price.toString(),
                quantity: book.quantity.toString(),
                category: book.category,
                description: book.description || '',
                image: book.image || ''
            })
        } else {
            setEditingBook(null)
            setFormData({
                barcode: '',
                title: '',
                author: '',
                price: '',
                quantity: '',
                category: 'Programming',
                description: '',
                image: ''
            })
        }
        setShowModal(true)
        clearError()
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setEditingBook(null)
        clearError()
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const bookData = {
            ...formData,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity),
            image: formData.image || `https://via.placeholder.com/200x300/3b82f6/ffffff?text=${encodeURIComponent(formData.title.substring(0, 10))}`
        }

        let result
        if (editingBook) {
            result = await updateBook(editingBook.id, bookData)
        } else {
            result = await addBook(bookData)
        }

        if (result.success) {
            handleCloseModal()
        }
    }

    const handleDelete = async (bookId) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            await deleteBook(bookId)
        }
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page__header">
                    <h1 className="page__title">Book Management</h1>
                    <p className="page__subtitle">Manage your book inventory</p>
                </div>

                {error && (
                    <div className="alert alert--error">
                        <AlertCircle size={20} />
                        {error}
                        <button onClick={clearError} className="alert__close">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Controls */}
                <div className="book-management__controls">
                    <div className="search-filter-group">
                        <div className="search-bar">
                            <Search className="search-bar__icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search books..."
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
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => handleOpenModal()}
                        className="btn btn--primary"
                    >
                        <Plus size={20} />
                        Add New Book
                    </button>
                </div>

                {/* Books Table */}
                <div className="card">
                    {isLoading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Loading books...</p>
                        </div>
                    ) : filteredBooks.length > 0 ? (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBooks.map(book => (
                                        <tr key={book.id}>
                                            <td>
                                                <img
                                                    src={book.image}
                                                    alt={book.title}
                                                    className="book-table-image"
                                                />
                                            </td>
                                            <td>
                                                <div className="book-table-title">{book.title}</div>
                                                <div className="book-table-barcode">#{book.barcode}</div>
                                            </td>
                                            <td>{book.author}</td>
                                            <td>
                                                <span className="badge badge--primary">{book.category}</span>
                                            </td>
                                            <td className="book-table-price">₹{book.price.toLocaleString()}</td>
                                            <td>
                                                <span className={`badge ${book.quantity <= 5 ? 'badge--danger' : 'badge--success'}`}>
                                                    {book.quantity}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="book-table-actions">
                                                    <button
                                                        onClick={() => handleOpenModal(book)}
                                                        className="btn btn--outline btn--sm"
                                                        title="Edit book"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(book.id)}
                                                        className="btn btn--danger btn--sm"
                                                        title="Delete book"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <BookOpen size={48} />
                            <h3>No Books Found</h3>
                            <p>
                                {searchQuery || selectedCategory !== 'all'
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'Start by adding your first book to the inventory.'
                                }
                            </p>
                            {(!searchQuery && selectedCategory === 'all') && (
                                <button
                                    onClick={() => handleOpenModal()}
                                    className="btn btn--primary mt-4"
                                >
                                    <Plus size={20} />
                                    Add First Book
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Add/Edit Book Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={handleCloseModal}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal__header">
                                <h3 className="modal__title">
                                    {editingBook ? 'Edit Book' : 'Add New Book'}
                                </h3>
                                <button onClick={handleCloseModal} className="modal__close">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="modal__body">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="title" className="form-label">Title *</label>
                                            <input
                                                type="text"
                                                id="title"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                className="form-input"
                                                required
                                                placeholder="Book title"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="barcode" className="form-label">Barcode *</label>
                                            <input
                                                type="text"
                                                id="barcode"
                                                name="barcode"
                                                value={formData.barcode}
                                                onChange={handleChange}
                                                className="form-input"
                                                required
                                                placeholder="ISBN or barcode"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="author" className="form-label">Author *</label>
                                        <input
                                            type="text"
                                            id="author"
                                            name="author"
                                            value={formData.author}
                                            onChange={handleChange}
                                            className="form-input"
                                            required
                                            placeholder="Author name"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="category" className="form-label">Category *</label>
                                            <select
                                                id="category"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="form-input"
                                                required
                                            >
                                                {categories.map(category => (
                                                    <option key={category} value={category}>{category}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="price" className="form-label">Price (₹) *</label>
                                            <input
                                                type="number"
                                                id="price"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                className="form-input"
                                                required
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="quantity" className="form-label">Stock Quantity *</label>
                                            <input
                                                type="number"
                                                id="quantity"
                                                name="quantity"
                                                value={formData.quantity}
                                                onChange={handleChange}
                                                className="form-input"
                                                required
                                                min="0"
                                                placeholder="0"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="image" className="form-label">Image URL</label>
                                            <input
                                                type="url"
                                                id="image"
                                                name="image"
                                                value={formData.image}
                                                onChange={handleChange}
                                                className="form-input"
                                                placeholder="https://example.com/book-cover.jpg"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="form-input"
                                            rows="4"
                                            placeholder="Book description..."
                                        />
                                    </div>
                                </div>

                                <div className="modal__footer">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="btn btn--outline"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="btn btn--primary"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="spinner spinner--sm"></div>
                                                {editingBook ? 'Updating...' : 'Adding...'}
                                            </>
                                        ) : (
                                            editingBook ? 'Update Book' : 'Add Book'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
        .book-management__controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
          flex-wrap: wrap;
        }

        .search-filter-group {
          display: flex;
          gap: var(--space-4);
          flex: 1;
          max-width: 600px;
        }

        .category-filter {
          min-width: 150px;
        }

        .book-table-image {
          width: 40px;
          height: 56px;
          object-fit: cover;
          border-radius: var(--radius-base);
        }

        .book-table-title {
          font-weight: var(--font-weight-medium);
          margin-bottom: var(--space-1);
        }

        .book-table-barcode {
          font-size: var(--font-size-xs);
          color: var(--text-muted);
        }

        .book-table-price {
          font-weight: var(--font-weight-semibold);
          color: var(--color-secondary);
        }

        .book-table-actions {
          display: flex;
          gap: var(--space-2);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        .alert__close {
          background: none;
          border: none;
          color: currentColor;
          cursor: pointer;
          margin-left: auto;
          padding: var(--space-1);
          border-radius: var(--radius-base);
          transition: background var(--transition-fast);
        }

        .alert__close:hover {
          background: rgba(255, 255, 255, 0.2);
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

        .table-container {
          overflow-x: auto;
        }

        @media (max-width: 768px) {
          .book-management__controls {
            flex-direction: column;
            align-items: stretch;
          }

          .search-filter-group {
            max-width: 100%;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .book-table-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 640px) {
          .search-filter-group {
            flex-direction: column;
          }
        }
      `}</style>
        </div>
    )
}