'use client'
import { useState } from 'react'
import { BsCalendar, BsGeoAlt, BsSliders, BsSearch } from 'react-icons/bs'
import Image from 'next/image'

interface FilterState {
    city: string
    country: string
    priceMin: string
    priceMax: string
    stars: string
    rating: string
    hotelType: string
    stayFrom: string
    stayTo: string
}

const Hero = ({ filters, setFilters, totalHotels, favoriteHotels }: {
    filters: FilterState,
    setFilters: (filters: FilterState) => void,
    totalHotels: number,
    favoriteHotels: number
}) => {
    const [showFilters, setShowFilters] = useState(false)

    return (
        <section className="relative pt-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Background with Title */}
                <div
                    className="relative p-6 sm:p-12 rounded-3xl overflow-hidden bg-cover bg-center"
                    style={{
                        backgroundImage: `url('/assets/images/bg/05.jpg')`,
                        minHeight: '300px'
                    }}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-indigo-900/40"></div>

                    <div className="relative z-10 flex flex-col items-center justify-center h-full py-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4 drop-shadow-lg">
                            Favorite Hotels
                        </h1>
                        <div className="flex items-center gap-6 text-white text-lg">

                            <div className="flex items-center gap-2">
                                <span className="font-semibold">{favoriteHotels}</span>
                                <span className="opacity-90">Favoris</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Card */}
                <div className="relative -mt-16 sm:-mt-20 mb-8">
                    <div className="bg-white dark:bg-[#222529] shadow-2xl dark:shadow-[0_1rem_3rem_rgba(0,0,0,0.5)] rounded-2xl p-6">
                        {/* Main Search */}
                        <div className="flex flex-col lg:flex-row gap-4 mb-4">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* City */}
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-white">
                                        <BsGeoAlt className="text-blue-600 dark:text-[#8e85e6] mr-2" />
                                        🏙️ Ville
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Rechercher par ville..."
                                        className="w-full px-4 py-3 border-b-2 border-gray-200 dark:border-[rgba(255,255,255,0.07)] bg-transparent focus:border-blue-600 dark:focus:border-[#8e85e6] focus:outline-none transition-colors text-gray-900 dark:text-[#b0b0b8] rounded-lg"
                                        value={filters.city}
                                        onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                                    />
                                </div>

                                {/* Price Range */}
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-white">
                                        <span className="text-blue-600 dark:text-[#8e85e6] mr-2">💰</span>
                                        Prix (€/nuit)
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            className="w-full px-3 py-3 border-b-2 border-gray-200 dark:border-[rgba(255,255,255,0.07)] bg-transparent focus:border-blue-600 dark:focus:border-[#8e85e6] focus:outline-none transition-colors text-gray-900 dark:text-[#b0b0b8] rounded-lg"
                                            value={filters.priceMin}
                                            onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            className="w-full px-3 py-3 border-b-2 border-gray-200 dark:border-[rgba(255,255,255,0.07)] bg-transparent focus:border-blue-600 dark:focus:border-[#8e85e6] focus:outline-none transition-colors text-gray-900 dark:text-[#b0b0b8] rounded-lg"
                                            value={filters.priceMax}
                                            onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Search Button - Aligned to the right */}
                            <div className="flex items-end justify-end lg:justify-start">
                                <button className="w-full lg:w-auto min-w-[140px] bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#8e85e6] dark:to-[#8e85e6] hover:from-blue-700 hover:to-indigo-700 dark:hover:from-[#7a6deb] dark:hover:to-[#7a6deb] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2">
                                    <BsSearch className="text-lg" />
                                    Filtrer
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
                                {/* Stars Filter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-white">
                                        ⭐ Nombre d'étoiles
                                    </label>
                                    <div className="flex gap-2 flex-wrap">
                                        {['all', '1', '2', '3', '4', '5'].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setFilters({ ...filters, stars: star })}
                                                className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${filters.stars === star
                                                    ? 'bg-blue-600 dark:bg-[#8e85e6] text-white shadow-lg'
                                                    : 'bg-gray-100 dark:bg-[#2a2c31] text-gray-700 dark:text-[#b0b0b8] hover:bg-gray-200 dark:hover:bg-[#464950]'
                                                    }`}
                                            >
                                                {star === 'all' ? 'Tous' : `${star} ⭐`}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Rating Filter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-white">
                                        ⭐ Note minimale
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-[rgba(255,255,255,0.07)] bg-white dark:bg-[#2a2c31] rounded-lg focus:border-blue-600 dark:focus:border-[#8e85e6] focus:outline-none transition-colors text-gray-900 dark:text-[#b0b0b8]"
                                        value={filters.rating}
                                        onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                                    >
                                        <option value="all">Toutes les notes</option>
                                        <option value="9">9+ Excellent</option>
                                        <option value="8">8+ Très bien</option>
                                        <option value="7">7+ Bien</option>
                                        <option value="6">6+ Correct</option>
                                        <option value="5">5+ Acceptable</option>
                                    </select>
                                </div>

                                {/* Hotel Type Filter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-white">
                                        🏖️ Type d'hôtel
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-[rgba(255,255,255,0.07)] bg-white dark:bg-[#2a2c31] rounded-lg focus:border-blue-600 dark:focus:border-[#8e85e6] focus:outline-none transition-colors text-gray-900 dark:text-[#b0b0b8]"
                                        value={filters.hotelType}
                                        onChange={(e) => setFilters({ ...filters, hotelType: e.target.value })}
                                    >
                                        <option value="all">Tous les types</option>
                                        <option value="beach">🏖️ Plage</option>
                                        <option value="mountain">🏔️ Montagne</option>
                                        <option value="spa">🧘 Spa & Bien-être</option>
                                        <option value="business">💼 Business</option>
                                        <option value="boutique">✨ Boutique</option>
                                        <option value="resort">🏨 Resort</option>
                                        <option value="city">🏙️ Centre-ville</option>
                                    </select>
                                </div>

                                {/* Stay Period */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-white">
                                        🗓️ Période de séjour
                                    </label>
                                    <div className="space-y-2">
                                        <input
                                            type="date"
                                            placeholder="Date d'arrivée"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-[rgba(255,255,255,0.07)] bg-white dark:bg-[#2a2c31] rounded-lg focus:border-blue-600 dark:focus:border-[#8e85e6] focus:outline-none text-gray-900 dark:text-[#b0b0b8]"
                                            value={filters.stayFrom}
                                            onChange={(e) => setFilters({ ...filters, stayFrom: e.target.value })}
                                        />
                                        <input
                                            type="date"
                                            placeholder="Date de départ"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-[rgba(255,255,255,0.07)] bg-white dark:bg-[#2a2c31] rounded-lg focus:border-blue-600 dark:focus:border-[#8e85e6] focus:outline-none text-gray-900 dark:text-[#b0b0b8]"
                                            value={filters.stayTo}
                                            onChange={(e) => setFilters({ ...filters, stayTo: e.target.value })}
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

export default Hero