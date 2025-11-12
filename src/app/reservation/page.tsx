// "use client";
//
// import { useSearchParams } from "next/navigation";
// import { JSX, useEffect, useState } from "react";
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
//     BsPersonFill,
//     BsEnvelope,
//     BsTelephone,
//     BsDownload,
// } from "react-icons/bs";
// import { loadStripe } from "@stripe/stripe-js";
// import { createReservation } from "@/app/reservation/actions";
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
// interface GuestInfo {
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone: string;
// }
//
// interface MealOption {
//     type: "none" | "breakfast" | "half_board" | "full_board";
//     label: string;
//     pricePerPerson: number;
// }
//
// export default function ReservationPage(): JSX.Element {
//     const searchParams = useSearchParams();
//     const [reservationData, setReservationData] = useState<ReservationData | null>(null);
//     const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [selectedMeal, setSelectedMeal] = useState<MealOption["type"]>("none");
//     const [guests, setGuests] = useState<GuestInfo[]>([
//         { firstName: "", lastName: "", email: "", phone: "" },
//     ]);
//     const [processingPayment, setProcessingPayment] = useState(false);
//     const [generatingPDF, setGeneratingPDF] = useState(false);
//
//     const mealOptions: MealOption[] = [
//         { type: "none", label: "Sans repas", pricePerPerson: 0 },
//         { type: "breakfast", label: "Petit-déjeuner", pricePerPerson: 15 },
//         { type: "half_board", label: "Demi-pension", pricePerPerson: 35 },
//         { type: "full_board", label: "Pension complète", pricePerPerson: 50 },
//     ];
//
//     const hotelId = searchParams.get("hotelId");
//     const checkIn = searchParams.get("checkIn");
//     const checkOut = searchParams.get("checkOut");
//     const adults = searchParams.get("adults");
//     const rooms = searchParams.get("rooms");
//
//     useEffect(() => {
//         const storedData = sessionStorage.getItem("reservationData");
//         if (storedData) {
//             try {
//                 const data: ReservationData = JSON.parse(storedData);
//                 setReservationData(data);
//                 const numAdults = parseInt(data.booking.adults) || 1;
//                 setGuests(
//                     Array.from({ length: numAdults }, () => ({
//                         firstName: "",
//                         lastName: "",
//                         email: "",
//                         phone: "",
//                     }))
//                 );
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
//                 <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#222529]">
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
//                 <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#222529]">
//                     <div className="text-center">
//                         <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
//                             Aucune donnée de réservation trouvée
//                         </h1>
//                         <p className="text-gray-600 dark:text-gray-400">Veuillez retourner à la page de détails de l'hôtel.</p>
//                     </div>
//                 </main>
//                 <Footer />
//             </>
//         );
//     }
//
//     const { hotel, rooms: availableRooms, pricing, booking } = reservationData;
//
//     const nights = Math.max(
//         1,
//         Math.ceil(
//             (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
//             (1000 * 60 * 60 * 24)
//         )
//     );
//
//     const selectedMealOption = mealOptions.find((m) => m.type === selectedMeal);
//     const mealPrice =
//         (selectedMealOption?.pricePerPerson || 0) * nights * (parseInt(booking.adults) || 1);
//
//     const finalTotalPrice = (pricing.totalPrice || 0) + mealPrice;
//
//     const updateGuest = (index: number, field: keyof GuestInfo, value: string) => {
//         const newGuests = [...guests];
//         newGuests[index][field] = value;
//         setGuests(newGuests);
//     };
//
//     const isFormValid = () => {
//         if (!selectedRoom) return false;
//         return guests.every(
//             (guest) =>
//                 guest.firstName.trim() && guest.lastName.trim() && guest.email.trim() && guest.phone.trim()
//         );
//     };
//
//     const generatePDF = async () => {
//         if (!selectedRoom || !isFormValid()) {
//             alert("Veuillez sélectionner une chambre et remplir toutes les informations des voyageurs");
//             return;
//         }
//
//         setGeneratingPDF(true);
//
//         try {
//             // Dynamically import jsPDF
//             const { default: jsPDF } = await import('jspdf');
//
//             const doc = new jsPDF();
//             const pageWidth = doc.internal.pageSize.getWidth();
//             const pageHeight = doc.internal.pageSize.getHeight();
//             let yPos = 20;
//
//             // Header
//             doc.setFillColor(59, 130, 246);
//             doc.rect(0, 0, pageWidth, 40, 'F');
//
//             doc.setTextColor(255, 255, 255);
//             doc.setFontSize(22);
//             doc.setFont(undefined, 'bold');
//             doc.text('CONFIRMATION DE RÉSERVATION', pageWidth / 2, 25, { align: 'center' });
//
//             yPos = 50;
//
//             // Hotel Information
//             doc.setTextColor(0, 0, 0);
//             doc.setFontSize(16);
//             doc.setFont(undefined, 'bold');
//             doc.text(hotel.name, 20, yPos);
//             yPos += 8;
//
//             doc.setFontSize(10);
//             doc.setFont(undefined, 'normal');
//             doc.text(`${hotel.address}, ${hotel.city}`, 20, yPos);
//             yPos += 6;
//             doc.text(`Note: ${hotel.review_score}/10 (${hotel.review_nr} avis)`, 20, yPos);
//             yPos += 12;
//
//             // Booking Details Section
//             doc.setFillColor(243, 244, 246);
//             doc.rect(15, yPos, pageWidth - 30, 50, 'F');
//
//             doc.setFontSize(12);
//             doc.setFont(undefined, 'bold');
//             yPos += 8;
//             doc.text('DÉTAILS DU SÉJOUR', 20, yPos);
//             yPos += 8;
//
//             doc.setFont(undefined, 'normal');
//             doc.setFontSize(10);
//
//             const checkInDate = new Date(booking.checkIn).toLocaleDateString('fr-FR', {
//                 weekday: 'long',
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric'
//             });
//             const checkOutDate = new Date(booking.checkOut).toLocaleDateString('fr-FR', {
//                 weekday: 'long',
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric'
//             });
//
//             doc.text(`Arrivée: ${checkInDate}`, 20, yPos);
//             yPos += 6;
//             doc.text(`Départ: ${checkOutDate}`, 20, yPos);
//             yPos += 6;
//             doc.text(`Durée: ${nights} ${nights > 1 ? 'nuits' : 'nuit'}`, 20, yPos);
//             yPos += 6;
//             doc.text(`Voyageurs: ${booking.adults} ${parseInt(booking.adults) > 1 ? 'adultes' : 'adulte'}`, 20, yPos);
//             yPos += 15;
//
//             // Room Details
//             doc.setFontSize(12);
//             doc.setFont(undefined, 'bold');
//             doc.text('CHAMBRE SÉLECTIONNÉE', 20, yPos);
//             yPos += 8;
//
//             doc.setFontSize(10);
//             doc.setFont(undefined, 'normal');
//             doc.text(selectedRoom.name, 20, yPos);
//             yPos += 6;
//
//             if (selectedRoom.description) {
//                 const descLines = doc.splitTextToSize(selectedRoom.description, pageWidth - 40);
//                 doc.text(descLines, 20, yPos);
//                 yPos += descLines.length * 5 + 2;
//             }
//
//             doc.text(`Superficie: ${selectedRoom.room_surface_m2} m²`, 20, yPos);
//             yPos += 6;
//             doc.text(`Capacité: ${selectedRoom.max_occupancy}`, 20, yPos);
//             yPos += 6;
//             doc.text(`Petit-déjeuner: ${selectedRoom.breakfast_included ? 'Inclus' : 'Non inclus'}`, 20, yPos);
//             yPos += 6;
//             doc.text(`Annulation: ${selectedRoom.refundable ? 'Gratuite' : 'Non remboursable'}`, 20, yPos);
//             yPos += 12;
//
//             // Meal Options
//             if (selectedMealOption && selectedMealOption.type !== 'none') {
//                 doc.setFont(undefined, 'bold');
//                 doc.text('OPTION REPAS', 20, yPos);
//                 yPos += 6;
//                 doc.setFont(undefined, 'normal');
//                 doc.text(`${selectedMealOption.label} - ${selectedMealOption.pricePerPerson} ${pricing.currency}/pers/nuit`, 20, yPos);
//                 yPos += 10;
//             }
//
//             // Guest Information
//             if (yPos > pageHeight - 80) {
//                 doc.addPage();
//                 yPos = 20;
//             }
//
//             doc.setFont(undefined, 'bold');
//             doc.setFontSize(12);
//             doc.text('INFORMATIONS DES VOYAGEURS', 20, yPos);
//             yPos += 8;
//
//             doc.setFont(undefined, 'normal');
//             doc.setFontSize(10);
//             guests.forEach((guest, idx) => {
//                 if (yPos > pageHeight - 30) {
//                     doc.addPage();
//                     yPos = 20;
//                 }
//                 doc.setFont(undefined, 'bold');
//                 doc.text(`Voyageur ${idx + 1}${idx === 0 ? ' (Principal)' : ''}:`, 20, yPos);
//                 yPos += 6;
//                 doc.setFont(undefined, 'normal');
//                 doc.text(`${guest.firstName} ${guest.lastName}`, 25, yPos);
//                 yPos += 5;
//                 doc.text(`Email: ${guest.email}`, 25, yPos);
//                 yPos += 5;
//                 doc.text(`Téléphone: ${guest.phone}`, 25, yPos);
//                 yPos += 8;
//             });
//
//             // Pricing Summary
//             if (yPos > pageHeight - 60) {
//                 doc.addPage();
//                 yPos = 20;
//             }
//
//             yPos += 5;
//             doc.setFillColor(243, 244, 246);
//             doc.rect(15, yPos, pageWidth - 30, 55, 'F');
//             yPos += 8;
//
//             doc.setFont(undefined, 'bold');
//             doc.setFontSize(12);
//             doc.text('RÉCAPITULATIF DES PRIX', 20, yPos);
//             yPos += 10;
//
//             doc.setFont(undefined, 'normal');
//             doc.setFontSize(10);
//
//             doc.text(`Prix net (${nights} ${nights > 1 ? 'nuits' : 'nuit'}):`, 20, yPos);
//             doc.text(`${pricing.netAmount.toFixed(2)} ${pricing.currency}`, pageWidth - 20, yPos, { align: 'right' });
//             yPos += 6;
//
//             if (pricing.discountedAmount > 0) {
//                 doc.setTextColor(34, 197, 94);
//                 doc.text('Réduction:', 20, yPos);
//                 doc.text(`-${pricing.discountedAmount.toFixed(2)} ${pricing.currency}`, pageWidth - 20, yPos, { align: 'right' });
//                 doc.setTextColor(0, 0, 0);
//                 yPos += 6;
//             }
//
//             doc.text('Taxes et frais:', 20, yPos);
//             doc.text(`+${pricing.taxes.toFixed(2)} ${pricing.currency}`, pageWidth - 20, yPos, { align: 'right' });
//             yPos += 6;
//
//             if (mealPrice > 0) {
//                 doc.text('Coût des repas:', 20, yPos);
//                 doc.text(`${mealPrice.toFixed(2)} ${pricing.currency}`, pageWidth - 20, yPos, { align: 'right' });
//                 yPos += 6;
//             }
//
//             yPos += 2;
//             doc.setDrawColor(59, 130, 246);
//             doc.setLineWidth(0.5);
//             doc.line(20, yPos, pageWidth - 20, yPos);
//             yPos += 6;
//
//             doc.setFont(undefined, 'bold');
//             doc.setFontSize(12);
//             doc.setTextColor(59, 130, 246);
//             doc.text('TOTAL:', 20, yPos);
//             doc.text(`${finalTotalPrice.toFixed(2)} ${pricing.currency}`, pageWidth - 20, yPos, { align: 'right' });
//             doc.setTextColor(0, 0, 0);
//             yPos += 5;
//             doc.setFontSize(8);
//             doc.setFont(undefined, 'normal');
//             doc.text('Taxes et frais inclus', pageWidth - 20, yPos, { align: 'right' });
//
//             // Footer
//             const footerY = pageHeight - 20;
//             doc.setFontSize(8);
//             doc.setTextColor(128, 128, 128);
//             doc.text(`Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, pageWidth / 2, footerY, { align: 'center' });
//             doc.text('Merci de votre réservation!', pageWidth / 2, footerY + 5, { align: 'center' });
//
//             // Save PDF
//             const fileName = `reservation-${hotel.name.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
//             doc.save(fileName);
//
//             alert('PDF téléchargé avec succès!');
//         } catch (error) {
//             console.error('Erreur lors de la génération du PDF:', error);
//             alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
//         } finally {
//             setGeneratingPDF(false);
//         }
//     };
//
//
//
//     // add to database
//
//     const handleReservation = async () => {
//         if (!selectedRoom || !isFormValid()) {
//             alert("Veuillez remplir toutes les informations et sélectionner une chambre.");
//             return;
//         }
//
//         try {
//             const savedReservation = await createReservation({
//                 hotel: reservationData.hotel,
//                 rooms: reservationData.rooms,
//                 pricing: reservationData.pricing,
//                 booking: reservationData.booking,
//                 guests,
//                 selectedRoomId: selectedRoom.block_id,
//                 selectedMeal,
//             });
//
//             console.log("Réservation enregistrée :", savedReservation);
//             alert("Réservation enregistrée ! Vous pouvez maintenant procéder au paiement.");
//         } catch (err) {
//             console.error(err);
//             alert("Erreur lors de la réservation.");
//         }
//     };
//
//
//     const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
//
//     // const handlePaymentClick = async () => {
//     //     const res = await fetch("/api/checkout", { method: "POST" });
//     //     const data = await res.json();
//     //     window.location.href = data.url; // redirection vers Stripe Checkout
//     // };
//
//     const handlePaymentClick = () => {
//         if (!selectedRoom) return;
//
//         // Exemple : calcul du montant final selon la chambre et les options
//         const finalAmount = selectedRoom ? finalTotalPrice : pricing.totalPrice;
//
//         // Redirection vers ta page personnalisée avec le montant en paramètre
//         window.location.href = `/payment?amount=${finalAmount}`;
//     };
//
//
//     return (
//         <>
//             <TopNavBar />
//             <main className="mt-12 py-6 bg-gray-50 dark:bg-[#222529] text-gray-900 dark:text-gray-100 min-h-screen">
//                 <div className="max-w-7xl mx-auto px-4">
//                     <div className="bg-[#191b1d] rounded-xl shadow-md p-6 mb-8">
//                         <h1 className="text-3xl font-bold text-white mb-4">Finaliser votre réservation</h1>
//                         <div className="flex flex-col md:flex-row gap-6">
//                             <div className="flex-1">
//                                 <h2 className="text-2xl font-semibold text-white mb-2">
//                                     {hotel.name}
//                                     {hotel.name_trans && (
//                                         <span className="text-lg text-gray-300 ml-2">({hotel.name_trans})</span>
//                                     )}
//                                 </h2>
//                                 <p className="text-gray-300 flex items-center mb-2">
//                                     <BsGeoAlt className="mr-2 text-[#8e85e6]" />
//                                     {hotel.address}, {hotel.city}
//                                     {hotel.city_trans && ` (${hotel.city_trans})`}
//                                 </p>
//                                 <div className="flex items-center">
//                                     <span className="inline-flex items-center px-3 py-1 bg-yellow-500 dark:bg-yellow-600 text-white text-sm font-semibold rounded-full">
//                                         <BsStarFill className="mr-1" /> {hotel.review_score}/10
//                                         {hotel.review_score_word && ` (${hotel.review_score_word})`}
//                                     </span>
//                                     <span className="ml-2 text-gray-300">({hotel.review_nr} avis)</span>
//                                 </div>
//                             </div>
//
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
//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                         <div className="lg:col-span-2 space-y-6">
//                             <div className="bg-[#191b1d] rounded-xl shadow-md p-6">
//                                 <h3 className="text-xl font-bold mb-4 flex items-center text-white">
//                                     <BsCalendar className="mr-2" /> Détails du séjour
//                                 </h3>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <p className="text-sm text-gray-300">Arrivée</p>
//                                         <p className="font-semibold text-white">
//                                             {new Date(booking.checkIn).toLocaleDateString("fr-FR", {
//                                                 weekday: "long",
//                                                 year: "numeric",
//                                                 month: "long",
//                                                 day: "numeric",
//                                             })}
//                                         </p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-300">Départ</p>
//                                         <p className="font-semibold text-white">
//                                             {new Date(booking.checkOut).toLocaleDateString("fr-FR", {
//                                                 weekday: "long",
//                                                 year: "numeric",
//                                                 month: "long",
//                                                 day: "numeric",
//                                             })}
//                                         </p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-300">Durée</p>
//                                         <p className="font-semibold text-white">{nights} {nights > 1 ? "nuits" : "nuit"}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-300">Voyageurs</p>
//                                         <p className="font-semibold text-white flex items-center">
//                                             <BsPeople className="mr-2" />
//                                             {booking.adults} {parseInt(booking.adults) > 1 ? "adultes" : "adulte"}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//
//                             <div className="bg-[#191b1d] rounded-xl shadow-md p-6">
//                                 <h3 className="text-xl font-bold mb-4 text-white">Options de repas</h3>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     {mealOptions.map((option) => (
//                                         <div
//                                             key={option.type}
//                                             className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedMeal === option.type
//                                                 ? "border-[#8e85e6] bg-blue-900/20"
//                                                 : "border-gray-600 hover:border-[#8e85e6]"
//                                                 }`}
//                                             onClick={() => setSelectedMeal(option.type)}
//                                         >
//                                             <div className="flex justify-between items-center">
//                                                 <div>
//                                                     <h4 className="font-semibold text-white">{option.label}</h4>
//                                                     <p className="text-sm text-gray-300 mt-1">
//                                                         {option.pricePerPerson > 0
//                                                             ? `${option.pricePerPerson} ${pricing.currency}/personne/nuit`
//                                                             : "Gratuit"}
//                                                     </p>
//                                                 </div>
//                                                 {selectedMeal === option.type && (
//                                                     <BsCheckCircle className="text-[#8e85e6] text-xl" />
//                                                 )}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//
//                                 {selectedMealOption && selectedMealOption.pricePerPerson > 0 && (
//                                     <div className="mt-4 p-3 bg-blue-900/20 rounded-lg">
//                                         <p className="text-sm text-gray-300">
//                                             <strong>Coût des repas:</strong> {mealPrice.toFixed(2)} {pricing.currency}
//                                             <span className="text-xs ml-2">({parseInt(booking.adults)} personne(s) × {nights} nuit(s) × {selectedMealOption.pricePerPerson} {pricing.currency})</span>
//                                         </p>
//                                     </div>
//                                 )}
//                             </div>
//
//                             <div className="bg-[#191b1d] rounded-xl shadow-md p-6">
//                                 <h3 className="text-xl font-bold mb-4 flex items-center text-white">
//                                     <BsDoorOpen className="mr-2" /> Choisissez votre chambre
//                                 </h3>
//                                 <div className="space-y-4">
//                                     {availableRooms.map((room, idx) => (
//                                         <div
//                                             key={room.block_id || idx}
//                                             className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedRoom?.block_id === room.block_id
//                                                 ? "border-[#8e85e6] bg-blue-900/20"
//                                                 : "border-gray-600 hover:border-[#8e85e6]"
//                                                 }`}
//                                             onClick={() => setSelectedRoom(room)}
//                                         >
//                                             <div className="flex gap-4">
//                                                 {room.photos && room.photos.length > 0 && (
//                                                     <img
//                                                         src={room.photos[0].url_max750 || room.photos[0].url_original}
//                                                         alt={room.name}
//                                                         className="w-32 h-32 object-cover rounded-lg"
//                                                     />
//                                                 )}
//
//                                                 <div className="flex-1">
//                                                     <h4 className="font-semibold text-lg text-white mb-2">{room.name}</h4>
//                                                     <p className="text-sm text-gray-300 mb-2">{room.description}</p>
//
//                                                     <div className="grid grid-cols-2 gap-2 text-sm">
//                                                         <div className="text-gray-300">
//                                                             <strong>Superficie:</strong> {room.room_surface_m2} m²
//                                                         </div>
//                                                         <div className="text-gray-300">
//                                                             <strong>Capacité:</strong> {room.max_occupancy}
//                                                         </div>
//                                                         <div className="text-gray-300">
//                                                             <strong>Petit-déjeuner:</strong> {room.breakfast_included ? "Inclus" : "Non inclus"}
//                                                         </div>
//                                                         <div className="text-gray-300">
//                                                             <strong>Annulation:</strong> {room.refundable ? "Gratuite" : "Non remboursable"}
//                                                         </div>
//                                                     </div>
//
//                                                     {room.bed_configurations && room.bed_configurations.length > 0 && (
//                                                         <div className="mt-2">
//                                                             <strong className="text-sm text-gray-300">Lits:</strong>
//                                                             <span className="text-sm text-gray-300 ml-2">
//                                                                 {room.bed_configurations
//                                                                     .map((config) => config.bed_types.map((bed) => bed.name_with_count).join(", "))
//                                                                     .join(" ou ")}
//                                                             </span>
//                                                         </div>
//                                                     )}
//
//                                                     {room.highlights && room.highlights.length > 0 && (
//                                                         <div className="flex flex-wrap gap-2 mt-3">
//                                                             {room.highlights.slice(0, 3).map((h, hIdx) => (
//                                                                 <span key={hIdx} className="inline-flex items-center text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
//                                                                     <BsCheckCircle className="mr-1" /> {h.translated_name}
//                                                                 </span>
//                                                             ))}
//                                                         </div>
//                                                     )}
//                                                 </div>
//
//                                                 <div className="flex items-center">
//                                                     {selectedRoom?.block_id === room.block_id && (
//                                                         <BsCheckCircle className="text-[#8e85e6] text-2xl" />
//                                                     )}
//                                                 </div>
//                                             </div>
//
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
//                             <div className="bg-[#191b1d] rounded-xl shadow-md p-6">
//                                 <h3 className="text-xl font-bold mb-4 flex items-center text-white">
//                                     <BsPersonFill className="mr-2" /> Informations des voyageurs
//                                 </h3>
//                                 <div className="space-y-6">
//                                     {guests.map((guest, idx) => (
//                                         <div key={idx} className="border border-gray-600 rounded-lg p-4">
//                                             <h4 className="font-semibold text-white mb-3">Voyageur {idx + 1} {idx === 0 && "(Principal)"}</h4>
//                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-300 mb-1">Prénom *</label>
//                                                     <input
//                                                         type="text"
//                                                         value={guest.firstName}
//                                                         onChange={(e) => updateGuest(idx, "firstName", e.target.value)}
//                                                         className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 focus:ring-[#8e85e6] focus:border-transparent"
//                                                         placeholder="Jean"
//                                                         required
//                                                     />
//                                                 </div>
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-300 mb-1">Nom *</label>
//                                                     <input
//                                                         type="text"
//                                                         value={guest.lastName}
//                                                         onChange={(e) => updateGuest(idx, "lastName", e.target.value)}
//                                                         className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 focus:ring-[#8e85e6] focus:border-transparent"
//                                                         placeholder="Dupont"
//                                                         required
//                                                     />
//                                                 </div>
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center"><BsEnvelope className="mr-1" /> Email *</label>
//                                                     <input
//                                                         type="email"
//                                                         value={guest.email}
//                                                         onChange={(e) => updateGuest(idx, "email", e.target.value)}
//                                                         className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 focus:ring-[#8e85e6] focus:border-transparent"
//                                                         placeholder="jean.dupont@email.com"
//                                                         required
//                                                     />
//                                                 </div>
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center"><BsTelephone className="mr-1" /> Téléphone *</label>
//                                                     <input
//                                                         type="tel"
//                                                         value={guest.phone}
//                                                         onChange={(e) => updateGuest(idx, "phone", e.target.value)}
//                                                         className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 focus:ring-[#8e85e6] focus:border-transparent"
//                                                         placeholder="+33 6 12 34 56 78"
//                                                         required
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                                 <p className="text-xs text-gray-400 mt-3">* Champs obligatoires</p>
//                             </div>
//
//                             {hotel.photos && hotel.photos.length > 1 && (
//                                 <div className="bg-[#191b1d] rounded-xl shadow-md p-6">
//                                     <h3 className="text-xl font-bold mb-4 text-white">Photos de l'établissement</h3>
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
//                         <div className="lg:col-span-1">
//                             <div className="bg-[#191b1d] rounded-xl shadow-md p-6 sticky top-20">
//                                 <h3 className="text-xl font-bold mb-4 text-white">Résumé de la
//                                     réservation</h3>
//
//                                 {selectedRoom ? (
//                                     <div className="mb-4 p-3 bg-blue-900/20 rounded-lg">
//                                         <p className="text-sm text-gray-300 mb-1">Chambre
//                                             sélectionnée:</p>
//                                         <p className="font-semibold text-white">{selectedRoom.name}</p>
//                                     </div>
//                                 ) : (
//                                     <div className="mb-4 p-3 bg-yellow-900/20 rounded-lg">
//                                         <p className="text-sm text-yellow-200 flex items-center">
//                                             <BsInfoCircle className="mr-2" /> Veuillez sélectionner une chambre
//                                         </p>
//                                     </div>
//                                 )}
//
//                                 <div className="space-y-3 mb-6">
//                                     <div className="flex justify-between text-gray-300">
//                                         <span>Prix net ({nights} {nights > 1 ? "nuits" : "nuit"})</span>
//                                         <span
//                                             className="font-semibold">{pricing.netAmount.toFixed(2)} {pricing.currency}</span>
//                                     </div>
//
//                                     {pricing.discountedAmount > 0 && (
//                                         <div className="flex justify-between text-green-400">
//                                             <span>Réduction</span>
//                                             <span
//                                                 className="font-semibold">-{pricing.discountedAmount.toFixed(2)} {pricing.currency}</span>
//                                         </div>
//                                     )}
//
//                                     <div className="flex justify-between text-gray-300">
//                                         <span>Taxes et frais</span>
//                                         <span
//                                             className="font-semibold">+{pricing.taxes.toFixed(2)} {pricing.currency}</span>
//                                     </div>
//
//                                     {pricing.strikethroughAmount > pricing.totalPrice && (
//                                         <div className="flex justify-between text-red-400">
//                                             <span>Prix barré</span>
//                                             <span
//                                                 className="font-semibold line-through">{pricing.strikethroughAmount.toFixed(2)} {pricing.currency}</span>
//                                         </div>
//                                     )}
//
//                                     {mealPrice > 0 && (
//                                         <div className="flex justify-between text-gray-300">
//                                             <span>Coût des repas</span>
//                                             <span
//                                                 className="font-semibold">{mealPrice.toFixed(2)} {pricing.currency}</span>
//                                         </div>
//                                     )}
//
//                                     <div className="border-t border-gray-600 pt-3 mt-3">
//                                         <div
//                                             className="flex justify-between text-xl font-bold text-[#8e85e6]">
//                                             <span>Total</span>
//                                             <span>{finalTotalPrice.toFixed(2)} {pricing.currency}</span>
//                                         </div>
//                                         <p className="text-xs text-gray-400 text-right mt-1">Taxes et
//                                             frais inclus</p>
//                                     </div>
//                                 </div>
//
//                                 <button
//                                     className={`w-full py-3 rounded-lg font-semibold transition-all ${selectedRoom
//                                         ? "bg-[#8e85e6] text-white hover:bg-[#7a6deb]"
//                                         : "bg-gray-600 text-gray-400 cursor-not-allowed"
//                                         }`}
//                                     disabled={!selectedRoom}
//                                     onClick={async () => {
//                                         if (!selectedRoom) return;
//
//                                         // 1️⃣ Générer le PDF
//                                         await generatePDF();
//
//                                         // 2️⃣ Ajouter la réservation à la base de données
//                                         await handleReservation();
//
//                                         alert("Réservation confirmée !");
//                                     }}
//                                 >
//                                     {selectedRoom ? "Confirmer et Réserver" : "Sélectionnez une chambre"}
//                                 </button>
//
//
//                                 <div className="mt-6 space-y-2 text-sm text-gray-300">
//                                     <p className="flex items-start">
//                                         <BsCheckCircle
//                                             className="mr-2 text-green-400 mt-0.5 flex-shrink-0" />
//                                         Confirmation immédiate
//                                     </p>
//                                     <p className="flex items-start">
//                                         <BsCheckCircle
//                                             className="mr-2 text-green-400 mt-0.5 flex-shrink-0" />
//                                         Pas de frais de réservation
//                                     </p>
//                                     {selectedRoom?.refundable === 1 && (
//                                         <p className="flex items-start">
//                                             <BsCheckCircle
//                                                 className="mr-2 text-green-400 mt-0.5 flex-shrink-0" />
//                                             Annulation gratuite
//                                         </p>
//                                     )}
//                                 </div>
//
//                                 <div className="mt-4 flex gap-2">
//                                     <button
//                                         onClick={generatePDF}
//                                         disabled={generatingPDF || !selectedRoom || !isFormValid()}
//                                         className={`flex-1 py-2 rounded-lg border transition-all ${generatingPDF || !selectedRoom || !isFormValid()
//                                             ? 'border-gray-600 bg-gray-700 text-gray-500 cursor-not-allowed'
//                                             : 'border-gray-600 hover:bg-gray-700 text-gray-300'
//                                         }`}
//                                     >
//                                         <BsDownload className="inline mr-2"/>
//                                         {generatingPDF ? 'Génération...' : 'Télécharger PDF'}
//                                     </button>
//                                     <button
//                                         onClick={handlePaymentClick}
//                                         disabled={!selectedRoom || processingPayment}
//                                         className={`flex-1 py-2 rounded-lg transition-all ${
//                                             !selectedRoom || processingPayment
//                                                 ? "bg-gray-600 text-gray-400 cursor-not-allowed"
//                                                 : "bg-[#8e85e6] text-white hover:bg-[#7a6deb]"
//                                         }`}
//                                     >
//                                         {processingPayment ? "Traitement..." : "Réserver et payer"}
//                                     </button>
//
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </main>
//             <Footer/>
//         </>
//     );
// }



