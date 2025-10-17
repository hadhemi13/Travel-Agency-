//
// "use client";
//
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import TopNavBar from "@/components/TopNav/TopNavBar";
// import Footer from "@/components/Footer";
// import {
//     BsStarFill,
//     BsGeoAlt,
//     BsCalendar,
//     BsPeople,
//     BsCheckCircle,
//     BsDoorOpen,
//     BsInfoCircle,
// } from "react-icons/bs";
//
// interface Photo {
//     url_original: string;
//     url_max1280?: string;
//     url_max750?: string;
// }
//
// interface Highlight {
//     translated_name: string;
//     icon?: string;
// }
//
// interface BedType {
//     name_with_count: string;
// }
//
// interface BedConfiguration {
//     bed_types: BedType[];
// }
//
// interface Room {
//     block_id: string;
//     name: string;
//     description?: string;
//     max_occupancy: string;
//     room_surface_m2: number;
//     room_surface_feet2: number;
//     mealplan: string;
//     breakfast_included: number;
//     refundable: number;
//     photos: Photo[];
//     highlights: Highlight[];
//     bed_configurations: BedConfiguration[];
// }
//
// interface ReservationData {
//     hotel: {
//         id: string;
//         name: string;
//         name_trans?: string;
//         address: string;
//         city: string;
//         city_trans?: string;
//         review_score: number;
//         review_score_word?: string;
//         review_nr: number;
//         accommodation_type?: string;
//         photos: Photo[];
//         facilities: { name: string }[];
//         languages: string[];
//     };
//     rooms: Room[];
//     pricing: {
//         totalPrice: number;
//         currency: string;
//         taxes: number;
//         discountedAmount: number;
//         strikethroughAmount: number;
//         netAmount: number;
//     };
//     booking: {
//         checkIn: string;
//         checkOut: string;
//         adults: string;
//         rooms: string;
//     };
// }
//
// export default function ReservationPage() {
//     const searchParams = useSearchParams();
//     const [reservationData, setReservationData] = useState<ReservationData | null>(null);
//     const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
//     const [loading, setLoading] = useState(true);
//
//     // Récupérer les paramètres de l'URL
//     const hotelId = searchParams.get("hotelId");
//     const checkIn = searchParams.get("checkIn");
//     const checkOut = searchParams.get("checkOut");
//     const adults = searchParams.get("adults");
//     const rooms = searchParams.get("rooms");
//
//     useEffect(() => {
//         // Récupérer les données depuis sessionStorage
//         const storedData = sessionStorage.getItem("reservationData");
//         if (storedData) {
//             try {
//                 const data: ReservationData = JSON.parse(storedData);
//                 setReservationData(data);
//             } catch (error) {
//                 console.error("Error parsing reservation data:", error);
//             }
//         }
//         setLoading(false);
//     }, []);
//
//     if (loading) {
//         return (
//             <>
//                 <TopNavBar />
//                 <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
//                     <div className="text-xl text-gray-700 dark:text-gray-300">Chargement...</div>
//                 </main>
//                 <Footer />
//             </>
//         );
//     }
//
//     if (!reservationData) {
//         return (
//             <>
//                 <TopNavBar />
//                 <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
//                     <div className="text-center">
//                         <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
//                             Aucune donnée de réservation trouvée
//                         </h1>
//                         <p className="text-gray-600 dark:text-gray-400">
//                             Veuillez retourner à la page de détails de l'hôtel.
//                         </p>
//                     </div>
//                 </main>
//                 <Footer />
//             </>
//         );
//     }
//
//     const { hotel, rooms: availableRooms, pricing, booking } = reservationData;
//
//     // Calculer le nombre de nuits
//     const nights = Math.ceil(
//         (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
//         (1000 * 60 * 60 * 24)
//     );
//
//     return (
//         <>
//             <TopNavBar />
//             <main className="mt-12 py-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
//                 <div className="max-w-7xl mx-auto px-4">
//                     {/* En-tête de réservation */}
//                     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
//                         <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
//                             Finaliser votre réservation
//                         </h1>
//                         <div className="flex flex-col md:flex-row gap-6">
//                             {/* Informations de l'hôtel */}
//                             <div className="flex-1">
//                                 <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
//                                     {hotel.name}
//                                     {hotel.name_trans && (
//                                         <span className="text-lg text-gray-600 dark:text-gray-400 ml-2">
//                       ({hotel.name_trans})
//                     </span>
//                                     )}
//                                 </h2>
//                                 <p className="text-gray-600 dark:text-gray-300 flex items-center mb-2">
//                                     <BsGeoAlt className="mr-2 text-blue-600 dark:text-blue-400" />
//                                     {hotel.address}, {hotel.city}
//                                     {hotel.city_trans && ` (${hotel.city_trans})`}
//                                 </p>
//                                 <div className="flex items-center">
//                   <span className="inline-flex items-center px-3 py-1 bg-yellow-500 dark:bg-yellow-600 text-white text-sm font-semibold rounded-full">
//                     <BsStarFill className="mr-1" /> {hotel.review_score}/10
//                       {hotel.review_score_word && ` (${hotel.review_score_word})`}
//                   </span>
//                                     <span className="ml-2 text-gray-600 dark:text-gray-400">
//                     ({hotel.review_nr} avis)
//                   </span>
//                                 </div>
//                             </div>
//
//                             {/* Photo principale de l'hôtel */}
//                             {hotel.photos && hotel.photos.length > 0 && (
//                                 <div className="w-full md:w-64">
//                                     <img
//                                         src={hotel.photos[0].url_max1280 || hotel.photos[0].url_original}
//                                         alt={hotel.name}
//                                         className="rounded-xl w-full h-48 object-cover shadow-md"
//                                     />
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//
//                     {/* Détails de la réservation */}
//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                         {/* Colonne gauche: Chambres et détails */}
//                         <div className="lg:col-span-2 space-y-6">
//                             {/* Informations de séjour */}
//                             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
//                                 <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800 dark:text-white">
//                                     <BsCalendar className="mr-2" /> Détails du séjour
//                                 </h3>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <p className="text-sm text-gray-600 dark:text-gray-400">Arrivée</p>
//                                         <p className="font-semibold text-gray-800 dark:text-white">
//                                             {new Date(booking.checkIn).toLocaleDateString("fr-FR", {
//                                                 weekday: "long",
//                                                 year: "numeric",
//                                                 month: "long",
//                                                 day: "numeric",
//                                             })}
//                                         </p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-600 dark:text-gray-400">Départ</p>
//                                         <p className="font-semibold text-gray-800 dark:text-white">
//                                             {new Date(booking.checkOut).toLocaleDateString("fr-FR", {
//                                                 weekday: "long",
//                                                 year: "numeric",
//                                                 month: "long",
//                                                 day: "numeric",
//                                             })}
//                                         </p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-600 dark:text-gray-400">Durée</p>
//                                         <p className="font-semibold text-gray-800 dark:text-white">
//                                             {nights} {nights > 1 ? "nuits" : "nuit"}
//                                         </p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-600 dark:text-gray-400">Voyageurs</p>
//                                         <p className="font-semibold text-gray-800 dark:text-white flex items-center">
//                                             <BsPeople className="mr-2" />
//                                             {booking.adults} {parseInt(booking.adults) > 1 ? "adultes" : "adulte"}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//
//                             {/* Chambres disponibles */}
//                             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
//                                 <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800 dark:text-white">
//                                     <BsDoorOpen className="mr-2" /> Choisissez votre chambre
//                                 </h3>
//                                 <div className="space-y-4">
//                                     {availableRooms.map((room, idx) => (
//                                         <div
//                                             key={room.block_id || idx}
//                                             className={`border rounded-lg p-4 cursor-pointer transition-all ${
//                                                 selectedRoom?.block_id === room.block_id
//                                                     ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
//                                                     : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
//                                             }`}
//                                             onClick={() => setSelectedRoom(room)}
//                                         >
//                                             <div className="flex gap-4">
//                                                 {/* Photo de la chambre */}
//                                                 {room.photos && room.photos.length > 0 && (
//                                                     <img
//                                                         src={room.photos[0].url_max750 || room.photos[0].url_original}
//                                                         alt={room.name}
//                                                         className="w-32 h-32 object-cover rounded-lg"
//                                                     />
//                                                 )}
//
//                                                 {/* Détails de la chambre */}
//                                                 <div className="flex-1">
//                                                     <h4 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
//                                                         {room.name}
//                                                     </h4>
//                                                     <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
//                                                         {room.description}
//                                                     </p>
//
//                                                     <div className="grid grid-cols-2 gap-2 text-sm">
//                                                         <div className="text-gray-700 dark:text-gray-300">
//                                                             <strong>Superficie:</strong> {room.room_surface_m2} m²
//                                                         </div>
//                                                         <div className="text-gray-700 dark:text-gray-300">
//                                                             <strong>Capacité:</strong> {room.max_occupancy}
//                                                         </div>
//                                                         <div className="text-gray-700 dark:text-gray-300">
//                                                             <strong>Petit-déjeuner:</strong>{" "}
//                                                             {room.breakfast_included ? "Inclus" : "Non inclus"}
//                                                         </div>
//                                                         <div className="text-gray-700 dark:text-gray-300">
//                                                             <strong>Annulation:</strong>{" "}
//                                                             {room.refundable ? "Gratuite" : "Non remboursable"}
//                                                         </div>
//                                                     </div>
//
//                                                     {/* Lits */}
//                                                     {room.bed_configurations && room.bed_configurations.length > 0 && (
//                                                         <div className="mt-2">
//                                                             <strong className="text-sm text-gray-700 dark:text-gray-300">
//                                                                 Lits:
//                                                             </strong>
//                                                             <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
//                                 {room.bed_configurations
//                                     .map((config) =>
//                                         config.bed_types.map((bed) => bed.name_with_count).join(", ")
//                                     )
//                                     .join(" ou ")}
//                               </span>
//                                                         </div>
//                                                     )}
//
//                                                     {/* Points forts */}
//                                                     {room.highlights && room.highlights.length > 0 && (
//                                                         <div className="flex flex-wrap gap-2 mt-3">
//                                                             {room.highlights.slice(0, 3).map((h, hIdx) => (
//                                                                 <span
//                                                                     key={hIdx}
//                                                                     className="inline-flex items-center text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded"
//                                                                 >
//                                   <BsCheckCircle className="mr-1" /> {h.translated_name}
//                                 </span>
//                                                             ))}
//                                                         </div>
//                                                     )}
//                                                 </div>
//
//                                                 {/* Sélection */}
//                                                 <div className="flex items-center">
//                                                     {selectedRoom?.block_id === room.block_id && (
//                                                         <BsCheckCircle className="text-blue-600 dark:text-blue-400 text-2xl" />
//                                                     )}
//                                                 </div>
//                                             </div>
//
//                                             {/* Galerie photos supplémentaires */}
//                                             {room.photos && room.photos.length > 1 && (
//                                                 <div className="flex gap-2 mt-4 overflow-x-auto">
//                                                     {room.photos.slice(1, 4).map((photo, pIdx) => (
//                                                         <img
//                                                             key={pIdx}
//                                                             src={photo.url_max750 || photo.url_original}
//                                                             alt={`${room.name} ${pIdx + 2}`}
//                                                             className="w-20 h-20 object-cover rounded"
//                                                         />
//                                                     ))}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//
//                             {/* Galerie photos de l'hôtel */}
//                             {hotel.photos && hotel.photos.length > 1 && (
//                                 <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
//                                     <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
//                                         Photos de l'établissement
//                                     </h3>
//                                     <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
//                                         {hotel.photos.slice(0, 8).map((photo, idx) => (
//                                             <img
//                                                 key={idx}
//                                                 src={photo.url_max750 || photo.url_original}
//                                                 alt={`${hotel.name} ${idx + 1}`}
//                                                 className="rounded-lg h-24 w-full object-cover hover:scale-105 transition-transform cursor-pointer"
//                                             />
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//
//                         {/* Colonne droite: Résumé et prix */}
//                         <div className="lg:col-span-1">
//                             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-20">
//                                 <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
//                                     Résumé de la réservation
//                                 </h3>
//
//                                 {/* Chambre sélectionnée */}
//                                 {selectedRoom ? (
//                                     <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                                         <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
//                                             Chambre sélectionnée:
//                                         </p>
//                                         <p className="font-semibold text-gray-800 dark:text-white">{selectedRoom.name}</p>
//                                     </div>
//                                 ) : (
//                                     <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
//                                         <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center">
//                                             <BsInfoCircle className="mr-2" />
//                                             Veuillez sélectionner une chambre
//                                         </p>
//                                     </div>
//                                 )}
//
//                                 {/* Détails du prix */}
//                                 <div className="space-y-3 mb-6">
//                                     <div className="flex justify-between text-gray-700 dark:text-gray-300">
//                                         <span>Prix net ({nights} {nights > 1 ? "nuits" : "nuit"})</span>
//                                         <span className="font-semibold">
//                       {pricing.netAmount.toFixed(2)} {pricing.currency}
//                     </span>
//                                     </div>
//
//                                     {pricing.discountedAmount > 0 && (
//                                         <div className="flex justify-between text-green-600 dark:text-green-400">
//                                             <span>Réduction</span>
//                                             <span className="font-semibold">
//                         -{pricing.discountedAmount.toFixed(2)} {pricing.currency}
//                       </span>
//                                         </div>
//                                     )}
//
//                                     <div className="flex justify-between text-gray-700 dark:text-gray-300">
//                                         <span>Taxes et frais</span>
//                                         <span className="font-semibold">
//                       +{pricing.taxes.toFixed(2)} {pricing.currency}
//                     </span>
//                                     </div>
//
//                                     {pricing.strikethroughAmount > pricing.totalPrice && (
//                                         <div className="flex justify-between text-red-600 dark:text-red-400">
//                                             <span>Prix barré</span>
//                                             <span className="font-semibold line-through">
//                         {pricing.strikethroughAmount.toFixed(2)} {pricing.currency}
//                       </span>
//                                         </div>
//                                     )}
//
//                                     <div className="border-t border-gray-300 dark:border-gray-600 pt-3 mt-3">
//                                         <div className="flex justify-between text-xl font-bold text-blue-600 dark:text-blue-400">
//                                             <span>Total</span>
//                                             <span>
//                         {pricing.totalPrice.toFixed(2)} {pricing.currency}
//                       </span>
//                                         </div>
//                                         <p className="text-xs text-gray-600 dark:text-gray-400 text-right mt-1">
//                                             Taxes et frais inclus
//                                         </p>
//                                     </div>
//                                 </div>
//
//                                 {/* Bouton de réservation */}
//                                 <button
//                                     className={`w-full py-3 rounded-lg font-semibold transition-all ${
//                                         selectedRoom
//                                             ? "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
//                                             : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
//                                     }`}
//                                     disabled={!selectedRoom}
//                                 >
//                                     {selectedRoom ? "Confirmer la réservation" : "Sélectionnez une chambre"}
//                                 </button>
//
//                                 {/* Informations supplémentaires */}
//                                 <div className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
//                                     <p className="flex items-start">
//                                         <BsCheckCircle className="mr-2 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
//                                         Confirmation immédiate
//                                     </p>
//                                     <p className="flex items-start">
//                                         <BsCheckCircle className="mr-2 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
//                                         Pas de frais de réservation
//                                     </p>
//                                     {selectedRoom?.refundable === 1 && (
//                                         <p className="flex items-start">
//                                             <BsCheckCircle className="mr-2 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
//                                             Annulation gratuite
//                                         </p>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </main>
//             <Footer />
//         </>
//     );
// }



