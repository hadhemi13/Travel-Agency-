'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { BsFilter, BsGrid3X3, BsList, BsSearch, BsSortDown, BsTrash, BsHeart, BsMagic } from 'react-icons/bs'
import { FaHeart, FaMagic, FaEdit, FaTrash, FaEye } from 'react-icons/fa'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

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
    isCustom: boolean;
    customPrompt: string | null;
    parentId: string | null;
}

const FavoritesPage = () => {
    const { t } = useTranslation()
    const { data: session, status } = useSession()
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [sortBy, setSortBy] = useState<'recent' | 'name' | 'budget' | 'duration'>('recent')
    const [filterType, setFilterType] = useState<'all' | 'custom' | 'original'>('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [favorites, setFavorites] = useState<FavoriteProgramme[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [customizeModal, setCustomizeModal] = useState<{ isOpen: boolean; programme: FavoriteProgramme | null }>({
        isOpen: false,
        programme: null
    })
    const [customPrompt, setCustomPrompt] = useState('')

    useEffect(() => {
        if (status === 'authenticated') {
            fetchFavorites()
        } else if (status === 'unauthenticated') {
            setLoading(false)
        }
    }, [status])


    const fetchFavorites = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/favorites')
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la récupération')
            }

            setFavorites(data.favorites || [])
        } catch (err: any) {
            console.error('❌ Erreur récupération favoris:', err)
            setError(err.message || 'Erreur lors du chargement des favoris')
        } finally {
            setLoading(false)
        }
    }

    const handleCustomize = async () => {
        if (!customizeModal.programme || !customPrompt.trim()) return

        try {
            const response = await fetch('/api/saved-programmes/customize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    savedProgrammeId: customizeModal.programme.id,
                    customPrompt: customPrompt.trim()
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la personnalisation')
            }

            // Rafraîchir la liste des favoris
            await fetchFavorites()

            // Fermer le modal
            setCustomizeModal({ isOpen: false, programme: null })
            setCustomPrompt('')

            alert(`✅ Programme personnalisé avec succès !\nTitre: ${data.customizedProgramme?.title}\nID: ${data.customizedProgramme?.id}`)
        } catch (err: any) {
            console.error('❌ Erreur personnalisation:', err)
            alert('❌ Erreur lors de la personnalisation: ' + err.message)
        }
    }

    const handleDelete = async (programmeId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce programme des favoris ?')) return

        try {
            const response = await fetch(`/api/saved-programmes/${programmeId}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Erreur lors de la suppression')
            }

            // Rafraîchir la liste des favoris
            await fetchFavorites()
            alert('✅ Programme supprimé des favoris')
        } catch (err: any) {
            console.error('❌ Erreur suppression:', err)
            alert('❌ Erreur lors de la suppression: ' + err.message)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    const formatDateRange = (startDate: string, endDate: string) => {
        return `${formatDate(startDate)} → ${formatDate(endDate)}`
    }

    // Filtrer et trier les données
    const filteredAndSortedData = favorites
        .filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.destination.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesFilter = filterType === 'all' ||
                (filterType === 'custom' && item.isCustom) ||
                (filterType === 'original' && !item.isCustom)
            return matchesSearch && matchesFilter
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'budget':
                    return b.budget - a.budget
                case 'duration':
                    return b.duration - a.duration
                case 'name':
                    return a.name.localeCompare(b.name)
                case 'recent':
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            }
        })

    if (status === 'unauthenticated') {
        return (
            <div className="bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-white mb-4">Connexion requise</h2>
                    <p className="text-gray-400 mb-6">Vous devez être connecté pour voir vos favoris</p>
                    <Link
                        href="/login"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                    >
                        Se connecter
                    </Link>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                    <p className="text-lg font-semibold text-gray-300">
                        Chargement de vos favoris...
                    </p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-white mb-4">Erreur</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={fetchFavorites}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-900 min-h-screen">
            {/* Header */}
            <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <FaHeart className="text-red-500" />
                            Mes Programmes Favoris
                        </h1>
                        <p className="text-gray-400 mt-2">
                            {favorites.length} programme{favorites.length > 1 ? 's' : ''} sauvegardé{favorites.length > 1 ? 's' : ''}
                        </p>
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
                                <option value="recent">Plus récent</option>
                                <option value="name">Nom</option>
                                <option value="budget">Budget</option>
                                <option value="duration">Durée</option>
                            </select>
                        </div>

                        {/* View Mode */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:text-white'
                                    }`}
                            >
                                <BsGrid3X3 size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:text-white'
                                    }`}
                            >
                                <BsList size={16} />
                            </button>
                        </div>
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
                                placeholder="Rechercher un programme..."
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
                            <option value="all">Tous les programmes</option>
                            <option value="original">Programmes originaux</option>
                            <option value="custom">Programmes personnalisés</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-6">
                {filteredAndSortedData.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <FaHeart size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">
                            Aucun favori
                        </h3>
                        <p className="text-gray-400 mb-6">
                            {searchTerm || filterType !== 'all'
                                ? 'Aucun programme ne correspond à vos filtres'
                                : 'Vous n\'avez pas encore ajouté de programmes aux favoris'
                            }
                        </p>
                        {!searchTerm && filterType === 'all' && (
                            <Link
                                href="/List-trip"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                            >
                                Voir mes programmes
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className={viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                        : 'space-y-4'
                    }>
                        {filteredAndSortedData.map((programme) => (
                            <div key={programme.id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                                {/* Image Section */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src="/assets/images/bg/08.jpg"
                                        alt={programme.name}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Badges */}
                                    <div className="absolute top-3 left-3 flex space-x-2">
                                        <span className="flex items-center px-3 py-1 bg-black text-white text-sm font-semibold rounded-full">
                                            {programme.type}
                                        </span>
                                        {programme.isCustom && (
                                            <span className="flex items-center px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
                                                <FaMagic className="mr-1" />
                                                Personnalisé
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="absolute top-3 right-3 flex space-x-2">
                                        <button
                                            onClick={() => handleDelete(programme.id)}
                                            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                            title="Supprimer des favoris"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-4">
                                    <h3 className="text-xl font-bold mb-2 text-white">
                                        {programme.name}
                                    </h3>

                                    <p className="text-gray-300 text-sm mb-2">
                                        📍 {programme.destination}
                                    </p>

                                    <p className="text-gray-300 text-sm mb-2">
                                        📅 {formatDateRange(programme.startDate, programme.endDate)}
                                    </p>

                                    <p className="text-gray-300 text-sm mb-4">
                                        👥 {programme.voyageurs} personne{programme.voyageurs > 1 ? 's' : ''} • {programme.duration} jour{programme.duration > 1 ? 's' : ''}
                                    </p>

                                    {programme.isCustom && programme.customPrompt && (
                                        <div className="mb-4 p-3 bg-purple-900/30 rounded-lg">
                                            <p className="text-purple-300 text-sm">
                                                <strong>Personnalisation:</strong> {programme.customPrompt}
                                            </p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/trip-results?destination=${encodeURIComponent(programme.destination)}&typeVoyage=${encodeURIComponent(programme.type)}&dateDebut=${encodeURIComponent(programme.startDate)}&dateFin=${encodeURIComponent(programme.endDate)}&budget=${programme.budget}&voyageurs=${programme.voyageurs}&programmeId=${programme.programmeId}`}
                                                className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium"
                                            >
                                                <FaEye className="mr-1" />
                                                Voir détails
                                            </Link>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {!programme.isCustom && (
                                                <button
                                                    onClick={() => setCustomizeModal({ isOpen: true, programme })}
                                                    className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                                                >
                                                    <FaMagic size={12} />
                                                    Personnaliser
                                                </button>
                                            )}

                                            <span className="text-green-400 font-bold text-lg">
                                                {programme.budget}€
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Customize Modal */}
            {customizeModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-white mb-4">
                            ✨ Personnaliser le programme
                        </h3>

                        <p className="text-gray-300 mb-4">
                            <strong>{customizeModal.programme?.name}</strong>
                        </p>

                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                Décrivez vos modifications :
                            </label>
                            <textarea
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                placeholder="Ex: ajouter une journée de plage, réduire le budget à 700€, inclure plus de restaurants..."
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                rows={4}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleCustomize}
                                disabled={!customPrompt.trim()}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                            >
                                Personnaliser avec l'IA
                            </button>
                            <button
                                onClick={() => {
                                    setCustomizeModal({ isOpen: false, programme: null })
                                    setCustomPrompt('')
                                }}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FavoritesPage
