import React, { useState } from 'react'
import { useBookContext } from '../../context/BookContext'
import {
    Package,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Search,
    Plus,
    Minus,
    Edit,
    CheckCircle,
    X
} from 'lucide-react'

export default function StockManagement() {
    const { books, updateBook, isLoading, error, clearError } = useBookContext()
    const [searchQuery, setSearchQuery] = useState('')
    const [stockFilter, setStockFilter] = useState('all')
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [selectedBook, setSelectedBook] = useState(null)
    const [stockUpdate, setStockUpdate] = useState({
        quantity: '',
        operation: 'set', // 'set', 'add', 'subtract'
        reason: ''
    })
    const [isUpdating, setIsUpdating] = useState(false)
    const [updateMessage, setUpdateMessage] = useState('')

    const lowStockThreshold = 5
    const outOfStockThreshold = 0

    // Filter books based on search and stock levels
    const filteredBooks = books.filter(book => {
        const matchesSearch = searchQuery === '' ||
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.barcode.includes(searchQuery)

        const matchesStock = stockFilter === 'all' ||
            (stockFilter === 'low' && book.quantity > 0 && book.quantity <= lowStockThreshold) ||
            (stockFilter === 'out' && book.quantity === 0) ||
            (stockFilter === 'available' && book.quantity > lowStockThreshold)

        return matchesSearch && matchesStock
    })

    // Calculate stock statistics
    const stockStats = {
        total: books.length,
        lowStock: books.filter(book => book.quantity > 0 && book.quantity <= lowStockThreshold).length,
        outOfStock: books.filter(book => book.quantity === 0).length,
        available: books.filter(book => book.quantity > lowStockThreshold).length,
        totalValue: books.reduce((sum, book) => sum + (book.price * book.quantity), 0)
    }

    const handleOpenUpdateModal = (book) => {
        setSelectedBook(book)
        setStockUpdate({
            quantity: book.quantity.toString(),
            operation: 'set',
            reason: ''
        })
        setShowUpdateModal(true)
        setUpdateMessage('')
        clearError()
    }

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false)
        setSelectedBook(null)
        setStockUpdate({ quantity: '', operation: 'set', reason: '' })
        setUpdateMessage('')
    }

    const handleStockUpdate = async (e) => {
        e.preventDefault()
        setIsUpdating(true)

        try {
            let newQuantity = parseInt(stockUpdate.quantity)

            if (stockUpdate.operation === 'add') {
                newQuantity = selectedBook.quantity + newQuantity
            } else if (stockUpdate.operation === 'subtract') {
                newQuantity = Math.max(0, selectedBook.quantity - newQuantity)
            }

            const updatedBook = {
                ...selectedBook,
                quantity: newQuantity
            }

            const result = await updateBook(selectedBook.id, updatedBook)

            if (result.success) {
                setUpdateMessage(`Stock updated successfully! ${stockUpdate.reason ? `Reason: ${stockUpdate.reason}` : ''}`)
                setTimeout(() => {
                    handleCloseUpdateModal()
                }, 2000)
            }
        } catch (error) {
            console.error('Error updating stock:', error)
        } finally {
            setIsUpdating(false)
        }
    }

    const getStockStatus = (quantity) => {
        if (quantity === 0) return { status: 'out', color: 'danger', label: 'Out of Stock' }
        if (quantity <= lowStockThreshold) return { status: 'low', color: 'warning', label: 'Low Stock' }
        return { status: 'available', color: 'success', label: 'Available' }
    }

    const quickStockAdjust = async (bookId, adjustment) => {
        const book = books.find(b => b.id === bookId)
        if (!book) return

        const newQuantity = Math.max(0, book.quantity + adjustment)
        const updatedBook = { ...book, quantity: newQuantity }

        await updateBook(bookId, updatedBook)
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page__header">
                    <h1 className="page__title">Stock Management</h1>
                    <p className="page__subtitle">Monitor and manage your inventory levels</p>
                </div>

                {/* Stock Statistics */}
                <div className="stock-stats">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <Package size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stockStats.total}</div>
                            <div className="stat-label">Total Books</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon stat-icon--success">
                            <CheckCircle size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stockStats.available}</div>
                            <div className="stat-label">Well Stocked</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon stat-icon--warning">
                            <AlertTriangle size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stockStats.lowStock}</div>
                            <div className="stat-label">Low Stock</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon stat-icon--danger">
                            <X size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stockStats.outOfStock}</div>
                            <div className="stat-label">Out of Stock</div>
                        </div>
                    </div>

                    <div className="stat-card stat-card--wide">
                        <div className="stat-icon stat-icon--primary">
                            <TrendingUp size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">₹{stockStats.totalValue.toLocaleString()}</div>
                            <div className="stat-label">Total Inventory Value</div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="alert alert--error">
                        <AlertTriangle size={20} />
                        {error}
                        <button onClick={clearError} className="alert__close">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Controls */}
                <div className="stock-controls">
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
                            value={stockFilter}
                            onChange={(e) => setStockFilter(e.target.value)}
                            className="form-input stock-filter"
                        >
                            <option value="all">All Stock Levels</option>
                            <option value="available">Well Stocked</option>
                            <option value="low">Low Stock (≤{lowStockThreshold})</option>
                            <option value="out">Out of Stock</option>
                        </select>
                    </div>
                </div>

                {/* Stock Table */}
                <div className="card">
                    {isLoading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Loading stock data...</p>
                        </div>
                    ) : filteredBooks.length > 0 ? (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Book</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Current Stock</th>
                                        <th>Stock Value</th>
                                        <th>Status</th>
                                        <th>Quick Actions</th>
                                        <th>Manage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBooks.map(book => {
                                        const stockStatus = getStockStatus(book.quantity)
                                        const stockValue = book.price * book.quantity

                                        return (
                                            <tr key={book.id} className={`stock-row stock-row--${stockStatus.status}`}>
                                                <td>
                                                    <div className="book-info">
                                                        <img
                                                            src={book.image}
                                                            alt={book.title}
                                                            className="book-thumb"
                                                        />
                                                        <div>
                                                            <div className="book-title">{book.title}</div>
                                                            <div className="book-author">{book.author}</div>
                                                            <div className="book-barcode">#{book.barcode}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge badge--primary">{book.category}</span>
                                                </td>
                                                <td className="price-cell">₹{book.price.toLocaleString()}</td>
                                                <td>
                                                    <div className="stock-quantity">
                                                        <span className={`quantity-display quantity-display--${stockStatus.status}`}>
                                                            {book.quantity}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="value-cell">₹{stockValue.toLocaleString()}</td>
                                                <td>
                                                    <span className={`badge badge--${stockStatus.color}`}>
                                                        {stockStatus.label}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="quick-actions">
                                                        <button
                                                            onClick={() => quickStockAdjust(book.id, -1)}
                                                            disabled={book.quantity <= 0 || isLoading}
                                                            className="quick-btn quick-btn--subtract"
                                                            title="Decrease by 1"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => quickStockAdjust(book.id, 1)}
                                                            disabled={isLoading}
                                                            className="quick-btn quick-btn--add"
                                                            title="Increase by 1"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => handleOpenUpdateModal(book)}
                                                        className="btn btn--outline btn--sm"
                                                        title="Manage stock"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <Package size={48} />
                            <h3>No Books Found</h3>
                            <p>
                                {searchQuery || stockFilter !== 'all'
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'No books available in inventory.'
                                }
                            </p>
                        </div>
                    )}
                </div>

                {/* Stock Update Modal */}
                {showUpdateModal && selectedBook && (
                    <div className="modal-overlay" onClick={handleCloseUpdateModal}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal__header">
                                <h3 className="modal__title">Update Stock - {selectedBook.title}</h3>
                                <button onClick={handleCloseUpdateModal} className="modal__close">
                                    <X size={20} />
                                </button>
                            </div>

                            {updateMessage && (
                                <div className="alert alert--success" style={{ margin: '0 var(--space-6)' }}>
                                    <CheckCircle size={20} />
                                    {updateMessage}
                                </div>
                            )}

                            <form onSubmit={handleStockUpdate}>
                                <div className="modal__body">
                                    <div className="current-stock-info">
                                        <div className="current-stock">
                                            <span className="current-label">Current Stock:</span>
                                            <span className="current-value">{selectedBook.quantity} units</span>
                                        </div>
                                        <div className="current-value-info">
                                            <span className="current-label">Current Value:</span>
                                            <span className="current-value">₹{(selectedBook.price * selectedBook.quantity).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Stock Operation</label>
                                        <select
                                            value={stockUpdate.operation}
                                            onChange={(e) => setStockUpdate(prev => ({ ...prev, operation: e.target.value }))}
                                            className="form-input"
                                        >
                                            <option value="set">Set Exact Quantity</option>
                                            <option value="add">Add to Current Stock</option>
                                            <option value="subtract">Remove from Current Stock</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="quantity" className="form-label">
                                            {stockUpdate.operation === 'set' ? 'New Quantity' :
                                                stockUpdate.operation === 'add' ? 'Quantity to Add' : 'Quantity to Remove'}
                                        </label>
                                        <input
                                            type="number"
                                            id="quantity"
                                            value={stockUpdate.quantity}
                                            onChange={(e) => setStockUpdate(prev => ({ ...prev, quantity: e.target.value }))}
                                            className="form-input"
                                            required
                                            min="0"
                                            placeholder="Enter quantity"
                                        />

                                        {stockUpdate.quantity && (
                                            <div className="form-help">
                                                {stockUpdate.operation === 'set' && (
                                                    <span>New stock will be: {stockUpdate.quantity} units</span>
                                                )}
                                                {stockUpdate.operation === 'add' && (
                                                    <span>New stock will be: {selectedBook.quantity + parseInt(stockUpdate.quantity || 0)} units</span>
                                                )}
                                                {stockUpdate.operation === 'subtract' && (
                                                    <span>New stock will be: {Math.max(0, selectedBook.quantity - parseInt(stockUpdate.quantity || 0))} units</span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="reason" className="form-label">Reason for Update (Optional)</label>
                                        <textarea
                                            id="reason"
                                            value={stockUpdate.reason}
                                            onChange={(e) => setStockUpdate(prev => ({ ...prev, reason: e.target.value }))}
                                            className="form-input"
                                            rows="3"
                                            placeholder="e.g., New shipment received, Damaged goods removed, etc."
                                        />
                                    </div>
                                </div>

                                <div className="modal__footer">
                                    <button
                                        type="button"
                                        onClick={handleCloseUpdateModal}
                                        className="btn btn--outline"
                                        disabled={isUpdating}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUpdating || !stockUpdate.quantity}
                                        className="btn btn--primary"
                                    >
                                        {isUpdating ? (
                                            <>
                                                <div className="spinner spinner--sm"></div>
                                                Updating...
                                            </>
                                        ) : (
                                            'Update Stock'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
        .stock-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-4);
          margin-bottom: var(--space-8);
        }

        .stat-card {
          background: var(--bg-primary);
          border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          display: flex;
          align-items: center;
          gap: var(--space-4);
          transition: all var(--transition-base);
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .stat-card--wide {
          grid-column: span 2;
        }

        .stat-icon {
          background: var(--color-primary-light);
          color: var(--color-primary-dark);
          padding: var(--space-3);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon--success {
          background: var(--color-secondary-light);
          color: var(--color-secondary-dark);
        }

        .stat-icon--warning {
          background: rgba(245, 158, 11, 0.2);
          color: var(--color-accent-dark);
        }

        .stat-icon--danger {
          background: var(--color-danger-light);
          color: var(--color-danger-dark);
        }

        .stat-icon--primary {
          background: var(--color-primary-light);
          color: var(--color-primary-dark);
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
          display: block;
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .stock-controls {
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
          max-width: 500px;
        }

        .stock-filter {
          min-width: 180px;
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

        .stock-row--out {
          background: rgba(239, 68, 68, 0.05);
        }

        .stock-row--low {
          background: rgba(245, 158, 11, 0.05);
        }

        .book-info {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .book-thumb {
          width: 40px;
          height: 56px;
          object-fit: cover;
          border-radius: var(--radius-base);
        }

        .book-title {
          font-weight: var(--font-weight-medium);
          margin-bottom: var(--space-1);
        }

        .book-author {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          margin-bottom: var(--space-1);
        }

        .book-barcode {
          font-size: var(--font-size-xs);
          color: var(--text-muted);
        }

        .price-cell {
          font-weight: var(--font-weight-semibold);
          color: var(--color-secondary);
        }

        .value-cell {
          font-weight: var(--font-weight-semibold);
          color: var(--color-primary);
        }

        .stock-quantity {
          text-align: center;
        }

        .quantity-display {
          display: inline-block;
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-full);
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-lg);
        }

        .quantity-display--available {
          background: var(--color-secondary-light);
          color: var(--color-secondary-dark);
        }

        .quantity-display--low {
          background: rgba(245, 158, 11, 0.2);
          color: var(--color-accent-dark);
        }

        .quantity-display--out {
          background: var(--color-danger-light);
          color: var(--color-danger-dark);
        }

        .quick-actions {
          display: flex;
          gap: var(--space-1);
          justify-content: center;
        }

        .quick-btn {
          background: var(--bg-secondary);
          border: 1px solid var(--color-gray-300);
          border-radius: var(--radius-base);
          padding: var(--space-1);
          color: var(--text-primary);
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .quick-btn:hover:not(:disabled) {
          transform: scale(1.1);
        }

        .quick-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quick-btn--add:hover:not(:disabled) {
          background: var(--color-success);
          border-color: var(--color-success);
          color: var(--text-white);
        }

        .quick-btn--subtract:hover:not(:disabled) {
          background: var(--color-danger);
          border-color: var(--color-danger);
          color: var(--text-white);
        }

        .current-stock-info {
          background: var(--bg-secondary);
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-6);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        .current-stock,
        .current-value-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .current-label {
          font-weight: var(--font-weight-medium);
          color: var(--text-secondary);
        }

        .current-value {
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
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

        @media (max-width: 1200px) {
          .stat-card--wide {
            grid-column: span 1;
          }
        }

        @media (max-width: 768px) {
          .stock-stats {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }

          .stock-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .search-filter-group {
            max-width: 100%;
          }

          .current-stock-info {
            grid-template-columns: 1fr;
          }

          .quick-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 640px) {
          .search-filter-group {
            flex-direction: column;
          }

          .stock-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    )
}