// "use client";
//
// import Link from "next/link";
// import { XCircleIcon } from "@heroicons/react/24/solid";
//
// export default function CancelPage() {
//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
//             <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
//                 <XCircleIcon className="h-20 w-20 text-red-500 mx-auto mb-4" />
//
//                 <h1 className="text-3xl font-bold text-red-700 mb-2">
//                     Paiement annulé ❌
//                 </h1>
//                 <p className="text-gray-600 mb-6">
//                     Le paiement n’a pas pu être complété. Vous pouvez réessayer ou
//                     contacter le support si le problème persiste.
//                 </p>
//
//                 <Link
//                     href="/"
//                     className="bg-red-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-red-700 transition"
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
import TopNavBar from "@/components/TopNav/TopNavBar";
import Footer from "@/components/Footer";
import { BsXCircleFill } from "react-icons/bs";
import Link from "next/link";

export default function CancelPage() {
    const searchParams = useSearchParams();
    const reservationId = searchParams.get("reservation_id");

    return (
        <>
            <TopNavBar />
            <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12">
                <div className="max-w-2xl w-full mx-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <BsXCircleFill className="text-red-500 text-7xl" />
                        </div>

                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                            Paiement annulé
                        </h1>

                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Vous avez annulé le processus de paiement. Votre réservation est en attente.
                        </p>

                        {reservationId && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <strong>Numéro de réservation :</strong> {reservationId}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    Statut : En attente de paiement
                                </p>
                            </div>
                        )}

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
                            Vous pouvez reprendre le paiement depuis votre espace de réservations.
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