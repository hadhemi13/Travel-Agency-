'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { tourHistory } from '../data'
import TourCard from './TourCard'

const TourCardList = () => {
    const [sortBy, setSortBy] = useState('recent')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    // Sort tours
    const sortedTours = [...tourHistory].sort((a, b) => {
        switch (sortBy) {
            case 'recent':
                return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
            case 'oldest':
                return new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()
            case 'price-high':
                return b.price - a.price
            case 'price-low':
                return a.price - b.price
            default:
                return 0
        }
    })

    // Pagination
    const totalPages = Math.ceil(sortedTours.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentTours = sortedTours.slice(startIndex, endIndex)

    return (
        <section className="pt-0 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with Result Count and Sort */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-center justify-between mb-6">
                    <div className="xl:col-span-8">
                        <h5 className="text-lg font-semibold mb-0 text-gray-900 dark:text-white">
                            Showing {startIndex + 1}-{Math.min(endIndex, sortedTours.length)} of {sortedTours.length} result
                        </h5>
                    </div>
                    <div className="xl:col-span-2">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#2a2c31] border border-gray-200 dark:border-[rgba(255,255,255,0.07)] rounded-lg text-gray-900 dark:text-[#b0b0b8] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#8e85e6] transition-all"
                        >
                            <option value="recent">Most Recent</option>
                            <option value="oldest">Oldest First</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="price-low">Price: Low to High</option>
                        </select>
                    </div>
                </div>

                {/* Tours Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                    {currentTours.map((tour) => (
                        <TourCard key={tour.id} tour={tour} />
                    ))}
                </div>

                {/* Empty State */}
                {currentTours.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🏝️</div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            No bookings found
                        </h3>
                        <p className="text-gray-600 dark:text-[#b0b0b8] mb-6">
                            Start exploring amazing destinations and create your first booking!
                        </p>
                        <Link
                            href="/tours"
                            className="inline-block px-8 py-3 bg-blue-600 dark:bg-[#8e85e6] hover:bg-blue-700 dark:hover:bg-[#7a6deb] text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                            Explore Tours
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center">
                        <nav className="mt-4" aria-label="navigation">
                            <ul className="inline-flex md:flex items-center rounded mb-0 gap-1">
                                <li className="mb-0">
                                    <Link
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setCurrentPage(prev => Math.max(prev - 1, 1))
                                        }}
                                        className={`flex items-center justify-center w-10 h-10 rounded transition-all duration-300 ${currentPage === 1
                                                ? 'text-gray-400 dark:text-[#5f5f68] cursor-not-allowed'
                                                : 'text-gray-700 dark:text-[#b0b0b8] hover:bg-blue-50 dark:hover:bg-[#2a2c31] hover:scale-110'
                                            }`}
                                        tabIndex={currentPage === 1 ? -1 : 0}
                                    >
                                        <FaAngleLeft />
                                    </Link>
                                </li>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                    const showPage =
                                        page === 1 ||
                                        page === totalPages ||
                                        (page >= currentPage - 1 && page <= currentPage + 1)

                                    if (!showPage && (page === 2 || page === totalPages - 1)) {
                                        return (
                                            <li key={page} className="mb-0">
                                                <Link
                                                    href="#"
                                                    className="flex items-center justify-center w-10 h-10 text-gray-500 dark:text-[#5f5f68]"
                                                >
                                                    ..
                                                </Link>
                                            </li>
                                        )
                                    }

                                    if (!showPage) return null

                                    return (
                                        <li key={page} className={`mb-0 ${currentPage === page ? 'active' : ''}`}>
                                            <Link
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setCurrentPage(page)
                                                }}
                                                className={`flex items-center justify-center w-10 h-10 rounded transition-all duration-300 ${currentPage === page
                                                        ? 'bg-blue-600 dark:bg-[#8e85e6] text-white shadow-lg scale-110'
                                                        : 'text-gray-700 dark:text-[#b0b0b8] hover:bg-blue-50 dark:hover:bg-[#2a2c31] hover:scale-110'
                                                    }`}
                                            >
                                                {page}
                                            </Link>
                                        </li>
                                    )
                                })}

                                <li className="mb-0">
                                    <Link
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setCurrentPage(prev => Math.min(prev + 1, totalPages))
                                        }}
                                        className={`flex items-center justify-center w-10 h-10 rounded transition-all duration-300 ${currentPage === totalPages
                                                ? 'text-gray-400 dark:text-[#5f5f68] cursor-not-allowed'
                                                : 'text-gray-700 dark:text-[#b0b0b8] hover:bg-blue-50 dark:hover:bg-[#2a2c31] hover:scale-110'
                                            }`}
                                    >
                                        <FaAngleRight />
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </section>
    )
}

export default TourCardList
