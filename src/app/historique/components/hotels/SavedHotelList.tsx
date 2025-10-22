'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import HotelCard from './HotelCard'
import { SavedHotelType } from '../../data'

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

const SavedHotelList = ({ filters, onCountsUpdate }: { filters: FilterState, onCountsUpdate?: (counts: { total: number, favorites: number }) => void }) => {
    const { data: session, status } = useSession()
    const [hotels, setHotels] = useState<SavedHotelType[]>([])
    const [filteredHotels, setFilteredHotels] = useState<SavedHotelType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (status === 'authenticated') {
            fetchSavedHotels()
        } else if (status === 'unauthenticated') {
            setLoading(false)
        }
    }, [status])

    // Filtrer les hôtels quand les filtres changent
    useEffect(() => {
        filterHotels()
    }, [hotels, filters])

    // Mettre à jour les compteurs quand les hôtels changent
    useEffect(() => {
        if (onCountsUpdate) {
            console.log('Mise à jour compteurs:', { total: hotels.length, favorites: filteredHotels.length })
            onCountsUpdate({
                total: hotels.length,
                favorites: filteredHotels.length
            })
        }
    }, [hotels, filteredHotels, onCountsUpdate])

    const filterHotels = () => {
        let filtered = [...hotels]

        // Filtre par ville
        if (filters.city) {
            filtered = filtered.filter(hotel =>
                hotel.address.toLowerCase().includes(filters.city.toLowerCase())
            )
        }

        // Filtre par pays
        if (filters.country) {
            filtered = filtered.filter(hotel =>
                hotel.address.toLowerCase().includes(filters.country.toLowerCase())
            )
        }

        // Filtre par prix
        if (filters.priceMin) {
            filtered = filtered.filter(hotel => hotel.price >= parseFloat(filters.priceMin))
        }
        if (filters.priceMax) {
            filtered = filtered.filter(hotel => hotel.price <= parseFloat(filters.priceMax))
        }

        // Filtre par note
        if (filters.rating !== 'all') {
            const minRating = parseFloat(filters.rating)
            filtered = filtered.filter(hotel => hotel.rating >= minRating)
        }

        // Filtre par type d'hôtel (basé sur les amenities)
        if (filters.hotelType !== 'all') {
            filtered = filtered.filter(hotel => {
                const amenities = Array.isArray(hotel.amenities) ? hotel.amenities : []
                const amenityString = amenities.join(' ').toLowerCase()

                switch (filters.hotelType) {
                    case 'beach':
                        return amenityString.includes('beach') || amenityString.includes('pool') || amenityString.includes('ocean')
                    case 'mountain':
                        return amenityString.includes('mountain') || amenityString.includes('ski') || amenityString.includes('hiking')
                    case 'spa':
                        return amenityString.includes('spa') || amenityString.includes('wellness') || amenityString.includes('massage')
                    case 'business':
                        return amenityString.includes('business') || amenityString.includes('conference') || amenityString.includes('meeting')
                    case 'boutique':
                        return amenityString.includes('boutique') || amenityString.includes('luxury') || amenityString.includes('design')
                    case 'resort':
                        return amenityString.includes('resort') || amenityString.includes('all-inclusive') || amenityString.includes('villa')
                    case 'city':
                        return amenityString.includes('city') || amenityString.includes('downtown') || amenityString.includes('center')
                    default:
                        return true
                }
            })
        }

        // Filtre par période de séjour
        if (filters.stayFrom && filters.stayTo) {
            filtered = filtered.filter(hotel => {
                if (!hotel.checkIn || !hotel.checkOut) return true

                const hotelCheckIn = new Date(hotel.checkIn)
                const hotelCheckOut = new Date(hotel.checkOut)
                const filterFrom = new Date(filters.stayFrom)
                const filterTo = new Date(filters.stayTo)

                return hotelCheckIn >= filterFrom && hotelCheckOut <= filterTo
            })
        }

        setFilteredHotels(filtered)
    }

    const fetchSavedHotels = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/hotels/save')

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des hôtels sauvegardés')
            }

            const data = await response.json()
            const hotelsData = data.hotels || []
            console.log('Hôtels récupérés:', hotelsData.length, hotelsData)
            setHotels(hotelsData)
            setFilteredHotels(hotelsData)
        } catch (err) {
            console.error('Erreur:', err)
            setError(err instanceof Error ? err.message : 'Une erreur est survenue')
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveHotel = async (hotelId: string) => {
        // Confirmation avant suppression
        const hotelName = hotels.find(h => h.hotel_id === hotelId)?.name || 'cet hôtel'
        const confirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer "${hotelName}" de vos favoris ?`)

        if (!confirmed) {
            return
        }

        try {
            const response = await fetch(`/api/hotels/save?hotelId=${hotelId}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erreur lors de la suppression de l\'hôtel')
            }

            const result = await response.json()
            console.log('Suppression réussie:', result.message)

            // Mettre à jour la liste localement
            setHotels(prev => prev.filter(hotel => hotel.hotel_id !== hotelId))

            // Message de succès
            alert('Hôtel supprimé de vos favoris avec succès !')
        } catch (err) {
            console.error('Erreur lors de la suppression:', err)
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression'
            setError(errorMessage)
            // Afficher une alerte pour informer l'utilisateur
            alert(`Erreur: ${errorMessage}`)
        }
    }

    const handleDuplicateHotel = async (hotel: SavedHotelType) => {
        try {
            // Créer une copie de l'hôtel avec un nouvel ID
            const duplicatedHotel = {
                ...hotel,
                id: `duplicate_${Date.now()}`,
                hotel_id: `duplicate_${Date.now()}`, // ID unique pour la base de données
                name: hotel.name + " (copie)",
                savedDate: new Date().toLocaleDateString('fr-FR'),
                originalHotelId: hotel.hotel_id, // Stocker l'ID original pour les API externes
                // Stocker aussi l'ID original dans la description temporairement
                description: hotel.description + ` [ORIGINAL_ID:${hotel.hotel_id}]`
            }

            // Envoyer à l'API pour sauvegarder
            const response = await fetch('/api/hotels/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(duplicatedHotel)
            })

            if (!response.ok) {
                throw new Error('Erreur lors de la duplication de l\'hôtel')
            }

            // Mettre à jour la liste localement
            setHotels(prev => [...prev, duplicatedHotel])
            alert('Hôtel dupliqué avec succès !')
        } catch (err) {
            console.error('Erreur lors de la duplication:', err)
            setError(err instanceof Error ? err.message : 'Erreur lors de la duplication')
        }
    }

    const handleEditHotel = async (updatedHotel: SavedHotelType): Promise<void> => {
        try {
            console.log('🔧 Modification de l\'hôtel:', updatedHotel)
            console.log('📋 Données envoyées à l\'API:', {
                id: updatedHotel.id,
                hotel_id: updatedHotel.hotel_id,
                checkIn: updatedHotel.checkIn,
                checkOut: updatedHotel.checkOut,
                originalHotelId: updatedHotel.originalHotelId
            })

            const response = await fetch('/api/hotels/save', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedHotel)
            })

            console.log('📡 Réponse de l\'API:', response.status, response.statusText)

            if (!response.ok) {
                const errorData = await response.json()
                console.error('❌ Erreur API:', errorData)
                throw new Error(errorData.error || errorData.details || 'Erreur lors de la modification de l\'hôtel')
            }

            const result = await response.json()
            console.log('✅ Modification réussie:', result.message)

            // Mettre à jour la liste localement
            setHotels(prev => prev.map(hotel =>
                hotel.id === updatedHotel.id ? updatedHotel : hotel
            ))

            // Message de succès
            console.log('🎉 Hôtel modifié avec succès !')
        } catch (err) {
            console.error('💥 Erreur lors de la modification:', err)
            let errorMessage = 'Erreur lors de la modification de l\'hôtel'

            if (err instanceof Error) {
                errorMessage = err.message
                console.error('📝 Message d\'erreur:', err.message)
                console.error('📚 Stack trace:', err.stack)
            } else if (err && typeof err === 'object' && 'details' in err && typeof err.details === 'string') {
                errorMessage = err.details
            }

            setError(errorMessage)
            console.error('🚨 Erreur détaillée:', errorMessage)
            throw err // Re-throw pour que le composant HotelCard puisse gérer l'erreur
        }
    }


    if (status === 'loading' || loading) {
        return (
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (status === 'unauthenticated') {
        return (
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Connexion requise
                        </h2>
                        <p className="text-gray-600 dark:text-[#b0b0b8]">
                            Veuillez vous connecter pour voir vos hôtels sauvegardés.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">
                            Erreur
                        </h2>
                        <p className="text-gray-600 dark:text-[#b0b0b8] mb-4">
                            {error}
                        </p>
                        <button
                            onClick={fetchSavedHotels}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Réessayer
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (filteredHotels.length === 0 && hotels.length > 0) {
        return (
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Aucun résultat trouvé
                        </h2>
                        <p className="text-gray-600 dark:text-[#b0b0b8] mb-6">
                            Aucun hôtel ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (hotels.length === 0) {
        return (
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Aucun hôtel sauvegardé
                        </h2>
                        <p className="text-gray-600 dark:text-[#b0b0b8] mb-6">
                            Vous n'avez pas encore sauvegardé d'hôtels. Explorez nos hôtels et sauvegardez vos favoris !
                        </p>
                        <a
                            href="/hotels/search"
                            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Explorer les hôtels
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#222529] pt-0 pb-20">
            {/* Affichage des erreurs */}
            {error && (
                <div className="container mx-auto px-6 mb-6">
                    <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Erreur:</span>
                            <button
                                onClick={() => setError(null)}
                                className="text-red-500 hover:text-red-700 dark:text-red-300 dark:hover:text-red-100 font-bold"
                            >
                                ×
                            </button>
                        </div>
                        <p className="mt-1">{error}</p>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {filteredHotels.map((hotel) => (
                        <div key={hotel.id} className="transform hover:scale-105 transition-all duration-300">
                            <HotelCard
                                hotel={hotel}
                                onRemove={handleRemoveHotel}
                                onDuplicate={handleDuplicateHotel}
                                onEdit={handleEditHotel}
                                allHotels={hotels}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SavedHotelList
