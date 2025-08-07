import React, { useState } from 'react'
import { useBookContext } from '../../context/BookContext'
import { useAuth } from '../../hooks/useAuth'
import {
    Star,
    Send,
    BookOpen,
    MessageSquare,
    CheckCircle,
    AlertCircle
} from 'lucide-react'

export default function Feedback() {
    const { books } = useBookContext()
    const { user } = useAuth()

    const [selectedBook, setSelectedBook] = useState('')
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitMessage, setSubmitMessage] = useState('')
    const [messageType, setMessageType] = useState('')

    const handleRatingClick = (value) => {
        setRating(value)
    }

    const handleRatingHover = (value) => {
        setHoverRating(value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!selectedBook || rating === 0) {
            setMessageType('error')
            setSubmitMessage('Please select a book and provide a rating.')
            return
        }

        setIsSubmitting(true)

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            // In real implementation, this would be an API call
            const feedbackData = {
                userId: user.id,
                bookId: parseInt(selectedBook),
                rating,
                comment: comment.trim(),
                createdAt: new Date().toISOString()
            }

            console.log('Feedback submitted:', feedbackData)

            // Reset form
            setSelectedBook('')
            setRating(0)
            setComment('')

            setMessageType('success')
            setSubmitMessage('Thank you for your feedback! Your review has been submitted.')

            // Clear message after 5 seconds
            setTimeout(() => {
                setSubmitMessage('')
                setMessageType('')
            }, 5000)

        } catch (error) {
            setMessageType('error')
            setSubmitMessage('Failed to submit feedback. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const getRatingText = (rating) => {
        switch (rating) {
            case 1: return 'Poor'
            case 2: return 'Fair'
            case 3: return 'Good'
            case 4: return 'Very Good'
            case 5: return 'Excellent'
            default: return ''
        }
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page__header">
                    <h1 className="page__title">Share Your Feedback</h1>
                    <p className="page__subtitle">Help other readers by sharing your book reviews</p>
                </div>

                {submitMessage && (
                    <div className={`alert alert--${messageType}`}>
                        {messageType === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        {submitMessage}
                    </div>
                )}

                <div className="feedback-layout">
                    <div className="feedback-form-section">
                        <div className="card">
                            <div className="card__header">
                                <h2 className="section-title">
                                    <MessageSquare size={24} />
                                    Write a Review
                                </h2>
                            </div>

                            <div className="card__body">
                                <form onSubmit={handleSubmit} className="feedback-form">
                                    <div className="form-group">
                                        <label htmlFor="book-select" className="form-label">
                                            Select a Book *
                                        </label>
                                        <select
                                            id="book-select"
                                            value={selectedBook}
                                            onChange={(e) => setSelectedBook(e.target.value)}
                                            className="form-input"
                                            required
                                        >
                                            <option value="">Choose a book to review...</option>
                                            {books.map(book => (
                                                <option key={book.id} value={book.id}>
                                                    {book.title} - {book.author}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Rating * {rating > 0 && <span className="rating-text">({getRatingText(rating)})</span>}
                                        </label>
                                        <div className="rating-container">
                                            {[1, 2, 3, 4, 5].map(value => (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    onClick={() => handleRatingClick(value)}
                                                    onMouseEnter={() => handleRatingHover(value)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    className={`rating-star ${value <= (hoverRating || rating) ? 'rating-star--active' : ''
                                                        }`}
                                                >
                                                    <Star size={24} fill={value <= (hoverRating || rating) ? 'currentColor' : 'none'} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="comment" className="form-label">
                                            Review Comment
                                        </label>
                                        <textarea
                                            id="comment"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="form-input"
                                            rows="5"
                                            placeholder="Share your thoughts about this book... (optional)"
                                            maxLength="500"
                                        />
                                        <div className="form-help">
                                            {comment.length}/500 characters
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !selectedBook || rating === 0}
                                        className="btn btn--primary submit-btn"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="spinner spinner--sm"></div>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                Submit Review
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="feedback-info-section">
                        <div className="card">
                            <div className="card__header">
                                <h3 className="section-title">Why Your Review Matters</h3>
                            </div>
                            <div className="card__body">
                                <div className="feedback-benefits">
                                    <div className="benefit-item">
                                        <Star className="benefit-icon" size={20} />
                                        <div>
                                            <h4>Help Other Readers</h4>
                                            <p>Your honest reviews help fellow book lovers make informed decisions.</p>
                                        </div>
                                    </div>

                                    <div className="benefit-item">
                                        <BookOpen className="benefit-icon" size={20} />
                                        <div>
                                            <h4>Discover New Books</h4>
                                            <p>Book recommendations improve based on community feedback.</p>
                                        </div>
                                    </div>

                                    <div className="benefit-item">
                                        <MessageSquare className="benefit-icon" size={20} />
                                        <div>
                                            <h4>Share Your Thoughts</h4>
                                            <p>Express your opinions and contribute to our reading community.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card__header">
                                <h3 className="section-title">Review Guidelines</h3>
                            </div>
                            <div className="card__body">
                                <div className="guidelines">
                                    <ul className="guidelines-list">
                                        <li>✅ Be honest and constructive in your reviews</li>
                                        <li>✅ Focus on the book's content, writing style, and usefulness</li>
                                        <li>✅ Mention specific aspects you liked or disliked</li>
                                        <li>❌ Avoid spoilers in your reviews</li>
                                        <li>❌ Keep reviews respectful and professional</li>
                                        <li>❌ Don't include personal information</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .feedback-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--space-8);
          align-items: start;
        }

        .section-title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          margin: 0;
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .feedback-form {
          max-width: 500px;
        }

        .rating-text {
          color: var(--color-accent);
          font-weight: var(--font-weight-medium);
          font-size: var(--font-size-sm);
        }

        .rating-container {
          display: flex;
          gap: var(--space-1);
          margin-top: var(--space-2);
        }

        .rating-star {
          background: none;
          border: none;
          color: var(--color-gray-300);
          cursor: pointer;
          padding: var(--space-1);
          border-radius: var(--radius-base);
          transition: all var(--transition-fast);
        }

        .rating-star:hover {
          transform: scale(1.1);
        }

        .rating-star--active {
          color: var(--color-accent);
        }

        .submit-btn {
          width: 100%;
          margin-top: var(--space-4);
        }

        .feedback-benefits {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .benefit-item {
          display: flex;
          gap: var(--space-3);
          align-items: start;
        }

        .benefit-icon {
          color: var(--color-primary);
          margin-top: var(--space-1);
          flex-shrink: 0;
        }

        .benefit-item h4 {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--space-1);
          color: var(--text-primary);
        }

        .benefit-item p {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          line-height: var(--line-height-relaxed);
          margin: 0;
        }

        .guidelines-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .guidelines-list li {
          font-size: var(--font-size-sm);
          line-height: var(--line-height-relaxed);
          color: var(--text-secondary);
        }

        @media (max-width: 1024px) {
          .feedback-layout {
            grid-template-columns: 1fr;
            gap: var(--space-6);
          }
        }

        @media (max-width: 768px) {
          .rating-container {
            justify-content: center;
          }

          .feedback-form {
            max-width: 100%;
          }
        }
      `}</style>
        </div>
    )
}