// src/components/common/WishlistButton.jsx
import React from 'react'
import { Heart } from 'lucide-react'
import { useWishlist } from '../../context/WishlistContext'

export default function WishlistButton({
    bookId,
    size = 20,
    className = ""
}) {
    const { isInWishlist, toggleWishlist, isLoading } = useWishlist()
    const isBookInWishlist = isInWishlist(bookId)

    const handleClick = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (isLoading) return

        await toggleWishlist(bookId)
    }

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`wishlist-button ${isBookInWishlist ? 'wishlist-button--active' : ''} ${className}`}
            title={isBookInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-label={isBookInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <Heart
                size={size}
                className="wishlist-icon"
                fill={isBookInWishlist ? 'currentColor' : 'none'}
                stroke="currentColor"
            />
            {isLoading && <span className="wishlist-loading">Loading...</span>}

            <style jsx>{`
                .wishlist-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--space-1);
                    padding: var(--space-2);
                    border: 2px solid var(--color-gray-300);
                    border-radius: var(--radius-lg);
                    background: var(--bg-primary);
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all var(--transition-base);
                    min-width: 44px;
                    min-height: 44px;
                }

                .wishlist-button:hover:not(:disabled) {
                    border-color: #e91e63;
                    background: rgba(233, 30, 99, 0.05);
                    color: #e91e63;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(233, 30, 99, 0.15);
                }

                .wishlist-button:active {
                    transform: translateY(0);
                }

                .wishlist-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .wishlist-button--active {
                    border-color: #e91e63;
                    background: rgba(233, 30, 99, 0.1);
                    color: #e91e63;
                }

                .wishlist-button--active:hover:not(:disabled) {
                    border-color: #ad1457;
                    background: rgba(173, 20, 87, 0.15);
                    color: #ad1457;
                }

                .wishlist-icon {
                    transition: all var(--transition-base);
                    stroke-width: 2;
                }

                .wishlist-loading {
                    font-size: var(--font-size-xs);
                    color: var(--text-muted);
                }

                /* Compact version for small spaces */
                .wishlist-button.compact {
                    min-width: 36px;
                    min-height: 36px;
                    padding: var(--space-1);
                }

                /* Icon-only version */
                .wishlist-button.icon-only {
                    border: none;
                    background: transparent;
                    padding: var(--space-2);
                    min-width: auto;
                    min-height: auto;
                    border-radius: var(--radius-full);
                }

                .wishlist-button.icon-only:hover:not(:disabled) {
                    background: rgba(233, 30, 99, 0.1);
                }

                /* Card version - for use in book cards */
                .wishlist-button.card-style {
                    position: absolute;
                    top: var(--space-2);
                    right: var(--space-2);
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    min-width: 36px;
                    min-height: 36px;
                    padding: var(--space-2);
                }

                .wishlist-button.card-style:hover:not(:disabled) {
                    background: rgba(233, 30, 99, 0.1);
                    backdrop-filter: blur(10px);
                }
            `}</style>
        </button>
    )
}