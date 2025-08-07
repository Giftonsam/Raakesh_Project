import React, { useState } from 'react'
import {
    Package,
    Search,
    Filter,
    Eye,
    Calendar,
    DollarSign,
    User,
    Clock,
    Truck,
    CheckCircle,
    XCircle,
    AlertCircle,
    Download,
    RefreshCw
} from 'lucide-react'

export default function OrderManagement() {
    // Mock data for demonstration
    const orders = [
        {
            id: 1001,
            userId: 501,
            status: 'pending',
            orderDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            totalAmount: 1250,
            items: [
                { id: 1, bookId: 1, quantity: 2 },
                { id: 2, bookId: 2, quantity: 1 }
            ]
        },
        {
            id: 1002,
            userId: 502,
            status: 'shipped',
            orderDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            totalAmount: 890,
            items: [
                { id: 3, bookId: 3, quantity: 1 }
            ]
        },
        {
            id: 1003,
            userId: 503,
            status: 'delivered',
            orderDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
            totalAmount: 2150,
            items: [
                { id: 4, bookId: 1, quantity: 1 },
                { id: 5, bookId: 4, quantity: 3 }
            ]
        }
    ]

    const getBookById = (id) => {
        const books = {
            1: { title: 'The Great Gatsby', image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100&h=150&fit=crop' },
            2: { title: 'To Kill a Mockingbird', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=150&fit=crop' },
            3: { title: '1984', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&h=150&fit=crop' },
            4: { title: 'Pride and Prejudice', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=150&fit=crop' }
        }
        return books[id]
    }
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [dateFilter, setDateFilter] = useState('all')
    const [isLoading, setIsLoading] = useState(false)

    // Filter orders based on search, status, and date
    const filteredOrders = orders.filter(order => {
        const matchesSearch = searchQuery === '' ||
            order.id.toString().includes(searchQuery) ||
            order.userId.toString().includes(searchQuery)

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter

        let matchesDate = true
        if (dateFilter !== 'all') {
            const orderDate = new Date(order.orderDate)
            const now = new Date()

            switch (dateFilter) {
                case 'today':
                    matchesDate = orderDate.toDateString() === now.toDateString()
                    break
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                    matchesDate = orderDate >= weekAgo
                    break
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                    matchesDate = orderDate >= monthAgo
                    break
                default:
                    matchesDate = true
            }
        }

        return matchesSearch && matchesStatus && matchesDate
    })

    // Calculate order statistics
    const orderStats = {
        total: orders.length,
        pending: orders.filter(order => order.status === 'pending').length,
        processing: orders.filter(order => order.status === 'processing').length,
        shipped: orders.filter(order => order.status === 'shipped').length,
        delivered: orders.filter(order => order.status === 'delivered').length,
        cancelled: orders.filter(order => order.status === 'cancelled').length,
        totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
        avgOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={16} />
            case 'processing': return <Package size={16} />
            case 'shipped': return <Truck size={16} />
            case 'delivered': return <CheckCircle size={16} />
            case 'cancelled': return <XCircle size={16} />
            default: return <Package size={16} />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning'
            case 'processing': return 'info'
            case 'shipped': return 'primary'
            case 'delivered': return 'success'
            case 'cancelled': return 'danger'
            default: return 'primary'
        }
    }

    const getStatusPriority = (status) => {
        const priorities = {
            'pending': 1,
            'processing': 2,
            'shipped': 3,
            'delivered': 4,
            'cancelled': 5
        }
        return priorities[status] || 0
    }

    // Sort orders by priority (pending first, then by date)
    const sortedOrders = [...filteredOrders].sort((a, b) => {
        const priorityDiff = getStatusPriority(a.status) - getStatusPriority(b.status)
        if (priorityDiff !== 0) return priorityDiff
        return new Date(b.orderDate) - new Date(a.orderDate)
    })

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            setIsLoading(true)
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500))

            // In real app, this would update the order status via API
            console.log(`Order ${orderId} status updated to ${newStatus}`)

        } catch (error) {
            console.error('Error updating order status:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const exportOrders = () => {
        // Create CSV content
        const headers = ['Order ID', 'Customer ID', 'Amount', 'Status', 'Date', 'Items']
        const csvContent = [
            headers.join(','),
            ...filteredOrders.map(order => [
                order.id,
                order.userId,
                order.totalAmount,
                order.status,
                new Date(order.orderDate).toLocaleDateString(),
                order.items.length
            ].join(','))
        ].join('\n')

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
                    <p className="text-gray-600">Track and manage customer orders</p>
                </div>

                {/* Order Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-4 hover:shadow-md transition-all duration-200">
                        <div className="bg-blue-100 text-blue-700 p-3 rounded-lg">
                            <Package size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{orderStats.total}</div>
                            <div className="text-gray-600 text-sm">Total Orders</div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-4 hover:shadow-md transition-all duration-200">
                        <div className="bg-yellow-100 text-yellow-700 p-3 rounded-lg">
                            <Clock size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{orderStats.pending}</div>
                            <div className="text-gray-600 text-sm">Pending Orders</div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-4 hover:shadow-md transition-all duration-200">
                        <div className="bg-blue-100 text-blue-700 p-3 rounded-lg">
                            <Truck size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{orderStats.shipped}</div>
                            <div className="text-gray-600 text-sm">Shipped</div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-4 hover:shadow-md transition-all duration-200">
                        <div className="bg-green-100 text-green-700 p-3 rounded-lg">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{orderStats.delivered}</div>
                            <div className="text-gray-600 text-sm">Delivered</div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-4 hover:shadow-md transition-all duration-200 md:col-span-2 lg:col-span-1">
                        <div className="bg-blue-100 text-blue-700 p-3 rounded-lg">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">₹{orderStats.totalRevenue.toLocaleString()}</div>
                            <div className="text-gray-600 text-sm">Total Revenue</div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-3xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-32"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-32"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={exportOrders}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={filteredOrders.length === 0}
                        >
                            <Download size={18} />
                            Export CSV
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <RefreshCw size={18} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {isLoading ? (
                        <div className="text-center py-16 text-gray-500">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                            <p>Loading orders...</p>
                        </div>
                    ) : sortedOrders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Items</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {sortedOrders.map(order => (
                                        <tr
                                            key={order.id}
                                            className={`hover:bg-gray-50 transition-colors ${order.status === 'pending' ? 'bg-yellow-50' : ''
                                                }`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-blue-600">
                                                    #{order.id}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <User size={16} />
                                                    <span>Customer {order.userId}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-2">
                                                    <span className="font-medium text-gray-900 text-sm">
                                                        {order.items.length} items
                                                    </span>
                                                    <div className="flex gap-1 items-center">
                                                        {order.items.slice(0, 3).map(item => {
                                                            const book = getBookById(item.bookId)
                                                            return book ? (
                                                                <img
                                                                    key={item.id}
                                                                    src={book.image}
                                                                    alt={book.title}
                                                                    className="w-6 h-8 object-cover rounded border border-gray-200"
                                                                    title={`${book.title} (Qty: ${item.quantity})`}
                                                                />
                                                            ) : null
                                                        })}
                                                        {order.items.length > 3 && (
                                                            <div className="bg-gray-200 text-gray-600 px-1 rounded text-xs font-medium min-w-6 text-center">
                                                                +{order.items.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-green-600 text-lg">
                                                    ₹{order.totalAmount.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-2 items-start">
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                                order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                                                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {getStatusIcon(order.status)}
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>

                                                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                            className="text-xs px-2 py-1 border border-gray-300 rounded bg-white text-gray-700"
                                                            disabled={isLoading}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="processing">Processing</option>
                                                            <option value="shipped">Shipped</option>
                                                            <option value="delivered">Delivered</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-gray-400" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {new Date(order.orderDate).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(order.orderDate).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={() => alert(`Viewing order #${order.id}`)}
                                                        className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                                        title="View details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-16 text-gray-500">
                            <Package size={48} className="mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Orders Found</h3>
                            <p className="mb-4">
                                {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'No orders have been placed yet.'
                                }
                            </p>
                            {(searchQuery || statusFilter !== 'all' || dateFilter !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('')
                                        setStatusFilter('all')
                                        setDateFilter('all')
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Summary Section */}
                {filteredOrders.length > 0 && (
                    <div className="mt-8">
                        <div className="bg-gray-100 border border-gray-200 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900">Summary</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600 font-medium">Filtered Orders:</span>
                                    <span className="text-gray-900 font-bold">{filteredOrders.length}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600 font-medium">Total Value:</span>
                                    <span className="text-gray-900 font-bold">
                                        ₹{filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600 font-medium">Average Order:</span>
                                    <span className="text-gray-900 font-bold">
                                        ₹{Math.round(filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0) / filteredOrders.length || 0).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}