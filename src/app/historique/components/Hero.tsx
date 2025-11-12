'use client'
import { useState } from 'react'
import { BsCalendar, BsGeoAlt, BsSliders, BsSearch } from 'react-icons/bs'
import Image from 'next/image'

const Hero = () => {
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState({
        location: '',
        dateFrom: '',
        dateTo: '',
        status: 'all',
        tourType: 'all'
    })

    return (
        <section className="relative pt-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Background with Title */}
                <div
                    className="relative p-6 sm:p-12 rounded-3xl overflow-hidden bg-cover bg-center"
                    style={{
                        backgroundImage: `url('/assets/images/bg/02.jpg')`,
                        minHeight: '300px'
                    }}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-indigo-900/40"></div>

                    <div className="relative z-10 flex flex-col items-center justify-center h-full py-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4 drop-shadow-lg">
                            Tours History
                        </h1>
                        <div className="flex items-center gap-6 text-white text-lg">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">{tourHistory.length}</span>
                                <span className="opacity-90">Total Bookings</span>
                            </div>
                            <div className="w-px h-6 bg-white/40"></div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">{tourHistory.filter(t => t.status === 'completed').length}</span>
                                <span className="opacity-90">Completed</span>
                            </div>
                            <div className="w-px h-6 bg-white/40"></div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">{tourHistory.filter(t => t.status === 'upcoming').length}</span>
                                <span className="opacity-90">Upcoming</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Card */}
                <div className="relative -mt-16 sm:-mt-20 mb-8">
                    <div className="bg-white dark:bg-[#222529] shadow-2xl dark:shadow-[0_1rem_3rem_rgba(0,0,0,0.5)] rounded-2xl p-6">
                        {/* Main Search */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            {/* Location */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-white">
                                    <BsGeoAlt className="text-blue-600 dark:text-[#8e85e6] mr-2" />
                                    Location
                                </label>
                                <select
                                    className="w-full px-4 py-3 border-b-2 border-gray-200 dark:border-[rgba(255,255,255,0.07)] bg-transparent focus:border-blue-600 dark:focus:border-[#8e85e6] focus:outline-none transition-colors text-gray-900 dark:text-[#b0b0b8] rounded-lg"
                                    value={filters.location}
                                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                >
                                    <option value="">All Locations</option>
                                    <option value="bali">Bali, Indonesia</option>
                                    <option value="maldives">Maldives</option>
                                    <option value="dubai">Dubai, UAE</option>
                                    <option value="switzerland">Switzerland</option>
                                    <option value="srilanka">Sri Lanka</option>
                                </select>
                            </div>

                            {/* Date From */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-white">
                                    <BsCalendar className="text-blue-600 dark:text-[#8e85e6] mr-2" />
                                    Date From
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 border-b-2 border-gray-200 dark:border-[rgba(255,255,255,0.07)] bg-transparent focus:border-blue-600 dark:focus:border-[#8e85e6] focus:outline-none transition-colors text-gray-900 dark:text-[#b0b0b8] rounded-lg"
                                    value={filters.dateFrom}
                                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                                />
                            </div>

                            {/* Date To */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-white">
                                    <BsCalendar className="text-blue-600 dark:text-[#8e85e6] mr-2" />
                                    Date To
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 border-b-2 border-gray-200 dark:border-[rgba(255,255,255,0.07)] bg-transparent focus:border-blue-600 dark:focus:border-[#8e85e6] focus:outline-none transition-colors text-gray-900 dark:text-[#b0b0b8] rounded-lg"
                                    value={filters.dateTo}
                                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                                />
                            </div>

                            {/* Search Button */}
                            <div className="flex items-end">
                                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#8e85e6] dark:to-[#8e85e6] hover:from-blue-700 hover:to-indigo-700 dark:hover:from-[#7a6deb] dark:hover:to-[#7a6deb] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2">
                                    <BsSearch className="text-lg" />
                                    Search History
                                </button>
                            </div>
                        </div>

                        {/* Advanced Filters Toggle */}
                        <div className="mt-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="w-full bg-blue-50 dark:bg-[#2a2c31] hover:bg-blue-100 dark:hover:bg-[#464950] text-blue-700 dark:text-[#8e85e6] font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <BsSliders className="text-lg" />
                                Advanced Filters
                            </button>
                        </div>

                        {/* Advanced Filters */}
                        {showFilters && (
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[rgba(255,255,255,0.07)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                                {/* Status Filter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-white">
                                        Booking Status
                                    </label>
                                    <div className="flex gap-2">
                                        {['all', 'completed', 'upcoming', 'cancelled'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => setFilters({ ...filters, status })}
                                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 capitalize ${filters.status === status
                                                    ? 'bg-blue-600 dark:bg-[#8e85e6] text-white shadow-lg'
                                                    : 'bg-gray-100 dark:bg-[#2a2c31] text-gray-700 dark:text-[#b0b0b8] hover:bg-gray-200 dark:hover:bg-[#464950]'
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Tour Type Filter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-white">
                                        Tour Type
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-[rgba(255,255,255,0.07)] bg-white dark:bg-[#2a2c31] rounded-lg focus:border-blue-600 dark:focus:border-[#8e85e6] focus:outline-none transition-colors text-gray-900 dark:text-[#b0b0b8]"
                                        value={filters.tourType}
                                        onChange={(e) => setFilters({ ...filters, tourType: e.target.value })}
                                    >
                                        <option value="all">All Types</option>
                                        <option value="Adventure">Adventure</option>
                                        <option value="Beach">Beach</option>
                                        <option value="Desert">Desert</option>
                                        <option value="Heritage">Heritage</option>
                                        <option value="Honeymoon">Honeymoon</option>
                                        <option value="Nature">Nature</option>
                                    </select>
                                </div>

                                {/* Price Range */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-white">
                                        Price Range
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-[rgba(255,255,255,0.07)] bg-white dark:bg-[#2a2c31] rounded-lg focus:border-blue-600 dark:focus:border-[#8e85e6] focus:outline-none text-gray-900 dark:text-[#b0b0b8]"
                                        />
                                        <span className="text-gray-500 dark:text-[#5f5f68]">-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-[rgba(255,255,255,0.07)] bg-white dark:bg-[#2a2c31] rounded-lg focus:border-blue-600 dark:focus:border-[#8e85e6] focus:outline-none text-gray-900 dark:text-[#b0b0b8]"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

// Import tour history for stats
import { tourHistory } from '../data'

export default Hero