"use client";

import { useSearchParams } from "next/navigation";
import {JSX, useEffect, useState} from "react";
import TopNavBar from "@/components/TopNav/TopNavBar";
import Footer from "@/components/Footer";
import {
    BsStarFill,
    BsGeoAlt,
    BsCalendar,
    BsPeople,
    BsCheckCircle,
    BsDoorOpen,
    BsInfoCircle,
    BsPersonFill,
    BsEnvelope,
    BsTelephone,
    BsDownload,
} from "react-icons/bs";

interface Photo {
    url_original: string;
    url_max1280?: string;
    url_max750?: string;
}

interface Highlight {
    translated_name: string;
    icon?: string;
}

interface BedType {
    name_with_count: string;
}

interface BedConfiguration {
    bed_types: BedType[];
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

interface GuestInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface MealOption {
    type: "none" | "breakfast" | "half_board" | "full_board";
    label: string;
    pricePerPerson: number;
}

export default function ReservationPage(): JSX.Element {
    const searchParams = useSearchParams();
    const [reservationData, setReservationData] = useState<ReservationData | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMeal, setSelectedMeal] = useState<MealOption["type"]>("none");
    const [guests, setGuests] = useState<GuestInfo[]>([
        { firstName: "", lastName: "", email: "", phone: "" },
    ]);
    const [processingPayment, setProcessingPayment] = useState(false);

