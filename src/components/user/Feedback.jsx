// src/components/user/Feedback.jsx
import React, { useState, useEffect } from 'react'
import { useBookContext } from '../../context/BookContext'
import { useAuth } from '../../hooks/useAuth'
import {
    Star,
    Send,
    BookOpen,
    MessageSquare,
    CheckCircle,
    AlertCircle,
    ThumbsUp,
    Award,
    TrendingUp,
    User,
    Calendar
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
    const [recentReviews, setRecentReviews] = useState([])

    // Mock recent reviews data
    useEffect(() => {
        const mockReviews = [
            {
                id: 1,
                userName: 'Alice Johnson',
                bookTitle: 'The Go Programming Language',
                rating: 5,
                comment: 'Excellent book for learning Go! Very comprehensive and well-written.',
                date: '2024-01-10',
                helpful: 12
            },
            {
                id: 2,
                userName: 'Bob Smith',
                bookTitle: 'Clean Code',
                rating: 4,
                comment: 'Great insights into writing maintainable code. A must-read for developers.',
                date: '2024-01-08',
                helpful: 8
            },
            {
                id: 3,
                userName: 'Carol Davis',
                bookTitle: 'JavaScript: The Good Parts',
                rating: 4,
                comment: 'Concise and to the point. Helped me understand JavaScript better.',
                date: '2024-01-05',
                helpful: 15
            }
        ]
        setRecentReviews(mockReviews)
    }, [])

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
            await new Promise(resolve => setTimeout(resolve, 2000))

            const feedbackData = {
                userId: user.id,
                bookId: parseInt(selectedBook),
                rating,
                comment: comment.trim(),
                createdAt: new Date().toISOString()
            }

            console.log('Feedback submitted:', feedbackData)

            // Add to recent reviews for demo
            const selectedBookData = books.find(book => book.id === parseInt(selectedBook))
            const newReview = {
                id: Date.now(),
                userName: `${user.firstname} ${user.lastname}`,
                bookTitle: selectedBookData?.title || 'Unknown Book',
                rating,
                comment: comment.trim() || 'No comment provided',
                date: new Date().toISOString().split('T')[0],
                helpful: 0
            }

            setRecentReviews(prev => [newReview, ...prev.slice(0, 4)])

            // Reset form
            setSelectedBook('')
            setRating(0)
            setComment('')

            setMessageType('success')
            setSubmitMessage('🎉 Thank you for your feedback! Your review has been submitted and will help other readers.')

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
            case 1: return 'Poor - Not recommended'
            case 2: return 'Fair - Below expectations'
            case 3: return 'Good - Worth reading'
            case 4: return 'Very Good - Highly recommended'
            case 5: return 'Excellent - Must read!'
            default: return ''
        }
    }

    const getRatingEmoji = (rating) => {
        switch (rating) {
            case 1: return '😞'
            case 2: return '😐'
            case 3: return '🙂'
            case 4: return '😊'
            case 5: return '🤩'
            default: return ''
        }
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page__header">
                    <h1 className="page__title">Share Your Feedback</h1>
                    <p className="page__subtitle">Help build our reading community by sharing your book reviews</p>
                </div>

                {submitMessage && (
                    <div className={`alert alert--${messageType} enhanced-alert`}>
                        {messageType === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        {submitMessage}
                    </div>
                )}

                <div className="feedback-layout">
                    <div className="feedback-form-section">
                        <div className="card enhanced-card">
                            <div className="card__header">
                                <h2 className="section-title">
                                    <MessageSquare size={24} />
                                    Write a Review
                                </h2>
                                <div className="review-stats">
                                    <span className="stat-badge">
                                        <Award size={16} />
                                        Reviewer Level: {recentReviews.filter(r => r.userName.includes(user?.firstname || '')).length > 0 ? 'Active' : 'New'}
                                    </span>
                                </div>
                            </div>

                            <div className="card__body">
                                <form onSubmit={handleSubmit} className="feedback-form">
                                    <div className="form-group">
                                        <label htmlFor="book-select" className="form-label enhanced-label">
                                            <BookOpen size={18} />
                                            Select a Book *
                                        </label>
                                        <select
                                            id="book-select"
                                            value={selectedBook}
                                            onChange={(e) => setSelectedBook(e.target.value)}
                                            className="form-input enhanced-select"
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
                                        <label className="form-label enhanced-label">
                                            <Star size={18} />
                                            Rating * 
                                            {rating > 0 && (
                                                <span className="rating-text">
                                                    {getRatingEmoji(rating)} {getRatingText(rating)}
                                                </span>
                                            )}
                                        </label>
                                        <div className="rating-container">
                                            <div className="rating-stars">
                                                {[1, 2, 3, 4, 5].map(value => (
                                                    <button
                                                        key={value}
                                                        type="button"
                                                        onClick={() => handleRatingClick(value)}
                                                        onMouseEnter={() => handleRatingHover(value)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                        className={`rating-star ${value <= (hoverRating || rating) ? 'rating-star--active' : ''}`}
                                                    >
                                                        <Star size={32} fill={value <= (hoverRating || rating) ? 'currentColor' : 'none'} />
                                                    </button>
                                                ))}
                                            </div>
                                            {rating > 0 && (
                                                <div className="rating-description">
                                                    <span className="rating-number">{rating}/5</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="comment" className="form-label enhanced-label">
                                            <MessageSquare size={18} />
                                            Review Comment
                                        </label>
                                        <textarea
                                            id="comment"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="form-input enhanced-textarea"
                                            rows="6"
                                            placeholder="Share your thoughts about this book... What did you like? What could be improved? Would you recommend it to others?"
                                            maxLength="500"
                                        />
                                        <div className="form-help enhanced-help">
                                            <span>{comment.length}/500 characters</span>
                                            <span>💡 Tip: Detailed reviews are more helpful to other readers</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !selectedBook || rating === 0}
                                        className="btn btn--primary submit-btn enhanced-submit"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="spinner spinner--sm"></div>
                                                Submitting Review...
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

                    <div className="feedback-sidebar">
                        <div className="card enhanced-card">
                            <div className="card__header">
                                <h3 className="section-title">
                                    <TrendingUp size={20} />
                                    Recent Reviews
                                </h3>
                            </div>
                            <div className="card__body">
                                <div className="recent-reviews">
                                    {recentReviews.slice(0, 3).map(review => (
                                        <div key={review.id} className="review-item">
                                            <div className="review-header">
                                                <div className="reviewer-info">
                                                    <div className="reviewer-avatar">
                                                        <User size={16} />
                                                    </div>
                                                    <div>
                                                        <div className="reviewer-name">{review.userName}</div>
                                                        <div className="review-date">
                                                            <Calendar size={12} />
                                                            {new Date(review.date).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="review-rating">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            size={14} 
                                                            fill={i < review.rating ? '#f59e0b' : 'none'}
                                                            color="#f59e0b"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="review-book">{review.bookTitle}</div>
                                            <div className="review-comment">{review.comment}</div>
                                            <div className="review-helpful">
                                                <ThumbsUp size={12} />
                                                {review.helpful} people found this helpful
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="card enhanced-card">
                            <div className="card__header">
                                <h3 className="section-title">Review Guidelines</h3>
                            </div>
                            <div className="card__body">
                                <div className="guidelines">
                                    <div className="guideline-section">
                                        <h4>✅ Do Include:</h4>
                                        <ul className="guidelines-list positive">
                                            <li>Your honest opinion about the book</li>
                                            <li>What you liked or learned</li>
                                            <li>Who might enjoy this book</li>
                                            <li>Specific examples from the content</li>
                                        </ul>
                                    </div>
                                    
                                    <div className="guideline-section">
                                        <h4>❌ Please Avoid:</h4>
                                        <ul className="guidelines-list negative">
                                            <li>Spoilers about the plot</li>
                                            <li>Personal attacks on the author</li>
                                            <li>Irrelevant personal information</li>
                                            <li>Spam or promotional content</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card enhanced-card benefits-card">
                            <div className="card__header">
                                <h3 className="section-title">Why Review?</h3>
                            </div>
                            <div className="card__body">
                                <div className="benefits">
                                    <div className="benefit-item">
                                        <div className="benefit-icon">🌟</div>
                                        <div>
                                            <h4>Help Others</h4>
                                            <p>Your reviews guide fellow readers to great books</p>
                                        </div>
                                    </div>

                                    <div className="benefit-item">
                                        <div className="benefit-icon">🏆</div>
                                        <div>
                                            <h4>Build Reputation</h4>
                                            <p>Become a trusted voice in our community</p>
                                        </div>
                                    </div>

                                    <div className="benefit-item">
                                        <div className="benefit-icon">📚</div>
                                        <div>
                                            <h4>Better Recommendations</h4>
                                            <p>Help us suggest books you'll love</p>
                                        </div>
                                    </div>
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

                .enhanced-card {
                    background: linear-gradient(145deg, var(--bg-primary) 0%, rgba(255,255,255,0.8) 100%);
                    border: 2px solid var(--color-gray-200);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                    transition: all var(--transition-base);
                }

                .enhanced-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 35px rgba(0,0,0,0.15);
                }

                .enhanced-alert {
                    animation: slideInDown 0.5s ease-out;
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
                }

                .section-title {
                    font-size: var(--font-size-lg);
                    font-weight: var(--font-weight-bold);
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    color: var(--text-primary);
                }

                .review-stats {
                    display: flex;
                    gap: var(--space-2);
                }

                .stat-badge {
                    display: flex;
                    align-items: center;
                    gap: var(--space-1);
                    padding: var(--space-1) var(--space-3);
                    background: var(--color-primary-light);
                    color: var(--color-primary-dark);
                    border-radius: var(--radius-full);
                    font-size: var(--font-size-xs);
                    font-weight: var(--font-weight-semibold);
                }

                .enhanced-label {
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                    margin-bottom: var(--space-3);
                }

                .enhanced-select {
                    background: linear-gradient(145deg, var(--bg-primary) 0%, rgba(255,255,255,0.9) 100%);
                    border: 2px solid var(--color-gray-300);
                    padding: var(--space-4);
                    border-radius: var(--radius-xl);
                    font-size: var(--font-size-base);
                    transition: all var(--transition-base);
                }

                .enhanced-select:focus {
                    border-color: var(--color-primary);
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
                    transform: translateY(-1px);
                }

                .rating-text {
                    color: var(--color-accent);
                    font-weight: var(--font-weight-bold);
                    font-size: var(--font-size-base);
                    margin-left: var(--space-3);
                    animation: fadeIn 0.3s ease-in;
                }

                .rating-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4);
                    padding: var(--space-4);
                    background: var(--bg-secondary);
                    border-radius: var(--radius-xl);
                    margin-top: var(--space-3);
                }

                .rating-stars {
                    display: flex;
                    gap: var(--space-2);
                    justify-content: center;
                }

                .rating-star {
                    background: none;
                    border: none;
                    color: var(--color-gray-300);
                    cursor: pointer;
                    padding: var(--space-2);
                    border-radius: var(--radius-lg);
                    transition: all var(--transition-fast);
                    position: relative;
                }

                .rating-star:hover {
                    transform: scale(1.2);
                    background: rgba(245, 158, 11, 0.1);
                }

                .rating-star--active {
                    color: var(--color-accent);
                    transform: scale(1.1);
                }

                .rating-description {
                    text-align: center;
                }

                .rating-number {
                    font-size: var(--font-size-2xl);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-accent);
                }

                .enhanced-textarea {
                    background: linear-gradient(145deg, var(--bg-primary) 0%, rgba(255,255,255,0.9) 100%);
                    border: 2px solid var(--color-gray-300);
                    padding: var(--space-4);
                    border-radius: var(--radius-xl);
                    resize: vertical;
                    min-height: 120px;
                    transition: all var(--transition-base);
                    font-family: inherit;
                }

                .enhanced-textarea:focus {
                    border-color: var(--color-primary);
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
                    transform: translateY(-1px);
                }

                .enhanced-help {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: var(--space-2);
                    margin-top: var(--space-2);
                    font-size: var(--font-size-sm);
                    color: var(--text-muted);
                }

                .enhanced-submit {
                    width: 100%;
                    padding: var(--space-4) var(--space-6);
                    font-size: var(--font-size-lg);
                    font-weight: var(--font-weight-bold);
                    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
                    border: none;
                    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
                    transition: all var(--transition-base);
                    margin-top: var(--space-6);
                }

                .enhanced-submit:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
                }

                .recent-reviews {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4);
                }

                .review-item {
                    padding: var(--space-4);
                    background: var(--bg-secondary);
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--color-gray-200);
                    transition: all var(--transition-base);
                }

                .review-item:hover {
                    transform: translateX(4px);
                    box-shadow: var(--shadow-md);
                }

                .review-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: start;
                    margin-bottom: var(--space-2);
                }

                .reviewer-info {
                    display: flex;
                    gap: var(--space-2);
                    align-items: center;
                }

                .reviewer-avatar {
                    background: var(--color-primary-light);
                    color: var(--color-primary-dark);
                    padding: var(--space-1);
                    border-radius: var(--radius-full);
                }

                .reviewer-name {
                    font-weight: var(--font-weight-semibold);
                    font-size: var(--font-size-sm);
                    color: var(--text-primary);
                }

                .review-date {
                    display: flex;
                    align-items: center;
                    gap: var(--space-1);
                    font-size: var(--font-size-xs);
                    color: var(--text-muted);
                }

                .review-book {
                    font-weight: var(--font-weight-medium);
                    color: var(--color-primary);
                    font-size: var(--font-size-sm);
                    margin-bottom: var(--space-2);
                }

                .review-comment {
                    color: var(--text-secondary);
                    font-size: var(--font-size-sm);
                    line-height: var(--line-height-relaxed);
                    margin-bottom: var(--space-2);
                }

                .review-helpful {
                    display: flex;
                    align-items: center;
                    gap: var(--space-1);
                    font-size: var(--font-size-xs);
                    color: var(--color-success);
                }

                .guidelines {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4);
                }

                .guideline-section h4 {
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-semibold);
                    margin-bottom: var(--space-2);
                }

                .guidelines-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-1);
                }

                .guidelines-list li {
                    font-size: var(--font-size-sm);
                    color: var(--text-secondary);
                    padding: var(--space-1) 0;
                    border-radius: var(--radius-base);
                    padding-left: var(--space-3);
                    position: relative;
                }

                .positive li::before {
                    content: '✓';
                    color: var(--color-success);
                    font-weight: bold;
                    position: absolute;
                    left: 0;
                }

                .negative li::before {
                    content: '✗';
                    color: var(--color-danger);
                    font-weight: bold;
                    position: absolute;
                    left: 0;
                }

                .benefits {
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
                    font-size: var(--font-size-xl);
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-primary);
                    border-radius: var(--radius-lg);
                    border: 2px solid var(--color-gray-200);
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

                .benefits-card {
                    background: linear-gradient(135deg, var(--color-primary-light) 0%, rgba(59, 130, 246, 0.05) 100%);
                }

                @keyframes slideInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @media (max-width: 1024px) {
                    .feedback-layout {
                        grid-template-columns: 1fr;
                        gap: var(--space-6);
                    }
                }

                @media (max-width: 768px) {
                    .rating-stars {
                        gap: var(--space-1);
                    }

                    .enhanced-help {
                        flex-direction: column;
                        align-items: start;
                    }

                    .review-header {
                        flex-direction: column;
                        gap: var(--space-2);
                    }
                }
            `}</style>
        </div>
    )
}