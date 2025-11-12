// "use client";
//
// import Link from "next/link";
// import { useEffect } from "react";
// import { CheckCircleIcon } from "@heroicons/react/24/solid";
//
// export default function SuccessPage() {
//     useEffect(() => {
//         // Ici tu peux par exemple vider le panier localStorage si tu en as un
//         localStorage.removeItem("cart");
//     }, []);
//
//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
//             <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
//                 <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4" />
//
//                 <h1 className="text-3xl font-bold text-green-700 mb-2">
//                     Paiement réussi 🎉
//                 </h1>
//                 <p className="text-gray-600 mb-6">
//                     Merci pour votre achat ! Votre paiement a été traité avec succès.
//                 </p>
//
//                 <Link
//                     href="/"
//                     className="bg-green-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-green-700 transition"
//                 >
//                     Retour à l’accueil
//                 </Link>
//             </div>
//
//             <footer className="mt-8 text-gray-500 text-sm">
//                 © {new Date().getFullYear()} | Votre agence de voyage ✈️
//             </footer>
//         </div>
//     );
// }
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TopNavBar from "@/components/TopNav/TopNavBar";
import Footer from "@/components/Footer";
import { BsCheckCircleFill } from "react-icons/bs";
import Link from "next/link";

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const reservationId = searchParams.get("reservation_id");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mettre à jour le statut de la réservation
        const updateReservation = async () => {
            if (reservationId) {
                try {
                    await fetch("/api/reservation/update-status", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            reservationId,
                            paymentStatus: "paid",
                        }),
                    });
                } catch (error) {
                    console.error("Erreur lors de la mise à jour:", error);
                }
            }
            setLoading(false);
        };

        updateReservation();
    }, [reservationId]);

    if (loading) {
        return (
            <>
                <TopNavBar />
                <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                    <div className="text-xl text-gray-700 dark:text-gray-300">Vérification du paiement...</div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <TopNavBar />
            <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12">
                <div className="max-w-2xl w-full mx-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <BsCheckCircleFill className="text-green-500 text-7xl" />
                        </div>

                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                            Paiement réussi !
                        </h1>

                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Votre réservation a été confirmée et votre paiement a été traité avec succès.
                        </p>

                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <strong>Numéro de réservation :</strong> {reservationId}
                            </p>
                            {sessionId && (
                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                                    <strong>ID de transaction :</strong> {sessionId}
                                </p>
                            )}
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
                            Un email de confirmation vous a été envoyé avec tous les détails de votre réservation.
                        </p>

                        <div className="flex gap-4 justify-center">
                            <Link
                                href="/src/app/ReservationsA/page.tsx"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                            >
                                Voir mes réservations
                            </Link>
                            <Link
                                href="/"
                                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                            >
                                Retour à l'accueil
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}