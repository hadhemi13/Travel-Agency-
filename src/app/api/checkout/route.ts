// import { NextResponse } from 'next/server';
// import Stripe from 'stripe';
//
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-09-30.clover' });
//
// export async function POST() {
//     const session = await stripe.checkout.sessions.create({
//         mode: 'payment',
//         payment_method_types: ['card'],
//         line_items: [
//             {
//                 price_data: {
//                     currency: 'eur',
//                     product_data: { name: 'Test produit' },
//                     unit_amount: 1000, // prix en centimes (€10.00)
//                 },
//                 quantity: 1,
//             },
//         ],
//         success_url: 'http://localhost:3000/success',
//         cancel_url: 'http://localhost:3000/cancel',
//     });
//
//     return NextResponse.json({ url: session.url });
// }
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-09-30.clover'
});

export async function POST(req: NextRequest) {
    try {
        // Récupérer les données de la réservation depuis le body
        const body = await req.json();
        const {
            reservationId,
            amount,
            currency,
            hotelName,
            checkIn,
            checkOut
        } = body;

        // Validation des données
        if (!reservationId || !amount || !currency || !hotelName) {
            return NextResponse.json(
                { error: "Données manquantes pour créer la session de paiement" },
                { status: 400 }
            );
        }

        // Créer la session Stripe
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency.toLowerCase(),
                        product_data: {
                            name: `Réservation - ${hotelName}`,
                            description: `Séjour du ${new Date(checkIn).toLocaleDateString('fr-FR')} au ${new Date(checkOut).toLocaleDateString('fr-FR')}`,
                        },
                        unit_amount: Math.round(amount * 100), // Convertir en centimes
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/reservation/success?session_id={CHECKOUT_SESSION_ID}&reservation_id=${reservationId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/reservation/cancel?reservation_id=${reservationId}`,
            metadata: {
                reservationId: reservationId,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Erreur lors de la création de la session Stripe:', error);
        return NextResponse.json(
            { error: error.message || 'Erreur lors de la création de la session de paiement' },
            { status: 500 }
        );
    }
}