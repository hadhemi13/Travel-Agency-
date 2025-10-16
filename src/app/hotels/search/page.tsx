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
      console.log("Fetching hotels with params:", { location: correctedLocation, checkIn, checkOut, adults, rooms });
      const response = await fetch(`/api/hotels/search?${params}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} - ${await response.text()}`);
      }

      const data: any = await response.json();
      console.log("Raw API Response:", JSON.stringify(data, null, 2));  // Detailed logging of full response

      const rawHotels = data.hotels || data.result || data.data?.hotels || [];
      if (!rawHotels || rawHotels.length === 0) {
        console.log("No hotels found in response.");
        setHotels([]);
        setLoading(false);
        return;
      }

      const hotelsMapped: Hotel[] = rawHotels.slice(0, HOTEL_LIMIT).map((h: any, index: number) => {
        const property = h.property || h;
        const priceBreakdown = property.priceBreakdown || property.price_breakdown || {};
        const grossPrice = priceBreakdown.grossPrice || priceBreakdown.gross_price || {};

        // Enhanced image extraction with focus on photoUrls
        const imageUrl = property.photoUrls?.[0] || 
                        (property.mainPhotoId ? `https://cf.bstatic.com/xdata/images/hotel/max1024x768/${property.mainPhotoId}.jpg` : 
                        "https://via.placeholder.com/400x300?text=No+Image");
        
        const priceValue = grossPrice.value || grossPrice.amount || property.price || undefined;

        console.log(`Mapping hotel ${index + 1}: ${property.name || h.hotel_name} - imageUrl: ${imageUrl}, price: ${priceValue}`);

        return {
          hotel_id: (h.hotel_id || property.hotel_id || "").toString(),
          hotel_name: property.name || h.hotel_name || "Unknown Hotel",
          address: property.address || property.wishlistName || h.address || "Address N/A",
          image: imageUrl,
          price: priceValue,
          currency: grossPrice.currency || property.currency || "USD",
          review_score: property.reviewScore || h.review_score || undefined,
        };
      });

      console.log("Mapped Hotels for Grid:", JSON.stringify(hotelsMapped, null, 2));  // Detailed logging of mapped data
      setHotels(hotelsMapped);
    } catch (err: any) {
      console.error("Fetch Error:", err);
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