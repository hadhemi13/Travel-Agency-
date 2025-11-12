// src/models/Reservation.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IGuest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

export interface IReservation extends Document {
    // Informations de l'hôtel
    hotelId: string;
    hotelName: string;
    hotelAddress: string;
    hotelCity: string;
    hotelReviewScore?: number;
    hotelReviewNr?: number;

    // Informations de la chambre
    roomId: string;
    roomName: string;
    roomDescription?: string;
    roomSurface?: number;
    roomMaxOccupancy?: string;
    roomBreakfastIncluded?: boolean;
    roomRefundable?: boolean;

    // Dates de réservation
    checkIn: Date;
    checkOut: Date;
    nights: number;

    // Informations de tarification
    totalPrice: number;
    netAmount: number;
    taxes: number;
    currency: string;
    discountedAmount: number;

    // Option de repas
    mealOption: string;
    mealPrice: number;

    // Nombre de voyageurs
    adultsCount: number;

    // Statut du paiement
    paymentStatus: 'pending' | 'paid' | 'failed';
    paymentAmount: number;
    paymentDate?: Date;
    paymentMethod?: string;

    // Informations des voyageurs
    guests: IGuest[];

    // Métadonnées complètes
    metadata?: any;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

const ReservationSchema: Schema = new Schema(
    {
        // Informations de l'hôtel
        hotelId: { type: String, required: true, index: true },
        hotelName: { type: String, required: true },
        hotelAddress: { type: String, required: true },
        hotelCity: { type: String, required: true },
        hotelReviewScore: { type: Number },
        hotelReviewNr: { type: Number },

        // Informations de la chambre
        roomId: { type: String, required: true },
        roomName: { type: String, required: true },
        roomDescription: { type: String },
        roomSurface: { type: Number },
        roomMaxOccupancy: { type: String },
        roomBreakfastIncluded: { type: Boolean },
        roomRefundable: { type: Boolean },

        // Dates de réservation
        checkIn: { type: Date, required: true, index: true },
        checkOut: { type: Date, required: true },
        nights: { type: Number, required: true },

        // Informations de tarification
        totalPrice: { type: Number, required: true },
        netAmount: { type: Number, required: true },
        taxes: { type: Number, required: true },
        currency: { type: String, required: true, default: 'USD' },
        discountedAmount: { type: Number, default: 0 },

        // Option de repas
        mealOption: { type: String, default: 'none' },
        mealPrice: { type: Number, default: 0 },

        // Nombre de voyageurs
        adultsCount: { type: Number, required: true },

        // Statut du paiement
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
            index: true
        },
        paymentAmount: { type: Number, required: true },
        paymentDate: { type: Date },
        paymentMethod: { type: String, default: 'stripe' },

        // Informations des voyageurs
        guests: [{
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true }
        }],

        // Métadonnées complètes (optionnel)
        metadata: { type: Schema.Types.Mixed }
    },
    {
        timestamps: true, // Ajoute automatiquement createdAt et updatedAt
    }
);

// Index composés pour les requêtes fréquentes
ReservationSchema.index({ hotelId: 1, checkIn: 1 });
ReservationSchema.index({ paymentStatus: 1, createdAt: -1 });
ReservationSchema.index({ 'guests.email': 1 });

// Éviter la recompilation du modèle en développement
export default mongoose.models.Reservation ||
mongoose.model<IReservation>('Reservation', ReservationSchema);