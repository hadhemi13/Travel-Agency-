"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BsGeoAlt } from "react-icons/bs";
import { FaStar } from "react-icons/fa6";

// ✅ Interface basée sur ton schéma Prisma
interface Hotel {
  id: string;
  nom: string;
  adresse: string;
  prixMin: number;
  prixMax: number;
  rating: number;
  images: string[];
  etoiles: number | null;
  description?: string | null;
  equipements?: string[];
  featured?: boolean;
  destination?: {
    nom: string;
    pays: string;
    ville: string | null;
  };
}

const FeaturedHotels = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("/api/hotels");
        const data: Hotel[] = await res.json();
        console.log("Hotels reçus:", data); // ✅ Debug
        setHotels(data);
      } catch (err) {
        console.error("Failed to load hotels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
          Loading featured hotels...
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold text-white dark:text-gray-100">
            Featured Hotels
          </h2>
        </div>

        {hotels.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No featured hotels found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white dark:bg-gray-800 overflow-hidden rounded-3xl shadow hover:shadow-lg transition-shadow group"
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-3xl">
                  <img
                    src={hotel.images?.[0] || "/assets/images/placeholder.jpg"}
                    alt={hotel.nom}
                    width={500}
                    height={300}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 p-3">
                    <div className="flex items-center text-white bg-black/70 backdrop-blur-sm text-sm px-3 py-1 rounded-full">
                      <BsGeoAlt className="mr-2" />
                      {hotel.destination?.ville || hotel.destination?.nom || hotel.adresse}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h5 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    <Link
                      href={`/hotels/${hotel.id}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {hotel.nom}
                    </Link>
                  </h5>

                  <div className="flex justify-between items-center">
                    <h6 className="text-green-600 font-medium">
                      {"$"}
                      {Number(hotel.prixMin)}
                      <small className="ml-1 text-gray-500 dark:text-gray-400 font-light">
                        /starting at
                      </small>
                    </h6>

                    <h6 className="flex items-center text-gray-700 dark:text-gray-300">
                      {hotel.rating?.toFixed(1) || hotel.etoiles || 0}
                      <FaStar size={18} className="text-yellow-400 ml-1" />
                    </h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedHotels;