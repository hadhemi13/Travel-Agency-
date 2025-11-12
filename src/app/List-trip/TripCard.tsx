'use client';

import { useState, useEffect } from 'react';
import { PlaceType } from './Type';
import { FaMapMarkerAlt, FaPhone, FaCheck, FaClock, FaHeart } from 'react-icons/fa';
import { BsBuilding } from 'react-icons/bs';
import { ProgramImage } from '@/components/ProgramImage';
import { generateTravelImageUrl, preloadImage } from '@/lib/imageGenerator';

interface TripCardProps {
    place: PlaceType;
    programmeId?: string;
    onStatusChange?: (id: string, isDone: boolean) => void;
    onFavoriteChange?: (id: string, isFavorite: boolean) => void;
}

const TripCard = ({ place, programmeId, onStatusChange, onFavoriteChange }: TripCardProps) => {
    const { name, image, category, open, address, phoneNo } = place;

    const [isDone, setIsDone] = useState(!open);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isFavoriteUpdating, setIsFavoriteUpdating] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>(typeof image === 'string' ? image : '');

    // 🧠 Génération automatique de l’image selon la destination
    useEffect(() => {
        if (typeof image === 'string' && image.length > 0 && !image.startsWith('blob:')) {
            setImageUrl(image);
            return;
        }

        const generatedUrl = generateTravelImageUrl(name, category?.name || 'Voyage');
        setImageUrl(generatedUrl);
        preloadImage(generatedUrl);
    }, [image, name, category?.name]);

    // 🔎 Vérification des favoris
    useEffect(() => {
        if (programmeId) checkIfFavorite();
    }, [programmeId]);

    const checkIfFavorite = async () => {
        if (!programmeId) return;
        try {
            const response = await fetch('/api/favorites', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                signal: AbortSignal.timeout(5000),
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();

            if (data.favorites && Array.isArray(data.favorites)) {
                const isAlreadyFavorite = data.favorites.some(
                    (fav: any) => fav.programmeId === programmeId
                );
                setIsFavorite(isAlreadyFavorite);
            } else {
                setIsFavorite(false);
            }
        } catch (error) {
            console.warn('⚠️ Erreur lors de la vérification des favoris:', error);
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isDone: newStatus }),
            });

            if (response.ok) {
                setIsDone(newStatus);
                onStatusChange?.(programmeId, newStatus);
            }
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const getProgrammeDetails = async () => {
        if (!programmeId) return null;
        const urls = [`/api/programmes/${programmeId}`, `/api/saved-programmes/${programmeId}`];

        for (const url of urls) {
            try {
                const res = await fetch(url);
                if (!res.ok) continue;
                const data = await res.json();
                return data?.programme?.programme || data?.programme || null;
            } catch (error) {
                console.warn(`⚠️ Erreur récupération programme via ${url}`, error);
            }
        }
        return null;
    };

    const handleFavoriteToggle = async () => {
        if (!programmeId || isFavoriteUpdating) return;

        setIsFavoriteUpdating(true);
        const newFavoriteStatus = !isFavorite;

        try {
            let programmePayload = null;

            if (newFavoriteStatus) {
                const programmeDetails = await getProgrammeDetails();
                if (!programmeDetails) {
                    alert('❌ Impossible de récupérer le programme complet.');
                    setIsFavoriteUpdating(false);
                    return;
                }

                const meta = Array.isArray(programmeDetails) ? {} : programmeDetails;
                const programmeSteps =
                    Array.isArray(programmeDetails)
                        ? programmeDetails
                        : Array.isArray(meta?.programme)
                            ? meta.programme
                            : Array.isArray(meta?.programme?.programme)
                                ? meta.programme.programme
                                : [];

                if (!Array.isArray(programmeSteps) || programmeSteps.length === 0) {
                    alert('❌ Programme vide. Impossible d’ajouter aux favoris.');
                    setIsFavoriteUpdating(false);
                    return;
                }

                const destinationName =
                    meta.destination ||
                    meta.destinationName ||
                    place?.name?.split(' - ')[0] ||
                    name;

                const budgetValue =
                    typeof meta.budget === 'number'
                        ? meta.budget
                        : typeof place.price === 'number'
                            ? place.price
                            : 0;

                const startDateIso = meta.startDate
                    ? new Date(meta.startDate).toISOString()
                    : new Date().toISOString();

                const endDateIso = meta.endDate
                    ? new Date(meta.endDate).toISOString()
                    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

                const voyageursCount =
                    typeof meta.voyageurs === 'number' && !Number.isNaN(meta.voyageurs)
                        ? meta.voyageurs
                        : 1;

                programmePayload = {
                    title: meta.name || name,
                    destinationName,
                    type: meta.type || category?.name || 'Voyage',
                    budget: budgetValue,
                    startDate: startDateIso,
                    endDate: endDateIso,
                    voyageurs: voyageursCount,
                    programme: programmeSteps,
                    originalProgrammeId: meta.originalProgrammeId || meta.programmeId || programmeId,
                    imageUrl: imageUrl,
                };
            }

            const response = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    programmeId,
                    isFavorite: newFavoriteStatus,
                    programmeData: programmePayload,
                }),
            });

            if (response.ok) {
                setIsFavorite(newFavoriteStatus);
                onFavoriteChange?.(programmeId, newFavoriteStatus);
            } else {
                const err = await response.json();
                alert(`Erreur: ${err.message || 'Impossible de mettre à jour les favoris.'}`);
            }
        } catch (error) {
            console.error('❌ Erreur réseau:', error);
            alert('Erreur de connexion.');
        } finally {
            setIsFavoriteUpdating(false);
        }
    };

    return (
        <div className="bg-gray-800 dark:bg-[#2a2c31] rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                <ProgramImage
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover rounded-t-xl"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex space-x-2">
                    {category?.name && (
                        <span className="flex items-center px-3 py-1 bg-black/80 text-white text-sm font-semibold rounded-full">
                            <BsBuilding className="mr-1 text-yellow-400" /> {category.name}
                        </span>
                    )}
                    <span
                        className={`px-3 py-1 text-white text-sm font-semibold rounded-full ${open ? 'bg-green-600' : 'bg-red-600'
                            }`}
                    >
                        {open ? 'Open' : 'Closed'}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-grow text-white">
                <h3 className="text-xl font-bold mb-2 leading-tight">{name}</h3>

                {address && (
                    <p className="flex items-center text-gray-300 text-sm mb-1">
                        <FaMapMarkerAlt className="mr-2 text-gray-400" /> {address}
                    </p>
                )}

                {phoneNo && (
                    <p className="flex items-center text-gray-300 text-sm mb-4">
                        <FaPhone className="mr-2 text-gray-400" /> {phoneNo}
                    </p>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end mt-auto pt-4 border-t border-gray-600">
                    <div className="flex items-center gap-3">
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
                                        <FaCheck /> Done
                                    </>
                                ) : (
                                    'Mark as Done'
                                )}
                            </button>
                        )}

                        <button
                            onClick={handleFavoriteToggle}
                            disabled={isFavoriteUpdating}
                            className={`transition-colors ${isFavoriteUpdating ? 'opacity-50 cursor-not-allowed' : ''
                                } ${isFavorite
                                    ? 'text-red-500 hover:text-red-600'
                                    : 'text-gray-400 hover:text-red-400'
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
