"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BsGeoAlt } from "react-icons/bs";
import { FaStar } from "react-icons/fa6";

// Define the Hotel type based on your Mongoose schema
interface Hotel {
  _id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  description?: string;
  amenities?: string[];
  featured?: boolean;
  createdAt?: string;
}

const FeaturedHotels = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("/api/hotels/featured");
        const data: Hotel[] = await res.json();
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
        <div className="container mx-auto px-4 text-center text-gray-500">
          Loading featured hotels...
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold">Featured Hotels</h2>
        </div>

        {hotels.length === 0 ? (
          <p className="text-center text-gray-500">No featured hotels found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {hotels.map((hotel) => (
              <div
                key={hotel._id}
                className="bg-white overflow-hidden rounded-3xl shadow hover:shadow-lg transition-shadow group"
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-3xl">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    width={500}
                    height={300}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 p-3">
                    <div className="flex items-center text-white bg-black/70 backdrop-blur-sm text-sm px-3 py-1 rounded-full">
                      <BsGeoAlt className="mr-2" />
                      {hotel.location}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h5 className="text-lg font-semibold mb-2">
                    <Link
                      href={`/hotels/${hotel._id}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {hotel.name}
                    </Link>
                  </h5>

                  <div className="flex justify-between items-center">
                    <h6 className="text-green-600 font-medium">
                      {"$"}
                      {hotel.price}
                      <small className="ml-1 text-gray-500 font-light">
                        /starting at
                      </small>
                    </h6>

                    <h6 className="flex items-center text-gray-700">
                      {hotel.rating.toFixed(1)}
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
