// src/app/api/hotels/filters/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const adults = searchParams.get('adults') || '2';
  const rooms = searchParams.get('rooms') || '1';

  if (!location || !checkIn || !checkOut) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    console.error('RAPIDAPI_KEY missing');
    return NextResponse.json({ filters: [] });
  }

  try {
    console.log('Fetching destination for:', location);

    // 1. Get destination ID
    const destRes = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination?query=${encodeURIComponent(location)}`,
      {
        headers: {
          'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
          'x-rapidapi-key': apiKey,
        },
      }
    );

    if (!destRes.ok) throw new Error(`Dest API ${destRes.status}`);
    const destData = await destRes.json();
    const dest = (destData.data || []).find(d => d.dest_type === 'city') || destData.data?.[0];
    if (!dest) return NextResponse.json({ filters: [] });

    console.log('Destination:', dest.dest_id, dest.label);

    // 2. Search hotels + FORCE FILTERS
    const searchParams = new URLSearchParams({
      dest_id: dest.dest_id,
      search_type: dest.search_type || 'city',
      arrival_date: checkIn,
      departure_date: checkOut,
      adults,
      room_qty: rooms,
      units: 'metric',
      currency: 'USD',
      locale: 'en-gb',
      order_by: 'popularity',
      page_number: '1',
      filter_by: 'all',
      include_filters: '1',
      filter_style: 'full',
    });

    const hotelRes = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels?${searchParams}`,
      {
        headers: {
          'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
          'x-rapidapi-key': apiKey,
        },
      }
    );

    if (!hotelRes.ok) {
      console.error('Hotels API failed:', hotelRes.status);
      return NextResponse.json({ filters: [] });
    }

    const hotelData = await hotelRes.json();
    if (!hotelData.status) return NextResponse.json({ filters: [] });

    const filters = hotelData.data?.filters || [];
    console.log(`Filters loaded: ${filters.length} groups`);

    filters.forEach((f, i) => {
      console.log(`Filter ${i}:`, f.title, f.field, f.filterStyle);
    });

    return NextResponse.json({ filters });

  } catch (error) {
    console.error('Filters error:', error.message);
    return NextResponse.json({ filters: [] });
  }
}