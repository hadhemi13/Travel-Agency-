"use client";

import Link from "next/link";
import { XCircleIcon } from "@heroicons/react/24/solid";

export default function CancelPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
                <XCircleIcon className="h-20 w-20 text-red-500 mx-auto mb-4" />

                <h1 className="text-3xl font-bold text-red-700 mb-2">
                    Paiement annulé ❌
                </h1>
                <p className="text-gray-600 mb-6">
                    Le paiement n’a pas pu être complété. Vous pouvez réessayer ou
                    contacter le support si le problème persiste.
                </p>

                <Link
                    href="/"
                    className="bg-red-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-red-700 transition"
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
