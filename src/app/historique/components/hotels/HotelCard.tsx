'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FaCalendarAlt, FaStar, FaMapMarkerAlt, FaCopy, FaEdit, FaShare, FaCheck, FaTimes } from 'react-icons/fa'
import { FaWifi, FaSwimmingPool, FaDumbbell, FaUtensils } from 'react-icons/fa'
import { SavedHotelType } from '../../data'
import ShareModal from './ShareModal'

interface HotelCardProps {
    hotel: SavedHotelType
    onRemove?: () => void
    onDuplicate?: (hotel: SavedHotelType) => void
    onEdit?: (hotel: SavedHotelType) => void
    allHotels?: SavedHotelType[] // Liste de tous les hôtels pour trouver l'original
}

const HotelCard = ({ hotel, onRemove, onDuplicate, onEdit, allHotels = [] }: HotelCardProps) => {
    const { name, address, rating, reviewCount, price, currency, image, amenities, savedDate, checkIn, checkOut, adults, rooms } = hotel
    const [showActions, setShowActions] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [showShareModal, setShowShareModal] = useState(false)
    const [editData, setEditData] = useState({
        checkIn: checkIn || '',
        checkOut: checkOut || ''
    })

    // Fonction pour obtenir l'ID correct pour l'API
    const getApiHotelId = () => {
        console.log('🔍 Debug getApiHotelId pour hôtel:', {
            hotel_id: hotel.hotel_id,
            originalHotelId: hotel.originalHotelId,
            description: hotel.description,
            isDuplicate: hotel.hotel_id.startsWith('duplicate_')
        });

        // Si c'est un hôtel dupliqué, utiliser l'ID original
        if (hotel.hotel_id.startsWith('duplicate_')) {
            // Essayer d'abord originalHotelId
            if (hotel.originalHotelId) {
                console.log('🔹 Utilisation de originalHotelId:', hotel.originalHotelId);
                return hotel.originalHotelId;
            }
            // Sinon, extraire de la description
            const match = hotel.description.match(/\[ORIGINAL_ID:([^\]]+)\]/);
            if (match) {
                console.log('🔹 ID original extrait de la description:', match[1]);
                return match[1];
            }
            // Fallback: pour les anciens hôtels dupliqués, essayer de trouver l'hôtel original
            console.log('⚠️ Ancien hôtel dupliqué sans ID original, recherche de l\'hôtel original...');

            // Essayer de trouver l'hôtel original en cherchant un hôtel avec le même nom (sans " (copie)")
            const originalName = hotel.name.replace(' (copie)', '');
            console.log('🔍 Recherche d\'hôtel avec le nom:', originalName);

            // Chercher l'hôtel original dans la liste des hôtels
            const originalHotel = allHotels.find(h =>
                h.name === originalName &&
                !h.hotel_id.startsWith('duplicate_') &&
                h.hotel_id !== hotel.hotel_id
            );

            if (originalHotel) {
                console.log('✅ Hôtel original trouvé:', originalHotel.hotel_id);
                return originalHotel.hotel_id;
            }

            // Si pas trouvé, essayer de trouver par adresse
            const originalByAddress = allHotels.find(h =>
                h.address === hotel.address &&
                !h.hotel_id.startsWith('duplicate_') &&
                h.hotel_id !== hotel.hotel_id
            );

            if (originalByAddress) {
                console.log('✅ Hôtel original trouvé par adresse:', originalByAddress.hotel_id);
                return originalByAddress.hotel_id;
            }

            console.log('❌ Aucun hôtel original trouvé, utilisation de l\'ID dupliqué');
            return hotel.hotel_id;
        }
        // Pour les hôtels normaux, utiliser l'ID normal
        console.log('🔹 Hôtel normal, ID utilisé:', hotel.hotel_id);
        return hotel.hotel_id;
    }

    const getAmenityIcon = (amenity: string) => {
        const amenityLower = amenity.toLowerCase()
        if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return FaWifi
        if (amenityLower.includes('pool') || amenityLower.includes('swimming')) return FaSwimmingPool
        if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return FaDumbbell
        if (amenityLower.includes('restaurant') || amenityLower.includes('dining')) return FaUtensils
        return FaWifi // Default icon
    }

    const getAmenityColor = (amenity: string) => {
        const amenityLower = amenity.toLowerCase()
        if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return 'text-blue-500'
        if (amenityLower.includes('pool') || amenityLower.includes('swimming')) return 'text-cyan-500'
        if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return 'text-red-500'
        if (amenityLower.includes('restaurant') || amenityLower.includes('dining')) return 'text-orange-500'
        return 'text-gray-500'
    }

    const handleDuplicate = () => {
        if (onDuplicate) {
            onDuplicate(hotel)
        }
    }

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSaveEdit = () => {
        if (onEdit) {
            const updatedHotel = {
                ...hotel,
                ...editData
            }
            onEdit(updatedHotel)
        }
        setIsEditing(false)
    }

    const handleCancelEdit = () => {
        setEditData({
            checkIn: checkIn || '',
            checkOut: checkOut || ''
        })
        setIsEditing(false)
    }

    const handleShare = () => {
        setShowShareModal(true)
    }

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            alert('Lien copié dans le presse-papiers !')
        } catch (err) {
            console.error('Erreur lors de la copie:', err)
        }
    }

    return (
        <div className="group bg-white dark:bg-[#2a2c31] rounded-2xl shadow-xl hover:shadow-2xl dark:shadow-[0_1rem_3rem_rgba(0,0,0,0.7)] transition-all duration-500 overflow-hidden h-full flex flex-col hover:-translate-y-3 hover:scale-[1.02]">
            {/* Image with Overlay */}
            <div className="relative overflow-hidden h-96">
                <Image
                    src={image}
                    alt={name}
                    width={500}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                <div className="absolute inset-0 flex flex-col p-6 z-10">
                    {/* Hotel Title Overlay */}


                    <div className="w-full mt-auto">
                        <div className="bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="font-bold text-lg ml-2">{rating}</span>
                            </div>
                            <span className="text-sm text-gray-600">({reviewCount} reviews)</span>
                            {hotel.id.startsWith('duplicate_') && (
                                <span className="ml-auto px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                    Copie
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="px-6 py-6 flex-1 flex flex-col">
                <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600 dark:text-[#b0b0b8]">
                        <svg className="w-5 h-5 mr-3 text-[#8e85e6]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-base font-medium">{address}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-[#b0b0b8]">
                        <svg className="w-5 h-5 mr-3 text-[#8e85e6]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-base">Saved: {savedDate}</span>
                    </div>
                    {(checkIn || editData.checkIn) && (checkOut || editData.checkOut) && (
                        <div className="flex items-center text-gray-600 dark:text-[#b0b0b8]">
                            <svg className="w-5 h-5 mr-3 text-[#8e85e6]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-base">
                                Séjour: {editData.checkIn || checkIn} - {editData.checkOut || checkOut}
                            </span>
                        </div>
                    )}
                </div>

                {/* Price and Buttons Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-semibold text-green-600 dark:text-[#0cbc87]">
                            {currency}{Math.round(price)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-[#a1a1a8]">/night</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                        <Link
                            href={`/hotels/hotel-detail/${getApiHotelId()}?checkIn=${encodeURIComponent(editData.checkIn || checkIn || '')}&checkOut=${encodeURIComponent(editData.checkOut || checkOut || '')}&adults=${adults || 1}&rooms=${rooms || 1}`}
                            className="bg-[#8e85e6] hover:bg-[#7a6deb] text-white px-3 py-2 rounded-lg font-medium text-xs transition-all duration-300"
                        >
                            Voir
                        </Link>

                        {/* Boutons d'actions secondaires */}
                        <div className="flex gap-1">
                            <button
                                onClick={handleDuplicate}
                                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all duration-300"
                                title="Dupliquer"
                            >
                                <FaCopy className="w-3 h-3" />
                            </button>

                            {/* Bouton Modifier seulement pour les hôtels dupliqués */}
                            {hotel.hotel_id.startsWith('duplicate_') && (
                                <button
                                    onClick={handleEdit}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg transition-all duration-300"
                                    title="Modifier les dates"
                                >
                                    <FaEdit className="w-3 h-3" />
                                </button>
                            )}

                            <button
                                onClick={handleShare}
                                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-all duration-300"
                                title="Partager"
                            >
                                <FaShare className="w-3 h-3" />
                            </button>

                            <button
                                onClick={onRemove}
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-300"
                                title="Supprimer"
                            >
                                <FaTimes className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Formulaire d'édition des dates - seulement pour les hôtels dupliqués */}
                {isEditing && hotel.hotel_id.startsWith('duplicate_') && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-[#3a3c41] rounded-lg border border-gray-200 dark:border-gray-600">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Modifier les dates de séjour</h4>
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Date d'arrivée
                                    </label>
                                    <input
                                        type="date"
                                        value={editData.checkIn}
                                        onChange={(e) => setEditData({ ...editData, checkIn: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-[#4a4c51] dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Date de départ
                                    </label>
                                    <input
                                        type="date"
                                        value={editData.checkOut}
                                        onChange={(e) => setEditData({ ...editData, checkOut: e.target.value })}
                                        min={editData.checkIn || undefined}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-[#4a4c51] dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                                >
                                    Sauvegarder
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Share Modal */}
            <ShareModal
                hotel={hotel}
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
            />
        </div>
    )
}

export default HotelCard