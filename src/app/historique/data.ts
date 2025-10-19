import { StaticImageData } from "next/image";

export type TourHistoryType = {
    id: number;
    name: string;
    bookingDate: string;
    travelDate: string;
    status: 'completed' | 'upcoming' | 'cancelled';
    type: string;
    days: number;
    nights: number;
    benefits: {
        flight?: number;
        hotel?: number;
        activities?: number;
    };
    price: number;
    image: string;
    bookingReference: string;
};

export type SavedHotelType = {
    id: string;
    hotel_id: string;
    name: string;
    address: string;
    rating: number;
    reviewCount: number;
    price: number;
    currency: string;
    image: string;
    amenities: string[];
    description: string;
    savedDate: string;
    checkIn?: string;
    checkOut?: string;
    adults?: number;
    rooms?: number;
    originalHotelId?: string; // ID de l'hôtel original pour les duplicatas
};

// Données mock supprimées - maintenant les données viennent de la base de données
const tourHistory: TourHistoryType[] = [];

export { tourHistory };

