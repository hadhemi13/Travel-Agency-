import axios from "axios";

/**
 * Get the Booking.com destination ID for a city/district/airport
 * @param {string} locationName
 * @returns {Promise<string>} dest_id
 */
export async function getDestinationId(locationName) {
  const url = `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination?query=${encodeURIComponent(locationName)}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "booking-com15.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      throw new Error(`Booking Locations API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("🌍 Destination API data:", data);

    if (!Array.isArray(data?.data) || data.data.length === 0) {
      throw new Error(`No destinations found for "${locationName}"`);
    }

    // Prefer district → city → first
    const location =
      data.data.find((l) => l.dest_type === "district") ||
      data.data.find((l) => l.dest_type === "city") ||
      data.data[0];

    console.log("✅ Selected destination for hotel search:", location);

    return location.dest_id;
  } catch (error) {
    console.error("❌ Error fetching destination:", error.message);
    throw error;
  }
}

/**
 * Search hotels via Booking.com API
 * @param {Object} params
 * @param {string} params.location - City name
 * @param {string} params.checkIn - YYYY-MM-DD
 * @param {string} params.checkOut - YYYY-MM-DD
 * @param {number} params.adults
 * @param {number} params.rooms
 * @returns {Promise<Array>} List of hotels
 */
export async function searchHotelsFromBooking({
  location,
  checkIn,
  checkOut,
  adults,
  rooms,
}) {
  console.log("🔹 searchHotelsFromBooking called with:", {
    location,
    checkIn,
    checkOut,
    adults,
    rooms,
  });

  try {
    // 1️⃣ Get destination info
    const destResponse = await axios.get(
      "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination",
      {
        params: { query: location },
        headers: {
          "x-rapidapi-host": "booking-com15.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        },
      }
    );

    const destinations = destResponse.data?.data || [];
    if (!destinations.length) throw new Error("No destination found");

    // Prefer city destination
    const destination =
      destinations.find((d) => d.dest_type === "city") || destinations[0];

    console.log("✅ Selected destination:", destination);

    // 2️⃣ Fetch hotels with correct parameter names
    const hotelResponse = await axios.get(
      "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels",
      {
        params: {
          dest_id: destination.dest_id,
          search_type: destination.search_type || "city",
          arrival_date: checkIn, // ✅ Correct param
          departure_date: checkOut, // ✅ Correct param
          adults: adults,
          room_qty: rooms,
          units: "metric",
          currency: "USD",
          locale: "en-gb",
          order_by: "popularity",
          categories_filter_ids: "class::2,class::3,class::4,class::5",
        },
        headers: {
          "x-rapidapi-host": "booking-com15.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        },
      }
    );

    console.log("🏨 Hotels API data:", hotelResponse.data);

    const hotels = hotelResponse.data?.data?.hotels || [];
    console.log(`✅ Hotels fetched: ${hotels.length}`);

    return hotels;
  } catch (err) {
    console.error("❌ Error fetching hotels:", err.response?.data || err.message);
    return [];
  }
}

/**
 * Get hotel details from Booking.com API
 * @param {Object} params
 * @param {string} params.hotelId
 * @param {string} params.checkIn
 * @param {string} params.checkOut
 * @param {number} params.adults
 * @param {number} params.rooms
 * @param {string} params.currency
 * @returns {Promise<Object>} Hotel details
 */
export async function getHotelDetails({
  hotelId,
  checkIn,
  checkOut,
  adults = 1,
  rooms = 1,
  currency = "USD",
}) {
  console.log("🔹 getHotelDetails called with:", {
    hotelId,
    checkIn,
    checkOut,
    adults,
    rooms,
    currency,
  });

  try {
    const response = await axios.get(
      "https://booking-com15.p.rapidapi.com/api/v1/hotels/getHotelDetails",
      {
        params: {
          hotel_id: hotelId,
          arrival_date: checkIn,
          departure_date: checkOut,
          adults,
          room_qty: rooms,
          units: "metric",
          temperature_unit: "c",
          languagecode: "en-us",
          currency_code: currency,
          children_age: "1,17",
        },
        headers: {
          "x-rapidapi-host": "booking-com15.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        },
      }
    );

    console.log("🏨 Full Hotel Details API raw response:", response.data);

    // Extra safety check
    if (!response.data.status) {
      console.error("❌ Hotel details API failed:", response.data);
      throw new Error(response.data.message || "Failed to fetch hotel details");
    }

    const hotelData = response.data.data;

    // ✅ Print all key info to help you know what to use in the UI
    console.log("🧾 Hotel basic info:");
    console.log(`• Name: ${hotelData.hotel_name}`);
    console.log(`• Address: ${hotelData.address}, ${hotelData.city}`);
    console.log(`• Country: ${hotelData.country_trans}`);
    console.log(`• Accommodation type: ${hotelData.accommodation_type_name}`);
    console.log(`• Price:`, hotelData?.product_price_breakdown?.gross_amount_hotel_currency);
    console.log(`• Family facilities:`, hotelData?.family_facilities);
    console.log(`• Facilities:`, hotelData?.facilities_block?.facilities);
    console.log(`• Sustainability:`, hotelData?.sustainability);
    console.log(`• Photos count: ${hotelData?.photos?.length || 0}`);
    console.log(`• First photo: ${hotelData?.photos?.[0]?.url_max750}`);
    console.log(`• Rooms:`, hotelData?.rooms);

    // Optional: to see all nested structure at once
    console.log("🧩 Full Parsed Data (Hotel):", JSON.stringify(hotelData, null, 2));

    return hotelData;
  } catch (err) {
    console.error("❌ Error fetching hotel details:", err.response?.data || err.message);
    throw err;
  }
}
