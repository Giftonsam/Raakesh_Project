import React from 'react'
import { Link } from 'react-router-dom'
import { useBookContext } from '../../context/BookContext'
import {
    Code,
    Globe,
    Cpu,
    BookOpen,
    Laptop,
    ArrowRight,
    TrendingUp
} from 'lucide-react'

export default function Categories() {
    const { categories, books, setSelectedCategory } = useBookContext()

    const categoryIcons = {
        'programming': Code,
        'web-development': Globe,
        'software-engineering': Cpu,
        'computer-science': BookOpen,
        'technology': Laptop
    }

    const categoryColors = {
        'programming': 'var(--color-primary)',
        'web-development': 'var(--color-secondary)',
        'software-engineering': 'var(--color-accent)',
        'computer-science': 'var(--color-danger)',
        'technology': '#8b5cf6'
    }

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId)
    }

    const getTopBooksInCategory = (categoryName) => {
        return books
            .filter(book => book.category === categoryName)
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 3)
    }

    const featuredCategories = categories.filter(cat => cat.id !== 'all')

    return (
        <div className="page">
            <div className="container">
                <div className="page__header">
                    <h1 className="page__title">Book Categories</h1>
                    <p className="page__subtitle">Explore books by category and discover new genres</p>
                </div>

                {/* Categories Grid */}
                <div className="categories-grid">
                    {featuredCategories.map(category => {
                        const IconComponent = categoryIcons[category.id] || BookOpen
                        const topBooks = getTopBooksInCategory(category.name)

                        return (
                            <div key={category.id} className="category-card">
                                <div className="category-card__header">
                                    <div
                                        className="category-card__icon"
                                        style={{
                                            background: `${categoryColors[category.id]}20`,
                                            color: categoryColors[category.id]
                                        }}
                                    >
                                        <IconComponent size={32} />
                                    </div>
                                    <div className="category-card__info">
                                        <h3 className="category-card__title">{category.name}</h3>
                                        <p className="category-card__count">
                                            {category.count} {category.count === 1 ? 'book' : 'books'}
                                        </p>
                                    </div>
                                </div>

                                {/* Top Books Preview */}
                                {topBooks.length > 0 && (
                                    <div className="category-card__books">
                                        <h4 className="books-preview-title">Top Rated Books:</h4>
                                        <div className="books-preview">
                                            {topBooks.map(book => (
                                                <div key={book.id} className="book-preview">
                                                    <img
                                                        src={book.image}
                                                        alt={book.title}
                                                        className="book-preview__image"
                                                    />
                                                    <div className="book-preview__details">
                                                        <p className="book-preview__title">{book.title}</p>
                                                        <div className="book-preview__rating">
                                                            <TrendingUp size={12} />
                                                            <span>{book.rating || 0}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="category-card__footer">
                                    <Link
                                        to="/books"
                                        onClick={() => handleCategoryClick(category.id)}
                                        className="category-card__link"
                                    >
                                        Browse {category.name}
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Popular Categories Section */}
                <div className="popular-section">
                    <h2 className="section-title">Most Popular Categories</h2>
                    <div className="popular-categories">
                        {featuredCategories
                            .sort((a, b) => b.count - a.count)
                            .slice(0, 3)
                            .map(category => {
                                const IconComponent = categoryIcons[category.id] || BookOpen
                                return (
                                    <div key={category.id} className="popular-category">
                                        <div
                                            className="popular-category__icon"
                                            style={{ color: categoryColors[category.id] }}
                                        >
                                            <IconComponent size={24} />
                                        </div>
                                        <div className="popular-category__info">
                                            <h4 className="popular-category__name">{category.name}</h4>
                                            <p className="popular-category__count">{category.count} books</p>
                                        </div>
                                        <Link
                                            to="/books"
                                            onClick={() => handleCategoryClick(category.id)}
                                            className="btn btn--outline btn--sm"
                                        >
                                            Explore
                                        </Link>
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </div>

            <style>{`
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: var(--space-6);
          margin-bottom: var(--space-12);
        }

        .category-card {
          background: var(--bg-primary);
          border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-2xl);
          padding: var(--space-6);
          transition: all var(--transition-base);
          position: relative;
          overflow: hidden;
        }

        .category-card::before {
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

        .category-card:hover::before {
          transform: scaleX(1);
        }

        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
        }

        .category-card__header {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }

        .category-card__icon {
          padding: var(--space-3);
          border-radius: var(--radius-xl);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .category-card__info {
          flex: 1;
        }

        .category-card__title {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          margin-bottom: var(--space-1);
          color: var(--text-primary);
        }

        .category-card__count {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          margin: 0;
        }

        .category-card__books {
          margin-bottom: var(--space-6);
        }

        .books-preview-title {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-medium);
          margin-bottom: var(--space-3);
          color: var(--text-primary);
        }

        .books-preview {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .book-preview {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-2);
          border-radius: var(--radius-lg);
          transition: background var(--transition-fast);
        }

        .book-preview:hover {
          background: var(--bg-secondary);
        }

        .book-preview__image {
          width: 32px;
          height: 44px;
          object-fit: cover;
          border-radius: var(--radius-base);
        }

        .book-preview__details {
          flex: 1;
          min-width: 0;
        }

        .book-preview__title {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          margin-bottom: var(--space-1);
          color: var(--text-primary);
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .book-preview__rating {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          font-size: var(--font-size-xs);
          color: var(--color-accent);
        }

        .category-card__footer {
          border-top: 1px solid var(--color-gray-200);
          padding-top: var(--space-4);
        }

        .category-card__link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-6);
          background: var(--gradient-primary);
          color: var(--text-white);
          border-radius: var(--radius-lg);
          text-decoration: none;
          font-weight: var(--font-weight-medium);
          transition: all var(--transition-fast);
        }

        .category-card__link:hover {
          background: var(--color-primary-dark);
          transform: translateX(2px);
          text-decoration: none;
        }

        .popular-section {
          margin-bottom: var(--space-8);
        }

        .section-title {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          margin-bottom: var(--space-6);
          text-align: center;
          color: var(--text-primary);
        }

        .popular-categories {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--space-4);
        }

        .popular-category {
          background: var(--bg-primary);
          border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          display: flex;
          align-items: center;
          gap: var(--space-4);
          transition: all var(--transition-base);
        }

        .popular-category:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .popular-category__icon {
          padding: var(--space-3);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .popular-category__info {
          flex: 1;
        }

        .popular-category__name {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--space-1);
          color: var(--text-primary);
        }

        .popular-category__count {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          margin: 0;
        }

        @media (max-width: 768px) {
          .categories-grid {
            grid-template-columns: 1fr;
          }

          .popular-categories {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .category-card__header {
            flex-direction: column;
            text-align: center;
            gap: var(--space-3);
          }

          .popular-category {
            flex-direction: column;
            text-align: center;
            gap: var(--space-3);
          }
        }
      `}</style>
        </div>
    )
}