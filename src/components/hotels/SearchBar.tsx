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
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600 dark:text-[#b0b0b8]">Location</label>
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="p-2 rounded-md w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600 dark:text-[#b0b0b8]">Start date</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="p-2 rounded-md"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600 dark:text-[#b0b0b8]">End date</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="p-2 rounded-md"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600 dark:text-[#b0b0b8]">Adulte</label>
          <input
            type="number"
            min="1"
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
            className="p-2 rounded-md w-20"
            placeholder="Adults"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600 dark:text-[#b0b0b8]">Rooms</label>
          <input
            type="number"
            min="1"
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
            className="p-2 rounded-md w-20"
            placeholder="Rooms"
          />
        </div>

        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
        >
          Search
        </button>
      </div>
    );
  }
