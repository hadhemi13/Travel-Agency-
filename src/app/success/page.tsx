"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function SuccessPage() {
    useEffect(() => {
        // Ici tu peux par exemple vider le panier localStorage si tu en as un
        localStorage.removeItem("cart");
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
                <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4" />

                <h1 className="text-3xl font-bold text-green-700 mb-2">
                    Paiement réussi 🎉
                </h1>
                <p className="text-gray-600 mb-6">
                    Merci pour votre achat ! Votre paiement a été traité avec succès.
                </p>

                <Link
                    href="/"
                    className="bg-green-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-green-700 transition"
                >
                    Retour à l’accueil
                </Link>
            </div>

            <footer className="mt-8 text-gray-500 text-sm">
                © {new Date().getFullYear()} | Votre agence de voyage ✈️
            </footer>
        </div>
    );
}