    // Options de repas
    const mealOptions: MealOption[] = [
        { type: "none", label: "Sans repas", pricePerPerson: 0 },
        { type: "breakfast", label: "Petit-déjeuner", pricePerPerson: 15 },
        { type: "half_board", label: "Demi-pension", pricePerPerson: 35 },
        { type: "full_board", label: "Pension complète", pricePerPerson: 50 },
    ];

    // Récupérer les paramètres de l'URL (non obligatoires, on les lit si présents)
    const hotelId = searchParams.get("hotelId");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const adults = searchParams.get("adults");
    const rooms = searchParams.get("rooms");

    useEffect(() => {
        const storedData = sessionStorage.getItem("reservationData");
        if (storedData) {
            try {
                const data: ReservationData = JSON.parse(storedData);
                setReservationData(data);
                const numAdults = parseInt(data.booking.adults) || 1;
                setGuests(
                    Array.from({ length: numAdults }, () => ({
                        firstName: "",
                        lastName: "",
                        email: "",
                        phone: "",
                    }))
                );
            } catch (error) {
                console.error("Error parsing reservation data:", error);
            }
        }
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <>
                <TopNavBar />
                <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                    <div className="text-xl text-gray-700 dark:text-gray-300">Chargement...</div>
                </main>
                <Footer />
            </>
        );
    }