"use client";

import { useSearchParams } from "next/navigation";
import { JSX, useEffect, useState } from "react";
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
import { loadStripe } from "@stripe/stripe-js";
import { createReservation } from "@/app/reservation/actions";
import { NotificationProvider, useNotification } from "@/components/NotificationSystem";

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
    return (
        <NotificationProvider>
            <ReservationPageContent />
        </NotificationProvider>
    );
}

function ReservationPageContent(): JSX.Element {
    const searchParams = useSearchParams();
    const { showNotification } = useNotification();
    const [reservationData, setReservationData] = useState<ReservationData | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMeal, setSelectedMeal] = useState<MealOption["type"]>("none");
    const [guests, setGuests] = useState<GuestInfo[]>([
        { firstName: "", lastName: "", email: "", phone: "" },
    ]);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [generatingPDF, setGeneratingPDF] = useState(false);

    const mealOptions: MealOption[] = [
        { type: "none", label: "Sans repas", pricePerPerson: 0 },
        { type: "breakfast", label: "Petit-déjeuner", pricePerPerson: 15 },
        { type: "half_board", label: "Demi-pension", pricePerPerson: 35 },
        { type: "full_board", label: "Pension complète", pricePerPerson: 50 },
    ];

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
                showNotification(
                    'error',
                    'Erreur de chargement',
                    'Impossible de charger les données de réservation.'
                );
            }
        }
        setLoading(false);
    }, [showNotification]);

    if (loading) {
        return (
            <>
                <TopNavBar />
                <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#222529]">
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
                <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#222529]">
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

    const nights = Math.max(
        1,
        Math.ceil(
            (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        )
    );

    const selectedMealOption = mealOptions.find((m) => m.type === selectedMeal);
    const mealPrice =
        (selectedMealOption?.pricePerPerson || 0) * nights * (parseInt(booking.adults) || 1);

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
        if (!selectedRoom || !isFormValid()) {
            showNotification(
                'warning',
                'Informations incomplètes',
                'Veuillez sélectionner une chambre et remplir toutes les informations des voyageurs.'
            );
            return;
        }

        setGeneratingPDF(true);

        try {
            const { default: jsPDF } = await import('jspdf');

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            let yPos = 20;

            // Header
            doc.setFillColor(59, 130, 246);
            doc.rect(0, 0, pageWidth, 40, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont(undefined, 'bold');
            doc.text('CONFIRMATION DE RÉSERVATION', pageWidth / 2, 25, { align: 'center' });

            yPos = 50;

            // Hotel Information
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text(hotel.name, 20, yPos);
            yPos += 8;

            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(`${hotel.address}, ${hotel.city}`, 20, yPos);
            yPos += 6;
            doc.text(`Note: ${hotel.review_score}/10 (${hotel.review_nr} avis)`, 20, yPos);
            yPos += 12;

            // Booking Details Section
            doc.setFillColor(243, 244, 246);
            doc.rect(15, yPos, pageWidth - 30, 50, 'F');

            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            yPos += 8;
            doc.text('DÉTAILS DU SÉJOUR', 20, yPos);
            yPos += 8;

            doc.setFont(undefined, 'normal');
            doc.setFontSize(10);

            const checkInDate = new Date(booking.checkIn).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            const checkOutDate = new Date(booking.checkOut).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            doc.text(`Arrivée: ${checkInDate}`, 20, yPos);
            yPos += 6;
            doc.text(`Départ: ${checkOutDate}`, 20, yPos);
            yPos += 6;
            doc.text(`Durée: ${nights} ${nights > 1 ? 'nuits' : 'nuit'}`, 20, yPos);
            yPos += 6;
            doc.text(`Voyageurs: ${booking.adults} ${parseInt(booking.adults) > 1 ? 'adultes' : 'adulte'}`, 20, yPos);
            yPos += 15;

            // Room Details
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text('CHAMBRE SÉLECTIONNÉE', 20, yPos);
            yPos += 8;

            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(selectedRoom.name, 20, yPos);
            yPos += 6;

            if (selectedRoom.description) {
                const descLines = doc.splitTextToSize(selectedRoom.description, pageWidth - 40);
                doc.text(descLines, 20, yPos);
                yPos += descLines.length * 5 + 2;
            }

            doc.text(`Superficie: ${selectedRoom.room_surface_m2} m²`, 20, yPos);
            yPos += 6;
            doc.text(`Capacité: ${selectedRoom.max_occupancy}`, 20, yPos);
            yPos += 6;
            doc.text(`Petit-déjeuner: ${selectedRoom.breakfast_included ? 'Inclus' : 'Non inclus'}`, 20, yPos);
            yPos += 6;
            doc.text(`Annulation: ${selectedRoom.refundable ? 'Gratuite' : 'Non remboursable'}`, 20, yPos);
            yPos += 12;

            // Meal Options
            if (selectedMealOption && selectedMealOption.type !== 'none') {
                doc.setFont(undefined, 'bold');
                doc.text('OPTION REPAS', 20, yPos);
                yPos += 6;
                doc.setFont(undefined, 'normal');
                doc.text(`${selectedMealOption.label} - ${selectedMealOption.pricePerPerson} ${pricing.currency}/pers/nuit`, 20, yPos);
                yPos += 10;
            }

            // Guest Information
            if (yPos > pageHeight - 80) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFont(undefined, 'bold');
            doc.setFontSize(12);
            doc.text('INFORMATIONS DES VOYAGEURS', 20, yPos);
            yPos += 8;

            doc.setFont(undefined, 'normal');
            doc.setFontSize(10);
            guests.forEach((guest, idx) => {
                if (yPos > pageHeight - 30) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.setFont(undefined, 'bold');
                doc.text(`Voyageur ${idx + 1}${idx === 0 ? ' (Principal)' : ''}:`, 20, yPos);
                yPos += 6;
                doc.setFont(undefined, 'normal');
                doc.text(`${guest.firstName} ${guest.lastName}`, 25, yPos);
                yPos += 5;
                doc.text(`Email: ${guest.email}`, 25, yPos);
                yPos += 5;
                doc.text(`Téléphone: ${guest.phone}`, 25, yPos);
                yPos += 8;
            });

            // Pricing Summary
            if (yPos > pageHeight - 60) {
                doc.addPage();
                yPos = 20;
            }

            yPos += 5;
            doc.setFillColor(243, 244, 246);
            doc.rect(15, yPos, pageWidth - 30, 55, 'F');
            yPos += 8;

            doc.setFont(undefined, 'bold');
            doc.setFontSize(12);
            doc.text('RÉCAPITULATIF DES PRIX', 20, yPos);
            yPos += 10;

            doc.setFont(undefined, 'normal');
            doc.setFontSize(10);

            doc.text(`Prix net (${nights} ${nights > 1 ? 'nuits' : 'nuit'}):`, 20, yPos);
            doc.text(`${pricing.netAmount.toFixed(2)} ${pricing.currency}`, pageWidth - 20, yPos, { align: 'right' });
            yPos += 6;

            if (pricing.discountedAmount > 0) {
                doc.setTextColor(34, 197, 94);
                doc.text('Réduction:', 20, yPos);
                doc.text(`-${pricing.discountedAmount.toFixed(2)} ${pricing.currency}`, pageWidth - 20, yPos, { align: 'right' });
                doc.setTextColor(0, 0, 0);
                yPos += 6;
            }

            doc.text('Taxes et frais:', 20, yPos);
            doc.text(`+${pricing.taxes.toFixed(2)} ${pricing.currency}`, pageWidth - 20, yPos, { align: 'right' });
            yPos += 6;

            if (mealPrice > 0) {
                doc.text('Coût des repas:', 20, yPos);
                doc.text(`${mealPrice.toFixed(2)} ${pricing.currency}`, pageWidth - 20, yPos, { align: 'right' });
                yPos += 6;
            }

            yPos += 2;
            doc.setDrawColor(59, 130, 246);
            doc.setLineWidth(0.5);
            doc.line(20, yPos, pageWidth - 20, yPos);
            yPos += 6;

            doc.setFont(undefined, 'bold');
            doc.setFontSize(12);
            doc.setTextColor(59, 130, 246);
            doc.text('TOTAL:', 20, yPos);
            doc.text(`${finalTotalPrice.toFixed(2)} ${pricing.currency}`, pageWidth - 20, yPos, { align: 'right' });
            doc.setTextColor(0, 0, 0);
            yPos += 5;
            doc.setFontSize(8);
            doc.setFont(undefined, 'normal');
            doc.text('Taxes et frais inclus', pageWidth - 20, yPos, { align: 'right' });

            // Footer
            const footerY = pageHeight - 20;
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text(`Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, pageWidth / 2, footerY, { align: 'center' });
            doc.text('Merci de votre réservation!', pageWidth / 2, footerY + 5, { align: 'center' });

            // Save PDF
            const fileName = `reservation-${hotel.name.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
            doc.save(fileName);

            showNotification(
                'success',
                'PDF téléchargé',
                'Votre confirmation de réservation a été téléchargée avec succès.'
            );
        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            showNotification(
                'error',
                'Erreur PDF',
                'Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.'
            );
        } finally {
            setGeneratingPDF(false);
        }
    };

    const handleReservation = async () => {
        if (!selectedRoom || !isFormValid()) {
            showNotification(
                'warning',
                'Informations incomplètes',
                'Veuillez remplir toutes les informations et sélectionner une chambre.'
            );
            return;
        }

        try {
            const savedReservation = await createReservation({
                hotel: reservationData.hotel,
                rooms: reservationData.rooms,
                pricing: reservationData.pricing,
                booking: reservationData.booking,
                guests,
                selectedRoomId: selectedRoom.block_id,
                selectedMeal,
            });

            console.log("Réservation enregistrée :", savedReservation);
            showNotification(
                'success',
                'Réservation enregistrée',
                'Votre réservation a été enregistrée avec succès. Vous pouvez maintenant procéder au paiement.'
            );
        } catch (err) {
            console.error(err);
            showNotification(
                'error',
                'Erreur de réservation',
                'Une erreur est survenue lors de l\'enregistrement de votre réservation.'
            );
        }
    };

    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

    // const handlePaymentClick = () => {
    //     if (!selectedRoom) {
    //         showNotification(
    //             'warning',
    //             'Chambre non sélectionnée',
    //             'Veuillez sélectionner une chambre avant de procéder au paiement.'
    //         );
    //         return;
    //     }
    //
    //     const finalAmount = selectedRoom ? finalTotalPrice : pricing.totalPrice;
    //     window.location.href = `/payment?amount=${finalAmount}`;
    // };



    // Ajoutez cette fonction dans votre ReservationPageContent

    const handlePaymentClick = () => {
        if (!selectedRoom) {
            showNotification(
                'warning',
                'Chambre non sélectionnée',
                'Veuillez sélectionner une chambre avant de procéder au paiement.'
            );
            return;
        }

        if (!isFormValid()) {
            showNotification(
                'warning',
                'Informations incomplètes',
                'Veuillez remplir toutes les informations des voyageurs.'
            );
            return;
        }

        // Préparer toutes les données pour la page de paiement
        const paymentData = {
            hotel: reservationData.hotel,
            rooms: reservationData.rooms,
            selectedRoom: selectedRoom,
            guests: guests,
            booking: reservationData.booking,
            pricing: reservationData.pricing,
            mealOption: mealOptions.find((m) => m.type === selectedMeal),
            finalTotalPrice: finalTotalPrice,
        };

        // Stocker dans sessionStorage
        sessionStorage.setItem("reservationData", JSON.stringify(paymentData));

        // Redirection vers la page de paiement
        window.location.href = `/payment?amount=${finalTotalPrice}`;
    };



    const handleConfirmAndReserve = async () => {
        if (!selectedRoom) {
            showNotification(
                'warning',
                'Chambre non sélectionnée',
                'Veuillez sélectionner une chambre pour continuer.'
            );
            return;
        }

        // 1️⃣ Générer le PDF
        await generatePDF();

        // 2️⃣ Ajouter la réservation à la base de données
        await handleReservation();
    };

    return (
        <>
            <TopNavBar />
            <main className="mt-12 py-6 bg-gray-50 dark:bg-[#222529] text-gray-900 dark:text-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-[#191b1d] rounded-xl shadow-md p-6 mb-8">
                        <h1 className="text-3xl font-bold text-white mb-4">Finaliser votre réservation</h1>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <h2 className="text-2xl font-semibold text-white mb-2">
                                    {hotel.name}
                                    {hotel.name_trans && (
                                        <span className="text-lg text-gray-300 ml-2">({hotel.name_trans})</span>
                                    )}
                                </h2>
                                <p className="text-gray-300 flex items-center mb-2">
                                    <BsGeoAlt className="mr-2 text-[#8e85e6]" />
                                    {hotel.address}, {hotel.city}
                                    {hotel.city_trans && ` (${hotel.city_trans})`}
                                </p>
                                <div className="flex items-center">
                                    <span className="inline-flex items-center px-3 py-1 bg-yellow-500 dark:bg-yellow-600 text-white text-sm font-semibold rounded-full">
                                        <BsStarFill className="mr-1" /> {hotel.review_score}/10
                                        {hotel.review_score_word && ` (${hotel.review_score_word})`}
                                    </span>
                                    <span className="ml-2 text-gray-300">({hotel.review_nr} avis)</span>
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
                            <div className="bg-[#191b1d] rounded-xl shadow-md p-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center text-white">
                                    <BsCalendar className="mr-2" /> Détails du séjour
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-300">Arrivée</p>
                                        <p className="font-semibold text-white">
                                            {new Date(booking.checkIn).toLocaleDateString("fr-FR", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-300">Départ</p>
                                        <p className="font-semibold text-white">
                                            {new Date(booking.checkOut).toLocaleDateString("fr-FR", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-300">Durée</p>
                                        <p className="font-semibold text-white">{nights} {nights > 1 ? "nuits" : "nuit"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-300">Voyageurs</p>
                                        <p className="font-semibold text-white flex items-center">
                                            <BsPeople className="mr-2" />
                                            {booking.adults} {parseInt(booking.adults) > 1 ? "adultes" : "adulte"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#191b1d] rounded-xl shadow-md p-6">
                                <h3 className="text-xl font-bold mb-4 text-white">Options de repas</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {mealOptions.map((option) => (
                                        <div
                                            key={option.type}
                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedMeal === option.type
                                                ? "border-[#8e85e6] bg-blue-900/20"
                                                : "border-gray-600 hover:border-[#8e85e6]"
                                            }`}
                                            onClick={() => setSelectedMeal(option.type)}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-semibold text-white">{option.label}</h4>
                                                    <p className="text-sm text-gray-300 mt-1">
                                                        {option.pricePerPerson > 0
                                                            ? `${option.pricePerPerson} ${pricing.currency}/personne/nuit`
                                                            : "Gratuit"}
                                                    </p>
                                                </div>
                                                {selectedMeal === option.type && (
                                                    <BsCheckCircle className="text-[#8e85e6] text-xl" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {selectedMealOption && selectedMealOption.pricePerPerson > 0 && (
                                    <div className="mt-4 p-3 bg-blue-900/20 rounded-lg">
                                        <p className="text-sm text-gray-300">
                                            <strong>Coût des repas:</strong> {mealPrice.toFixed(2)} {pricing.currency}
                                            <span className="text-xs ml-2">({parseInt(booking.adults)} personne(s) × {nights} nuit(s) × {selectedMealOption.pricePerPerson} {pricing.currency})</span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-[#191b1d] rounded-xl shadow-md p-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center text-white">
                                    <BsDoorOpen className="mr-2" /> Choisissez votre chambre
                                </h3>
                                <div className="space-y-4">
                                    {availableRooms.map((room, idx) => (
                                        <div
                                            key={room.block_id || idx}
                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedRoom?.block_id === room.block_id
                                                ? "border-[#8e85e6] bg-blue-900/20"
                                                : "border-gray-600 hover:border-[#8e85e6]"
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
                                                    <h4 className="font-semibold text-lg text-white mb-2">{room.name}</h4>
                                                    <p className="text-sm text-gray-300 mb-2">{room.description}</p>

                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div className="text-gray-300">
                                                            <strong>Superficie:</strong> {room.room_surface_m2} m²
                                                        </div>
                                                        <div className="text-gray-300">
                                                            <strong>Capacité:</strong> {room.max_occupancy}
                                                        </div>
                                                        <div className="text-gray-300">
                                                            <strong>Petit-déjeuner:</strong> {room.breakfast_included ? "Inclus" : "Non inclus"}
                                                        </div>
                                                        <div className="text-gray-300">
                                                            <strong>Annulation:</strong> {room.refundable ? "Gratuite" : "Non remboursable"}
                                                        </div>
                                                    </div>

                                                    {room.bed_configurations && room.bed_configurations.length > 0 && (
                                                        <div className="mt-2">
                                                            <strong className="text-sm text-gray-300">Lits:</strong>
                                                            <span className="text-sm text-gray-300 ml-2">
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
                                                        <BsCheckCircle className="text-[#8e85e6] text-2xl" />
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

                            <div className="bg-[#191b1d] rounded-xl shadow-md p-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center text-white">
                                    <BsPersonFill className="mr-2" /> Informations des voyageurs
                                </h3>
                                <div className="space-y-6">
                                    {guests.map((guest, idx) => (
                                        <div key={idx} className="border border-gray-600 rounded-lg p-4">
                                            <h4 className="font-semibold text-white mb-3">Voyageur {idx + 1} {idx === 0 && "(Principal)"}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-1">Prénom *</label>
                                                    <input
                                                        type="text"
                                                        value={guest.firstName}
                                                        onChange={(e) => updateGuest(idx, "firstName", e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 focus:ring-[#8e85e6] focus:border-transparent"
                                                        placeholder="Jean"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-1">Nom *</label>
                                                    <input
                                                        type="text"
                                                        value={guest.lastName}
                                                        onChange={(e) => updateGuest(idx, "lastName", e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 focus:ring-[#8e85e6] focus:border-transparent"
                                                        placeholder="Dupont"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center"><BsEnvelope className="mr-1" /> Email *</label>
                                                    <input
                                                        type="email"
                                                        value={guest.email}
                                                        onChange={(e) => updateGuest(idx, "email", e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 focus:ring-[#8e85e6] focus:border-transparent"
                                                        placeholder="jean.dupont@email.com"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center"><BsTelephone className="mr-1" /> Téléphone *</label>
                                                    <input
                                                        type="tel"
                                                        value={guest.phone}
                                                        onChange={(e) => updateGuest(idx, "phone", e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 focus:ring-[#8e85e6] focus:border-transparent"
                                                        placeholder="+33 6 12 34 56 78"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400 mt-3">* Champs obligatoires</p>
                            </div>

                            {hotel.photos && hotel.photos.length > 1 && (
                                <div className="bg-[#191b1d] rounded-xl shadow-md p-6">
                                    <h3 className="text-xl font-bold mb-4 text-white">Photos de l'établissement</h3>
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
                            <div className="bg-[#191b1d] rounded-xl shadow-md p-6 sticky top-20">
                                <h3 className="text-xl font-bold mb-4 text-white">Résumé de la réservation</h3>

                                {selectedRoom ? (
                                    <div className="mb-4 p-3 bg-blue-900/20 rounded-lg">
                                        <p className="text-sm text-gray-300 mb-1">Chambre sélectionnée:</p>
                                        <p className="font-semibold text-white">{selectedRoom.name}</p>
                                    </div>
                                ) : (
                                    <div className="mb-4 p-3 bg-yellow-900/20 rounded-lg">
                                        <p className="text-sm text-yellow-200 flex items-center">
                                            <BsInfoCircle className="mr-2" /> Veuillez sélectionner une chambre
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-300">
                                        <span>Prix net ({nights} {nights > 1 ? "nuits" : "nuit"})</span>
                                        <span className="font-semibold">{pricing.netAmount.toFixed(2)} {pricing.currency}</span>
                                    </div>

                                    {pricing.discountedAmount > 0 && (
                                        <div className="flex justify-between text-green-400">
                                            <span>Réduction</span>
                                            <span className="font-semibold">-{pricing.discountedAmount.toFixed(2)} {pricing.currency}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-gray-300">
                                        <span>Taxes et frais</span>
                                        <span className="font-semibold">+{pricing.taxes.toFixed(2)} {pricing.currency}</span>
                                    </div>

                                    {pricing.strikethroughAmount > pricing.totalPrice && (
                                        <div className="flex justify-between text-red-400">
                                            <span>Prix barré</span>
                                            <span className="font-semibold line-through">{pricing.strikethroughAmount.toFixed(2)} {pricing.currency}</span>
                                        </div>
                                    )}

                                    {mealPrice > 0 && (
                                        <div className="flex justify-between text-gray-300">
                                            <span>Coût des repas</span>
                                            <span className="font-semibold">{mealPrice.toFixed(2)} {pricing.currency}</span>
                                        </div>
                                    )}

                                    <div className="border-t border-gray-600 pt-3 mt-3">
                                        <div className="flex justify-between text-xl font-bold text-[#8e85e6]">
                                            <span>Total</span>
                                            <span>{finalTotalPrice.toFixed(2)} {pricing.currency}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 text-right mt-1">Taxes et frais inclus</p>
                                    </div>
                                </div>

                                <button
                                    className={`w-full py-3 rounded-lg font-semibold transition-all ${selectedRoom
                                        ? "bg-[#8e85e6] text-white hover:bg-[#7a6deb]"
                                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                                    }`}
                                    disabled={!selectedRoom}
                                    onClick={handleConfirmAndReserve}
                                >
                                    {selectedRoom ? "Confirmer et Réserver" : "Sélectionnez une chambre"}
                                </button>

                                <div className="mt-6 space-y-2 text-sm text-gray-300">
                                    <p className="flex items-start">
                                        <BsCheckCircle className="mr-2 text-green-400 mt-0.5 flex-shrink-0" />
                                        Confirmation immédiate
                                    </p>
                                    <p className="flex items-start">
                                        <BsCheckCircle className="mr-2 text-green-400 mt-0.5 flex-shrink-0" />
                                        Pas de frais de réservation
                                    </p>
                                    {selectedRoom?.refundable === 1 && (
                                        <p className="flex items-start">
                                            <BsCheckCircle className="mr-2 text-green-400 mt-0.5 flex-shrink-0" />
                                            Annulation gratuite
                                        </p>
                                    )}
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={generatePDF}
                                        disabled={generatingPDF || !selectedRoom || !isFormValid()}
                                        className={`flex-1 py-2 rounded-lg border transition-all ${generatingPDF || !selectedRoom || !isFormValid()
                                            ? 'border-gray-600 bg-gray-700 text-gray-500 cursor-not-allowed'
                                            : 'border-gray-600 hover:bg-gray-700 text-gray-300'
                                        }`}
                                    >
                                        <BsDownload className="inline mr-2"/>
                                        {generatingPDF ? 'Génération...' : 'Télécharger PDF'}
                                    </button>
                                    <button
                                        onClick={handlePaymentClick}
                                        disabled={!selectedRoom || processingPayment}
                                        className={`flex-1 py-2 rounded-lg transition-all ${
                                            !selectedRoom || processingPayment
                                                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                                : "bg-[#8e85e6] text-white hover:bg-[#7a6deb]"
                                        }`}
                                    >
                                        {processingPayment ? "Traitement..." : "Réserver et payer"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </>
    );
}