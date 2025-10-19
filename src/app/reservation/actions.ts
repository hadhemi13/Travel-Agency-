"use server";

import dbConnect from "@/lib/mongoose";
import Reservation from "@/models/Reservation";

interface GuestInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface CreateReservationInput {
    hotel: any;
    rooms: any[];
    pricing: any;
    booking: any;
    guests: GuestInfo[];
    selectedRoomId: string;
    selectedMeal: string;
}

export async function createReservation(data: CreateReservationInput) {
    await dbConnect();

    const reservation = new Reservation({
        ...data,
        paymentStatus: "pending", // par défaut non payé
    });

    const savedReservation = await reservation.save();

    // Transformer en objet simple pour éviter l'erreur côté client
    return JSON.parse(JSON.stringify(savedReservation));
}
