// src/context/WishlistContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext()

export const useWishlist = () => {
    const context = useContext(WishlistContext)
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider')
    }
    return context
}

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    // Sample books data (same as other components)
    const sampleBooks = [
        {
            id: 1,
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
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
            category: "Finance",
            price: 329,
            stock: 25,
            rating: 4.2,
            discountedPrice: 249,
            description: "Timeless lessons on wealth, greed, and happiness from the perspective of behavioral psychology and personal finance.",
            image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=600&fit=crop"
        }
    ]

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const savedWishlist = localStorage.getItem('bookstore-wishlist')
        if (savedWishlist) {
            try {
                const wishlistIds = JSON.parse(savedWishlist)
                const wishlistBooks = wishlistIds.map(id => 
                    sampleBooks.find(book => book.id === id)
                ).filter(Boolean)
                setWishlistItems(wishlistBooks)
            } catch (error) {
                console.error('Error loading wishlist:', error)
            }
        }
    }, [])

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        const wishlistIds = wishlistItems.map(item => item.id)
        localStorage.setItem('bookstore-wishlist', JSON.stringify(wishlistIds))
    }, [wishlistItems])

    // Check if a book is in wishlist
    const isInWishlist = (bookId) => {
        return wishlistItems.some(item => item.id === bookId)
    }

    // Add book to wishlist
    const addToWishlist = async (bookId) => {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 300))
            
            const book = sampleBooks.find(b => b.id === bookId)
            if (book && !isInWishlist(bookId)) {
                setWishlistItems(prev => [...prev, book])
                
                // Show success notification
                showNotification(`"${book.title}" added to wishlist!`, 'success')
                return true
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error)
            showNotification('Failed to add to wishlist', 'error')
            return false
        } finally {
            setIsLoading(false)
        }
    }

    // Remove book from wishlist
    const removeFromWishlist = async (bookId) => {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 300))
            
            const book = wishlistItems.find(item => item.id === bookId)
            setWishlistItems(prev => prev.filter(item => item.id !== bookId))
            
            // Show success notification
            if (book) {
                showNotification(`"${book.title}" removed from wishlist!`, 'success')
            }
            return true
        } catch (error) {
            console.error('Error removing from wishlist:', error)
            showNotification('Failed to remove from wishlist', 'error')
            return false
        } finally {
            setIsLoading(false)
        }
    }

    // Toggle book in wishlist
    const toggleWishlist = async (bookId) => {
        if (isInWishlist(bookId)) {
            return await removeFromWishlist(bookId)
        } else {
            return await addToWishlist(bookId)
        }
    }

    // Clear entire wishlist
    const clearWishlist = async () => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            setWishlistItems([])
            showNotification('Wishlist cleared!', 'success')
            return true
        } catch (error) {
            console.error('Error clearing wishlist:', error)
            showNotification('Failed to clear wishlist', 'error')
            return false
        } finally {
            setIsLoading(false)
        }
    }

    // Get wishlist item count
    const getWishlistCount = () => wishlistItems.length

    // Get wishlist item IDs
    const getWishlistIds = () => wishlistItems.map(item => item.id)

    // Show notification helper
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
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `
        
        // Add slide-in animation
        const style = document.createElement('style')
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `
        if (!document.head.querySelector('style[data-notification]')) {
            style.setAttribute('data-notification', 'true')
            document.head.appendChild(style)
        }
        
        document.body.appendChild(notification)
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification)
            }
        }, 3000)
    }

    const value = {
        wishlistItems,
        isLoading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        getWishlistCount,
        getWishlistIds
    }

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    )
}