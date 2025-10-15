// src/app/api/hotels/search/route.js
import { NextResponse } from 'next/server';
import { getCachedSearch, setCachedSearch } from '@/lib/cache';
import { searchHotelsFromBooking } from '@/lib/booking-api';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const location = searchParams.get('location');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const adults = parseInt(searchParams.get('adults') || '2');
    const rooms = parseInt(searchParams.get('rooms') || '1');

    // Validation
    if (!location || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'Missing required parameters: location, checkIn, checkOut' },
        { status: 400 }
      );
    }

    const cacheParams = { location, checkIn, checkOut, adults, rooms };

    // 1. Check cache
    const cachedResults = await getCachedSearch(cacheParams);
    if (cachedResults) {
      console.log('Cache hit for search:', cacheParams);
      return NextResponse.json({
        hotels: cachedResults,
        source: 'cache',
        cached: true,
      });
    }

    console.log('Cache miss, calling Booking.com API...');
    console.log('searchHotelsFromBooking called with:', cacheParams);

    // 2. Call Booking.com API
    const rawHotels = await searchHotelsFromBooking(cacheParams);

    // 2a. Log full raw hotel objects for debugging
    console.log('Raw hotels from Booking API:', JSON.stringify(rawHotels, null, 2));

    // 3. Transform hotels to include only necessary fields + hotel_id for detail page
    // Assuming rawHotels is an array of hotel objects from Booking API
    // Each hotel has: hotel_id, property (with name, photoUrls, reviewScore, etc.), priceBreakdown, wishlistName (address)
    const hotels = rawHotels.map((h) => ({
      hotel_id: h.hotel_id?.toString() || null,  // Explicitly include hotel_id for routing
      hotel_name: h.property?.name || 'Unknown Hotel',
      address: h.property?.wishlistName || h.address?.full || 'Address N/A',  // Fallback to other address fields if needed
      image: h.property?.photoUrls?.[0] || 
             (h.property?.mainPhotoId 
               ? `https://cf.bstatic.com/xdata/images/hotel/max1024x768/${h.property.mainPhotoId}.jpg` 
               : 'https://via.placeholder.com/400x300?text=No+Image'),
      price: h.property?.priceBreakdown?.grossPrice?.value || 
             h.priceBreakdown?.grossPrice?.value || undefined,
      review_score: h.property?.reviewScore || undefined,
      // Add any other fields you might need later (e.g., raw: h for full data if caching full objects)
    })).filter((hotel) => hotel.hotel_id);  // Optional: Filter out hotels without ID

    // 4. Cache the transformed results (or cache raw and transform on fetch if preferred)
    await setCachedSearch(cacheParams, hotels);

    console.log(`Hotels fetched, transformed, and cached: ${hotels.length}`);

    return NextResponse.json({
      hotels,
      source: 'api',
      cached: false,
    });
  } catch (error) {
    console.error('Search error in route:', error);
    return NextResponse.json(
      { error: error.message || 'Search failed' },
      { status: 500 }
    );
  }
}