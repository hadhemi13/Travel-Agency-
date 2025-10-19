'use client'
import { useState, useEffect } from 'react'
import { BsCalendar, BsGeoAlt, BsSliders, BsSearch } from 'react-icons/bs'
import Image from 'next/image'
import TourCardList from './TourCardList'
import { useSession } from 'next-auth/react'

interface FilterState {
    destination: string
    type: string
    priceMin: string
    priceMax: string
    status: string
    duration: string
    travelFrom: string
    travelTo: string
}

const Hero = ({ filters, setFilters, totalTours, favoriteTours, showFavorites = false }: {
    filters: FilterState,
    setFilters: (filters: FilterState) => void,
    totalTours: number,
    favoriteTours: number,
    showFavorites?: boolean
}) => {
    const [showFilters, setShowFilters] = useState(false)
    const [actualFavoriteCount, setActualFavoriteCount] = useState(0)
    const { data: session, status } = useSession()

    // Récupérer le nombre réel de favoris
    useEffect(() => {
        if (status === 'authenticated') {
            fetchFavoriteCount()
        }
    }, [status])

    const fetchFavoriteCount = async () => {
        try {
            const response = await fetch('/api/favorites')
            const data = await response.json()

            if (response.ok && data.favorites) {
                setActualFavoriteCount(data.favorites.length)
            }
        } catch (error) {
            console.error('❌ Erreur récupération nombre de favoris:', error)
        }
    }

    return (
        <section className="relative pt-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Background with Title */}
                <div
                    className="relative p-6 sm:p-12 rounded-3xl overflow-hidden bg-cover bg-center"
                    style={{
                        backgroundImage: `url('/assets/images/bg/08.jpg')`,
                        minHeight: '300px'
                    }}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 to-emerald-900/40"></div>

                    <div className="relative z-10 flex flex-col items-center justify-center h-full py-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4 drop-shadow-lg">
                            {showFavorites ? 'Mes Favoris ❤️' : 'Tour History'}
                        </h1>
                        <div className="flex items-center gap-6 text-white text-lg">
                            {showFavorites ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{actualFavoriteCount}</span>
                                        <span className="opacity-90">Programmes Favoris</span>
                                    </div>

                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{totalTours}</span>
                                        <span className="opacity-90">Total Tours</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{actualFavoriteCount}</span>
                                        <span className="opacity-90">Favoris</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Search and Filter Card */}
                <div className="relative -mt-16 sm:-mt-20 mb-8">
                    <div className="bg-white dark:bg-[#222529] shadow-2xl dark:shadow-[0_1rem_3rem_rgba(0,0,0,0.5)] rounded-2xl p-6">
                        {/* Main Search */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            {/* Destination */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-white">
                                    <BsGeoAlt className="text-green-600 dark:text-[#8e85e6] mr-2" />
                                    🌍 Destination
                                </label>
                                <input
                                    type="text"
                                    placeholder="Rechercher par destination..."
                                    className="w-full px-4 py-3 border-b-2 border-gray-200 dark:border-[rgba(255,255,255,0.07)] bg-transparent focus:border-green-600 dark:focus:border-[#8e85e6] focus:outline-none transition-colors text-gray-900 dark:text-[#b0b0b8] rounded-lg"
                                    value={filters.destination}
                                    onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                                />
                            </div>

                            {/* Tour Type */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-white">
                                    <span className="text-green-600 dark:text-[#8e85e6] mr-2">🎯</span>
                                    Type de tour
                                </label>
                                <select
                                    className="w-full px-4 py-3 border-b-2 border-gray-200 dark:border-[rgba(255,255,255,0.07)] bg-transparent focus:border-green-600 dark:focus:border-[#8e85e6] focus:outline-none transition-colors text-gray-900 dark:text-[#b0b0b8] rounded-lg"
                                    value={filters.type}
                                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                >
                                    <option value="">Tous les types</option>
                                    <option value="Adventure">🏔️ Adventure</option>
                                    <option value="Cultural">🏛️ Cultural</option>
                                    <option value="Beach">🏖️ Beach</option>
                                    <option value="City">🏙️ City</option>
                                    <option value="Nature">🌿 Nature</option>
                                    <option value="Luxury">✨ Luxury</option>
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-white">
                                    <span className="text-green-600 dark:text-[#8e85e6] mr-2">💰</span>
                                    Prix ($/total)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className="w-full px-3 py-3 border-b-2 border-gray-200 dark:border-[rgba(255,255,255,0.07)] bg-transparent focus:border-green-600 dark:focus:border-[#8e85e6] focus:outline-none transition-colors text-gray-900 dark:text-[#b0b0b8] rounded-lg"
                                        value={filters.priceMin}
                                        onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className="w-full px-3 py-3 border-b-2 border-gray-200 dark:border-[rgba(255,255,255,0.07)] bg-transparent focus:border-green-600 dark:focus:border-[#8e85e6] focus:outline-none transition-colors text-gray-900 dark:text-[#b0b0b8] rounded-lg"
                                        value={filters.priceMax}
                                        onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Search Button */}
                            <div className="flex items-end">
                                <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 dark:from-[#8e85e6] dark:to-[#8e85e6] hover:from-green-700 hover:to-emerald-700 dark:hover:from-[#7a6deb] dark:hover:to-[#7a6deb] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2">
                                    <BsSearch className="text-lg" />
                                    Filtrer
                                </button>
                            </div>
                        </div>

                        {/* Advanced Filters Toggle */}
                        <div className="mt-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="w-full bg-green-50 dark:bg-[#2a2c31] hover:bg-green-100 dark:hover:bg-[#464950] text-green-700 dark:text-[#8e85e6] font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
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
                                        📊 Statut du tour
                                    </label>
                                    <div className="flex gap-2 flex-wrap">
                                        {[
                                            { value: '', label: 'Tous' },
                                            { value: 'completed', label: '✅ Completed' },
                                            { value: 'upcoming', label: '⏳ Upcoming' },
                                            { value: 'cancelled', label: '❌ Cancelled' }
                                        ].map((status) => (
                                            <button
                                                key={status.value}
                                                onClick={() => setFilters({ ...filters, status: status.value })}
                                                className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${filters.status === status.value
                                                    ? 'bg-green-600 dark:bg-[#8e85e6] text-white shadow-lg'
                                                    : 'bg-gray-100 dark:bg-[#2a2c31] text-gray-700 dark:text-[#b0b0b8] hover:bg-gray-200 dark:hover:bg-[#464950]'
                                                    }`}
                                            >
                                                {status.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Duration Filter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-white">
                                        ⏱️ Durée du tour
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-[rgba(255,255,255,0.07)] bg-white dark:bg-[#2a2c31] rounded-lg focus:border-green-600 dark:focus:border-[#8e85e6] focus:outline-none transition-colors text-gray-900 dark:text-[#b0b0b8]"
                                        value={filters.duration}
                                        onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                                    >
                                        <option value="">Toutes les durées</option>
                                        <option value="1-3">1-3 jours</option>
                                        <option value="4-7">4-7 jours</option>
                                        <option value="8-14">8-14 jours</option>
                                        <option value="15+">15+ jours</option>
                                    </select>
                                </div>

                                {/* Travel Period */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-white">
                                        🗓️ Période de voyage
                                    </label>
                                    <div className="space-y-2">
                                        <input
                                            type="date"
                                            placeholder="Date de début"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-[rgba(255,255,255,0.07)] bg-white dark:bg-[#2a2c31] rounded-lg focus:border-green-600 dark:focus:border-[#8e85e6] focus:outline-none text-gray-900 dark:text-[#b0b0b8]"
                                            value={filters.travelFrom}
                                            onChange={(e) => setFilters({ ...filters, travelFrom: e.target.value })}
                                        />
                                        <input
                                            type="date"
                                            placeholder="Date de fin"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-[rgba(255,255,255,0.07)] bg-white dark:bg-[#2a2c31] rounded-lg focus:border-green-600 dark:focus:border-[#8e85e6] focus:outline-none text-gray-900 dark:text-[#b0b0b8]"
                                            value={filters.travelTo}
                                            onChange={(e) => setFilters({ ...filters, travelTo: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tours List Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <TourCardList showFavorites={showFavorites} onFavoriteChange={fetchFavoriteCount} />
            </div>
        </section>
    )
}

export default Hero