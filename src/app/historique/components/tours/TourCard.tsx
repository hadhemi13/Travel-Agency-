'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FaMapMarkerAlt, FaPhone, FaArrowRight, FaHeart, FaCheck, FaClock, FaShare, FaCopy, FaTimes } from 'react-icons/fa'
import { BsBuilding } from 'react-icons/bs'
import { TourHistoryType } from '../../data'

// Fonction pour valider un UUID
const isValidUUID = (str: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}

// Fonction pour générer un UUID simple
const generateSimpleUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

interface TourCardProps {
    tour: TourHistoryType
    onFavoriteChange?: (programmeId: string, isFavorite: boolean) => void
}

const TourCard = ({ tour, onFavoriteChange }: TourCardProps) => {
    const { benefits, travelDate, bookingDate, days, name, nights, price, type, status, image, bookingReference } = tour
    const [isFavorite, setIsFavorite] = useState(false)
    const [isFavoriteUpdating, setIsFavoriteUpdating] = useState(false)
    const [showShareButtons, setShowShareButtons] = useState(false)
    const [shareUrl, setShareUrl] = useState('')

    // Vérifier si le programme est déjà en favoris au chargement
    useEffect(() => {
        if (tour.programmeId || tour.originalId) {
            checkIfFavorite()
        }
    }, [tour.programmeId, tour.originalId])

    const checkIfFavorite = async () => {
        const programmeId = tour.programmeId || tour.originalId
        if (!programmeId) {
            console.warn('⚠️ Aucun programmeId fourni pour vérifier les favoris')
            return
        }

        // Créer un AbortController pour le timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        try {
            const response = await fetch('/api/favorites', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: controller.signal
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()

            if (data.favorites && Array.isArray(data.favorites)) {
                const isAlreadyFavorite = data.favorites.some((fav: any) => fav.programmeId === programmeId || fav.id === programmeId)
                setIsFavorite(isAlreadyFavorite)
                console.log(`🔍 Programme ${programmeId} ${isAlreadyFavorite ? 'est' : 'n\'est pas'} en favoris`)
            } else {
                console.warn('⚠️ Format de réponse invalide pour les favoris:', data)
                setIsFavorite(false)
            }
        } catch (error) {
            clearTimeout(timeoutId)

            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    console.warn('⏰ Timeout lors de la vérification des favoris')
                } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    console.warn('🌐 Erreur de connexion lors de la vérification des favoris')
                } else {
                    console.error('❌ Erreur lors de la vérification des favoris:', error)
                }
            } else {
                console.error('❌ Erreur lors de la vérification des favoris:', error)
            }
            // En cas d'erreur, on assume que ce n'est pas un favori
            setIsFavorite(false)
        }
    }

    const getProgrammeDetails = async (programmeId: string) => {
        const fetchProgramme = async (url: string) => {
            try {
                const res = await fetch(url);
                if (!res.ok) {
                    return null;
                }
                const data = await res.json();
                return data?.programme || null;
            } catch (error) {
                console.warn(`⚠️ Impossible de récupérer le programme via ${url}`, error);
                return null;
            }
        };

        const programmeFromSaved = await fetchProgramme(`/api/saved-programmes/${programmeId}`);
        if (programmeFromSaved) return programmeFromSaved;

        const programmeFromVoyage = await fetchProgramme(`/api/programmes/${programmeId}`);
        if (programmeFromVoyage) return programmeFromVoyage;

        const programmeFromSavedQuery = await fetchProgramme(`/api/saved-programmes?programmeId=${programmeId}`);
        if (programmeFromSavedQuery) return programmeFromSavedQuery;

        return null;
    };

    const handleFavoriteToggle = async () => {
        let programmeId = tour.programmeId || tour.originalId;

        if (!programmeId) {
            programmeId = tour.originalId || tour.programmeId || tour.id?.toString() || generateSimpleUUID();
        }

        if (!programmeId || isFavoriteUpdating) return

        setIsFavoriteUpdating(true)
        const newFavoriteStatus = !isFavorite

        try {
            let programmePayload = null

            if (newFavoriteStatus) {
                let programmeDetails = null;
                const candidateIds = [tour.originalId, tour.programmeId, tour.id?.toString()].filter(Boolean) as string[];

                for (const candidateId of candidateIds) {
                    programmeDetails = await getProgrammeDetails(candidateId);
                    if (programmeDetails) {
                        break;
                    }
                }

                if (!programmeDetails) {
                    programmeDetails = await getProgrammeDetails(programmeId);
                }

                if (!programmeDetails) {
                    alert('❌ Impossible de récupérer le programme complet. Réessayez plus tard.')
                    setIsFavoriteUpdating(false)
                    return
                }

                const meta = Array.isArray(programmeDetails) ? {} : programmeDetails;

                const programmeArray = Array.isArray(meta.programme)
                    ? meta.programme
                    : Array.isArray(programmeDetails)
                        ? programmeDetails
                        : Array.isArray(meta?.programme?.programme)
                            ? meta.programme.programme
                            : Array.isArray(meta?.days)
                                ? meta.days
                                : [];

                if (!Array.isArray(programmeArray) || programmeArray.length === 0) {
                    alert('❌ Programme vide. Impossible d’ajouter aux favoris.');
                    setIsFavoriteUpdating(false);
                    return;
                }

                const destinationName =
                    meta.destination ||
                    meta.destinationName ||
                    tour.name;

                const budgetValue =
                    typeof meta.budget === 'number'
                        ? meta.budget
                        : price;

                const startDateIso = meta.startDate
                    ? new Date(meta.startDate).toISOString()
                    : new Date().toISOString();

                const endDateIso = meta.endDate
                    ? new Date(meta.endDate).toISOString()
                    : new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

                const voyageursCount =
                    typeof meta.voyageurs === 'number' && !Number.isNaN(meta.voyageurs)
                        ? meta.voyageurs
                        : 1;

                const imageUrlValue =
                    (typeof meta.imageUrl === 'string' && meta.imageUrl.length > 0)
                        ? meta.imageUrl
                        : (typeof image === 'string' && image.length > 0 ? image : null);

                programmePayload = {
                    title: meta.name || name,
                    destinationName,
                    type: meta.type || type,
                    budget: budgetValue,
                    startDate: startDateIso,
                    endDate: endDateIso,
                    voyageurs: voyageursCount,
                    programme: programmeArray,
                    originalProgrammeId: meta.originalProgrammeId || meta.programmeId || null,
                    imageUrl: imageUrlValue,
                }
            }

            const response = await fetch('/api/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    programmeId: programmeId,
                    isFavorite: newFavoriteStatus,
                    programmeData: programmePayload
                }),
            })

            if (response.ok) {
                setIsFavorite(newFavoriteStatus)

                // Notifier le parent du changement
                if (onFavoriteChange) {
                    onFavoriteChange(programmeId, newFavoriteStatus)
                }
            } else {
                const errorData = await response.json()
                console.error('❌ Erreur lors de la mise à jour des favoris:', errorData)
                const errorMessage = errorData.details || errorData.error || 'Impossible de mettre à jour les favoris'
                alert(`Erreur: ${errorMessage}`)
            }
        } catch (error) {
            console.error('❌ Erreur réseau:', error)
            alert('Erreur de connexion. Veuillez réessayer.')
        } finally {
            setIsFavoriteUpdating(false)
        }
    }

    // Fonctions de partage
    const generateShareUrl = () => {
        const baseUrl = window.location.origin
        const programmeId = tour.originalId || tour.programmeId || tour.id
        const travelDates = tour.travelDate.split(' → ')
        const dateDebut = travelDates[0] || ''
        const dateFin = travelDates[1] || ''
        const url = `${baseUrl}/trip-results?destination=${encodeURIComponent(tour.name)}&typeVoyage=${encodeURIComponent(tour.type)}&dateDebut=${encodeURIComponent(dateDebut)}&dateFin=${encodeURIComponent(dateFin)}&budget=${tour.price}&voyageurs=1&programmeId=${programmeId}`
        setShareUrl(url)
        return url
    }

    const handleShareClick = () => {
        const url = generateShareUrl()
        setShowShareButtons(!showShareButtons)
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            alert('✅ Lien copié dans le presse-papiers !')
        } catch (err) {
            console.error('Erreur lors de la copie:', err)
            alert('❌ Erreur lors de la copie du lien')
        }
    }

    const shareToSocial = (platform: string) => {
        const url = shareUrl || generateShareUrl()
        const text = `Découvrez ce programme de voyage incroyable : ${name} - ${type} pour ${price}€`

        let shareUrl_platform = ''

        switch (platform) {
            case 'facebook':
                shareUrl_platform = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
                break
            case 'twitter':
                shareUrl_platform = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
                break
            case 'linkedin':
                shareUrl_platform = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
                break
            case 'whatsapp':
                shareUrl_platform = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
                break
            case 'telegram':
                shareUrl_platform = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
                break
        }

        if (shareUrl_platform) {
            window.open(shareUrl_platform, '_blank', 'width=600,height=400')
        }
    }

    const shareViaWebAPI = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Programme de voyage : ${name}`,
                    text: `Découvrez ce programme de voyage incroyable : ${name} - ${type} pour ${price}€`,
                    url: shareUrl || generateShareUrl()
                })
            } catch (err) {
                console.log('Partage annulé ou erreur:', err)
            }
        } else {
            // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
            copyToClipboard()
        }
    }


    return (
        <div className="relative bg-gray-800 dark:bg-[#2a2c31] rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
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
                    {/* Type Badge */}
                    <span className="flex items-center px-3 py-1 bg-black text-white text-sm font-semibold rounded-full">
                        <BsBuilding className="mr-1 text-yellow-400" /> {type}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-grow text-white">
                {/* Title */}
                <h3 className="text-xl font-bold mb-2 leading-tight text-white">
                    {name}
                </h3>

                {/* Travel Date */}
                <p className="flex items-center text-gray-300 text-sm mb-1">
                    <FaMapMarkerAlt className="mr-2 text-gray-400" /> {travelDate}
                </p>

                {/* Duration & Travelers */}
                <p className="flex items-center text-gray-300 text-sm mb-4">
                    <FaPhone className="mr-2 text-gray-400" /> {days} jours • {nights} nuits
                </p>

                {/* Action Row */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-600">
                    <Link
                        href={(() => {
                            // Prioriser programmeId (ID dans ProgrammesVoyage) car c'est là que sont les détails complets
                            // Sinon utiliser originalId (ID dans SavedProgramme)
                            // L'API /api/saved-programmes/[id] cherche dans les deux tables automatiquement
                            const programmeId = tour.originalId || tour.programmeId;

                            if (!programmeId) {
                                console.warn('⚠️ Aucun ID de programme disponible');
                                return '#';
                            }

                            // Construire l'URL avec l'ID du programme
                            // L'API cherchera d'abord dans SavedProgramme, puis dans ProgrammesVoyage
                            const travelDates = tour.travelDate.split(' → ');
                            const dateDebut = travelDates[0] || '';
                            const dateFin = travelDates[1] || '';

                            return `/trip-results?destination=${encodeURIComponent(tour.name)}&typeVoyage=${encodeURIComponent(tour.type)}&dateDebut=${encodeURIComponent(dateDebut)}&dateFin=${encodeURIComponent(dateFin)}&budget=${tour.price}&voyageurs=1&programmeId=${programmeId}`;
                        })()}
                        className="flex items-center text-[#8e85e6] hover:text-[#7a6deb] transition-colors text-sm font-medium"
                        onClick={() => {
                            const programmeId = tour.originalId || tour.programmeId;
                            console.log('🔍 View details clicked:', {
                                programmeId: programmeId,
                                programmeIdField: tour.programmeId,
                                originalId: tour.originalId,
                                tourId: tour.id,
                                name: tour.name,
                                willFetch: `Récupération des détails depuis /api/saved-programmes/${programmeId} (cherche dans SavedProgramme puis ProgrammesVoyage)`
                            });
                        }}
                    >
                        View detail <FaArrowRight className="ml-1" />
                    </Link>

                    <div className="flex items-center gap-3">
                        {/* Bouton Partage */}
                        <button
                            onClick={handleShareClick}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="Partager ce programme"
                        >
                            <FaShare size={18} />
                        </button>

                        {/* Bouton Favori */}
                        <button
                            onClick={handleFavoriteToggle}
                            disabled={isFavoriteUpdating}
                            className={`transition-colors ${isFavoriteUpdating ? 'opacity-50 cursor-not-allowed' : ''} ${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-400'
                                }`}
                            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        >
                            <FaHeart size={20} className={isFavorite ? 'fill-current' : ''} />
                        </button>

                        {/* Price */}
                        <span className="text-green-400 font-bold text-lg">
                            ${price}
                        </span>
                    </div>
                </div>
            </div>

            {/* Boutons de Partage Intégrés */}
            {showShareButtons && (
                <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-10 rounded-xl">
                    <div className="bg-gray-800 rounded-lg p-4 max-w-sm w-full mx-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-bold text-white">Partager</h3>
                            <button
                                onClick={() => setShowShareButtons(false)}
                                className="text-gray-400 hover:text-white text-xl"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="mb-3">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    className="flex-1 bg-gray-700 text-white p-2 rounded text-xs"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors"
                                    title="Copier le lien"
                                >
                                    <FaCopy size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => shareToSocial('facebook')}
                                className="flex flex-col items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors text-xs"
                            >
                                <span className="text-lg">📘</span>
                                <span>Facebook</span>
                            </button>
                            <button
                                onClick={() => shareToSocial('twitter')}
                                className="flex flex-col items-center gap-1 bg-blue-400 hover:bg-blue-500 text-white p-2 rounded transition-colors text-xs"
                            >
                                <span className="text-lg">🐦</span>
                                <span>Twitter</span>
                            </button>
                            <button
                                onClick={() => shareToSocial('linkedin')}
                                className="flex flex-col items-center gap-1 bg-blue-700 hover:bg-blue-800 text-white p-2 rounded transition-colors text-xs"
                            >
                                <span className="text-lg">💼</span>
                                <span>LinkedIn</span>
                            </button>
                            <button
                                onClick={() => shareToSocial('whatsapp')}
                                className="flex flex-col items-center gap-1 bg-green-600 hover:bg-green-700 text-white p-2 rounded transition-colors text-xs"
                            >
                                <span className="text-lg">💬</span>
                                <span>WhatsApp</span>
                            </button>
                            <button
                                onClick={() => shareToSocial('telegram')}
                                className="flex flex-col items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors text-xs"
                            >
                                <span className="text-lg">✈️</span>
                                <span>Telegram</span>
                            </button>
                            <button
                                onClick={shareViaWebAPI}
                                className="flex flex-col items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white p-2 rounded transition-colors text-xs"
                            >
                                <span className="text-lg">📱</span>
                                <span>Autres</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TourCard
