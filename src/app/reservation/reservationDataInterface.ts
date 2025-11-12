interface ReservationData {
    hotel: {
        id: string;
        name: string;
        name_trans?: string;
        address: string;
        city: string;
        city_trans?: string;
        review_score: number;
        review_score_word?: string;
        review_nr: number;
        accommodation_type?: string;
        photos: Photo[];
        facilities: { name: string }[];
        languages: string[];
    };
    rooms: Room[];
    pricing: {
        totalPrice: number;
        currency: string;
        taxes: number;
        discountedAmount: number;
        strikethroughAmount: number;
        netAmount: number;
    };
    booking: {
        checkIn: string;
        checkOut: string;
        adults: string;
        rooms: string;
    };
}



interface Room {
    block_id: string;
    name: string;
    description?: string;
    max_occupancy: string;
    room_surface_m2: number;
    room_surface_feet2: number;
    mealplan: string;
    breakfast_included: number;
    refundable: number;
    photos: Photo[];
    highlights: Highlight[];
    bed_configurations: BedConfiguration[];
}

interface BedConfiguration {
    bed_types: BedType[];
}


interface Highlight {
    translated_name: string;
    icon?: string;
}

interface BedType {
    name_with_count: string;
}
