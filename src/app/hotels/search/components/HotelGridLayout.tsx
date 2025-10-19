"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { BsSliders, BsGridFill, BsListUl, BsStarFill } from "react-icons/bs";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface Hotel {
  hotel_id?: string;
  hotel_name: string;
  address: string;
  image: string;
  price?: number;
  review_score?: number;
  currency?: string;
}

interface HotelGridLayoutProps {
  hotels: Hotel[];
  loading: boolean;
  error: string | null;
}

const HotelGridLayout = ({ hotels, loading, error }: HotelGridLayoutProps) => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const adults = searchParams.get("adults") || "1";
  const rooms = searchParams.get("rooms") || "1";

  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<string[]>(["700", "1500"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [favoriteHotels, setFavoriteHotels] = useState<Set<string>>(new Set());
  const [savingHotel, setSavingHotel] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const hotelsPerPage = 6;

  const toggle = () => setIsOpen(!isOpen);

  const filterSchema = yup.object({
    hotelName: yup.string().required("Please enter hotel name"),
  });
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(filterSchema),
  });

  const onFilterSubmit = (data: any) => {
    console.log("Filter submitted:", data);
    // TODO: Filter hotels based on data.hotelName, priceRange, etc., and reset pagination
  };

  // Charger les hôtels favoris depuis la base de données
  useEffect(() => {
    const loadFavoriteHotels = async () => {
      if (session?.user && (session.user as any).id) {
        try {
          const response = await fetch('/api/hotels/save');
          if (response.ok) {
            const data = await response.json() as any;
            // L'API peut retourner {hotels: [...]} ou directement [...]
            const hotels = (data.hotels || data || []) as any[];
            // CORRECTION: Utiliser hotel_id au lieu de hotelId pour correspondre à votre structure
            const favoriteHotelIds = new Set(
              hotels
                .map((hotel: any) => hotel.hotel_id || hotel.hotelId)
                .filter((id: string) => id) // Filtrer les undefined
            );
            setFavoriteHotels(favoriteHotelIds);
            console.log('Favoris chargés:', Array.from(favoriteHotelIds));
          }
        } catch (error) {
          console.error('Erreur lors du chargement des favoris:', error);
        }
      }
    };

    loadFavoriteHotels();
  }, [session]);

  const handleFavoriteHotel = async (hotel: Hotel, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user || !(session.user as any).id) {
      setSaveMessage({ type: 'error', text: 'Veuillez vous connecter pour gérer vos favoris' });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    if (!hotel.hotel_id) {
      setSaveMessage({ type: 'error', text: 'ID de l\'hôtel manquant' });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setSavingHotel(hotel.hotel_id);

    const isCurrentlyFavorite = favoriteHotels.has(hotel.hotel_id);

    try {
      if (isCurrentlyFavorite) {
        // Supprimer des favoris
        const response = await fetch(`/api/hotels/save?hotelId=${hotel.hotel_id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setFavoriteHotels(prev => {
            const newSet = new Set(prev);
            newSet.delete(hotel.hotel_id!);
            return newSet;
          });
          setSaveMessage({ type: 'success', text: 'Hôtel supprimé des favoris !' });
        } else {
          setSaveMessage({ type: 'error', text: 'Erreur lors de la suppression des favoris' });
        }
      } else {
        // Ajouter aux favoris
        const response = await fetch('/api/hotels/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            hotel_id: hotel.hotel_id,
            name: hotel.hotel_name,
            address: hotel.address,
            rating: hotel.review_score || 0,
            reviewCount: 0,
            price: hotel.price || 0,
            currency: hotel.currency || 'USD',
            image: hotel.image,
            amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant'],
            description: `Hôtel ${hotel.hotel_name} situé à ${hotel.address}`,
            checkIn: checkIn || undefined,
            checkOut: checkOut || undefined,
            adults: parseInt(adults),
            rooms: parseInt(rooms)
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setFavoriteHotels(prev => new Set([...prev, hotel.hotel_id!]));
          setSaveMessage({ type: 'success', text: 'Hôtel ajouté aux favoris !' });
        } else {
          if (data.alreadySaved) {
            setSaveMessage({ type: 'error', text: 'Cet hôtel est déjà dans vos favoris' });
          } else {
            setSaveMessage({ type: 'error', text: data.error || 'Erreur lors de l\'ajout aux favoris' });
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris:', error);
      setSaveMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setSavingHotel(null);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const totalPages = Math.ceil(hotels.length / hotelsPerPage);
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#222529] flex items-center justify-center text-gray-900 dark:text-white text-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#8e85e6]"></div>
          <p className="text-lg font-semibold">Loading hotels...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#222529] flex items-center justify-center text-red-500 text-xl">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-xl font-semibold mb-4">Erreur lors du chargement</p>
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 dark:bg-[#222529] text-gray-900 dark:text-white min-h-screen">
      {/* Message de notification */}
      {saveMessage && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${saveMessage.type === 'success'
          ? 'bg-green-600 text-white'
          : 'bg-red-600 text-white'
          }`}>
          <div className="flex items-center gap-2">
            <span>{saveMessage.text}</span>
            <button
              onClick={() => setSaveMessage(null)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        {/* ====== FILTER BAR ====== */}
        <div className="sticky top-0 z-10 shadow-md bg-gray-50 dark:bg-[#222529]">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={toggle}
              className="bg-[#8e85e6] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#7a6deb] transition-colors"
            >
              <BsSliders /> Show Filters
            </button>

            <ul className="flex space-x-2">
              <li>
                <Link href="/hotels/list" className="text-gray-600 dark:text-gray-300 hover:text-[#8e85e6] dark:hover:text-[#7a6deb] p-2">
                  <BsListUl size={16} />
                </Link>
              </li>
              <li>
                <Link href="/hotels/grid" className="text-[#8e85e6] p-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">
                  <BsGridFill size={16} />
                </Link>
              </li>
            </ul>
          </div>

          <div id="collapseFilter" className={isOpen ? "block" : "hidden"}>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <form onSubmit={handleSubmit(onFilterSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Controller
                    name="hotelName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:ring-2 focus:ring-[#8e85e6]"
                        placeholder="Enter Hotel Name"
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Price Range</label>
                  <div className="flex justify-between">
                    <input
                      type="text"
                      value={priceRange[0]}
                      readOnly
                      className="w-16 p-1 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded"
                    />
                    <input
                      type="text"
                      value={priceRange[1]}
                      readOnly
                      className="w-16 p-1 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded"
                    />
                  </div>
                  <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded mt-2" />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Popular Filters</label>
                  <select className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:ring-2 focus:ring-[#8e85e6]">
                    <option>Select Option</option>
                    <option>Recently searched</option>
                    <option>Most popular</option>
                    <option>Top rated</option>
                  </select>
                </div>
                <button type="submit" className="md:col-span-3 bg-[#8e85e6] text-white py-2 rounded hover:bg-[#7a6deb]">
                  Apply Filters
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ====== HOTEL GRID ====== */}
        <div className="pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentHotels.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center col-span-full">No hotel found</p>
            ) : (
              currentHotels.map((hotel, idx) => {
                const isFavorite = favoriteHotels.has(hotel.hotel_id || '');
                const isSaving = savingHotel === hotel.hotel_id;

                return (
                  <Link
                    key={hotel.hotel_id || idx}
                    href={hotel.hotel_id ? `/hotels/hotel-detail/${hotel.hotel_id}?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&adults=${adults}&rooms=${rooms}` : "#"}
                  >
                    <div className="group bg-[#191b1d] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      {/* IMAGE */}
                      <div className="relative">
                        <img
                          src={hotel.image || "https://via.placeholder.com/400x300?text=No+Image"}
                          alt={hotel.hotel_name}
                          className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/400x300?text=Image+Error";
                          }}
                        />
                        {hotel.review_score && (
                          <div className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                            ⭐ {hotel.review_score}/10
                          </div>
                        )}

                        {/* Bouton Favori */}
                        <button
                          onClick={(e) => handleFavoriteHotel(hotel, e)}
                          disabled={isSaving}
                          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${isFavorite || isSaving
                            ? 'bg-red-500 text-white hover:bg-red-600 scale-110'
                            : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                            }`}
                          title={isFavorite ? 'Supprimer des favoris' : 'Ajouter aux favoris'}
                        >
                          {isSaving ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : isFavorite ? (
                            <FaHeart size={16} />
                          ) : (
                            <FaRegHeart size={16} />
                          )}
                        </button>
                      </div>

                      {/* CONTENT */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[#8e85e6] line-clamp-1">
                          {hotel.hotel_name || "Unknown Hotel"}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{hotel.address || "Address N/A"}</p>

                        <div className="flex items-center justify-between">
                          {hotel.price ? (
                            <span className="text-green-400 font-bold text-lg">
                              {hotel.currency || "$"}{hotel.price.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-gray-400">Price N/A</span>
                          )}

                          <span className="text-[#8e85e6] text-sm font-medium group-hover:text-white transition-colors">
                            View Details
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* ====== PAGINATION ====== */}
          <div className="mt-8 flex justify-center">
            <nav aria-label="navigation">
              <ul className="flex items-center gap-2 bg-[#191b1d] rounded-lg p-2">
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded ${currentPage === 1
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-gray-300 hover:text-[#8e85e6]"
                      }`}
                  >
                    <FaAngleLeft />
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <li key={page}>
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded ${currentPage === page
                        ? "bg-[#8e85e6] text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                    >
                      {page}
                    </button>
                  </li>
                ))}

                <li>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded ${currentPage === totalPages
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-gray-300 hover:text-[#8e85e6]"
                      }`}
                  >
                    <FaAngleRight />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotelGridLayout;