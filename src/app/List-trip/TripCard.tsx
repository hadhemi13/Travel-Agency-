'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { PlaceType } from './Type';
import { FaMapMarkerAlt, FaPhone, FaArrowRight, FaHeart, FaCheck, FaClock } from 'react-icons/fa';
import { BsBuilding } from 'react-icons/bs';

interface TripCardProps {
    place: PlaceType;
    programmeId?: string;
    onStatusChange?: (id: string, isDone: boolean) => void;
    onFavoriteChange?: (id: string, isFavorite: boolean) => void;
}

const TripCard = ({ place, programmeId, onStatusChange, onFavoriteChange }: TripCardProps) => {
    const { name, image, category, open, address, phoneNo } = place;
    const [isDone, setIsDone] = useState(!open); // open=false signifie isDone=true
    const [isUpdating, setIsUpdating] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isFavoriteUpdating, setIsFavoriteUpdating] = useState(false);

    // Vérifier si le programme est déjà en favoris au chargement
    useEffect(() => {
        if (programmeId) {
            checkIfFavorite();
        }
    }, [programmeId]);

    const checkIfFavorite = async () => {
        if (!programmeId) {
            console.warn('⚠️ Aucun programmeId fourni pour vérifier les favoris');
            return;
        }

        try {
            const response = await fetch('/api/favorites', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Ajouter un timeout pour éviter les requêtes qui traînent
                signal: AbortSignal.timeout(5000)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.favorites && Array.isArray(data.favorites)) {
                const isAlreadyFavorite = data.favorites.some((fav: any) => fav.programmeId === programmeId);
                setIsFavorite(isAlreadyFavorite);
                console.log(`🔍 Programme ${programmeId} ${isAlreadyFavorite ? 'est' : 'n\'est pas'} en favoris`);
            } else {
                console.warn('⚠️ Format de réponse invalide pour les favoris:', data);
                setIsFavorite(false);
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    console.warn('⏰ Timeout lors de la vérification des favoris');
                } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    console.warn('🌐 Erreur de connexion lors de la vérification des favoris');
                } else {
                    console.error('❌ Erreur lors de la vérification des favoris:', error);
                }
            } else {
                console.error('❌ Erreur lors de la vérification des favoris:', error);
            }
            // En cas d'erreur, on assume que ce n'est pas un favori
            setIsFavorite(false);
        }
    };

    const handleStatusToggle = async () => {
        if (!programmeId || isUpdating) return;

        setIsUpdating(true);
        const newStatus = !isDone;

        try {
            const response = await fetch(`/api/programmes/${programmeId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isDone: newStatus }),
            });

            if (response.ok) {
                setIsDone(newStatus);
                if (onStatusChange) {
                    onStatusChange(programmeId, newStatus);
                }
            } else {
                console.error('Erreur lors de la mise à jour du statut');
            }
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleFavoriteToggle = async () => {
        if (!programmeId || isFavoriteUpdating) return;

        setIsFavoriteUpdating(true);
        const newFavoriteStatus = !isFavorite;

        try {
            const response = await fetch('/api/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    programmeId: programmeId,
                    isFavorite: newFavoriteStatus,
                    programmeData: {
                        title: name,
                        destinationName: place.address,
                        type: category.name,
                        budget: place.price || 0,
                        startDate: new Date().toISOString(),
                        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                        voyageurs: 1,
                        programme: {}
                    }
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setIsFavorite(newFavoriteStatus);
                if (onFavoriteChange) {
                    onFavoriteChange(programmeId, newFavoriteStatus);
                }
                console.log('✅ Favori mis à jour avec succès:', data);
            } else {
                const errorData = await response.json();
                console.error('❌ Erreur lors de la mise à jour des favoris:', errorData);
                // Afficher un message d'erreur plus informatif
                const errorMessage = errorData.details || errorData.error || 'Impossible de mettre à jour les favoris';
                alert(`Erreur: ${errorMessage}`);
            }
        } catch (error) {
            console.error('❌ Erreur réseau:', error);
            alert('Erreur de connexion. Veuillez réessayer.');
        } finally {
            setIsFavoriteUpdating(false);
        }
    };

    return (
        <div className="bg-gray-800 dark:bg-[#2a2c31] rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                <Image
                    src={image}
                    alt={name}
                    width={500}
                    height={300}
                    className="w-full h-full object-cover"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex space-x-2">
                    {/* Category Badge */}
                    <span className="flex items-center px-3 py-1 bg-black text-white text-sm font-semibold rounded-full">
                        <BsBuilding className="mr-1 text-yellow-400" /> {category.name}
                    </span>
                    {/* Status Badge */}
                    <span className={`px-3 py-1 text-white text-sm font-semibold rounded-full ${open ? 'bg-green-600' : 'bg-red-600'
                        }`}>
                        {open ? 'Open' : 'Closed'}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-grow text-white">
                {/* Title */}
                <h3 className="text-xl font-bold mb-2 leading-tight text-white">
                    {name}
                </h3>

                {/* Address */}
                {address && (
                    <p className="flex items-center text-gray-300 text-sm mb-1">
                        <FaMapMarkerAlt className="mr-2 text-gray-400" /> {address}
                    </p>
                )}

                {/* Phone */}
                {phoneNo && (
                    <p className="flex items-center text-gray-300 text-sm mb-4">
                        <FaPhone className="mr-2 text-gray-400" /> {phoneNo}
                    </p>
                )}

                {/* Action Row */}
                <div className="flex items-center justify-end mt-auto pt-4 border-t border-gray-600">
                    <div className="flex items-center gap-3">
                        {/* Bouton Mark as Done */}
                        {programmeId && (
                            <button
                                onClick={handleStatusToggle}
                                disabled={isUpdating}
                                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${isDone
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isUpdating ? (
                                    <FaClock className="animate-spin" />
                                ) : isDone ? (
                                    <>
                                        <FaCheck />
                                        ✅ Done
                                    </>
                                ) : (
                                    'Mark as Done'
                                )}
                            </button>
                        )}

                        <button
                            onClick={handleFavoriteToggle}
                            disabled={isFavoriteUpdating}
                            className={`transition-colors ${isFavoriteUpdating ? 'opacity-50 cursor-not-allowed' : ''} ${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-400'
                                }`}
                        >
                            <FaHeart size={20} className={isFavorite ? 'fill-current' : ''} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripCard;