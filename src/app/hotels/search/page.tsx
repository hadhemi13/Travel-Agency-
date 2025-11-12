"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import HotelGridLayout from "./components/HotelGridLayout";
import TopNavBar from "@/components/TopNav/TopNavBar";
import Footer from "@/components/Footer";
import Hero from "./components/Hero";

interface Hotel {
  hotel_id?: string;
  hotel_name: string;
  address: string;
  image: string;
  price?: number;
  review_score?: number;
  currency?: string;
}

// Custom debounce function with cancel method
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced as T & { cancel: () => void };
}

const HOTEL_LIMIT = 20;

export default function HotelSearchPage() {
  const searchParams = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = searchParams.get("location") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const adults = parseInt(searchParams.get("adults") || "1", 10);
  const rooms = parseInt(searchParams.get("rooms") || "1", 10);

  const fetchHotels = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    if (!location || !checkIn || !checkOut) {
      setError("Missing required search parameters.");
      setLoading(false);
      return;
    }

    const correctedLocation = location === "Amesterdam" ? "Amsterdam" : location;
    const params = new URLSearchParams({
      location: correctedLocation,
      checkIn,
      checkOut,
      adults: adults.toString(),
      rooms: rooms.toString(),
    });
   
    console.log("🔍 Fetching hotels with params:", { location: correctedLocation, checkIn, checkOut, adults, rooms });
   
    const response = await fetch(`/api/hotels/search?${params}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${await response.text()}`);
    }

    const data: any = await response.json();
    console.log("🔍 Raw API Response:", data);

    const rawHotels = data.hotels || [];
   
    if (!rawHotels || rawHotels.length === 0) {
      console.log("❌ No hotels found in response.");
      setHotels([]);
      setLoading(false);
      return;
    }

    console.log(`📥 Received ${rawHotels.length} hotels from API`);
    console.log("🔍 First raw hotel:", rawHotels[0]);

    const hotelsMapped: Hotel[] = rawHotels.slice(0, HOTEL_LIMIT).map((h: any, index: number) => {
      // The API already returns transformed data with correct structure
      const hotel: Hotel = {
        hotel_id: h.hotel_id || "",
        hotel_name: h.hotel_name || "Unknown Hotel",
        address: h.address || "Address N/A",
        image: h.image || "https://via.placeholder.com/400x300?text=No+Image",
        price: h.price,
        currency: h.currency || "USD",
        review_score: h.review_score,
      };

      console.log(`✅ Hotel ${index + 1}: ${hotel.hotel_name}`);
      console.log(`   - Image: ${hotel.image}`);
      console.log(`   - Price: ${hotel.price} ${hotel.currency}`);

      return hotel;
    });

    console.log(`✅ Successfully mapped ${hotelsMapped.length} hotels`);
    console.log("🔍 First mapped hotel:", hotelsMapped[0]);
   
    setHotels(hotelsMapped);
  } catch (err: any) {
    console.error("❌ Fetch Error:", err);
    setError(`Unable to load hotels: ${err.message || "Please try again later."}`);
  } finally {
    setLoading(false);
  }
}, [location, checkIn, checkOut, adults, rooms]);

  const debouncedFetchHotels = useCallback(debounce(fetchHotels, 300), [fetchHotels]);

  useEffect(() => {
    if (location && checkIn && checkOut) debouncedFetchHotels();
    return () => debouncedFetchHotels.cancel();
  }, [debouncedFetchHotels, location, checkIn, checkOut, adults, rooms]);

  return (
    <>
      <TopNavBar />
      <main className="mt-12 py-6 bg-gray-100">
        <HotelGridLayout hotels={hotels} loading={loading} error={error} />
      </main>
      <Footer />
    </>
  );
}
