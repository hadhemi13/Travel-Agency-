"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TopNavBar from "@/components/TopNav/TopNavBar";
import Footer from "@/components/Footer";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ amount }: { amount: string | null }) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [processing, setProcessing] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error">("success");
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!amount) {
            setIsLoading(false);
            return;
        }

        (async () => {
            try {
                const formattedAmount = Number(amount).toFixed(2);

                const res = await fetch("/api/payment-intent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount: formattedAmount }),
                });

                const data = await res.json();
                if (data.clientSecret) {
                    setClientSecret(data.clientSecret);
                } else {
                    setPopupMessage("Impossible d'initialiser le paiement.");
                    setPopupType("error");
                    setShowPopup(true);
                }
            } catch (err) {
                console.error(err);
                setPopupMessage("Erreur réseau lors de la création du paiement.");
                setPopupType("error");
                setShowPopup(true);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [amount]);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) {
            setPopupMessage("Stripe non initialisé ou montant invalide.");
            setPopupType("error");
            setShowPopup(true);
            return;
        }

        setProcessing(true);

        const card = elements.getElement(CardElement);
        if (!card) {
            setPopupMessage("Champ carte introuvable.");
            setPopupType("error");
            setShowPopup(true);
            setProcessing(false);
            return;
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card },
        });

        if (error) {
            console.error(error);
            setPopupMessage(error.message || "Le paiement a échoué. Veuillez réessayer.");
            setPopupType("error");
            setShowPopup(true);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            setPopupMessage("Votre paiement a été effectué avec succès !");
            setPopupType("success");
            setShowPopup(true);
        } else {
            setPopupMessage("État du paiement : " + (paymentIntent?.status ?? "inconnu"));
            setPopupType("error");
            setShowPopup(true);
        }

        setProcessing(false);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-[#0f1115] dark:via-[#1a1d23] dark:to-[#222529] py-12 px-4 transition-all duration-300">
            <div className="max-w-2xl mx-auto mt-24">
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#8e85e6] to-[#6b5dd3] rounded-2xl shadow-lg mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Paiement sécurisé
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Finalisez votre réservation en toute sécurité
                    </p>
                </div>

                <div className="bg-white dark:bg-[#1a1d23] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300">
                    <div className="bg-gradient-to-r from-[#8e85e6] to-[#6b5dd3] p-8 text-center">
                        <p className="text-white/80 text-sm font-medium mb-2 uppercase tracking-wider">
                            Montant à payer
                        </p>
                        <div className="text-5xl font-bold text-white">
                            {isLoading ? (
                                <div className="animate-pulse">—</div>
                            ) : amount ? (
                                <>${Number(amount).toFixed(2)} <span className="text-3xl">USD</span></>
                            ) : (
                                "—"
                            )}
                        </div>
                    </div>

                    <div className="p-8">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8e85e6] border-t-transparent mb-4"></div>
                                <p className="text-gray-600 dark:text-gray-400">Initialisation du paiement...</p>
                            </div>
                        ) : (
                            <form onSubmit={handlePayment} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Informations de carte bancaire
                                    </label>
                                    <div className="bg-gray-50 dark:bg-[#222529] p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus-within:border-[#8e85e6] focus-within:ring-4 focus-within:ring-[#8e85e6]/20 transition-all duration-200">
                                        <CardElement
                                            options={{
                                                hidePostalCode: true,
                                                style: {
                                                    base: {
                                                        color: "#ffffff",
                                                        fontSize: "16px",
                                                        "::placeholder": { color: "#9ca3af" },
                                                        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system",
                                                        iconColor: "#ffffff",
                                                    },
                                                    invalid: { color: "#ef4444", iconColor: "#ef4444" },
                                                    complete: { color: "#ffffff", iconColor: "#10b981" }
                                                },
                                            }}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!stripe || processing}
                                    className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-200 flex items-center justify-center shadow-lg ${processing || !stripe
                                            ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                            : "bg-gradient-to-r from-[#8e85e6] to-[#6b5dd3] text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                                        }`}
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                            </svg>
                                            Traitement en cours...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            Confirmer le paiement
                                        </>
                                    )}
                                </button>

                                <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Cryptage SSL</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                        <span>Paiement sécurisé</span>
                                    </div>
                                </div>

                                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                                    Vos données bancaires ne transitent jamais par notre serveur. Le paiement est traité directement par Stripe.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-[#1a1d23] rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-gray-200 dark:border-gray-700 animate-scale-in">
                        <div className={`p-6 ${popupType === "success" ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-gradient-to-r from-red-500 to-rose-500"}`}>
                            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white/20 rounded-full mb-4">
                                {popupType === "success" ? (
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-white text-center">
                                {popupType === "success" ? "Paiement réussi !" : "Erreur de paiement"}
                            </h3>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-700 dark:text-gray-300 text-center mb-6">
                                {popupMessage}
                            </p>
                            <button
                                onClick={() => router.push("/")}
                                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${popupType === "success"
                                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                        : "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
                                    } text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`}
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scale-in {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out; }
                .animate-scale-in { animation: scale-in 0.3s ease-out; }
            `}</style>
        </main>
    );
}

export default function PaymentPage() {
    const searchParams = useSearchParams();
    const amount = searchParams.get("amount");

    return (
        <>
            <TopNavBar />
            <Elements stripe={stripePromise}>
                <CheckoutForm amount={amount} />
            </Elements>
            <Footer />
        </>
    );
}
