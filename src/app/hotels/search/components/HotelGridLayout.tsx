"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { BsSliders, BsGridFill, BsListUl, BsStarFill } from "react-icons/bs";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const adults = searchParams.get("adults") || "1";
  const rooms = searchParams.get("rooms") || "1";

  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<string[]>(["700", "1500"]);
  const [currentPage, setCurrentPage] = useState(1);
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-xl">
        Loading hotels...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500 text-xl">
        Error: {error}
      </div>
    );
  }

  return (
    <section className="bg-gray-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* ====== FILTER BAR ====== */}
        <div className="sticky top-0 z-10 shadow-md bg-gray-900">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={toggle}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <BsSliders /> Show Filters
            </button>

            <ul className="flex space-x-2">
              <li>
                <Link href="/hotels/list" className="text-gray-300 hover:text-blue-400 p-2">
                  <BsListUl size={16} />
                </Link>
              </li>
              <li>
                <Link href="/hotels/grid" className="text-blue-400 p-2 bg-gray-700 rounded hover:bg-gray-600">
                  <BsGridFill size={16} />
                </Link>
              </li>
            </ul>
          </div>

          <div id="collapseFilter" className={isOpen ? "block" : "hidden"}>
            <div className="bg-gray-800 p-4 rounded-lg">
              <form onSubmit={handleSubmit(onFilterSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Controller
                    name="hotelName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Hotel Name"
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Price Range</label>
                  <div className="flex justify-between">
                    <input
                      type="text"
                      value={priceRange[0]}
                      readOnly
                      className="w-16 p-1 border border-gray-600 bg-gray-700 text-white rounded"
                    />
                    <input
                      type="text"
                      value={priceRange[1]}
                      readOnly
                      className="w-16 p-1 border border-gray-600 bg-gray-700 text-white rounded"
                    />
                  </div>
                  <div className="h-2 bg-gray-600 rounded mt-2" />
                  {/* TODO: Add interactive slider, e.g., import ReactSlider and update priceRange state */}
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Popular Filters</label>
                  <select className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500">
                    <option>Select Option</option>
                    <option>Recently searched</option>
                    <option>Most popular</option>
                    <option>Top rated</option>
                  </select>
                </div>
                <button type="submit" className="md:col-span-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
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
              <p className="text-gray-400 text-center col-span-full">No hotels found</p>
            ) : (
              currentHotels.map((hotel, idx) => {
                console.log(`Rendering hotel ${hotel.hotel_name} with image: ${hotel.image}`);
                return (
                  <Link
                    key={hotel.hotel_id || idx}
                    href={hotel.hotel_id ? `/hotels/hotel-detail/${hotel.hotel_id}?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&adults=${adults}&rooms=${rooms}` : "#"}
                  >
                    <div className="group bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      {/* IMAGE */}
                      <div className="relative">
                        <img
                          src={hotel.image || "https://via.placeholder.com/400x300?text=No+Image"}
                          alt={hotel.hotel_name}
                          className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            console.log(`Image load failed for ${hotel.hotel_name}, switching to placeholder. Original URL: ${hotel.image}`);
                            e.currentTarget.src = "https://via.placeholder.com/400x300?text=Image+Error";
                          }}
                        />
                        {hotel.review_score && (
                          <div className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                            ⭐ {hotel.review_score}/10
                          </div>
                        )}
                      </div>

                      {/* CONTENT */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 line-clamp-1">
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

                          <span className="text-blue-400 text-sm font-medium group-hover:text-white transition-colors flex items-center gap-1">
                            View Details
                            <Image
                              src="/icons/book.png"  // Ensure this file exists in /public/icons
                              alt="details"
                              width={16}
                              height={16}
                              unoptimized  // If it's not an optimized image (e.g., PNG icon)
                            />
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
              <ul className="flex items-center gap-2 bg-gray-800 rounded-lg p-2">
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded ${currentPage === 1
                        ? "text-gray-500 cursor-not-allowed"
                        : "text-gray-300 hover:text-blue-400"
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
                          ? "bg-blue-600 text-white"
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
                        : "text-gray-300 hover:text-blue-400"
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