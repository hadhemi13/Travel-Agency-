'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { tourHistory } from '../../data'
import TourCard from './TourCard'
import TourCardWithCustomize from './TourCardWithCustomize'
import CustomizeButton from '@/components/CustomizeButton'

interface FavoriteProgramme {
    id: string;
    programmeId: string;
    name: string;
    destination: string;
    type: string;
    budget: number;
    startDate: string;
    endDate: string;
    voyageurs: number;
    programme: any;
    isDone: boolean;
    isFavorite: boolean;
    createdAt: string;
    duration: number;
}

interface FilterState {
    destination: string
    type: string
    priceMin: string
    priceMax: string
    duration: string
    rating: string
    tourType: string
    dateFrom: string
    dateTo: string
}

interface TourCardListProps {
    showFavorites?: boolean;
    onFavoriteChange?: () => void;
    filters?: FilterState;
}

const TourCardList = ({ showFavorites = false, onFavoriteChange, filters }: TourCardListProps) => {
    const { data: session, status } = useSession();
    const [sortBy, setSortBy] = useState('recent')
    const [currentPage, setCurrentPage] = useState(1)
    const [favorites, setFavorites] = useState<FavoriteProgramme[]>([]);
    const [loading, setLoading] = useState(showFavorites);
    const [error, setError] = useState<string | null>(null);
    const itemsPerPage = 6

    useEffect(() => {
        if (showFavorites && status === 'authenticated') {
            fetchFavorites();
        } else if (showFavorites && status === 'unauthenticated') {
            setLoading(false);
        }
    }, [status, showFavorites]);

    // Réinitialiser la page quand les filtres changent
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);


    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/favorites');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la récupération');
            }

            setFavorites(data.favorites || []);
            // Notifier le parent du changement
            if (onFavoriteChange) {
                onFavoriteChange();
            }
        } catch (err: any) {
            console.error('❌ Erreur récupération favoris:', err);
            setError(err.message || 'Erreur lors du chargement des favoris');
        } finally {
            setLoading(false);
        }
    };

    const handleCustomize = (customizedProgramme: any) => {
        // Rafraîchir la liste des favoris après personnalisation
        fetchFavorites();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatDateRange = (startDate: string, endDate: string) => {
        return `${formatDate(startDate)} → ${formatDate(endDate)}`;
    };

    // Convertir les favoris en format TourHistoryType
    const favoritesAsTours = favorites.map((favorite, index) => ({
        id: parseInt(favorite.id.slice(-6), 16), // ID numérique pour l'affichage
        originalId: favorite.id, // ID UUID original pour la navigation
        programmeId: favorite.programmeId, // ID du programme original
        name: favorite.name,
        bookingDate: formatDate(favorite.createdAt),
        travelDate: formatDateRange(favorite.startDate, favorite.endDate),
        status: favorite.isDone ? 'completed' : 'upcoming' as 'completed' | 'upcoming' | 'cancelled',
        type: favorite.type,
        days: favorite.duration,
        nights: favorite.duration - 1,
        benefits: {
            flight: 1,
            hotel: 1,
            activities: 1
        },
        price: favorite.budget,
        image: "/assets/images/bg/08.jpg",
        bookingReference: `FAV-${favorite.id.slice(-8).toUpperCase()}`
    }));

    // Utiliser les favoris ou l'historique selon le mode
    const allTours = showFavorites ? favoritesAsTours : tourHistory;

    // Appliquer les filtres
    const filteredTours = allTours.filter((tour) => {
        if (!filters) return true;

        // Filtre par destination
        if (filters.destination && !tour.name.toLowerCase().includes(filters.destination.toLowerCase())) {
            return false;
        }

        // Filtre par type de tour
        if (filters.tourType && filters.tourType !== 'all' && tour.type !== filters.tourType) {
            return false;
        }

        // Filtre par prix
        if (filters.priceMin && tour.price < parseFloat(filters.priceMin)) {
            return false;
        }
        if (filters.priceMax && tour.price > parseFloat(filters.priceMax)) {
            return false;
        }

        // Filtre par durée
        if (filters.duration && filters.duration !== 'all') {
            const tourDays = tour.days;
            switch (filters.duration) {
                case '1-3':
                    if (tourDays < 1 || tourDays > 3) return false;
                    break;
                case '4-7':
                    if (tourDays < 4 || tourDays > 7) return false;
                    break;
                case '8-14':
                    if (tourDays < 8 || tourDays > 14) return false;
                    break;
                case '15+':
                    if (tourDays < 15) return false;
                    break;
            }
        }

        // Filtre par date (si disponible dans les données)
        if (filters.dateFrom || filters.dateTo) {
            // Note: Cette logique dépend de la structure de vos données de date
            // Vous devrez peut-être l'adapter selon vos besoins
        }

        return true;
    });

    // Sort tours
    const sortedTours = [...filteredTours].sort((a, b) => {
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

    // États de chargement et erreur pour les favoris
    if (showFavorites && loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                    <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                        Chargement de vos favoris...
                    </p>
                </div>
            </div>
        );
    }

    if (showFavorites && error) {
        return (
            <div className="text-center py-20">
                <div className="text-6xl mb-4">⚠️</div>
                <p className="text-xl text-red-600 dark:text-red-400 mb-4">
                    {error}
                </p>
                <button
                    onClick={fetchFavorites}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    // État vide pour les favoris
    if (showFavorites && allTours.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="text-6xl mb-4">❤️</div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Aucun favori
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Vous n'avez pas encore ajouté de programmes aux favoris.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                    Cliquez sur le cœur ❤️ dans vos programmes pour les ajouter aux favoris !
                </p>
                <Link
                    href="/List-trip"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                    Voir mes programmes
                </Link>
            </div>
        );
    }

    return (
        <section className="pt-0 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with Result Count and Sort */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-center justify-between mb-6">
                    <div className="xl:col-span-6">
                        <h5 className="text-lg font-semibold mb-0 text-gray-900 dark:text-white">
                            {showFavorites ? (
                                <>Affichage de {startIndex + 1}-{Math.min(endIndex, sortedTours.length)} sur {sortedTours.length} favori{sortedTours.length > 1 ? 's' : ''}</>
                            ) : (
                                <>Showing {startIndex + 1}-{Math.min(endIndex, sortedTours.length)} of {sortedTours.length} result</>
                            )}
                        </h5>
                    </div>
                    <div className="xl:col-span-4 xl:col-start-9">
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
                        showFavorites ? (
                            <TourCardWithCustomize
                                key={tour.id}
                                tour={tour}
                                onDelete={() => fetchFavorites()}
                                onCustomize={handleCustomize}
                            />
                        ) : (
                            <TourCard key={tour.id} tour={tour} />
                        )
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