import { NextResponse } from "next/server";
import Stripe from "stripe";

// ⚠️ Ajoute ta clé secrète Stripe dans ton fichier .env.local
// STRIPE_SECRET_KEY=sk_test_...

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
    try {
        const { amount } = await req.json();

        // Vérification du montant
        if (!amount || isNaN(amount)) {
            return NextResponse.json(
                { error: "Montant invalide" },
                { status: 400 }
            );
        }

        // 💳 Création du PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(Number(amount) * 100), // montant en centimes
            currency: "usd", // ou "eur" / "tnd" si ton compte Stripe le supporte
            automatic_payment_methods: { enabled: true },
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
        console.error("Erreur Stripe:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
