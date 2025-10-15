"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();

  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState("2");
  const [rooms, setRooms] = useState("1");

  const handleSearch = () => {
    if (!location || !checkIn || !checkOut) {
      alert("Please fill in location, check-in and check-out dates.");
      return;
    }

    const params = new URLSearchParams({
      location,
      checkIn,
      checkOut,
      adults,
      rooms,
    });

    // Navigate to /hotels/search with query params
    router.push(`/hotels/search?${params}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="p-2 rounded-md w-full sm:w-auto flex-1"
      />
      <input
        type="date"
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
        className="p-2 rounded-md"
      />
      <input
        type="date"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
        className="p-2 rounded-md"
      />
      <input
        type="number"
        min="1"
        value={adults}
        onChange={(e) => setAdults(e.target.value)}
        className="p-2 rounded-md w-20"
        placeholder="Adults"
      />
      <input
        type="number"
        min="1"
        value={rooms}
        onChange={(e) => setRooms(e.target.value)}
        className="p-2 rounded-md w-20"
        placeholder="Rooms"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
      >
        Search
      </button>
    </div>
  );
}