    if (!reservationData) {
        return (
            <>
                <TopNavBar />
                <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                            Aucune donnée de réservation trouvée
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">Veuillez retourner à la page de détails de l'hôtel.</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const { hotel, rooms: availableRooms, pricing, booking } = reservationData;

    // Calculer le nombre de nuits en s'assurant que les dates sont valides
    const nights = Math.max(
        1,
        Math.ceil(
            (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        )
    );

    // Calculer le prix des repas
    const selectedMealOption = mealOptions.find((m) => m.type === selectedMeal);
    const mealPrice =
        (selectedMealOption?.pricePerPerson || 0) * nights * (parseInt(booking.adults) || 1);

    // Prix total final (sécurisé)
    const finalTotalPrice = (pricing.totalPrice || 0) + mealPrice;

    const updateGuest = (index: number, field: keyof GuestInfo, value: string) => {
        const newGuests = [...guests];
        newGuests[index][field] = value;
        setGuests(newGuests);
    };

    const isFormValid = () => {
        if (!selectedRoom) return false;
        return guests.every(
            (guest) =>
                guest.firstName.trim() && guest.lastName.trim() && guest.email.trim() && guest.phone.trim()
        );
    };

    const generatePDF = async () => {
        try {
            const response = await fetch("/api/generate-pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    hotel,
                    selectedRoom,
                    booking,
                    guests,
                    mealOption: selectedMealOption,
                    pricing: {
                        ...pricing,
                        mealPrice,
                        finalTotal: finalTotalPrice,
                    },
                    nights,
                }),
            });

            if (!response.ok) throw new Error("Erreur lors de la génération du PDF");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `reservation-${hotel.name.replace(/\s+/g, "-")}-${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Erreur:", error);
            alert("Erreur lors de la génération du PDF");
        }
    };

    const handleStripePayment = async () => {
        if (!selectedRoom) return;
        setProcessingPayment(true);
        try {
            const response = await fetch("/api/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: Math.round(finalTotalPrice * 100),
                    currency: pricing.currency?.toLowerCase() || "eur",
                    hotel,
                    selectedRoom,
                    booking,
                    guests,
                    mealOption: selectedMealOption,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Erreur de paiement");

            // Redirection vers Stripe Checkout
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                throw new Error("Aucun URL de checkout reçu");
            }
        } catch (error) {
            console.error("Erreur:", error);
            alert("Erreur lors du traitement du paiement");
        } finally {
            setProcessingPayment(false);
        }
    };

    return (
        <>
            <TopNavBar />
            <main className="mt-12 py-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Finaliser votre réservation</h1>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                                    {hotel.name}
                                    {hotel.name_trans && (
                                        <span className="text-lg text-gray-600 dark:text-gray-400 ml-2">({hotel.name_trans})</span>
                                    )}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 flex items-center mb-2">
                                    <BsGeoAlt className="mr-2 text-blue-600 dark:text-blue-400" />
                                    {hotel.address}, {hotel.city}
                                    {hotel.city_trans && ` (${hotel.city_trans})`}
                                </p>
                                <div className="flex items-center">
                  <span className="inline-flex items-center px-3 py-1 bg-yellow-500 dark:bg-yellow-600 text-white text-sm font-semibold rounded-full">
                    <BsStarFill className="mr-1" /> {hotel.review_score}/10
                      {hotel.review_score_word && ` (${hotel.review_score_word})`}
                  </span>
                                    <span className="ml-2 text-gray-600 dark:text-gray-400">({hotel.review_nr} avis)</span>
                                </div>
                            </div>

                            {hotel.photos && hotel.photos.length > 0 && (
                                <div className="w-full md:w-64">
                                    <img
                                        src={hotel.photos[0].url_max1280 || hotel.photos[0].url_original}
                                        alt={hotel.name}
                                        className="rounded-xl w-full h-48 object-cover shadow-md"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800 dark:text-white">
                                    <BsCalendar className="mr-2" /> Détails du séjour
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Arrivée</p>
                                        <p className="font-semibold text-gray-800 dark:text-white">
                                            {new Date(booking.checkIn).toLocaleDateString("fr-FR", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Départ</p>
                                        <p className="font-semibold text-gray-800 dark:text-white">
                                            {new Date(booking.checkOut).toLocaleDateString("fr-FR", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Durée</p>
                                        <p className="font-semibold text-gray-800 dark:text-white">{nights} {nights > 1 ? "nuits" : "nuit"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Voyageurs</p>
                                        <p className="font-semibold text-gray-800 dark:text-white flex items-center">
                                            <BsPeople className="mr-2" />
                                            {booking.adults} {parseInt(booking.adults) > 1 ? "adultes" : "adulte"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800 dark:text-white">
                                    <BsDoorOpen className="mr-2" /> Choisissez votre chambre
                                </h3>
                                <div className="space-y-4">
                                    {availableRooms.map((room, idx) => (
                                        <div
                                            key={room.block_id || idx}
                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                                selectedRoom?.block_id === room.block_id
                                                    ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                                    : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
                                            }`}
                                            onClick={() => setSelectedRoom(room)}
                                        >
                                            <div className="flex gap-4">
                                                {room.photos && room.photos.length > 0 && (
                                                    <img
                                                        src={room.photos[0].url_max750 || room.photos[0].url_original}
                                                        alt={room.name}
                                                        className="w-32 h-32 object-cover rounded-lg"
                                                    />
                                                )}

                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">{room.name}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{room.description}</p>

                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div className="text-gray-700 dark:text-gray-300">
                                                            <strong>Superficie:</strong> {room.room_surface_m2} m²
                                                        </div>
                                                        <div className="text-gray-700 dark:text-gray-300">
                                                            <strong>Capacité:</strong> {room.max_occupancy}
                                                        </div>
                                                        <div className="text-gray-700 dark:text-gray-300">
                                                            <strong>Petit-déjeuner:</strong> {room.breakfast_included ? "Inclus" : "Non inclus"}
                                                        </div>
                                                        <div className="text-gray-700 dark:text-gray-300">
                                                            <strong>Annulation:</strong> {room.refundable ? "Gratuite" : "Non remboursable"}
                                                        </div>
                                                    </div>

                                                    {room.bed_configurations && room.bed_configurations.length > 0 && (
                                                        <div className="mt-2">
                                                            <strong className="text-sm text-gray-700 dark:text-gray-300">Lits:</strong>
                                                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                                {room.bed_configurations
                                    .map((config) => config.bed_types.map((bed) => bed.name_with_count).join(", "))
                                    .join(" ou ")}
                              </span>
                                                        </div>
                                                    )}

                                                    {room.highlights && room.highlights.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-3">
                                                            {room.highlights.slice(0, 3).map((h, hIdx) => (
                                                                <span key={hIdx} className="inline-flex items-center text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                                  <BsCheckCircle className="mr-1" /> {h.translated_name}
                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center">
                                                    {selectedRoom?.block_id === room.block_id && (
                                                        <BsCheckCircle className="text-blue-600 dark:text-blue-400 text-2xl" />
                                                    )}
                                                </div>
                                            </div>

                                            {room.photos && room.photos.length > 1 && (
                                                <div className="flex gap-2 mt-4 overflow-x-auto">
                                                    {room.photos.slice(1, 4).map((photo, pIdx) => (
                                                        <img
                                                            key={pIdx}
                                                            src={photo.url_max750 || photo.url_original}
                                                            alt={`${room.name} ${pIdx + 2}`}
                                                            className="w-20 h-20 object-cover rounded"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Options de repas</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {mealOptions.map((option) => (
                                        <div
                                            key={option.type}
                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                                selectedMeal === option.type
                                                    ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                                    : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
                                            }`}
                                            onClick={() => setSelectedMeal(option.type)}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 dark:text-white">{option.label}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        {option.pricePerPerson > 0
                                                            ? `${option.pricePerPerson} ${pricing.currency}/personne/nuit`
                                                            : "Gratuit"}
                                                    </p>
                                                </div>
                                                {selectedMeal === option.type && (
                                                    <BsCheckCircle className="text-blue-600 dark:text-blue-400 text-xl" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {selectedMealOption && selectedMealOption.pricePerPerson > 0 && (
                                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            <strong>Coût des repas:</strong> {mealPrice.toFixed(2)} {pricing.currency}
                                            <span className="text-xs ml-2">({parseInt(booking.adults)} personne(s) × {nights} nuit(s) × {selectedMealOption.pricePerPerson} {pricing.currency})</span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800 dark:text-white">
                                    <BsPersonFill className="mr-2" /> Informations des voyageurs
                                </h3>
                                <div className="space-y-6">
                                    {guests.map((guest, idx) => (
                                        <div key={idx} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Voyageur {idx + 1} {idx === 0 && "(Principal)"}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom *</label>
                                                    <input
                                                        type="text"
                                                        value={guest.firstName}
                                                        onChange={(e) => updateGuest(idx, "firstName", e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                                                        placeholder="Jean"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom *</label>
                                                    <input
                                                        type="text"
                                                        value={guest.lastName}
                                                        onChange={(e) => updateGuest(idx, "lastName", e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                                                        placeholder="Dupont"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center"><BsEnvelope className="mr-1" /> Email *</label>
                                                    <input
                                                        type="email"
                                                        value={guest.email}
                                                        onChange={(e) => updateGuest(idx, "email", e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                                                        placeholder="jean.dupont@email.com"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center"><BsTelephone className="mr-1" /> Téléphone *</label>
                                                    <input
                                                        type="tel"
                                                        value={guest.phone}
                                                        onChange={(e) => updateGuest(idx, "phone", e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                                                        placeholder="+33 6 12 34 56 78"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">* Champs obligatoires</p>
                            </div>

                            {hotel.photos && hotel.photos.length > 1 && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Photos de l'établissement</h3>
                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                        {hotel.photos.slice(0, 8).map((photo, idx) => (
                                            <img
                                                key={idx}
                                                src={photo.url_max750 || photo.url_original}
                                                alt={`${hotel.name} ${idx + 1}`}
                                                className="rounded-lg h-24 w-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-20">
                                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Résumé de la réservation</h3>

                                {selectedRoom ? (
                                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Chambre sélectionnée:</p>
                                        <p className="font-semibold text-gray-800 dark:text-white">{selectedRoom.name}</p>
                                    </div>
                                ) : (
                                    <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center">
                                            <BsInfoCircle className="mr-2" /> Veuillez sélectionner une chambre
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                        <span>Prix net ({nights} {nights > 1 ? "nuits" : "nuit"})</span>
                                        <span className="font-semibold">{pricing.netAmount.toFixed(2)} {pricing.currency}</span>
                                    </div>

                                    {pricing.discountedAmount > 0 && (
                                        <div className="flex justify-between text-green-600 dark:text-green-400">
                                            <span>Réduction</span>
                                            <span className="font-semibold">-{pricing.discountedAmount.toFixed(2)} {pricing.currency}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                        <span>Taxes et frais</span>
                                        <span className="font-semibold">+{pricing.taxes.toFixed(2)} {pricing.currency}</span>
                                    </div>

                                    {pricing.strikethroughAmount > pricing.totalPrice && (
                                        <div className="flex justify-between text-red-600 dark:text-red-400">
                                            <span>Prix barré</span>
                                            <span className="font-semibold line-through">{pricing.strikethroughAmount.toFixed(2)} {pricing.currency}</span>
                                        </div>
                                    )}

                                    {mealPrice > 0 && (
                                        <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                            <span>Coût des repas</span>
                                            <span className="font-semibold">{mealPrice.toFixed(2)} {pricing.currency}</span>
                                        </div>
                                    )}

                                    <div className="border-t border-gray-300 dark:border-gray-600 pt-3 mt-3">
                                        <div className="flex justify-between text-xl font-bold text-blue-600 dark:text-blue-400">
                                            <span>Total</span>
                                            <span>{finalTotalPrice.toFixed(2)} {pricing.currency}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 text-right mt-1">Taxes et frais inclus</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        if (!selectedRoom) return;
                                        // exemple: ouvrir modal ou continuer le process
                                        // si vous voulez générer le pdf au clic : generatePDF();
                                        // si vous voulez payer : handleStripePayment();
                                        alert("Réservation confirmée (exemple). Implémentez la logique réelle ici.");
                                    }}
                                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                                        selectedRoom
                                            ? "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                                            : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                    }`}
                                    disabled={!selectedRoom}
                                >
                                    {selectedRoom ? "Confirmer la réservation" : "Sélectionnez une chambre"}
                                </button>

                                <div className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <p className="flex items-start">
                                        <BsCheckCircle className="mr-2 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                        Confirmation immédiate
                                    </p>
                                    <p className="flex items-start">
                                        <BsCheckCircle className="mr-2 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                        Pas de frais de réservation
                                    </p>
                                    {selectedRoom?.refundable === 1 && (
                                        <p className="flex items-start">
                                            <BsCheckCircle className="mr-2 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                            Annulation gratuite
                                        </p>
                                    )}
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <button onClick={generatePDF} className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-600">
                                        <BsDownload className="inline mr-2" /> Télécharger PDF
                                    </button>
                                    <button onClick={handleStripePayment} disabled={!selectedRoom || processingPayment} className={`flex-1 py-2 rounded-lg ${!selectedRoom || processingPayment ? 'bg-gray-300 text-gray-500' : 'bg-blue-600 text-white'}`}>
                                        {processingPayment ? 'Traitement...' : 'Réserver et payer'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
