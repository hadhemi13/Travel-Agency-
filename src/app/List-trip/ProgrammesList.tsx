'use client';
import { useState, useEffect } from 'react';
import TripCard from './TripCard';
import { PlaceType } from './Type';
import { BsBuilding, BsAirplane, BsMap, BsHeart } from 'react-icons/bs';

interface ProgrammeData {
    id: string;
    name: string;
    destination: string;
    type: string;
    budget: number;
    startDate: string;
    endDate: string;
    voyageurs: number;
    programme: any;
    isDone: boolean;
    createdAt: string;
    duration: number;
}

interface ProgrammesListProps {
    filter?: string;
}

const ProgrammesList = ({ filter = "all" }: ProgrammesListProps) => {
    const [programmes, setProgrammes] = useState<ProgrammeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProgrammes();
    }, []);

    const fetchProgrammes = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/programmes');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la récupération');
            }

            setProgrammes(data.programmes || []);
        } catch (err: any) {
            console.error('❌ Erreur récupération programmes:', err);
            setError(err.message || 'Erreur lors du chargement des programmes');
        } finally {
            setLoading(false);
        }
    };

    const getCategoryIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'aventure':
                return BsAirplane;
            case 'culture':
            case 'culturel':
                return BsBuilding;
            case 'détente':
            case 'relaxation':
                return BsHeart;
            default:
                return BsMap;
        }
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

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                    <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                        Chargement de vos programmes...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <div className="text-6xl mb-4">⚠️</div>
                <p className="text-xl text-red-600 dark:text-red-400 mb-4">
                    {error}
                </p>
                <button
                    onClick={fetchProgrammes}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    if (programmes.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Aucun programme sauvegardé
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Vous n'avez pas encore sauvegardé de programmes de voyage.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                    Générez et sauvegardez vos premiers programmes depuis la page de génération !
                </p>
            </div>
        );
    }

    const handleStatusChange = (id: string, isDone: boolean) => {
        // Mettre à jour l'état local
        setProgrammes(prevProgrammes =>
            prevProgrammes.map(programme =>
                programme.id === id ? { ...programme, isDone } : programme
            )
        );
    };

    const handleFavoriteChange = (id: string, isFavorite: boolean) => {
        // Mettre à jour l'état local
        setProgrammes(prevProgrammes =>
            prevProgrammes.map(programme =>
                programme.id === id ? { ...programme, isFavorite } : programme
            )
        );
    };

    // Filtrer les programmes selon le filtre sélectionné
    const filteredProgrammes = programmes.filter((programme) => {
        switch (filter) {
            case "done":
                return programme.isDone;
            case "pending":
                return !programme.isDone;
            case "all":
            default:
                return true;
        }
    });

    // Convertir les programmes filtrés en format PlaceType pour TripCard
    const tripCards: PlaceType[] = filteredProgrammes.map((programme) => {
        const Icon = getCategoryIcon(programme.type);

        return {
            name: `${programme.destination} - ${programme.type}`,
            image: "/assets/images/bg/08.jpg", // Image par défaut
            category: {
                name: programme.type,
                icon: Icon
            },
            open: !programme.isDone,
            recommended: true,
            price: programme.budget,
            address: formatDateRange(programme.startDate, programme.endDate),
            phoneNo: `${programme.duration} jours • ${programme.voyageurs} voyageur${programme.voyageurs > 1 ? 's' : ''}`
        };
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tripCards.map((trip, index) => (
                <TripCard
                    key={filteredProgrammes[index].id}
                    place={trip}
                    programmeId={filteredProgrammes[index].id}
                    onStatusChange={handleStatusChange}
                    onFavoriteChange={handleFavoriteChange}
                />
            ))}
        </div>
    );
};

export default ProgrammesList;
