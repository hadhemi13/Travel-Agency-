'use client'
import { useState } from 'react'
import { BsFilter, BsGrid3X3, BsList, BsSearch, BsSortDown, BsTrash } from 'react-icons/bs'
import { useTranslation } from '@/hooks/useTranslation'
import WishCard from './components/WishCard'
import { wishlistData, type WishCardType } from './data'

const WishlistPage = () => {
    const { t } = useTranslation()
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name')
    const [filterType, setFilterType] = useState<'all' | 'hotel' | 'tour' | 'flight' | 'cab'>('all')
    const [searchTerm, setSearchTerm] = useState('')

    // Filtrer et trier les données
    const filteredAndSortedData = wishlistData
        .filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.address.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesFilter = filterType === 'all' || item.type === filterType
            return matchesSearch && matchesFilter
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price':
                    return a.price - b.price
                case 'rating':
                    return b.rating - a.rating
                case 'name':
                default:
                    return a.name.localeCompare(b.name)
            }
        })

    return (
        <div className="bg-gray-900 min-h-screen">
            {/* Header */}
            <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            My Wishlist
                        </h1>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4">
                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <BsSortDown size={18} className="text-gray-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="name">Sort by name</option>
                                <option value="price">Sort by price</option>
                                <option value="rating">Sort by rating</option>
                            </select>
                        </div>

                        {/* Remove All Button */}
                        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                            <BsTrash size={16} />
                            Remove all
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="px-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Filter by Type */}
                    <div className="flex items-center gap-2">
                        <BsFilter size={18} className="text-gray-400" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as any)}
                            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All types</option>
                            <option value="hotel">Hotel</option>
                            <option value="tour">Tour</option>
                            <option value="flight">Flight</option>
                            <option value="cab">Cab</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-6">
                {filteredAndSortedData.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <BsSearch size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">
                            No items in wishlist
                        </h3>
                        <p className="text-gray-400">
                            {searchTerm || filterType !== 'all'
                                ? 'No items match your filters'
                                : 'Start adding items to your wishlist'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredAndSortedData.map((item) => (
                            <WishCard key={item.id} wishCard={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default WishlistPage
