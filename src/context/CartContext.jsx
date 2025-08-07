import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useAuthContext } from './AuthContext'

const CartContext = createContext()

// Initial state
const initialState = {
    items: [],
    wishlist: [],
    orders: [],
    isLoading: false,
    error: null
}

// Action types
const CART_ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_CART_ITEMS: 'SET_CART_ITEMS',
    ADD_TO_CART: 'ADD_TO_CART',
    UPDATE_CART_ITEM: 'UPDATE_CART_ITEM',
    REMOVE_FROM_CART: 'REMOVE_FROM_CART',
    CLEAR_CART: 'CLEAR_CART',
    ADD_TO_WISHLIST: 'ADD_TO_WISHLIST',
    REMOVE_FROM_WISHLIST: 'REMOVE_FROM_WISHLIST',
    SET_WISHLIST: 'SET_WISHLIST',
    ADD_ORDER: 'ADD_ORDER',
    SET_ORDERS: 'SET_ORDERS',
    UPDATE_ORDER: 'UPDATE_ORDER',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR'
}

// Cart reducer
function cartReducer(state, action) {
    switch (action.type) {
        case CART_ACTIONS.SET_LOADING:
            return { ...state, isLoading: action.payload }

        case CART_ACTIONS.SET_CART_ITEMS:
            return { ...state, items: action.payload }

        case CART_ACTIONS.ADD_TO_CART:
            const existingItem = state.items.find(item => item.bookId === action.payload.bookId)
            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.bookId === action.payload.bookId
                            ? { ...item, quantity: item.quantity + action.payload.quantity }
                            : item
                    )
                }
            }
            return { ...state, items: [...state.items, action.payload] }

        case CART_ACTIONS.UPDATE_CART_ITEM:
            return {
                ...state,
                items: state.items.map(item =>
                    item.bookId === action.payload.bookId
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
            }

        case CART_ACTIONS.REMOVE_FROM_CART:
            return {
                ...state,
                items: state.items.filter(item => item.bookId !== action.payload)
            }

        case CART_ACTIONS.CLEAR_CART:
            return { ...state, items: [] }

        case CART_ACTIONS.SET_WISHLIST:
            return { ...state, wishlist: action.payload }

        case CART_ACTIONS.ADD_TO_WISHLIST:
            if (!state.wishlist.find(id => id === action.payload)) {
                return { ...state, wishlist: [...state.wishlist, action.payload] }
            }
            return state

        case CART_ACTIONS.REMOVE_FROM_WISHLIST:
            return {
                ...state,
                wishlist: state.wishlist.filter(id => id !== action.payload)
            }

        case CART_ACTIONS.SET_ORDERS:
            return { ...state, orders: action.payload }

        case CART_ACTIONS.ADD_ORDER:
            return { ...state, orders: [action.payload, ...state.orders] }

        case CART_ACTIONS.UPDATE_ORDER:
            return {
                ...state,
                orders: state.orders.map(order =>
                    order.id === action.payload.id ? action.payload : order
                )
            }

        case CART_ACTIONS.SET_ERROR:
            return { ...state, error: action.payload, isLoading: false }

        case CART_ACTIONS.CLEAR_ERROR:
            return { ...state, error: null }

        default:
            return state
    }
}

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, initialState)
    const { user } = useAuthContext()

    // Load user cart data when user changes
    useEffect(() => {
        if (user) {
            const cartKey = `bookstore_cart_${user.id}`
            const wishlistKey = `bookstore_wishlist_${user.id}`
            const ordersKey = `bookstore_orders_${user.id}`

            const savedCart = localStorage.getItem(cartKey)
            const savedWishlist = localStorage.getItem(wishlistKey)
            const savedOrders = localStorage.getItem(ordersKey)

            if (savedCart) {
                try {
                    dispatch({ type: CART_ACTIONS.SET_CART_ITEMS, payload: JSON.parse(savedCart) })
                } catch (error) {
                    console.error('Error loading cart:', error)
                }
            }

            if (savedWishlist) {
                try {
                    dispatch({ type: CART_ACTIONS.SET_WISHLIST, payload: JSON.parse(savedWishlist) })
                } catch (error) {
                    console.error('Error loading wishlist:', error)
                }
            }

            if (savedOrders) {
                try {
                    dispatch({ type: CART_ACTIONS.SET_ORDERS, payload: JSON.parse(savedOrders) })
                } catch (error) {
                    console.error('Error loading orders:', error)
                }
            }
        } else {
            // Clear cart when user logs out
            dispatch({ type: CART_ACTIONS.CLEAR_CART })
            dispatch({ type: CART_ACTIONS.SET_WISHLIST, payload: [] })
            dispatch({ type: CART_ACTIONS.SET_ORDERS, payload: [] })
        }
    }, [user])

    // Save cart to localStorage whenever items change
    useEffect(() => {
        if (user && state.items.length >= 0) {
            const cartKey = `bookstore_cart_${user.id}`
            localStorage.setItem(cartKey, JSON.stringify(state.items))
        }
    }, [state.items, user])

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        if (user && state.wishlist.length >= 0) {
            const wishlistKey = `bookstore_wishlist_${user.id}`
            localStorage.setItem(wishlistKey, JSON.stringify(state.wishlist))
        }
    }, [state.wishlist, user])

    // Save orders to localStorage whenever they change
    useEffect(() => {
        if (user && state.orders.length >= 0) {
            const ordersKey = `bookstore_orders_${user.id}`
            localStorage.setItem(ordersKey, JSON.stringify(state.orders))
        }
    }, [state.orders, user])

    // Add to cart function
    const addToCart = async (bookId, quantity = 1) => {
        try {
            const cartItem = {
                id: Date.now(),
                bookId,
                quantity,
                addedAt: new Date().toISOString()
            }

            dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: cartItem })
            return { success: true }

        } catch (error) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message })
            return { success: false, error: error.message }
        }
    }

    // Update cart item quantity
    const updateCartItem = async (bookId, quantity) => {
        try {
            if (quantity <= 0) {
                dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: bookId })
            } else {
                dispatch({ type: CART_ACTIONS.UPDATE_CART_ITEM, payload: { bookId, quantity } })
            }
            return { success: true }

        } catch (error) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message })
            return { success: false, error: error.message }
        }
    }

    // Remove from cart function
    const removeFromCart = async (bookId) => {
        try {
            dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: bookId })
            return { success: true }

        } catch (error) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message })
            return { success: false, error: error.message }
        }
    }

    // Clear cart function
    const clearCart = () => {
        dispatch({ type: CART_ACTIONS.CLEAR_CART })
    }

    // Add to wishlist function
    const addToWishlist = async (bookId) => {
        try {
            dispatch({ type: CART_ACTIONS.ADD_TO_WISHLIST, payload: bookId })
            return { success: true }

        } catch (error) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message })
            return { success: false, error: error.message }
        }
    }

    // Remove from wishlist function
    const removeFromWishlist = async (bookId) => {
        try {
            dispatch({ type: CART_ACTIONS.REMOVE_FROM_WISHLIST, payload: bookId })
            return { success: true }

        } catch (error) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message })
            return { success: false, error: error.message }
        }
    }

    // Create order function
    const createOrder = async (orderData) => {
        dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true })

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500))

            const newOrder = {
                id: Date.now(),
                userId: user.id,
                items: orderData.items || state.items,
                totalAmount: orderData.totalAmount || getCartTotal(),
                status: 'pending',
                orderDate: new Date().toISOString(),
                shippingAddress: orderData.shippingAddress || user.address,
                paymentMethod: orderData.paymentMethod || 'card'
            }

            dispatch({ type: CART_ACTIONS.ADD_ORDER, payload: newOrder })
            dispatch({ type: CART_ACTIONS.CLEAR_CART })

            return { success: true, orderId: newOrder.id }

        } catch (error) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message })
            return { success: false, error: error.message }
        } finally {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false })
        }
    }

    // Get cart total - Fixed calculation
    const getCartTotal = () => {
        return state.items.reduce((total, item) => {
            // We need to get the actual book to calculate price
            // This is a simplified version - in real app, you'd pass book data or fetch it
            const estimatedPrice = item.bookId * 100 // Placeholder - replace with actual book price lookup
            return total + (estimatedPrice * item.quantity)
        }, 0)
    }

    // Get cart item count
    const getCartItemCount = () => {
        return state.items.reduce((total, item) => total + item.quantity, 0)
    }

    // Check if book is in wishlist
    const isInWishlist = (bookId) => {
        return state.wishlist.includes(bookId)
    }

    // Clear error function
    const clearError = () => {
        dispatch({ type: CART_ACTIONS.CLEAR_ERROR })
    }

    const value = {
        items: state.items,
        wishlist: state.wishlist,
        orders: state.orders,
        isLoading: state.isLoading,
        error: state.error,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        createOrder,
        getCartTotal,
        getCartItemCount,
        isInWishlist,
        clearError
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}

export const useCartContext = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCartContext must be used within a CartProvider')
    }
    return context
}