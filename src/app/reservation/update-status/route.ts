import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Reservation from "@/models/Reservation"; // Votre modèle Mongoose

export async function POST(req: NextRequest) {
    try {
        const { reservationId, paymentStatus } = await req.json();

        if (!reservationId || !paymentStatus) {
            return NextResponse.json(
                { error: "Données manquantes" },
                { status: 400 }
            );
        }

        // Connexion à MongoDB
        await dbConnect();

        // Mettre à jour la réservation
        const updatedReservation = await Reservation.findByIdAndUpdate(
            reservationId,
            {
                paymentStatus,
                updatedAt: new Date()
            },
            { new: true } // Retourne le document mis à jour
        );

        if (!updatedReservation) {
            return NextResponse.json(
                { error: "Réservation non trouvée" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            reservation: updatedReservation
        });
    } catch (error: any) {
        console.error("Erreur lors de la mise à jour:", error);
        return NextResponse.json(
            { error: error.message || "Erreur serveur" },
            { status: 500 }
        );
    }
}