import { NextResponse } from 'next/server';
import { getHotelDetails } from '@/lib/booking-api'; // Adjust path if needed

export async function GET( request ) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const adults = parseInt(searchParams.get('adults') || '1');
    const rooms = parseInt(searchParams.get('rooms') || '1');
    const currency = searchParams.get('currency') || 'USD';

    if (!hotelId || !checkIn || !checkOut) {
      return NextResponse.json({ error: 'Missing hotelId, checkIn, or checkOut' }, { status: 400 });
    }

    const data = await getHotelDetails({ hotelId, checkIn, checkOut, adults, rooms, currency });

    return NextResponse.json({ details: data });
  } catch (error) {
    console.error('Hotel details route error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch details' }, { status: 500 });
  }
}